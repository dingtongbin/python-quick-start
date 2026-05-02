# 第3章：ORM 高级查询与优化

本章深入学习 Django ORM 的高级查询技巧、性能优化和 N+1 问题解决方案。

---

## 3.1 QuerySet API 详解

### 链式调用

```python
# QuerySet 支持链式调用
posts = Post.objects.filter(
    status='published'
).exclude(
    title__icontains='草稿'
).order_by(
    '-published_at'
)[:10]
```

### 惰性求值

```python
# QuerySet 是惰性的，只有在真正需要时才执行 SQL
qs = Post.objects.filter(status='published')  # 不执行 SQL

# 以下操作会触发 SQL 执行
list(qs)           # 转换为列表
len(qs)            # 获取长度
for post in qs:    # 迭代
    print(post.title)
```

### 缓存机制

```python
# QuerySet 会缓存结果
qs = Post.objects.all()

# 第一次查询 - 执行 SQL
print(list(qs))

# 第二次查询 - 使用缓存，不执行 SQL
print(list(qs))

# 但切片会创建新的 QuerySet
print(qs[0])   # 执行 SQL
print(qs[0])   # 再次执行 SQL
```

---

## 3.2 高级过滤

### Q 对象（复杂查询）

```python
from django.db.models import Q

# OR 查询
posts = Post.objects.filter(
    Q(title__contains='Django') | Q(content__contains='Django')
)

# AND + OR 组合
posts = Post.objects.filter(
    Q(status='published') & 
    (Q(category__name='Python') | Q(category__name='JavaScript'))
)

# NOT 查询
posts = Post.objects.filter(
    ~Q(status='draft')
)

# 动态构建查询
query = Q()
if keyword:
    query &= Q(title__icontains=keyword)
if category:
    query &= Q(category__slug=category)
if author:
    query &= Q(author__username=author)

posts = Post.objects.filter(query)
```

### F 表达式（字段比较）

```python
from django.db.models import F

# 字段比较
posts = Post.objects.filter(
    published_at__gt=F('created_at')
)

# 更新字段
Post.objects.update(views=F('views') + 1)

# 批量更新
Post.objects.filter(status='draft').update(
    updated_at=F('created_at')
)
```

### Func 表达式

```python
from django.db.models.functions import Lower, Length, Substr

# 函数表达式
posts = Post.objects.annotate(
    title_lower=Lower('title'),
    title_length=Length('title'),
    short_title=Substr('title', 1, 50)
)

# 过滤
posts = Post.objects.filter(
    title__length__gt=10
)
```

---

## 3.3 聚合与注解

### 聚合函数

```python
from django.db.models import Count, Avg, Max, Min, Sum

# 整体聚合
stats = Post.objects.aggregate(
    total=Count('id'),
    avg_views=Avg('views'),
    max_views=Max('views'),
    min_views=Min('views'),
    total_views=Sum('views')
)

print(stats)
# {'total': 100, 'avg_views': 150.5, 'max_views': 1000, ...}
```

### 分组注解

```python
# 每个分类的文章数
categories = Category.objects.annotate(
    post_count=Count('posts')
)

for cat in categories:
    print(f"{cat.name}: {cat.post_count} 篇文章")

# 每个作者的文章数和平均阅读量
authors = User.objects.annotate(
    post_count=Count('posts'),
    avg_views=Avg('posts__views')
).filter(
    post_count__gt=5
).order_by(
    '-avg_views'
)
```

### 条件注解

```python
from django.db.models import Case, When, Value, IntegerField

# 条件统计
categories = Category.objects.annotate(
    published_count=Count(
        'posts',
        filter=Q(posts__status='published')
    ),
    draft_count=Count(
        'posts',
        filter=Q(posts__status='draft')
    )
)

# 条件排序
posts = Post.objects.annotate(
    priority=Case(
        When(featured=True, then=Value(1)),
        When(published_at__isnull=False, then=Value(2)),
        default=Value(3),
        output_field=IntegerField()
    )
).order_by('priority')
```

---

## 3.4 子查询

### Exists 子查询

```python
from django.db.models import Exists, OuterRef

# 有评论的文章
comments = Comment.objects.filter(
    post=OuterRef('pk'),
    is_approved=True
)

posts = Post.objects.annotate(
    has_comments=Exists(comments)
).filter(
    has_comments=True
)
```

### Subquery

```python
from django.db.models import Subquery

# 最新评论的作者
latest_comment = Comment.objects.filter(
    post=OuterRef('pk')
).order_by('-created_at').values('author_name')[:1]

posts = Post.objects.annotate(
    latest_commenter=Subquery(latest_comment)
)
```

---

## 3.5 连表查询优化

### select_related（外键优化）

```python
# ❌ N+1 问题
posts = Post.objects.all()
for post in posts:
    print(post.category.name)      # 每次访问都查询数据库
    print(post.author.username)    # 每次访问都查询数据库
# 1 + N*2 次查询！

# ✅ 使用 select_related
posts = Post.objects.select_related('category', 'author').all()
for post in posts:
    print(post.category.name)      # 从缓存中获取
    print(post.author.username)    # 从缓存中获取
# 只有 1 次查询！
```

