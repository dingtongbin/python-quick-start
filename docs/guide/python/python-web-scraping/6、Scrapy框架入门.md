# 第6章：Scrapy 框架入门

本章将学习 Python 最强大的爬虫框架 Scrapy，掌握其核心概念和基本用法。

---

## 6.1 为什么选择 Scrapy？

### Scrapy 的优势

✅ **高性能** - 基于 Twisted 异步网络库
✅ **可扩展** - 模块化设计，易于扩展
✅ **功能完整** - 内置去重、中间件、Pipeline
✅ **生态丰富** - 大量插件和工具
✅ **生产就绪** - 广泛用于工业级项目

### Scrapy vs requests

| 特性 | Scrapy | requests |
|------|--------|----------|
| 性能 | 高（异步） | 中（同步） |
| 易用性 | 中等 | 简单 |
| 功能 | 完整框架 | HTTP 库 |
| 适用场景 | 大型项目 | 小型脚本 |

---

## 6.2 安装 Scrapy

```bash
pip install scrapy==2.11.0
```

验证安装：

```bash
scrapy version
# Scrapy 2.11.0
```

---

## 6.3 创建项目

```bash
# 创建项目
scrapy startproject mycrawler

# 目录结构
mycrawler/
├── scrapy.cfg              # 部署配置
└── mycrawler/
    ├── __init__.py
    ├── items.py            # 数据模型
    ├── middlewares.py      # 中间件
    ├── pipelines.py        # 数据处理管道
    ├── settings.py         # 配置文件
    └── spiders/            # 爬虫目录
        └── __init__.py
```

---

## 6.4 创建 Spider

```bash
# 进入项目目录
cd mycrawler

# 创建 Spider
scrapy genspider example example.com
```

生成的文件 `mycrawler/spiders/example.py`：

```python
import scrapy

class ExampleSpider(scrapy.Spider):
    name = 'example'
    allowed_domains = ['example.com']
    start_urls = ['http://example.com/']
    
    def parse(self, response):
        pass
```

---

## 6.5 Spider 详解

### 基本属性

```python
import scrapy

class MySpider(scrapy.Spider):
    name = 'myspider'              # Spider 名称（唯一）
    allowed_domains = ['example.com']  # 允许的域名
    start_urls = [                  # 起始 URL
        'http://example.com/page1',
        'http://example.com/page2',
    ]
    custom_settings = {             # 自定义设置
        'DOWNLOAD_DELAY': 1,
    }
```

### parse 方法

```python
def parse(self, response):
    """解析响应"""
    
    # 提取数据
    title = response.css('h1::text').get()
    
    # 生成 Item
    yield {
        'title': title,
        'url': response.url
    }
    
    # 跟进链接
    for href in response.css('a::attr(href)').getall():
        yield response.follow(href, self.parse)
```

---

## 6.6 选择器（Selectors）

### CSS 选择器

```python
# 获取单个元素
response.css('h1::text').get()
response.css('div.article').get()

# 获取所有元素
response.css('a::attr(href)').getall()
response.css('div.item').getall()

# 链式调用
response.css('div.article').css('h2::text').get()

# 正则匹配
response.css('a::text').re(r'\d+')
```

### XPath 选择器

```python
# 基本 XPath
response.xpath('//h1/text()').get()
response.xpath('//a/@href').getall()

# 条件过滤
response.xpath('//div[@class="article"]').get()
response.xpath('//a[contains(@href, "page")]').getall()

# 文本匹配
response.xpath('//a[text()="下一页"]/@href').get()

# 位置
response.xpath('//div[@class="item"][1]').get()
```

### 混合使用

```python
# CSS + XPath
response.css('div.article').xpath('.//h2/text()').get()

# 提取属性
response.css('img::attr(src)').get()
response.xpath('//img/@src').get()

# 提取文本
response.css('p::text').getall()
response.xpath('//p/text()').getall()
```

---

## 6.7 Item 定义

### 定义 Item

编辑 `items.py`：

```python
import scrapy

class NewsItem(scrapy.Item):
    title = scrapy.Field()
    url = scrapy.Field()
    author = scrapy.Field()
    publish_time = scrapy.Field()
    content = scrapy.Field()
    tags = scrapy.Field()
```

### 使用 Item

```python
from mycrawler.items import NewsItem

def parse(self, response):
    item = NewsItem()
    
    item['title'] = response.css('h1::text').get()
    item['url'] = response.url
    item['author'] = response.css('span.author::text').get()
    
    yield item
```

---

## 6.8 Pipeline 数据处理

### 基本 Pipeline

编辑 `pipelines.py`：

```python
class MycrawlerPipeline:
    def process_item(self, item, spider):
        # 处理 item
        print(f"处理: {item['title']}")
        return item
```

### 保存到 JSON

```python
import json

class JsonPipeline:
    def open_spider(self, spider):
        self.file = open('results.json', 'w', encoding='utf-8')
        self.items = []
    
    def close_spider(self, spider):
        json.dump(self.items, self.file, ensure_ascii=False, indent=2)
        self.file.close()
    
    def process_item(self, item, spider):
        self.items.append(dict(item))
        return item
```

### 保存到数据库

```python
import pymysql

class MySQLPipeline:
    def open_spider(self, spider):
        self.connection = pymysql.connect(
            host='localhost',
            user='root',
            password='password',
            database='crawler_db',
            charset='utf8mb4'
        )
        self.cursor = self.connection.cursor()
    
    def close_spider(self, spider):
        self.connection.commit()
        self.cursor.close()
        self.connection.close()
    
    def process_item(self, item, spider):
        sql = """
        INSERT INTO news (title, url, author, publish_time)
        VALUES (%s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE title=VALUES(title)
        """
        
        self.cursor.execute(sql, (
            item.get('title'),
            item.get('url'),
            item.get('author'),
            item.get('publish_time')
        ))
        
        return item
```

