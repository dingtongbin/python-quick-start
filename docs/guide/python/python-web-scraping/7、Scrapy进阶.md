# 第7章：Scrapy进阶

本章深入学习 Scrapy 的高级功能，包括 Request/Response、链接提取、去重、分布式爬虫等。

---

## 7.1 Request 与 Response

### Request 对象

```python
import scrapy

class MySpider(scrapy.Spider):
    name = 'myspider'
    
    def start_requests(self):
        urls = ['http://example.com/page1', 'http://example.com/page2']
        
        for url in urls:
            yield scrapy.Request(
                url=url,
                callback=self.parse,
                method='GET',
                headers={'User-Agent': 'Mozilla/5.0'},
                cookies={'session': 'abc123'},
                meta={'page': 1},  # 传递元数据
                dont_filter=False  # 是否去重
            )
    
    def parse(self, response):
        page = response.meta.get('page')
        self.logger.info(f"Page {page}: {response.url}")
```

### Response 对象

```python
def parse(self, response):
    # 基本信息
    print(response.url)
    print(response.status)
    print(response.headers)
    print(response.body)
    print(response.text)
    
    # 编码
    print(response.encoding)
    response.encoding = 'utf-8'
    
    # 跟随链接
    yield response.follow('/next-page', self.parse)
    
    # 绝对 URL
    from urllib.parse import urljoin
    absolute_url = urljoin(response.url, '/relative/path')
```

### 传递数据

```python
def parse_page1(self, response):
    item = {}
    item['title'] = response.css('h1::text').get()
    
    # 传递 item 到下一个回调
    yield response.follow(
        '/detail',
        callback=self.parse_detail,
        meta={'item': item}
    )

def parse_detail(self, response):
    # 接收传递的 item
    item = response.meta['item']
    item['content'] = response.css('div.content::text').get()
    
    yield item
```

---

## 7.2 链接提取器

### LinkExtractor

```python
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule

class MyCrawlSpider(CrawlSpider):
    name = 'crawlspider'
    start_urls = ['http://example.com/']
    
    rules = (
        # 规则 1：提取分类链接
        Rule(
            LinkExtractor(
                allow=r'/category/\d+',
                restrict_css='div.categories'
            ),
            follow=True
        ),
        
        # 规则 2：提取文章链接并解析
        Rule(
            LinkExtractor(
                allow=r'/article/\d+',
                restrict_xpaths='//div[@class="articles"]'
            ),
            callback='parse_article',
            follow=False
        ),
    )
    
    def parse_article(self, response):
        yield {
            'title': response.css('h1::text').get(),
            'url': response.url
        }
```

### LinkExtractor 参数

```python
LinkExtractor(
    allow=r'/pattern/',          # 允许的 URL 模式（正则）
    deny=r'/admin/',             # 禁止的 URL 模式
    allow_domains=['example.com'],  # 允许的域名
    deny_domains=['ads.com'],    # 禁止的域名
    restrict_css='div.content',  # CSS 选择器限制
    restrict_xpaths='//div',     # XPath 限制
    tags=('a', 'area'),          # 提取的标签
    attrs=('href',),             # 提取的属性
    canonicalize=True,           # URL 标准化
    unique=True                  # 去重
)
```

---

## 7.3 去重机制

### 内置去重

Scrapy 默认启用去重，基于 URL 的指纹。

```python
# 禁用去重
yield scrapy.Request(url, dont_filter=True)

# 自定义去重
from scrapy.dupefilters import RFPDupeFilter

class CustomDupeFilter(RFPDupeFilter):
    def request_fingerprint(self, request):
        # 自定义指纹算法
        return super().request_fingerprint(request)
```

### 基于内容的去重

```python
import hashlib

class ContentDupeFilter:
    def __init__(self):
        self.seen = set()
    
    def is_duplicate(self, item):
        # 基于内容生成指纹
        content = f"{item['title']}_{item['url']}"
        fingerprint = hashlib.md5(content.encode()).hexdigest()
        
        if fingerprint in self.seen:
            return True
        
        self.seen.add(fingerprint)
        return False
```

---

## 7.4 分布式爬虫

### Scrapyd

#### 安装

```bash
pip install scrapyd
pip install scrapyd-client
```

#### 配置

`scrapyd.conf`：

```ini
[scrapyd]
eggs_dir    = eggs
logs_dir    = logs
items_dir   = items
jobs_to_keep = 5
dbs_dir     = dbs
max_proc    = 0
bind_address = 0.0.0.0
port        = 6800
```

#### 部署

```bash
# 添加目标
scrapyd-deploy -l target http://localhost:6800

# 部署项目
scrapyd-deploy target -p myproject

# 运行爬虫
curl http://localhost:6800/schedule.json -d project=myproject -d spider=news

# 查看状态
curl http://localhost:6800/listjobs.json?project=myproject
```

### Scrapy-Redis

#### 安装

```bash
pip install scrapy-redis
```

#### 配置

```python
# settings.py

# 使用 Redis 去重
DUPEFILTER_CLASS = "scrapy_redis.dupefilter.RFPDupeFilter"

# 使用 Redis 队列
SCHEDULER = "scrapy_redis.scheduler.Scheduler"

# 持久化队列
SCHEDULER_PERSIST = True

# Redis 连接
REDIS_URL = 'redis://localhost:6379'

# 或者
REDIS_HOST = 'localhost'
REDIS_PORT = 6379
```

#### Spider

