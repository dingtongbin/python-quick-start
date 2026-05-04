# 第10章 Scrapy 框架入门

## 10.1 Scrapy 架构：Spider、Item、Pipeline、Middleware

Scrapy 是一个用 Python 编写的快速、高级的 Web 爬虫和抓取框架，用于抓取网站并从其页面中提取结构化数据。它被广泛应用于数据挖掘、监控和自动化测试等领域。

Scrapy 的核心架构由四个主要组件构成：

- **Spider**：定义了如何抓取某个（某些）网站。包括了抓取的动作（例如，是否跟进链接）以及如何从网页的内容中解析结构化数据。
- **Item**：定义了要抓取的数据结构，类似于字典，但提供了额外的保护措施来防止拼写错误的字段名。
- **Pipeline**：处理由 Spider 提取出来的 Item。典型的处理包括清理 HTML 数据、验证爬取的数据（检查 item 是否包含某些字段）、重复检查、将爬取结果保存到数据库等。
- **Middleware**：介于 Scrapy 引擎和其他组件之间的钩子框架。可以自定义下载器中间件（Downloader Middleware）来处理请求和响应，也可以自定义 Spider 中间件（Spider Middleware）来处理输入/输出的响应和 items。

下面是一个简单的 Scrapy 项目结构示例：

```
myproject/
    scrapy.cfg
    myproject/
        __init__.py
        items.py
        pipelines.py
        settings.py
        spiders/
            __init__.py
            example_spider.py
```

### 实例方法表格

| 功能名称         | 实例调用方法                          | 具体功能、注意事项、必需参数/可选参数                        |
| ---------------- | ------------------------------------- | ------------------------------------------------------------ |
| 创建 Scrapy 项目 | `scrapy startproject project_name`    | 必需参数：项目名称；会在当前目录下创建一个名为 project_name 的文件夹 |
| 创建 Spider      | `scrapy genspider spider_name domain` | 必需参数：spider 名称和域名；会在 spiders 目录下创建一个 spider 文件 |
| 运行 Spider      | `scrapy crawl spider_name`            | 必需参数：spider 名称；会运行指定的 spider                   |

### 使用示例

```python
# items.py
import scrapy

class MyItem(scrapy.Item):
    # 定义要抓取的数据字段
    title = scrapy.Field()  # 文章标题
    url = scrapy.Field()    # 文章链接
    content = scrapy.Field()  # 文章内容
# spiders/example_spider.py
import scrapy
from myproject.items import MyItem

class ExampleSpider(scrapy.Spider):
    name = 'example'  # Spider 的唯一标识符
    allowed_domains = ['example.com']  # 允许爬取的域名
    start_urls = ['http://example.com/']  # 初始 URL 列表
    
    def parse(self, response):
        """
        解析响应的方法
        :param response: Response 对象，包含下载的页面内容
        :return: 可以返回 Item、Request 或 None
        """
        # 创建 Item 实例
        item = MyItem()
        # 提取数据
        item['title'] = response.css('h1::text').get()
        item['url'] = response.url
        item['content'] = response.css('div.content::text').getall()
        # 返回 Item 供 Pipeline 处理
        yield item
        
        # 跟进链接
        for next_page in response.css('a.next::attr(href)'):
            yield response.follow(next_page, self.parse)
# pipelines.py
class MyPipeline:
    def process_item(self, item, spider):
        """
        处理 Item 的方法
        :param item: 从 Spider 返回的 Item
        :param spider: 抓取该 Item 的 Spider
        :return: 处理后的 Item 或抛出 DropItem 异常
        """
        # 验证数据
        if not item.get('title'):
            raise DropItem("Missing title in %s" % item)
        
        # 清理数据
        item['content'] = ' '.join(item['content']).strip()
        
        # 保存到数据库或其他存储
        # self.save_to_database(item)
        
        return item
```

### 注意事项

1. Scrapy 项目必须通过 `scrapy startproject` 命令创建，不能手动创建目录结构。
2. Spider 的 `name` 属性必须是唯一的，不能与其他 Spider 重名。
3. 在 `settings.py` 中需要启用 Pipeline（取消注释并设置优先级）才能使 Pipeline 生效。
4. Scrapy 默认遵循 robots.txt 协议，可以通过设置 `ROBOTSTXT_OBEY = False` 来禁用。
5. Scrapy 内置了强大的选择器（Selector），支持 CSS 和 XPath 两种方式提取数据。

