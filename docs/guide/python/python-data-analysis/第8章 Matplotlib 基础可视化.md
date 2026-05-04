# 第8章 Matplotlib 基础可视化

## 8.1 Matplotlib 基础绘图：折线图、柱状图、散点图

Matplotlib 是 Python 中最基础也是最强大的可视化库之一。虽然它的语法可能看起来有点"复古"，但掌握它就像学会骑自行车——一旦上手，就永远不会忘记！而且，很多高级可视化库（比如 Seaborn）都是基于 Matplotlib 构建的，所以学好它是打好数据可视化基础的关键。

### 折线图绘制

折线图最适合展示数据随时间或其他连续变量的变化趋势。

```python
# 导入必要的库
import matplotlib.pyplot as plt
import numpy as np

# 设置中文字体支持（避免中文显示为方块）
plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

# 创建示例数据
x = np.linspace(0, 10, 50)  # 生成0到10之间的50个等间距点
y = np.sin(x)  # 计算对应的正弦值

# 创建折线图
plt.figure(figsize=(10, 6))  # 设置图形大小为10x6英寸
plt.plot(x, y, color='blue', linewidth=2, label='sin(x)')  # 绘制折线，设置颜色、线宽和标签
plt.title('正弦函数折线图', fontsize=16)  # 设置标题
plt.xlabel('X轴', fontsize=12)  # 设置X轴标签
plt.ylabel('Y轴', fontsize=12)  # 设置Y轴标签
plt.legend()  # 显示图例
plt.grid(True, alpha=0.3)  # 显示网格，透明度设为0.3
plt.show()  # 显示图形
```

### 柱状图绘制

柱状图用于比较不同类别之间的数值大小。

```python
# 导入必要的库
import matplotlib.pyplot as plt
import numpy as np

# 设置中文字体支持
plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

# 创建示例数据
categories = ['产品A', '产品B', '产品C', '产品D', '产品E']
values = [23, 45, 56, 78, 32]

# 创建柱状图
plt.figure(figsize=(10, 6))
bars = plt.bar(categories, values, color='skyblue', edgecolor='navy', linewidth=1.2)
plt.title('产品销量对比', fontsize=16)
plt.xlabel('产品类别', fontsize=12)
plt.ylabel('销量', fontsize=12)

# 在每个柱子顶部添加数值标签
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height,
             f'{height}', ha='center', va='bottom')

plt.grid(axis='y', alpha=0.3)
plt.show()
```

### 散点图绘制

散点图用于展示两个变量之间的关系，特别适合发现数据中的模式或异常值。

```python
# 导入必要的库
import matplotlib.pyplot as plt
import numpy as np

# 设置中文字体支持
plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

# 创建示例数据
np.random.seed(42)  # 设置随机种子以确保结果可重现
x = np.random.randn(100)  # 生成100个标准正态分布的随机数
y = 2 * x + np.random.randn(100) * 0.5  # y与x有线性关系，加上一些噪声

# 创建散点图
plt.figure(figsize=(10, 6))
plt.scatter(x, y, c='red', alpha=0.6, s=50)  # s参数控制点的大小
plt.title('变量X与Y的关系散点图', fontsize=16)
plt.xlabel('X变量', fontsize=12)
plt.ylabel('Y变量', fontsize=12)
plt.grid(True, alpha=0.3)
plt.show()
```

常用绘图方法表格：

| 功能名称 | 实例调用方法                  | 具体功能、注意事项、必需参数/可选参数                        |
| -------- | ----------------------------- | ------------------------------------------------------------ |
| 折线图   | `plt.plot(x, y)`              | 必需参数：x和y坐标数组；可选参数：color(颜色)、linewidth(线宽)、label(标签)等 |
| 柱状图   | `plt.bar(categories, values)` | 必需参数：类别和对应值；可选参数：color(填充色)、edgecolor(边框色)、linewidth(边框宽度)等 |
| 散点图   | `plt.scatter(x, y)`           | 必需参数：x和y坐标数组；可选参数：c(颜色)、s(点大小)、alpha(透明度)等 |

