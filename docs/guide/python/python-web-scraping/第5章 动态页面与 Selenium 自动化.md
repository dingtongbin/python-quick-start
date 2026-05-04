## 5.1 为什么需要 Selenium：JavaScript 渲染内容

有些网站的内容不是直接写在 HTML 源码里的，而是通过 JavaScript 动态加载的。比如你打开一个电商网站，商品列表可能是页面加载完后，再通过 AJAX 请求获取并渲染出来的。这时候，用 `requests` 这种只拿原始 HTML 的工具就抓不到这些动态内容了。

Selenium 就像一个“自动操作浏览器”的工具，它能启动真实的浏览器（比如 Chrome），执行 JS 脚本，等页面完全渲染好后再提取数据，所以能搞定这类“动态页面”。

这节讲了为啥静态爬虫搞不定 JS 渲染的网页，以及 Selenium 的核心价值——模拟真实浏览器行为来获取完整页面内容。

### Selenium 核心功能速查表

| 功能名称     | 实例调用方法                        | 具体功能、注意事项、参数说明                                 |
| ------------ | ----------------------------------- | ------------------------------------------------------------ |
| 启动浏览器   | `webdriver.Chrome()`                | 需提前安装对应版本的 ChromeDriver；可传入 `options` 参数配置无头模式等 |
| 访问网址     | `driver.get("https://example.com")` | 会等待页面主文档加载完成，但不保证 JS 渲染完毕               |
| 获取页面源码 | `driver.page_source`                | 返回当前浏览器中渲染后的完整 HTML 字符串                     |
| 关闭浏览器   | `driver.quit()`                     | 完全退出浏览器进程；`close()` 只关闭当前标签页               |

### 使用示例

```python
# 导入 Selenium WebDriver
from selenium import webdriver
# 导入异常处理模块
from selenium.common.exceptions import WebDriverException

# 创建 Chrome 浏览器选项对象
options = webdriver.ChromeOptions()
# 添加无头模式（后台运行，不弹出浏览器窗口）
options.add_argument('--headless')
# 禁用 GPU 加速（减少资源占用）
options.add_argument('--disable-gpu')

try:
    # 启动 Chrome 浏览器（需确保 chromedriver 在 PATH 中）
    driver = webdriver.Chrome(options=options)
    # 访问目标网站
    driver.get("https://httpbin.org/delay/2")
    # 打印渲染后的页面源码（包含 JS 动态生成的内容）
    print(driver.page_source[:200])  # 只打印前200字符
except WebDriverException as e:
    # 捕获浏览器驱动相关异常（如未找到 chromedriver）
    print(f"浏览器启动失败: {e}")
except Exception as e:
    # 捕获其他未知异常
    print(f"发生未知错误: {e}")
finally:
    # 确保无论是否出错都关闭浏览器
    if 'driver' in locals():
        driver.quit()
```

### 注意事项

- **性能开销大**：Selenium 启动真实浏览器，内存和 CPU 占用远高于 `requests`，不适合高并发场景。
- **依赖外部驱动**：必须下载与浏览器版本匹配的 WebDriver（如 ChromeDriver），否则会报错。
- **等待机制关键**：JS 渲染需要时间，直接获取 `page_source` 可能拿到未完成的内容，应配合显式等待（后续小节讲解）。
- **反爬风险更高**：浏览器指纹更容易被网站识别为自动化工具，需额外处理（如修改 WebDriver 特征）。

------

## 5.2 安装 WebDriver 与配置浏览器驱动

要让 Selenium 控制浏览器，光装 `selenium` 库还不够，还得有“桥梁”——WebDriver。它是个独立的小程序，负责接收 Selenium 指令并操作浏览器。

以 Chrome 为例，你需要：

