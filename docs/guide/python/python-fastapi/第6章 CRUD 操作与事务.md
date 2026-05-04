### 6.1 查询：`select(User).where(User.email == email)`

在 SQLAlchemy 2.0 中，查询语句采用了全新的风格，更贴近原生 SQL 的表达方式。核心是使用 `select()` 构造查询对象，再通过 `.where()` 添加过滤条件。这种方式不仅清晰直观，还天然支持异步操作。

| 功能名称     | 实例调用方法                                                 | 具体功能、注意事项、必需参数/可选参数                        |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 基础查询     | `select(User).where(User.email == "test@example.com")`       | 查询指定邮箱的用户。`select()` 是必需的入口，`where()` 接收布尔表达式作为过滤条件。 |
| 多条件查询   | `select(User).where(User.is_active == True, User.role == "admin")` | 多个条件默认为 AND 关系。也可以使用 `and_()`, `or_()` 显式组合。 |
| 获取单个结果 | `result.scalar_one_or_none()`                                | 执行查询后，使用此方法获取唯一结果。如果没有或有多个结果，会抛出异常或返回 None。 |

下面是一个完整的查询示例，包含了错误处理和注释说明：

```python
# 导入必要的模块
from sqlalchemy import select  # 用于构建查询语句
from sqlalchemy.ext.asyncio import AsyncSession  # 异步数据库会话
from fastapi import Depends, HTTPException, status  # FastAPI 依赖和异常处理
from app.models import User  # 用户模型
from app.database import get_db  # 数据库依赖，返回 AsyncSession

# 定义一个 API 路由，根据邮箱查询用户
async def get_user_by_email(email: str, db: AsyncSession = Depends(get_db)):
    """
    根据邮箱查询用户。
    
    Args:
        email (str): 要查询的用户邮箱。
        db (AsyncSession): 由 FastAPI 依赖注入的异步数据库会话。
    
    Returns:
        User: 查询到的用户对象。
    
    Raises:
        HTTPException: 如果用户不存在，抛出 404 错误。
    """
    try:
        # 构建查询语句：select * from users where email = ?
        query = select(User).where(User.email == email)
        # 执行查询并获取结果
        result = await db.execute(query)
        # 尝试获取唯一结果，如果不存在则返回 None
        user = result.scalar_one_or_none()
        # 如果用户不存在，抛出 404 异常
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user
    except Exception as e:
        # 捕获所有其他异常，并向上抛出，让全局异常处理器处理
        raise e
```

这个小节讲了如何在 SQLAlchemy 2.0 中使用 `select()` 和 `where()` 进行基础查询，并通过 `scalar_one_or_none()` 安全地获取单个结果。这是 CRUD 操作中最常用的功能之一，为后续的更新和删除操作奠定了基础。

### 6.2 插入：`session.add(user); await session.commit()`

插入新数据是任何应用的基本操作。在 SQLAlchemy 2.0 的异步世界里，你需要先创建一个模型实例，然后通过会话（session）的 `add()` 方法将其加入“待持久化”队列，最后调用 `commit()` 提交事务，将数据真正写入数据库。

| 功能名称     | 实例调用方法                      | 具体功能、注意事项、必需参数/可选参数                        |
| ------------ | --------------------------------- | ------------------------------------------------------------ |
| 添加单个对象 | `session.add(user_obj)`           | 将一个模型实例标记为“待插入”。此时数据并未写入数据库。       |
| 提交事务     | `await session.commit()`          | **必需**。将所有待处理的操作（增删改）提交到数据库。这是一个异步操作。 |
| 刷新对象     | `await session.refresh(user_obj)` | 可选。从数据库重新加载对象，以获取自增 ID 等数据库生成的值。 |

下面是一个完整的用户注册（插入）示例：

```python
# 导入必要的模块
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends, HTTPException, status
from app.models import User
from app.schemas import CreateUserSchema  # Pydantic 输入模型
from app.database import get_db
from app.core.security import get_password_hash  # 密码哈希工具

# 定义一个 API 路由，用于创建新用户
async def create_user(
    user_data: CreateUserSchema, 
    db: AsyncSession = Depends(get_db)
):
    """
    创建一个新用户。
    
    Args:
        user_data (CreateUserSchema): 包含用户信息的 Pydantic 模型。
        db (AsyncSession): 异步数据库会话。
    
    Returns:
        User: 创建成功的用户对象，包含数据库分配的 ID。
    
    Raises:
        HTTPException: 如果邮箱已存在，抛出 400 错误。
    """
    try:
        # 先检查邮箱是否已存在，避免重复注册
        existing_user = await db.execute(
            select(User).where(User.email == user_data.email)
        )
        if existing_user.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # 创建新的 User 模型实例，并对密码进行哈希处理
        new_user = User(
            email=user_data.email,
            hashed_password=get_password_hash(user_data.password)
        )
        # 将新用户对象添加到会话中
        db.add(new_user)
        # 提交事务，将数据写入数据库
        await db.commit()
        # 刷新对象，从数据库获取最新的数据（如自增的 id）
        await db.refresh(new_user)
        return new_user
    except HTTPException:
        # 重新抛出已知的 HTTP 异常
        raise
    except Exception as e:
        # 发生未知错误时，回滚事务并抛出服务器错误
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        ) from e
```

这个小节讲解了如何通过 `session.add()` 和 `await session.commit()` 完成数据插入操作，并强调了在插入前进行唯一性校验以及在异常时回滚事务的重要性。这是保证数据完整性的关键步骤。

### 6.3 更新与删除：`session.execute(update(...))`

更新和删除操作可以通过两种主要方式实现：一种是先查询出对象，修改其属性后再提交；另一种是直接使用 `update()` 或 `delete()` 语句进行批量操作。后者通常更高效，尤其是在处理大量数据时。

