### 9.1 同步 vs 异步：性能差异直观对比

在爬虫开发中，同步和异步是两种截然不同的请求处理方式。同步爬虫就像排队买票，一个请求完成后再处理下一个；而异步爬虫则像同时让多个人去不同窗口买票，效率自然高得多。

**同步爬虫特点**：

- 代码简单直观，易于理解和调试
- 请求按顺序执行，前一个完成才开始下一个
- 网络等待时间（I/O）会阻塞整个程序

**异步爬虫特点**：

- 利用协程实现并发，提高网络利用率
- 在等待响应时可以处理其他任务
- 适合大量网络请求的场景

下面通过一个简单的对比示例来感受两者的性能差异：

```python
# 同步爬虫示例
import requests
import time

def sync_fetch(url):
    """同步获取单个URL"""
    try:
        response = requests.get(url, timeout=5)
        return len(response.content)
    except Exception as e:
        print(f"同步请求失败: {e}")
        return 0

def sync_crawler(urls):
    """同步爬虫主函数"""
    start_time = time.time()
    results = []
    for url in urls:
        size = sync_fetch(url)
        results.append(size)
    end_time = time.time()
    print(f"同步爬虫耗时: {end_time - start_time:.2f}秒")
    return results

# 测试URL列表
test_urls = [
    'https://httpbin.org/delay/1',
    'https://httpbin.org/delay/1', 
    'https://httpbin.org/delay/1'
]

# 执行同步爬虫
sync_results = sync_crawler(test_urls)
```

| 功能名称 | 调用方法       | 具体功能与注意事项                           |
| -------- | -------------- | -------------------------------------------- |
| 同步请求 | requests.get() | 每次请求都会阻塞程序执行，直到收到响应或超时 |
| 时间测量 | time.time()    | 用于计算程序执行时间，对比性能差异           |
| 错误处理 | try-except     | 必须包含超时设置，避免程序长时间挂起         |

**注意事项**：

- 同步爬虫在处理大量URL时会非常慢，因为每个请求都要等待完成
- 必须设置合理的超时时间，避免单个请求失败影响整体程序
- 返回值通常是响应内容的长度或其他简单指标，便于性能对比

同步爬虫虽然简单，但在面对大量网络请求时效率低下。这正是异步爬虫大显身手的地方，它能充分利用网络等待时间，大幅提升爬取效率。

### 9.2 使用 aiohttp 发送并发请求

aiohttp 是 Python 中最流行的异步 HTTP 客户端/服务器框架，专门为 asyncio 设计。它允许我们在单线程中并发处理多个 HTTP 请求，非常适合网络爬虫场景。

首先需要安装 aiohttp：

```bash
pip install aiohttp
```

aiohttp 的核心优势在于它使用协程来处理 I/O 操作，当一个请求在等待网络响应时，程序可以立即处理其他请求，而不是傻傻地等待。

```python
# 异步爬虫基础示例
import aiohttp
import asyncio
import time

async def async_fetch(session, url):
    """异步获取单个URL"""
    try:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=5)) as response:
            content = await response.read()
            return len(content)
    except Exception as e:
        print(f"异步请求失败: {e}")
        return 0

async def async_crawler(urls):
    """异步爬虫主函数"""
    start_time = time.time()
    # 创建 aiohttp 客户端会话
    async with aiohttp.ClientSession() as session:
        # 创建所有任务
        tasks = [async_fetch(session, url) for url in urls]
        # 并发执行所有任务
        results = await asyncio.gather(*tasks)
    end_time = time.time()
    print(f"异步爬虫耗时: {end_time - start_time:.2f}秒")
    return results

# 测试URL列表
test_urls = [
    'https://httpbin.org/delay/1',
    'https://httpbin.org/delay/1',
    'https://httpbin.org/delay/1'
]

# 执行异步爬虫
async_results = asyncio.run(async_crawler(test_urls))
```

| 功能名称 | 调用方法                | 具体功能与注意事项                   |
| -------- | ----------------------- | ------------------------------------ |
| 创建会话 | aiohttp.ClientSession() | 必须使用 async with 管理会话生命周期 |
| 异步请求 | session.get()           | 返回协程对象，需要用 await 等待结果  |
| 并发执行 | asyncio.gather()        | 同时运行多个协程，返回所有结果列表   |
| 超时设置 | aiohttp.ClientTimeout() | 异步超时设置方式与 requests 不同     |

