# 第一章：PySide6 简介与环境搭建

本章将带你了解 PySide6 的基本概念，完成环境搭建，并编写第一个 GUI 程序。

---

## 1.1 什么是 PySide6？为什么选择它？

### PySide6 简介

**PySide6** 是 Qt6 框架的官方 Python 绑定，由 The Qt Company 开发和维护。它允许 Python 开发者使用 Qt 强大的 GUI 工具集创建跨平台的桌面应用程序。

**Qt 的历史：**
- Qt 最初由 Trolltech 公司于 1995 年开发
- 2008 年被 Nokia 收购
- 2012 年被 Digia 收购
- 2014 年成立 The Qt Company
- PySide（Qt for Python）于 2018 年正式发布

### 为什么选择 PySide6？

#### 优势

1. **跨平台**
   - 一次编写，到处运行
   - 支持 Windows、macOS、Linux
   - 甚至支持嵌入式系统和移动端

2. **功能强大**
   - 丰富的 UI 组件库
   - 内置数据库支持
   - 网络编程能力
   - 多媒体处理
   - 2D/3D 图形渲染

3. **原生外观**
   - 自动适配系统主题
   - 原生控件外观
   - 良好的用户体验

4. **完善的工具链**
   - Qt Designer：可视化 UI 设计器
   - Qt Creator：集成开发环境
   - lupdate/lrelease：国际化支持

5. **活跃的社区**
   - 官方支持
   - 大量文档和教程
   - 丰富的第三方库

6. **商业友好**
   - LGPL 许可证
   - 可用于商业项目
   - 无需开源你的代码

#### 应用场景

- **桌面应用程序**：办公套件、媒体播放器、IDE
- **数据可视化工具**：仪表盘、监控系统
- **科学计算软件**：数据分析、仿真模拟
- **工业控制**：HMI 界面、监控系统
- **教育软件**：交互式学习工具
- **游戏开发**：2D 游戏、游戏编辑器

---

## 1.2 PySide6 vs PyQt6 vs Tkinter 对比

### 三大 Python GUI 框架对比

| 特性 | PySide6 | PyQt6 | Tkinter |
|------|---------|-------|---------|
| **开发商** | The Qt Company | Riverbank Computing | Python 官方 |
| **许可证** | LGPL v3 | GPL v3 / 商业许可 | Python License |
| **商业用途** | ✅ 免费 | ❌ 需购买许可 | ✅ 免费 |
| **组件丰富度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **外观美观度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **学习曲线** | 中等 | 中等 | 简单 |
| **性能** | 优秀 | 优秀 | 一般 |
| **文档质量** | 优秀 | 优秀 | 良好 |
| **社区规模** | 大 | 大 | 非常大 |
| **工具支持** | Qt Designer | Qt Designer | 无 |

### 详细对比

#### PySide6 vs PyQt6

**相似点：**
- 都基于 Qt6 框架
- API 几乎完全相同
- 都可以使用 Qt Designer
- 性能和功能基本一致

**主要区别：**

```python
# 导入方式不同
from PySide6.QtWidgets import QApplication  # PySide6
from PyQt6.QtWidgets import QApplication    # PyQt6

# 信号槽语法略有不同
# PySide6
button.clicked.connect(self.on_click)

# PyQt6（相同）
button.clicked.connect(self.on_click)

# 枚举访问方式
# PySide6
from PySide6.QtCore import Qt
alignment = Qt.AlignCenter

# PyQt6
from PyQt6.QtCore import Qt
alignment = Qt.AlignmentFlag.AlignCenter
```

**选择建议：**
- **商业项目** → PySide6（LGPL 更友好）
- **开源项目** → 两者皆可
- **已有 PyQt 经验** → PyQt6
- **新手入门** → PySide6（官方推荐）

#### vs Tkinter

**Tkinter 的优势：**
- Python 内置，无需安装
- 简单易学
- 适合小型工具

**PySide6 的优势：**
- 更现代的外观
- 更丰富的组件
- 更好的性能
- 更强大的功能

