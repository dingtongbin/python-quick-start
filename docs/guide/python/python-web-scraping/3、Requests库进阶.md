# 第3章：Requests 库进阶

本章将深入学习 requests 库的高级功能，包括 Session 管理、Cookie 处理、代理设置、文件下载等核心技能。

---

## 3.1 Requests 库回顾

### 基本用法

```python
import requests

# GET 请求
response = requests.get('https://api.example.com/data')

# POST 请求
response = requests.post('https://api.example.com/data', json={'key': 'value'})

# 响应
print(response.status_code)  # 状态码
print(response.text)         # 文本内容
print(response.json())       # JSON 数据
print(response.headers)      # 响应头
```

### 常用参数

```python
response = requests.get(
    url,
    params={'key': 'value'},      # URL 参数
    headers={'User-Agent': '...'}, # 请求头
    cookies={'session': 'xxx'},    # Cookie
    timeout=10,                    # 超时时间
    proxies={'http': '...'},       # 代理
    auth=('user', 'pass'),         # 认证
    verify=True                    # SSL 验证
)
```

---

## 3.2 Session 会话管理

### 为什么需要 Session？

✅ **保持登录状态** - 自动管理 Cookie
✅ **连接复用** - 提高性能
✅ **统一配置** - 设置默认请求头
✅ **跨请求共享** - 在多个请求间共享数据

### 基本使用

```python
import requests

# 创建 Session
session = requests.Session()

# 设置默认请求头
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                 'AppleWebKit/537.36',
    'Accept': 'text/html,application/xhtml+xml',
})

# 发送请求（自动携带 Cookie）
response1 = session.get('https://example.com/login')
response2 = session.post('https://example.com/login', data={
    'username': 'user',
    'password': 'pass'
})

# 后续请求自动携带登录后的 Cookie
response3 = session.get('https://example.com/dashboard')
```

### Session vs 普通请求

```python
# ❌ 普通请求 - 每次都是新会话
requests.get('https://example.com/page1')
requests.get('https://example.com/page2')
# Cookie 不会保留

# ✅ Session - 保持会话
session = requests.Session()
session.get('https://example.com/page1')
session.get('https://example.com/page2')
# Cookie 自动保留
```

### 实战：模拟登录

```python
import requests
from bs4 import BeautifulSoup

class LoginSession:
    """登录会话管理器"""
    
    def __init__(self, login_url):
        self.session = requests.Session()
        self.login_url = login_url
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                         'AppleWebKit/537.36'
        })
    
    def login(self, username, password):
        """执行登录"""
        
        # 获取登录页面（获取 CSRF token）
        response = self.session.get(self.login_url)
        soup = BeautifulSoup(response.text, 'lxml')
        
        # 提取 CSRF token（如果有）
        csrf_token = None
        csrf_input = soup.find('input', {'name': 'csrf_token'})
        if csrf_input:
            csrf_token = csrf_input['value']
        
        # 准备登录数据
        login_data = {
            'username': username,
            'password': password,
        }
        if csrf_token:
            login_data['csrf_token'] = csrf_token
        
        # 发送登录请求
        response = self.session.post(self.login_url, data=login_data)
        
        # 检查是否登录成功
        if response.status_code == 200 and '欢迎' in response.text:
            print("登录成功")
            return True
        else:
            print("登录失败")
            return False
    
    def get_protected_page(self, url):
        """获取需要登录的页面"""
        response = self.session.get(url)
        return response
    
    def close(self):
        """关闭会话"""
        self.session.close()

# 使用
if __name__ == '__main__':
    login_session = LoginSession('https://example.com/login')
    
    if login_session.login('username', 'password'):
        # 访问需要登录的页面
        response = login_session.get_protected_page('https://example.com/profile')
        print(response.text[:500])
    
    login_session.close()
```

---

## 3.3 Cookie 处理

### 查看 Cookie

```python
import requests

session = requests.Session()
response = session.get('https://example.com')

# 查看所有 Cookie
for cookie in session.cookies:
    print(f"{cookie.name}: {cookie.value}")

# 获取特定 Cookie
session_id = session.cookies.get('sessionid')
print(f"Session ID: {session_id}")
```

### 手动设置 Cookie

