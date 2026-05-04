# PySide6 桌面应用开发从入门到实战 — 完整教学目录

> **适用人群**：具备 Python 基础，希望开发跨平台桌面 GUI 应用的开发者
> **技术栈版本**（截至 2026 年）：PySide6 ≥ 6.7，Python 3.9–3.12，Qt 6.7+
> **特色**：理论 + 实战 + 工程化 + 打包部署，每章均可独立运行验证

------

## 第1章 起步：PySide6 快速上手

1.1 什么是 PySide6？Qt for Python 的官方实现
1.2 PySide6 vs PyQt6：许可证、API 兼容性与选择建议
1.3 安装与环境配置：`pip install PySide6`
1.4 第一个窗口程序：Hello World + 自动 UI 预览
1.5 Qt Designer 安装与基本使用（随 PySide6 自带）

------

## 第2章 核心概念：信号、槽与事件循环

2.1 Qt 事件驱动模型简介
2.2 信号（Signal）与槽（Slot）机制详解
2.3 内置信号示例：按钮点击、文本变化、窗口关闭
2.4 自定义信号：`Signal()` 创建与发射
2.5 事件循环（QApplication.exec()）的作用与生命周期

------

## 第3章 基础控件与布局管理

3.1 常用控件：QPushButton、QLabel、QLineEdit、QCheckBox、QRadioButton
3.2 文本控件：QTextEdit、QPlainTextEdit
3.3 布局系统：QHBoxLayout、QVBoxLayout、QGridLayout
3.4 嵌套布局与间距控制（setContentsMargins, setSpacing）
3.5 窗口大小策略：sizeHint、minimumSize、maximumSize

------

## 第4章 主窗口与菜单系统

4.1 QMainWindow 结构：菜单栏、工具栏、状态栏、中心部件
4.2 创建菜单与子菜单：QMenuBar + QAction
4.3 工具栏按钮：添加图标、设置快捷键
4.4 状态栏提示：显示临时消息或进度
4.5 多文档界面（MDI）简介（可选）

------

## 第5章 对话框与用户输入

5.1 模态 vs 非模态对话框
5.2 内置对话框：
　　- QMessageBox（提示/确认/警告）
　　- QFileDialog（打开/保存文件）
　　- QColorDialog / QFontDialog
　　- QInputDialog（单行输入）
5.3 自定义对话框：继承 QDialog + 表单验证
5.4 数据回传：通过信号或 accept/reject 返回结果

------

## 第6章 使用 Qt Designer 开发 UI

6.1 .ui 文件创建流程：拖拽控件 → 设置属性 → 保存
6.2 将 .ui 转换为 Python 代码：`pyside6-uic main.ui -o ui_main.py`
6.3 在主程序中加载 UI：两种方式（继承 or UIC 动态加载）
6.4 信号连接：在逻辑代码中绑定按钮点击等事件
6.5 资源文件（.qrc）：嵌入图标、图片到应用（`pyside6-rcc`）

------

## 第7章 高级控件：列表、表格与树

7.1 QListWidget：简单列表展示与交互
7.2 QTableWidget：带表头的二维表格（增删改查）
7.3 QTreeWidget：层级数据展示（如文件浏览器）
7.4 模型-视图架构初探：QStandardItemModel + QTableView（解耦数据与 UI）
7.5 自定义委托（Delegate）：改变单元格编辑方式（进阶）

------

## 第8章 多线程与后台任务

8.1 GUI 冻结问题根源：主线程阻塞
8.2 QThread 正确用法：
　　- 继承 QThread（简单场景）
　　- moveToThread + QObject（推荐，更安全）
8.3 跨线程通信：通过信号传递结果（禁止直接操作 UI 控件）
8.4 进度反馈：QProgressBar + 后台计算
8.5 取消任务机制：标志位 + 线程退出

------

## 第9章 样式美化与主题支持

9.1 Qt 样式表（QSS）语法：类似 CSS
9.2 设置控件样式：颜色、边框、字体、悬停效果
9.3 全局样式应用：`app.setStyleSheet()`
9.4 深色/浅色主题切换：动态加载不同 QSS 文件
9.5 自定义控件外观：重写 paintEvent（可选，进阶）

------

## 第10章 文件、配置与持久化

10.1 读写 JSON/INI 配置文件
10.2 QSettings：跨平台保存用户偏好（Windows 注册表 / macOS plist / Linux ini）
10.3 最近文件列表：自动记录并显示
10.4 拖放支持：接受文件拖入窗口（setAcceptDrops + dropEvent）
10.5 剪贴板操作：复制/粘贴文本或图像

------

## 第11章 国际化与多语言支持

11.1 使用 Qt Linguist 提取字符串
11.2 生成 .ts 翻译文件并翻译
11.3 编译为 .qm 文件（`pyside6-lupdate`, `pyside6-lrelease`）
11.4 动态切换语言：重新加载翻译器

------

## 第12章 打包与分发

12.1 使用 PyInstaller 打包：
　　- `pyinstaller --windowed --onefile main.py`
　　- 排除无用模块减小体积
12.2 添加应用图标（Windows .ico / macOS .icns）
12.3 跨平台构建策略：
　　- Windows：.exe
　　- macOS：.app bundle
　　- Linux：AppImage 或 deb 包（可选）
12.4 自动更新机制简介（可选）

------

## 第13章 综合项目实战：个人笔记管理器

13.1 功能需求：新建/编辑/删除笔记、富文本支持、本地存储
13.2 技术选型：QTextEdit（富文本）、SQLite（存储）、QListWidget（笔记列表）
13.3 UI 设计：左侧列表 + 右侧编辑区 + 工具栏
13.4 数据模型：Note 类 + SQLite CRUD 封装
13.5 异步保存：防卡顿自动保存机制
13.6 打包发布：生成可执行文件供他人使用