# 第8章：DRF 高级特性

本章学习 DRF 的高级功能：节流、版本控制、文档生成和性能优化。

---

## 8.1 节流（Throttling）

### 配置

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',
        'user': '1000/day'
    }
}
```

### 自定义节流

```python
from rest_framework.throttling import SimpleRateThrottle

class BurstRateThrottle(SimpleRateThrottle):
    scope = 'burst'
    
    def get_cache_key(self, request, view):
        return self.get_ident(request)

# 使用
class PostViewSet(viewsets.ModelViewSet):
    throttle_classes = [BurstRateThrottle]
```

---

## 8.2 版本控制

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.URLPathVersioning',
    'ALLOWED_VERSIONS': ['v1', 'v2'],
    'DEFAULT_VERSION': 'v1',
}

# urls.py
urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('api/v2/', include(router.urls)),
]

# views.py
class PostViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.request.version == 'v2':
            return PostSerializerV2
        return PostSerializer
```

---

## 8.3 API 文档

### drf-spectacular

```bash
pip install drf-spectacular==0.27.0
```

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'Blog API',
    'DESCRIPTION': '博客系统 API 文档',
    'VERSION': '1.0.0',
}

# urls.py
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema')),
]
```

---

## 8.4 缓存

```python
from django.core.cache import cache
from rest_framework.response import Response

class PostViewSet(viewsets.ModelViewSet):
    def list(self, request, *args, **kwargs):
        cache_key = 'posts_list'
        data = cache.get(cache_key)
        
        if not data:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            data = serializer.data
            cache.set(cache_key, data, timeout=300)  # 5分钟
        
        return Response(data)
```

---

## 8.5 本章小结

✅ **节流** - 速率限制
✅ **版本控制** - URL 版本
✅ **API 文档** - drf-spectacular
✅ **缓存** - Redis 缓存

---

**下一章：** [第9章 - Redis 缓存集成 →](./9、Redis缓存集成.md)