```python
# 方法 1：字典
session.cookies.set('key', 'value')

# 方法 2：RequestsCookieJar
from requests.cookies import RequestsCookieJar

cookies = RequestsCookieJar()
cookies.set('session', 'abc123', domain='example.com', path='/')
session.cookies.update(cookies)

# 方法 3：从字典加载
cookie_dict = {'session': 'abc123', 'user': 'john'}
requests.utils.add_dict_to_cookiejar(session.cookies, cookie_dict)
```

### 保存和加载 Cookie

```python
import http.cookiejar as cookielib
import json

def save_cookies(session, filename='cookies.json'):
    """保存 Cookie 到文件"""
    cookies_dict = requests.utils.dict_from_cookiejar(session.cookies)
    with open(filename, 'w') as f:
        json.dump(cookies_dict, f)
    print(f"Cookie 已保存到 {filename}")

def load_cookies(session, filename='cookies.json'):
    """从文件加载 Cookie"""
    try:
        with open(filename, 'r') as f:
            cookies_dict = json.load(f)
        requests.utils.add_dict_to_cookiejar(session.cookies, cookies_dict)
        print(f"Cookie 已从 {filename} 加载")
    except FileNotFoundError:
        print("Cookie 文件不存在")

# 使用
session = requests.Session()

# 首次登录
session.post('https://example.com/login', data={'user': 'admin', 'pass': '123'})
save_cookies(session)

# 后续使用
new_session = requests.Session()
load_cookies(new_session)
# 可以直接访问需要登录的页面
response = new_session.get('https://example.com/profile')
```

### Cookie 过期处理

```python
from datetime import datetime

def is_cookie_expired(cookie):
    """检查 Cookie 是否过期"""
    if cookie.expires:
        expire_time = datetime.fromtimestamp(cookie.expires)
        return datetime.now() > expire_time
    return False

# 检查并刷新过期的 Cookie
for cookie in session.cookies:
    if is_cookie_expired(cookie):
        print(f"Cookie {cookie.name} 已过期，需要重新登录")
        break
```

---

## 3.4 请求头定制

### 完整的请求头

```python
headers = {
    # 浏览器标识
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                 'AppleWebKit/537.36 (KHTML, like Gecko) '
                 'Chrome/120.0.0.0 Safari/537.36',
    
    # 接受的内容类型
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,'
              'image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    
    # 连接方式
    'Connection': 'keep-alive',
    
    # 来源页面
    'Referer': 'https://www.example.com/',
    
    # 缓存控制
    'Cache-Control': 'max-age=0',
    
    # 升级不安全请求
    'Upgrade-Insecure-Requests': '1',
    
    # 自定义头
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRFToken': 'token_value',
}
```

### User-Agent 轮换

```python
import random

USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
    '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
    '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 '
    '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) '
    'Gecko/20100101 Firefox/121.0',
    
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
    'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
]

def get_random_ua():
    """获取随机 User-Agent"""
    return random.choice(USER_AGENTS)

# 使用
headers = {'User-Agent': get_random_ua()}
response = requests.get(url, headers=headers)
```

### 使用 fake-useragent 库

```bash
pip install fake-useragent==1.4.0
```

```python
from fake_useragent import UserAgent

ua = UserAgent()

# 随机 UA
print(ua.random)

# 特定浏览器
print(ua.chrome)
print(ua.firefox)
print(ua.safari)

# 使用
headers = {'User-Agent': ua.random}
response = requests.get(url, headers=headers)
```

---

## 3.5 代理设置

### 为什么需要代理？

✅ **突破 IP 限制** - 避免被封禁
✅ **提高匿名性** - 隐藏真实 IP
✅ **地域访问** - 访问地区限制内容
✅ **负载均衡** - 分散请求压力

### 基本代理配置

```python
proxies = {
    'http': 'http://proxy.example.com:8080',
    'https': 'https://proxy.example.com:8080',
}

response = requests.get('https://example.com', proxies=proxies)
```

### 带认证的代理

```python
proxies = {
    'http': 'http://user:password@proxy.example.com:8080',
    'https': 'https://user:password@proxy.example.com:8080',
}

response = requests.get('https://example.com', proxies=proxies)
```

### SOCKS 代理

```bash
pip install requests[socks]
```

```python
proxies = {
    'http': 'socks5://user:password@proxy.example.com:1080',
    'https': 'socks5://user:password@proxy.example.com:1080',
}

response = requests.get('https://example.com', proxies=proxies)
```

### 代理池

