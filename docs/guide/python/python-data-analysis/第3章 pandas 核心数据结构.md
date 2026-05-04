### 3.1 pandas 核心数据结构：Series 与 DataFrame

pandas 是 Python 数据分析的基石，它的两个核心数据结构——Series 和 DataFrame，就像数据分析界的“左右护法”。Series 是一维带标签的数组，而 DataFrame 则是二维表格型数据结构，相当于 Excel 表格。掌握它们，就等于拿到了数据分析的入门钥匙。

**Series 基础操作**

```python
# 导入 pandas 库
import pandas as pd

# 创建一个 Series，data 是数据列表，index 是对应的索引标签
series_example = pd.Series(data=[10, 20, 30, 40], index=['a', 'b', 'c', 'd'])

# 打印 Series，会显示索引和对应的值
print("创建的 Series:")
print(series_example)

# 通过索引标签访问单个元素
value_at_b = series_example['b']
print(f"\n索引 'b' 对应的值: {value_at_b}")

# 通过位置（整数）访问元素，注意这和列表类似，从0开始
value_at_position_2 = series_example.iloc[2]
print(f"位置 2 对应的值: {value_at_position_2}")

# 对整个 Series 进行向量化运算，比如乘以2
doubled_series = series_example * 2
print(f"\nSeries 乘以 2 后:\n{doubled_series}")
```

**DataFrame 基础操作**

```python
# 创建一个 DataFrame
# data 是一个字典，键是列名，值是列数据（列表）
data_dict = {
    '姓名': ['张三', '李四', '王五'],
    '年龄': [25, 30, 35],
    '城市': ['北京', '上海', '广州']
}
df_example = pd.DataFrame(data=data_dict)

# 打印 DataFrame
print("创建的 DataFrame:")
print(df_example)

# 查看 DataFrame 的形状 (行数, 列数)
print(f"\nDataFrame 形状: {df_example.shape}")

# 查看列名
print(f"列名: {df_example.columns.tolist()}")

# 通过列名选择一整列，返回一个 Series
ages_series = df_example['年龄']
print(f"\n'年龄' 列 (Series):\n{ages_series}")

# 选择多列，需要用双层方括号，返回一个新的 DataFrame
subset_df = df_example
print(f"\n选择 '姓名' 和 '城市' 列:\n{subset_df}")
```

这一节我们认识了 pandas 的两大核心数据结构：Series 和 DataFrame。Series 用于处理一维数据，而 DataFrame 则是我们日常分析中最常用的二维表格数据容器。它们都支持丰富的索引、切片和向量化操作，为后续的数据清洗和分析打下了坚实的基础。

### 3.2 从 CSV、Excel、JSON 读取数据

在真实世界里，数据很少直接在代码里定义，它们通常躺在各种文件里“睡大觉”，比如 CSV、Excel 或 JSON 文件。pandas 提供了超级方便的函数，能一键把它们“唤醒”并加载到 DataFrame 中，让我们可以立刻开始分析。

**实例方法表格**

| 功能名称        | 实例调用方法                 | 具体功能、注意事项、必需参数/可选参数                        |
| --------------- | ---------------------------- | ------------------------------------------------------------ |
| 读取 CSV 文件   | `pd.read_csv('file.csv')`    | 从逗号分隔的文本文件读取数据。`filepath_or_buffer` 是必需参数。常用可选参数：`sep` (分隔符，默认`,`), `header` (指定哪一行作为列名), `encoding` (文件编码，如`'utf-8'`)。 |
| 读取 Excel 文件 | `pd.read_excel('file.xlsx')` | 从 Excel 文件读取数据。`io` 是必需参数。常用可选参数：`sheet_name` (指定工作表，默认第一个), `header`, `usecols` (指定要读取的列)。 |
| 读取 JSON 文件  | `pd.read_json('file.json')`  | 从 JSON 文件读取数据。`path_or_buf` 是必需参数。常用可选参数：`orient` (指定 JSON 字符串的格式，如`'records'`, `'split'`等)。 |

**使用示例**

