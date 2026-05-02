# 第2章：HTML 解析与数据提取

本章将深入学习 HTML 解析技术，掌握从网页中提取数据的各种方法，包括 BeautifulSoup、CSS 选择器、XPath 和正则表达式。

---

## 2.1 HTML 基础回顾

### 什么是 HTML？

**HTML**（HyperText Markup Language）是构建网页的标准标记语言。

### HTML 文档结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>页面标题</title>
</head>
<body>
    <header>
        <h1>主标题</h1>
        <nav>
            <a href="/home">首页</a>
            <a href="/about">关于</a>
        </nav>
    </header>
    
    <main>
        <article>
            <h2>文章标题</h2>
            <p class="intro">引言...</p>
            <div class="content">
                <p>正文内容...</p>
                <img src="image.jpg" alt="图片">
            </div>
        </article>
    </main>
    
    <footer>
        <p>&copy; 2024 版权所有</p>
    </footer>
</body>
</html>
```

### 常用 HTML 标签

| 标签 | 说明 | 示例 |
|------|------|------|
| `<div>` | 块级容器 | `<div class="container">` |
| `<span>` | 行内容器 | `<span class="text">` |
| `<a>` | 链接 | `<a href="url">文本</a>` |
| `<img>` | 图片 | `<img src="url" alt="描述">` |
| `<p>` | 段落 | `<p>文本内容</p>` |
| `<h1>-<h6>` | 标题 | `<h1>一级标题</h1>` |
| `<ul>/<ol>` | 列表 | `<ul><li>项目</li></ul>` |
| `<table>` | 表格 | `<table><tr><td>单元格</td></tr></table>` |
| `<form>` | 表单 | `<form action="/submit">` |
| `<input>` | 输入框 | `<input type="text">` |

### HTML 属性

```html
<!-- 类名 -->
<div class="container main-content">

<!-- ID -->
<div id="header">

<!-- 自定义属性 -->
<div data-id="123" data-type="article">

<!-- 其他属性 -->
<a href="https://example.com" target="_blank" title="提示">链接</a>
<img src="image.jpg" alt="描述" width="100" height="100">
```

---

## 2.2 BeautifulSoup4 详解

### 安装

```bash
pip install beautifulsoup4==4.12.2
pip install lxml==4.9.3  # 推荐解析器
```

### 解析器对比

| 解析器 | 速度 | 容错性 | 依赖 |
|--------|------|--------|------|
| `html.parser` | 中等 | 一般 | 无（内置） |
| `lxml` | 快 | 好 | lxml |
| `html5lib` | 慢 | 最好 | html5lib |

**推荐使用 `lxml`**，速度快且容错性好。

### 创建 BeautifulSoup 对象

```python
from bs4 import BeautifulSoup
import requests

# 方法 1：从字符串
html = '<html><body><h1>Hello</h1></body></html>'
soup = BeautifulSoup(html, 'lxml')

