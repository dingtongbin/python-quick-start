### 8.1 安装与连接：`pip install redis` → `redis.asyncio.Redis(host=...)`

在现代 Web 应用中，Redis 几乎成了“标配”——缓存、会话、队列，样样都离不开它。FastAPI 是异步框架，所以我们得用 Redis 的异步客户端。别担心，官方库 `redis` 从 v4.2 开始就原生支持 `asyncio` 了。

先装包：

```bash
pip install redis
```

注意：不是 `aioredis`！那个已经合并进官方 `redis` 包了。

接下来，在项目里建立 Redis 连接。我们通常把它放在 `app/core/redis.py` 里，方便复用。

下面这个表格总结了 Redis 异步客户端的核心实例方法：

| 功能名称   | 实例调用方法                                                 | 具体功能、注意事项、参数说明                                 |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 创建连接   | `redis.asyncio.Redis(host="localhost", port=6379, db=0, decode_responses=True)` | `decode_responses=True` 让返回值自动转成字符串（否则是 bytes），强烈建议开启；支持密码 `password=` 参数 |
| 测试连通性 | `await client.ping()`                                        | 返回 `True` 表示连接正常；可用于健康检查                     |
| 设置键值   | `await client.set("key", "value", ex=60)`                    | `ex=60` 表示 60 秒后过期（TTL）；值必须是字符串或可序列化对象（需先 json.dumps） |
| 获取键值   | `await client.get("key")`                                    | 不存在返回 `None`；记得判断空值                              |

来看一个完整的连接封装示例：

```python
# app/core/redis.py
from redis.asyncio import Redis
from app.core.config import settings  # 假设你已用 Pydantic 管理配置

# 创建全局 Redis 客户端实例
redis_client = Redis(
    host=settings.REDIS_HOST,       # 从 .env 读取，比如 "localhost"
    port=settings.REDIS_PORT,       # 默认 6379
    db=settings.REDIS_DB,           # 默认 0
    password=settings.REDIS_PASSWORD or None,  # 可选密码
    decode_responses=True,          # 自动解码响应为字符串
    socket_connect_timeout=5,       # 连接超时 5 秒
    retry_on_timeout=True           # 超时重试
)

# 使用示例函数（可选）
async def test_redis_connection():
    """
    测试 Redis 是否连通
    :return: bool - True 表示成功
    """
    try:
        pong = await redis_client.ping()  # 发送 PING 命令
        return pong is True               # 正常应返回 True
    except Exception as e:
        print(f"Redis 连接失败: {e}")     # 实际项目应记录日志
        return False
```

这段代码做了几件事：

- 用配置中心的值初始化 Redis 客户端，避免硬编码
- 开启 `decode_responses`，省去手动 `.decode()` 的麻烦
- 加了超时和重试，提升健壮性
- 提供了一个测试函数，方便启动时检查依赖

> 小贴士：生产环境务必设置密码，并通过 `.env` 管理，别把密码写死在代码里！

这节讲了如何在 FastAPI 项目中正确安装并初始化 Redis 异步客户端，这是后续所有缓存、会话、队列功能的基础。用对客户端，才能发挥异步性能优势。

### 8.2 缓存装饰器：自动缓存函数返回值（带 TTL）

缓存是提升 API 性能的“神器”。想象一下，某个接口要查数据库、算复杂逻辑，耗时 500ms。如果结果 10 分钟内不会变，那第一次查完存进 Redis，后面 99 次请求直接拿缓存，岂不美哉？

我们可以写个装饰器，自动完成“查缓存 → 没有就执行函数 → 存缓存”这套流程。

先看核心方法表格：

| 功能名称 | 实例调用方法                                 | 具体功能、注意事项、参数说明                          |
| -------- | -------------------------------------------- | ----------------------------------------------------- |
| 获取缓存 | `await client.get(cache_key)`                | 缓存键建议包含函数名和参数哈希，避免冲突              |
| 设置缓存 | `await client.set(cache_key, value, ex=ttl)` | `ttl` 单位是秒；值需是字符串，所以要用 `json.dumps()` |
| 删除缓存 | `await client.delete(cache_key)`             | 更新数据后主动清除旧缓存，防止脏读                    |

下面是一个通用的异步缓存装饰器实现：

