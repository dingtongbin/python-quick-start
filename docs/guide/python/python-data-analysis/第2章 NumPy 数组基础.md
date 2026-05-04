# 第2章 NumPy 数组基础

## 2.1 NumPy 数组基础：ndarray 创建与属性

NumPy 是 Python 数据分析的基石，它的核心是 ndarray（N-dimensional array）对象。相比于 Python 原生的列表，ndarray 在存储和计算效率上有着巨大的优势。

### ndarray 的基本创建方法

让我们先看看如何创建 NumPy 数组：

```python
# 导入 NumPy 库，通常使用 np 作为别名
import numpy as np

# 从 Python 列表创建数组
arr1 = np.array([1, 2, 3, 4, 5])
print("从列表创建:", arr1)

# 创建指定形状的全零数组
arr2 = np.zeros(5)  # 创建长度为5的全零数组
print("全零数组:", arr2)

# 创建指定形状的全一数组
arr3 = np.ones((3, 4))  # 创建3行4列的全一数组
print("全一数组:\n", arr3)

# 创建指定范围的数组
arr4 = np.arange(0, 10, 2)  # 从0到10（不包含），步长为2
print("arange数组:", arr4)

# 创建等间距数组
arr5 = np.linspace(0, 1, 5)  # 从0到1，等分为5个点
print("linspace数组:", arr5)
```

### ndarray 的重要属性

每个 ndarray 对象都有几个关键属性，这些属性帮助我们了解数组的基本信息：

```python
# 创建一个示例数组
sample_array = np.array([[1, 2, 3], [4, 5, 6]])

# 获取数组的维度数量
print("维度数量 (ndim):", sample_array.ndim)

# 获取数组的形状（各维度的大小）
print("形状 (shape):", sample_array.shape)

# 获取数组中元素的总数量
print("元素总数 (size):", sample_array.size)

# 获取数组中元素的数据类型
print("数据类型 (dtype):", sample_array.dtype)

# 获取每个元素占用的字节数
print("元素字节数 (itemsize):", sample_array.itemsize)
```

### 常用 ndarray 创建函数

| 功能名称         | 调用方法                      | 具体功能、注意事项、必需参数/可选参数                      |
| ---------------- | ----------------------------- | ---------------------------------------------------------- |
| 从列表创建数组   | np.array(object, dtype=None)  | 将 Python 列表、元组等转换为 ndarray；dtype 可指定数据类型 |
| 创建全零数组     | np.zeros(shape, dtype=float)  | 创建指定形状的全零数组；shape 可以是整数或元组             |
| 创建全一数组     | np.ones(shape, dtype=float)   | 创建指定形状的全一数组；用法与 zeros 类似                  |
| 创建单位矩阵     | np.eye(N, M=None, k=0)        | 创建 N×M 的单位矩阵；k 指定对角线偏移                      |
| 创建未初始化数组 | np.empty(shape, dtype=float)  | 创建指定形状但未初始化的数组（包含随机值）                 |
| 创建等差数组     | np.arange(start, stop, step)  | 类似 Python range，但返回 ndarray；stop 不包含             |
| 创建等间距数组   | np.linspace(start, stop, num) | 在 start 到 stop 之间创建 num 个等间距点；stop 包含        |

### 完整示例：创建不同类型的数组

```python
import numpy as np

try:
    # 创建不同数据类型的数组
    int_array = np.array([1, 2, 3], dtype=int)
    float_array = np.array([1.0, 2.0, 3.0], dtype=float)
    bool_array = np.array([True, False, True], dtype=bool)
    
    print("整型数组:", int_array)
    print("浮点数组:", float_array)
    print("布尔数组:", bool_array)
    
    # 创建多维数组
    two_d_array = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
    print("二维数组:\n", two_d_array)
    
    # 使用特殊函数创建数组
    identity_matrix = np.eye(3)  # 3x3 单位矩阵
    print("单位矩阵:\n", identity_matrix)
    
    # 创建随机数组
    random_array = np.random.random((2, 3))  # 2x3 随机数组，值在[0,1)之间
    print("随机数组:\n", random_array)
    
except Exception as e:
    print(f"创建数组时发生错误: {e}")
```

