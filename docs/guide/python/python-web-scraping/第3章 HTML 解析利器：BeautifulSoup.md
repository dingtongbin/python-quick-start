# 第3章 HTML 解析利器：BeautifulSoup

## 3.1 BeautifulSoup 对象创建与解析器选择

在爬虫的世界里，获取到网页内容只是第一步，真正的大戏在于如何从一堆 HTML 标签中精准地提取出我们想要的数据。这时候，BeautifulSoup 就像一把瑞士军刀，能帮我们轻松搞定 HTML 解析的难题。

BeautifulSoup 是 Python 中最流行的 HTML/XML 解析库之一，它能够将复杂的 HTML 文档转换成一个树形结构，每个节点都是 Python 对象，让我们可以方便地遍历和搜索。

首先，我们需要安装 BeautifulSoup：

```bash
pip install beautifulsoup4
```

创建 BeautifulSoup 对象有几种方式，最常见的是从字符串或文件创建：

### 从字符串创建 BeautifulSoup 对象

```python
# 导入 BeautifulSoup 库
from bs4 import BeautifulSoup

# 定义一个简单的 HTML 字符串
html_string = """
<html>
    <head>
        <title>测试页面</title>
    </head>
    <body>
        <h1>欢迎来到我的网站</h1>
        <p class="content">这是一个段落</p>
        <div id="main">
            <span>一些内容</span>
        </div>
    </body>
</html>
"""

# 创建 BeautifulSoup 对象，指定解析器为 'html.parser'
# html.parser 是 Python 内置的解析器，不需要额外安装
soup = BeautifulSoup(html_string, 'html.parser')

# 打印解析后的对象
print(soup.prettify())  # prettify() 方法可以让输出格式化，更美观
```

### 从文件创建 BeautifulSoup 对象

```python
# 导入 BeautifulSoup 库
from bs4 import BeautifulSoup

# 从本地 HTML 文件创建 BeautifulSoup 对象
try:
    with open('example.html', 'r', encoding='utf-8') as file:
        # 读取文件内容并创建 BeautifulSoup 对象
        soup = BeautifulSoup(file, 'html.parser')
        print("文件解析成功！")
except FileNotFoundError:
    print("错误：找不到指定的 HTML 文件")
except Exception as e:
    print(f"解析文件时发生错误: {e}")
```

### 解析器选择

BeautifulSoup 支持多种解析器，每种都有其特点：

| 解析器      | 安装方式             | 优点               | 缺点         |
| ----------- | -------------------- | ------------------ | ------------ |
| html.parser | 内置                 | 速度快，容错能力强 | 功能相对简单 |
| lxml        | pip install lxml     | 速度极快，功能强大 | 需要 C 依赖  |
| html5lib    | pip install html5lib | 最标准，容错最好   | 速度慢       |

对于大多数爬虫场景，推荐使用 `lxml` 解析器，因为它速度快且功能强大：

```python
# 使用 lxml 解析器（需要先安装 lxml）
from bs4 import BeautifulSoup

html_string = "<html><body><p>测试内容</p></body></html>"

# 指定使用 lxml 解析器
soup = BeautifulSoup(html_string, 'lxml')
print(soup.prettify())
```

这节主要介绍了 BeautifulSoup 的基本概念、安装方法以及如何创建 BeautifulSoup 对象。选择合适的解析器对于爬虫的性能和稳定性都很重要，建议在生产环境中使用 lxml 解析器以获得最佳性能。

## 3.2 节点定位：find、find_all、select 方法详解

有了 BeautifulSoup 对象后，下一步就是如何精准定位到我们想要的 HTML 元素。BeautifulSoup 提供了多种强大的方法来帮助我们找到目标节点，其中最常用的就是 `find()`、`find_all()` 和 `select()` 方法。

### find() 方法

`find()` 方法用于查找第一个匹配的元素，如果找不到则返回 `None`。

```python
# 导入 BeautifulSoup 库
from bs4 import BeautifulSoup

# 示例 HTML
html = """
<html>
    <body>
        <div class="container">
            <p class="text">第一段文字</p>
            <p class="text highlight">第二段文字</p>
            <p>第三段文字</p>
        </div>
        <div class="sidebar">
            <p class="note">侧边栏文字</p>
        </div>
    </body>
</html>
"""

# 创建 BeautifulSoup 对象
soup = BeautifulSoup(html, 'html.parser')

# 查找第一个 p 标签
first_p = soup.find('p')
print(f"第一个 p 标签: {first_p}")

# 查找具有特定 class 的元素
highlight_p = soup.find('p', class_='highlight')
print(f"高亮段落: {highlight_p}")

# 查找具有特定 id 的元素
container_div = soup.find('div', id='container')
print(f"容器 div: {container_div}")  # 这里会返回 None，因为没有 id="container"
```

