### 1.1 为什么选 FastAPI？—— 高性能、自动生成文档、类型安全

FastAPI 这家伙，简直就是 Python Web 框架界的一匹黑马。它不像 Django 那样“全家桶”式地给你塞一堆你可能用不到的功能，也不像 Flask 那样需要你手动拼凑各种轮子。FastAPI 的核心卖点就三个：**快、省事、靠谱**。

- **高性能**：得益于 Starlette（异步底层）和 Pydantic（数据验证），FastAPI 的性能直逼 Node.js 和 Go，远超传统的同步框架。
- **自动生成文档**：你只需要写好代码，Swagger UI 和 ReDoc 文档就自动给你生成好了，连测试界面都给你配齐，简直是懒人福音。
- **类型安全**：全面拥抱 Python 类型注解，配合 Pydantic，让你在编码阶段就能发现大部分数据错误，告别“运行时惊喜”。

这节讲了 FastAPI 的三大核心优势：高性能、自动生成交互式文档、以及基于类型注解的安全性保障，为后续开发打下坚实基础。

### 1.2 环境准备：Python 3.10+ 虚拟环境创建

工欲善其事，必先利其器。在开始敲代码之前，我们得先把“工地”收拾干净。这里强烈推荐使用虚拟环境，避免你的项目依赖和系统里其他 Python 项目“打架”。

首先，确保你的电脑上装的是 **Python 3.10 或更高版本**。然后，打开你的终端（命令行），执行以下命令：

```bash
# 创建一个名为 my_fastapi_app 的虚拟环境
python -m venv my_fastapi_app

# 激活虚拟环境 (Windows)
my_fastapi_app\Scripts\activate

# 激活虚拟环境 (macOS/Linux)
source my_fastapi_app/bin/activate
```

激活后，你会发现命令行前面多了个 `(my_fastapi_app)` 的前缀，这就说明你已经成功进入这个独立的“小世界”了。在这里安装的所有包，都只属于这个项目，不会影响到其他地方。

这节讲了如何为 FastAPI 项目创建一个干净、隔离的 Python 虚拟环境，这是保证项目可维护性和可复现性的第一步。

### 1.3 安装 FastAPI 与 Uvicorn：`pip install fastapi uvicorn[standard]`

现在，我们的“工地”已经准备好了，是时候请“工人”进场了。FastAPI 本身是一个框架，但它需要一个服务器来运行，这个服务器就是 **Uvicorn**，一个闪电般快速的 ASGI 服务器。

在激活的虚拟环境中，执行以下命令来安装它们：

```bash
# 安装 FastAPI 和带有标准功能的 Uvicorn
pip install fastapi uvicorn[standard]
```

这里的 `uvicorn[standard]` 很关键，方括号里的 `standard` 会一并安装一些常用的依赖，比如 `websockets`，这对于 WebSocket 支持是必需的。如果你只装 `uvicorn`，可能会在后续遇到奇怪的问题。

这节讲了如何正确安装 FastAPI 及其运行所必需的 Uvicorn 服务器，并解释了 `uvicorn[standard]` 的重要性。

### 1.4 第一个 API：Hello World 与自动交互式文档（/docs）

终于到了激动人心的时刻！让我们来写人生中第一个 FastAPI 应用吧。在你的项目目录下，创建一个名为 `main.py` 的文件，然后把下面这段代码敲进去：

```python
# 导入 FastAPI 类
from fastapi import FastAPI

# 创建一个 FastAPI 应用实例
app = FastAPI()

# 定义一个路径操作装饰器，监听根路径 "/" 的 GET 请求
@app.get("/")
def read_root():
    # 返回一个 JSON 响应
    return {"Hello": "World"}
```

每一行代码都清晰明了：

- 第一行引入了 `FastAPI` 这个核心类。
- 第二行创建了应用实例 `app`，它是整个应用的中心。
- `@app.get("/")` 是一个装饰器，告诉 FastAPI 当收到对根路径 `/` 的 `GET` 请求时，就调用下面的函数。
- `read_root` 函数是我们定义的处理逻辑，它简单地返回一个字典，FastAPI 会自动将其转换为 JSON 格式。

保存文件后，在终端中运行：

```bash
uvicorn main:app --reload
```

- `main:app` 指的是 `main.py` 文件中的 `app` 对象。
- `--reload` 参数表示在开发阶段，代码有改动时服务器会自动重启，非常方便。

启动成功后，打开浏览器，访问 `http://127.0.0.1:8000`，你会看到 `{"Hello": "World"}`。更神奇的是，访问 `http://127.0.0.1:8000/docs`，你会发现一个自动生成的、功能齐全的交互式 API 文档！你可以直接在网页上点击“Try it out”来测试你的 API，简直不要太爽。

这节通过一个经典的 “Hello World” 示例，展示了如何快速创建并运行一个 FastAPI 应用，并体验了其强大的自动生成交互式文档功能。