这一节主要介绍了 NumPy ndarray 的基本创建方法和重要属性。掌握这些基础知识对于后续的数据操作至关重要，因为几乎所有 NumPy 操作都基于 ndarray 对象。通过不同的创建函数，我们可以灵活地生成各种形状和类型的数组来满足不同的分析需求。

## 2.2 数组索引、切片与布尔索引

在掌握了数组创建之后，我们需要学习如何访问和操作数组中的元素。NumPy 提供了多种索引和切片方式，让我们能够高效地提取所需数据。

### 基本索引和切片

对于一维数组，索引和切片的方式与 Python 列表类似：

```python
import numpy as np

# 创建一维数组
arr_1d = np.array([10, 20, 30, 40, 50])

# 基本索引（从0开始）
print("第一个元素:", arr_1d[0])
print("最后一个元素:", arr_1d[-1])

# 切片操作 [start:stop:step]
print("前三个元素:", arr_1d[:3])
print("从第二个到第四个:", arr_1d[1:4])
print("每隔一个元素:", arr_1d[::2])
print("反转数组:", arr_1d[::-1])
```

对于多维数组，我们可以使用逗号分隔的索引来访问不同维度：

```python
# 创建二维数组
arr_2d = np.array([[1, 2, 3, 4],
                   [5, 6, 7, 8],
                   [9, 10, 11, 12]])

# 访问单个元素 [行, 列]
print("第一行第二列:", arr_2d[0, 1])  # 等同于 arr_2d[0][1]

# 访问整行或整列
print("第一行:", arr_2d[0, :])
print("第二列:", arr_2d[:, 1])

# 切片多维数组
print("前两行，前两列:\n", arr_2d[:2, :2])
print("所有行，每隔一列:\n", arr_2d[:, ::2])
```

### 布尔索引

布尔索引是 NumPy 中非常强大的功能，它允许我们根据条件来选择数组元素：

```python
# 创建示例数组
data = np.array([1, 5, 3, 8, 2, 9, 4])

# 创建布尔掩码
mask = data > 5
print("布尔掩码:", mask)
print("大于5的元素:", data[mask])

# 直接在索引中使用条件
print("小于等于3的元素:", data[data <= 3])

# 多条件布尔索引
print("大于3且小于8的元素:", data[(data > 3) & (data < 8)])
print("小于3或大于8的元素:", data[(data < 3) | (data > 8)])
```

### 花式索引（Fancy Indexing）

花式索引允许我们使用整数数组来索引另一个数组：

```python
# 创建示例数组
arr = np.arange(10)
print("原数组:", arr)

# 使用整数列表索引
indices = [2, 5, 7]
print("指定位置的元素:", arr[indices])

# 使用负索引
neg_indices = [-1, -3, -5]
print("从末尾指定位置的元素:", arr[neg_indices])

# 二维数组的花式索引
arr_2d = np.arange(12).reshape(3, 4)
print("二维数组:\n", arr_2d)

# 同时指定行和列的索引
rows = np.array([0, 2])
cols = np.array([1, 3])
print("指定位置的元素:", arr_2d[rows, cols])  # [arr_2d[0,1], arr_2d[2,3]]
```

### 索引方法对比表格

| 功能名称   | 调用方法                  | 具体功能、注意事项、必需参数/可选参数    |
| ---------- | ------------------------- | ---------------------------------------- |
| 基本索引   | arr[index]                | 访问单个元素；index 可以是正数或负数     |
| 切片       | arr[start:stop:step]      | 提取子数组；stop 不包含；step 默认为1    |
| 多维索引   | arr[row, col]             | 访问多维数组元素；可用 : 表示整个维度    |
| 布尔索引   | arr[condition]            | 根据条件选择元素；condition 返回布尔数组 |
| 花式索引   | arr[indices]              | 使用整数数组指定要选择的位置             |
| where 条件 | np.where(condition, x, y) | 满足 condition 时返回 x，否则返回 y      |