```python
import random

class ProxyPool:
    """代理池"""
    
    def __init__(self, proxy_list):
        self.proxies = proxy_list
        self.failed_proxies = set()
    
    def get_proxy(self):
        """获取可用代理"""
        available = [p for p in self.proxies if p not in self.failed_proxies]
        if not available:
            # 如果所有代理都失败，重置
            self.failed_proxies.clear()
            available = self.proxies
        return random.choice(available)
    
    def mark_failed(self, proxy):
        """标记代理为失败"""
        self.failed_proxies.add(proxy)
        print(f"代理 {proxy} 标记为失败")
    
    def test_proxy(self, proxy, test_url='https://httpbin.org/ip'):
        """测试代理是否可用"""
        try:
            proxies = {'http': proxy, 'https': proxy}
            response = requests.get(test_url, proxies=proxies, timeout=5)
            return response.status_code == 200
        except:
            return False

# 使用
proxy_list = [
    'http://proxy1.example.com:8080',
    'http://proxy2.example.com:8080',
    'http://proxy3.example.com:8080',
]

pool = ProxyPool(proxy_list)

# 获取代理
proxy = pool.get_proxy()
proxies = {'http': proxy, 'https': proxy}

try:
    response = requests.get('https://example.com', proxies=proxies, timeout=10)
except:
    pool.mark_failed(proxy)
```

### 免费代理获取（示例）

```python
def fetch_free_proxies():
    """从免费代理网站获取代理列表"""
    proxies = []
    
    try:
        response = requests.get('https://free-proxy-list.net/', timeout=10)
        soup = BeautifulSoup(response.text, 'lxml')
        
        table = soup.find('table', id='proxylisttable')
        for row in table.find('tbody').find_all('tr'):
            cols = row.find_all('td')
            ip = cols[0].get_text()
            port = cols[1].get_text()
            https = cols[6].get_text()
            
            if https == 'yes':
                proxy = f'https://{ip}:{port}'
            else:
                proxy = f'http://{ip}:{port}'
            
            proxies.append(proxy)
    
    except Exception as e:
        print(f"获取代理失败: {e}")
    
    return proxies

# 使用
proxies = fetch_free_proxies()
print(f"获取到 {len(proxies)} 个代理")
```

---

## 3.6 超时与重试

### 超时设置

```python
# 单个超时值（连接+读取）
response = requests.get(url, timeout=10)

# 分别设置连接和读取超时
response = requests.get(url, timeout=(5, 30))
# 5秒连接超时，30秒读取超时
```

### 超时异常处理

```python
from requests.exceptions import Timeout, ConnectionError

try:
    response = requests.get(url, timeout=10)
except Timeout:
    print("请求超时")
except ConnectionError:
    print("连接错误")
except Exception as e:
    print(f"其他错误: {e}")
```

### 重试机制

```python
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

def create_session_with_retry(retries=3, backoff_factor=1):
    """创建带重试的 Session"""
    session = requests.Session()
    
    # 配置重试策略
    retry_strategy = Retry(
        total=retries,              # 最大重试次数
        backoff_factor=backoff_factor,  # 重试间隔倍数
        status_forcelist=[429, 500, 502, 503, 504],  # 需要重试的状态码
        allowed_methods=["GET", "POST"],  # 允许重试的方法
    )
    
    # 创建适配器
    adapter = HTTPAdapter(max_retries=retry_strategy)
    
    # 挂载适配器
    session.mount('https://', adapter)
    session.mount('http://', adapter)
    
    return session

# 使用
session = create_session_with_retry(retries=3, backoff_factor=1)
response = session.get('https://example.com')
```

### 指数退避重试

```python
import time

def request_with_backoff(url, max_retries=5, base_delay=1):
    """指数退避重试"""
    for attempt in range(max_retries):
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response
        
        except requests.exceptions.RequestException as e:
            if attempt == max_retries - 1:
                raise  # 最后一次尝试，抛出异常
            
            # 计算延迟时间（指数增长）
            delay = base_delay * (2 ** attempt)
            print(f"请求失败: {e}")
            print(f"等待 {delay} 秒后重试...")
            time.sleep(delay)

# 使用
response = request_with_backoff('https://example.com')
```

---

## 3.7 文件下载

### 小文件下载

```python
import requests

def download_file(url, filename):
    """下载小文件"""
    response = requests.get(url)
    
    with open(filename, 'wb') as f:
        f.write(response.content)
    
    print(f"文件已下载到 {filename}")

# 使用
download_file('https://example.com/file.pdf', 'file.pdf')
```

