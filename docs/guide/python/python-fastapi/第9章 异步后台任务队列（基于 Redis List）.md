### 9.1 任务入队：API 中调用 `await redis.lpush("task_queue", json.dumps(task))`

在异步 Web 应用中，有些操作（比如发邮件、生成报表、处理图片）耗时较长，如果直接在请求中同步执行，会阻塞响应，用户体验极差。这时候我们就需要“后台任务队列”——把任务先存起来，让另一个进程慢慢处理。

FastAPI 虽然自带 `BackgroundTasks`，但它只适合轻量级、非关键任务（比如记录日志）。对于**可靠、可重试、可监控**的任务，我们得自己搭一个基于 Redis 的队列系统。

核心思路很简单：  

- **生产者**（你的 API）把任务序列化后推入 Redis List（比如叫 `task_queue`）  
- **消费者**（独立的 Worker 进程）从 List 里取任务并执行

先看怎么在 API 里“入队”：

```python
# app/api/tasks.py
from fastapi import APIRouter, Depends, HTTPException
from app.core.redis import get_redis  # 假设你已封装好 Redis 连接
import json
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/send-notification")
async def send_notification(
    email: str,
    message: str,
    redis = Depends(get_redis)  # 注入 Redis 客户端
):
    """
    发送通知的 API，实际不发送，只把任务入队
    """
    try:
        # 1. 构造任务字典（必须能被 JSON 序列化）
        task = {
            "type": "email",
            "to": email,
            "subject": "系统通知",
            "body": message,
            "retry_count": 0
        }
        
        # 2. 序列化为 JSON 字符串
        task_json = json.dumps(task, ensure_ascii=False)
        
        # 3. 推入 Redis List 左侧（LPUSH）
        await redis.lpush("task_queue", task_json)
        
        # 4. 记录日志
        logger.info(f"任务已入队: {task['to']}")
        
        # 5. 立即返回成功，不等任务执行
        return {"code": 200, "msg": "通知已提交，请稍后查收"}
        
    except Exception as e:
        logger.error(f"任务入队失败: {str(e)}")
        raise HTTPException(status_code=500, detail="任务提交失败")
```

> 注意：这里用的是 `lpush`，Worker 会用 `brpop` 从右侧取，形成 FIFO 队列。

这一小节讲了如何在 FastAPI 接口中将耗时任务以 JSON 形式推入 Redis List，实现请求与任务执行的解耦，提升 API 响应速度。

### 9.2 独立 Worker：编写 `worker.py` 监听 `BLPOP`

光有生产者不行，还得有消费者。我们写一个独立的 `worker.py`，它不处理 HTTP 请求，只专心监听 Redis 队列。

这个 Worker 通常在后台常驻运行（比如用 `nohup python worker.py &` 或 systemd 管理）。

关键点是使用 **`BLPOP`** —— 带阻塞的列表弹出。如果队列空了，它会一直等，直到有新任务进来，避免轮询浪费 CPU。

```python
# worker.py
import asyncio
import json
import logging
import signal
from app.core.redis import get_redis_instance  # 获取全局 Redis 实例
from app.services.email_service import send_email  # 假设你有发邮件的服务

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("worker")

# 全局标志，用于优雅退出
shutdown_event = asyncio.Event()

def handle_shutdown(signum, frame):
    """捕获 SIGINT/SIGTERM，设置退出标志"""
    logger.info("收到退出信号，准备停止...")
    shutdown_event.set()

async def process_task(task_data: str):
    """处理单个任务"""
    try:
        task = json.loads(task_data)
        task_type = task.get("type")
        
        if task_type == "email":
            # 调用发邮件服务
            await send_email(
                to=task["to"],
                subject=task["subject"],
                body=task["body"]
            )
            logger.info(f"邮件已发送: {task['to']}")
        else:
            logger.warning(f"未知任务类型: {task_type}")
            
    except Exception as e:
        logger.error(f"任务处理失败: {e}")
        # 这里可以加重试逻辑或死信队列

async def main():
    """主循环：监听队列并处理任务"""
    redis = await get_redis_instance()
    logger.info("Worker 启动，监听 task_queue...")
    
    while not shutdown_event.is_set():
        try:
            # 阻塞等待任务，超时 1 秒（便于检查 shutdown_event）
            result = await redis.blpop("task_queue", timeout=1)
            
            if result is not None:
                # result 是 (queue_name, task_json) 元组
                _, task_json = result
                await process_task(task_json)
            # 如果 result 是 None（超时），继续循环检查退出信号
                
        except Exception as e:
            logger.error(f"Worker 异常: {e}")
            await asyncio.sleep(1)  # 避免疯狂报错
            
    logger.info("Worker 已停止")

if __name__ == "__main__":
    # 注册信号处理器
    signal.signal(signal.SIGINT, handle_shutdown)
    signal.signal(signal.SIGTERM, handle_shutdown)
    
    asyncio.run(main())
```

这个 Worker 能稳定运行，支持优雅退出，并且隔离了任务处理逻辑，保证主 API 不受影响。

这一节展示了如何编写一个独立的异步 Worker 进程，通过 `BLPOP` 阻塞监听 Redis 队列，实现任务的可靠消费和处理。

### 9.3 任务处理：解析任务 → 执行业务逻辑（如发邮件、计算）

任务入队和监听都搞定了，现在重点是如何**安全、可靠地执行任务**。

任务处理的核心原则：