### find_all() 方法

`find_all()` 方法返回所有匹配的元素列表，如果没有找到则返回空列表。

```python
# 导入 BeautifulSoup 库
from bs4 import BeautifulSoup

# 使用上面的 HTML 示例
soup = BeautifulSoup(html, 'html.parser')

# 查找所有的 p 标签
all_p = soup.find_all('p')
print(f"所有 p 标签数量: {len(all_p)}")

# 查找所有具有特定 class 的元素
text_p = soup.find_all('p', class_='text')
print(f"文本段落数量: {len(text_p)}")

# 使用 attrs 参数进行更复杂的查找
sidebar_p = soup.find_all('p', attrs={'class': 'note'})
print(f"侧边栏段落: {sidebar_p}")

# 限制返回结果数量
first_two_p = soup.find_all('p', limit=2)
print(f"前两个 p 标签: {first_two_p}")
```

### select() 方法（CSS 选择器）

`select()` 方法支持 CSS 选择器语法，这是最灵活和强大的查找方式。

```python
# 导入 BeautifulSoup 库
from bs4 import BeautifulSoup

# 使用上面的 HTML 示例
soup = BeautifulSoup(html, 'html.parser')

# 使用 CSS 选择器查找元素
# .text - 查找所有 class="text" 的元素
text_elements = soup.select('.text')
print(f"文本元素: {text_elements}")

# .container p - 查找 container 类下的所有 p 标签
container_p = soup.select('.container p')
print(f"容器内的段落: {container_p}")

# p.highlight - 查找同时具有 p 标签和 highlight 类的元素
highlight_p = soup.select('p.highlight')
print(f"高亮段落: {highlight_p}")

# [class] - 查找所有有 class 属性的元素
elements_with_class = soup.select('[class]')
print(f"有 class 属性的元素数量: {len(elements_with_class)}")
```

### 常用查找方法对比表

| 功能名称     | 实例调用方法                             | 具体功能、注意事项、必需参数/可选参数                        |
| ------------ | ---------------------------------------- | ------------------------------------------------------------ |
| 查找单个元素 | `soup.find(tag, attrs)`                  | 返回第一个匹配元素，未找到返回 None；tag 为必需参数，attrs 可选 |
| 查找所有元素 | `soup.find_all(tag, attrs, limit)`       | 返回匹配元素列表；limit 参数可限制返回数量                   |
| CSS 选择器   | `soup.select(css_selector)`              | 支持完整的 CSS 选择器语法；必需参数为有效的 CSS 选择器字符串 |
| 按属性查找   | `soup.find(tag, {'attr_name': 'value'})` | 通过字典指定属性名和值；适用于复杂属性匹配                   |

### 完整示例：综合使用各种查找方法

```python
# 导入必要的库
from bs4 import BeautifulSoup
import requests

# 模拟一个实际的网页内容
html_content = """
<!DOCTYPE html>
<html>
<head>
    <title>商品列表</title>
</head>
<body>
    <div class="product-list">
        <div class="product" data-id="1001">
            <h3 class="product-name">iPhone 14</h3>
            <p class="price">$999</p>
            <span class="stock in-stock">有货</span>
        </div>
        <div class="product" data-id="1002">
            <h3 class="product-name">Samsung Galaxy S23</h3>
            <p class="price">$899</p>
            <span class="stock out-of-stock">缺货</span>
        </div>
        <div class="product" data-id="1003">
            <h3 class="product-name">Google Pixel 7</h3>
            <p class="price">$699</p>
            <span class="stock in-stock">有货</span>
        </div>
    </div>
</body>
</html>
"""

try:
    # 创建 BeautifulSoup 对象
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # 方法1: 使用 find_all 查找所有商品
    products = soup.find_all('div', class_='product')
    print(f"找到 {len(products)} 个商品")
    
    # 方法2: 使用 select 查找有货的商品
    in_stock_products = soup.select('div.product span.in-stock')
    print(f"有货商品数量: {len(in_stock_products)}")
    
    # 方法3: 查找特定价格范围的商品
    all_prices = soup.find_all('p', class_='price')
    for price_tag in all_prices:
        price_text = price_tag.get_text()
        # 提取数字部分
        price_value = float(price_text.replace('$', ''))
        if price_value < 800:
            # 找到对应的商品名称
            product_name = price_tag.find_previous('h3').get_text()
            print(f"便宜商品: {product_name} - {price_text}")
            
except Exception as e:
    print(f"解析过程中发生错误: {e}")
```