### 启用 Pipeline

编辑 `settings.py`：

```python
ITEM_PIPELINES = {
    'mycrawler.pipelines.MycrawlerPipeline': 300,
    'mycrawler.pipelines.JsonPipeline': 400,
    'mycrawler.pipelines.MySQLPipeline': 500,
}
```

数字越小，优先级越高。

---

## 6.9 中间件（Middleware）

### Downloader Middleware

编辑 `middlewares.py`：

```python
class RandomUserAgentMiddleware:
    """随机 User-Agent"""
    
    def __init__(self):
        self.user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ...',
        ]
    
    def process_request(self, request, spider):
        import random
        request.headers['User-Agent'] = random.choice(self.user_agents)
```

### Proxy Middleware

```python
class ProxyMiddleware:
    """代理中间件"""
    
    def process_request(self, request, spider):
        request.meta['proxy'] = 'http://proxy.example.com:8080'
```

### 启用中间件

```python
DOWNLOADER_MIDDLEWARES = {
    'mycrawler.middlewares.RandomUserAgentMiddleware': 543,
    'mycrawler.middlewares.ProxyMiddleware': 544,
}
```

---

## 6.10 实战：新闻爬虫

### 完整项目

#### items.py

```python
import scrapy

class NewsItem(scrapy.Item):
    title = scrapy.Field()
    url = scrapy.Field()
    author = scrapy.Field()
    publish_time = scrapy.Field()
    summary = scrapy.Field()
    category = scrapy.Field()
```

#### spiders/news.py

```python
import scrapy
from mycrawler.items import NewsItem

class NewsSpider(scrapy.Spider):
    name = 'news'
    allowed_domains = ['news.example.com']
    start_urls = ['http://news.example.com/']
    
    def parse(self, response):
        # 提取新闻列表
        for article in response.css('article.news-item'):
            item = NewsItem()
            
            # 标题和链接
            title_tag = article.css('h2.title a')
            item['title'] = title_tag.css('::text').get()
            item['url'] = title_tag.css('::attr(href)').get()
            
            # 作者
            item['author'] = article.css('span.author::text').get()
            
            # 时间
            item['publish_time'] = article.css('time::text').get()
            
            # 摘要
            item['summary'] = article.css('p.summary::text').get()
            
            # 分类
            item['category'] = article.css('span.category::text').get()
            
            yield item
        
        # 分页
        next_page = response.css('a.next-page::attr(href)').get()
        if next_page:
            yield response.follow(next_page, self.parse)
```

#### pipelines.py

```python
import json

class NewsPipeline:
    def open_spider(self, spider):
        self.file = open('news.json', 'w', encoding='utf-8')
        self.count = 0
    
    def close_spider(self, spider):
        self.file.close()
        print(f"共爬取 {self.count} 条新闻")
    
    def process_item(self, item, spider):
        self.file.write(json.dumps(dict(item), ensure_ascii=False) + '\n')
        self.count += 1
        return item
```

#### settings.py

```python
BOT_NAME = 'mycrawler'

SPIDER_MODULES = ['mycrawler.spiders']

# 遵守 robots.txt
ROBOTSTXT_OBEY = True

# 并发请求数
CONCURRENT_REQUESTS = 16

# 下载延迟
DOWNLOAD_DELAY = 1

# 禁用 Cookie
COOKIES_ENABLED = False

# User-Agent
USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...'

# Pipeline
ITEM_PIPELINES = {
    'mycrawler.pipelines.NewsPipeline': 300,
}

# 日志级别
LOG_LEVEL = 'INFO'
```

### 运行爬虫

```bash
# 运行
scrapy crawl news

# 输出到文件
scrapy crawl news -o news.json

# 指定格式
scrapy crawl news -o news.csv
scrapy crawl news -o news.xml

# 显示日志
scrapy crawl news --logfile=crawler.log
```

---

## 6.11 调试技巧

### Shell 调试

```bash
# 启动 Shell
scrapy shell http://example.com

# 测试选择器
>>> response.css('h1::text').get()
>>> response.xpath('//a/@href').getall()
```

### 日志调试

```python
def parse(self, response):
    self.logger.info(f"URL: {response.url}")
    self.logger.debug(f"Status: {response.status}")
```

### 查看请求

```bash
# 显示详细日志
scrapy crawl news --loglevel=DEBUG
```

---

## 6.12 本章小结

✅ **Scrapy 介绍** - 优势、安装
✅ **项目结构** - 创建项目、Spider
✅ **选择器** - CSS、XPath
✅ **Item** - 数据模型定义
✅ **Pipeline** - 数据处理
✅ **Middleware** - 请求/响应处理
✅ **实战项目** - 新闻爬虫
✅ **调试技巧** - Shell、日志

---

## 📝 练习题

### 练习 1：博客爬虫

创建一个博客爬虫：
- 爬取文章列表
- 提取标题、作者、日期
- 分页处理
- 保存到 JSON

### 练习 2：电商爬虫

爬取电商网站商品：
- 商品名称、价格、评分
- 图片 URL
- 多页面爬取
- 数据清洗

### 练习 3：自定义 Pipeline

实现一个 Pipeline：
- 数据验证
- 去重
- 保存到 MySQL
- 统计信息

---

## 🔗 相关资源

- [Scrapy 官方文档](https://docs.scrapy.org/)
- [Scrapy 教程](https://docs.scrapy.org/en/latest/intro/tutorial.html)
- [选择器文档](https://docs.scrapy.org/en/latest/topics/selectors.html)

---

**下一章：** [第7章 - Scrapy 进阶 →](./7、Scrapy进阶.md)