### 完整示例：综合索引操作

```python
import numpy as np

try:
    # 创建测试数据
    np.random.seed(42)  # 设置随机种子以获得可重现的结果
    data = np.random.randint(1, 20, size=(4, 5))
    print("原始数据:\n", data)
    
    # 基本索引和切片
    print("\n--- 基本操作 ---")
    print("第一行:", data[0])
    print("最后一列:", data[:, -1])
    print("右下角2x2子矩阵:\n", data[-2:, -2:])
    
    # 布尔索引
    print("\n--- 布尔索引 ---")
    greater_than_10 = data > 10
    print("大于10的元素:", data[greater_than_10])
    
    # 修改满足条件的元素
    data_copy = data.copy()  # 创建副本避免修改原数组
    data_copy[data_copy < 5] = 0  # 将小于5的元素设为0
    print("将小于5的元素设为0:\n", data_copy)
    
    # 花式索引
    print("\n--- 花式索引 ---")
    row_indices = [0, 2]
    col_indices = [1, 3]
    print("指定行列交叉点:", data[row_indices, col_indices])
    
    # 结合多种索引方式
    print("\n--- 综合应用 ---")
    # 选择第一行中大于5的元素
    first_row_gt5 = data[0][data[0] > 5]
    print("第一行中大于5的元素:", first_row_gt5)
    
except Exception as e:
    print(f"索引操作时发生错误: {e}")
```

这一节详细介绍了 NumPy 数组的各种索引和切片方法。基本索引和切片适用于简单的元素访问，布尔索引让我们能够基于条件筛选数据，而花式索引则提供了更灵活的位置选择方式。掌握这些索引技术是进行高效数据分析的基础，它们在数据清洗、特征选择等场景中都有广泛应用。

## 2.3 向量化运算与广播机制

NumPy 的强大之处不仅在于高效的数组存储，更在于其向量化运算能力。向量化运算避免了显式的循环，大大提高了计算效率。而广播机制则让不同形状的数组能够进行算术运算。

### 向量化运算基础

向量化运算是指对整个数组进行操作，而不是逐个元素处理：

```python
import numpy as np

# 创建两个数组
arr1 = np.array([1, 2, 3, 4])
arr2 = np.array([5, 6, 7, 8])

# 基本算术运算（逐元素）
print("加法:", arr1 + arr2)
print("减法:", arr1 - arr2)
print("乘法:", arr1 * arr2)
print("除法:", arr1 / arr2)

# 与标量运算
print("加标量:", arr1 + 10)
print("乘标量:", arr1 * 2)

# 幂运算
print("平方:", arr1 ** 2)
print("开方:", np.sqrt(arr1))
```

### 比较运算

NumPy 也支持向量化的比较运算，返回布尔数组：

```python
# 比较运算
arr = np.array([1, 5, 3, 8, 2])

print("大于3:", arr > 3)
print("等于5:", arr == 5)
print("不等于2:", arr != 2)
print("在范围内:", (arr >= 3) & (arr <= 8))

# 使用比较结果进行索引
print("大于3的元素:", arr[arr > 3])
```

### 广播机制

广播机制是 NumPy 中一个非常重要的概念，它允许不同形状的数组进行算术运算：

```python
# 广播示例1：标量与数组
arr = np.array([[1, 2, 3],
                [4, 5, 6]])
scalar = 10
result = arr + scalar  # 标量被"广播"到整个数组
print("标量广播:\n", result)

# 广播示例2：一维数组与二维数组
arr_2d = np.array([[1, 2, 3],
                   [4, 5, 6]])
arr_1d = np.array([10, 20, 30])
result = arr_2d + arr_1d  # 一维数组被广播到每一行
print("一维广播到二维:\n", result)

# 广播示例3：列向量与行向量
col_vector = np.array([[10], [20]])  # 2x1
row_vector = np.array([1, 2, 3])     # 1x3
result = col_vector + row_vector     # 结果是2x3
print("列向量+行向量:\n", result)
```