Scrapy 架构通过将不同功能模块化，使得爬虫开发更加清晰、可维护性更高。Spider 负责抓取逻辑，Item 定义数据结构，Pipeline 处理数据，Middleware 处理请求和响应的中间过程，这种分离关注点的设计模式让复杂爬虫项目变得易于管理。

## 10.2 创建项目与定义 Item 结构

在 Scrapy 中，Item 是用来定义我们想要抓取的数据结构的容器。它类似于 Python 字典，但提供了额外的保护措施，比如防止拼写错误的字段名，并且可以定义字段的元数据。

### 创建 Scrapy 项目

首先，我们需要创建一个新的 Scrapy 项目。打开终端，执行以下命令：

```bash
scrapy startproject bookscraper
```

这将创建一个名为 `bookscraper` 的新目录，其中包含以下文件结构：

```
bookscraper/
    scrapy.cfg
    bookscraper/
        __init__.py
        items.py
        middlewares.py
        pipelines.py
        settings.py
        spiders/
            __init__.py
```

### 定义 Item 结构

接下来，我们需要在 `items.py` 文件中定义我们要抓取的数据结构。假设我们要抓取图书信息，包括书名、价格、库存状态和评分。

```python
# bookscraper/items.py
import scrapy

class BookItem(scrapy.Item):
    """
    定义图书信息的 Item 结构
    """
    # 书名
    title = scrapy.Field()
    # 价格
    price = scrapy.Field()
    # 库存状态
    stock = scrapy.Field()
    # 评分（1-5星）
    rating = scrapy.Field()
    # 书籍链接
    url = scrapy.Field()
```

每个字段都使用 `scrapy.Field()` 来定义。Field 可以接受一些参数来提供额外的元数据，例如：

```python
title = scrapy.Field(
    serializer=str,  # 序列化函数
    default="",      # 默认值
    required=True    # 是否必需
)
```

不过，在大多数情况下，我们只需要简单地定义字段名即可。

### 启用 Item Pipeline

为了让我们的 Item 能够被 Pipeline 处理，我们需要在 `settings.py` 中启用 Pipeline。找到以下部分并取消注释：

```python
# bookscraper/settings.py
ITEM_PIPELINES = {
    'bookscraper.pipelines.BookscraperPipeline': 300,
}
```

这里的数字 `300` 表示 Pipeline 的执行顺序（优先级），数字越小优先级越高。

### 实例方法表格

| 功能名称       | 实例调用方法                                     | 具体功能、注意事项、必需参数/可选参数                        |
| -------------- | ------------------------------------------------ | ------------------------------------------------------------ |
| 定义 Item 字段 | `field_name = scrapy.Field()`                    | 在 Item 类中定义字段；Field 可以接受 serializer、default、required 等参数 |
| 访问 Item 字段 | `item['field_name']` 或 `item.get('field_name')` | 类似字典的访问方式；get 方法可以提供默认值                   |
| 验证 Item      | 在 Pipeline 中检查字段是否存在                   | 通常在 Pipeline 的 process_item 方法中进行验证               |

### 使用示例

```python
# 示例：创建和使用 Item
from bookscraper.items import BookItem

def create_book_item():
    """
    创建一个 BookItem 实例并填充数据
    """
    # 创建 Item 实例
    book = BookItem()
    
    # 填充数据
    book['title'] = "Python 爬虫实战"
    book['price'] = "¥59.00"
    book['stock'] = "In stock (10 available)"
    book['rating'] = "4"
    book['url'] = "https://example.com/book/123"
    
    return book

# 使用示例
try:
    book_item = create_book_item()
    print(f"书名: {book_item['title']}")
    print(f"价格: {book_item.get('price', '未知')}")
    
    # 尝试访问不存在的字段
    author = book_item.get('author', '未知作者')
    print(f"作者: {author}")
    
except KeyError as e:
    print(f"字段不存在: {e}")
```

### 注意事项

1. Item 字段名应该是描述性的，并且在整个项目中保持一致。
2. 虽然 Item 类似于字典，但它不支持所有字典方法。例如，它没有 `keys()`、`values()` 或 `items()` 方法。
3. 在 Pipeline 中处理 Item 时，应该验证必需字段是否存在，避免后续处理出错。
4. Item 可以嵌套，即一个 Item 的字段可以是另一个 Item 或 Item 列表，适用于复杂的数据结构。
5. 如果需要对字段进行类型转换或验证，可以在 Field 定义中使用 serializer 参数，或者在 Pipeline 中处理。

