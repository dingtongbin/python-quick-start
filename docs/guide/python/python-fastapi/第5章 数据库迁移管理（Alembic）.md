### 5.1 初始化迁移工具：`alembic init alembic`

在数据库开发中，随着业务迭代，表结构会不断变化。这时候就需要一个强大的迁移工具来帮我们管理这些变更。Alembic 就是 SQLAlchemy 官方推荐的数据库迁移工具，它能自动追踪模型变化并生成迁移脚本。

首先，我们需要初始化 Alembic：

```bash
# 在项目根目录执行
alembic init alembic
```

这个命令会在项目根目录下创建一个 `alembic` 文件夹，里面包含 Alembic 的核心配置文件。

**关键文件说明：**

- `alembic.ini`：主配置文件，包含数据库连接 URL 等设置
- `alembic/env.py`：环境配置文件，控制迁移时的行为
- `alembic/versions/`：存放所有迁移脚本的目录

这节主要介绍了如何初始化 Alembic 迁移工具，为后续的数据库版本管理打下基础。

### 5.2 配置 `alembic.ini`：指向 MySQL URL

初始化完成后，我们需要配置数据库连接。打开 `alembic.ini` 文件，找到 `sqlalchemy.url` 这一行：

```ini
# alembic.ini
# 修改前（默认是 sqlite）
sqlalchemy.url = driver://user:pass@localhost/dbname

# 修改后（MySQL 异步连接）
sqlalchemy.url = mysql+asyncmy://root:password@localhost:3306/fastapi_db
```

不过，在实际项目中，我们通常不会把敏感信息直接写在配置文件里。更好的做法是在 `env.py` 中动态加载配置。

这里需要注意的是，虽然我们在 `alembic.ini` 中配置了同步的 MySQL 连接字符串，但在异步项目中，我们会在 `env.py` 中覆盖这个配置，使用真正的异步引擎。

这节讲解了如何配置 Alembic 的数据库连接，确保迁移工具能够正确连接到我们的 MySQL 数据库。

### 5.3 修改 `env.py`：支持异步引擎与模型导入

这是异步项目中最关键的一步！默认的 `env.py` 是为同步 SQLAlchemy 设计的，我们需要修改它来支持异步操作。

```python
# alembic/env.py
import asyncio
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine
from alembic import context
from app.core.config import settings  # 假设我们有配置模块
from app.models import Base  # 导入我们的模型基类

# 解析 alembic.ini 配置
config = context.config

# 设置日志
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# 获取目标元数据
target_metadata = Base.metadata

def run_migrations_offline():
    """离线模式运行迁移 - 不支持异步"""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    
    with context.begin_transaction():
        context.run_migrations()

def do_run_migrations(connection):
    """执行迁移的核心函数"""
    context.configure(
        connection=connection, 
        target_metadata=target_metadata
    )
    
    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online():
    """在线模式运行迁移 - 支持异步"""
    # 创建异步引擎
    connectable = create_async_engine(
        settings.DATABASE_URL,  # 从配置中获取异步URL
        poolclass=pool.NullPool,
    )
    
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    
    await connectable.dispose()

# 根据是否离线选择执行模式
if context.is_offline_mode():
    run_migrations_offline()
else:
    # 异步执行在线迁移
    asyncio.run(run_migrations_online())
```

**关键点说明：**

1. 导入了 `AsyncEngine` 和 `create_async_engine`
2. 从项目的配置模块获取数据库 URL
3. 导入了我们的模型 `Base`，这样 Alembic 才知道要追踪哪些表
4. 使用 `asyncio.run()` 来执行异步迁移函数

这节详细讲解了如何修改 `env.py` 文件来支持异步数据库引擎和模型导入，这是 FastAPI + SQLAlchemy 2.0 异步项目成功集成 Alembic 的关键步骤。

### 5.4 生成并执行迁移：`alembic revision --autogenerate -m "add users"` → `alembic upgrade head`

现在万事俱备，让我们来体验完整的迁移流程！

**实例方法表格**

| 功能名称     | 实例调用方法                                    | 具体功能、注意事项、必需参数/可选参数                        |
| ------------ | ----------------------------------------------- | ------------------------------------------------------------ |
| 生成迁移脚本 | `alembic revision --autogenerate -m "描述信息"` | 自动对比模型和数据库差异，生成迁移脚本。必需参数：-m 消息描述 |
| 执行迁移     | `alembic upgrade head`                          | 将数据库升级到最新版本。head 表示最新版本                    |
| 查看迁移历史 | `alembic history`                               | 显示所有迁移脚本的历史记录                                   |
| 回滚迁移     | `alembic downgrade -1`                          | 回滚到上一个版本，-1 表示回退一步                            |

**完整迁移示例**

假设我们已经定义了一个 User 模型，现在要创建对应的数据库表：

```python
# app/models/user.py
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, Integer

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    username: Mapped[str] = mapped_column(String(50))
```

现在执行迁移：

```bash
# 1. 生成迁移脚本
alembic revision --autogreate -m "create users table"

# 注意：第一次运行可能会提示找不到模型，确保 env.py 正确导入了模型

# 2. 查看生成的脚本（在 alembic/versions/ 目录下）
# 文件名类似：a1b2c3d4e5f6_create_users_table.py

# 3. 执行迁移
alembic upgrade head

# 4. 验证数据库是否创建成功
# 可以通过 MySQL 客户端查看表结构
```

**生成的迁移脚本示例：**

```python
# alembic/versions/a1b2c3d4e5f6_create_users_table.py
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=True),
        sa.Column('username', sa.String(length=50), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

def downgrade():
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
```

**错误处理注意事项：**

- 如果模型导入失败，检查 `env.py` 中的路径是否正确
- 如果数据库连接失败，确认 MySQL 服务是否运行，连接参数是否正确
- 第一次迁移时，确保数据库已经创建（但表不需要存在）

这节演示了完整的数据库迁移流程，从生成迁移脚本到执行迁移，让我们的数据库结构能够跟随代码模型的变化而自动更新。