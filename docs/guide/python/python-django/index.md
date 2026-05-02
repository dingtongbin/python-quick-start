# Django 5.2 LTS & DRF 完整开发指南

欢迎来到 Django 5.2 LTS（长期支持版本）和 Django REST Framework 的完整开发教程！本教程将从零开始，带你掌握现代 Web 后端开发的所有核心技能。

---

## 📌 为什么选择 Django 5.2 LTS？

✅ **长期支持** - 安全更新持续到 2028 年 4 月
✅ **稳定可靠** - 经过充分测试的生产级版本
✅ **Python 兼容** - 支持 Python 3.10/3.11/3.12
✅ **生态完善** - 丰富的第三方包支持

---

## 📚 教程目录

### 第一部分：Django 基础入门（第1-6章）

#### [第1章：环境搭建与项目初始化](./1、环境搭建与项目初始化.md)
- Python 虚拟环境配置
- Django 5.2 LTS 安装
- 创建第一个 Django 项目
- 项目结构详解
- 启动开发服务器
- settings.py 配置详解

#### [第2章：数据库配置与 ORM 基础](./2、数据库配置与ORM基础.md)
- MySQL 8.0 安装与配置
- PyMySQL 驱动安装
- DATABASES 配置详解
- 创建数据库模型（Model）
- 字段类型详解
- 数据迁移（Migrations）
- ORM 基本 CRUD 操作

#### [第3章：ORM 高级查询与优化](./3、ORM高级查询与优化.md)
- QuerySet API 详解
- 字段查找与过滤
- Q 对象与复杂查询
- F 表达式
- 聚合与注解（Aggregate & Annotate）
- select_related 优化连表查询
- prefetch_related 优化多对多查询
- 原生 SQL 查询

#### [第4章：视图、URL 与中间件](./4、视图URL与中间件.md)
- 函数视图（FBV）
- 类视图（CBV）
- 通用视图（Generic Views）
- URL 路由配置
- 命名空间（Namespace）
- 中间件（Middleware）
- 请求/响应生命周期

#### [第5章：模板系统与静态文件](./5、模板系统与静态文件.md)
- Django 模板语言（DTL）
- 模板继承与包含
- 模板标签与过滤器
- 静态文件管理（Static Files）
- 媒体文件处理（Media Files）
- 表单处理（Forms）

#### [第6章：用户认证与 RBAC 权限](./6、用户认证与RBAC权限.md)
- Django 内置用户系统
- 自定义用户模型（AbstractUser vs AbstractBaseUser）
- 认证后端（Authentication Backends）
- 权限系统（Permissions）
- 登录/注册/登出功能
- RBAC 基于角色的访问控制
- 自定义权限类
- 分组管理

---

### 第二部分：Django REST Framework 核心（第7-12章）

#### [第7章：DRF 入门与序列化器](./7、DRF入门与序列化器.md)
- DRF 安装与配置
- 什么是 RESTful API？
- 序列化器基础（Serializer）
- ModelSerializer 详解
- 字段类型与验证
- APIView 基础
- 可浏览 API（Browsable API）
- Request 与 Response 对象

#### [第8章：序列化器进阶与 N+1 问题](./8、序列化器进阶与N+1问题.md)
- 嵌套序列化
- SerializerMethodField
- 直接循环序列化 vs 序列化类
- 自定义字段
- 验证器（Validators）
- **N+1 问题详解**
- select_related 解决外键 N+1
- prefetch_related 解决多对多 N+1
- django-debug-toolbar 性能分析

#### [第9章：视图集、路由器与混入类](./9、视图集路由器与混入类.md)
- ViewSet 概念
- ModelViewSet 完整 CRUD
- ReadOnlyModelViewSet
- GenericViewSet + Mixins
- Router 配置（SimpleRouter / DefaultRouter）
- 自定义 Action（@action 装饰器）
- 视图集 vs 视图的选择

#### [第10章：认证、权限与节流](./10、认证权限与节流.md)
- Token 认证
- Session 认证
- **JWT 认证**（djangorestframework-simplejwt）
- 权限类（Permissions）
- 自定义权限
- IsAuthenticated / IsAdminUser / IsOwnerOrReadOnly
- 节流（Throttling）
- 匿名/用户/Scoped 节流

#### [第11章：过滤、搜索、排序与分页](./11、过滤搜索排序与分页.md)
- django-filter 集成
- SearchFilter 全文搜索
- OrderingFilter 排序
- 分页策略
  - PageNumberPagination
  - LimitOffsetPagination
  - CursorPagination
- 自定义分页
- 过滤后端组合使用

