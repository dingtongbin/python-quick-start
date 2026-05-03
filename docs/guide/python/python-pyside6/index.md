# 🖥️ PySide6 GUI 开发：用 Python 做桌面应用

想用 Python 做出漂亮的桌面应用？PySide6 是 Qt 官方的 Python 绑定，跨平台、功能强大、文档完善。

所有示例基于 **PySide6 (Qt6)**，从按钮到完整项目，手把手带你做出专业的桌面软件。

---

## 💡 学习建议

> **GUI 编程的核心是事件驱动。** 理解「信号与槽」机制，后面就顺了。

- ⏱️ 预计学习时间：**3-6 周**（每天 1-2 小时）
- 🎯 学完能做什么：数据管理工具、配置面板、小型桌面应用
- 📌 后续方向：Qt for Python 高级特性、打包分发

---

## 📚 教程目录

### 第一部分：入门基础（第 1-3 章）

#### [第 1 章：PySide6 简介与环境搭建](./1、PySide6简介与环境搭建.md)
- PySide6 是什么？为什么选择它？
- PySide6 vs PyQt6 vs Tkinter
- 安装与第一个窗口
- 信号与槽机制
- Qt Designer 简介

#### [第 2 章：核心组件基础](./2、核心组件基础.md)
- QWidget 基类
- QLabel、QPushButton、QLineEdit
- 布局管理：QVBoxLayout、QHBoxLayout、QGridLayout

#### [第 3 章：高级控件](./3、高级控件.md)
- QComboBox、QListWidget、QTableWidget
- QCheckBox、QRadioButton
- QSpinBox、QSlider、QProgressBar

### 第二部分：进阶功能（第 4-7 章）

#### [第 4 章：对话框与消息框](./4、对话框与消息框.md)
- QMessageBox
- QFileDialog
- QInputDialog
- 自定义对话框

#### [第 5 章：事件处理](./5、事件处理.md)
- 鼠标事件
- 键盘事件
- 自定义事件

#### [第 6 章：样式与主题](./6、样式与主题.md)
- QSS 样式表
- 深色/浅色主题
- 自定义组件样式

#### [第 7 章：多线程与异步](./7、多线程与异步.md)
- QThread
- 信号安全的跨线程通信
- 避免界面卡顿

### 第三部分：数据与发布（第 8-12 章）

#### [第 8 章：数据可视化](./8、数据可视化.md)
- 集成 Matplotlib
- 实时数据图表

#### [第 9 章：数据库集成](./9、数据库集成.md)
- SQLite 操作
- QSqlTableModel

#### [第 10 章：综合实战项目](./10、综合实战项目.md)
- 完整项目：待办事项管理器
- 需求分析到代码实现

#### [第 11 章：打包与发布](./11、打包与发布.md)
- PyInstaller 打包
- 跨平台打包注意事项

#### [第 12 章：最佳实践与性能优化](./12、最佳实践与性能优化.md)
- 代码组织
- 性能优化技巧

---

## ❓ 常见问题

**Q: PySide6 和 PyQt6 选哪个？**
A: PySide6 是 Qt 官方的，LGPL 协议更宽松；PyQt6 社区更大。初学者差别不大，选一个就行。

**Q: 做出来的应用能发给别人用吗？**
A: 可以，用 PyInstaller 打包成可执行文件，别人不需要装 Python 就能运行。