定义清晰的 Item 结构是 Scrapy 项目成功的关键一步。它不仅帮助我们组织数据，还使得后续的数据处理和存储变得更加简单和可靠。通过明确指定我们要抓取的数据字段，我们可以确保爬虫只收集我们需要的信息，避免不必要的数据冗余。

## 10.3 编写 Spider 解析响应并生成 Item

Spider 是 Scrapy 框架中最核心的组件之一，它定义了如何抓取特定网站（或者一组网站）的逻辑。Spider 负责发送请求、接收响应，并从中提取结构化数据（Items）或更多的 URL。

### Spider 基本结构

每个 Spider 必须定义以下三个属性：

- `name`: Spider 的名称，必须是唯一的。
- `start_urls`: 初始 URL 列表，Scrapy 会自动为这些 URL 发送请求。
- `parse()`: 解析响应的方法，处理下载的响应并返回 Item 或新的请求。

### 编写基本 Spider

让我们以抓取书籍信息为例，编写一个简单的 Spider：

```python
# bookscraper/spiders/books_spider.py
import scrapy
from bookscraper.items import BookItem

class BooksSpider(scrapy.Spider):
    """
    抓取书籍信息的 Spider
    """
    # Spider 的唯一名称
    name = 'books'
    
    # 允许爬取的域名（可选）
    allowed_domains = ['books.toscrape.com']
    
    # 初始 URL 列表
    start_urls = ['http://books.toscrape.com/']
    
    def parse(self, response):
        """
        解析首页响应，提取书籍链接并跟进
        :param response: 下载的响应对象
        """
        # 使用 CSS 选择器提取所有书籍的链接
        book_links = response.css('article.product_pod h3 a::attr(href)').getall()
        
        # 遍历每个书籍链接
        for link in book_links:
            # 使用 response.follow() 跟进链接，自动处理相对 URL
            yield response.follow(link, self.parse_book)
        
        # 提取下一页链接并跟进
        next_page = response.css('li.next a::attr(href)').get()
        if next_page is not None:
            yield response.follow(next_page, self.parse)
    
    def parse_book(self, response):
        """
        解析单个书籍页面，提取详细信息
        :param response: 书籍页面的响应对象
        :return: BookItem 实例
        """
        # 创建 BookItem 实例
        item = BookItem()
        
        # 提取书籍信息
        item['title'] = response.css('div.product_main h1::text').get()
        item['price'] = response.css('p.price_color::text').get()
        item['stock'] = response.css('p.instock.availability::text').re_first(r'$(\d+) available$')
        item['rating'] = response.css('p.star-rating::attr(class)').re_first(r'star-rating (\w+)')
        item['url'] = response.url
        
        # 返回 Item 供 Pipeline 处理
        yield item
```

### 使用 XPath 和 CSS 选择器

Scrapy 提供了两种强大的选择器：CSS 和 XPath。我们可以根据需要选择合适的方式：

```python
# CSS 选择器示例
title = response.css('h1::text').get()  # 获取第一个 h1 标签的文本
prices = response.css('.price::text').getall()  # 获取所有 class="price" 的元素文本

# XPath 选择器示例
title = response.xpath('//h1/text()').get()  # 获取第一个 h1 标签的文本
prices = response.xpath('//span[@class="price"]/text()').getall()  # 获取所有 class="price" 的 span 元素文本
```

### 处理相对 URL

在网页中，链接通常是相对 URL。Scrapy 提供了 `response.follow()` 方法来自动处理相对 URL：

```python
# 自动处理相对 URL
yield response.follow(relative_url, callback=self.parse_book)

# 也可以直接传递选择器
yield response.follow(response.css('a.next::attr(href)').get(), self.parse)
```

### 实例方法表格

| 功能名称       | 实例调用方法                                                 | 具体功能、注意事项、必需参数/可选参数         |
| -------------- | ------------------------------------------------------------ | --------------------------------------------- |
| 提取单个元素   | `response.css('selector::text').get()` 或 `response.xpath('xpath').get()` | 返回第一个匹配元素的文本；如果无匹配返回 None |
| 提取多个元素   | `response.css('selector::text').getall()` 或 `response.xpath('xpath').getall()` | 返回所有匹配元素的文本列表                    |
| 提取属性值     | `response.css('selector::attr(attribute)').get()`            | 提取元素的指定属性值                          |
| 正则表达式提取 | `response.css('selector::text').re(pattern)`                 | 使用正则表达式从文本中提取数据                |
| 跟进链接       | `response.follow(url, callback)`                             | 自动处理相对 URL 并发送新请求                 |