### 广播规则

NumPy 的广播遵循以下规则：

1. 让所有输入数组都向其中 shape 最大的数组看齐，shape 中不足的部分都通过在前面加 1 来补齐
2. 输出数组的 shape 是输入数组 shape 的各个维度上的最大值
3. 如果输入数组的某个维度为 1 或者与输出数组对应维度相等，则该数组可以广播到输出形状

### 向量化函数

NumPy 提供了许多向量化的数学函数：

```python
# 创建示例数组
angles = np.array([0, np.pi/4, np.pi/2, np.pi])

# 三角函数
print("正弦值:", np.sin(angles))
print("余弦值:", np.cos(angles))

# 指数和对数
values = np.array([1, 2, 3, 4])
print("指数:", np.exp(values))
print("自然对数:", np.log(values))
print("以10为底的对数:", np.log10(values))

# 其他数学函数
print("绝对值:", np.abs([-1, -2, 3, -4]))
print("四舍五入:", np.round([1.2, 1.5, 1.8]))
print("最大值:", np.maximum([1, 5, 3], [2, 4, 6]))
```

### 向量化运算方法表格

| 功能名称 | 调用方法                   | 具体功能、注意事项、必需参数/可选参数      |
| -------- | -------------------------- | ------------------------------------------ |
| 基本算术 | arr1 + arr2, arr1 * scalar | 支持 +, -, *, /, //, %, ** 等运算符        |
| 比较运算 | arr1 > arr2, arr == value  | 返回布尔数组；支持 >, <, >=, <=, ==, !=    |
| 数学函数 | np.sin(arr), np.log(arr)   | 应用于数组每个元素；保持数组形状不变       |
| 聚合函数 | np.sum(arr), np.mean(arr)  | 对整个数组或指定轴进行聚合计算             |
| 广播运算 | arr_2d + arr_1d            | 自动处理不同形状数组的运算；需符合广播规则 |

### 完整示例：向量化运算与广播应用

```python
import numpy as np

try:
    # 创建温度数据（摄氏度）
    celsius_temps = np.array([0, 20, 30, 40, -10, 15])
    
    # 向量化转换为华氏度：F = C * 9/5 + 32
    fahrenheit_temps = celsius_temps * 9/5 + 32
    print("摄氏度:", celsius_temps)
    print("华氏度:", fahrenheit_temps)
    
    # 创建二维数据：不同城市在不同日期的温度
    cities = ['北京', '上海', '广州']
    dates = ['周一', '周二', '周三', '周四']
    temps_2d = np.random.randint(15, 35, size=(3, 4))
    print("\n各城市温度:\n", temps_2d)
    
    # 广播应用：每个城市的平均温度调整
    city_adjustments = np.array([2, -1, 0])  # 北京+2，上海-1，广州不变
    adjusted_temps = temps_2d + city_adjustments.reshape(-1, 1)
    print("\n调整后温度:\n", adjusted_temps)
    
    # 向量化条件运算
    print("\n--- 温度分类 ---")
    hot_days = temps_2d > 30
    cold_days = temps_2d < 20
    print("炎热天数:", np.sum(hot_days, axis=1))  # 每个城市的炎热天数
    print("寒冷天数:", np.sum(cold_days, axis=1))  # 每个城市的寒冷天数
    
    # 使用 where 进行条件赋值
    temp_categories = np.where(temps_2d > 30, '热', 
                              np.where(temps_2d < 20, '冷', '适中'))
    print("\n温度分类:\n", temp_categories)
    
except Exception as e:
    print(f"向量化运算时发生错误: {e}")
```

