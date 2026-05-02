# 第4章：视图、URL 与中间件

本章深入学习 Django 的视图系统、URL 路由配置和中间件机制。

---

## 4.1 视图函数（Function-Based Views）

### 基本视图

```python
# views.py
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404, redirect
from .models import Post

def index(request):
    """首页视图"""
    return HttpResponse("Hello, Django!")

def post_list(request):
    """文章列表"""
    posts = Post.objects.filter(status='published')
    return render(request, 'blog/post_list.html', {'posts': posts})

def post_detail(request, pk):
    """文章详情"""
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'blog/post_detail.html', {'post': post})
```

### URL 配置

```python
# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('posts/', views.post_list, name='post-list'),
    path('posts/<int:pk>/', views.post_detail, name='post-detail'),
]
```

### 处理请求方法

```python
from django.views.decorators.http import require_http_methods

@require_http_methods(["GET", "POST"])
def create_post(request):
    if request.method == 'POST':
        # 处理 POST
        title = request.POST.get('title')
        content = request.POST.get('content')
        
        Post.objects.create(
            title=title,
            content=content,
            author=request.user
        )
        
        return redirect('post-list')
    
    # 处理 GET
    return render(request, 'blog/create_post.html')
```

---

## 4.2 类视图（Class-Based Views）

### TemplateView

```python
from django.views.generic import TemplateView

class AboutView(TemplateView):
    template_name = 'about.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['team_members'] = ['Alice', 'Bob', 'Charlie']
        return context
```

### ListView

```python
from django.views.generic import ListView

class PostListView(ListView):
    model = Post
    template_name = 'blog/post_list.html'
    context_object_name = 'posts'
    paginate_by = 10
    
    def get_queryset(self):
        return Post.objects.filter(
            status='published'
        ).order_by('-published_at')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.all()
        return context
```

### DetailView

```python
from django.views.generic import DetailView

class PostDetailView(DetailView):
    model = Post
    template_name = 'blog/post_detail.html'
    context_object_name = 'post'
    
    def get_object(self, queryset=None):
        obj = super().get_object(queryset)
        # 增加阅读量
        obj.views += 1
        obj.save(update_fields=['views'])
        return obj
```

### CreateView / UpdateView / DeleteView

```python
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin

class PostCreateView(LoginRequiredMixin, CreateView):
    model = Post
    fields = ['title', 'content', 'category', 'tags']
    template_name = 'blog/post_form.html'
    
    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

class PostUpdateView(LoginRequiredMixin, UpdateView):
    model = Post
    fields = ['title', 'content', 'category', 'tags']
    template_name = 'blog/post_form.html'

class PostDeleteView(LoginRequiredMixin, DeleteView):
    model = Post
    template_name = 'blog/post_confirm_delete.html'
    success_url = '/posts/'
```

---

## 4.3 URL 高级配置

### 命名空间

```python
# project/urls.py
from django.urls import path, include

urlpatterns = [
    path('blog/', include('blog.urls', namespace='blog')),
    path('api/', include('api.urls', namespace='api')),
]

# blog/urls.py
app_name = 'blog'

urlpatterns = [
    path('', views.PostListView.as_view(), name='post-list'),
    path('<int:pk>/', views.PostDetailView.as_view(), name='post-detail'),
]

# 模板中使用
{% url 'blog:post-list' %}
{% url 'blog:post-detail' pk=post.pk %}
```

### 正则表达式

```python
from django.urls import re_path

urlpatterns = [
    re_path(r'^articles/(?P<year>[0-9]{4})/$', views.year_archive),
    re_path(r'^articles/(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/$', 
            views.month_archive),
]
```

### 动态路由

```python
from django.urls import path

urlpatterns = [
    path('category/<slug:slug>/', views.category_detail),
    path('tag/<str:name>/', views.tag_detail),
    path('author/<uuid:id>/', views.author_detail),
]
```

---

## 4.4 中间件（Middleware）

### 什么是中间件？

中间件是 Django 请求/响应处理的钩子框架，可以全局修改请求或响应。

### 内置中间件

```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

### 自定义中间件

#### 方式 1：函数式

```python
# middleware.py

def simple_middleware(get_response):
    def middleware(request):
        # 请求前处理
        print(f"Request: {request.path}")
        
        response = get_response(request)
        
        # 响应后处理
        print(f"Response: {response.status_code}")
        
        return response
    
    return middleware
```

#### 方式 2：类式

```python
class CustomMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # 请求前
        request.custom_attr = 'custom value'
        
        response = self.get_response(request)
        
        # 响应后
        response['X-Custom-Header'] = 'value'
        
        return response
    
    def process_view(self, request, view_func, view_args, view_kwargs):
        """在视图执行前调用"""
        print(f"View: {view_func.__name__}")
        return None  # 返回 None 继续处理，返回 HttpResponse 则中断
    
    def process_exception(self, request, exception):
        """视图抛出异常时调用"""
        print(f"Exception: {exception}")
        return None
    
    def process_template_response(self, request, response):
        """视图返回 TemplateResponse 时调用"""
        print("Template response")
        return response
