# 第9章：API 数据抓取

本章学习如何抓取和分析 API 数据，包括 RESTful API、GraphQL、WebSocket 等。

---

## 9.1 RESTful API 基础

### 什么是 RESTful API？

REST（Representational State Transfer）是一种 Web API 设计风格。

### HTTP 方法

| 方法 | 用途 | 示例 |
|------|------|------|
| GET | 获取资源 | `GET /api/users` |
| POST | 创建资源 | `POST /api/users` |
| PUT | 更新资源 | `PUT /api/users/1` |
| DELETE | 删除资源 | `DELETE /api/users/1` |

### 状态码

- 200 OK - 成功
- 201 Created - 创建成功
- 400 Bad Request - 请求错误
- 401 Unauthorized - 未授权
- 403 Forbidden - 禁止访问
- 404 Not Found - 不存在
- 500 Internal Server Error - 服务器错误

---

## 9.2 JSON 数据处理

### 解析 JSON

```python
import requests
import json

# 获取 JSON 数据
response = requests.get('https://api.example.com/data')
data = response.json()

# 访问数据
print(data['name'])
print(data['items'][0]['title'])

# 遍历
for item in data['items']:
    print(item['title'])
```

### 处理嵌套 JSON

```python
# 复杂 JSON 结构
data = {
    "status": "success",
    "data": {
        "users": [
            {
                "id": 1,
                "name": "Alice",
                "profile": {
                    "age": 25,
                    "city": "Beijing"
                }
            }
        ]
    }
}

# 安全访问
try:
    city = data['data']['users'][0]['profile']['city']
except (KeyError, IndexError) as e:
    print(f"访问失败: {e}")

# 使用 get 方法
city = data.get('data', {}).get('users', [{}])[0].get('profile', {}).get('city')
```

---

## 9.3 API 认证

### API Key

```python
# 在 URL 中
response = requests.get(
    'https://api.example.com/data',
    params={'api_key': 'your_api_key'}
)

# 在请求头中
headers = {'Authorization': 'Bearer your_api_key'}
response = requests.get('https://api.example.com/data', headers=headers)
```

### Basic Auth

```python
response = requests.get(
    'https://api.example.com/data',
    auth=('username', 'password')
)
```

### OAuth 2.0

```python
# 获取 access token
token_response = requests.post(
    'https://api.example.com/oauth/token',
    data={
        'grant_type': 'client_credentials',
        'client_id': 'your_client_id',
        'client_secret': 'your_client_secret'
    }
)

access_token = token_response.json()['access_token']

# 使用 token
headers = {'Authorization': f'Bearer {access_token}'}
response = requests.get('https://api.example.com/data', headers=headers)
```

---

## 9.4 分页处理

### Offset/Limit 分页

```python
def fetch_all_pages(base_url, page_size=100):
    """获取所有分页数据"""
    all_data = []
    offset = 0
    
    while True:
        params = {
            'offset': offset,
            'limit': page_size
        }
        
        response = requests.get(base_url, params=params)
        data = response.json()
        
        items = data.get('items', [])
        if not items:
            break
        
        all_data.extend(items)
        offset += len(items)
        
        print(f"已获取 {len(all_data)} 条数据")
    
    return all_data
```

### Cursor 分页

```python
def fetch_with_cursor(base_url):
    """游标分页"""
    all_data = []
    cursor = None
    
    while True:
        params = {'cursor': cursor} if cursor else {}
        
        response = requests.get(base_url, params=params)
        data = response.json()
        
        items = data.get('items', [])
        all_data.extend(items)
        
        # 获取下一页游标
        cursor = data.get('next_cursor')
        if not cursor:
            break
    
    return all_data
```

---

## 9.5 速率限制

### 检测速率限制

```python
response = requests.get('https://api.example.com/data')

if response.status_code == 429:
    # 被限流
    retry_after = int(response.headers.get('Retry-After', 60))
    print(f"被限流，等待 {retry_after} 秒")
    time.sleep(retry_after)
```

### 遵守速率限制

```python
import time

class RateLimiter:
    """速率限制器"""
    
    def __init__(self, max_requests, time_window):
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests = []
    
    def wait(self):
        """等待直到可以发送请求"""
        now = time.time()
        
        # 清理过期记录
        self.requests = [t for t in self.requests if now - t < self.time_window]
        
        if len(self.requests) >= self.max_requests:
            # 计算需要等待的时间
            wait_time = self.time_window - (now - self.requests[0])
            if wait_time > 0:
                time.sleep(wait_time)
        
        self.requests.append(time.time())

# 使用
limiter = RateLimiter(max_requests=100, time_window=60)  # 每分钟 100 次

for url in urls:
    limiter.wait()
    response = requests.get(url)
```

---

## 9.6 GraphQL API

### 基本查询

```python
query = """
{
  users {
    id
    name
    email
  }
}
"""

response = requests.post(
    'https://api.example.com/graphql',
    json={'query': query}
)

data = response.json()
users = data['data']['users']
```

### 带参数的查询

```python
query = """
query GetUser($id: ID!) {
  user(id: $id) {
    name
    email
    posts {
      title
    }
  }
}
"""

variables = {'id': '123'}

response = requests.post(
    'https://api.example.com/graphql',
    json={'query': query, 'variables': variables}
)
```

---

## 9.7 WebSocket 数据

### 安装

```bash
pip install websocket-client
```