```python
# app/core/cache.py
import json
import functools
from typing import Any, Callable, Awaitable
from app.core.redis import redis_client  # 导入上一节创建的客户端

def async_cache(ttl: int = 60):
    """
    异步函数缓存装饰器
    :param ttl: 缓存过期时间（秒）
    :return: 装饰后的函数
    """
    def decorator(func: Callable[..., Awaitable[Any]]):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            # 生成唯一缓存键：函数名 + 参数哈希
            cache_key = f"cache:{func.__name__}:{hash(str(args) + str(sorted(kwargs.items())))}"
            
            # 尝试从 Redis 获取缓存
            cached_result = await redis_client.get(cache_key)
            if cached_result is not None:
                # 缓存命中，直接返回（需反序列化）
                return json.loads(cached_result)
            
            # 缓存未命中，执行原函数
            result = await func(*args, **kwargs)
            
            # 将结果序列化后存入 Redis（带 TTL）
            try:
                await redis_client.set(cache_key, json.dumps(result), ex=ttl)
            except TypeError:
                # 如果结果不可 JSON 序列化（比如含 datetime），跳过缓存
                pass
            
            return result
        return wrapper
    return decorator
```

使用起来超级简单：

```python
# app/api/v1/user.py
from app.core.cache import async_cache

@async_cache(ttl=300)  # 缓存 5 分钟
async def get_user_profile(user_id: int):
    """
    模拟耗时操作：查数据库获取用户资料
    """
    # 这里应该是真实的数据库查询
    return {"user_id": user_id, "name": "张三", "email": "zhangsan@example.com"}

# 在路由中调用
@app.get("/user/{user_id}")
async def read_user(user_id: int):
    profile = await get_user_profile(user_id)
    return profile
```

注意几个细节：

- 缓存键用 `hash()` 保证参数不同键不同，但要注意 `hash()` 在不同 Python 进程可能不同（生产环境可用 `xxhash` 或 `md5` 替代）
- 用 `json.dumps/loads` 处理序列化，所以函数返回值必须是 JSON 兼容类型（dict, list, str, int 等）
- 捕获 `TypeError` 防止因不可序列化导致整个接口崩溃

这节我们实现了一个通用的异步缓存装饰器，能自动缓存任何异步函数的返回结果。合理使用它，可以让高频读接口性能提升一个数量级。

### 8.3 用户会话存储：登录后将 token 存入 Redis（支持单点登录）

JWT 虽好，但有个痛点：无法主动让 token 失效（除非等它自然过期）。这时候，Redis 就派上用场了——我们可以把有效 token 存进 Redis，验证时先查 Redis，不在就拒绝。

更妙的是，这还能实现“单点登录”：同一账号新登录时，旧 token 自动失效。

先看关键操作表格：

| 功能名称   | 实例调用方法                                                 | 具体功能、注意事项、参数说明                  |
| ---------- | ------------------------------------------------------------ | --------------------------------------------- |
| 存储 token | `await client.set(f"user_token:{user_id}", token, ex=expire_seconds)` | 键设计为 `user_token:{user_id}`，方便按用户查 |
| 验证 token | `stored_token = await client.get(f"user_token:{user_id}")`   | 比对传入 token 和存储的是否一致               |
| 强制下线   | `await client.delete(f"user_token:{user_id}")`               | 注销或新登录时删除旧 token                    |

下面是登录和验证的完整实现：

```python
# app/core/security.py
import secrets
from datetime import timedelta
from jose import jwt
from app.core.config import settings
from app.core.redis import redis_client

def create_access_token(user_id: int, expires_delta: timedelta) -> str:
    """生成 JWT token"""
    expire = datetime.utcnow() + expires_delta
    to_encode = {"sub": str(user_id), "exp": expire}
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

async def store_token_in_redis(user_id: int, token: str, expire_seconds: int):
    """
    将 token 存入 Redis，实现单点登录
    :param user_id: 用户 ID
    :param token: JWT 字符串
    :param expire_seconds: 过期时间（秒）
    """
    # 存储时，旧 token 自动被覆盖（因为键相同）
    await redis_client.set(
        f"user_token:{user_id}",
        token,
        ex=expire_seconds
    )

async def verify_token_in_redis(user_id: int, token: str) -> bool:
    """
    验证 token 是否有效（存在于 Redis 中）
    :return: bool - True 表示有效
    """
    stored_token = await redis_client.get(f"user_token:{user_id}")
    return stored_token == token  # 必须完全匹配
```

在登录接口中使用：