### 大文件下载（流式）

```python
def download_large_file(url, filename, chunk_size=8192):
    """下载大文件（流式）"""
    response = requests.get(url, stream=True)
    total_size = int(response.headers.get('content-length', 0))
    
    downloaded = 0
    
    with open(filename, 'wb') as f:
        for chunk in response.iter_content(chunk_size=chunk_size):
            if chunk:
                f.write(chunk)
                downloaded += len(chunk)
                
                # 显示进度
                if total_size > 0:
                    progress = (downloaded / total_size) * 100
                    print(f"\r下载进度: {progress:.2f}%", end='')
    
    print(f"\n文件已下载到 {filename}")

# 使用
download_large_file('https://example.com/largefile.zip', 'largefile.zip')
```

### 带进度的下载（使用 tqdm）

```bash
pip install tqdm
```

```python
from tqdm import tqdm

def download_with_progress(url, filename):
    """带进度条的下载"""
    response = requests.get(url, stream=True)
    total_size = int(response.headers.get('content-length', 0))
    
    with open(filename, 'wb') as f, tqdm(
        desc=filename,
        total=total_size,
        unit='B',
        unit_scale=True,
        unit_divisor=1024,
    ) as bar:
        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)
                bar.update(len(chunk))
    
    print(f"下载完成: {filename}")

# 使用
download_with_progress('https://example.com/file.zip', 'file.zip')
```

### 断点续传

```python
import os

def download_with_resume(url, filename):
    """断点续传下载"""
    
    # 检查文件是否存在
    if os.path.exists(filename):
        resume_size = os.path.getsize(filename)
    else:
        resume_size = 0
    
    # 设置请求头
    headers = {'Range': f'bytes={resume_size}-'}
    
    # 发送请求
    response = requests.get(url, headers=headers, stream=True)
    
    # 追加写入
    mode = 'ab' if resume_size > 0 else 'wb'
    
    with open(filename, mode) as f:
        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)
    
    print(f"下载完成: {filename}")

# 使用
download_with_resume('https://example.com/largefile.zip', 'largefile.zip')
```

---

## 3.8 上传文件

### 表单上传

```python
# 上传单个文件
with open('file.txt', 'rb') as f:
    files = {'file': f}
    response = requests.post('https://example.com/upload', files=files)

# 上传多个文件
with open('file1.txt', 'rb') as f1, open('file2.txt', 'rb') as f2:
    files = [
        ('files', ('file1.txt', f1)),
        ('files', ('file2.txt', f2)),
    ]
    response = requests.post('https://example.com/upload', files=files)

# 指定文件名和内容类型
with open('image.jpg', 'rb') as f:
    files = {
        'file': ('custom_name.jpg', f, 'image/jpeg', {'Expires': '0'})
    }
    response = requests.post('https://example.com/upload', files=files)
```

### 带其他字段的上传

```python
with open('file.pdf', 'rb') as f:
    files = {'file': f}
    data = {
        'title': '文档标题',
        'description': '文档描述',
        'category': 'documents'
    }
    response = requests.post('https://example.com/upload', files=files, data=data)
```

---

## 3.9 SSL 证书处理

### 禁用 SSL 验证（不推荐）

```python
# ⚠️ 仅用于测试环境
response = requests.get('https://example.com', verify=False)

# 消除警告
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
```

### 使用自定义证书

```python
response = requests.get(
    'https://example.com',
    verify='/path/to/certfile.pem'
)
```

### 客户端证书认证

```python
response = requests.get(
    'https://example.com',
    cert=('/path/to/client.cert', '/path/to/client.key')
)
```

---

## 3.10 实战：通用爬虫工具类

### 完整实现