1. 查看本地 Chrome 浏览器版本（地址栏输入 `chrome://version`）
2. 去 [ChromeDriver 官网](https://chromedriver.chromium.org/) 下载对应版本
3. 把 `chromedriver.exe` 放到系统 PATH 路径下（如 Python 安装目录或 Windows/System32）

不过手动管理太麻烦，推荐用 `webdriver-manager` 自动搞定：

### 安装步骤示例

```bash
# 安装 selenium 和自动管理驱动的库
pip install selenium webdriver-manager
# 使用 webdriver-manager 自动下载并管理驱动
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

# 自动下载匹配的 ChromeDriver 并创建服务对象
service = Service(ChromeDriverManager().install())
# 启动浏览器
driver = webdriver.Chrome(service=service)
print("浏览器启动成功！")
driver.quit()
```

这节介绍了 WebDriver 的作用，并给出了自动安装驱动的现代方案，省去手动匹配版本的烦恼。

### WebDriver 管理方法对比表

| 功能名称         | 实例调用方法                                               | 具体功能、注意事项、参数说明                               |
| ---------------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| 手动指定驱动路径 | `webdriver.Chrome(executable_path="path/to/chromedriver")` | 已弃用（v4.0+），建议改用 `Service` 对象                   |
| 自动管理驱动     | `Service(ChromeDriverManager().install())`                 | 首次运行会下载驱动，后续自动复用；支持 Chrome/Firefox/Edge |
| 配置驱动日志     | `service = Service(log_path="chromedriver.log")`           | 可记录驱动运行日志，便于调试连接问题                       |

### 使用示例

```python
# 导入必要模块
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import os

# 设置环境变量避免重复下载（可选）
os.environ['WDM_LOG_LEVEL'] = '0'  # 关闭 webdriver-manager 日志

try:
    # 自动获取最新兼容的 ChromeDriver
    service = Service(ChromeDriverManager().install())
    # 创建浏览器实例
    driver = webdriver.Chrome(service=service)
    # 验证是否正常工作
    driver.get("https://www.baidu.com")
    print(f"页面标题: {driver.title}")
except Exception as e:
    print(f"驱动配置失败: {e}")
finally:
    if 'driver' in locals():
        driver.quit()
```

### 注意事项

- **网络要求**：首次运行 `ChromeDriverManager().install()` 需要联网下载驱动文件。
- **缓存位置**：驱动默认缓存在用户目录（如 `~/.wdm`），可跨项目复用。
- **版本锁定**：生产环境建议固定驱动版本，避免自动更新导致兼容性问题。
- **代理设置**：若在内网环境，需配置 `ChromeDriverManager` 使用代理下载。

------

## 5.3 元素定位：ID、Class、XPath、CSS Selector

拿到页面后，怎么精准找到想要的数据？Selenium 提供了多种“定位器”（Locator），就像给网页元素贴标签，让你能按图索骥。

最常用的方式有四种：

- **ID**：`find_element(By.ID, "username")` —— 最快最准，但很多元素没有 ID
- **Class 名**：`find_element(By.CLASS_NAME, "btn-primary")` —— 适合找同类按钮
- **XPath**：`find_element(By.XPATH, "//div[@class='content']/p[1]")` —— 强大灵活，能描述复杂路径
- **CSS 选择器**：`find_element(By.CSS_SELECTOR, "div.content > p:first-child")` —— 简洁高效，前端开发者熟悉

> ⚠️ 注意：Selenium 4 开始，必须通过 `By` 类指定定位方式，旧版的 `find_element_by_id()` 已废弃。

这节介绍了四种主流元素定位方法，各有适用场景，XPath 和 CSS 选择器功能最强大。

### 元素定位方法速查表

| 功能名称        | 实例调用方法                                             | 具体功能、注意事项、参数说明                                 |
| --------------- | -------------------------------------------------------- | ------------------------------------------------------------ |
| 通过 ID 定位    | `driver.find_element(By.ID, "element_id")`               | 唯一性高，性能最好；若 ID 动态生成（如含时间戳）则不可靠     |
| 通过 Class 定位 | `driver.find_element(By.CLASS_NAME, "class_name")`       | 只能指定单个 class；多个 class 需用 CSS 选择器 `.cls1.cls2`  |
| 通过 XPath 定位 | `driver.find_element(By.XPATH, "//tag[@attr='value']")`  | 支持文本匹配 `//a[text()='登录']`；轴定位 `following-sibling::` |
| 通过 CSS 选择器 | `driver.find_element(By.CSS_SELECTOR, "div#main .item")` | 支持伪类 `:nth-child(2)`；属性选择 `[href^='https']`         |

### 使用示例

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.common.exceptions import NoSuchElementException

# 初始化浏览器
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

try:
    driver.get("https://httpbin.org/forms/post")
    
    # 方法1: 通过 ID 定位输入框
    try:
        custname_input = driver.find_element(By.ID, "custname")
        custname_input.send_keys("张三")  # 输入文本
        print("通过 ID 成功定位姓名输入框")
    except NoSuchElementException:
        print("未找到 ID 为 'custname' 的元素")
    
    # 方法2: 通过 Class 定位第一个按钮
    try:
        btn = driver.find_element(By.CLASS_NAME, "btn")
        print(f"按钮文本: {btn.text}")
    except NoSuchElementException:
        print("未找到 class 为 'btn' 的元素")
    
    # 方法3: 通过 XPath 定位特定 label
    try:
        label = driver.find_element(By.XPATH, "//label[@for='custtel']")
        print(f"电话标签文本: {label.text}")
    except NoSuchElementException:
        print("未找到电话对应的 label")
    
    # 方法4: 通过 CSS 选择器定位所有 radio 按钮
    radios = driver.find_elements(By.CSS_SELECTOR, "input[type='radio']")
    print(f"找到 {len(radios)} 个单选按钮")
    
except Exception as e:
    print(f"定位过程中出错: {e}")
finally:
    driver.quit()
```

### 注意事项

- **单数 vs 复数**：`find_element` 返回单个元素（找不到抛异常），`find_elements` 返回列表（找不到返回空列表）。
- **动态元素**：如果元素是 JS 动态生成的，需先等待元素出现（见 5.4 节）。
- **iframe 内容**：若元素在 iframe 中，必须先 `driver.switch_to.frame()` 切入。
- **性能差异**：ID > CSS Selector > XPath > Class Name（大致顺序，实际取决于页面结构）。

------

## 5.4 模拟点击、输入、滚动与等待机制

光找到元素还不够，得让浏览器“动手”操作。Selenium 能模拟人类行为：点击按钮、输入文字、滚动页面……但有个致命问题：**JS 渲染需要时间**！

如果页面还没加载完你就急着点按钮，肯定会失败。所以必须用“等待机制”——告诉程序：“等这个元素出现再继续”。

Selenium 提供三种等待：

1. **强制等待**：`time.sleep(3)` —— 简单粗暴，浪费时间
2. **隐式等待**：`driver.implicitly_wait(10)` —— 全局设置，找元素时最多等10秒
3. **显式等待**：`WebDriverWait` + `expected_conditions` —— 精准等待特定条件（推荐！）

这节讲了如何模拟用户交互，并强调了等待机制的重要性——没有等待的自动化脚本等于碰运气。

### 用户交互与等待方法速查表

| 功能名称         | 实例调用方法                                                 | 具体功能、注意事项、参数说明                     |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------ |
| 输入文本         | `element.send_keys("文本")`                                  | 会清空原有内容；可用 `Keys.RETURN` 模拟回车      |
| 点击元素         | `element.click()`                                            | 必须确保元素可点击（不在 viewport 外、未被遮挡） |
| 滚动到元素       | `driver.execute_script("arguments[0].scrollIntoView();", element)` | 解决“元素不在视窗内无法点击”问题                 |
| 显式等待元素出现 | `WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "xxx")))` | 最多等10秒，每0.5秒检查一次；条件满足立即继续    |

### 使用示例

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.common.exceptions import TimeoutException

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

try:
    driver.get("https://httpbin.org/delay/3")  # 模拟慢加载页面
    
    # 设置隐式等待（作为兜底）
    driver.implicitly_wait(5)
    
    # 显式等待：直到页面包含特定文本
    try:
        wait = WebDriverWait(driver, 10)  # 最多等待10秒
        # 等待 <pre> 标签出现（表示响应已返回）
        pre_element = wait.until(
            EC.presence_of_element_located((By.TAG_NAME, "pre"))
        )
        print("页面数据加载完成！")
        
        # 模拟滚动到底部
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        
        # 如果有搜索框，可以这样操作（此处仅为演示）
        # search_box = driver.find_element(By.NAME, "q")
        # search_box.send_keys("Selenium教程", Keys.RETURN)
        
    except TimeoutException:
        print("等待超时！页面可能加载失败")
    
except Exception as e:
    print(f"操作失败: {e}")
finally:
    driver.quit()
```

### 注意事项

- **显式等待优先**：比隐式等待更精准，避免不必要的等待时间。
- **组合条件**：`expected_conditions` 提供多种条件，如 `element_to_be_clickable`、`text_to_be_present_in_element`。
- **滚动必要性**：某些网站（如 React 应用）只有元素进入视窗才会渲染，必须先滚动。
- **异常处理**：等待超时会抛 `TimeoutException`，务必捕获并处理。
- **避免混合等待**：隐式和显式等待混用可能导致意外的长等待（总等待时间 = 隐式 × 显式）。