# 方法 2：从文件
with open('page.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'lxml')

# 方法 3：从网络请求
response = requests.get('https://example.com')
soup = BeautifulSoup(response.text, 'lxml')
```

### 基本操作

```python
# 美化输出（格式化 HTML）
print(soup.prettify())

# 获取标签
title_tag = soup.title
print(title_tag)  # <title>Example Domain</title>

# 获取标签名
print(title_tag.name)  # title

# 获取标签属性
link = soup.a
print(link.attrs)  # {'href': 'https://www.iana.org/domains/example'}

# 获取特定属性
print(link['href'])  # https://www.iana.org/domains/example

# 获取标签文本
print(soup.get_text())  # 纯文本内容

# 获取标签的直接文本（不包括子标签）
print(soup.h1.string)
```

---

## 2.3 查找元素

### find() 和 find_all()

```python
# find() - 返回第一个匹配的元素
first_div = soup.find('div')
first_with_class = soup.find('div', class_='content')

# find_all() - 返回所有匹配的元素的列表
all_divs = soup.find_all('div')
all_links = soup.find_all('a')

# 限制数量
first_5 = soup.find_all('a', limit=5)
```

### 根据属性查找

```python
# 根据 class 查找
elements = soup.find_all('div', class_='article')

# 根据多个 class
elements = soup.find_all('div', class_=['article', 'post'])

# 根据 ID 查找
element = soup.find(id='main-content')

# 根据其他属性
elements = soup.find_all('a', href=True)  # 有 href 属性的链接
elements = soup.find_all('img', alt='logo')

# 使用字典
elements = soup.find_all('div', {'class': 'article', 'data-type': 'news'})
```

### 使用函数过滤

```python
# 自定义过滤函数
def has_class_and_id(tag):
    return tag.has_attr('class') and tag.has_attr('id')

elements = soup.find_all(has_class_and_id)

# Lambda 表达式
links = soup.find_all(lambda tag: tag.name == 'a' and tag.has_attr('href'))
```

### CSS 选择器

```python
# select() - 返回所有匹配的元素
elements = soup.select('div.article')
elements = soup.select('#main-content')
elements = soup.select('.article .title')

# select_one() - 返回第一个匹配的元素
element = soup.select_one('div.article h2')

# 常用选择器
soup.select('div > p')          # 直接子元素
soup.select('div + p')          # 相邻兄弟
soup.select('div ~ p')          # 所有兄弟
soup.select('a[href^="https"]') # 属性以 https 开头
soup.select('a[href$=".pdf"]')  # 属性以 .pdf 结尾
soup.select('a[href*="example"]') # 属性包含 example
```

### XPath（使用 lxml）

```python
from lxml import etree

# 解析 HTML
html = requests.get('https://example.com').text
tree = etree.HTML(html)

# 基本 XPath
titles = tree.xpath('//h1/text()')
links = tree.xpath('//a/@href')

# 根据 class
articles = tree.xpath('//div[@class="article"]')

# 根据位置
first_article = tree.xpath('//div[@class="article"][1]')

# 组合条件
elements = tree.xpath('//div[@class="article" and @data-type="news"]')

# 获取文本
text = tree.xpath('//div[@class="content"]/text()')
```

---

## 2.4 遍历文档树

### 子节点

```python
# children - 直接子节点（生成器）
for child in soup.body.children:
    print(child.name)

# contents - 直接子节点（列表）
children = soup.body.contents

# descendants - 所有后代节点（生成器）
for desc in soup.body.descendants:
    if hasattr(desc, 'name'):
        print(desc.name)
```

### 父节点和兄弟节点

```python
# parent - 父节点
parent = soup.a.parent

# parents - 所有祖先节点
for parent in soup.a.parents:
    print(parent.name)

# next_sibling - 下一个兄弟节点
next sib = soup.h1.next_sibling

# previous_sibling - 上一个兄弟节点
prev_sib = soup.h1.previous_sibling

# next_siblings / previous_siblings - 所有兄弟节点
for sibling in soup.h1.next_siblings:
    print(sibling)
```

### 前后元素

```python
# next_element - 下一个解析元素
next_elem = soup.h1.next_element

# previous_element - 上一个解析元素
prev_elem = soup.h1.previous_element

# next_elements / previous_elements - 所有前后元素
for elem in soup.h1.next_elements:
    print(elem)
```

---

## 2.5 修改文档树

### 修改标签

```python
# 修改标签名
tag.name = 'h2'

# 修改属性
tag['class'] = 'new-class'
tag['id'] = 'new-id'

# 删除属性
del tag['class']

# 修改文本
tag.string = '新文本'
```

### 添加元素

```python
# 创建新标签
new_tag = soup.new_tag('a', href='https://example.com')
new_tag.string = '链接'

# 添加子标签
soup.div.append(new_tag)

# 在开头插入
soup.div.insert(0, new_tag)

# 在指定位置插入
soup.div.insert(1, new_tag)
```

### 删除元素

```python
# 删除标签
tag.decompose()

# 删除但保留内容
tag.unwrap()

# 清空标签内容
tag.clear()
```

---

## 2.6 实战：爬取博客文章

### 目标网站

我们将爬取 [Python Blog](https://pythonscraping.com/pages/page3.html) 的书籍信息。

### 完整代码

```python
import requests
from bs4 import BeautifulSoup
import csv
import time

def scrape_books():
    """爬取书籍信息"""
    
    url = 'https://pythonscraping.com/pages/page3.html'
    
    try:
        # 发送请求
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                         'AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        response.encoding = 'utf-8'
        
        # 解析 HTML
        soup = BeautifulSoup(response.text, 'lxml')
        
        # 查找所有书籍行
        rows = soup.select('table#giftList tr.gift')
        
        books = []
        
        for row in rows:
            # 提取书名
            title_tag = row.find('h3')
            title = title_tag.get_text(strip=True) if title_tag else ''
            
            # 提取描述
            desc_tag = row.find('td', class_='description')
            description = desc_tag.get_text(strip=True) if desc_tag else ''
            
            # 提取价格
            price_tag = row.find('td', class_='price')
            price = price_tag.get_text(strip=True) if price_tag else ''
            
            # 提取图片 URL
            img_tag = row.find('img')
            image_url = img_tag['src'] if img_tag and img_tag.has_attr('src') else ''
            
            books.append({
                'title': title,
                'description': description,
                'price': price,
                'image_url': image_url
            })
        
        # 输出结果
        print(f"共爬取 {len(books)} 本书籍\n")
        
        for i, book in enumerate(books, 1):
            print(f"{i}. {book['title']}")
            print(f"   描述: {book['description'][:50]}...")
            print(f"   价格: {book['price']}")
            print(f"   图片: {book['image_url']}")
            print()
        
        # 保存到 CSV
        save_to_csv(books)
        
        return books
    
    except Exception as e:
        print(f"错误: {e}")
        return []

def save_to_csv(books, filename='books.csv'):
    """保存到 CSV"""
    with open(filename, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=['title', 'description', 'price', 'image_url'])
        writer.writeheader()
        writer.writerows(books)
    print(f"数据已保存到 {filename}")

if __name__ == '__main__':
    scrape_books()
```

---

## 2.7 正则表达式提取

### 为什么需要正则表达式？

有时候 HTML 结构复杂或不规范，正则表达式可以更灵活地提取数据。

### re 模块基础

```python
import re

# 基本匹配
text = "价格是 99.99 元"
match = re.search(r'\d+\.?\d*', text)
if match:
    print(match.group())  # 99.99

# 查找所有匹配
text = "电话: 138-1234-5678, 139-8765-4321"
phones = re.findall(r'\d{3}-\d{4}-\d{4}', text)
print(phones)  # ['138-1234-5678', '139-8765-4321']

# 替换
text = "Hello World"
new_text = re.sub(r'World', 'Python', text)
print(new_text)  # Hello Python
```

### 常用正则模式

```python
# 邮箱
email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'

# URL
url_pattern = r'https?://[^\s<>"{}|\\^`\[\]]+'

# 日期
date_pattern = r'\d{4}-\d{2}-\d{2}'

# 中文
chinese_pattern = r'[\u4e00-\u9fa5]+'

# HTML 标签
tag_pattern = r'<([^>]+)>'
```

### 在爬虫中使用正则

```python
import requests
import re

def extract_emails(url):
    """从网页中提取邮箱"""
    response = requests.get(url)
    text = response.text
    
    # 使用正则提取邮箱
    emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
    
    return list(set(emails))  # 去重

# 测试
emails = extract_emails('https://example.com')
print(emails)
```

### BeautifulSoup + 正则

```python
import re

# 查找 class 包含特定模式的元素
elements = soup.find_all('div', class_=re.compile(r'article-\d+'))

# 查找文本匹配的元素
elements = soup.find_all(text=re.compile(r'Python'))

# 查找标签名匹配的元素
elements = soup.find_all(re.compile(r'^h[1-6]$'))  # h1-h6
```

---

## 2.8 数据清洗与格式化

### 去除空白

```python
# get_text() 自动去除
text = tag.get_text(strip=True)

# 手动清理
text = tag.get_text()
text = ' '.join(text.split())  # 去除多余空白
text = text.strip()  # 去除首尾空白
```

### 处理特殊字符

```python
import html

# 解码 HTML 实体
text = '&lt;div&gt;Hello&lt;/div&gt;'
decoded = html.unescape(text)
print(decoded)  # <div>Hello</div>

# 编码
encoded = html.escape('<div>Hello</div>')
print(encoded)  # &lt;div&gt;Hello&lt;/div&gt;
```

### 数据类型转换

```python
# 字符串转数字
price_text = "¥99.99"
price = float(re.search(r'[\d.]+', price_text).group())

# 字符串转日期
from datetime import datetime

date_text = "2024-01-15"
date_obj = datetime.strptime(date_text, '%Y-%m-%d')

# 处理相对时间
def parse_relative_time(time_text):
    """解析相对时间"""
    if '分钟前' in time_text:
        minutes = int(re.search(r'\d+', time_text).group())
        # 计算实际时间
        from datetime import timedelta
        actual_time = datetime.now() - timedelta(minutes=minutes)
        return actual_time
    # ... 其他情况
```

### 统一数据格式

```python
def clean_data(raw_data):
    """清洗数据"""
    cleaned = []
    
    for item in raw_data:
        # 去除空白
        title = item['title'].strip()
        
        # 统一价格格式
        price = re.search(r'[\d.]+', item['price'])
        price = float(price.group()) if price else 0.0
        
        # 标准化 URL
        url = item['url']
        if not url.startswith('http'):
            url = 'https://example.com' + url
        
        cleaned.append({
            'title': title,
            'price': price,
            'url': url
        })
    
    return cleaned
```

---

## 2.9 处理表格数据

### 提取表格

```python
import pandas as pd

def scrape_table(url):
    """爬取表格数据"""
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'lxml')
    
    # 查找表格
    table = soup.find('table')
    
    # 提取表头
    headers = []
    for th in table.find_all('th'):
        headers.append(th.get_text(strip=True))
    
    # 提取数据行
    rows = []
    for tr in table.find_all('tr')[1:]:  # 跳过表头
        cells = tr.find_all(['td', 'th'])
        row = [cell.get_text(strip=True) for cell in cells]
        rows.append(row)
    
    # 转换为 DataFrame
    df = pd.DataFrame(rows, columns=headers)
    
    return df