```python
# app/api/v1/auth.py
from fastapi import APIRouter, Depends, HTTPException
from app.core.security import create_access_token, store_token_in_redis
from app.core.config import settings

router = APIRouter()

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # 1. 验证用户名密码（此处省略）
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="用户名或密码错误")
    
    # 2. 生成 token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(user.id, access_token_expires)
    
    # 3. 存入 Redis（关键！实现单点登录）
    await store_token_in_redis(
        user_id=user.id,
        token=token,
        expire_seconds=int(access_token_expires.total_seconds())
    )
    
    return {"access_token": token, "token_type": "bearer"}
```

在认证依赖中验证：

```python
# app/core/deps.py
from fastapi import Depends, HTTPException, status
from jose import jwt, JWTError
from app.core.security import verify_token_in_redis
from app.core.config import settings

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """获取当前用户，同时验证 Redis 中的 token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="无效 token")
    except JWTError:
        raise HTTPException(status_code=401, detail="token 解析失败")
    
    # 关键：检查 Redis 中是否存在该 token
    if not await verify_token_in_redis(int(user_id), token):
        raise HTTPException(status_code=401, detail="token 已失效或被顶号")
    
    # 返回用户对象（此处省略数据库查询）
    return await get_user_by_id(int(user_id))
```

这样，当用户在新设备登录时，旧设备的 token 会自动失效（因为 Redis 里的值被新 token 覆盖了），完美实现单点登录。

这节利用 Redis 存储用户 token，解决了 JWT 无法主动失效的问题，同时实现了单点登录功能，大大提升了系统安全性。

### 8.4 缓存失效策略：更新数据时主动删除缓存

缓存最怕什么？脏数据！比如用户改了昵称，但缓存里还是旧的，那体验就崩了。

解决办法就一个：**数据变更时，主动删除相关缓存**。这叫“Cache-Aside”模式，简单粗暴但有效。

关键操作如下表：

| 功能名称     | 实例调用方法                                                 | 具体功能、注意事项、参数说明                         |
| ------------ | ------------------------------------------------------------ | ---------------------------------------------------- |
| 删除单个缓存 | `await client.delete("cache:user_profile:123")`              | 精确删除指定键                                       |
| 批量删除     | `await client.delete(*keys)`                                 | 支持多个键；注意不要一次删太多                       |
| 模糊删除     | `keys = await client.keys("cache:user_profile:*"); await client.delete(*keys)` | 慎用！`KEYS` 命令会阻塞 Redis，生产环境建议用 `SCAN` |

假设我们有个更新用户资料的接口，需要清除之前的缓存：

```python
# app/api/v1/user.py
from app.core.cache import async_cache  # 假设缓存键格式已知

# 先定义缓存键生成函数（与装饰器里一致）
def get_user_profile_cache_key(user_id: int) -> str:
    return f"cache:get_user_profile:{hash(str((user_id,)) + str({}))}"

@router.put("/user/{user_id}")
async def update_user_profile(
    user_id: int,
    update_data: UserUpdateSchema,
    db: AsyncSession = Depends(get_db)
):
    """更新用户资料并清除缓存"""
    # 1. 更新数据库
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    
    for field, value in update_data.dict(exclude_unset=True).items():
        setattr(user, field, value)
    
    await db.commit()
    
    # 2. 关键：删除缓存！
    cache_key = get_user_profile_cache_key(user_id)
    deleted_count = await redis_client.delete(cache_key)
    print(f"已删除缓存键 {cache_key}，影响 {deleted_count} 个键")
    
    return {"message": "更新成功"}
```

如果是更复杂的场景，比如清空某个用户的**所有**缓存（比如注销时），可以用前缀匹配：

```python
async def clear_all_user_cache(user_id: int):
    """清空某用户的所有缓存（谨慎使用）"""
    # 使用 SCAN 避免阻塞（比 KEYS 安全）
    cursor = 0
    keys_to_delete = []
    while True:
        cursor, keys = await redis_client.scan(
            cursor=cursor,
            match=f"cache:*:{user_id}:*",
            count=100  # 每次扫描 100 个
        )
        keys_to_delete.extend(keys)
        if cursor == 0:
            break
    
    if keys_to_delete:
        await redis_client.delete(*keys_to_delete)
        print(f"已批量删除 {len(keys_to_delete)} 个用户缓存键")
```

> 注意：`SCAN` 虽然安全，但不能保证原子性。如果缓存键非常多，可能需要分批次删除，避免长时间占用连接。

这节强调了缓存失效的重要性，并给出了精确删除和批量删除两种策略。记住：**缓存不是数据库的副本，而是临时加速器**，数据一致性永远靠数据库保证。