```python
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import time
import random
from fake_useragent import UserAgent

class CrawlerSession:
    """通用爬虫会话"""
    
    def __init__(self, 
                 retries=3, 
                 backoff_factor=1,
                 timeout=10,
                 use_proxy=False,
                 proxy_list=None):
        
        self.timeout = timeout
        self.use_proxy = use_proxy
        self.proxy_list = proxy_list or []
        self.current_proxy_index = 0
        
        # 创建 Session
        self.session = requests.Session()
        
        # 配置重试
        retry_strategy = Retry(
            total=retries,
            backoff_factor=backoff_factor,
            status_forcelist=[429, 500, 502, 503, 504],
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount('https://', adapter)
        self.session.mount('http://', adapter)
        
        # 设置默认请求头
        self.ua = UserAgent()
        self._update_headers()
    
    def _update_headers(self):
        """更新请求头"""
        self.session.headers.update({
            'User-Agent': self.ua.random,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        })
    
    def _get_proxy(self):
        """获取代理"""
        if not self.proxy_list:
            return None
        
        proxy = self.proxy_list[self.current_proxy_index]
        self.current_proxy_index = (self.current_proxy_index + 1) % len(self.proxy_list)
        return {'http': proxy, 'https': proxy}
    
    def fetch(self, url, method='GET', **kwargs):
        """发送请求"""
        
        # 随机延迟
        time.sleep(random.uniform(1, 3))
        
        # 更新 User-Agent
        self._update_headers()
        
        # 准备参数
        params = {
            'timeout': self.timeout,
        }
        
        if self.use_proxy and self.proxy_list:
            params['proxies'] = self._get_proxy()
        
        params.update(kwargs)
        
        try:
            # 发送请求
            if method.upper() == 'GET':
                response = self.session.get(url, **params)
            elif method.upper() == 'POST':
                response = self.session.post(url, **params)
            else:
                raise ValueError(f"不支持的请求方法: {method}")
            
            response.raise_for_status()
            response.encoding = response.apparent_encoding
            
            return response
        
        except requests.exceptions.RequestException as e:
            print(f"请求失败 {url}: {e}")
            return None
    
    def fetch_json(self, url, **kwargs):
        """获取 JSON 数据"""
        response = self.fetch(url, **kwargs)
        if response:
            return response.json()
        return None
    
    def fetch_html(self, url, **kwargs):
        """获取 HTML 内容"""
        response = self.fetch(url, **kwargs)
        if response:
            return response.text
        return None
    
    def download(self, url, filename, **kwargs):
        """下载文件"""
        response = self.fetch(url, stream=True, **kwargs)
        if not response:
            return False
        
        with open(filename, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        
        return True
    
    def close(self):
        """关闭会话"""
        self.session.close()
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()

# 使用示例
if __name__ == '__main__':
    
    # 基本使用
    with CrawlerSession() as crawler:
        # 获取 HTML
        html = crawler.fetch_html('https://example.com')
        print(html[:200])
        
        # 获取 JSON
        data = crawler.fetch_json('https://api.example.com/data')
        print(data)
        
        # 下载文件
        crawler.download('https://example.com/file.pdf', 'file.pdf')
    
    # 使用代理
    proxy_list = [
        'http://proxy1.example.com:8080',
        'http://proxy2.example.com:8080',
    ]
    
    with CrawlerSession(use_proxy=True, proxy_list=proxy_list) as crawler:
        html = crawler.fetch_html('https://example.com')
```

---

## 3.11 本章小结

✅ **Session 管理** - 保持会话、连接复用
✅ **Cookie 处理** - 查看、设置、保存、加载
✅ **请求头定制** - User-Agent 轮换
✅ **代理设置** - HTTP/SOCKS、代理池
✅ **超时与重试** - 指数退避
✅ **文件下载** - 流式、断点续传
✅ **文件上传** - 表单上传
✅ **SSL 证书** - 验证与自定义
✅ **实战工具** - 通用爬虫类

---

## 📝 练习题

### 练习 1：登录爬虫

选择一个需要登录的网站（如 GitHub、知乎），实现：
- 模拟登录
- Cookie 保存和加载
- 访问需要登录的页面
- 自动刷新过期的 Cookie

### 练习 2：代理爬虫

构建一个带代理池的爬虫：
- 从免费代理网站获取代理
- 测试代理可用性
- 自动切换失效代理
- 记录代理成功率

### 练习 3：批量下载器

实现一个批量文件下载器：
- 从网页提取文件链接
- 多线程下载
- 断点续传
- 下载进度显示
- 失败重试

---

## 🔗 相关资源

- [Requests 官方文档](https://docs.python-requests.org/)
- [urllib3 文档](https://urllib3.readthedocs.io/)
- [fake-useragent](https://github.com/fake-useragent/fake-useragent)
- [HTTP 代理指南](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Proxy_servers_and_tunneling)

---

**下一章：** [第4章 - 动态网页爬取 →](./4、动态网页爬取.md)