这节详细介绍了 BeautifulSoup 的三种主要查找方法：`find()`、`find_all()` 和 `select()`。每种方法都有其适用场景，`find()` 适合查找单个元素，`find_all()` 适合批量处理，而 `select()` 则提供了最灵活的 CSS 选择器支持。掌握这些方法是高效解析 HTML 的基础。

## 3.3 提取文本、属性与嵌套结构数据

找到了目标元素后，下一步就是如何从中提取有用的信息。BeautifulSoup 提供了多种方法来获取元素的文本内容、属性值以及处理复杂的嵌套结构。

### 提取文本内容

获取元素的文本内容是最常见的操作，BeautifulSoup 提供了几个相关的方法：

```python
# 导入 BeautifulSoup 库
from bs4 import BeautifulSoup

# 示例 HTML
html = """
<div class="article">
    <h1>文章标题</h1>
    <p>这是第一段内容。<strong>重要信息</strong>继续内容。</p>
    <p>第二段内容，包含<a href="https://example.com">链接</a>。</p>
    <div class="metadata">
        <span class="author">作者：张三</span>
        <span class="date">发布日期：2023-12-01</span>
    </div>
</div>
"""

# 创建 BeautifulSoup 对象
soup = BeautifulSoup(html, 'html.parser')

# 获取 h1 标签的文本
title = soup.find('h1').get_text()
print(f"文章标题: {title}")

# 获取第一个 p 标签的文本（包含子标签的文本）
first_p_text = soup.find('p').get_text()
print(f"第一段完整文本: {first_p_text}")

# 获取纯文本，不包含子标签（实际上 get_text() 默认包含所有子文本）
# 如果只想获取直接子文本，需要特殊处理
p_tag = soup.find('p')
direct_text = ''.join(text for text in p_tag.stripped_strings if text not in [child.get_text() for child in p_tag.find_all()])
print(f"直接文本（不含子标签）: {direct_text}")
```

### 提取属性值

HTML 元素的属性（如 href、src、class 等）也是重要的数据来源：

```python
# 继续使用上面的 HTML
soup = BeautifulSoup(html, 'html.parser')

# 查找链接标签
link = soup.find('a')

# 方法1: 使用 get() 方法（推荐，安全）
href_value = link.get('href')
print(f"链接地址: {href_value}")

# 方法2: 直接访问属性（如果属性不存在会报错）
try:
    href_value2 = link['href']
    print(f"链接地址2: {href_value2}")
except KeyError:
    print("该元素没有 href 属性")

# 获取所有属性
all_attrs = link.attrs
print(f"所有属性: {all_attrs}")

# 特殊属性：class 是列表类型
metadata_div = soup.find('div', class_='metadata')
author_span = metadata_div.find('span', class_='author')
print(f"作者 class 属性: {author_span.get('class')}")  # 返回 ['author']
```

### 处理嵌套结构数据

现实中的 HTML 通常包含复杂的嵌套结构，我们需要逐层提取数据：