这节我们学习了 Matplotlib 的三种基础图表：折线图、柱状图和散点图。这些图表是数据可视化的基石，几乎可以应对大多数基础的数据展示需求。

## 8.2 图形元素定制：标题、标签、图例、网格

画出基本图形只是第一步，要让图形真正有用，还需要精心定制各种元素。好的图形应该像一篇好文章——清晰、准确、有重点！

### 标题和轴标签定制

```python
# 导入必要的库
import matplotlib.pyplot as plt
import numpy as np

# 设置中文字体支持
plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

# 创建示例数据
months = ['1月', '2月', '3月', '4月', '5月', '6月']
sales = [120, 135, 148, 162, 175, 190]

# 创建图形并定制标题和标签
plt.figure(figsize=(10, 6))
plt.plot(months, sales, marker='o', linestyle='-', color='green', linewidth=2)

# 定制主标题和副标题
plt.title('2023年上半年销售额趋势', fontsize=18, fontweight='bold', pad=20)
plt.suptitle('单位：万元', fontsize=12, y=0.92)  # 副标题

# 定制轴标签
plt.xlabel('月份', fontsize=14, fontweight='bold')
plt.ylabel('销售额', fontsize=14, fontweight='bold')

# 设置刻度标签的字体大小
plt.xticks(fontsize=12)
plt.yticks(fontsize=12)

plt.grid(True, alpha=0.3)
plt.show()
```

### 图例定制

```python
# 导入必要的库
import matplotlib.pyplot as plt
import numpy as np

# 设置中文字体支持
plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

# 创建示例数据
x = np.linspace(0, 10, 50)
y1 = np.sin(x)
y2 = np.cos(x)

# 创建图形并添加多条线
plt.figure(figsize=(10, 6))
line1, = plt.plot(x, y1, color='red', linewidth=2, label='正弦函数')
line2, = plt.plot(x, y2, color='blue', linewidth=2, linestyle='--', label='余弦函数')

# 定制图例
plt.legend(
    loc='upper right',  # 图例位置
    fontsize=12,        # 字体大小
    frameon=True,       # 是否显示边框
    shadow=True,        # 是否显示阴影
    fancybox=True       # 是否使用圆角边框
)

plt.title('三角函数对比', fontsize=16)
plt.xlabel('X轴', fontsize=12)
plt.ylabel('Y轴', fontsize=12)
plt.grid(True, alpha=0.3)
plt.show()
```

### 网格和背景定制

```python
# 导入必要的库
import matplotlib.pyplot as plt
import numpy as np

# 设置中文字体支持
plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

# 创建示例数据
categories = ['北京', '上海', '广州', '深圳', '杭州']
values = [85, 92, 78, 88, 82]

# 创建图形
fig, ax = plt.subplots(figsize=(10, 6))

# 绘制柱状图
bars = ax.bar(categories, values, color=['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'])

# 定制网格
ax.grid(True, axis='y', alpha=0.3, linestyle='--', linewidth=0.8)
ax.set_axisbelow(True)  # 将网格置于图形下方

# 定制背景色
ax.set_facecolor('#F8F9FA')  # 设置绘图区域背景色
fig.patch.set_facecolor('white')  # 设置整个图形背景色

# 添加数值标签
for bar in bars:
    height = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2., height + 1,
            f'{height}分', ha='center', va='bottom', fontweight='bold')

plt.title('各城市宜居指数评分', fontsize=16, pad=20)
plt.ylabel('评分', fontsize=12)
plt.ylim(0, 100)  # 设置Y轴范围
plt.show()
```

图形元素定制方法表格：

