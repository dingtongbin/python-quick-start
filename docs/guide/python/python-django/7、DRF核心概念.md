# 第7章：DRF 核心概念

本章学习 Django REST Framework 的核心组件：序列化器、视图集、路由器和认证。

---

## 7.1 序列化器（Serializers）

### 基本序列化器

```python
# serializers.py
from rest_framework import serializers
from .models import Post, Category, Tag

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']

class PostSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    tags = TagSerializer(many=True, read_only=True)
    author = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content',
            'status', 'author', 'category', 'category_id',
            'tags', 'published_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'author', 'created_at', 'updated_at']
```

### 验证

```python
class PostSerializer(serializers.ModelSerializer):
    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("标题至少5个字符")
        return value
    
    def validate(self, data):
        if data.get('status') == 'published' and not data.get('published_at'):
            raise serializers.ValidationError(
                "发布文章必须设置发布时间"
            )
        return data
```

---

## 7.2 视图集（ViewSets）

### ModelViewSet

```python
# views.py
from rest_framework import viewsets
from .models import Post
from .serializers import PostSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.select_related(
        'category', 'author'
    ).prefetch_related('tags').all()
    serializer_class = PostSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # 过滤
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__slug=category)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
```

### 路由器

```python
# urls.py
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, CategoryViewSet, TagViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'tags', TagViewSet)

urlpatterns = router.urls
```

---

## 7.3 认证与权限

### 认证类

```python
from rest_framework.authentication import (
    SessionAuthentication,
    TokenAuthentication,
)
from rest_framework.permissions import (
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
    AllowAny,
)

class PostViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
```

### 自定义权限

```python
from rest_framework.permissions import BasePermission

class IsAuthorOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.author == request.user

class PostViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
```

---

## 7.4 分页

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
}

# 自定义分页
from rest_framework.pagination import PageNumberPagination

class CustomPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
```

---

## 7.5 过滤与搜索

### django-filter

```bash
pip install django-filter==24.3
```

```python
# filters.py
import django_filters
from .models import Post

class PostFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(lookup_expr='icontains')
    category = django_filters.CharFilter(field_name='category__slug')
    created_after = django_filters.DateFilter(
        field_name='created_at',
        lookup_expr='gte'
    )
    
    class Meta:
        model = Post
        fields = ['status', 'category', 'author']
```

```python
# views.py
from django_filters.rest_framework import DjangoFilterBackend

class PostViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend]
    filterset_class = PostFilter
```

---

## 7.6 N+1 问题解决

```python
class PostViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Post.objects.select_related(
            'category',
            'author'
        ).prefetch_related(
            'tags',
            'comments'
        ).all()
```

使用 `django-rest-framework-extensions`：

```bash
pip install drf-extensions
```

---

## 7.7 本章小结

✅ **序列化器** - ModelSerializer、验证
✅ **视图集** - ModelViewSet、路由器
✅ **认证权限** - JWT、自定义权限
✅ **分页** - 配置、自定义
✅ **过滤搜索** - django-filter
✅ **N+1 优化** - select_related、prefetch_related

---

**下一章：** [第8章 - DRF 高级特性 →](./8、DRF高级特性.md)