**示例对比：**

```python
# Tkinter - 简单但简陋
import tkinter as tk

root = tk.Tk()
root.title("Hello")
label = tk.Label(root, text="Hello World")
label.pack()
root.mainloop()

# PySide6 - 稍复杂但更专业
from PySide6.QtWidgets import QApplication, QLabel

app = QApplication([])
label = QLabel("Hello World")
label.setWindowTitle("Hello")
label.show()
app.exec()
```

---

## 1.3 安装 PySide6

### 系统要求

- **Python**: 3.8 或更高版本（推荐 3.10+）
- **操作系统**: Windows 10+, macOS 10.14+, Linux
- **磁盘空间**: 约 500MB（包含所有模块）

### 安装步骤

#### 方法一：使用 pip（推荐）

```bash
# 创建虚拟环境（推荐）
python -m venv pyside6_env

# 激活虚拟环境
# Windows
pyside6_env\Scripts\activate
# macOS/Linux
source pyside6_env/bin/activate

# 安装 PySide6
pip install PySide6

# 验证安装
python -c "from PySide6.QtWidgets import QApplication; print('PySide6 安装成功！')"
```

#### 方法二：安装特定版本

```bash
# 安装指定版本
pip install PySide6==6.5.0

# 安装 LTS（长期支持）版本
pip install PySide6==6.2.0
```

#### 方法三：安装完整开发工具

```bash
# 安装 PySide6 及开发工具
pip install PySide6 pyside6-tools

# pyside6-tools 包含：
# - designer: Qt Designer
# - linguist: 翻译工具
# - qmlscene: QML 查看器
```

### 常见问题解决

#### 问题 1：安装速度慢

```bash
# 使用国内镜像源
pip install PySide6 -i https://pypi.tuna.tsinghua.edu.cn/simple
```

#### 问题 2：依赖冲突

```bash
# 升级 pip
python -m pip install --upgrade pip

# 清除缓存后重新安装
pip cache purge
pip install PySide6
```

#### 问题 3：缺少系统依赖（Linux）

```bash
# Ubuntu/Debian
sudo apt-get install libxcb-xinerama0 libxcb-cursor0

# Fedora
sudo dnf install libxcb libxcb-xinerama
```

### 验证安装

```python
# test_install.py
import sys
from PySide6.QtCore import __version__ as qt_version
from PySide6 import __version__ as pyside_version

print(f"PySide6 版本: {pyside_version}")
print(f"Qt 版本: {qt_version}")
print(f"Python 版本: {sys.version}")

# 测试基本功能
from PySide6.QtWidgets import QApplication, QLabel

app = QApplication([])
label = QLabel("✅ PySide6 安装成功！")
label.setWindowTitle("测试窗口")
label.resize(300, 100)
label.show()
app.exec()
```

运行后会显示一个窗口，确认安装成功。

---

## 1.4 第一个 PySide6 程序

### Hello World 程序

让我们从最简单的程序开始：

```python
# hello_world.py
import sys
from PySide6.QtWidgets import QApplication, QLabel

# 1. 创建应用程序对象
app = QApplication(sys.argv)

# 2. 创建窗口组件
label = QLabel("Hello, PySide6!")

# 3. 设置窗口标题
label.setWindowTitle("我的第一个 PySide6 程序")

# 4. 调整窗口大小
label.resize(400, 200)

# 5. 居中显示
label.move(
    label.screen().geometry().center() - 
    label.rect().center()
)

# 6. 显示窗口
label.show()

# 7. 进入事件循环
sys.exit(app.exec())
```

**运行程序：**
```bash
python hello_world.py
```

### 代码详解

#### 1. 导入模块

```python
import sys
from PySide6.QtWidgets import QApplication, QLabel
```

- `sys`: 用于访问命令行参数和退出程序
- `QApplication`: 应用程序管理类，每个 PySide6 应用必须有且只有一个
- `QLabel`: 标签控件，用于显示文本或图片

#### 2. 创建应用程序对象

```python
app = QApplication(sys.argv)
```