### 使用示例

```python
# 完整的 Spider 示例，包含错误处理
import scrapy
from bookscraper.items import BookItem
import logging

class RobustBooksSpider(scrapy.Spider):
    name = 'robust_books'
    allowed_domains = ['books.toscrape.com']
    start_urls = ['http://books.toscrape.com/']
    
    def parse(self, response):
        """
        解析首页，提取书籍链接
        """
        try:
            # 检查页面是否正常加载
            if response.status != 200:
                self.logger.warning(f"页面加载失败: {response.url}, 状态码: {response.status}")
                return
            
            # 提取书籍链接
            book_links = response.css('article.product_pod h3 a::attr(href)').getall()
            
            if not book_links:
                self.logger.warning(f"未找到书籍链接: {response.url}")
                return
            
            # 跟进每个书籍链接
            for link in book_links:
                yield response.follow(link, self.parse_book)
            
            # 跟进下一页
            next_page = response.css('li.next a::attr(href)').get()
            if next_page:
                yield response.follow(next_page, self.parse)
            else:
                self.logger.info("已到达最后一页")
                
        except Exception as e:
            self.logger.error(f"解析首页时出错: {e}, URL: {response.url}")
    
    def parse_book(self, response):
        """
        解析书籍详情页
        """
        try:
            item = BookItem()
            
            # 安全提取数据，提供默认值
            item['title'] = response.css('div.product_main h1::text').get(default='').strip()
            item['price'] = response.css('p.price_color::text').get(default='').strip()
            item['stock'] = response.css('p.instock.availability::text').re_first(r'$(\d+) available$', '0')
            item['rating'] = response.css('p.star-rating::attr(class)').re_first(r'star-rating (\w+)', 'No rating')
            item['url'] = response.url
            
            # 验证必要字段
            if not item['title']:
                self.logger.warning(f"书籍标题为空: {response.url}")
                return
            
            yield item
            
        except Exception as e:
            self.logger.error(f"解析书籍页面时出错: {e}, URL: {response.url}")
```

### 注意事项

1. `parse()` 方法是 Spider 的默认回调方法，用于处理 `start_urls` 中的初始请求。
2. 使用 `yield` 而不是 `return` 来返回 Item 或 Request，这样可以让 Scrapy 异步处理它们。
3. `response.follow()` 比直接创建 `scrapy.Request` 更方便，因为它会自动处理相对 URL。
4. 在提取数据时，始终考虑页面结构可能变化的情况，使用默认值或异常处理来增强健壮性。
5. 不要在一个方法中做太多事情，将复杂的解析逻辑分解成多个小方法。
6. 使用 Scrapy 的日志系统（`self.logger`）来记录重要信息，而不是使用 `print()`。

编写 Spider 是 Scrapy 项目的核心工作。通过合理设计解析逻辑，我们可以高效地从网页中提取所需的数据。记住，好的 Spider 应该是健壮的、可维护的，并且能够处理各种异常情况。

## 10.4 使用 Pipeline 存储数据到数据库

Pipeline 是 Scrapy 中处理提取出来的 Item 的组件。每个 Item 在被 Spider 生成后，会依次经过所有启用的 Pipeline 组件进行处理。常见的 Pipeline 用途包括：

- 清理 HTML 数据
- 验证爬取的数据（检查 Item 是否包含某些字段）
- 重复检查
- 将爬取结果保存到数据库

### 基本 Pipeline 结构

每个 Pipeline 组件必须实现 `process_item()` 方法：

```python
def process_item(self, item, spider):
    """
    处理 Item 的方法
    :param item: 从 Spider 返回的 Item
    :param spider: 抓取该 Item 的 Spider
    :return: 处理后的 Item 或抛出 DropItem 异常
    """
    # 处理逻辑
    return item
```

如果 `process_item()` 方法返回一个 Item，那么该 Item 会被发送到下一个 Pipeline 组件。如果抛出 `DropItem` 异常，该 Item 就会被丢弃。

### 数据库存储 Pipeline

让我们创建一个将数据存储到 SQLite 数据库的 Pipeline：

