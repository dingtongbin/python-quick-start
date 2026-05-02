# 第二章：NumPy 数值计算基础

NumPy（Numerical Python）是 Python 数据科学生态的核心库，提供了高性能的多维数组对象和用于处理这些数组的工具。本章将带你掌握 NumPy 的核心功能。

---

## 2.1 NumPy 简介与为什么需要它

### 什么是 NumPy？

NumPy 是一个开源的 Python 科学计算库，核心是 `ndarray`（N-dimensional array，N 维数组）对象。它为 Python 添加了强大的数组处理能力，是 Pandas、Matplotlib、Scikit-learn 等库的基础。

### 为什么需要 NumPy？

#### 对比 Python 原生列表

```python
import numpy as np
import time

# 使用 Python 列表
python_list = list(range(1000000))
start = time.time()
result_list = [x * 2 for x in python_list]
print(f"列表运算耗时: {time.time() - start:.4f}秒")

# 使用 NumPy 数组
numpy_array = np.arange(1000000)
start = time.time()
result_array = numpy_array * 2
print(f"NumPy运算耗时: {time.time() - start:.4f}秒")
```

**输出示例：**
```
列表运算耗时: 0.0523秒
NumPy运算耗时: 0.0012秒
```

NumPy 比原生列表快 **40+ 倍**！

### NumPy 的优势

1. **速度快**：底层用 C 语言实现，支持向量化运算
2. **内存效率高**：连续存储，占用更少内存
3. **功能强大**：提供丰富的数学函数和线性代数运算
4. **广播机制**：自动处理不同形状数组的运算
5. **生态完善**：几乎所有数据科学库都依赖 NumPy

---

## 2.2 创建数组

### 从列表创建数组

```python
import numpy as np

# 一维数组
arr1 = np.array([1, 2, 3, 4, 5])
print("一维数组:", arr1)
print("类型:", type(arr1))
print("数据类型:", arr1.dtype)

# 二维数组（矩阵）
arr2 = np.array([[1, 2, 3], 
                 [4, 5, 6], 
                 [7, 8, 9]])
print("\n二维数组:\n", arr2)
```

### 常用创建函数

```python
# 全零数组
zeros = np.zeros((3, 4))  # 3行4列
print("全零数组:\n", zeros)

# 全一数组
ones = np.ones((2, 3))
print("\n全一数组:\n", ones)

# 指定值的数组
full = np.full((2, 2), 7)  # 2x2矩阵，所有元素为7
print("\n填充数组:\n", full)

# 单位矩阵
eye = np.eye(3)  # 3x3单位矩阵
print("\n单位矩阵:\n", eye)

# 等差数列
arange_arr = np.arange(0, 10, 2)  # 从0到10，步长为2
print("\narange数组:", arange_arr)  # [0 2 4 6 8]

# 均匀分布数组
linspace_arr = np.linspace(0, 1, 5)  # 0到1之间等间距的5个数
print("\nlinspace数组:", linspace_arr)  # [0.   0.25 0.5  0.75 1.  ]

# 随机数组
random_arr = np.random.rand(3, 3)  # 0-1之间的随机数
print("\n随机数组:\n", random_arr)

# 正态分布随机数
normal_arr = np.random.randn(3, 3)  # 标准正态分布
print("\n正态分布数组:\n", normal_arr)

# 整数随机数
int_random = np.random.randint(1, 100, size=(3, 3))  # 1-100的随机整数
print("\n随机整数数组:\n", int_random)
```

### 指定数据类型

```python
# 创建时指定类型
arr_int = np.array([1, 2, 3], dtype=np.int32)
arr_float = np.array([1, 2, 3], dtype=np.float64)
arr_complex = np.array([1, 2, 3], dtype=np.complex128)

print("整数数组类型:", arr_int.dtype)
print("浮点数组类型:", arr_float.dtype)
print("复数数组类型:", arr_complex.dtype)
```

---

## 2.3 数组属性