| 功能名称   | 实例调用方法                                           | 具体功能、注意事项、必需参数/可选参数                        |
| ---------- | ------------------------------------------------------ | ------------------------------------------------------------ |
| 批量更新   | `session.execute(update(User).where(...).values(...))` | 直接生成 UPDATE SQL 语句，效率高。`values()` 指定要更新的字段。 |
| 批量删除   | `session.execute(delete(User).where(...))`             | 直接生成 DELETE SQL 语句。务必谨慎使用，确保 `where` 条件正确。 |
| 对象级更新 | `user.name = "new name"; await session.commit()`       | 先查询出对象，修改属性，再提交。适合需要业务逻辑校验的场景。 |

以下是一个使用 `update()` 语句进行批量更新的示例：

```python
# 导入必要的模块
from sqlalchemy import update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends, HTTPException, status
from app.models import User
from app.database import get_db

# 定义一个 API 路由，用于更新用户状态
async def deactivate_user(user_id: int, db: AsyncSession = Depends(get_db)):
    """
    根据用户ID将其状态设为非活跃。
    
    Args:
        user_id (int): 要停用的用户ID。
        db (AsyncSession): 异步数据库会话。
    
    Returns:
        dict: 操作结果，包含是否成功。
    
    Raises:
        HTTPException: 如果用户不存在，抛出 404 错误。
    """
    try:
        # 构建更新语句：UPDATE users SET is_active=false WHERE id=?
        stmt = update(User).where(User.id == user_id).values(is_active=False)
        # 执行更新
        result = await db.execute(stmt)
        # 检查是否有行被更新
        if result.rowcount == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        # 提交事务
        await db.commit()
        return {"success": True, "message": "User deactivated"}
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to deactivate user"
        ) from e

# 定义一个 API 路由，用于删除用户（软删除示例）
async def soft_delete_user(user_id: int, db: AsyncSession = Depends(get_db)):
    """
    软删除用户，即标记为已删除而非物理删除。
    """
    try:
        stmt = update(User).where(User.id == user_id).values(is_deleted=True)
        result = await db.execute(stmt)
        if result.rowcount == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        await db.commit()
        return {"success": True}
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete user"
        ) from e
```

这个小节介绍了使用 `update()` 和 `delete()` 进行高效批量操作的方法，并通过 `rowcount` 属性来判断操作是否影响了任何行，从而进行相应的错误处理。这种方式比先查询再修改更加简洁高效。

### 6.4 事务上下文：`async with session.begin():` 保证原子性

在复杂的业务逻辑中，往往需要将多个数据库操作捆绑在一起，要么全部成功，要么全部失败，这就是事务的原子性。SQLAlchemy 提供了 `session.begin()` 上下文管理器，可以自动处理事务的提交和回滚，让代码更加简洁和安全。

| 功能名称     | 实例调用方法                                          | 具体功能、注意事项、必需参数/可选参数                        |
| ------------ | ----------------------------------------------------- | ------------------------------------------------------------ |
| 自动事务管理 | `async with session.begin(): ...`                     | 在 `with` 块内执行的所有操作都在一个事务中。如果块内无异常，自动提交；如有异常，自动回滚。 |
| 嵌套事务     | 支持嵌套使用 `begin()`                                | 内层事务的回滚不会影响外层，但提交需等待最外层提交。         |
| 手动控制     | `await session.commit()` / `await session.rollback()` | 在非 `begin()` 上下文中，需要手动控制事务。                  |

下面是一个转账操作的示例，它完美地展示了事务的重要性：

```python
# 导入必要的模块
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends, HTTPException, status
from app.models import Account  # 假设有一个账户模型
from app.database import get_db

# 定义一个 API 路由，用于执行转账
async def transfer_money(
    from_account_id: int, 
    to_account_id: int, 
    amount: float,
    db: AsyncSession = Depends(get_db)
):
    """
    从一个账户向另一个账户转账。
    
    Args:
        from_account_id (int): 转出账户ID。
        to_account_id (int): 转入账户ID。
        amount (float): 转账金额。
        db (AsyncSession): 异步数据库会话。
    
    Returns:
        dict: 转账结果。
    
    Raises:
        HTTPException: 各种业务错误，如余额不足、账户不存在等。
    """
    # 使用 async with session.begin() 开启一个事务上下文
    async with db.begin():  # 从此处开始，所有操作都在一个事务中
        try:
            # 查询转出账户
            from_acc = await db.get(Account, from_account_id)
            if not from_acc:
                raise HTTPException(status_code=404, detail="From account not found")
            if from_acc.balance < amount:
                raise HTTPException(status_code=400, detail="Insufficient balance")

            # 查询转入账户
            to_acc = await db.get(Account, to_account_id)
            if not to_acc:
                raise HTTPException(status_code=404, detail="To account not found")

            # 执行转账逻辑
            from_acc.balance -= amount
            to_acc.balance += amount

            # 注意：在这里我们不需要显式调用 commit() 或 rollback()
            # 如果函数正常执行完毕，事务会自动提交
            # 如果中间任何一步抛出异常，事务会自动回滚
            
            return {
                "success": True, 
                "message": f"Transferred {amount} from {from_account_id} to {to_account_id}"
            }
            
        except HTTPException:
            # 即使在这里抛出 HTTPException，由于在 begin() 上下文中，
            # 事务也会被自动回滚，保证数据一致性。
            raise
        # 不需要捕获通用 Exception，因为 begin() 会处理回滚
```

这个小节讲解了如何使用 `async with session.begin():` 上下文管理器来简化事务处理，确保多个数据库操作的原子性。无论是在简单的 CRUD 还是复杂的业务流程中，这都是保证数据一致性的基石。