```python
# bookscraper/pipelines.py
import sqlite3
from itemadapter import ItemAdapter
from scrapy.exceptions import DropItem

class SQLitePipeline:
    """
    将 Item 存储到 SQLite 数据库的 Pipeline
    """
    
    def __init__(self):
        self.connection = None
        self.cursor = None
    
    def open_spider(self, spider):
        """
        Spider 打开时调用，初始化数据库连接
        :param spider: 当前 Spider 实例
        """
        # 创建数据库连接
        self.connection = sqlite3.connect('books.db')
        self.cursor = self.connection.cursor()
        
        # 创建表（如果不存在）
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS books (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                price TEXT,
                stock INTEGER,
                rating TEXT,
                url TEXT UNIQUE
            )
        ''')
        self.connection.commit()
    
    def close_spider(self, spider):
        """
        Spider 关闭时调用，关闭数据库连接
        :param spider: 当前 Spider 实例
        """
        if self.connection:
            self.connection.close()
    
    def process_item(self, item, spider):
        """
        处理 Item，将其存储到数据库
        :param item: BookItem 实例
        :param spider: 抓取该 Item 的 Spider
        :return: 处理后的 Item
        """
        adapter = ItemAdapter(item)
        
        # 验证必要字段
        if not adapter.get('title'):
            raise DropItem(f"缺少标题的 Item: {item}")
        
        # 转换数据类型
        try:
            stock = int(adapter.get('stock', 0))
        except (ValueError, TypeError):
            stock = 0
        
        # 插入数据到数据库
        try:
            self.cursor.execute('''
                INSERT INTO books (title, price, stock, rating, url)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                adapter.get('title'),
                adapter.get('price'),
                stock,
                adapter.get('rating'),
                adapter.get('url')
            ))
            self.connection.commit()
            
            # 记录日志
            spider.logger.info(f"已存储书籍: {adapter.get('title')}")
            
        except sqlite3.IntegrityError:
            # 处理重复 URL 的情况
            spider.logger.warning(f"重复的书籍 URL: {adapter.get('url')}")
            raise DropItem(f"重复的 Item: {item}")
        
        return item
```

### 启用 Pipeline

在 `settings.py` 中启用 Pipeline 并设置优先级：

```python
# bookscraper/settings.py
ITEM_PIPELINES = {
    'bookscraper.pipelines.SQLitePipeline': 300,
}
```

数字 `300` 表示 Pipeline 的执行顺序，数字越小优先级越高。如果有多个 Pipeline，它们会按照优先级顺序执行。

### 处理不同类型的数据存储

除了 SQLite，我们还可以轻松地修改 Pipeline 来支持其他数据库：

```python
# MySQL Pipeline 示例
import mysql.connector
from scrapy.exceptions import DropItem

class MySQLPipeline:
    def __init__(self):
        self.connection = None
        self.cursor = None
    
    def open_spider(self, spider):
        # 连接到 MySQL 数据库
        self.connection = mysql.connector.connect(
            host='localhost',
            user='your_username',
            password='your_password',
            database='books_db'
        )
        self.cursor = self.connection.cursor()
        
        # 创建表
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS books (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                price VARCHAR(50),
                stock INT,
                rating VARCHAR(20),
                url VARCHAR(500) UNIQUE
            )
        ''')
        self.connection.commit()
    
    def close_spider(self, spider):
        if self.connection:
            self.cursor.close()
            self.connection.close()
    
    def process_item(self, item, spider):
        # 类似的处理逻辑...
        pass
```

### 实例方法表格

| 功能名称     | 实例调用方法                   | 具体功能、注意事项、必需参数/可选参数             |
| ------------ | ------------------------------ | ------------------------------------------------- |
| 初始化数据库 | `open_spider(spider)`          | 在 Spider 开始时调用，用于建立数据库连接          |
| 关闭数据库   | `close_spider(spider)`         | 在 Spider 结束时调用，用于关闭数据库连接          |
| 处理 Item    | `process_item(item, spider)`   | 处理每个 Item，必须返回 Item 或抛出 DropItem 异常 |
| 数据验证     | 在 `process_item` 中检查字段   | 验证必要字段是否存在，数据格式是否正确            |
| 错误处理     | 使用 try-except 捕获数据库异常 | 处理重复数据、连接失败等异常情况                  |

### 使用示例