| 功能名称   | 实例调用方法                            | 具体功能、注意事项、必需参数/可选参数                        |
| ---------- | --------------------------------------- | ------------------------------------------------------------ |
| 标题设置   | `plt.title(text)`                       | 必需参数：标题文本；可选参数：fontsize(字体大小)、fontweight(字体粗细)、pad(与图形的距离)等 |
| 轴标签设置 | `plt.xlabel(text)` / `plt.ylabel(text)` | 必需参数：标签文本；可选参数同标题设置                       |
| 图例设置   | `plt.legend()`                          | 可选参数：loc(位置)、fontsize(字体大小)、frameon(是否显示边框)、shadow(阴影)等 |
| 网格设置   | `plt.grid()`                            | 可选参数：axis(作用轴)、alpha(透明度)、linestyle(线型)、linewidth(线宽)等 |

这节我们深入学习了如何定制 Matplotlib 图形的各种元素，包括标题、标签、图例和网格。通过这些定制，我们可以让图形更加专业、清晰和美观。

## 8.3 子图布局：subplot 与 subplots

当我们需要在同一张图中展示多个相关但不同的数据视图时，子图布局就派上用场了。想象一下，这就像在一张大纸上安排多个小窗口，每个窗口展示不同的风景！

### 使用 subplot 创建子图

```python
# 导入必要的库
import matplotlib.pyplot as plt
import numpy as np

# 设置中文字体支持
plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

# 创建示例数据
x = np.linspace(0, 10, 100)
y1 = np.sin(x)
y2 = np.cos(x)
y3 = np.tan(x)
y4 = np.exp(-x/5) * np.sin(x)

# 创建2x2子图布局
plt.figure(figsize=(12, 10))

# 第一个子图
plt.subplot(2, 2, 1)  # 2行2列，第1个位置
plt.plot(x, y1, color='red')
plt.title('正弦函数')
plt.grid(True, alpha=0.3)

# 第二个子图
plt.subplot(2, 2, 2)  # 2行2列，第2个位置
plt.plot(x, y2, color='blue')
plt.title('余弦函数')
plt.grid(True, alpha=0.3)

# 第三个子图
plt.subplot(2, 2, 3)  # 2行2列，第3个位置
plt.plot(x, y3, color='green')
plt.title('正切函数')
plt.ylim(-5, 5)  # 限制Y轴范围，因为正切函数值域很大
plt.grid(True, alpha=0.3)

# 第四个子图
plt.subplot(2, 2, 4)  # 2行2列，第4个位置
plt.plot(x, y4, color='purple')
plt.title('阻尼振荡')
plt.grid(True, alpha=0.3)

# 调整子图间距
plt.tight_layout()  # 自动调整子图间距，避免重叠
plt.show()
```

### 使用 subplots 创建子图（推荐方式）

```python
# 导入必要的库
import matplotlib.pyplot as plt
import numpy as np

# 设置中文字体支持
plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

# 创建示例数据
np.random.seed(42)
data1 = np.random.normal(0, 1, 1000)
data2 = np.random.normal(2, 1.5, 1000)
data3 = np.random.exponential(2, 1000)

# 使用subplots创建子图（更现代的方式）
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# 第一个子图 - 直方图
axes[0, 0].hist(data1, bins=30, color='skyblue', edgecolor='black', alpha=0.7)
axes[0, 0].set_title('标准正态分布')
axes[0, 0].grid(True, alpha=0.3)

# 第二个子图 - 直方图
axes[0, 1].hist(data2, bins=30, color='lightcoral', edgecolor='black', alpha=0.7)
axes[0, 1].set_title('偏移正态分布')
axes[0, 1].grid(True, alpha=0.3)

# 第三个子图 - 直方图
axes[1, 0].hist(data3, bins=30, color='lightgreen', edgecolor='black', alpha=0.7)
axes[1, 0].set_title('指数分布')
axes[1, 0].grid(True, alpha=0.3)

# 第四个子图留空或用于其他用途
axes[1, 1].text(0.5, 0.5, '这里是空白区域\n可用于添加说明文字', 
                ha='center', va='center', transform=axes[1, 1].transAxes,
                fontsize=14, color='gray')

# 隐藏第四个子图的坐标轴
axes[1, 1].axis('off')

# 调整子图间距
plt.tight_layout()
plt.show()
```