```python
import pandas as pd

# 尝试读取一个 CSV 文件
try:
    # 假设当前目录下有一个名为 'data.csv' 的文件
    df_from_csv = pd.read_csv('data.csv', encoding='utf-8')
    print("成功从 CSV 读取数据:")
    print(df_from_csv.head(3)) # 只打印前3行预览
except FileNotFoundError:
    print("错误: 找不到 'data.csv' 文件，请检查文件路径。")
except UnicodeDecodeError:
    print("错误: 文件编码问题，尝试指定正确的 encoding 参数，如 'gbk'。")

# 尝试读取一个 Excel 文件
try:
    # 假设当前目录下有一个名为 'data.xlsx' 的文件
    df_from_excel = pd.read_excel('data.xlsx', sheet_name='Sheet1')
    print("\n成功从 Excel 读取数据:")
    print(df_from_excel.head(3))
except FileNotFoundError:
    print("错误: 找不到 'data.xlsx' 文件。")
except ValueError as e:
    print(f"错误: Excel 文件或工作表问题: {e}")

# 尝试从一个字典创建 JSON 字符串并读取 (模拟读取 JSON 文件)
import json
sample_data = [{"name": "Alice", "age": 25}, {"name": "Bob", "age": 30}]
json_str = json.dumps(sample_data)

# 使用 read_json 从字符串读取
df_from_json = pd.read_json(json_str, orient='records')
print("\n从 JSON 字符串读取的数据:")
print(df_from_json)
```

**注意事项**

- **文件路径**: 确保提供的文件路径是正确的。可以使用绝对路径或相对路径。
- **编码问题**: CSV 文件经常遇到编码问题（尤其是中文），常见的编码有 `utf-8` 和 `gbk`。如果读取出乱码，尝试更换 `encoding` 参数。
- **依赖库**: 读取 Excel 文件需要额外安装 `openpyxl` 或 `xlrd` 库。可以通过 `pip install openpyxl` 安装。

这一节我们学会了如何将存储在外部文件（CSV、Excel、JSON）中的数据轻松导入到 pandas DataFrame 中。这是数据分析流程的第一步，也是至关重要的一步，因为只有把数据正确地“请”进我们的分析环境，后续的工作才能顺利展开。

### 3.3 查看数据基本信息：head、info、describe

拿到一个全新的数据集，就像拿到一个陌生的包裹，我们肯定想先“开箱验货”，快速了解一下里面大概有什么、状态如何。pandas 提供了几个非常实用的方法，能让我们在几秒钟内对数据形成一个初步的整体印象。

**实例方法表格**

| 功能名称     | 实例调用方法    | 具体功能、注意事项、必需参数/可选参数                        |
| ------------ | --------------- | ------------------------------------------------------------ |
| 查看前 N 行  | `df.head(n=5)`  | 快速预览数据的开头部分。`n` 是可选参数，默认为5。对于大型数据集，这是避免一次性输出全部内容的好方法。 |
| 查看数据摘要 | `df.info()`     | 打印 DataFrame 的简明摘要，包括总行数、每列的非空值数量、数据类型 (`dtype`) 以及内存占用情况。无必需参数。 |
| 查看统计摘要 | `df.describe()` | 生成描述性统计信息，主要针对数值型列，如计数、均值、标准差、最小/最大值、四分位数等。`include` 参数可控制包含哪些数据类型的列。 |

**使用示例**

```python
import pandas as pd

# 创建一个示例 DataFrame
data = {
    '产品': ['A', 'B', 'C', 'D', 'E'],
    '销量': [150, 200, None, 180, 220],  # 包含一个缺失值
    '价格': [10.5, 15.0, 12.0, 11.0, 13.5],
    '上架日期': pd.to_datetime(['2023-01-01', '2023-01-02', '2023-01-03', '2023-01-04', '2023-01-05'])
}
df = pd.DataFrame(data)

# 1. 使用 head() 查看前几行
print("=== 查看数据前3行 (head) ===")
print(df.head(3))  # 查看前3行

# 2. 使用 info() 查看数据整体信息
print("\n=== 数据摘要信息 (info) ===")
df.info()  # 这个方法直接打印，不返回DataFrame

# 3. 使用 describe() 查看数值列的统计信息
print("\n=== 数值列的统计摘要 (describe) ===")
print(df.describe())

# 4. 如果想查看所有列（包括非数值列）的统计信息
print("\n=== 所有列的统计摘要 (describe with include='all') ===")
print(df.describe(include='all'))
```

**注意事项**

