# 第2章：数据库配置与 ORM 基础

本章将深入学习 Django 的数据库配置和 ORM（对象关系映射）系统。你将学会如何配置 MySQL 数据库、创建数据模型、执行基本的 CRUD 操作。

---

## 2.1 数据库选择

### Django 支持的数据库

✅ **PostgreSQL** - 推荐用于生产环境
✅ **MySQL** - 广泛使用，本教程采用
✅ **MariaDB** - MySQL 的分支
✅ **SQLite** - 开发测试用（默认）

### 为什么选择 MySQL？

✅ **广泛使用** - 社区资源丰富
✅ **性能优秀** - 适合中大型应用
✅ **易于学习** - SQL 语法标准
✅ **成本低** - 开源免费

---

## 2.2 MySQL 8.0 安装

### Windows 系统

1. 访问 https://dev.mysql.com/downloads/installer/
2. 下载 MySQL Installer for Windows
3. 运行安装程序，选择 "Developer Default"
4. 设置 root 密码（记住这个密码！）
5. 完成安装

验证安装：

```powershell
mysql --version
mysql -u root -p
```

### macOS 系统

```bash
# 使用 Homebrew 安装
brew install mysql@8.0
brew services start mysql@8.0
mysql_secure_installation
mysql -u root -p
```

### Linux 系统（Ubuntu）

```bash
sudo apt update
sudo apt install -y mysql-server-8.0
sudo systemctl start mysql
sudo mysql_secure_installation
sudo mysql -u root -p
```

---

## 2.3 创建数据库

```sql
-- 登录 MySQL
mysql -u root -p

-- 创建数据库
CREATE DATABASE django_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 查看数据库
SHOW DATABASES;

-- 退出
EXIT;
```

---

## 2.4 安装 PyMySQL 驱动

```bash
pip install pymysql==1.1.0
```

在项目的主 `__init__.py` 文件中添加（与 settings.py 同级）：

```python
# myproject/__init__.py
import pymysql
pymysql.install_as_MySQLdb()
```

---

## 2.5 Django 数据库配置

编辑 `myproject/settings.py`：

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'django_db',
        'USER': 'root',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'charset': 'utf8mb4',
        },
    }
}
```

### 使用环境变量（推荐）

安装 django-environ：

```bash
pip install django-environ==0.11.2
```

创建 `.env` 文件：

```env
DB_NAME=django_db
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
```

修改 `settings.py`：

```python
import environ
env = environ.Env()
environ.Env.read_env()

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST'),
        'PORT': env('DB_PORT'),
    }
}
```

将 `.env` 加入 `.gitignore`：

```
.env
```

---

## 2.6 测试数据库连接

```bash
python manage.py migrate
```

如果看到 "OK" 输出，说明连接成功。

---

## 2.7 创建第一个模型

创建 blog 应用：

```bash
python manage.py startapp blog
```

注册应用（`settings.py`）：

```python
INSTALLED_APPS = [
    # ...
    'blog',
]
```

定义模型（`blog/models.py`）：

```python
from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    """文章分类"""
    name = models.CharField('分类名称', max_length=100)
    slug = models.SlugField('别名', max_length=100, unique=True)
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    
    class Meta:
        verbose_name = '分类'
        verbose_name_plural = '分类'
    
    def __str__(self):
        return self.name

class Post(models.Model):
    """文章"""
    STATUS_CHOICES = (
        ('draft', '草稿'),
        ('published', '已发布'),
    )
    
    title = models.CharField('标题', max_length=200)
    slug = models.SlugField('别名', max_length=200, unique=True)
    author = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='posts',
        verbose_name='作者'
    )
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='posts',
        verbose_name='分类'
    )
    content = models.TextField('内容')
    status = models.CharField(
        '状态', 
        max_length=10, 
        choices=STATUS_CHOICES, 
        default='draft'
    )
    published_at = models.DateTimeField('发布时间', null=True, blank=True)
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)
    
    class Meta:
        verbose_name = '文章'
        verbose_name_plural = '文章'
        ordering = ['-published_at', '-created_at']
    
    def __str__(self):
        return self.title

class Comment(models.Model):
    """评论"""
    post = models.ForeignKey(
        Post, 
        on_delete=models.CASCADE, 
        related_name='comments',
        verbose_name='文章'
    )
    author_name = models.CharField('作者姓名', max_length=100)
    author_email = models.EmailField('作者邮箱')
    content = models.TextField('评论内容')
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    is_approved = models.BooleanField('已审核', default=False)
    
    class Meta:
        verbose_name = '评论'
        verbose_name_plural = '评论'
    
    def __str__(self):
        return f'Comment by {self.author_name}'
```

---

## 2.8 字段类型详解

### 常用字段类型

| 字段类型 | 说明 | 示例 |
|----------|------|------|
| CharField | 字符串 | `models.CharField(max_length=100)` |
| TextField | 长文本 | `models.TextField()` |
| IntegerField | 整数 | `models.IntegerField()` |
| BooleanField | 布尔值 | `models.BooleanField(default=False)` |
| DateTimeField | 日期时间 | `models.DateTimeField()` |
| EmailField | 邮箱 | `models.EmailField()` |
| ForeignKey | 外键 | `models.ForeignKey(Model, on_delete=...)` |
| ManyToManyField | 多对多 | `models.ManyToManyField(Model)` |

### 常用字段选项

- `null=True` - 允许 NULL
- `blank=True` - 允许空字符串
- `default=value` - 默认值
- `unique=True` - 唯一约束
- `verbose_name` - 显示名称
- `choices` - 选项列表

---

## 2.9 数据迁移

```bash
# 生成迁移文件
python manage.py makemigrations blog