```python
from scrapy_redis.spiders import RedisSpider

class MyRedisSpider(RedisSpider):
    name = 'my_redis_spider'
    redis_key = 'my_spider:start_urls'
    
    def parse(self, response):
        # 正常解析
        yield {...}
```

#### 启动

```bash
# 在 Redis 中添加起始 URL
redis-cli lpush my_spider:start_urls http://example.com

# 启动爬虫
scrapy crawl my_redis_spider
```

---

## 7.5 信号（Signals）

```python
from scrapy import signals

class MyExtension:
    def __init__(self):
        pass
    
    @classmethod
    def from_crawler(cls, crawler):
        ext = cls()
        
        # 注册信号
        crawler.signals.connect(ext.spider_opened, signal=signals.spider_opened)
        crawler.signals.connect(ext.spider_closed, signal=signals.spider_closed)
        crawler.signals.connect(ext.item_scraped, signal=signals.item_scraped)
        
        return ext
    
    def spider_opened(self, spider):
        spider.logger.info('Spider opened')
    
    def spider_closed(self, spider):
        spider.logger.info('Spider closed')
    
    def item_scraped(self, item, spider):
        spider.logger.info(f'Item scraped: {item}')
```

---

## 7.6 扩展（Extensions）

```python
# extensions.py

class StatsExtension:
    def __init__(self, stats):
        self.stats = stats
    
    @classmethod
    def from_crawler(cls, crawler):
        return cls(crawler.stats)
    
    def spider_opened(self, spider):
        self.stats.set_value('custom/start_time', datetime.now())
    
    def spider_closed(self, spider):
        self.stats.set_value('custom/end_time', datetime.now())
```

启用扩展：

```python
EXTENSIONS = {
    'mycrawler.extensions.StatsExtension': 500,
}
```

---

## 7.7 Feed Exports

### 导出格式

```bash
# JSON
scrapy crawl news -o news.json

# JSON Lines
scrapy crawl news -o news.jl

# CSV
scrapy crawl news -o news.csv

# XML
scrapy crawl news -o news.xml

# Pickle
scrapy crawl news -o news.pickle
```

### 配置导出

```python
# settings.py

FEEDS = {
    'news_%(time)s.json': {
        'format': 'json',
        'encoding': 'utf-8',
        'indent': 2,
    },
    'news_%(time)s.csv': {
        'format': 'csv',
    },
}
```

---

## 7.8 监控与统计

### 查看统计

```bash
# 运行结束后显示统计
scrapy crawl news --set LOG_LEVEL=INFO
```

### 自定义统计

```python
def parse(self, response):
    self.crawler.stats.inc_value('pages_scraped')
    self.crawler.stats.inc_value('items_extracted')
```

### Telnet 控制台

```python
# settings.py
TELNETCONSOLE_ENABLED = True

# 连接
telnet localhost 6023
>>> stats.get_stats()
```

---

## 7.9 性能优化

### 并发设置

```python
# settings.py

# 最大并发请求数
CONCURRENT_REQUESTS = 32

# 每域名并发数
CONCURRENT_REQUESTS_PER_DOMAIN = 8

# 每 IP 并发数
CONCURRENT_REQUESTS_PER_IP = 0

# 下载延迟
DOWNLOAD_DELAY = 0.5

# 随机延迟
RANDOMIZE_DOWNLOAD_DELAY = True
```

### 缓存

```python
# 启用 HTTP 缓存
HTTPCACHE_ENABLED = True
HTTPCACHE_DIR = 'httpcache'
HTTPCACHE_EXPIRATION_SECS = 86400  # 1 天
```

### 内存优化

```python
# 限制深度
DEPTH_LIMIT = 5

# 限制爬取页面数
CLOSESPIDER_PAGECOUNT = 1000

# 限制时间
CLOSESPIDER_TIMEOUT = 3600
```

---

## 7.10 实战：完整爬虫项目

### 项目结构

```
advanced_crawler/
├── advanced_crawler/
│   ├── spiders/
│   │   ├── __init__.py
│   │   └── news_spider.py
│   ├── items.py
│   ├── pipelines.py
│   ├── middlewares.py
│   ├── extensions.py
│   └── settings.py
└── scrapy.cfg
```

### 完整代码

详见前面章节的综合示例。

---

## 7.11 本章小结

✅ **Request/Response** - 高级用法
✅ **链接提取器** - CrawlSpider、Rule
✅ **去重机制** - 内置、自定义
✅ **分布式爬虫** - Scrapyd、Scrapy-Redis
✅ **信号系统** - 事件监听
✅ **扩展开发** - 自定义功能
✅ **Feed 导出** - 多种格式
✅ **监控统计** - 性能分析
✅ **性能优化** - 并发、缓存

---

## 📝 练习题

### 练习 1：CrawlSpider

使用 CrawlSpider 重构新闻爬虫：
- 定义 Rules
- 自动跟进链接
- 提取多页面数据

### 练习 2：分布式部署

部署分布式爬虫：
- 安装 Scrapyd
- 配置 Scrapy-Redis
- 多节点运行
- 监控状态

### 练习 3：自定义扩展

创建一个扩展：
- 记录爬取速度
- 发送完成通知
- 生成报告

---

## 🔗 相关资源

- [Scrapy 高级文档](https://docs.scrapy.org/en/latest/topics/practices.html)
- [Scrapy-Redis](https://github.com/rmax/scrapy-redis)
- [Scrapyd](https://scrapyd.readthedocs.io/)

---

**下一章：** [第8章 - 反爬虫策略与应对 →](./8、反爬虫策略与应对.md)
