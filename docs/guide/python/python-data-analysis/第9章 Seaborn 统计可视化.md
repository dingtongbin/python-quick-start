# 第9章 Seaborn 统计可视化

## 9.1 Seaborn 统计图表优势简介

Seaborn 是基于 Matplotlib 的高级统计可视化库，它让创建复杂且美观的统计图表变得异常简单。相比于原生 Matplotlib，Seaborn 提供了更简洁的 API、更好的默认样式（比如自动配色、字体大小等），还内置了许多统计图形，如箱线图、小提琴图、热力图等，特别适合做探索性数据分析（EDA）。

使用 Seaborn，你不需要手动调整太多细节，就能画出专业感十足的图表。尤其当你面对分类变量、分组数据或需要展示分布形态时，Seaborn 往往一行代码就搞定，省时又省力。

### Seaborn 核心优势一览表

| 功能名称     | 调用方法                             | 具体功能与注意事项                                           |
| ------------ | ------------------------------------ | ------------------------------------------------------------ |
| 默认美化样式 | `sns.set_style()`                    | 自动应用美观的绘图风格（如 whitegrid、darkgrid），无需手动配置颜色、线宽等 |
| 内置数据集   | `sns.load_dataset()`                 | 提供常用示例数据（如 tips、iris、titanic），便于快速测试和教学 |
| 分布可视化   | `sns.histplot()`, `sns.kdeplot()`    | 一键绘制直方图、核密度估计图，支持按类别着色                 |
| 关系可视化   | `sns.scatterplot()`, `sns.relplot()` | 支持 hue、size、style 等语义映射，轻松展示多维关系           |

下面是一个最简单的 Seaborn 使用示例，加载内置数据并绘制散点图：

```python
# 导入 seaborn 库，通常简写为 sns
import seaborn as sns

# 导入 matplotlib.pyplot 用于显示图形
import matplotlib.pyplot as plt

# 加载 Seaborn 内置的 "tips" 数据集（小费数据）
# 返回一个 pandas DataFrame
tips = sns.load_dataset("tips")

# 使用 scatterplot 绘制总账单 vs 小费的散点图
# hue 参数按 "time"（午餐/晚餐）自动着色
try:
    sns.scatterplot(data=tips, x="total_bill", y="tip", hue="time")
    # 显示图形
    plt.show()
except Exception as e:
    print(f"绘图出错: {e}")
```

**注意事项：**

- Seaborn 依赖 pandas DataFrame，传入的数据必须是结构化表格形式。
- 所有绘图函数都接受 `data` 参数作为主数据源，列名直接用字符串引用。
- 虽然 Seaborn 自动美化图形，但底层仍由 Matplotlib 渲染，因此可与 `plt` 混合使用进行微调。

这一节我们介绍了 Seaborn 的核心优势：简洁 API、美观默认样式、强大的统计图形支持，特别适合快速进行数据探索和可视化分析。