```python
import numpy as np

# 创建示例数组
arr = np.array([[1, 2, 3, 4], 
                [5, 6, 7, 8], 
                [9, 10, 11, 12]])

print("数组:\n", arr)
print("\n维度 (ndim):", arr.ndim)          # 2
print("形状 (shape):", arr.shape)         # (3, 4)
print("元素总数 (size):", arr.size)       # 12
print("数据类型 (dtype):", arr.dtype)     # int32 或 int64
print("每个元素字节数 (itemsize):", arr.itemsize)  # 4 或 8
print("总字节数 (nbytes):", arr.nbytes)   # 48 或 96
```

**关键属性说明：**

| 属性 | 说明 | 示例 |
|------|------|------|
| `ndim` | 数组维度数 | 1维、2维、3维... |
| `shape` | 数组形状（元组） | `(3, 4)` 表示3行4列 |
| `size` | 元素总数 | `3 * 4 = 12` |
| `dtype` | 元素数据类型 | `int32`, `float64`等 |
| `itemsize` | 每个元素的字节数 | `int32`为4字节 |

---

## 2.4 数组索引与切片

### 一维数组索引

```python
arr = np.array([10, 20, 30, 40, 50])

print("第一个元素:", arr[0])      # 10
print("最后一个元素:", arr[-1])   # 50
print("第二个元素:", arr[1])      # 20
```

### 一维数组切片

```python
arr = np.array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])

print("前5个元素:", arr[:5])        # [0 1 2 3 4]
print("第3到第7个:", arr[2:7])      # [2 3 4 5 6]
print("每隔2个取一个:", arr[::2])   # [0 2 4 6 8]
print("逆序:", arr[::-1])           # [9 8 7 6 5 4 3 2 1 0]
```

### 二维数组索引

```python
arr_2d = np.array([[1, 2, 3, 4], 
                   [5, 6, 7, 8], 
                   [9, 10, 11, 12]])

print("第一行:", arr_2d[0])         # [1 2 3 4]
print("第二行第三列:", arr_2d[1, 2])  # 7
print("最后一行最后一列:", arr_2d[-1, -1])  # 12
```

### 二维数组切片

```python
arr_2d = np.array([[1, 2, 3, 4], 
                   [5, 6, 7, 8], 
                   [9, 10, 11, 12]])

print("前两行:\n", arr_2d[:2])
print("\n前两行前两列:\n", arr_2d[:2, :2])
print("\n所有行的第2、3列:\n", arr_2d[:, 1:3])
print("\n隔行取:\n", arr_2d[::2])
```

### 花式索引（Fancy Indexing）

```python
arr = np.array([10, 20, 30, 40, 50, 60])

# 使用索引数组
indices = [0, 2, 4]
print("指定索引的元素:", arr[indices])  # [10 30 50]

# 二维数组花式索引
arr_2d = np.array([[1, 2, 3], 
                   [4, 5, 6], 
                   [7, 8, 9]])

rows = [0, 2]
cols = [1, 2]
print("指定行列的元素:", arr_2d[rows, cols])  # [2 9]
```

---

## 2.5 数组运算

### 算术运算（向量化）

```python
a = np.array([1, 2, 3, 4])
b = np.array([10, 20, 30, 40])

print("加法:", a + b)        # [11 22 33 44]
print("减法:", a - b)        # [-9 -18 -27 -36]
print("乘法:", a * b)        # [10 40 90 160]
print("除法:", b / a)        # [10. 10. 10. 10.]
print("幂运算:", a ** 2)     # [1 4 9 16]
print("整除:", b // a)       # [10 10 10 10]
print("取模:", b % a)        # [0 0 0 0]
```

### 标量运算

```python
arr = np.array([1, 2, 3, 4])

print("加5:", arr + 5)       # [6 7 8 9]
print("乘2:", arr * 2)       # [2 4 6 8]
print("平方:", arr ** 2)     # [1 4 9 16]
```

### 广播机制（Broadcasting）

广播允许不同形状的数组进行运算：

```python
# 二维数组 + 一维数组
matrix = np.array([[1, 2, 3], 
                   [4, 5, 6], 
                   [7, 8, 9]])
vector = np.array([10, 20, 30])

print("矩阵 + 向量:\n", matrix + vector)
# [[11 22 33]
#  [14 25 36]
#  [17 28 39]]

# 二维数组 + 标量
print("\n矩阵 + 100:\n", matrix + 100)
```