- **幂等性**：任务可能被重复执行（比如 Worker 崩溃重启），所以操作要能重复而不产生副作用。
- **错误隔离**：一个任务失败不能影响其他任务。
- **上下文清晰**：日志要能追踪到具体任务。

假设我们要发邮件，但 SMTP 可能临时失败，那就得加**重试机制**。

```python
# app/services/email_service.py
import asyncio
import aiosmtplib
from email.mime.text import MIMEText
from app.core.config import settings  # 从配置读取 SMTP 信息

MAX_RETRY = 3
RETRY_DELAY = 5  # 秒

async def send_email_with_retry(to: str, subject: str, body: str, retry_count: int = 0):
    """带重试的邮件发送"""
    try:
        msg = MIMEText(body, "plain", "utf-8")
        msg["Subject"] = subject
        msg["From"] = settings.SMTP_USER
        msg["To"] = to
        
        await aiosmtplib.send(
            msg,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            start_tls=True
        )
        return True
        
    except Exception as e:
        if retry_count < MAX_RETRY:
            logger.warning(f"邮件发送失败（第{retry_count+1}次），{RETRY_DELAY}秒后重试: {e}")
            await asyncio.sleep(RETRY_DELAY)
            # 重新入队，增加重试计数
            new_task = {
                "type": "email",
                "to": to,
                "subject": subject,
                "body": body,
                "retry_count": retry_count + 1
            }
            redis = await get_redis_instance()
            await redis.lpush("task_queue", json.dumps(new_task))
        else:
            logger.error(f"邮件发送彻底失败（超过{MAX_RETRY}次）: {to} - {e}")
        return False
```

然后在 `process_task` 中调用它：

```python
# 修改 worker.py 中的 process_task
async def process_task(task_data: str):
    try:
        task = json.loads(task_data)
        if task["type"] == "email":
            success = await send_email_with_retry(
                to=task["to"],
                subject=task["subject"],
                body=task["body"],
                retry_count=task.get("retry_count", 0)
            )
            if success:
                # 可选：记录成功状态到数据库
                pass
    except Exception as e:
        logger.exception("任务解析失败")
```

这样，即使网络抖动，任务也能自动重试，提高成功率。

这一节强调了任务处理中的健壮性设计，包括重试机制、错误隔离和幂等性考虑，确保后台任务可靠执行。

### 9.4 任务状态跟踪：使用 Redis Hash 记录进度（pending/running/done）

用户可能会问：“我提交的任务处理完了吗？” 这就需要**任务状态跟踪**。

简单做法：每个任务生成唯一 ID，在 Redis 中用 Hash 存储状态。

| 功能名称     | 实例调用方法                                                 | 具体功能、注意事项          |
| ------------ | ------------------------------------------------------------ | --------------------------- |
| 生成任务ID   | `str(uuid.uuid4())`                                          | 唯一标识任务，建议用 UUID   |
| 初始化状态   | `await redis.hset(f"task:{task_id}", "status", "pending")`   | 创建 Hash，初始状态 pending |
| 更新为运行中 | `await redis.hset(f"task:{task_id}", mapping={"status": "running", "start_time": now})` | 记录开始时间                |
| 更新为完成   | `await redis.hset(f"task:{task_id}", mapping={"status": "done", "end_time": now, "result": "..."})` | 可存结果或错误信息          |
| 查询状态     | `await redis.hgetall(f"task:{task_id}")`                     | 返回整个状态字典            |

示例：在 API 中创建任务并初始化状态

```python
# app/api/tasks.py（修改版）
import uuid

@router.post("/send-notification")
async def send_notification(email: str, message: str, redis = Depends(get_redis)):
    task_id = str(uuid.uuid4())
    
    task = {
        "id": task_id,
        "type": "email",
        "to": email,
        "subject": "系统通知",
        "body": message
    }
    
    # 1. 初始化任务状态
    await redis.hset(f"task:{task_id}", "status", "pending")
    
    # 2. 入队（带上 task_id）
    await redis.lpush("task_queue", json.dumps(task))
    
    return {"code": 200, "task_id": task_id, "msg": "任务已提交"}
```

Worker 处理时更新状态：

```python
# worker.py（修改 process_task）
async def process_task(task_data: str):
    task = json.loads(task_data)
    task_id = task.get("id")
    redis = await get_redis_instance()
    
    if task_id:
        # 标记为 running
        await redis.hset(f"task:{task_id}", "status", "running")
    
    try:
        # ... 执行任务 ...
        if task["type"] == "email":
            success = await send_email(...)
            if success:
                await redis.hset(f"task:{task_id}", mapping={
                    "status": "done",
                    "result": "邮件发送成功"
                })
            else:
                await redis.hset(f"task:{task_id}", mapping={
                    "status": "failed",
                    "error": "发送失败"
                })
    except Exception as e:
        if task_id:
            await redis.hset(f"task:{task_id}", mapping={
                "status": "failed",
                "error": str(e)
            })
```

再提供一个查询接口：

```python
@router.get("/task/{task_id}")
async def get_task_status(task_id: str, redis = Depends(get_redis)):
    status = await redis.hgetall(f"task:{task_id}")
    if not status:
        raise HTTPException(status_code=404, detail="任务不存在")
    return {"code": 200, "data": status}
```

这样一来，前端就能轮询任务状态，实现“提交 → 等待 → 查看结果”的完整体验。

这一节通过 Redis Hash 实现了任务状态的精细化管理，让用户能实时了解后台任务的执行进度，提升产品可用性。