- 必须在使用任何 Qt 组件之前创建
- `sys.argv` 允许程序接受命令行参数
- 负责初始化 Qt 资源

#### 3. 创建窗口组件

```python
label = QLabel("Hello, PySide6!")
```

- 创建一个标签对象
- 构造函数可以传入初始文本

#### 4-5. 设置窗口属性

```python
label.setWindowTitle("我的第一个 PySide6 程序")
label.resize(400, 200)
```

- 设置窗口标题
- 设置窗口大小（宽 400px，高 200px）

#### 6. 显示窗口

```python
label.show()
```

- 默认情况下窗口是隐藏的
- 调用 `show()` 使其可见

#### 7. 进入事件循环

```python
sys.exit(app.exec())
```

- `app.exec()` 启动事件循环
- 等待用户交互（点击、按键等）
- 程序会一直运行直到窗口关闭
- `sys.exit()` 确保正确退出并返回状态码

### 面向对象版本

实际开发中，我们通常使用类来组织代码：

```python
# hello_world_oop.py
import sys
from PySide6.QtWidgets import (
    QApplication, 
    QMainWindow, 
    QLabel,
    QVBoxLayout,
    QWidget
)

class MainWindow(QMainWindow):
    """主窗口类"""
    
    def __init__(self):
        super().__init__()
        
        # 设置窗口属性
        self.setWindowTitle("面向对象的 PySide6 程序")
        self.setGeometry(100, 100, 400, 300)  # x, y, width, height
        
        # 创建中心部件
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        # 创建布局
        layout = QVBoxLayout()
        central_widget.setLayout(layout)
        
        # 创建标签
        label = QLabel("Hello, PySide6!")
        label.setStyleSheet("""
            font-size: 24px;
            color: #2196F3;
            font-weight: bold;
        """)
        label.setAlignment(Qt.AlignCenter)  # 居中对齐
        
        # 添加标签到布局
        layout.addWidget(label)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    
    # 创建并显示主窗口
    window = MainWindow()
    window.show()
    
    # 运行应用程序
    sys.exit(app.exec())
```

### 添加按钮和交互

```python
# interactive_app.py
import sys
from PySide6.QtWidgets import (
    QApplication,
    QMainWindow,
    QPushButton,
    QLabel,
    QVBoxLayout,
    QWidget,
    QMessageBox
)
from PySide6.QtCore import Qt

class InteractiveWindow(QMainWindow):
    """交互式窗口"""
    
    def __init__(self):
        super().__init__()
        
        self.setWindowTitle("交互式应用")
        self.setGeometry(100, 100, 400, 300)
        
        # 创建中心部件和布局
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        layout = QVBoxLayout()
        central_widget.setLayout(layout)
        
        # 创建标签
        self.label = QLabel("点击按钮试试！")
        self.label.setAlignment(Qt.AlignCenter)
        self.label.setStyleSheet("font-size: 18px; padding: 20px;")
        layout.addWidget(self.label)
        
        # 创建按钮
        self.button = QPushButton("点击我")
        self.button.setStyleSheet("""
            QPushButton {
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                font-size: 16px;
                border-radius: 5px;
            }
            QPushButton:hover {
                background-color: #45a049;
            }
            QPushButton:pressed {
                background-color: #3d8b40;
            }
        """)
        layout.addWidget(self.button)
        
        # 连接信号和槽
        self.button.clicked.connect(self.on_button_clicked)
        
        # 计数器
        self.click_count = 0
    
    def on_button_clicked(self):
        """按钮点击事件处理"""
        self.click_count += 1
        self.label.setText(f"按钮被点击了 {self.click_count} 次！")
        
        # 每点击 5 次显示消息框
        if self.click_count % 5 == 0:
            QMessageBox.information(
                self,
                "恭喜",
                f"你已经点击了 {self.click_count} 次！",
                QMessageBox.Ok
            )

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = InteractiveWindow()
    window.show()
    sys.exit(app.exec())
```

---

## 1.5 理解信号与槽机制

