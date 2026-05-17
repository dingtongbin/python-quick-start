# 贡献指南

感谢你对本项目的关注！无论是修正错别字、补充示例代码，还是新增教程章节，都非常欢迎。

## 如何贡献

### 1. 提 Issue

发现内容错误、链接失效、或有改进建议？直接 [提 Issue](https://github.com/dingtongbin/python-quick-start/issues/new) 即可。

### 2. 提 Pull Request

```bash
# 1. Fork 本仓库
# 2. 克隆你的 Fork
git clone https://github.com/你的用户名/python-quick-start.git
cd python-quick-start

# 3. 创建分支
git checkout -b feat/你的改动描述

# 4. 安装依赖
npm install

# 5. 本地预览
npm run docs:dev

# 6. 修改内容后提交
git add .
git commit -m "feat: 描述你的改动"

# 7. 推送并提 PR
git push origin feat/你的改动描述
```

## 内容规范

### 文件命名

- 使用中文文件名，与已有文件保持一致
- 格式：`第X章 章节名称.md`，例如 `第1章 开发环境搭建.md`

### Markdown 格式

- 每个章节开头使用 `#` 一级标题声明章节名称
- 代码块使用正确的语言标识（```python）
- 重要内容使用 `**加粗**` 或 `> 提示框`
- 长文章建议使用 `------` 分隔不同小节

### 内容要求

- **面向初学者**：假设读者没有编程基础，解释清楚每个概念
- **代码可运行**：所有示例代码必须可以直接运行，不要用伪代码
- **循序渐进**：先讲是什么、为什么，再讲怎么用
- **实际场景**：尽量用真实场景举例，而不是 `a = 1, b = 2`

## 目录结构

```
docs/
├── index.md                    # 首页
├── guide/
│   └── python/
│       ├── python-basics/      # Python 基础
│       ├── python-data-analysis/
│       ├── python-data-structures-and-algorithms/
│       ├── python-fastapi/
│       ├── python-pyside6/
│       ├── python-django/
│       └── python-web-scraping/
└── .vitepress/
    └── config.mts              # VitePress 配置
```

## 新增章节

如果你想新增一个教程章节：

1. 在对应的目录下创建 `.md` 文件
2. 在 `docs/.vitepress/config.mts` 的 `sidebar` 中添加链接
3. 确保构建通过：`npm run docs:build`

## 问题？

有任何疑问，欢迎 [提 Issue](https://github.com/dingtongbin/python-quick-start/issues/new) 讨论！