- **`info()` 的输出**: `info()` 方法不会返回任何值（返回 `None`），它只是将信息直接打印到控制台。它的输出能清晰地告诉我们哪些列有缺失值（通过非空值计数 `< 总行数` 判断）。
- **`describe()` 的默认行为**: 默认情况下，`describe()` 只对数值型（`int`, `float`）和日期时间型（`datetime`）列进行统计。如果想看分类数据（如字符串）的统计（比如唯一值数量、最常见值等），需要加上 `include='all'` 或 `include=['object']`。
- **缺失值的影响**: 在 `describe()` 的输出中，计数（`count`）会自动排除缺失值（`NaN`），所以看到的计数可能小于总行数。

这一节介绍的 `head`、`info` 和 `describe` 是我们探索任何新数据集时最先使用的“三板斧”。它们能帮助我们迅速把握数据的规模、结构、数据类型以及基本的分布情况，为接下来更深入的数据清洗和分析指明方向。

### 3.4 列选择、行筛选与条件查询

当我们对数据有了初步了解后，就需要像外科医生一样，精准地“解剖”数据，只关注我们感兴趣的那部分。这涉及到选择特定的列、筛选满足条件的行，或者两者结合。pandas 提供了多种灵活且强大的方式来实现这些操作。

**列选择**

选择列是最基础的操作。我们可以用方括号 `[]` 来完成。

```python
import pandas as pd

# 创建示例数据
df = pd.DataFrame({
    '姓名': ['小明', '小红', '小刚', '小丽'],
    '年龄': [22, 25, 23, 24],
    '城市': ['北京', '上海', '北京', '深圳'],
    '薪资': [8000, 9000, 8500, 9500]
})

# 选择单列，返回一个 Series
single_column = df['姓名']
print("选择单列 '姓名' (返回 Series):")
print(single_column)
print(type(single_column))  # <class 'pandas.core.series.Series'>

# 选择多列，必须使用双层方括号 ，返回一个新的 DataFrame
multiple_columns = df
print("\n选择多列 ['姓名', '薪资'] (返回 DataFrame):")
print(multiple_columns)
print(type(multiple_columns))  # <class 'pandas.core.frame.DataFrame'>
```

**行筛选与条件查询**

行筛选的核心是使用布尔索引（Boolean Indexing）。我们构造一个条件，这个条件会对每一行进行判断，返回一个由 `True`/`False` 组成的 Series，然后用这个 Series 来“过滤”原始 DataFrame。

```python
# 筛选年龄大于23岁的员工
condition = df['年龄'] > 23
filtered_df = df[condition]
print("年龄大于23岁的员工:")
print(filtered_df)

# 更复杂的条件：使用 & (and), | (or), ~ (not)
# 注意：多个条件需要用圆括号 () 括起来
complex_condition = (df['城市'] == '北京') & (df['薪资'] > 8000)
beijing_high_salary = df[complex_condition]
print("\n在北京且薪资高于8000的员工:")
print(beijing_high_salary)

# 使用 isin() 方法筛选属于某个列表的值
cities_of_interest = ['北京', '上海']
in_cities = df['城市'].isin(cities_of_interest)
employees_in_cities = df[in_cities]
print("\n在北京或上海的员工:")
print(employees_in_cities)
```

**使用 `.loc` 和 `.iloc` 进行更精确的选择**

- **`.loc`**: 基于标签（label-based）进行选择。你可以同时指定行标签和列标签。
- **`.iloc`**: 基于位置（integer-location based）进行选择。使用整数索引。

```python
# 使用 .loc: 选择行标签为 0, 2 且列标签为 '姓名' 和 '城市' 的数据
by_label = df.loc[[0, 2], ['姓名', '城市']]
print("使用 .loc 按标签选择:")
print(by_label)

# 使用 .iloc: 选择第1行（索引0）到第3行（索引2，不包含）以及前两列
by_position = df.iloc[0:3, 0:2]
print("\n使用 .iloc 按位置选择 (前3行，前2列):")
print(by_position)

# .loc 也可以用于条件查询，效果和上面的布尔索引一样
by_loc_condition = df.loc[df['薪资'] > 9000, ['姓名', '薪资']]
print("\n使用 .loc 进行条件查询和列选择:")
print(by_loc_condition)
```

这一节我们学习了如何精准地定位和提取数据。通过列选择、布尔索引以及 `.loc`/`.iloc` 访问器，我们可以像使用高级筛子一样，从庞大的数据集中高效地捞出我们需要的“金子”。这些技能是进行任何针对性分析的前提。