```python
# 完整的 SQLite Pipeline 示例，包含详细的错误处理
import sqlite3
import logging
from itemadapter import ItemAdapter
from scrapy.exceptions import DropItem

class RobustSQLitePipeline:
    """
    健壮的 SQLite Pipeline，包含完整的错误处理
    """
    
    def __init__(self):
        self.connection = None
        self.cursor = None
        self.logger = logging.getLogger(__name__)
    
    def open_spider(self, spider):
        """初始化数据库连接"""
        try:
            self.connection = sqlite3.connect('books.db')
            self.cursor = self.connection.cursor()
            
            # 启用外键约束
            self.cursor.execute('PRAGMA foreign_keys = ON')
            
            # 创建表
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS books (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    price TEXT,
                    stock INTEGER DEFAULT 0,
                    rating TEXT,
                    url TEXT UNIQUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            self.connection.commit()
            self.logger.info("数据库初始化成功")
            
        except sqlite3.Error as e:
            self.logger.error(f"数据库初始化失败: {e}")
            raise
    
    def close_spider(self, spider):
        """关闭数据库连接"""
        if self.connection:
            try:
                self.connection.close()
                self.logger.info("数据库连接已关闭")
            except sqlite3.Error as e:
                self.logger.error(f"关闭数据库连接时出错: {e}")
    
    def process_item(self, item, spider):
        """处理并存储 Item"""
        adapter = ItemAdapter(item)
        
        # 验证必要字段
        required_fields = ['title', 'url']
        for field in required_fields:
            if not adapter.get(field):
                raise DropItem(f"Item 缺少必要字段 '{field}': {item}")
        
        # 数据清理和转换
        cleaned_data = {
            'title': str(adapter.get('title', '')).strip(),
            'price': str(adapter.get('price', '')).strip(),
            'stock': self._convert_stock(adapter.get('stock')),
            'rating': str(adapter.get('rating', '')).strip(),
            'url': str(adapter.get('url', '')).strip()
        }
        
        # 验证清理后的数据
        if not cleaned_data['title']:
            raise DropItem(f"清理后标题为空: {item}")
        
        # 存储到数据库
        try:
            self.cursor.execute('''
                INSERT INTO books (title, price, stock, rating, url)
                VALUES (?, ?, ?, ?, ?)
            ''', tuple(cleaned_data.values()))
            self.connection.commit()
            
            spider.logger.info(f"成功存储书籍: {cleaned_data['title'][:50]}...")
            return item
            
        except sqlite3.IntegrityError as e:
            if 'UNIQUE constraint failed' in str(e):
                spider.logger.warning(f"重复的书籍 URL: {cleaned_data['url']}")
                raise DropItem(f"重复的 Item: {item}")
            else:
                spider.logger.error(f"数据库完整性错误: {e}")
                raise DropItem(f"数据库错误: {item}")
                
        except sqlite3.Error as e:
            spider.logger.error(f"数据库错误: {e}")
            raise DropItem(f"无法存储 Item: {item}")
    
    def _convert_stock(self, stock_value):
        """安全转换库存数量"""
        if stock_value is None:
            return 0
        
        try:
            # 如果是字符串，尝试提取数字
            if isinstance(stock_value, str):
                import re
                match = re.search(r'\d+', stock_value)
                if match:
                    return int(match.group())
                return 0
            
            # 如果已经是数字，直接转换
            return int(stock_value)
            
        except (ValueError, TypeError):
            return 0
```

### 注意事项

1. **数据库连接管理**：始终在 `open_spider()` 中建立连接，在 `close_spider()` 中关闭连接，避免资源泄漏。
2. **异常处理**：数据库操作可能会失败，必须使用 try-except 块来捕获异常并适当处理。
3. **数据验证**：在存储到数据库之前，验证 Item 的必要字段是否存在，数据格式是否正确。
4. **重复数据处理**：使用数据库的 UNIQUE 约束来防止重复数据，并在 Pipeline 中处理重复插入的情况。
5. **性能考虑**：对于大量数据，考虑使用批量插入而不是逐条插入，以提高性能。
6. **事务管理**：对于复杂的操作，使用数据库事务来确保数据一致性。
7. **安全性**：使用参数化查询（如上面示例中的 `?` 占位符）来防止 SQL 注入攻击。

Pipeline 是 Scrapy 中处理数据的关键组件。通过合理设计 Pipeline，我们可以确保爬取的数据被正确地验证、清理和存储。记住，一个好的 Pipeline 应该是健壮的、高效的，并且能够处理各种异常情况。