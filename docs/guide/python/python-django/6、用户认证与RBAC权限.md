# 第6章：用户认证与 RBAC 权限

本章学习 Django 的用户认证系统、自定义用户模型和基于角色的访问控制（RBAC）。

---

## 6.1 Django 认证系统

### 用户模型

```python
from django.contrib.auth.models import User

# 创建用户
user = User.objects.create_user(
    username='john',
    email='john@example.com',
    password='password123'
)

# 创建超级用户
admin = User.objects.create_superuser(
    username='admin',
    email='admin@example.com',
    password='admin123'
)

# 验证用户
from django.contrib.auth import authenticate

user = authenticate(username='john', password='password123')
if user is not None:
    print("验证成功")
else:
    print("验证失败")
```

### 登录注销

```python
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('index')
    else:
        form = AuthenticationForm()
    
    return render(request, 'login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('index')
```

### 模板中的用户信息

```html
{% if user.is_authenticated %}
    <p>欢迎, {{ user.username }}</p>
    <a href="{% url 'logout' %}">退出</a>
{% else %}
    <a href="{% url 'login' %}">登录</a>
{% endif %}
```

---

## 6.2 自定义用户模型

### AbstractUser

```python
# models.py
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True)
    bio = models.TextField(blank=True)
    
    class Meta:
        db_table = 'custom_user'
```

配置：

```python
# settings.py
AUTH_USER_MODEL = 'accounts.CustomUser'
```

### AbstractBaseUser（完全自定义）

```python
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
```

---

## 6.3 权限系统

### 内置权限

```python
# 检查权限
user.has_perm('blog.add_post')
user.has_perm('blog.change_post')
user.has_perm('blog.delete_post')
user.has_perm('blog.view_post')

# 装饰器
from django.contrib.auth.decorators import permission_required

@permission_required('blog.add_post')
def create_post(request):
    pass

# 类视图
from django.contrib.auth.mixins import PermissionRequiredMixin

class PostCreateView(PermissionRequiredMixin, CreateView):
    permission_required = 'blog.add_post'
```

### 自定义权限

```python
class Post(models.Model):
    class Meta:
        permissions = [
            ("publish_post", "Can publish post"),
            ("feature_post", "Can feature post"),
        ]
```

---

## 6.4 RBAC 实现

### 角色模型

```python
# models.py
from django.db import models

class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    permissions = models.ManyToManyField(
        'auth.Permission',
        blank=True
    )
    
    def __str__(self):
        return self.name

class UserRole(models.Model):
    user = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'role')
```

### 权限检查

```python
# utils.py

def has_role(user, role_name):
    """检查用户是否有指定角色"""
    return UserRole.objects.filter(
        user=user,
        role__name=role_name
    ).exists()

def has_permission(user, permission_codename):
    """检查用户是否有指定权限"""
    # 检查直接权限
    if user.has_perm(f'blog.{permission_codename}'):
        return True
    
    # 检查角色权限
    user_roles = UserRole.objects.filter(user=user).values_list('role', flat=True)
    from django.contrib.auth.models import Permission
    
    return Permission.objects.filter(
        codename=permission_codename,
        role__in=user_roles
    ).exists()
```

### 装饰器

```python
from functools import wraps
from django.http import HttpResponseForbidden

def role_required(role_name):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return HttpResponseForbidden("需要登录")
            
            if not has_role(request.user, role_name):
                return HttpResponseForbidden(f"需要 {role_name} 角色")
            
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator

# 使用
@role_required('admin')
def admin_panel(request):
    pass
```

---

## 6.5 JWT 认证（DRF）

### 安装

```bash
pip install djangorestframework-simplejwt==5.3.1
```

### 配置

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
}
```

### URL 配置

```python
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
]
```

### 使用

```python
import requests

# 获取 token
response = requests.post(
    'http://localhost:8000/api/token/',
    json={'username': 'admin', 'password': 'admin123'}
)

tokens = response.json()
access_token = tokens['access']
refresh_token = tokens['refresh']

# 使用 token
headers = {'Authorization': f'Bearer {access_token}'}
response = requests.get(
    'http://localhost:8000/api/posts/',
    headers=headers
)
```

---

## 6.6 本章小结

✅ **认证系统** - 登录、注销、验证
✅ **自定义用户** - AbstractUser、AbstractBaseUser
✅ **权限系统** - 内置权限、自定义权限
✅ **RBAC** - 角色、权限检查
✅ **JWT 认证** - SimpleJWT 配置

---

**下一章：** [第7章 - DRF 核心概念 →](./7、DRF核心概念.md)