这一节深入探讨了 NumPy 的向量化运算和广播机制。向量化运算让我们能够以简洁的代码对整个数组进行操作，而广播机制则自动处理不同形状数组之间的运算。这两个特性是 NumPy 高性能计算的核心，它们避免了显式的 Python 循环，在处理大规模数据时能带来显著的性能提升。理解并熟练运用这些概念，将大大提高你的数据分析效率。

## 2.4 常用数学函数与随机数生成

NumPy 不仅提供了基本的算术运算，还包含了丰富的数学函数和强大的随机数生成功能。这些工具在数据分析、模拟和机器学习中都有广泛应用。

### 常用数学函数

NumPy 提供了大量向量化的数学函数，可以对整个数组进行操作：

```python
import numpy as np

# 创建示例数组
arr = np.array([-2, -1, 0, 1, 2, 3.5])

# 基本数学函数
print("绝对值:", np.abs(arr))
print("平方根:", np.sqrt(np.abs(arr)))  # 注意：负数需要先取绝对值
print("平方:", np.square(arr))
print("指数:", np.exp(arr))
print("自然对数:", np.log(np.abs(arr[arr != 0])))  # 避免除零错误

# 三角函数（输入为弧度）
angles = np.array([0, np.pi/6, np.pi/4, np.pi/3, np.pi/2])
print("\n角度（弧度）:", angles)
print("正弦:", np.sin(angles))
print("余弦:", np.cos(angles))
print("正切:", np.tan(angles))

# 四舍五入函数
floats = np.array([1.2, 1.5, 1.8, 2.1, 2.9])
print("\n原始浮点数:", floats)
print("四舍五入:", np.round(floats))
print("向下取整:", np.floor(floats))
print("向上取整:", np.ceil(floats))
print("截断小数:", np.trunc(floats))
```

### 聚合函数

聚合函数对数组进行统计计算，可以指定轴（axis）参数：

```python
# 创建二维数组
data = np.array([[1, 2, 3, 4],
                 [5, 6, 7, 8],
                 [9, 10, 11, 12]])

# 基本聚合函数
print("总和:", np.sum(data))
print("均值:", np.mean(data))
print("标准差:", np.std(data))
print("方差:", np.var(data))
print("最小值:", np.min(data))
print("最大值:", np.max(data))

# 按轴聚合（axis=0 按列，axis=1 按行）
print("\n按列求和:", np.sum(data, axis=0))
print("按行求和:", np.sum(data, axis=1))
print("每列最大值:", np.max(data, axis=0))
print("每行最小值:", np.min(data, axis=1))

# 其他有用的聚合函数
print("\n累积和:", np.cumsum(data))
print("累积积:", np.cumprod(data[:3]))  # 只取前3个元素避免数字过大
print("差分:", np.diff(data[0]))  # 计算相邻元素的差
```

### 随机数生成

NumPy 的随机数模块提供了多种分布的随机数生成器：

```python
# 设置随机种子以获得可重现的结果
np.random.seed(42)

# 基本随机数生成
print("0-1之间的随机数:", np.random.random(5))
print("指定范围的随机整数:", np.random.randint(1, 10, size=5))
print("正态分布随机数:", np.random.normal(0, 1, size=5))  # 均值0，标准差1

# 不同分布的随机数
print("\n--- 不同分布 ---")
print("均匀分布:", np.random.uniform(0, 10, size=5))
print("二项分布:", np.random.binomial(10, 0.5, size=5))  # n=10, p=0.5
print("泊松分布:", np.random.poisson(5, size=5))  # lambda=5
print("指数分布:", np.random.exponential(2, size=5))  # scale=2

# 随机选择和排列
arr = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
print("\n随机选择3个元素:", np.random.choice(arr, size=3, replace=False))
print("数组随机打乱:", np.random.permutation(arr))
```

### 数学函数与随机数方法表格