### 基本使用

```python
import websocket
import json

def on_message(ws, message):
    data = json.loads(message)
    print(f"收到消息: {data}")

def on_error(ws, error):
    print(f"错误: {error}")

def on_close(ws, close_status_code, close_msg):
    print("连接关闭")

def on_open(ws):
    print("连接打开")
    # 发送订阅消息
    ws.send(json.dumps({'action': 'subscribe', 'channel': 'news'}))

# 创建连接
ws = websocket.WebSocketApp(
    'wss://example.com/ws',
    on_open=on_open,
    on_message=on_message,
    on_error=on_error,
    on_close=on_close
)

ws.run_forever()
```

---

## 9.8 逆向工程技巧

### 浏览器开发者工具

1. **Network 面板**
   - 查看所有请求
   - 过滤 XHR/Fetch
   - 查看请求头和参数

2. **Sources 面板**
   - 查看 JavaScript 代码
   - 设置断点调试
   - 分析加密逻辑

3. **Application 面板**
   - 查看 Cookie
   - 查看 LocalStorage
   - 查看 SessionStorage

### 抓包工具

#### Charles/Fiddler

- 拦截 HTTP/HTTPS 请求
- 修改请求和响应
- 分析 API 调用

#### mitmproxy

```bash
pip install mitmproxy
```

```python
# addon.py
from mitmproxy import http

def request(flow: http.HTTPFlow):
    print(f"请求: {flow.request.url}")

def response(flow: http.HTTPFlow):
    print(f"响应: {flow.response.status_code}")
```

```bash
mitmproxy -s addon.py
```

---

## 9.9 实战：GitHub API 爬虫

### 完整示例

```python
import requests
import time
import json

class GitHubCrawler:
    """GitHub API 爬虫"""
    
    def __init__(self, token=None):
        self.session = requests.Session()
        self.base_url = 'https://api.github.com'
        
        if token:
            self.session.headers.update({
                'Authorization': f'token {token}'
            })
        
        # 速率限制器
        self.rate_limiter = RateLimiter(30, 60)  # 每小时 30 次
    
    def search_repositories(self, query, per_page=100):
        """搜索仓库"""
        all_repos = []
        page = 1
        
        while True:
            self.rate_limiter.wait()
            
            params = {
                'q': query,
                'per_page': per_page,
                'page': page,
                'sort': 'stars',
                'order': 'desc'
            }
            
            response = self.session.get(
                f'{self.base_url}/search/repositories',
                params=params
            )
            
            if response.status_code != 200:
                print(f"错误: {response.status_code}")
                break
            
            data = response.json()
            repos = data.get('items', [])
            
            if not repos:
                break
            
            for repo in repos:
                all_repos.append({
                    'name': repo['full_name'],
                    'description': repo.get('description'),
                    'stars': repo['stargazers_count'],
                    'forks': repo['forks_count'],
                    'language': repo.get('language'),
                    'url': repo['html_url']
                })
            
            print(f"第 {page} 页: {len(repos)} 个仓库")
            
            # 检查是否有更多页面
            if len(repos) < per_page:
                break
            
            page += 1
            time.sleep(1)  # 礼貌延迟
        
        return all_repos
    
    def get_repo_details(self, owner, repo):
        """获取仓库详情"""
        self.rate_limiter.wait()
        
        url = f'{self.base_url}/repos/{owner}/{repo}'
        response = self.session.get(url)
        
        if response.status_code == 200:
            return response.json()
        return None
    
    def get_repo_contributors(self, owner, repo):
        """获取贡献者"""
        self.rate_limiter.wait()
        
        url = f'{self.base_url}/repos/{owner}/{repo}/contributors'
        response = self.session.get(url)
        
        if response.status_code == 200:
            return response.json()
        return []
    
    def save_to_json(self, data, filename):
        """保存数据"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

# 使用
if __name__ == '__main__':
    crawler = GitHubCrawler(token='your_github_token')
    
    # 搜索 Python 仓库
    repos = crawler.search_repositories('language:python stars:>1000')
    
    print(f"\n找到 {len(repos)} 个仓库")
    
    # 保存
    crawler.save_to_json(repos, 'github_repos.json')
```

---

## 9.10 本章小结

✅ **RESTful API** - 基本概念、HTTP 方法
✅ **JSON 处理** - 解析、嵌套数据
✅ **API 认证** - API Key、OAuth
✅ **分页处理** - Offset、Cursor
✅ **速率限制** - 检测、遵守
✅ **GraphQL** - 查询语法
✅ **WebSocket** - 实时数据
✅ **逆向工程** - 开发者工具、抓包
✅ **实战项目** - GitHub API 爬虫

---

## 📝 练习题

### 练习 1：Twitter API

使用 Twitter API v2：
- 获取用户推文
- 搜索话题
- 处理分页
- 保存数据

### 练习 2：天气 API

选择一个天气 API：
- 获取城市天气
-  forecasts
- 数据可视化
- 定时更新

### 练习 3：股票 API

爬取股票数据：
- 实时价格
- 历史数据
- K 线图数据
- 技术分析指标

---

## 🔗 相关资源

- [REST API 设计](https://restfulapi.net/)
- [GraphQL 文档](https://graphql.org/learn/)
- [GitHub API](https://docs.github.com/en/rest)

---

**下一章：** [第10章 - 数据存储 →](./10、数据存储.md)