```python
# 更复杂的嵌套结构示例
complex_html = """
<div class="products">
    <div class="product-category" data-category="phones">
        <h2>手机</h2>
        <div class="product-item">
            <img src="iphone.jpg" alt="iPhone 14">
            <h3>iPhone 14</h3>
            <p class="price">$999</p>
            <div class="specs">
                <span class="spec cpu">A15 Bionic</span>
                <span class="spec ram">6GB</span>
                <span class="spec storage">128GB</span>
            </div>
        </div>
        <div class="product-item">
            <img src="samsung.jpg" alt="Galaxy S23">
            <h3>Galaxy S23</h3>
            <p class="price">$899</p>
            <div class="specs">
                <span class="spec cpu">Snapdragon 8 Gen 2</span>
                <span class="spec ram">8GB</span>
                <span class="spec storage">256GB</span>
            </div>
        </div>
    </div>
    <div class="product-category" data-category="tablets">
        <h2>平板电脑</h2>
        <div class="product-item">
            <img src="ipad.jpg" alt="iPad Pro">
            <h3>iPad Pro</h3>
            <p class="price">$1099</p>
            <div class="specs">
                <span class="spec cpu">M2</span>
                <span class="spec ram">8GB</span>
                <span class="spec storage">256GB</span>
            </div>
        </div>
    </div>
</div>
"""

soup = BeautifulSoup(complex_html, 'html.parser')

# 提取嵌套数据的完整示例
try:
    # 找到所有产品分类
    categories = soup.find_all('div', class_='product-category')
    
    for category in categories:
        # 提取分类名称和类别ID
        category_name = category.find('h2').get_text()
        category_id = category.get('data-category')
        
        print(f"\n=== {category_name} ({category_id}) ===")
        
        # 在每个分类下找到所有产品
        products = category.find_all('div', class_='product-item')
        
        for product in products:
            # 提取产品基本信息
            product_name = product.find('h3').get_text()
            price = product.find('p', class_='price').get_text()
            
            # 提取图片信息
            img_tag = product.find('img')
            img_src = img_tag.get('src') if img_tag else "无图片"
            img_alt = img_tag.get('alt') if img_tag else "无描述"
            
            # 提取规格信息
            specs = {}
            spec_spans = product.find_all('span', class_='spec')
            for spec in spec_spans:
                # 获取规格类型（cpu, ram, storage）
                spec_classes = spec.get('class', [])
                spec_type = None
                for cls in spec_classes:
                    if cls != 'spec':
                        spec_type = cls
                        break
                
                if spec_type:
                    specs[spec_type] = spec.get_text()
            
            # 输出产品信息
            print(f"产品: {product_name}")
            print(f"价格: {price}")
            print(f"图片: {img_src} ({img_alt})")
            print(f"规格: {specs}")
            print("-" * 30)
            
except AttributeError as e:
    print(f"元素未找到错误: {e}")
except Exception as e:
    print(f"处理嵌套数据时发生错误: {e}")
```

### 数据提取方法总结表

| 功能名称         | 实例调用方法                        | 具体功能、注意事项、必需参数/可选参数                        |
| ---------------- | ----------------------------------- | ------------------------------------------------------------ |
| 获取文本内容     | `element.get_text()`                | 返回元素及其所有子元素的文本；可选参数 strip=True 自动去除空白 |
| 获取属性值       | `element.get('attribute_name')`     | 安全获取属性值，不存在时返回 None；比直接访问更安全          |
| 获取所有属性     | `element.attrs`                     | 返回包含所有属性的字典；class 属性返回列表                   |
| 获取直接子文本   | `''.join(element.stripped_strings)` | 只获取直接子文本，不包含深层嵌套文本                         |
| 提取特定标签文本 | `element.find('tag').get_text()`    | 先定位子元素再提取文本；注意处理 None 情况                   |

### 实用技巧：处理特殊情况

```python
# 导入 BeautifulSoup
from bs4 import BeautifulSoup

# 处理可能为空的情况
html_with_missing_data = """
<div class="user-profile">
    <h2>用户信息</h2>
    <p class="name">李四</p>
    <!-- 邮箱可能不存在 -->
    <!-- <p class="email">lisi@example.com</p> -->
    <p class="phone">13800138000</p>
</div>
"""

soup = BeautifulSoup(html_with_missing_data, 'html.parser')

# 安全提取可能不存在的元素
profile = soup.find('div', class_='user-profile')
name = profile.find('p', class_='name')
email = profile.find('p', class_='email')  # 可能为 None
phone = profile.find('p', class_='phone')

# 使用 and 短路求值避免 None 错误
user_name = name.get_text() if name else "未知"
user_email = email.get_text() if email else "未提供"
user_phone = phone.get_text() if phone else "未提供"

print(f"姓名: {user_name}")
print(f"邮箱: {user_email}")
print(f"电话: {user_phone}")
```

这节重点讲解了如何从 BeautifulSoup 元素中提取文本内容、属性值以及处理复杂的嵌套结构数据。关键是要学会使用 `get_text()` 提取文本，`get()` 方法安全获取属性，以及如何逐层遍历嵌套结构。同时要注意处理元素可能不存在的情况，避免程序崩溃。

## 3.4 异常处理：标签不存在时的安全访问