| 功能名称     | 调用方法                           | 具体功能、注意事项、必需参数/可选参数              |
| ------------ | ---------------------------------- | -------------------------------------------------- |
| 基本数学函数 | np.abs(arr), np.sqrt(arr)          | 对数组每个元素应用数学函数；注意定义域限制         |
| 三角函数     | np.sin(arr), np.cos(arr)           | 输入为弧度；输出范围符合三角函数性质               |
| 聚合函数     | np.sum(arr, axis=None)             | axis=None 对整个数组聚合；axis=0 按列；axis=1 按行 |
| 累积函数     | np.cumsum(arr), np.cumprod(arr)    | 返回累积结果数组，形状与原数组相同                 |
| 基本随机数   | np.random.random(size)             | 生成[0,1)区间均匀分布的随机数                      |
| 整数随机数   | np.random.randint(low, high, size) | 生成[low, high)区间的随机整数                      |
| 正态分布     | np.random.normal(loc, scale, size) | loc为均值，scale为标准差                           |
| 随机选择     | np.random.choice(a, size, replace) | 从数组a中随机选择；replace控制是否放回             |

### 完整示例：数学函数与随机数综合应用

```python
import numpy as np

try:
    # 设置随机种子
    np.random.seed(123)
    
    # 生成模拟数据：100个学生的考试成绩
    scores = np.random.normal(75, 15, size=100)  # 均值75，标准差15
    scores = np.clip(scores, 0, 100)  # 限制在0-100范围内
    
    print("成绩统计:")
    print(f"平均分: {np.mean(scores):.2f}")
    print(f"中位数: {np.median(scores):.2f}")
    print(f"标准差: {np.std(scores):.2f}")
    print(f"最高分: {np.max(scores):.2f}")
    print(f"最低分: {np.min(scores):.2f}")
    
    # 成绩分布分析
    excellent = scores >= 90
    good = (scores >= 80) & (scores < 90)
    average = (scores >= 70) & (scores < 80)
    poor = scores < 70
    
    print(f"\n成绩分布:")
    print(f"优秀(>=90): {np.sum(excellent)}人 ({np.mean(excellent)*100:.1f}%)")
    print(f"良好(80-89): {np.sum(good)}人 ({np.mean(good)*100:.1f}%)")
    print(f"中等(70-79): {np.sum(average)}人 ({np.mean(average)*100:.1f}%)")
    print(f"不及格(<70): {np.sum(poor)}人 ({np.mean(poor)*100:.1f}%)")
    
    # 生成相关数据：学习时间与成绩的关系
    study_hours = np.random.uniform(1, 10, size=100)
    # 假设学习时间与成绩正相关，加上一些随机噪声
    correlated_scores = 50 + 5 * study_hours + np.random.normal(0, 10, size=100)
    correlated_scores = np.clip(correlated_scores, 0, 100)
    
    # 计算相关系数
    correlation = np.corrcoef(study_hours, correlated_scores)[0, 1]
    print(f"\n学习时间与成绩的相关系数: {correlation:.3f}")
    
    # 找出异常值（使用Z-score方法）
    z_scores = (scores - np.mean(scores)) / np.std(scores)
    outliers = np.abs(z_scores) > 2  # Z-score绝对值大于2的视为异常值
    print(f"异常值数量: {np.sum(outliers)}")
    if np.any(outliers):
        print(f"异常值: {scores[outliers]}")
    
except Exception as e:
    print(f"数学函数与随机数操作时发生错误: {e}")
```

这一节全面介绍了 NumPy 的常用数学函数和随机数生成功能。数学函数让我们能够对数组进行各种数学变换，而聚合函数则提供了强大的统计分析能力。随机数生成器在模拟实验、机器学习初始化和数据增强等方面都有重要作用。掌握这些工具，你就能处理各种数据分析任务，从简单的统计计算到复杂的概率模拟。这些功能的组合使用，为后续的数据分析和建模奠定了坚实的基础。