### 不规则子图布局

```python
# 导入必要的库
import matplotlib.pyplot as plt
import numpy as np

# 设置中文字体支持
plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

# 创建示例数据
x = np.linspace(0, 10, 100)
y1 = np.sin(x)
y2 = np.cos(x)

# 创建不规则子图布局
fig = plt.figure(figsize=(12, 8))

# 大的主图占据左侧2/3空间
ax1 = plt.subplot(1, 3, (1, 2))  # 1行3列，跨越第1-2列
ax1.plot(x, y1, color='red', linewidth=2, label='sin(x)')
ax1.plot(x, y2, color='blue', linewidth=2, linestyle='--', label='cos(x)')
ax1.set_title('三角函数对比图', fontsize=14)
ax1.legend()
ax1.grid(True, alpha=0.3)

# 小图占据右侧1/3空间
ax2 = plt.subplot(1, 3, 3)  # 1行3列，第3列
ax2.scatter(y1, y2, alpha=0.6, color='purple')
ax2.set_xlabel('sin(x)')
ax2.set_ylabel('cos(x)')
ax2.set_title('相位关系', fontsize=12)
ax2.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()
```

子图布局方法表格：

| 功能名称   | 实例调用方法                              | 具体功能、注意事项、必需参数/可选参数                        |
| ---------- | ----------------------------------------- | ------------------------------------------------------------ |
| subplot    | `plt.subplot(nrows, ncols, index)`        | 必需参数：行数、列数、当前子图索引(从1开始)；用于逐个创建子图 |
| subplots   | `plt.subplots(nrows, ncols)`              | 必需参数：行数、列数；返回figure对象和axes数组，更灵活易用   |
| 不规则布局 | `plt.subplot(nrows, ncols, (start, end))` | 跨越多个位置的子图，start和end指定起始和结束位置             |

这节我们学习了 Matplotlib 的子图布局功能，包括使用 subplot 和 subplots 创建规则和不规则的子图布局。这些技能让我们能够在一个图形中同时展示多个相关的数据视图，大大提升了数据分析的效率。

## 8.4 保存图表为图片文件

画好了漂亮的图表，当然要保存下来分享给同事或者放进报告里！Matplotlib 提供了简单而强大的保存功能，让我们来看看如何把心血结晶永久保存。

### 基础保存功能

```python
# 导入必要的库
import matplotlib.pyplot as plt
import numpy as np

# 设置中文字体支持
plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

# 创建示例数据
x = np.linspace(0, 10, 50)
y = np.sin(x) * np.exp(-x/5)

# 创建图形
plt.figure(figsize=(10, 6))
plt.plot(x, y, color='darkblue', linewidth=2, marker='o', markersize=4)
plt.title('阻尼振荡函数', fontsize=16)
plt.xlabel('时间', fontsize=12)
plt.ylabel('振幅', fontsize=12)
plt.grid(True, alpha=0.3)

# 保存图表为PNG文件
plt.savefig('damped_oscillation.png', dpi=300, bbox_inches='tight')
plt.show()
```

### 高级保存选项