# 使用
df = scrape_table('https://example.com/table-page')
print(df)

# 保存为 CSV
df.to_csv('table_data.csv', index=False, encoding='utf-8-sig')
```

---

## 2.10 处理嵌套结构

### 嵌套列表

```python
# HTML 结构
"""
<ul class="categories">
    <li>
        <h3>分类1</h3>
        <ul>
            <li>子项1</li>
            <li>子项2</li>
        </ul>
    </li>
</ul>
"""

# 提取嵌套数据
categories = []
for li in soup.select('ul.categories > li'):
    category = {
        'name': li.find('h3').get_text(),
        'items': []
    }
    
    for sub_li in li.select('ul > li'):
        category['items'].append(sub_li.get_text())
    
    categories.append(category)
```

### 卡片式布局

```python
# 提取卡片数据
cards = []
for card in soup.select('div.card'):
    card_data = {
        'title': card.select_one('h2.title').get_text(),
        'author': card.select_one('span.author').get_text(),
        'date': card.select_one('time').get_text(),
        'tags': [tag.get_text() for tag in card.select('span.tag')],
        'content': card.select_one('div.content').get_text(),
    }
    cards.append(card_data)
```

---

## 2.11 性能优化

### 避免重复解析

```python
# ❌ 低效：每次都重新查找
for item in items:
    title = soup.find('h2').get_text()
    author = soup.find('span.author').get_text()

