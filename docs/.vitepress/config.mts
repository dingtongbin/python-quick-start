import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/python-quick-start/',
  title: "python-quick-start",
  description: "快速学习python相关基础知识",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: 'Python基础', link: '/guide/python/python-basics/' },
      { text: '数据分析', link: '/guide/python/python-data-analysis/' },
      { text: '数据结构与算法', link: '/guide/python/python-data-structures-and-algorithms/' },
      { text: 'PySide6 GUI', link: '/guide/python/python-pyside6/' },
      { text: 'Django & DRF', link: '/guide/python/python-django/' },
      { text: '网络爬虫', link: '/guide/python/python-web-scraping/' }
    ],

    sidebar: {
      '/guide/python/python-basics/': [
        {
          text: '🐍 Python入门',
          items: [
            { text: '目录概览', link: '/guide/python/python-basics/' },
            { text: '1. 环境选择', link: '/guide/python/python-basics/1、环境选择' },
            { text: '2. 基本语法与数据类型', link: '/guide/python/python-basics/2、基本语法与数据类型' },
            { text: '3. 运算符与表达式', link: '/guide/python/python-basics/3、运算符与表达式' },
            { text: '4. 控制流程', link: '/guide/python/python-basics/4、控制流程' },
            { text: '5. 容器数据类型', link: '/guide/python/python-basics/5、容器数据类型' },
            { text: '6. 字符串操作', link: '/guide/python/python-basics/6、字符串操作' },
            { text: '7. 函数', link: '/guide/python/python-basics/7、函数' },
            { text: '8. 模块与包', link: '/guide/python/python-basics/8、模块与包' },
            { text: '9. 文件操作', link: '/guide/python/python-basics/9、文件操作' },
            { text: '10. 异常处理', link: '/guide/python/python-basics/10、异常处理' },
            { text: '11. 面向对象编程（OOP）基础', link: '/guide/python/python-basics/11、面向对象编程（OOP）基础' },
            { text: '12. 综合项目实践', link: '/guide/python/python-basics/12、综合项目实践' },
            { text: '13. 常见错误与调试方法', link: '/guide/python/python-basics/13、常见错误与调试方法' }
          ]
        }
      ],
      '/guide/python/python-data-analysis/': [
        {
          text: '📊 Python数据分析',
          items: [
            { text: '目录概览', link: '/guide/python/python-data-analysis/' },
            { text: '1. 环境准备与工具介绍', link: '/guide/python/python-data-analysis/1、环境准备与工具介绍' },
            { text: '2. NumPy数值计算基础', link: '/guide/python/python-data-analysis/2、NumPy数值计算基础' },
            { text: '3. Pandas数据处理核心', link: '/guide/python/python-data-analysis/3、Pandas数据处理核心' },
            { text: '4. 数据分组与聚合', link: '/guide/python/python-data-analysis/4、数据分组与聚合' },
            { text: '5. 时间序列数据处理', link: '/guide/python/python-data-analysis/5、时间序列数据处理' },
            { text: '6. 数据可视化', link: '/guide/python/python-data-analysis/6、数据可视化' },
            { text: '7. 统计分析基础', link: '/guide/python/python-data-analysis/7、统计分析基础' },
            { text: '8. 实战案例', link: '/guide/python/python-data-analysis/8、实战案例' },
            { text: '9. 性能优化与最佳实践', link: '/guide/python/python-data-analysis/9、性能优化与最佳实践' },
            { text: '10. 进阶主题', link: '/guide/python/python-data-analysis/10、进阶主题' }
          ]
        }
      ],
      '/guide/python/python-data-structures-and-algorithms/': [
        {
          text: '🌳 数据结构与算法',
          items: [
            { text: '目录概览', link: '/guide/python/python-data-structures-and-algorithms/' },
            { text: '1. 算法基础概念', link: '/guide/python/python-data-structures-and-algorithms/1、算法基础概念' },
            { text: '2. 线性数据结构', link: '/guide/python/python-data-structures-and-algorithms/2、线性数据结构' },
            { text: '3. 哈希表', link: '/guide/python/python-data-structures-and-algorithms/3、哈希表' },
            { text: '4. 树形结构', link: '/guide/python/python-data-structures-and-algorithms/4、树形结构' },
            { text: '5. 图论基础', link: '/guide/python/python-data-structures-and-algorithms/5、图论基础' },
            { text: '6. 排序算法', link: '/guide/python/python-data-structures-and-algorithms/6、排序算法' },
            { text: '7. 搜索算法', link: '/guide/python/python-data-structures-and-algorithms/7、搜索算法' },
            { text: '8. 动态规划', link: '/guide/python/python-data-structures-and-algorithms/8、动态规划' },
            { text: '9. 贪心算法', link: '/guide/python/python-data-structures-and-algorithms/9、贪心算法' },
            { text: '10. 回溯算法', link: '/guide/python/python-data-structures-and-algorithms/10、回溯算法' },
            { text: '11. 分治算法', link: '/guide/python/python-data-structures-and-algorithms/11、分治算法' },
            { text: '12. 算法复杂度分析与总结', link: '/guide/python/python-data-structures-and-algorithms/12、算法复杂度分析与总结' }
          ]
        }
      ],
      '/guide/python/python-pyside6/': [
        {
          text: '🖥️ PySide6 GUI开发',
          items: [
            { text: '目录概览', link: '/guide/python/python-pyside6/' },
            { text: '1. PySide6简介与环境搭建', link: '/guide/python/python-pyside6/1、PySide6简介与环境搭建' },
            { text: '2. 核心组件基础', link: '/guide/python/python-pyside6/2、核心组件基础' },
            { text: '3. 高级控件', link: '/guide/python/python-pyside6/3、高级控件' },
            { text: '4. 对话框与消息框', link: '/guide/python/python-pyside6/4、对话框与消息框' },
            { text: '5. 事件处理', link: '/guide/python/python-pyside6/5、事件处理' },
            { text: '6. 样式与主题', link: '/guide/python/python-pyside6/6、样式与主题' },
            { text: '7. 多线程与异步', link: '/guide/python/python-pyside6/7、多线程与异步' },
            { text: '8. 数据可视化', link: '/guide/python/python-pyside6/8、数据可视化' },
            { text: '9. 数据库集成', link: '/guide/python/python-pyside6/9、数据库集成' },
            { text: '10. 综合实战项目', link: '/guide/python/python-pyside6/10、综合实战项目' },
            { text: '11. 打包与发布', link: '/guide/python/python-pyside6/11、打包与发布' },
            { text: '12. 最佳实践与性能优化', link: '/guide/python/python-pyside6/12、最佳实践与性能优化' }
          ]
        }
      ],
      '/guide/python/python-django/': [
        {
          text: '🚀 Django 5.2 LTS & DRF',
          items: [
            { text: '目录概览', link: '/guide/python/python-django/' },
            { text: '1. 环境搭建与项目初始化', link: '/guide/python/python-django/1、环境搭建与项目初始化' },
            { text: '2. 数据库配置与 ORM 基础', link: '/guide/python/python-django/2、数据库配置与ORM基础' },
            { text: '3. ORM 高级查询与优化', link: '/guide/python/python-django/3、ORM高级查询与优化' },
            { text: '4. 视图、URL 与中间件', link: '/guide/python/python-django/4、视图URL与中间件' },
            { text: '5. 模板系统与静态文件', link: '/guide/python/python-django/5、模板系统与静态文件' },
            { text: '6. 用户认证与 RBAC 权限', link: '/guide/python/python-django/6、用户认证与RBAC权限' },
            { text: '7. DRF 核心概念', link: '/guide/python/python-django/7、DRF核心概念' },
            { text: '8. DRF 高级特性', link: '/guide/python/python-django/8、DRF高级特性' },
            { text: '9. Redis 缓存集成', link: '/guide/python/python-django/9、Redis缓存集成' },
            { text: '10. Celery 异步任务', link: '/guide/python/python-django/10、Celery异步任务' },
            { text: '11. Web 安全', link: '/guide/python/python-django/11、Web安全' },
            { text: '12. 测试与调试', link: '/guide/python/python-django/12、测试与调试' },
            { text: '13. 性能优化', link: '/guide/python/python-django/13、性能优化' },
            { text: '14. 部署准备', link: '/guide/python/python-django/14、部署准备' },
            { text: '15. Docker 部署', link: '/guide/python/python-django/15、Docker部署' },
            { text: '16. 实战项目', link: '/guide/python/python-django/16、实战项目' }
          ]
        }
      ],
      '/guide/python/python-web-scraping/': [
        {
          text: '🕷️ Python 网络爬虫',
          items: [
            { text: '目录概览', link: '/guide/python/python-web-scraping/' },
            { text: '1. 爬虫基础与环境搭建', link: '/guide/python/python-web-scraping/1、爬虫基础与环境搭建' },
            { text: '2. HTML 解析与数据提取', link: '/guide/python/python-web-scraping/2、HTML解析与数据提取' },
            { text: '3. Requests 库进阶', link: '/guide/python/python-web-scraping/3、Requests库进阶' },
            { text: '4. 动态网页爬取', link: '/guide/python/python-web-scraping/4、动态网页爬取' },
            { text: '5. 异步爬虫', link: '/guide/python/python-web-scraping/5、异步爬虫' },
            { text: '6. Scrapy 框架入门', link: '/guide/python/python-web-scraping/6、Scrapy框架入门' },
            { text: '7. Scrapy 进阶', link: '/guide/python/python-web-scraping/7、Scrapy进阶' },
            { text: '8. 反爬虫策略与应对', link: '/guide/python/python-web-scraping/8、反爬虫策略与应对' },
            { text: '9. API 数据抓取', link: '/guide/python/python-web-scraping/9、API数据抓取' },
            { text: '10. 数据存储', link: '/guide/python/python-web-scraping/10、数据存储' },
            { text: '11. 新闻网站爬虫', link: '/guide/python/python-web-scraping/11、新闻网站爬虫' },
            { text: '12. 电商商品爬虫', link: '/guide/python/python-web-scraping/12、电商商品爬虫' },
            { text: '13. 社交媒体爬虫', link: '/guide/python/python-web-scraping/13、社交媒体爬虫' },
            { text: '14. 爬虫部署', link: '/guide/python/python-web-scraping/14、爬虫部署' },
            { text: '15. 法律与伦理', link: '/guide/python/python-web-scraping/15、法律与伦理' }
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
            { text: 'PySide6 GUI', link: '/guide/python/python-pyside6/' },
            { text: 'Django & DRF', link: '/guide/python/python-django/' },
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