#### [第12章：缓存与 Redis 集成](./12、缓存与Redis集成.md)
- Django 缓存框架
- 缓存后端配置
- **Redis 安装与配置**
- django-redis 集成
- 缓存策略
  - 全站缓存
  - 视图缓存
  - 模板片段缓存
  - 低级缓存 API
- Redis 数据结构应用
  - String / Hash / List / Set / ZSet
- 缓存失效策略
- Celery + Redis 异步任务

---

### 第三部分：Web 安全与高级特性（第13-15章）

#### [第13章：Web 安全最佳实践](./13、Web安全最佳实践.md)
- CSRF 跨站请求伪造防护
- XSS 跨站脚本攻击防护
- SQL 注入防护
- CORS 跨域资源共享配置
- HTTPS 配置
- SecurityMiddleware 安全中间件
- Clickjacking 防护
- Content Security Policy (CSP)
- 密码哈希与存储

#### [第14章：Celery 异步任务与定时任务](./14、Celery异步任务与定时任务.md)
- Celery 架构介绍
- Celery 安装与配置
- Redis/RabbitMQ 作为 Broker
- 定义异步任务
- 任务调用（delay / apply_async）
- 任务状态跟踪
- 定时任务（Celery Beat）
- Crontab 调度
- 任务重试机制
- 错误处理

#### [第15章：部署优化与生产环境](./15、部署优化与生产环境.md)
- Gunicorn WSGI 服务器
- Nginx 反向代理配置
- 静态文件收集（collectstatic）
- WhiteNoise 静态文件服务
- 环境变量管理（django-environ）
- 日志配置（Logging）
- 数据库连接池
- 性能监控
- Docker 容器化部署
- CI/CD 自动化部署

---

### 第四部分：实战项目（第16章）

#### [第16章：完整博客 API 项目实战](./16、完整博客API项目实战.md)
- 项目需求分析
- 数据库设计
- 用户模块（注册/登录/JWT）
- 文章模块（CRUD / 分类 / 标签）
- 评论模块（嵌套评论）
- 点赞收藏功能
- 搜索与过滤
- 权限控制
- 缓存优化
- API 文档生成（drf-spectacular）
- 单元测试
- 部署上线

---

## 🎯 学习路径建议

### 初学者路线
1. 完成第 1-6 章（Django 基础）
2. 完成第 7-9 章（DRF 核心）
3. 完成第 16 章（实战项目）

### 进阶开发者路线
1. 快速浏览第 1-6 章
2. 深入学习第 7-12 章（DRF 高级特性）
3. 学习第 13-15 章（安全与部署）
4. 完成第 16 章（实战项目）

### 全栈工程师路线
- 完整学习所有章节
- 深入理解每个知识点
- 独立完成实战项目
- 扩展到前端集成（Vue/React）

---

## 📋 前置要求

- ✅ Python 3.10+ 基础语法
- ✅ 基本的 HTML/CSS 知识
- ✅ HTTP 协议基础
- ✅ 数据库基本概念（SQL）
- ✅ Git 版本控制基础

---

## 🛠️ 技术栈

### 核心框架
- **Django 5.2 LTS** - Web 框架
- **Django REST Framework 3.15+** - API 框架

### 数据库
- **MySQL 8.0** - 关系型数据库
- **Redis 7.0** - 缓存与消息队列

### 认证与安全
- **djangorestframework-simplejwt** - JWT 认证
- **django-cors-headers** - CORS 支持

### 性能优化
- **django-redis** - Redis 缓存
- **django-filter** - 过滤
- **drf-spectacular** - API 文档

### 异步任务
- **Celery 5.3+** - 分布式任务队列
- **redis** - Broker

### 部署
- **Gunicorn** - WSGI 服务器
- **Nginx** - 反向代理
- **Docker** - 容器化

---

## 📖 如何使用本教程

1. **按顺序学习** - 建议从第 1 章开始，循序渐进
2. **动手实践** - 每章都有代码示例，务必亲自运行
3. **完成练习** - 每章末尾有练习题，巩固知识
4. **查阅官方文档** - 遇到问题时参考官方文档
5. **参与社区** - 加入 Django 中文社区交流

---

## 🔗 相关资源

- [Django 官方文档](https://docs.djangoproject.com/zh-hans/5.2/)
- [DRF 官方文档](https://www.django-rest-framework.org/)
- [Django 中文社区](https://www.django.cn/)
- [Awesome Django](https://github.com/wsvincent/awesome-django)

---

## 📝 许可证

本教程采用 MIT 许可证开源。

---

**准备好了吗？让我们开始 Django 之旅！** 🚀

[下一章：第1章 - 环境搭建与项目初始化 →](./1、环境搭建与项目初始化.md)