**广播规则：**
1. 如果两个数组维度数不同，小维度数组在前面补1
2. 如果某维度大小不同，其中一个必须为1
3. 从后往前逐个维度比较

### 统计函数

```python
arr = np.array([[1, 2, 3], 
                [4, 5, 6], 
                [7, 8, 9]])

print("总和:", np.sum(arr))           # 45
print("均值:", np.mean(arr))          # 5.0
print("标准差:", np.std(arr))         # 2.58
print("方差:", np.var(arr))           # 6.67
print("最小值:", np.min(arr))         # 1
print("最大值:", np.max(arr))         # 9
print("中位数:", np.median(arr))      # 5.0

# 按轴计算
print("\n每列的和:", np.sum(arr, axis=0))    # [12 15 18]
print("每行的和:", np.sum(arr, axis=1))      # [6 15 24]
print("每列的均值:", np.mean(arr, axis=0))   # [4. 5. 6.]
print("每行的均值:", np.mean(arr, axis=1))   # [2. 5. 8.]
```

### 其他数学函数

```python
arr = np.array([1, 4, 9, 16])

print("平方根:", np.sqrt(arr))        # [1. 2. 3. 4.]
print("自然对数:", np.log(arr))       # [0. 1.39 2.2 2.77]
print("指数:", np.exp(arr))           # [2.72 54.6 8103. ...]
print("正弦:", np.sin(arr))           # [0.84 -0.76 0.41 -0.29]
print("绝对值:", np.abs([-1, -2, 3])) # [1 2 3]
print("向上取整:", np.ceil([1.2, 2.5])) # [2. 3.]
print("向下取整:", np.floor([1.8, 2.5])) # [1. 2.]
print("四舍五入:", np.round([1.5, 2.4])) # [2. 2.]
```

---

## 2.6 数组变形

### reshape - 改变形状

```python
arr = np.arange(12)  # [0 1 2 3 4 5 6 7 8 9 10 11]

# 重塑为 3x4 矩阵
reshaped = arr.reshape(3, 4)
print("3x4矩阵:\n", reshaped)

# 重塑为 2x6 矩阵
reshaped2 = arr.reshape(2, 6)
print("\n2x6矩阵:\n", reshaped2)

# 自动推断维度（使用 -1）
reshaped3 = arr.reshape(4, -1)  # 4行，列数自动计算
print("\n4行矩阵:\n", reshaped3)
```

### flatten 和 ravel - 展平数组

```python
matrix = np.array([[1, 2, 3], 
                   [4, 5, 6]])

# flatten 返回副本
flat1 = matrix.flatten()
print("flatten:", flat1)  # [1 2 3 4 5 6]

# ravel 返回视图（更快）
flat2 = matrix.ravel()
print("ravel:", flat2)    # [1 2 3 4 5 6]
```

### transpose - 转置

```python
matrix = np.array([[1, 2, 3], 
                   [4, 5, 6]])

print("原矩阵:\n", matrix)
print("\n转置:\n", matrix.T)
# [[1 4]
#  [2 5]
#  [3 6]]

# 或使用 transpose 方法
transposed = np.transpose(matrix)
print("\ntranspose:\n", transposed)
```

### resize - 调整大小

```python
arr = np.array([1, 2, 3, 4, 5])

# 调整为新形状（可能重复或截断数据）
resized = np.resize(arr, (3, 3))
print("resize后:\n", resized)
# [[1 2 3]
#  [4 5 1]
#  [2 3 4]]
```

---

## 2.7 数组拼接与分割

### 拼接数组

```python
a = np.array([[1, 2], 
              [3, 4]])
b = np.array([[5, 6], 
              [7, 8]])

# 垂直拼接（沿行方向）
v_stack = np.vstack((a, b))
print("垂直拼接:\n", v_stack)
# [[1 2]
#  [3 4]
#  [5 6]
#  [7 8]]

# 水平拼接（沿列方向）
h_stack = np.hstack((a, b))
print("\n水平拼接:\n", h_stack)
# [[1 2 5 6]
#  [3 4 7 8]]

# 通用拼接函数
concat_v = np.concatenate((a, b), axis=0)  # 沿行
concat_h = np.concatenate((a, b), axis=1)  # 沿列
```