### 什么是信号与槽？

**信号与槽（Signals and Slots）** 是 Qt 的核心机制，用于对象之间的通信。它是一种类型安全的回调机制。

- **信号（Signal）**: 当某个事件发生时发出（如按钮被点击）
- **槽（Slot）**: 响应信号的函数或方法

### 基本概念

```python
# 信号发出者 ---信号---> 槽函数接收者
button.clicked.connect(on_click)
#      ^                    ^
#   信号                 槽函数
```

### 基本用法

```python
from PySide6.QtCore import Signal, Slot
from PySide6.QtWidgets import QApplication, QPushButton, QVBoxLayout, QWidget

class MyWidget(QWidget):
    def __init__(self):
        super().__init__()
        
        button = QPushButton("点击我")
        layout = QVBoxLayout()
        layout.addWidget(button)
        self.setLayout(layout)
        
        # 方式1：连接到普通函数
        button.clicked.connect(self.on_click)
        
        # 方式2：连接到 lambda
        button.clicked.connect(lambda: print("Lambda 被调用"))
        
        # 方式3：带参数的连接
        button.clicked.connect(lambda checked: self.on_click_with_param(checked))
    
    def on_click(self):
        """槽函数"""
        print("按钮被点击了！")
    
    def on_click_with_param(self, checked):
        """带参数的槽函数"""
        print(f"按钮状态: {checked}")

# 自定义信号
class MyEmitter(QWidget):
    # 定义信号
    my_signal = Signal(str)  # 发送字符串的信号
    value_changed = Signal(int)  # 发送整数的信号
    
    def __init__(self):
        super().__init__()
        
        # 发射信号
        self.my_signal.emit("Hello")
        self.value_changed.emit(42)
    
    @Slot(str)
    def handle_signal(self, message):
        """处理信号的槽函数"""
        print(f"收到消息: {message}")

# 连接自定义信号
emitter = MyEmitter()
emitter.my_signal.connect(emitter.handle_signal)
```

### 信号与槽的特点

1. **一对多**: 一个信号可以连接多个槽
2. **多对一**: 多个信号可以连接同一个槽
3. **类型安全**: 信号和槽的参数类型必须匹配
4. **松耦合**: 发送者和接收者不需要知道彼此的存在

### 实际应用示例

```python
from PySide6.QtWidgets import (
    QApplication, QMainWindow, QLineEdit, 
    QPushButton, QLabel, QVBoxLayout, QWidget
)

class SearchApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("搜索应用")
        
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        layout = QVBoxLayout()
        central_widget.setLayout(layout)
        
        # 输入框
        self.search_input = QLineEdit()
        self.search_input.setPlaceholderText("输入搜索内容...")
        layout.addWidget(self.search_input)
        
        # 搜索按钮
        search_btn = QPushButton("搜索")
        layout.addWidget(search_btn)
        
        # 结果显示
        self.result_label = QLabel("")
        layout.addWidget(self.result_label)
        
        # 连接信号和槽
        search_btn.clicked.connect(self.perform_search)
        self.search_input.returnPressed.connect(self.perform_search)
    
    def perform_search(self):
        query = self.search_input.text()
        if query:
            self.result_label.setText(f"搜索结果: {query}")
        else:
            self.result_label.setText("请输入搜索内容")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = SearchApp()
    window.show()
    app.exec()
```

---

## 1.6 Qt Designer 简介

### 什么是 Qt Designer？

**Qt Designer** 是一个可视化的 UI 设计工具，允许你通过拖放的方式设计界面，然后生成 `.ui` 文件，可以在 Python 代码中加载使用。

### 安装 Qt Designer

```bash
# 安装 pyside6-tools
pip install pyside6-tools

# 启动 Designer
pyside6-designer
```

### 使用 Qt Designer

#### 步骤 1：创建新界面

1. 打开 Qt Designer
2. 选择 "Main Window" 或 "Widget"
3. 点击 "Create"

#### 步骤 2：设计界面