**原理：** 使用 SQL JOIN，一次性获取关联对象。

**适用场景：** ForeignKey、OneToOneField（一对一关系）

### prefetch_related（多对多优化）

```python
# ❌ N+1 问题
posts = Post.objects.all()
for post in posts:
    tags = list(post.tags.all())  # 每次都查询
# 1 + N 次查询！

# ✅ 使用 prefetch_related
posts = Post.objects.prefetch_related('tags').all()
for post in posts:
    tags = list(post.tags.all())  # 从缓存中获取
# 只有 2 次查询！
```

**原理：** 执行两次查询，然后在 Python 中关联数据。

**适用场景：** ManyToManyField、反向 ForeignKey（一对多关系）

### 组合使用

```python
# 同时优化外键和多对多
posts = Post.objects.select_related(
    'category',
    'author'
).prefetch_related(
    'tags',
    'comments'
).filter(
    status='published'
).order_by(
    '-published_at'
)[:20]

# 现在可以高效访问所有关联数据
for post in posts:
    print(post.title)
    print(post.category.name)         # JOIN 获取
    print(post.author.username)       # JOIN 获取
    print(list(post.tags.all()))      # 预取获取
    print(list(post.comments.all()))  # 预取获取
```

---

## 3.6 N+1 问题实战

### 检测 N+1 问题

#### 方法 1：Django Debug Toolbar

```bash
pip install django-debug-toolbar
```

配置 `settings.py`：

```python
INSTALLED_APPS = [
    'debug_toolbar',
]

MIDDLEWARE = [
    'debug_toolbar.middleware.DebugToolbarMiddleware',
]

INTERNAL_IPS = ['127.0.0.1']
```

在模板中添加：

```html
{% if debug %}
    {% include "debug_toolbar.html" %}
{% endif %}
```

#### 方法 2：自定义中间件

```python
# middleware.py
import logging
from django.db import connection

logger = logging.getLogger(__name__)

class QueryCountMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # 记录初始查询数
        initial_queries = len(connection.queries)
        
        response = self.get_response(request)
        
        # 计算新增查询数
        new_queries = len(connection.queries) - initial_queries
        
        if new_queries > 50:  # 阈值
            logger.warning(
                f"High query count: {new_queries} queries for {request.path}"
            )
        
        return response
```

### 解决 N+1 问题

#### 示例 1：博客列表

```python
# views.py

# ❌ 糟糕的实现
def blog_list(request):
    posts = Post.objects.filter(status='published')
    
    context = {
        'posts': posts,
    }
    return render(request, 'blog/list.html', context)

# 模板中
# {% for post in posts %}
#     {{ post.category.name }}  <!-- N+1 -->
#     {{ post.author.username }}  <!-- N+1 -->
#     {% for tag in post.tags.all %}  <!-- N+1 -->
#         {{ tag.name }}
#     {% endfor %}
# {% endfor %}

# ✅ 优化的实现
def blog_list(request):
    posts = Post.objects.select_related(
        'category',
        'author'
    ).prefetch_related(
        'tags'
    ).filter(
        status='published'
    ).order_by('-published_at')
    
    context = {
        'posts': posts,
    }
    return render(request, 'blog/list.html', context)
```

#### 示例 2：DRF 序列化器

```python
# serializers.py

# ❌ 糟糕的实现
class PostSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name')
    author_name = serializers.CharField(source='author.username')
    tags = TagSerializer(many=True)
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'category_name', 'author_name', 'tags']

# views.py
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()  # N+1 问题！
    serializer_class = PostSerializer

# ✅ 优化的实现
class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    
    def get_queryset(self):
        return Post.objects.select_related(
            'category',
            'author'
        ).prefetch_related(
            'tags'
        ).all()
```

---

## 3.7 数据库索引优化

### 添加索引

```python
# models.py

class Post(models.Model):
    title = models.CharField(max_length=200, db_index=True)  # 单列索引
    slug = models.SlugField(unique=True)  # 唯一索引
    
    status = models.CharField(max_length=10)
    published_at = models.DateTimeField(null=True)
    
    class Meta:
        indexes = [
            # 复合索引
            models.Index(fields=['status', '-published_at']),
            
            # 条件索引
            models.Index(
                fields=['published_at'],
                condition=Q(status='published'),
                name='published_posts_idx'
            ),
        ]
```

### 常用索引类型

```python
class Meta:
    indexes = [
        # B-tree 索引（默认）
        models.Index(fields=['title']),
        
        # Gin 索引（PostgreSQL，适合全文搜索）
        GinIndex(fields=['content']),
        
        # 部分索引
        models.Index(
            fields=['status'],
            condition=Q(status='published')
        ),
    ]
```

### 查看查询计划