# ✅ 高效：先定位父元素
for item in soup.select('div.item'):
    title = item.find('h2').get_text()
    author = item.find('span.author').get_text()
```

### 使用生成器

```python
def extract_items(soup):
    """使用生成器节省内存"""
    for item in soup.select('div.item'):
        yield {
            'title': item.find('h2').get_text(),
            'url': item.find('a')['href']
        }

# 使用
for item in extract_items(soup):
    process(item)
```

### 缓存解析结果

```python
from functools import lru_cache

@lru_cache(maxsize=100)
def parse_page(url):
    """缓存解析结果"""
    response = requests.get(url)
    return BeautifulSoup(response.text, 'lxml')
```

---

## 2.12 实战：爬取新闻网站

### 完整项目

```python
import requests
from bs4 import BeautifulSoup
import json
import time
from datetime import datetime

class NewsScraper:
    """新闻爬虫"""
    
    def __init__(self, base_url):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                         'AppleWebKit/537.36'
        })
    
    def fetch_page(self, url):
        """获取页面"""
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            response.encoding = 'utf-8'
            return BeautifulSoup(response.text, 'lxml')
        except Exception as e:
            print(f"获取页面失败 {url}: {e}")
            return None
    
    def parse_news_list(self, soup):
        """解析新闻列表"""
        news_list = []
        
        for article in soup.select('article.news-item'):
            # 提取标题
            title_tag = article.select_one('h2.title a')
            if not title_tag:
                continue
            
            title = title_tag.get_text(strip=True)
            url = title_tag['href']
            
            # 提取摘要
            summary_tag = article.select_one('p.summary')
            summary = summary_tag.get_text(strip=True) if summary_tag else ''
            
            # 提取时间
            time_tag = article.select_one('time')
            publish_time = time_tag.get_text(strip=True) if time_tag else ''
            
            # 提取作者
            author_tag = article.select_one('span.author')
            author = author_tag.get_text(strip=True) if author_tag else ''
            
            # 提取分类
            category_tag = article.select_one('span.category')
            category = category_tag.get_text(strip=True) if category_tag else ''
            
            news_list.append({
                'title': title,
                'url': url,
                'summary': summary,
                'publish_time': publish_time,
                'author': author,
                'category': category,
                'crawl_time': datetime.now().isoformat()
            })
        
        return news_list
    
    def parse_news_detail(self, url):
        """解析新闻详情"""
        soup = self.fetch_page(url)
        if not soup:
            return None
        
        # 提取标题
        title = soup.select_one('h1.article-title')
        title = title.get_text(strip=True) if title else ''
        
        # 提取内容
        content_div = soup.select_one('div.article-content')
        if content_div:
            paragraphs = content_div.find_all('p')
            content = '\n'.join([p.get_text(strip=True) for p in paragraphs])
        else:
            content = ''
        
        # 提取图片
        images = []
        for img in soup.select('div.article-content img'):
            if img.has_attr('src'):
                images.append(img['src'])
        
        return {
            'title': title,
            'content': content,
            'images': images,
            'url': url
        }
    
    def crawl(self, pages=5):
        """爬取多页新闻"""
        all_news = []
        
        for page in range(1, pages + 1):
            print(f"正在爬取第 {page} 页...")
            
            url = f'{self.base_url}/page/{page}'
            soup = self.fetch_page(url)
            
            if not soup:
                break
            
            news_list = self.parse_news_list(soup)
            all_news.extend(news_list)
            
            print(f"  本页获取 {len(news_list)} 条新闻")
            
            # 礼貌性延迟
            time.sleep(2)
        
        print(f"\n总共爬取 {len(all_news)} 条新闻")
        
        # 保存
        self.save_to_json(all_news)
        
        return all_news
    
    def save_to_json(self, news_list, filename='news.json'):
        """保存到 JSON"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(news_list, f, ensure_ascii=False, indent=2)
        print(f"数据已保存到 {filename}")

# 使用
if __name__ == '__main__':
    scraper = NewsScraper('https://news.example.com')
    news = scraper.crawl(pages=3)
```

---

## 2.13 本章小结

✅ **HTML 基础** - 标签、属性、文档结构
✅ **BeautifulSoup4** - 解析、查找、遍历、修改
✅ **CSS 选择器** - select() 和 select_one()
✅ **XPath** - lxml 的 XPath 支持
✅ **正则表达式** - 灵活的数据提取
✅ **数据清洗** - 格式化、类型转换
✅ **表格处理** - pandas 集成
✅ **嵌套结构** - 复杂数据提取
✅ **性能优化** - 缓存、生成器
✅ **实战项目** - 新闻爬虫

---

## 📝 练习题

### 练习 1：商品爬虫

选择一个电商网站的商品列表页，提取以下信息：
- 商品名称
- 价格
- 评分
- 评论数
- 图片 URL

保存到 CSV 文件。

### 练习 2：论坛帖子

爬取一个论坛的帖子列表，提取：
- 帖子标题
- 作者
- 发布时间
- 回复数
- 浏览量

使用 BeautifulSoup 和正则表达式结合的方式。

### 练习 3：数据清洗

从网页中提取的数据往往不规范，编写一个数据清洗函数，处理：
- 去除 HTML 标签
- 统一日期格式
- 标准化价格（去除货币符号）
- 处理缺失值

---

## 🔗 相关资源

- [BeautifulSoup 官方文档](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
- [CSS 选择器参考](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Selectors)
- [XPath 教程](https://www.w3school.com.cn/xpath/index.asp)
- [Python 正则表达式](https://docs.python.org/3.10/library/re.html)

---

**下一章：** [第3章 - Requests 库进阶 →](./3、Requests库进阶.md)
