# 第9章：Redis 缓存集成

本章学习如何在 Django 中集成 Redis，实现高性能缓存和会话存储。

---

## 9.1 安装与配置

### 安装

```bash
pip install redis==5.0.8
pip install django-redis==5.4.0
```

### 配置

```python
# settings.py
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

# 会话存储
SESSION_ENGINE = "django.contrib.sessions.backends.cache"
SESSION_CACHE_ALIAS = "default"
```

---

## 9.2 基本使用

```python
from django.core.cache import cache

# 设置缓存
cache.set('key', 'value', timeout=300)  # 5分钟

# 获取缓存
value = cache.get('key')

# 删除缓存
cache.delete('key')

# 清空所有缓存
cache.clear()
```

---

## 9.3 缓存装饰器

```python
from django.views.decorators.cache import cache_page

@cache_page(60 * 15)  # 15分钟
def my_view(request):
    ...

# 类视图
from django.utils.decorators import method_decorator

@method_decorator(cache_page(60 * 15), name='dispatch')
class MyView(View):
    ...
```

---

## 9.4 模板片段缓存

```html
{% load cache %}

{% cache 500 sidebar %}
    .. sidebar content ..
{% endcache %}

{% cache 500 sidebar request.user.username %}
    .. user-specific sidebar ..
{% endcache %}
```

---

## 9.5 低级 API

```python
from django_redis import get_redis_connection

# 直接使用 Redis
cache = get_redis_connection("default")

cache.set('my_key', 'hello', 60)
value = cache.get('my_key')

# 列表
cache.rpush('my_list', 'item1')
cache.rpush('my_list', 'item2')
items = cache.lrange('my_list', 0, -1)

# 集合
cache.sadd('my_set', 'member1')
cache.sismember('my_set', 'member1')
```

---

## 9.6 实战：API 缓存

```python
from rest_framework.response import Response
from django.core.cache import cache

class PostViewSet(viewsets.ModelViewSet):
    def list(self, request):
        cache_key = f'posts_{request.query_params.urlencode()}'
        
        data = cache.get(cache_key)
        if not data:
            queryset = self.get_queryset()
            page = self.paginate_queryset(queryset)
            serializer = self.get_serializer(page, many=True)
            data = serializer.data
            
            cache.set(cache_key, data, timeout=300)
        
        return Response(data)
    
    def retrieve(self, request, slug=None):
        cache_key = f'post_{slug}'
        
        data = cache.get(cache_key)
        if not data:
            post = self.get_object()
            serializer = self.get_serializer(post)
            data = serializer.data
            
            cache.set(cache_key, data, timeout=300)
        
        return Response(data)
    
    def update(self, request, slug=None):
        # 清除缓存
        cache.delete(f'post_{slug}')
        cache.delete_pattern('posts_*')
        
        return super().update(request, slug)
```

---

## 9.7 本章小结

✅ **Redis 配置** - django-redis
✅ **基本操作** - set、get、delete
✅ **缓存装饰器** - cache_page
✅ **模板缓存** - 片段缓存
✅ **低级 API** - 直接使用 Redis
✅ **API 缓存** - DRF 集成

---

**下一章：** [第10章 - Celery 异步任务 →](./10、Celery异步任务.md)