```python
# 在 Django Shell 中
from django.db import connection

posts = Post.objects.filter(status='published')
print(posts.query)  # 查看 SQL

# 使用 EXPLAIN
cursor = connection.cursor()
cursor.execute("EXPLAIN ANALYZE " + str(posts.query))
for row in cursor.fetchall():
    print(row)
```

---

## 3.8 原始 SQL

### 执行原始查询

```python
from django.db import connection

# 原始 SQL 查询
def get_popular_posts():
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT p.id, p.title, COUNT(c.id) as comment_count
            FROM blog_post p
            LEFT JOIN blog_comment c ON p.id = c.post_id
            WHERE p.status = 'published'
            GROUP BY p.id, p.title
            ORDER BY comment_count DESC
            LIMIT 10
        """)
        
        results = []
        for row in cursor.fetchall():
            results.append({
                'id': row[0],
                'title': row[1],
                'comment_count': row[2]
            })
        
        return results
```

### raw() 方法

```python
# 使用 raw()
posts = Post.objects.raw('''
    SELECT * FROM blog_post 
    WHERE status = 'published' 
    ORDER BY published_at DESC
''')

for post in posts:
    print(post.title)
```

### extra() 方法（已废弃，不推荐）

```python
# ⚠️ 不推荐使用，仅用于旧代码
posts = Post.objects.extra(
    select={'comment_count': 'SELECT COUNT(*) FROM blog_comment WHERE post_id = blog_post.id'}
)
```

---

## 3.9 事务管理

### 基本事务

```python
from django.db import transaction

# 自动事务（默认）
@transaction.atomic
def create_post_with_tags(data, tag_names):
    """创建文章并关联标签"""
    
    # 创建文章
    post = Post.objects.create(**data)
    
    # 关联标签
    for tag_name in tag_names:
        tag, created = Tag.objects.get_or_create(name=tag_name)
        post.tags.add(tag)
    
    return post

# 如果任何一步失败，整个事务回滚
```

### 手动事务控制

```python
def complex_operation():
    try:
        with transaction.atomic():
            # 操作 1
            obj1 = Model1.objects.create(...)
            
            # 操作 2
            obj2 = Model2.objects.create(...)
            
            # 保存点
            with transaction.atomic():
                # 嵌套操作
                obj3 = Model3.objects.create(...)
                # 如果这里失败，只回滚到保存点
            
            # 继续其他操作
            obj4 = Model4.objects.create(...)
    
    except Exception as e:
        # 整个事务回滚
        print(f"操作失败: {e}")
        raise
```

### 事务隔离级别

```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'OPTIONS': {
            'isolation_level': 'read committed',
        },
    }
}
```

---

## 3.10 性能监控

### django-silk

```bash
pip install django-silk
```

配置：

```python
# settings.py
INSTALLED_APPS = [
    'silk',
]

MIDDLEWARE = [
    'silk.middleware.SilkyMiddleware',
]
```

访问 `/silk/` 查看性能分析。

### 自定义性能日志

```python
import logging
import time
from django.db import connection

logger = logging.getLogger(__name__)

class QueryLogger:
    def __enter__(self):
        self.start_time = time.time()
        self.initial_queries = len(connection.queries)
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        duration = time.time() - self.start_time
        query_count = len(connection.queries) - self.initial_queries
        
        logger.info(
            f"Queries: {query_count}, Duration: {duration:.3f}s"
        )
        
        if query_count > 50:
            logger.warning(f"High query count: {query_count}")
        
        if duration > 1.0:
            logger.warning(f"Slow operation: {duration:.3f}s")

# 使用
with QueryLogger():
    posts = Post.objects.all()
    for post in posts:
        print(post.title)
```

---

## 3.11 本章小结

✅ **QuerySet API** - 链式调用、惰性求值
✅ **高级过滤** - Q 对象、F 表达式
✅ **聚合注解** - Count、Avg、条件注解
✅ **子查询** - Exists、Subquery
✅ **连表优化** - select_related、prefetch_related
✅ **N+1 问题** - 检测与解决
✅ **索引优化** - 单列、复合、条件索引
✅ **原始 SQL** - 直接执行 SQL
✅ **事务管理** - atomic、保存点
✅ **性能监控** - Silk、自定义日志

---

## 📝 练习题

### 练习 1：优化博客 API

优化现有的博客 API，解决所有 N+1 问题：
- 文章列表接口
- 文章详情接口
- 评论列表接口

### 练习 2：复杂查询

编写以下查询：
1. 找出每个分类下阅读量最高的文章
2. 统计每个月发布的文章数量
3. 查找有评论但未审核的文章
4. 计算作者的平均文章阅读量

---

## 🔗 相关资源

- [QuerySet API 参考](https://docs.djangoproject.com/zh-hans/5.2/ref/models/querysets/)
- [数据库优化指南](https://docs.djangoproject.com/zh-hans/5.2/topics/db/optimization/)
- [事务管理](https://docs.djangoproject.com/zh-hans/5.2/topics/db/transactions/)

---

**下一章：** [第4章 - 视图、URL 与中间件 →](./4、视图URL与中间件.md)