**注意事项**：

- aiohttp 的所有操作都是异步的，必须在 async 函数中使用 await
- ClientSession 应该在整个爬虫过程中复用，而不是为每个请求创建新会话
- asyncio.gather() 会等待所有任务完成，如果某个任务失败，需要特殊处理
- 异步代码的调试比同步代码复杂，需要理解协程的工作原理

通过 aiohttp，我们可以轻松实现高并发的网络请求，显著提升爬虫效率。但要注意合理控制并发数量，避免对目标服务器造成过大压力。

### 9.3 asyncio 基础：async/await 语法

要真正掌握异步爬虫，必须理解 asyncio 的核心概念和 async/await 语法。这就像学会了武功秘籍的内功心法，才能发挥出真正的威力。

**async/await 核心概念**：

- **协程（Coroutine）**：使用 async def 定义的函数，调用时返回协程对象
- **事件循环（Event Loop）**：管理协程执行的调度器
- **await**：暂停当前协程，等待另一个协程完成

asyncio 提供了多种方式来运行和管理协程，让我们逐一了解：

```python
# asyncio 基础语法演示
import asyncio

async def say_hello(name, delay):
    """模拟异步操作的协程函数"""
    print(f"开始问候 {name}")
    # 模拟异步I/O操作（如网络请求）
    await asyncio.sleep(delay)
    print(f"Hello, {name}!")
    return f"Greeting to {name} completed"

async def main():
    """主协程函数"""
    # 方式1: 顺序执行协程
    print("=== 顺序执行 ===")
    result1 = await say_hello("Alice", 1)
    result2 = await say_hello("Bob", 1)
    print(f"顺序执行结果: {result1}, {result2}")
    
    # 方式2: 并发执行协程
    print("\n=== 并发执行 ===")
    # 创建任务
    task1 = asyncio.create_task(say_hello("Charlie", 1))
    task2 = asyncio.create_task(say_hello("David", 1))
    # 等待所有任务完成
    results = await asyncio.gather(task1, task2)
    print(f"并发执行结果: {results}")
    
    # 方式3: 使用 as_completed 处理完成的任务
    print("\n=== as_completed 示例 ===")
    tasks = [
        say_hello("Eve", 2),
        say_hello("Frank", 1),
        say_hello("Grace", 3)
    ]
    for coro in asyncio.as_completed(tasks):
        result = await coro
        print(f"完成: {result}")

# 运行主协程
if __name__ == "__main__":
    asyncio.run(main())
```

| 功能名称   | 调用方法               | 具体功能与注意事项             |
| ---------- | ---------------------- | ------------------------------ |
| 定义协程   | async def function()   | 返回协程对象，不是直接执行     |
| 等待协程   | await coroutine        | 只能在 async 函数中使用        |
| 创建任务   | asyncio.create_task()  | 将协程包装为任务，立即开始执行 |
| 并发等待   | asyncio.gather()       | 等待多个协程完成，保持结果顺序 |
| 按完成顺序 | asyncio.as_completed() | 按任务完成的顺序处理结果       |

**注意事项**：

- async def 定义的函数调用时不会立即执行，而是返回协程对象
- await 只能在 async 函数内部使用，不能在普通函数中使用
- asyncio.run() 是 Python 3.7+ 推荐的运行协程的方式
- create_task() 会立即开始执行协程，而 gather() 可以直接接受协程对象
- as_completed() 适用于需要及时处理已完成任务的场景

掌握这些 asyncio 基础知识后，你就能更好地理解和编写异步爬虫代码。记住，异步编程的核心思想是"不要阻塞"，充分利用等待时间做其他事情。

### 9.4 异步爬虫模板：批量抓取并保存

现在让我们整合前面学到的知识，构建一个完整的异步爬虫模板。这个模板可以批量抓取网页并保存数据，既高效又实用。

一个好的异步爬虫模板应该包含以下要素：

- 可配置的并发数量控制
- 完善的错误处理机制  
- 数据保存功能
- 合理的请求间隔控制