# 查看 SQL
python manage.py sqlmigrate blog 0001

# 应用迁移
python manage.py migrate

# 查看迁移状态
python manage.py showmigrations
```

---

## 2.10 ORM 基本操作（CRUD）

进入 Django Shell：

```bash
python manage.py shell
```

### Create - 创建

```python
from django.contrib.auth.models import User
from blog.models import Category, Post

# 创建用户
user = User.objects.create_user(
    username='admin',
    email='admin@example.com',
    password='password123'
)

# 创建分类
category = Category.objects.create(
    name='Python',
    slug='python'
)

# 创建文章
post = Post.objects.create(
    title='Django 入门教程',
    slug='django-tutorial',
    author=user,
    category=category,
    content='# Django 入门\n\n内容...',
    status='published'
)
```

### Read - 查询

```python
from blog.models import Post

# 获取所有
all_posts = Post.objects.all()

# 获取单个
post = Post.objects.get(slug='django-tutorial')

# 过滤
published = Post.objects.filter(status='published')
python_posts = Post.objects.filter(category__name='Python')

# 排除
drafts = Post.objects.exclude(status='published')

# 排序
posts = Post.objects.order_by('-created_at')

# 限制数量
latest_5 = Post.objects.order_by('-created_at')[:5]

# 聚合
from django.db.models import Count
count = Post.objects.count()
```

### Update - 更新

```python
# 方法 1：修改对象
post = Post.objects.get(id=1)
post.title = '新标题'
post.save()

# 方法 2：批量更新
Post.objects.filter(status='draft').update(status='published')
```

### Delete - 删除

```python
# 删除单个
post = Post.objects.get(id=1)
post.delete()

# 批量删除
Post.objects.filter(status='draft').delete()
```

---

## 2.11 连表查询

### select_related（外键优化）

```python
# ❌ N+1 问题
posts = Post.objects.all()
for post in posts:
    print(post.category.name)  # 每次都查询数据库

# ✅ 使用 select_related
posts = Post.objects.select_related('category', 'author').all()
for post in posts:
    print(post.category.name)  # 只查询一次
```

### prefetch_related（多对多优化）

```python
# ❌ N+1 问题
posts = Post.objects.all()
for post in posts:
    print(list(post.tags.all()))  # 每次都查询

# ✅ 使用 prefetch_related
posts = Post.objects.prefetch_related('tags').all()
for post in posts:
    print(list(post.tags.all()))  # 只查询两次
```

### 组合使用

```python
posts = Post.objects.select_related(
    'category', 'author'
).prefetch_related(
    'tags', 'comments'
).filter(
    status='published'
).order_by(
    '-published_at'
)
```

---

## 2.12 高级查询

### Q 对象（复杂查询）

```python
from django.db.models import Q

# OR 查询
posts = Post.objects.filter(
    Q(title__contains='Django') | Q(content__contains='Django')
)

# AND + OR
posts = Post.objects.filter(
    Q(status='published') & 
    (Q(category__name='Python') | Q(category__name='JavaScript'))
)

# NOT 查询
posts = Post.objects.filter(
    ~Q(status='draft')
)
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
```

### 聚合与注解

```python
from django.db.models import Count, Avg, Max, Min

# 统计每个分类的文章数
categories = Category.objects.annotate(
    post_count=Count('posts')
)
for cat in categories:
    print(f"{cat.name}: {cat.post_count} 篇文章")

# 平均值
avg_comments = Post.objects.aggregate(
    avg_comments=Avg('comments__count')
)

# 最大值/最小值
max_date = Post.objects.aggregate(
    latest=Max('published_at'),
    earliest=Min('published_at')
)
```

---

## 2.13 本章小结

✅ **MySQL 安装** - Windows/macOS/Linux
✅ **PyMySQL 驱动** - 安装和配置
✅ **数据库配置** - settings.py 和环境变量
✅ **模型定义** - 字段类型和选项
✅ **数据迁移** - makemigrations 和 migrate
✅ **CRUD 操作** - 增删改查
✅ **连表查询** - select_related 和 prefetch_related
✅ **高级查询** - Q 对象、F 表达式、聚合

---

## 📝 练习题

### 练习 1：扩展博客模型

为 Post 模型添加以下字段：
- `excerpt` - 摘要（TextField，可选）
- `featured_image` - 封面图片（ImageField）
- `views` - 阅读量（IntegerField，默认 0）
- `is_featured` - 是否推荐（BooleanField，默认 False）

### 练习 2：复杂查询

编写查询语句：
1. 获取所有已发布且属于 Python 分类的文章
2. 统计每个作者的文章数量
3. 查找最近 7 天发布的文章
4. 获取阅读量最高的前 10 篇文章

### 练习 3：性能优化

使用 select_related 和 prefetch_related 优化以下查询：

```python
# 优化前
posts = Post.objects.filter(status='published')
for post in posts:
    print(post.title)
    print(post.category.name)
    print(post.author.username)
    print(list(post.tags.all()))
```

---

## 🔗 相关资源

- [Django ORM 官方文档](https://docs.djangoproject.com/zh-hans/5.2/topics/db/queries/)
- [QuerySet API 参考](https://docs.djangoproject.com/zh-hans/5.2/ref/models/querysets/)
- [模型字段参考](https://docs.djangoproject.com/zh-hans/5.2/ref/models/fields/)

---

**下一章：** [第3章 - ORM 高级查询与优化 →](./3、ORM高级查询与优化.md)