在实际的爬虫开发中，网页结构可能会发生变化，或者某些页面缺少我们期望的元素。如果不做适当的异常处理，程序很容易因为 `AttributeError` 或 `KeyError` 而崩溃。因此，学会安全地访问可能不存在的标签是每个爬虫开发者必备的技能。

### 常见的异常情况

让我们先看看在没有异常处理的情况下会发生什么：

```python
# 导入 BeautifulSoup
from bs4 import BeautifulSoup

# 示例 HTML（缺少某些元素）
html = """
<div class="article">
    <h1>文章标题</h1>
    <!-- 注意：这里没有作者信息 -->
    <p>文章内容...</p>
</div>
"""

soup = BeautifulSoup(html, 'html.parser')

# 危险的操作：直接访问可能不存在的元素
try:
    author = soup.find('span', class_='author').get_text()  # 这会报错！
    print(f"作者: {author}")
except AttributeError as e:
    print(f"错误: {e}")
    print("因为 find() 返回 None，None 对象没有 get_text() 方法")
```

### 安全访问策略

#### 策略1：使用条件判断

最直观的方法是在访问前先检查元素是否存在：

```python
# 导入 BeautifulSoup
from bs4 import BeautifulSoup

html = """
<div class="article">
    <h1>文章标题</h1>
    <p>文章内容...</p>
</div>
"""

soup = BeautifulSoup(html, 'html.parser')

# 安全访问：先检查元素是否存在
author_element = soup.find('span', class_='author')
if author_element is not None:
    author = author_element.get_text()
    print(f"作者: {author}")
else:
    author = "未知作者"
    print(f"作者: {author}")
```

#### 策略2：使用 try-except

对于复杂的嵌套访问，使用异常处理可能更简洁：

```python
# 导入 BeautifulSoup
from bs4 import BeautifulSoup

html = """
<div class="product">
    <h2>商品名称</h2>
    <div class="price-info">
        <span class="current-price">$999</span>
        <!-- 原价可能不存在 -->
    </div>
</div>
"""

soup = BeautifulSoup(html, 'html.parser')

# 使用 try-except 处理可能的异常
try:
    original_price = soup.find('div', class_='price-info').find('span', class_='original-price').get_text()
except AttributeError:
    original_price = "无原价信息"

current_price = soup.find('span', class_='current-price')
current_price_text = current_price.get_text() if current_price else "价格未知"

print(f"当前价格: {current_price_text}")
print(f"原价: {original_price}")
```

#### 策略3：创建安全的辅助函数

对于经常使用的操作，可以封装成安全的辅助函数：

```python
# 导入 BeautifulSoup
from bs4 import BeautifulSoup

def safe_get_text(element, default=""):
    """
    安全获取元素文本的辅助函数
    
    Args:
        element: BeautifulSoup 元素对象
        default: 默认返回值（当元素为 None 时）
    
    Returns:
        元素的文本内容或默认值
    """
    return element.get_text().strip() if element else default

def safe_get_attr(element, attr_name, default=""):
    """
    安全获取元素属性的辅助函数
    
    Args:
        element: BeautifulSoup 元素对象
        attr_name: 属性名称
        default: 默认返回值
    
    Returns:
        属性值或默认值
    """
    return element.get(attr_name, default) if element else default

# 使用辅助函数
html = """
<article>
    <h1>新闻标题</h1>
    <div class="meta">
        <time datetime="2023-12-01">2023年12月1日</time>
        <!-- 作者信息可能缺失 -->
    </div>
    <div class="content">
        <p>新闻内容...</p>
        <img src="news.jpg" alt="新闻图片">
        <!-- 图片标题可能缺失 -->
    </div>
</article>
"""

soup = BeautifulSoup(html, 'html.parser')

# 安全提取各种信息
title = safe_get_text(soup.find('h1'))
publish_date = safe_get_text(soup.find('time'))
author = safe_get_text(soup.find('span', class_='author'), "匿名")
image_src = safe_get_attr(soup.find('img'), 'src', '无图片')
image_alt = safe_get_attr(soup.find('img'), 'alt', '无描述')

print(f"标题: {title}")
print(f"发布日期: {publish_date}")
print(f"作者: {author}")
print(f"图片: {image_src} ({image_alt})")
```

#### 策略4：使用逻辑运算符短路求值

Python 的逻辑运算符支持短路求值，可以用来简化安全访问：