- 从左侧组件列表拖拽控件到界面
- 在右侧属性编辑器中设置属性
- 使用布局管理器组织控件

#### 步骤 3：保存 UI 文件

- 保存为 `.ui` 文件（XML 格式）

#### 步骤 4：在 Python 中使用

**方法一：动态加载 UI 文件**

```python
from PySide6.QtUiTools import QUiLoader
from PySide6.QtWidgets import QApplication
from PySide6.QtCore import QFile

def load_ui_file(ui_file):
    loader = QUiLoader()
    ui_file = QFile(ui_file)
    ui_file.open(QFile.ReadOnly)
    window = loader.load(ui_file)
    ui_file.close()
    return window

if __name__ == "__main__":
    app = QApplication([])
    window = load_ui_file("my_design.ui")
    window.show()
    app.exec()
```

**方法二：转换为 Python 代码**

```bash
# 使用 pyside6-uic 转换
pyside6-uic my_design.ui -o ui_my_design.py

# 在代码中导入
from ui_my_design import Ui_MainWindow

class MainWindow(QMainWindow, Ui_MainWindow):
    def __init__(self):
        super().__init__()
        self.setupUi(self)
```

### Designer 的优势

✅ **快速原型设计**
✅ **所见即所得**
✅ **便于团队协作**（设计师和程序员分离）
✅ **易于修改和维护**

### Designer 的局限

❌ **复杂逻辑仍需编码**
❌ **动态 UI 不太适合**
❌ **需要额外工具**

---

## 本章小结

**核心知识点：**

✅ **PySide6 简介**
- Qt6 的官方 Python 绑定
- 跨平台、功能强大、商业友好

✅ **与其他框架对比**
- PySide6 vs PyQt6：API 相同，许可证不同
- vs Tkinter：PySide6 更强大、更美观

✅ **环境搭建**
- 使用 pip 安装
- 虚拟环境管理
- 验证安装

✅ **第一个程序**
- QApplication 的作用
- 基本窗口创建
- 事件循环

✅ **信号与槽**
- Qt 的核心通信机制
- 类型安全的回调
- 灵活的事件处理

✅ **Qt Designer**
- 可视化 UI 设计工具
- 快速原型开发
- UI 与逻辑分离

**下一步：**

> 第二章将深入学习核心组件，包括布局管理器和常用控件！

---

## 练习题

### 练习 1：创建个人信息表单

创建一个窗口，包含：
- 姓名输入框
- 年龄输入框
- 邮箱输入框
- 提交按钮
- 点击提交后在标签中显示所有信息

```python
from PySide6.QtWidgets import (
    QApplication, QMainWindow, QLabel, 
    QLineEdit, QPushButton, QVBoxLayout, 
    QWidget, QFormLayout
)

class PersonalInfoForm(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("个人信息表单")
        
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        # 创建表单布局
        form_layout = QFormLayout()
        
        self.name_input = QLineEdit()
        self.age_input = QLineEdit()
        self.email_input = QLineEdit()
        
        form_layout.addRow("姓名:", self.name_input)
        form_layout.addRow("年龄:", self.age_input)
        form_layout.addRow("邮箱:", self.email_input)
        
        submit_btn = QPushButton("提交")
        submit_btn.clicked.connect(self.submit_form)
        form_layout.addRow(submit_btn)
        
        self.result_label = QLabel("")
        form_layout.addRow(self.result_label)
        
        central_widget.setLayout(form_layout)
    
    def submit_form(self):
        name = self.name_input.text()
        age = self.age_input.text()
        email = self.email_input.text()
        
        self.result_label.setText(
            f"姓名: {name}\n年龄: {age}\n邮箱: {email}"
        )

if __name__ == "__main__":
    app = QApplication([])
    window = PersonalInfoForm()
    window.show()
    app.exec()
```

### 练习 2：简易计算器

创建一个包含两个输入框和四个运算按钮（+、-、*、/）的计算器，显示计算结果。

### 练习 3：颜色切换器

创建三个按钮（红色、绿色、蓝色），点击后改变窗口背景色。
