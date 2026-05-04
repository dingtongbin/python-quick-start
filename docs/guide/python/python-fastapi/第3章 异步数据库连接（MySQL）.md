### 3.1 安装异步驱动：`pip install asyncmy`（推荐）或 `aiomysql`

在 FastAPI 异步世界里，数据库驱动也得“跟上节奏”。传统同步驱动（比如 PyMySQL）会阻塞事件循环，拖慢整个服务。所以我们要用 **异步 MySQL 驱动**。

目前主流有两个选择：

- **`asyncmy`**：基于纯 Python 实现，性能好、兼容性强，官方推荐用于 SQLAlchemy 2.0 + asyncio。
- **`aiomysql`**：老牌异步驱动，但依赖 PyMySQL，有时会有兼容性小坑。

咱们选 **`asyncmy`**，干净利落！

安装命令很简单：

```bash
pip install asyncmy
```

> 注意：不要装 `mysqlclient` 或 `PyMySQL`，它们是同步的，在异步上下文中会“卡住”你的 API。

这一节讲了为什么在异步 FastAPI 项目中必须使用异步数据库驱动，并推荐了 `asyncmy` 作为首选方案，确保 I/O 操作不阻塞事件循环。

------

### 3.2 创建异步引擎：`create_async_engine("mysql+asyncmy://...")`

有了驱动，下一步就是创建数据库连接引擎。SQLAlchemy 2.0 提供了专门的异步引擎创建函数：`create_async_engine`。

它返回一个异步引擎对象，后续所有数据库操作都通过它派生出的会话（session）进行。

下面看代码怎么写：

```python
# app/core/database.py

from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.pool import NullPool
import os

# 从环境变量读取数据库 URL（安全且灵活）
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+asyncmy://root:password@localhost:3306/mydb")

# 创建异步引擎
# 注意：echo=True 仅用于开发调试，生产环境务必关闭！
engine = create_async_engine(
    DATABASE_URL,
    echo=False,          # 是否打印 SQL 语句到控制台
    poolclass=NullPool,  # 在测试或简单场景可禁用连接池；生产建议用默认池
)
```

关键点说明：

- URL 格式必须是 `mysql+asyncmy://...`，告诉 SQLAlchemy 使用 asyncmy 驱动。
- `echo=True` 会在终端打印每条执行的 SQL，方便调试，但上线一定要关掉。
- `NullPool` 表示不用连接池（每次请求新建连接），适合测试；生产环境可去掉 `poolclass` 参数，使用默认的 `AsyncAdaptedQueuePool`。

这一节展示了如何使用 `create_async_engine` 创建异步数据库引擎，并强调了 URL 格式和调试选项的重要性，为后续会话管理打下基础。

------

### 3.3 声明式基类：SQLAlchemy 2.0 的 `DeclarativeBase` 与 `Mapped`

SQLAlchemy 2.0 全面拥抱类型提示（Type Hints），模型定义方式更清晰、更安全。我们不再用老式的 `Base = declarative_base()`，而是继承 `DeclarativeBase`。

同时，字段类型用 `Mapped[T]` 显式声明，配合 `mapped_column()` 定义列属性。

先看基类怎么定义：

```python
# app/models/base.py

from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from typing import Any

class Base(DeclarativeBase):
    """所有模型的基类"""
    # 可在此统一添加通用方法或配置
    pass
```

然后定义一个用户模型示例：

```python
# app/models/user.py

from app.models.base import Base
from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    username: Mapped[str] = mapped_column(String(64), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),  # 插入时自动设为当前时间
    )
```

这里每一行都带类型注解，IDE 能智能提示，mypy 也能检查类型错误，开发体验飞起！

这一节介绍了 SQLAlchemy 2.0 中基于 `DeclarativeBase` 和 `Mapped` 的新式模型定义方式，提升了代码的可读性与类型安全性。

------

### 3.4 依赖注入：FastAPI 的 `Depends(get_db)` 提供会话

在 FastAPI 中，我们通过 **依赖注入（Dependency Injection）** 来管理数据库会话（session）。这样每个请求都能获得独立的会话，并在请求结束时自动关闭，避免连接泄漏。

实现方式是写一个生成器函数 `get_db`，用 `async_sessionmaker` 创建会话，并用 `yield` 返回。

代码如下：

```python
# app/core/database.py （续）

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from contextlib import asynccontextmanager

# 创建异步会话工厂
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,  # 提交后不自动过期对象，避免重复查询
)

@asynccontextmanager
async def get_db_session():
    """上下文管理器：提供数据库会话"""
    session = AsyncSessionLocal()
    try:
        yield session
    except Exception as e:
        await session.rollback()  # 出错回滚
        raise e
    finally:
        await session.close()     # 确保关闭

# FastAPI 依赖函数
async def get_db():
    """供 Depends 使用的依赖"""
    async with get_db_session() as session:
        yield session
```

然后在路由中使用：

```python
# app/api/v1/users.py

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db

router = APIRouter()

@router.get("/users/me")
async def read_current_user(db: AsyncSession = Depends(get_db)):
    # 这里就可以用 db 执行查询了
    result = await db.execute(select(User).where(User.id == 1))
    user = result.scalar_one_or_none()
    return user
```

| 功能名称       | 实例调用方法                         | 具体功能、注意事项                                      |
| -------------- | ------------------------------------ | ------------------------------------------------------- |
| 获取数据库会话 | `db: AsyncSession = Depends(get_db)` | 自动管理会话生命周期，支持事务回滚，必须用 `async` 依赖 |
| 手动管理会话   | `async with get_db_session() as db:` | 适用于后台任务或非请求上下文（如 Worker）               |

**注意事项**：

- 所有数据库操作必须加 `await`，因为是异步的！
- 不要手动调用 `session.commit()` 或 `session.close()`，交给依赖注入处理。
- 如果在事务中出错，`get_db_session` 会自动回滚，防止脏数据。

这一节通过依赖注入实现了安全、自动化的异步数据库会话管理，确保每个请求隔离且资源及时释放，是构建健壮 API 的关键一环。