### 分割数组

```python
arr = np.arange(12).reshape(3, 4)
print("原数组:\n", arr)

# 垂直分割（按行）
v_split = np.vsplit(arr, 3)
print("\n垂直分割为3部分:")
for i, part in enumerate(v_split):
    print(f"第{i+1}部分:\n", part)

# 水平分割（按列）
h_split = np.hsplit(arr, 2)
print("\n水平分割为2部分:")
for i, part in enumerate(h_split):
    print(f"第{i+1}部分:\n", part)

# 通用分割函数
split_arr = np.split(np.arange(12), 3)  # 分成3份
print("\nsplit:", split_arr)
```

---

## 2.8 布尔索引与条件筛选

### 布尔索引

```python
arr = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

# 找出大于5的元素
mask = arr > 5
print("布尔掩码:", mask)
# [False False False False False  True  True  True  True  True]

print("大于5的元素:", arr[mask])
# [6 7 8 9 10]

# 直接使用条件
print("偶数:", arr[arr % 2 == 0])
# [2 4 6 8 10]

print("3到7之间:", arr[(arr >= 3) & (arr <= 7)])
# [3 4 5 6 7]
```

### where 函数

```python
arr = np.array([1, -2, 3, -4, 5, -6])

# 将负数替换为0
result = np.where(arr < 0, 0, arr)
print("负数替换为0:", result)
# [1 0 3 0 5 0]

# 条件赋值
grades = np.array([85, 92, 78, 65, 95])
labels = np.where(grades >= 90, '优秀', 
                  np.where(grades >= 80, '良好', '及格'))
print("成绩等级:", labels)
# ['良好' '优秀' '及格' '及格' '优秀']
```

### 高级筛选示例

```python
# 创建示例数据
data = np.random.randint(50, 100, size=(5, 3))
print("学生成绩:\n", data)

# 找出所有大于80的成绩
high_scores = data[data > 80]
print("\n高于80分的成绩:", high_scores)

# 找出每行的最高分
max_per_row = np.max(data, axis=1)
print("\n每个学生最高分:", max_per_row)

# 找出最高分的索引
max_indices = np.argmax(data, axis=1)
print("\n最高分科目索引:", max_indices)
```

---

## 本章小结

- 理解了 NumPy 的优势：速度快、内存效率高、功能强大
- 掌握了多种创建数组的方法：`array()`, `zeros()`, `ones()`, `arange()`, `linspace()`等
- 熟悉了数组的核心属性：`shape`, `dtype`, `ndim`, `size`
- 学会了数组索引与切片：基本索引、切片、花式索引
- 掌握了数组运算：算术运算、广播机制、统计函数
- 能够灵活变形数组：`reshape()`, `flatten()`, `transpose()`
- 学会拼接与分割数组：`vstack()`, `hstack()`, `vsplit()`, `hsplit()`
- 熟练使用布尔索引和条件筛选

> 下一步：进入第三章，学习 Pandas 数据处理核心！

---

## 练习题

### 练习 1：创建特殊数组

创建一个 5x5 的数组，满足以下条件：
- 边界元素为 1
- 内部元素为 0

```python
# 提示：先创建全1数组，再将内部设为0
arr = np.ones((5, 5))
arr[1:-1, 1:-1] = 0
print(arr)
```

### 练习 2：数组标准化

将一个数组标准化（均值为0，标准差为1）：

```python
arr = np.random.randn(100)  # 生成100个随机数
normalized = (arr - np.mean(arr)) / np.std(arr)
print("均值:", np.mean(normalized))  # 接近0
print("标准差:", np.std(normalized))  # 接近1
```

### 练习 3：矩阵运算

计算两个矩阵的点积：

```python
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

# 方法1：使用 dot
result1 = np.dot(A, B)

# 方法2：使用 @ 运算符
result2 = A @ B

print("点积结果:\n", result1)
```
