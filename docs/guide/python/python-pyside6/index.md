# PySide6 GUI 开发入门目录

本博客面向想要学习桌面应用开发的 Python 开发者，内容从基础概念到实际应用，循序渐进，强调实践与项目驱动。所有示例基于 **PySide6 (Qt6)** 编写。

完成本教程后，你将能够使用 PySide6 创建功能完整的跨平台桌面应用程序，掌握 GUI 编程的核心概念，为开发专业级桌面软件打下坚实基础。

------

## 第一章：PySide6 简介与环境搭建

- 1.1 什么是 PySide6？为什么选择它？
- 1.2 PySide6 vs PyQt6 vs Tkinter 对比
- 1.3 安装 PySide6
- 1.4 第一个 PySide6 程序
- 1.5 理解信号与槽机制
- 1.6 Qt Designer 简介

## 第二章：核心组件基础

- 2.1 QWidget - 所有组件的基类
- 2.2 QMainWindow - 主窗口框架
- 2.3 布局管理器：
  - QVBoxLayout（垂直布局）
  - QHBoxLayout（水平布局）
  - QGridLayout（网格布局）
  - QFormLayout（表单布局）
- 2.4 常用基础控件：
  - QLabel（标签）
  - QPushButton（按钮）
  - QLineEdit（单行输入框）
  - QTextEdit（多行文本框）
  - QComboBox（下拉框）
  - QCheckBox（复选框）
  - QRadioButton（单选按钮）

## 第三章：高级控件

- 3.1 QListWidget（列表控件）
- 3.2 QTableWidget（表格控件）
- 3.3 QTreeWidget（树形控件）
- 3.4 QTabWidget（标签页）
- 3.5 QStackedWidget（堆叠窗口）
- 3.6 QSplitter（分割器）
- 3.7 QGroupBox（分组框）
- 3.8 QScrollArea（滚动区域）

## 第四章：对话框与消息框

- 4.1 QMessageBox（消息对话框）
- 4.2 QInputDialog（输入对话框）
- 4.3 QFileDialog（文件对话框）
- 4.4 QColorDialog（颜色选择器）
- 4.5 QFontDialog（字体选择器）
- 4.6 自定义对话框

## 第五章：事件处理

- 5.1 事件系统概述
- 5.2 鼠标事件
- 5.3 键盘事件
- 5.4 拖放事件
- 5.5 定时器事件
- 5.6 事件过滤器

## 第六章：样式与主题

- 6.1 Qt 样式表（QSS）基础
- 6.2 常用样式属性
- 6.3 动态样式切换
- 6.4 自定义组件样式
- 6.5 图标和资源文件

## 第七章：多线程与异步

- 7.1 为什么需要多线程？
- 7.2 QThread 基础
- 7.3 工作线程模式
- 7.4 线程间通信
- 7.5 进度条与后台任务

## 第八章：数据可视化

- 8.1 Matplotlib 集成
- 8.2 PyQtGraph 简介
- 8.3 实时数据更新
- 8.4 图表交互

## 第九章：数据库集成

- 9.1 SQLite 数据库操作
- 9.2 QSqlTableModel
- 9.3 数据显示与编辑
- 9.4 数据验证

## 第十章：实战项目

- 10.1 项目一：待办事项应用（Todo List）
  - 需求分析
  - UI 设计
  - 功能实现
  - 数据持久化
- 10.2 项目二：文本编辑器
  - 菜单栏和工具栏
  - 文件操作
  - 查找替换
  - 语法高亮
- 10.3 项目三：数据管理系统的
  - 表格展示
  - CRUD 操作
  - 数据导出
  - 图表统计
- 10.4 项目四：网络爬虫 GUI
  - URL 输入
  - 爬取进度显示
  - 结果展示
  - 数据导出

## 第十一章：打包与发布

- 11.1 PyInstaller 简介
- 11.2 打包 Windows 应用
- 11.3 打包 macOS 应用
- 11.4 打包 Linux 应用
- 11.5 优化打包体积
- 11.6 发布注意事项

## 第十二章：最佳实践与性能优化

- 12.1 代码组织与架构
- 12.2 MVC 模式在 Qt 中的应用
- 12.3 内存管理
- 12.4 性能优化技巧
- 12.5 常见陷阱与解决方案
- 12.6 调试技巧
