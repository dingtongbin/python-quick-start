---
layout: home

hero:
  name: "Python Quick Start"
  text: "从零开始，系统掌握 Python"
  tagline: 覆盖基础语法、数据分析、Web 开发、GUI、爬虫、算法 6 大方向，85+ 篇实战教程
  actions:
    - theme: brand
      text: 🐍 Python 基础入门
      link: /guide/python/python-basics/
    - theme: alt
      text: 📚 查看全部教程
      link: /guide/python/python-basics/index

features:
  - title: 🐍 Python 基础
    details: 从环境搭建到面向对象，13 章系统讲解 Python 核心语法。零基础也能看懂。
    link: /guide/python/python-basics/
  - title: 📊 数据分析
    details: 掌握 NumPy、Pandas、Matplotlib，学会数据清洗、统计分析和可视化。
    link: /guide/python/python-data-analysis/
  - title: 🧮 数据结构与算法
    details: 链表、树、图、排序、搜索、动态规划……面试高频考点一网打尽。
    link: /guide/python/python-data-structures-and-algorithms/
  - title: 🖥️ PySide6 桌面应用
    details: 用 Python 开发跨平台 GUI 应用，从按钮到打包发布，完整实战。
    link: /guide/python/python-pyside6/
  - title: 🚀 Django & DRF
    details: Django 5.2 LTS 全栈 Web 开发，含 ORM、REST API、缓存、异步任务、Docker 部署。
    link: /guide/python/python-django/
  - title: 🕷️ 网络爬虫
    details: Requests、BeautifulSoup、Scrapy、Selenium，静态与动态页面通吃。
    link: /guide/python/python-web-scraping/
---

## 📖 推荐学习路线

```
Python 基础（必学）
    ├── 数据分析（适合数据方向）
    ├── 网络爬虫（适合自动化/数据采集）
    └── 数据结构与算法（面试必备）
            ↓
    Django Web 开发 / PySide6 桌面开发（选一个深入）
```

## 🛠️ 本地运行

```bash
git clone https://github.com/dingtongbin/python-quick-start.git
cd python-quick-start
npm install
npm run docs:dev
```

浏览器打开 `http://localhost:5173/python-quick-start/` 即可预览。
