import { defineConfig } from 'vitepress'
import escapeBraces from './plugins/escapeBraces.js'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/python-quick-start/',
  title: "python-quick-start",
  description: "快速学习python相关基础知识",
  ignoreDeadLinks: true,
  markdown: {
    config(md) {
      md.use(escapeBraces)
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: 'Python基础', link: '/guide/python/python-basics/第1章 开发环境搭建' },
      { text: '数据结构与算法', link: '/guide/python/python-data-structures-and-algorithms/第1章 算法基础与复杂度分析' },
      { text: '网络爬虫', link: '/guide/python/python-web-scraping/第1章 爬虫基础与法律伦理' },
      { text: '数据分析', link: '/guide/python/python-data-analysis/第1章 数据分析入门与环境搭建' },
      { text: 'FastAPI', link: '/guide/python/python-fastapi/第1章 起航：FastAPI 初体验' },
      { text: '我的博客', link: 'https://dingtongbin.cn' }
    ],

    sidebar: {
      '/guide/python/python-basics/': [
        {
          text: 'Python入门',
          items: [
            { text: '目录概览', link: '/guide/python/python-basics/' },
            { text: '第1章 开发环境搭建', link: '/guide/python/python-basics/第1章 开发环境搭建' },
            { text: '第2章 基础语法入门', link: '/guide/python/python-basics/第2章 基础语法入门' },
            { text: '第3章 数值类型详解', link: '/guide/python/python-basics/第3章 数值类型详解' },
            { text: '第4章 容器类型基础', link: '/guide/python/python-basics/第4章 容器类型基础' },
            { text: '第5章 程序控制结构', link: '/guide/python/python-basics/第5章 程序控制结构' },
            { text: '第6章 函数基础', link: '/guide/python/python-basics/第6章 函数基础' },
            { text: '第7章 作用域与闭包', link: '/guide/python/python-basics/第7章 作用域与闭包' },
            { text: '第8章 模块与导入', link: '/guide/python/python-basics/第8章 模块与导入' },
            { text: '第9章 异常处理', link: '/guide/python/python-basics/第9章 异常处理' },
            { text: '第10章 类与对象基础', link: '/guide/python/python-basics/第10章 类与对象基础' },
            { text: '第11章 继承基础', link: '/guide/python/python-basics/第11章 继承基础' },
            { text: '第12章 datetime 时间处理', link: '/guide/python/python-basics/第12章 datetime 时间处理' },
            { text: '第13章 文件操作基础', link: '/guide/python/python-basics/第13章 文件操作基础' },
            { text: '第14章 实用工具类型', link: '/guide/python/python-basics/第14章 实用工具类型' }
          ]
        }
      ],
      '/guide/python/python-data-analysis/': [
        {
          text: 'Python数据分析',
          items: [
            { text: '目录概览', link: '/guide/python/python-data-analysis/' },
            { text: '第1章 数据分析入门与环境搭建', link: '/guide/python/python-data-analysis/第1章 数据分析入门与环境搭建' },
            { text: '第2章 NumPy 数组基础', link: '/guide/python/python-data-analysis/第2章 NumPy 数组基础' },
            { text: '第3章 pandas 核心数据结构', link: '/guide/python/python-data-analysis/第3章 pandas 核心数据结构' },
            { text: '第4章 数据清洗与预处理', link: '/guide/python/python-data-analysis/第4章 数据清洗与预处理' },
            { text: '第5章 数据变换与特征工程', link: '/guide/python/python-data-analysis/第5章 数据变换与特征工程' },
            { text: '第6章 分组聚合分析', link: '/guide/python/python-data-analysis/第6章 分组聚合分析' },
            { text: '第7章 数据合并与重塑', link: '/guide/python/python-data-analysis/第7章 数据合并与重塑' },
            { text: '第8章 Matplotlib 基础可视化', link: '/guide/python/python-data-analysis/第8章 Matplotlib 基础可视化' },
            { text: '第9章 Seaborn 统计可视化', link: '/guide/python/python-data-analysis/第9章 Seaborn 统计可视化' },
            { text: '第10章 探索性数据分析（EDA）', link: '/guide/python/python-data-analysis/第10章 探索性数据分析（EDA）' },
            { text: '第11章 分析报告与项目组织', link: '/guide/python/python-data-analysis/第11章 分析报告与项目组织' },
            { text: '第12章 综合实战案例', link: '/guide/python/python-data-analysis/第12章 综合实战案例' }
          ]
        }
      ],
      '/guide/python/python-data-structures-and-algorithms/': [
        {
          text: '数据结构与算法',
          items: [
            { text: '目录概览', link: '/guide/python/python-data-structures-and-algorithms/' },
            { text: '第1章 算法基础与复杂度分析', link: '/guide/python/python-data-structures-and-algorithms/第1章 算法基础与复杂度分析' },
            { text: '第2章 数组与字符串', link: '/guide/python/python-data-structures-and-algorithms/第2章 数组与字符串' },
            { text: '第3章 链表', link: '/guide/python/python-data-structures-and-algorithms/第3章 链表' },
            { text: '第4章 栈与队列', link: '/guide/python/python-data-structures-and-algorithms/第4章 栈与队列' },
            { text: '第5章 哈希表', link: '/guide/python/python-data-structures-and-algorithms/第5章 哈希表' },
            { text: '第6章 树与二叉树', link: '/guide/python/python-data-structures-and-algorithms/第6章 树与二叉树' },
            { text: '第7章 二叉搜索树（BST）', link: '/guide/python/python-data-structures-and-algorithms/第7章 二叉搜索树（BST）' },
            { text: '第8章 堆与优先队列', link: '/guide/python/python-data-structures-and-algorithms/第8章 堆与优先队列' },
            { text: '第9章 图', link: '/guide/python/python-data-structures-and-algorithms/第9章 图' },
            { text: '第10章 排序算法', link: '/guide/python/python-data-structures-and-algorithms/第10章 排序算法' },
            { text: '第11章 查找算法', link: '/guide/python/python-data-structures-and-algorithms/第11章 查找算法' },
            { text: '第12章 递归与分治', link: '/guide/python/python-data-structures-and-algorithms/第12章 递归与分治' },
            { text: '第13章 动态规划', link: '/guide/python/python-data-structures-and-algorithms/第13章 动态规划' },
            { text: '第14章 贪心算法', link: '/guide/python/python-data-structures-and-algorithms/第14章 贪心算法' }
          ]
        }
      ],
      '/guide/python/python-fastapi/': [
        {
          text: 'FastAPI 现代 Web 开发',
          items: [
            { text: '目录概览', link: '/guide/python/python-fastapi/' },
            { text: '第1章 起航：FastAPI 初体验', link: '/guide/python/python-fastapi/第1章 起航：FastAPI 初体验' },
            { text: '第2章 项目结构规范化', link: '/guide/python/python-fastapi/第2章 项目结构规范化' },
            { text: '第3章 异步数据库连接（MySQL）', link: '/guide/python/python-fastapi/第3章 异步数据库连接（MySQL）' },
            { text: '第4章 模型定义与关系（SQLAlchemy 2.0 语法）', link: '/guide/python/python-fastapi/第4章 模型定义与关系（SQLAlchemy 2.0 语法）' },
            { text: '第5章 数据库迁移管理（Alembic）', link: '/guide/python/python-fastapi/第5章 数据库迁移管理（Alembic）' },
            { text: '第6章 CRUD 操作与事务', link: '/guide/python/python-fastapi/第6章 CRUD 操作与事务' },
            { text: '第7章 请求与响应模型（Pydantic v2）', link: '/guide/python/python-fastapi/第7章 请求与响应模型（Pydantic v2）' },
            { text: '第8章 Redis 集成：缓存与会话', link: '/guide/python/python-fastapi/第8章 Redis 集成：缓存与会话' },
            { text: '第9章 异步后台任务队列（基于 Redis List）', link: '/guide/python/python-fastapi/第9章 异步后台任务队列（基于 Redis List）' },
            { text: '第10章 权限与认证', link: '/guide/python/python-fastapi/第10章 权限与认证' },
            { text: '第11章 测试与调试', link: '/guide/python/python-fastapi/第11章 测试与调试' },
            { text: '第12章 部署上线', link: '/guide/python/python-fastapi/第12章 部署上线' },
            { text: '第13章 综合项目实战：用户通知中心', link: '/guide/python/python-fastapi/第13章 综合项目实战：用户通知中心' }
          ]
        }
      ],
      '/guide/python/python-web-scraping/': [
        {
          text: 'Python 网络爬虫',
          items: [
            { text: '目录概览', link: '/guide/python/python-web-scraping/' },
            { text: '第1章 爬虫基础与法律伦理', link: '/guide/python/python-web-scraping/第1章 爬虫基础与法律伦理' },
            { text: '第2章 静态页面爬取入门', link: '/guide/python/python-web-scraping/第2章 静态页面爬取入门' },
            { text: '第3章 HTML 解析利器：BeautifulSoup', link: '/guide/python/python-web-scraping/第3章 HTML 解析利器：BeautifulSoup' },
            { text: '第4章 正则表达式在爬虫中的应用', link: '/guide/python/python-web-scraping/第4章 正则表达式在爬虫中的应用' },
            { text: '第5章 动态页面与 Selenium 自动化', link: '/guide/python/python-web-scraping/第5章 动态页面与 Selenium 自动化' },
            { text: '第6章 表单提交与登录认证', link: '/guide/python/python-web-scraping/第6章 表单提交与登录认证' },
            { text: '第7章 反爬机制与应对策略', link: '/guide/python/python-web-scraping/第7章 反爬机制与应对策略' },
            { text: '第8章 数据存储与导出', link: '/guide/python/python-web-scraping/第8章 数据存储与导出' },
            { text: '第9章 异步爬虫提速：aiohttp 与 asyncio', link: '/guide/python/python-web-scraping/第9章 异步爬虫提速：aiohttp 与 asyncio' },
            { text: '第10章 Scrapy 框架入门', link: '/guide/python/python-web-scraping/第10章 Scrapy 框架入门' },
            { text: '第11章 爬虫监控与日志管理', link: '/guide/python/python-web-scraping/第11章 爬虫监控与日志管理' },
            { text: '第12章 综合实战项目', link: '/guide/python/python-web-scraping/第12章 综合实战项目' }
          ]
        }
      ],
      '/': [
        {
          text: '快速开始',
          items: [
            { text: 'Python基础', link: '/guide/python/python-basics/' },
            { text: '数据分析', link: '/guide/python/python-data-analysis/' },
            { text: '数据结构与算法', link: '/guide/python/python-data-structures-and-algorithms/' },
            { text: 'FastAPI', link: '/guide/python/python-fastapi/' },
            { text: '网络爬虫', link: '/guide/python/python-web-scraping/' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/dingtongbin/python-quick-start' }
    ],
    search: {
      provider: 'local'
    }
  }
})
