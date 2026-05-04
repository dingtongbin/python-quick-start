# Django 5 Web 开发实战教程目录（含单元测试）

## 第1章 Django 5 入门与环境配置

1.1 Django 5.0 核心特性概览：异步支持、db_default 等新功能
1.2 Python 与 Django 版本兼容性说明（Python 3.10–3.12）
1.3 使用 pip 创建虚拟环境并安装 Django 5
1.4 第一个 Django 项目：django-admin startproject 详解  

## 第2章 应用结构与 MTV 模式

2.1 创建应用：python manage.py startapp
2.2 MTV 架构解析：Model-Template-View 职责分离
2.3 settings.py 关键配置项解读（INSTALLED_APPS、MIDDLEWARE 等）
2.4 URL 路由系统：path() 与 include() 的使用  

## 第3章 模型层（Model）与数据库

3.1 定义模型类：字段类型与常用选项（max_length、null、blank）
3.2 **Django 5 新特性**：`db_default` 实现数据库级默认值（如 `DateTimeField(db_default=Now())`）
3.3 迁移机制：makemigrations 与 migrate 原理
3.4 模型管理器（objects）与 QuerySet 基础查询  

## 第4章 视图层（View）

4.1 函数视图（FBV）：request 处理与 HttpResponse 返回
4.2 **Django 5 强化**：全面异步视图支持（async def + await ORM 查询）
4.3 类视图（CBV）：ListView、DetailView 快速开发
4.4 视图装饰器与 Mixin 复用逻辑  

## 第5章 模板层（Template）

5.1 模板语法：变量、标签（{% for %}、{% if %}）、过滤器
5.2 模板继承：base.html 与 block 重写
5.3 静态文件管理：{% load static %} 与 STATICFILES_DIRS
5.4 表单渲染：手动 vs {{ form.as_p }}  

## 第6章 表单与数据验证

6.1 Django 表单类（forms.Form）定义与渲染
6.2 模型表单（ModelForm）：自动生成表单字段
6.3 自定义验证：clean() 与 clean_() 方法
6.4 CSRF 保护机制与表单提交安全  

## 第7章 用户认证系统

7.1 内置 User 模型与认证流程
7.2 登录/登出视图：LoginView 与 LogoutView
7.3 用户注册与密码重置实现
7.4 权限与用户组：@login_required 与 has_perm()  

## 第8章 管理后台（Admin）

8.1 注册模型到 admin.site.register()
8.2 自定义 Admin 类：list_display、search_fields、list_filter
8.3 表单定制与只读字段设置
8.4 管理员权限分配与操作日志  

## 第9章 高级 ORM 查询

9.1 跨表查询：ForeignKey 与 select_related/prefetch_related
9.2 聚合与注解：annotate() + Count/Sum/Avg
9.3 Q 对象实现复杂条件查询（OR/AND/NOT）
9.4 原生 SQL 执行：raw() 与 extra()（谨慎使用）  

## 第10章 单元测试与测试驱动开发（TDD）

10.1 Django 测试框架基础：TestCase 与 Client
10.2 模型测试：验证字段约束、方法逻辑与保存行为
10.3 视图测试：状态码、模板使用、上下文数据断言
10.4 表单测试：有效/无效数据输入与错误消息验证
10.5 异步测试支持（Django 5）：AsyncTestCase 与异步客户端
10.6 测试覆盖率检查：coverage.py 集成与报告生成  

## 第11章 异步与性能优化

11.1 **Django 5 重点**：异步 ORM 查询（await MyModel.objects.acreate()）
11.2 缓存机制：内存缓存、Redis 集成与 cache_page 装饰器
11.3 数据库索引优化：db_index 与 Meta.indexes
11.4 分页处理：Paginator 与性能权衡  

## 第12章 部署与生产环境

12.1 DEBUG=False 配置与静态文件收集（collectstatic）
12.2 使用 Gunicorn + Nginx 部署 Django 5 应用
12.3 环境变量管理：python-decouple 或 dotenv
12.4 HTTPS 配置与安全头（SECURE_HSTS_SECONDS 等）  

## 第13章 综合项目实战

13.1 博客系统：文章发布、评论、分类（含完整测试用例）
13.2 电商商品展示：分页、搜索、购物车（会话实现 + 测试覆盖）
13.3 API 接口开发：结合 Django REST Framework（可选扩展）
13.4 日志监控与错误告警配置  