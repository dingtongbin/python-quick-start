### 7.1 定义 Schema：`BaseModel` + 字段验证（email, min_length）

在 FastAPI 中，Pydantic 是处理请求和响应数据的核心工具。它不仅能自动验证传入的数据是否符合预期格式，还能生成漂亮的 API 文档。Pydantic v2 相比 v1 性能更好、功能更强，是我们首选的版本。

我们先来看一个最简单的用户注册表单 Schema：```python

# schemas/user.py

from pydantic import BaseModel, EmailStr, Field
from typing import Optional

# 定义用户创建的请求模型

class CreateUserSchema(BaseModel):
    \# 使用 EmailStr 自动验证邮箱格式，不用自己写正则
    email: EmailStr
    \# 密码至少6位，最多20位，且必填
    password: str = Field(..., min_length=6, max_length=20)
    \# 用户名可选，如果提供则至少2个字符
    username: Optional[str] = Field(None, min_length=2, max_length=30)

# 示例：如何使用这个模型

# 如果传入 {"email": "not-an-email", "password": "123"}

# Pydantic 会自动抛出 ValidationError，FastAPI 会返回 422 错误

```
这节我们学会了用 Pydantic v2 的 `BaseModel` 来定义数据结构，并通过 `EmailStr` 和 `Field` 的 `min_length` 等参数实现自动验证。这样不仅能减少手动校验的代码，还能让 API 更健壮、文档更清晰。

### 7.2 输入 vs 输出模型：CreateUserSchema vs UserResponse

在实际开发中，**输入模型**（接收前端数据）和**输出模型**（返回给前端的数据）往往是不同的。比如，我们不会把用户的密码返回给前端，但注册时又需要接收密码。

这种分离设计有三大好处：
1. **安全**：敏感字段（如密码哈希）不会意外泄露
2. **灵活**：可以为不同接口定制不同的返回结构
3. **清晰**：代码职责分明，维护起来不头疼

下面看一个典型对比：

| 功能名称 | 实例调用方法 | 具体功能、注意事项、必需参数/可选参数 |
|--------|------------|-----------------------------------|
| 用户创建输入模型 | `CreateUserSchema(email="a@b.com", password="123456")` | 接收原始密码，用于注册，包含敏感字段 |
| 用户信息输出模型 | `UserResponse(id=1, email="a@b.com", created_at=...)` | 不包含密码，只返回安全字段，通常用于登录后返回或查询 |

```python
# schemas/user.py（续）
from datetime import datetime

# 输出模型：绝不包含密码！
class UserResponse(BaseModel):
    id: int
    email: EmailStr
    username: Optional[str] = None
    # 自动序列化 datetime 为 ISO 格式字符串
    created_at: datetime
    updated_at: datetime

    class Config:
        # Pydantic v2 中推荐使用 model_config
        from_attributes = True  # 允许从 SQLAlchemy 模型直接转换
```

注意 `from_attributes = True` 这个配置，它让 Pydantic 能直接从数据库 ORM 对象（如 SQLAlchemy 的 User 实例）提取属性，省去了手动赋值的麻烦。

这节讲清楚了为什么要把输入和输出模型分开，并展示了如何用 `from_attributes = True` 简化 ORM 对象到响应模型的转换。这样做既安全又高效，是工程实践中的最佳选择。

### 7.3 响应封装：统一返回格式 `{"code": 200, "data": ...}`

前后端分离项目中，**统一的响应格式**能极大提升开发体验。想象一下，如果每个接口返回的结构都不一样，前端同学怕是要“裂开”。所以我们约定所有成功响应都长这样：

```json
{
  "code": 200,
  "message": "success",
  "data": { /* 实际业务数据 */ }
}
```

失败时则是：

```json
{
  "code": 400,
  "message": "邮箱已存在",
  "data": null
}
```

为了实现这一点，我们可以定义一个通用响应模型：

```python
# schemas/common.py
from pydantic import BaseModel
from typing import Any, Optional

class StandardResponse(BaseModel):
    code: int = 200
    message: str = "success"
    data: Optional[Any] = None

    # 快速构造成功响应
    @classmethod
    def success(cls, data: Any = None, message: str = "success"):
        return cls(code=200, message=message, data=data)
    
    # 快速构造失败响应
    @classmethod
    def error(cls, code: int, message: str):
        return cls(code=code, message=message, data=None)
```

然后在 API 中使用：

```python
# api/users.py
from fastapi import APIRouter, status
from schemas.user import CreateUserSchema, UserResponse
from schemas.common import StandardResponse

router = APIRouter()

@router.post("/register", response_model=StandardResponse[UserResponse])
async def register_user(user_in: CreateUserSchema):
    try:
        # 假设这里完成了用户创建逻辑，得到 user_db 对象
        user_db = await create_user_in_db(user_in)  # 伪代码
        # 直接返回封装好的响应
        return StandardResponse.success(UserResponse.model_validate(user_db))
    except Exception as e:
        # 实际项目中应捕获具体异常
        return StandardResponse.error(400, str(e))
```

注意 `response_model=StandardResponse[UserResponse]` 这里用了泛型，明确告诉 FastAPI 返回的 `data` 字段是 `UserResponse` 类型，Swagger 文档会自动生成正确结构。

这节我们通过 `StandardResponse` 实现了全局统一的返回格式，前端再也不用猜接口结构了。同时利用 Pydantic 泛型，保证了文档的准确性，一举两得。

### 7.4 错误处理：自定义异常 + 统一错误响应

光有成功响应还不够，**错误处理**同样重要。FastAPI 默认会返回 422（验证错误）或 500（服务器错误），但这些错误信息对前端不够友好。我们需要：

1. 定义自己的业务异常
2. 注册全局异常处理器
3. 返回统一格式的错误响应（和 7.3 节的 `StandardResponse` 保持一致）

先定义自定义异常：

```python
# core/exceptions.py
from fastapi import HTTPException

class UserAlreadyExistsError(HTTPException):
    def __init__(self, detail: str = "用户已存在"):
        super().__init__(status_code=400, detail=detail)

class InvalidCredentialsError(HTTPException):
    def __init__(self, detail: str = "邮箱或密码错误"):
        super().__init__(status_code=401, detail=detail)
```

再注册全局处理器：

```python
# main.py 或 app/core/handlers.py
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from core.exceptions import UserAlreadyExistsError, InvalidCredentialsError
from schemas.common import StandardResponse

app = FastAPI()

@app.exception_handler(UserAlreadyExistsError)
async def user_exists_exception_handler(request: Request, exc: UserAlreadyExistsError):
    # 返回统一格式的错误响应
    return JSONResponse(
        status_code=exc.status_code,
        content=StandardResponse.error(exc.status_code, exc.detail).model_dump()
    )

@app.exception_handler(InvalidCredentialsError)
async def invalid_creds_handler(request: Request, exc: InvalidCredentialsError):
    return JSONResponse(
        status_code=exc.status_code,
        content=StandardResponse.error(exc.status_code, exc.detail).model_dump()
    )

# 也可以加一个兜底的全局异常处理器
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content=StandardResponse.error(500, "服务器内部错误").model_dump()
    )
```

现在，只要在业务逻辑中抛出 `UserAlreadyExistsError`，就会自动转换成标准错误响应：

```python
# 在用户注册逻辑中
if await user_exists(email=user_in.email):
    raise UserAlreadyExistsError("该邮箱已被注册")
```

这节通过自定义异常和全局处理器，把杂乱的错误信息统一成了前端友好的格式。配合 7.3 节的 `StandardResponse`，整个项目的响应体系就完整了——无论成功失败，结构都清晰一致。