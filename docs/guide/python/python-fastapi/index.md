# FastAPI + SQLAlchemy 2.0 + MySQL + Alembic + Redis 异步全栈开发实战教程

> **说明**：本教程从零开始，循序渐进，每章聚焦一个技术点，确保读者能“学得会、用得上、跑得通”。

------

## 第1章 起航：FastAPI 初体验

1.1 为什么选 FastAPI？—— 高性能、自动生成文档、类型安全
1.2 环境准备：Python 3.10+ 虚拟环境创建
1.3 安装 FastAPI 与 Uvicorn：`pip install fastapi uvicorn[standard]`
1.4 第一个 API：Hello World 与自动交互式文档（/docs）

------

## 第2章 项目结构规范化

2.1 推荐目录结构：app/core, app/api, app/schemas, app/main.py
2.2 配置管理：使用 Pydantic Settings 加载 .env 文件
2.3 启动脚本封装：统一入口 manage.py 或直接 uvicorn app.main:app
2.4 日志初始化：logging 配置基础格式

------

## 第3章 异步数据库连接（MySQL）

3.1 安装异步驱动：`pip install asyncmy`（推荐）或 `aiomysql`
3.2 创建异步引擎：`create_async_engine("mysql+asyncmy://...")`
3.3 声明式基类：SQLAlchemy 2.0 的 `DeclarativeBase` 与 `Mapped`
3.4 依赖注入：FastAPI 的 `Depends(get_db)` 提供会话

------

## 第4章 模型定义与关系（SQLAlchemy 2.0 语法）

4.1 单表模型：`mapped_column()` 定义主键、字符串、时间戳
4.2 外键关联：`ForeignKey` 与 `relationship(back_populates=...)`
4.3 索引与约束：在 `__table_args__` 中定义唯一索引
4.4 自动时间戳：`default=func.now()`, `onupdate=func.now()`

------

## 第5章 数据库迁移管理（Alembic）

5.1 初始化迁移工具：`alembic init alembic`
5.2 配置 `alembic.ini`：指向 MySQL URL
5.3 修改 `env.py`：支持异步引擎与模型导入
5.4 生成并执行迁移：`alembic revision --autogenerate -m "add users"` → `alembic upgrade head`

------

## 第6章 CRUD 操作与事务

6.1 查询：`select(User).where(User.email == email)`
6.2 插入：`session.add(user); await session.commit()`
6.3 更新与删除：`session.execute(update(...))`
6.4 事务上下文：`async with session.begin():` 保证原子性

------

## 第7章 请求与响应模型（Pydantic v2）

7.1 定义 Schema：`BaseModel` + 字段验证（email, min_length）
7.2 输入 vs 输出模型：CreateUserSchema vs UserResponse
7.3 响应封装：统一返回格式 `{"code": 200, "data": ...}`
7.4 错误处理：自定义异常 + 统一错误响应

------

## 第8章 Redis 集成：缓存与会话

8.1 安装与连接：`pip install redis` → `redis.asyncio.Redis(host=...)`
8.2 缓存装饰器：自动缓存函数返回值（带 TTL）
8.3 用户会话存储：登录后将 token 存入 Redis（支持单点登录）
8.4 缓存失效策略：更新数据时主动删除缓存

------

## 第9章 异步后台任务队列（基于 Redis List）

9.1 任务入队：API 中调用 `await redis.lpush("task_queue", json.dumps(task))`
9.2 独立 Worker：编写 `worker.py` 监听 `BLPOP`
9.3 任务处理：解析任务 → 执行业务逻辑（如发邮件、计算）
9.4 任务状态跟踪：使用 Redis Hash 记录进度（pending/running/done）

------

## 第10章 权限与认证

10.1 JWT 生成与验证：使用 `python-jose[cryptography]`
10.2 登录接口：验证密码 → 生成 token → 存入 Redis（可选）
10.3 依赖校验：`get_current_user(token: str = Depends(oauth2_scheme))`
10.4 权限中间件：检查用户角色（admin/user）

------

## 第11章 测试与调试

11.1 单元测试：`pytest` + `httpx.AsyncClient`
11.2 测试数据库：使用内存 SQLite 隔离测试
11.3 调试技巧：日志输出 SQL 语句、Redis 操作
11.4 性能分析：使用 `async-profiler` 或日志计时

------

## 第12章 部署上线

12.1 生产配置：DEBUG=False, SECRET_KEY 安全管理
12.2 Docker 化：多阶段构建镜像（包含 MySQL + Redis）
12.3 进程管理：Uvicorn + Gunicorn（多 worker）
12.4 Nginx 反向代理：静态文件 + HTTPS 配置

------

## 第13章 综合项目实战：用户通知中心

13.1 功能清单：注册 → 登录 → 发送通知（入队） → 查看通知列表
13.2 数据库设计：users 表 + notifications 表（含 status 字段）
13.3 后台 Worker：消费队列 → 调用 SMTP 发送邮件 → 更新状态
13.4 前端轮询：通过 API 获取最新通知（带 Redis 缓存）

------

> **教学理念**：不堆砌代码，不跳步骤。每一章都可独立运行，确保“学完就能用”。强调工程规范、错误处理与可维护性，拒绝“玩具级”示例。