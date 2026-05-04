### 4.1 单表模型：`mapped_column()` 定义主键、字符串、时间戳

在 SQLAlchemy 2.0 中，推荐使用 `mapped_column()` 来定义模型字段，它比旧版的 `Column()` 更加类型安全，并且与 Pydantic 的兼容性更好。我们以一个简单的用户表为例，展示如何定义主键、字符串字段和时间戳。

| 功能名称   | 实例调用方法                                                 | 具体功能、注意事项、必需参数/可选参数                    |
| ---------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| 定义主键   | `id: Mapped[int] = mapped_column(primary_key=True)`          | 自动递增整数主键，`primary_key=True` 是必需参数          |
| 定义字符串 | `name: Mapped[str] = mapped_column(String(50))`              | 字符串类型，`String(50)` 表示最大长度为 50，必需指定长度 |
| 定义时间戳 | `created_at: Mapped[datetime] = mapped_column(default=func.now())` | 默认值为当前时间，`func.now()` 是 SQLAlchemy 的函数      |

```python
# app/models/user.py
from sqlalchemy import String, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from datetime import datetime

# 声明式基类
class Base(DeclarativeBase):
    pass

# 用户模型
class User(Base):
    __tablename__ = "users"
    
    # 主键定义
    id: Mapped[int] = mapped_column(primary_key=True)
    
    # 用户名，最大长度 50
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    
    # 邮箱，最大长度 100
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    
    # 创建时间，默认为当前时间
    created_at: Mapped[datetime] = mapped_column(default=func.now())
    
    # 更新时间，每次更新记录时自动更新
    updated_at: Mapped[datetime] = mapped_column(default=func.now(), onupdate=func.now())
```

这段代码展示了如何使用 SQLAlchemy 2.0 的新语法定义一个用户模型。每个字段都使用 `Mapped[类型]` 来声明类型，并通过 `mapped_column()` 来配置数据库列的属性。注意 `created_at` 和 `updated_at` 的区别：前者只在插入时设置，后者在每次更新时都会刷新。

### 4.2 外键关联：`ForeignKey` 与 `relationship(back_populates=...)`

当需要建立表之间的关系时，SQLAlchemy 提供了 `ForeignKey` 和 `relationship` 来实现。假设我们有一个文章表，每篇文章属于一个用户，我们需要建立一对多的关系。

| 功能名称 | 实例调用方法                                                 | 具体功能、注意事项、必需参数/可选参数                   |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------- |
| 定义外键 | `user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))` | 指向 users 表的 id 列，必需指定完整的表名和列名         |
| 定义关系 | `author: Mapped["User"] = relationship(back_populates="articles")` | 建立双向关系，`back_populates` 必须与另一端的属性名一致 |

```python
# app/models/article.py
from sqlalchemy import ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from .user import User

class Article(Base):
    __tablename__ = "articles"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    
    # 文章标题
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    
    # 文章内容
    content: Mapped[str] = mapped_column(Text, nullable=False)
    
    # 外键关联到用户表
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    
    # 创建时间
    created_at: Mapped[datetime] = mapped_column(default=func.now())
    
    # 关系定义：指向 User 模型
    author: Mapped["User"] = relationship(back_populates="articles")

# 在 User 模型中添加反向关系
# app/models/user.py (补充)
from typing import List
from sqlalchemy.orm import relationship

class User(Base):
    # ... 其他字段保持不变 ...
    
    # 反向关系：一个用户可以有多篇文章
    articles: Mapped[List["Article"]] = relationship(back_populates="author")
```

这里的关键是 `back_populates` 参数，它确保了双向关系的一致性。当你访问 `article.author` 时，会得到对应的用户对象；当你访问 `user.articles` 时，会得到该用户的所有文章列表。这种设计让数据查询更加直观和高效。

### 4.3 索引与约束：在 `__table_args__` 中定义唯一索引

为了提高查询性能和保证数据完整性，我们经常需要在数据库表上创建索引和约束。SQLAlchemy 允许我们在模型中通过 `__table_args__` 属性来定义这些。

| 功能名称 | 实例调用方法                                         | 具体功能、注意事项、必需参数/可选参数 |
| -------- | ---------------------------------------------------- | ------------------------------------- |
| 唯一索引 | `__table_args__ = (UniqueConstraint("email"),)`      | 确保 email 字段的唯一性，防止重复注册 |
| 普通索引 | `Index("idx_username", "username")`                  | 加速基于 username 的查询              |
| 复合索引 | `Index("idx_user_created", "user_id", "created_at")` | 加速复合条件查询                      |

```python
# app/models/user.py (更新版本)
from sqlalchemy import String, func, Index, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from datetime import datetime

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=func.now())
    updated_at: Mapped[datetime] = mapped_column(default=func.now(), onupdate=func.now())
    
    # 定义表级约束和索引
    __table_args__ = (
        # 唯一约束：确保邮箱不重复
        UniqueConstraint("email", name="uq_user_email"),
        # 普通索引：加速用户名查询
        Index("idx_user_username", "username"),
        # 复合索引：加速按用户和时间查询
        Index("idx_user_created", "id", "created_at"),
    )
```

通过 `__table_args__`，我们可以一次性定义多个约束和索引。这不仅提高了代码的可读性，还确保了数据库结构的一致性。在实际项目中，合理的索引设计可以显著提升查询性能。

### 4.4 自动时间戳：`default=func.now()`, `onupdate=func.now()`

自动管理时间戳是大多数应用的基本需求。SQLAlchemy 提供了简单而强大的机制来处理创建时间和更新时间。

| 功能名称   | 实例调用方法                                                 | 具体功能、注意事项、必需参数/可选参数          |
| ---------- | ------------------------------------------------------------ | ---------------------------------------------- |
| 创建时间戳 | `created_at: Mapped[datetime] = mapped_column(default=func.now())` | 插入记录时自动设置为当前时间                   |
| 更新时间戳 | `updated_at: Mapped[datetime] = mapped_column(default=func.now(), onupdate=func.now())` | 每次更新记录时自动刷新为当前时间               |
| 服务器时间 | `func.now()`                                                 | 使用数据库服务器的时间，而不是应用服务器的时间 |

```python
# app/models/base.py
from sqlalchemy import func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from datetime import datetime

class TimestampMixin:
    """时间戳混入类，可被其他模型继承"""
    
    created_at: Mapped[datetime] = mapped_column(
        default=func.now(),
        comment="记录创建时间"
    )
    
    updated_at: Mapped[datetime] = mapped_column(
        default=func.now(),
        onupdate=func.now(),
        comment="记录最后更新时间"
    )

class Base(DeclarativeBase):
    pass

# 使用混入类的用户模型
# app/models/user.py
from .base import Base, TimestampMixin

class User(Base, TimestampMixin):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    
    # 不需要再手动定义 created_at 和 updated_at
    # 它们已经从 TimestampMixin 继承了
```

使用混入类（Mixin）的方式可以让多个模型共享相同的时间戳逻辑，避免重复代码。这种方式特别适合大型项目，其中很多表都需要类似的自动时间戳功能。注意 `func.now()` 使用的是数据库服务器的时间，这样可以避免应用服务器和数据库服务器时间不同步的问题。