```python
# 完整的异步爬虫模板
import aiohttp
import asyncio
import json
import time
from typing import List, Dict, Any

class AsyncCrawler:
    """异步爬虫类模板"""
    
    def __init__(self, max_concurrent: int = 10, delay: float = 0.1):
        """
        初始化爬虫参数
        :param max_concurrent: 最大并发数
        :param delay: 请求间隔延迟（秒）
        """
        self.max_concurrent = max_concurrent
        self.delay = delay
        self.semaphore = asyncio.Semaphore(max_concurrent)
        self.session = None
    
    async def fetch_url(self, url: str) -> Dict[str, Any]:
        """
        获取单个URL的内容
        :param url: 目标URL
        :return: 包含URL和内容的字典
        """
        async with self.semaphore:  # 控制并发数量
            try:
                # 添加请求延迟
                await asyncio.sleep(self.delay)
                
                async with self.session.get(
                    url, 
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    if response.status == 200:
                        content = await response.text()
                        return {
                            'url': url,
                            'status': response.status,
                            'content': content[:200],  # 只保存前200字符作为示例
                            'success': True
                        }
                    else:
                        return {
                            'url': url,
                            'status': response.status,
                            'content': '',
                            'success': False
                        }
            except Exception as e:
                return {
                    'url': url,
                    'status': 0,
                    'content': f'Error: {str(e)}',
                    'success': False
                }
    
    async def crawl_urls(self, urls: List[str]) -> List[Dict[str, Any]]:
        """
        批量抓取URL列表
        :param urls: URL列表
        :return: 抓取结果列表
        """
        async with aiohttp.ClientSession() as session:
            self.session = session
            tasks = [self.fetch_url(url) for url in urls]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # 处理异常结果
            processed_results = []
            for result in results:
                if isinstance(result, Exception):
                    processed_results.append({
                        'url': 'unknown',
                        'status': 0,
                        'content': f'Exception: {str(result)}',
                        'success': False
                    })
                else:
                    processed_results.append(result)
            
            return processed_results
    
    async def save_results(self, results: List[Dict[str, Any]], filename: str):
        """
        保存结果到JSON文件
        :param results: 抓取结果列表
        :param filename: 保存的文件名
        """
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(results, f, ensure_ascii=False, indent=2)
            print(f"结果已保存到 {filename}")
        except Exception as e:
            print(f"保存文件失败: {e}")

# 使用示例
async def main():
    """主函数示例"""
    # 测试URL列表
    test_urls = [
        'https://httpbin.org/get',
        'https://httpbin.org/ip',
        'https://httpbin.org/user-agent',
        'https://httpbin.org/headers',
        'https://httpbin.org/json'
    ]
    
    # 创建爬虫实例
    crawler = AsyncCrawler(max_concurrent=3, delay=0.5)
    
    print("开始异步爬取...")
    start_time = time.time()
    
    # 执行爬取
    results = await crawler.crawl_urls(test_urls)
    
    end_time = time.time()
    print(f"爬取完成，耗时: {end_time - start_time:.2f}秒")
    print(f"成功抓取: {sum(1 for r in results if r['success'])}/{len(results)}")
    
    # 保存结果
    await crawler.save_results(results, 'crawler_results.json')

# 运行爬虫
if __name__ == "__main__":
    asyncio.run(main())
```

| 功能名称 | 调用方法                | 具体功能与注意事项                   |
| -------- | ----------------------- | ------------------------------------ |
| 并发控制 | asyncio.Semaphore()     | 限制同时进行的请求数量，避免过度并发 |
| 会话管理 | aiohttp.ClientSession() | 复用TCP连接，提高效率                |
| 异常处理 | return_exceptions=True  | gather() 参数，将异常作为结果返回    |
| 结果保存 | json.dump()             | 将抓取结果保存为JSON格式             |
| 请求延迟 | asyncio.sleep()         | 在每次请求前添加延迟，避免被反爬     |

**注意事项**：

- Semaphore 是控制并发数量的关键，避免对目标服务器造成过大压力
- ClientSession 应该在整个爬取过程中复用，而不是为每个请求创建新会话
- return_exceptions=True 参数确保即使某些请求失败，其他请求仍能继续
- 保存文件时要注意编码问题，使用 UTF-8 编码支持中文
- 实际项目中应该根据目标网站的反爬策略调整并发数和延迟时间

这个异步爬虫模板提供了一个良好的基础结构，你可以根据具体需求进行扩展，比如添加代理支持、更复杂的数据解析逻辑，或者集成到更大的爬虫系统中。记住，高效的异步爬虫不仅要快，还要友好，避免给目标服务器带来不必要的负担。