```

### 注册中间件

```python
# settings.py
MIDDLEWARE = [
    # ...
    'myapp.middleware.CustomMiddleware',
]
```

---

## 4.5 实战：常用中间件

### 1. 请求日志中间件

```python
import logging
import time

logger = logging.getLogger(__name__)

class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        start_time = time.time()
        
        response = self.get_response(request)
        
        duration = time.time() - start_time
        
        logger.info(
            f"{request.method} {request.path} "
            f"{response.status_code} "
            f"{duration:.3f}s"
        )
        
        return response
```

### 2. IP 黑名单中间件

```python
class IPBlacklistMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.blacklist = {'192.168.1.100', '10.0.0.50'}
    
    def __call__(self, request):
        ip = self.get_client_ip(request)
        
        if ip in self.blacklist:
            from django.http import HttpResponseForbidden
            return HttpResponseForbidden("Access denied")
        
        return self.get_response(request)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
```

### 3. API 速率限制中间件

```python
from django.core.cache import cache
from django.http import JsonResponse

class RateLimitMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.rate = 100  # 每分钟请求数
        self.window = 60  # 时间窗口（秒）
    
    def __call__(self, request):
        if request.path.startswith('/api/'):
            ip = self.get_client_ip(request)
            key = f'rate_limit:{ip}'
            
            current = cache.get(key, 0)
            
            if current >= self.rate:
                return JsonResponse(
                    {'error': 'Rate limit exceeded'},
                    status=429
                )
            
            cache.set(key, current + 1, self.window)
        
        return self.get_response(request)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')
```

### 4. CORS 中间件

```python
class CORSMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.allowed_origins = [
            'http://localhost:3000',
            'https://example.com',
        ]
    
    def __call__(self, request):
        response = self.get_response(request)
        
        origin = request.META.get('HTTP_ORIGIN')
        
        if origin in self.allowed_origins:
            response['Access-Control-Allow-Origin'] = origin
            response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            response['Access-Control-Allow-Credentials'] = 'true'
        
        if request.method == 'OPTIONS':
            response.status_code = 200
        
        return response
```

---

## 4.6 装饰器

### 登录验证

```python
from django.contrib.auth.decorators import login_required

@login_required
def dashboard(request):
    return render(request, 'dashboard.html')
```

### 权限验证

```python
from django.contrib.auth.decorators import permission_required

@permission_required('blog.add_post', raise_exception=True)
def create_post(request):
    # 只有有 add_post 权限的用户才能访问
    pass
```

### 自定义装饰器

```python
from functools import wraps

def admin_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_staff:
            from django.http import HttpResponseForbidden
            return HttpResponseForbidden("Admin access required")
        return view_func(request, *args, **kwargs)
    return wrapper

@admin_required
def admin_panel(request):
    return render(request, 'admin_panel.html')
```

### AJAX 检测

```python
def ajax_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            from django.http import HttpResponseBadRequest
            return HttpResponseBadRequest("AJAX required")
        return view_func(request, *args, **kwargs)
    return wrapper

@ajax_required
def api_endpoint(request):
    return JsonResponse({'data': 'value'})
```

---

## 4.7 错误处理

### 自定义错误页面

```python
# views.py

def handler404(request, exception):
    return render(request, 'errors/404.html', status=404)

def handler500(request):
    return render(request, 'errors/500.html', status=500)

def handler403(request, exception):
    return render(request, 'errors/403.html', status=403)
```

```python
# urls.py

handler404 = 'myapp.views.handler404'
handler500 = 'myapp.views.handler500'
handler403 = 'myapp.views.handler403'
```

### 全局异常中间件

```python
import logging

logger = logging.getLogger(__name__)

class ExceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        try:
            return self.get_response(request)
        except Exception as e:
            logger.error(f"Unhandled exception: {e}", exc_info=True)
            raise
```

---

## 4.8 本章小结

✅ **视图函数** - FBV 基础
✅ **类视图** - CBV、通用视图
✅ **URL 配置** - 命名空间、正则
✅ **中间件** - 概念、自定义
✅ **实用中间件** - 日志、限流、CORS
✅ **装饰器** - 认证、权限、自定义
✅ **错误处理** - 自定义页面、异常处理

---

## 📝 练习题

### 练习 1：API 中间件

创建一个 API 中间件：
- JSON 响应格式化
- 统一错误处理
- 请求验证
- 响应时间头

### 练习 2：权限系统

实现基于角色的访问控制：
- 角色定义
- 权限检查装饰器
- 中间件集成

### 练习 3：缓存中间件

创建页面缓存中间件：
- Redis 缓存
- 缓存键生成
- 缓存失效策略

---

## 🔗 相关资源

- [视图文档](https://docs.djangoproject.com/zh-hans/5.2/topics/http/views/)
- [URL 配置](https://docs.djangoproject.com/zh-hans/5.2/topics/http/urls/)
- [中间件](https://docs.djangoproject.com/zh-hans/5.2/topics/http/middleware/)

---

**下一章：** [第5章 - 模板系统与静态文件 →](./5、模板系统与静态文件.md)