```python
# 导入 BeautifulSoup
from bs4 import BeautifulSoup

html = """
<div class="user-card">
    <h3>用户信息</h3>
    <!-- 邮箱可能不存在 -->
</div>
"""

soup = BeautifulSoup(html, 'html.parser')

# 使用 and 短路求值
email_element = soup.find('a', class_='email')
email = email_element and email_element.get('href') or "无邮箱"

# 或者更清晰的写法
email = (email_element.get('href') if email_element else "无邮箱")

print(f"邮箱: {email}")
```

### 异常处理最佳实践表

| 功能名称     | 实例调用方法                                         | 具体功能、注意事项、必需参数/可选参数            |
| ------------ | ---------------------------------------------------- | ------------------------------------------------ |
| 安全文本提取 | `element.get_text() if element else default`         | 三元运算符检查元素存在性；default 为必需的默认值 |
| 安全属性提取 | `element.get(attr, default) if element else default` | 双重安全检查；适用于可能不存在的元素和属性       |
| 异常捕获     | `try: ... except AttributeError: ...`                | 适用于深层嵌套访问；可以捕获多个异常类型         |
| 辅助函数封装 | `safe_get_text(element, default)`                    | 提高代码复用性；减少重复的空值检查               |

### 完整的健壮爬虫示例

```python
# 导入必要的库
from bs4 import BeautifulSoup
import requests
import time

def extract_product_info(html_content):
    """
    从产品页面提取信息的健壮函数
    
    Args:
        html_content: HTML 字符串
        
    Returns:
        包含产品信息的字典
    """
    try:
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # 安全提取各种信息
        product_info = {
            'name': '',
            'price': '',
            'description': '',
            'image_url': '',
            'rating': '',
            'availability': ''
        }
        
        # 产品名称
        name_elem = soup.find('h1', class_='product-title') or soup.find('h1')
        product_info['name'] = name_elem.get_text().strip() if name_elem else '未知产品'
        
        # 价格
        price_elem = (soup.find('span', class_='price') or 
                     soup.find('div', class_='price') or 
                     soup.find('p', class_='price'))
        product_info['price'] = price_elem.get_text().strip() if price_elem else '价格未知'
        
        # 描述
        desc_elem = (soup.find('div', class_='description') or 
                    soup.find('p', class_='description'))
        product_info['description'] = desc_elem.get_text().strip() if desc_elem else '无描述'
        
        # 图片
        img_elem = soup.find('img', class_='product-image') or soup.find('img')
        product_info['image_url'] = img_elem.get('src', '') if img_elem else ''
        
        # 评分
        rating_elem = soup.find('span', class_='rating')
        product_info['rating'] = rating_elem.get_text().strip() if rating_elem else '无评分'
        
        # 可用性
        avail_elem = soup.find('span', class_='availability')
        product_info['availability'] = avail_elem.get_text().strip() if avail_elem else '库存未知'
        
        return product_info
        
    except Exception as e:
        print(f"解析产品信息时发生错误: {e}")
        return {
            'name': '解析失败',
            'price': '解析失败',
            'description': '解析失败',
            'image_url': '',
            'rating': '解析失败',
            'availability': '解析失败'
        }

# 模拟不同的 HTML 结构
html_variants = [
    """
    <div>
        <h1 class="product-title">iPhone 14</h1>
        <span class="price">$999</span>
        <div class="description">最新款 iPhone</div>
        <img class="product-image" src="iphone.jpg">
        <span class="rating">4.5/5</span>
        <span class="availability">有货</span>
    </div>
    """,
    """
    <div>
        <h1>Samsung Galaxy</h1>
        <div class="price">$899</div>
        <!-- 缺少描述和评分 -->
        <img src="samsung.jpg">
        <span class="availability">缺货</span>
    </div>
    """,
    """
    <div>
        <!-- 完全不同的结构 -->
        <h2>Product Name</h2>
        <p class="price">Price: $799</p>
        <p>No other info</p>
    </div>
    """
]

# 测试不同情况
for i, html in enumerate(html_variants, 1):
    print(f"\n=== 测试案例 {i} ===")
    info = extract_product_info(html)
    for key, value in info.items():
        print(f"{key}: {value}")
```

这节重点介绍了在 BeautifulSoup 解析过程中如何安全地处理可能不存在的标签。通过条件判断、异常处理、辅助函数封装等多种策略，我们可以让爬虫程序更加健壮，不会因为网页结构的微小变化而崩溃。记住，在爬虫开发中，防御性编程是非常重要的原则。