```python
# 导入必要的库
import matplotlib.pyplot as plt
import numpy as np
import os

# 设置中文字体支持
plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

# 创建示例数据
categories = ['Q1', 'Q2', 'Q3', 'Q4']
revenue = [120, 150, 180, 200]
profit = [25, 35, 42, 50]

# 创建图形
fig, ax1 = plt.subplots(figsize=(10, 6))

# 绘制收入柱状图
bars1 = ax1.bar(categories, revenue, color='skyblue', alpha=0.8, label='收入')
ax1.set_ylabel('收入 (万元)', color='blue', fontsize=12)
ax1.tick_params(axis='y', labelcolor='blue')

# 创建第二个Y轴
ax2 = ax1.twinx()
# 绘制利润折线图
line2, = ax2.plot(categories, profit, color='red', marker='o', linewidth=2, label='利润')
ax2.set_ylabel('利润 (万元)', color='red', fontsize=12)
ax2.tick_params(axis='y', labelcolor='red')

# 合并图例
lines, labels = ax1.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
ax1.legend(lines + [line2], labels + labels2, loc='upper left')

plt.title('季度收入与利润对比', fontsize=16, pad=20)
plt.grid(True, alpha=0.3)

# 确保保存目录存在
output_dir = 'charts'
os.makedirs(output_dir, exist_ok=True)

# 保存为多种格式
plt.savefig(os.path.join(output_dir, 'quarterly_performance.png'), 
            dpi=300, bbox_inches='tight', facecolor='white')
plt.savefig(os.path.join(output_dir, 'quarterly_performance.pdf'), 
            bbox_inches='tight', facecolor='white')
plt.savefig(os.path.join(output_dir, 'quarterly_performance.svg'), 
            bbox_inches='tight', facecolor='white')

plt.show()

print(f"图表已保存到 {output_dir} 目录")
```

### 批量保存不同分辨率

```python
# 导入必要的库
import matplotlib.pyplot as plt
import numpy as np
import os

# 设置中文字体支持
plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

def create_and_save_chart(resolutions, output_dir='chart_resolutions'):
    """创建图表并以不同分辨率保存"""
    # 创建示例数据
    x = np.linspace(0, 2*np.pi, 100)
    y1 = np.sin(x)
    y2 = np.cos(x)
    
    # 创建图形
    plt.figure(figsize=(10, 6))
    plt.plot(x, y1, label='sin(x)', linewidth=2)
    plt.plot(x, y2, label='cos(x)', linewidth=2, linestyle='--')
    plt.title('三角函数对比', fontsize=16)
    plt.xlabel('弧度', fontsize=12)
    plt.ylabel('值', fontsize=12)
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # 确保输出目录存在
    os.makedirs(output_dir, exist_ok=True)
    
    # 以不同分辨率保存
    for dpi in resolutions:
        filename = f'trig_functions_{dpi}dpi.png'
        filepath = os.path.join(output_dir, filename)
        plt.savefig(filepath, dpi=dpi, bbox_inches='tight', facecolor='white')
        print(f"已保存: {filename} (分辨率: {dpi} DPI)")
    
    plt.show()

# 调用函数保存不同分辨率的图表
try:
    create_and_save_chart([72, 150, 300, 600])
except Exception as e:
    print(f"保存图表时出错: {e}")
```

图表保存方法表格：

| 功能名称   | 实例调用方法                                 | 具体功能、注意事项、必需参数/可选参数                       |
| ---------- | -------------------------------------------- | ----------------------------------------------------------- |
| 基础保存   | `plt.savefig(filename)`                      | 必需参数：文件名；支持png、pdf、svg、jpg等多种格式          |
| 分辨率设置 | `plt.savefig(filename, dpi=300)`             | dpi参数控制分辨率，印刷通常需要300+ DPI，网页72-150 DPI即可 |
| 边距调整   | `plt.savefig(filename, bbox_inches='tight')` | 自动裁剪多余空白边距，确保图形完整显示                      |
| 背景色设置 | `plt.savefig(filename, facecolor='white')`   | 设置保存图形的背景色，默认可能为透明                        |

这节我们学习了如何将 Matplotlib 图表保存为各种格式的图片文件，包括设置分辨率、调整边距和背景色等高级选项。掌握这些技能后，你就可以轻松地将分析结果保存并分享给他人了。