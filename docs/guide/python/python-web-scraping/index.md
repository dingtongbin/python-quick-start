# Python 网络爬虫实战教程目录

## 第1章 爬虫基础与法律伦理

1.1 什么是网络爬虫：定义、用途与典型场景
1.2 HTTP 协议基础：请求方法、状态码、Headers
1.3 robots.txt 协议与爬虫道德规范
1.4 法律风险提示：数据版权、反爬条款与合规建议  

## 第2章 静态页面爬取入门

2.1 使用 requests 发送 GET/POST 请求
2.2 响应对象解析：status_code、text、encoding
2.3 设置请求头（User-Agent、Referer）模拟浏览器
2.4 处理中文乱码与编码自动识别  

## 第3章 HTML 解析利器：BeautifulSoup

3.1 BeautifulSoup 对象创建与解析器选择
3.2 节点定位：find、find_all、select 方法详解
3.3 提取文本、属性与嵌套结构数据
3.4 异常处理：标签不存在时的安全访问  

## 第4章 正则表达式在爬虫中的应用

4.1 re 模块基础：search、match、findall
4.2 常用模式：匹配数字、链接、邮箱、电话
4.3 分组提取与命名捕获
4.4 正则 vs 解析器：何时该用哪种方式  

## 第5章 动态页面与 Selenium 自动化

5.1 为什么需要 Selenium：JavaScript 渲染内容
5.2 安装 WebDriver 与配置浏览器驱动
5.3 元素定位：ID、Class、XPath、CSS Selector
5.4 模拟点击、输入、滚动与等待机制  

## 第6章 表单提交与登录认证

6.1 分析登录流程：抓包查看 POST 数据
6.2 使用 Session 维持 Cookie 会话
6.3 处理验证码：跳过、OCR 或人工介入策略
6.4 模拟登录实战：以某论坛为例（仅教学用途）  

## 第7章 反爬机制与应对策略

7.1 常见反爬手段：IP 封禁、频率限制、User-Agent 检测
7.2 设置请求间隔与随机延迟
7.3 使用代理 IP 池轮换访问
7.4 请求头随机化与指纹混淆  

## 第8章 数据存储与导出

8.1 写入 CSV 文件：csv 模块与 pandas.to_csv
8.2 存入 JSON 文件：ensure_ascii 与缩进格式
8.3 连接 SQLite / MySQL 存储结构化数据
8.4 图片与文件下载：stream 模式与二进制写入  

## 第9章 异步爬虫提速：aiohttp 与 asyncio

9.1 同步 vs 异步：性能差异直观对比
9.2 使用 aiohttp 发送并发请求
9.3 asyncio 基础：async/await 语法
9.4 异步爬虫模板：批量抓取并保存  

## 第10章 Scrapy 框架入门

10.1 Scrapy 架构：Spider、Item、Pipeline、Middleware
10.2 创建项目与定义 Item 结构
10.3 编写 Spider 解析响应并生成 Item
10.4 使用 Pipeline 存储数据到数据库  

## 第11章 爬虫监控与日志管理

11.1 添加日志记录：logging 模块配置
11.2 监控成功率与失败重试机制
11.3 使用 tqdm 显示进度条
11.4 异常分类处理：超时、连接错误、解析失败  

## 第12章 综合实战项目

12.1 新闻网站全文采集系统
12.2 电商商品价格监控爬虫
12.3 招聘信息聚合分析爬虫
12.4 社交媒体公开数据采集（遵守平台规则）
