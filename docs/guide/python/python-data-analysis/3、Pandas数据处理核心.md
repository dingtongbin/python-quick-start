# 第三章：Pandas 数据处理核心

Pandas 是 Python 最流行的数据分析库，提供了高效、灵活的数据结构来处理结构化数据。本章将带你掌握 Pandas 的核心功能。

---

## 3.1 Pandas 简介与数据结构概览

### 什么是 Pandas？

Pandas（Python Data Analysis Library）是基于 NumPy 构建的数据分析工具，提供了两种核心数据结构：

1. **Series**：一维带标签的数组
2. **DataFrame**：二维表格型数据结构（类似 Excel 或 SQL 表）

### 为什么使用 Pandas？

- **强大的数据读写能力**：支持 CSV、Excel、SQL、JSON 等多种格式
- **灵活的数据清洗**：处理缺失值、重复值、异常值
- **高效的数据转换**：分组、聚合、透视、合并
- **时间序列支持**：专门的时间序列处理功能
- **与生态系统集成**：无缝对接 NumPy、Matplotlib、Scikit-learn

### 安装与导入

```python
# 如果未安装
# pip install pandas

import pandas as pd
import numpy as np

print(f"Pandas version: {pd.__version__}")
```

---

## 3.2 Series 系列

### 创建 Series

```python
import pandas as pd

# 从列表创建
s1 = pd.Series([1, 2, 3, 4, 5])
print("从列表创建:\n", s1)

# 指定索引
s2 = pd.Series([10, 20, 30], index=['a', 'b', 'c'])
print("\n指定索引:\n", s2)

# 从字典创建
data = {'苹果': 5, '香蕉': 3, '橙子': 8}
s3 = pd.Series(data)
print("\n从字典创建:\n", s3)

# 从标量创建
s4 = pd.Series(10, index=['x', 'y', 'z'])
print("\n从标量创建:\n", s4)
```

### Series 属性

```python
s = pd.Series([10, 20, 30, 40, 50], index=['a', 'b', 'c', 'd', 'e'])

print("值:", s.values)           # [10 20 30 40 50]
print("索引:", s.index)          # Index(['a', 'b', 'c', 'd', 'e'])
print("数据类型:", s.dtype)      # int64
print("形状:", s.shape)          # (5,)
print("维度:", s.ndim)           # 1
print("元素个数:", s.size)       # 5
```

### 访问 Series 元素

```python
s = pd.Series([10, 20, 30, 40, 50], index=['a', 'b', 'c', 'd', 'e'])

# 通过索引标签
print(s['a'])     # 10
print(s[['a', 'c']])  # 多个元素

# 通过位置
print(s[0])       # 10
print(s.iloc[0])  # 10（推荐）

# 切片
print(s['a':'c'])    # 包含末尾
print(s.iloc[0:3])   # 不包含末尾
```

### Series 运算

```python
s1 = pd.Series([1, 2, 3, 4], index=['a', 'b', 'c', 'd'])
s2 = pd.Series([10, 20, 30, 40], index=['a', 'b', 'c', 'd'])

print("加法:\n", s1 + s2)
print("\n乘法:\n", s1 * 2)
print("\n统计:\n")
print("总和:", s1.sum())
print("均值:", s1.mean())
print("最大值:", s1.max())
```

---

## 3.3 DataFrame 数据框

### 创建 DataFrame

```python
import pandas as pd

# 方法1：从字典创建
data = {
    '姓名': ['张三', '李四', '王五'],
    '年龄': [25, 30, 35],
    '城市': ['北京', '上海', '广州']
}
df1 = pd.DataFrame(data)
print("从字典创建:\n", df1)

# 方法2：从列表嵌套创建
data2 = [
    ['张三', 25, '北京'],
    ['李四', 30, '上海'],
    ['王五', 35, '广州']
]
df2 = pd.DataFrame(data2, columns=['姓名', '年龄', '城市'])
print("\n从列表创建:\n", df2)

# 方法3：从 CSV 文件创建（最常用）
# df3 = pd.read_csv('data.csv')

# 方法4：从 Excel 文件创建
# df4 = pd.read_excel('data.xlsx')
```

### 查看数据

```python
# 创建示例 DataFrame
data = {
    '产品': ['电脑', '手机', '平板', '耳机', '键盘'],
    '价格': [5999, 3999, 2999, 299, 199],
    '销量': [100, 500, 300, 1000, 800],
    '库存': [50, 200, 150, 500, 400]
}
df = pd.DataFrame(data)

# 前几行
print("前3行:\n", df.head(3))

# 后几行
print("\n后2行:\n", df.tail(2))

# 基本信息
print("\n数据信息:")
df.info()

# 统计摘要
print("\n统计摘要:\n", df.describe())

# 形状
print("\n形状:", df.shape)  # (5, 4)

# 列名
print("\n列名:", df.columns.tolist())

# 索引
print("\n索引:", df.index.tolist())
```

### 选择数据

```python
# 选择单列（返回 Series）
print("产品名称:\n", df['产品'])
print("\n类型:", type(df['产品']))  # <class 'pandas.core.series.Series'>

# 选择多列（返回 DataFrame）
print("\n价格和销量:\n", df[['价格', '销量']])

# 使用 loc（基于标签）
print("\n第0行:\n", df.loc[0])
print("\n第0到2行，产品和价格列:\n", df.loc[0:2, ['产品', '价格']])

# 使用 iloc（基于位置）
print("\n第0行:\n", df.iloc[0])
print("\n前3行，前2列:\n", df.iloc[:3, :2])

# 条件筛选
print("\n价格大于1000的产品:\n", df[df['价格'] > 1000])
print("\n销量大于500且库存小于300:\n", df[(df['销量'] > 500) & (df['库存'] < 300)])
```

### 添加和删除列

```python
# 添加新列
df['销售额'] = df['价格'] * df['销量']
print("添加销售额列:\n", df)

# 添加计算列
df['单价等级'] = df['价格'].apply(lambda x: '高价' if x > 3000 else '低价')
print("\n添加等级列:\n", df)

# 删除列
df_drop = df.drop('单价等级', axis=1)
print("\n删除列后:\n", df_drop)

# 删除行
df_drop_row = df.drop(0)  # 删除索引为0的行
print("\n删除第0行:\n", df_drop_row)
```

---

## 3.4 数据读取与写入

### 读取 CSV 文件

```python
# 基本读取
df = pd.read_csv('data.csv')

# 常用参数
df = pd.read_csv('data.csv',
                 encoding='utf-8',        # 编码
                 sep=',',                  # 分隔符
                 header=0,                 # 表头行
                 index_col=None,           # 索引列
                 usecols=['列1', '列2'],   # 只读取指定列
                 nrows=100,                # 只读前100行
                 na_values=['NA', 'null']  # 缺失值标识
                )

# 查看编码问题
import chardet
with open('data.csv', 'rb') as f:
    result = chardet.detect(f.read())
    print(f"文件编码: {result['encoding']}")
```

### 写入 CSV 文件

```python
# 基本写入
df.to_csv('output.csv', index=False)  # 不保存索引

# 常用参数
df.to_csv('output.csv',
          index=False,            # 不保存索引
          encoding='utf-8-sig',   # 编码（Windows Excel友好）
          sep=',',                # 分隔符
          columns=['列1', '列2'], # 只保存指定列
          header=True             # 保存表头
         )
```

### 读取 Excel 文件

```python
# 需要安装 openpyxl: pip install openpyxl

# 读取第一个工作表
df = pd.read_excel('data.xlsx', sheet_name='Sheet1')

# 读取所有工作表
sheets = pd.read_excel('data.xlsx', sheet_name=None)
for name, data in sheets.items():
    print(f"工作表: {name}")
    print(data.head())
```

### 写入 Excel 文件

```python
# 单个工作表
df.to_excel('output.xlsx', index=False, sheet_name='数据')

# 多个工作表
with pd.ExcelWriter('output.xlsx') as writer:
    df1.to_excel(writer, sheet_name='数据1', index=False)
    df2.to_excel(writer, sheet_name='数据2', index=False)
```

### 读取和写入 JSON

```python
# 读取 JSON
df = pd.read_json('data.json')

# 写入 JSON
df.to_json('output.json', orient='records', force_ascii=False)
```

### 读取 SQL 数据库

```python
import sqlite3

# 连接数据库
conn = sqlite3.connect('database.db')

# 读取 SQL 查询结果
query = "SELECT * FROM users WHERE age > 25"
df = pd.read_sql_query(query, conn)

# 写入数据库
df.to_sql('new_table', conn, if_exists='replace', index=False)

# 关闭连接
conn.close()
```

---

## 3.5 数据清洗

### 处理缺失值

```python
# 创建含缺失值的 DataFrame
import numpy as np

data = {
    'A': [1, 2, np.nan, 4, 5],
    'B': [np.nan, 2, 3, 4, np.nan],
    'C': [1, 2, 3, 4, 5]
}
df = pd.DataFrame(data)
print("原始数据:\n", df)

# 检测缺失值
print("\n缺失值统计:\n", df.isnull().sum())
print("\n是否有缺失值:", df.isnull().any().any())

# 删除缺失值
df_drop = df.dropna()  # 删除任何含缺失值的行
print("\n删除缺失值后:\n", df_drop)

df_drop_col = df.dropna(axis=1)  # 删除含缺失值的列
print("\n删除缺失列后:\n", df_drop_col)

# 填充缺失值
df_fill = df.fillna(0)  # 用0填充
print("\n用0填充:\n", df_fill)

df_fill_mean = df.fillna(df.mean())  # 用均值填充
print("\n用均值填充:\n", df_fill_mean)

# 向前/向后填充
df_ffill = df.fillna(method='ffill')  # 向前填充
df_bfill = df.fillna(method='bfill')  # 向后填充
```

### 删除重复值

```python
# 创建含重复值的 DataFrame
data = {
    '姓名': ['张三', '李四', '张三', '王五', '李四'],
    '年龄': [25, 30, 25, 35, 30],
    '城市': ['北京', '上海', '北京', '广州', '上海']
}
df = pd.DataFrame(data)
print("原始数据:\n", df)

# 检测重复值
print("\n重复值:\n", df.duplicated())

# 删除重复值
df_unique = df.drop_duplicates()
print("\n去重后:\n", df_unique)

# 基于特定列去重
df_unique_subset = df.drop_duplicates(subset=['姓名'])
print("\n按姓名去重:\n", df_unique_subset)
```

### 数据类型转换

```python
# 创建示例数据
df = pd.DataFrame({
    '日期': ['2024-01-01', '2024-01-02', '2024-01-03'],
    '价格': ['100.5', '200.3', '300.7'],
    '数量': ['10', '20', '30']
})

print("原始数据类型:\n", df.dtypes)

# 转换类型
df['日期'] = pd.to_datetime(df['日期'])
df['价格'] = df['价格'].astype(float)
df['数量'] = df['数量'].astype(int)

print("\n转换后数据类型:\n", df.dtypes)
```

### 字符串清洗

```python
# 创建示例数据
df = pd.DataFrame({
    '姓名': [' 张三 ', '李四 ', ' 王五'],
    '电话': ['138-0000-0001', '13800000002', '138 0000 0003'],
    '邮箱': ['USER@EMAIL.COM', 'user@email.com', 'User@Email.Com']
})

# 去除空格
df['姓名'] = df['姓名'].str.strip()

# 统一格式
df['电话'] = df['电话'].str.replace('-', '').str.replace(' ', '')
df['邮箱'] = df['邮箱'].str.lower()

print("清洗后:\n", df)
```

---

## 3.6 数据转换

### 添加和删除列

```python
df = pd.DataFrame({
    '产品': ['电脑', '手机', '平板'],
    '价格': [5999, 3999, 2999],
    '销量': [100, 500, 300]
})

# 添加计算列
df['销售额'] = df['价格'] * df['销量']

# 添加条件列
df['等级'] = df['价格'].apply(lambda x: '高端' if x > 5000 else '中端')

# 删除列
df = df.drop('等级', axis=1)

print(df)
```

### 重命名列

```python
df = pd.DataFrame({
    'old_name1': [1, 2, 3],
    'old_name2': [4, 5, 6]
})

# 重命名单个列
df = df.rename(columns={'old_name1': 'new_name1'})

# 重命名多个列
df = df.rename(columns={'old_name1': '新名称1', 'old_name2': '新名称2'})

print(df)
```

### apply 函数

```python
df = pd.DataFrame({
    '姓名': ['张三', '李四', '王五'],
    '分数': [85, 92, 78]
})

# 对列应用函数
df['等级'] = df['分数'].apply(lambda x: '优秀' if x >= 90 else '良好' if x >= 80 else '及格')

# 对行应用函数
def 综合评估(row):
    return f"{row['姓名']}的分数是{row['分数']}，等级是{row['等级']}"

df['评估'] = df.apply(综合评估, axis=1)

print(df)
```

### map 函数

```python
df = pd.DataFrame({
    '城市代码': ['BJ', 'SH', 'GZ', 'SZ'],
    '人口': [2000, 2500, 1500, 1300]
})

# 映射城市名称
city_map = {
    'BJ': '北京',
    'SH': '上海',
    'GZ': '广州',
    'SZ': '深圳'
}

df['城市名称'] = df['城市代码'].map(city_map)
print(df)
```

---

## 3.7 数据合并

### concat - 连接

```python
# 创建示例 DataFrame
df1 = pd.DataFrame({
    'A': ['A0', 'A1', 'A2'],
    'B': ['B0', 'B1', 'B2']
})

df2 = pd.DataFrame({
    'A': ['A3', 'A4', 'A5'],
    'B': ['B3', 'B4', 'B5']
})

# 垂直连接（增加行）
result_v = pd.concat([df1, df2], axis=0, ignore_index=True)
print("垂直连接:\n", result_v)

# 水平连接（增加列）
df3 = pd.DataFrame({
    'C': ['C0', 'C1', 'C2'],
    'D': ['D0', 'D1', 'D2']
})

result_h = pd.concat([df1, df3], axis=1)
print("\n水平连接:\n", result_h)
```

### merge - 合并（类似 SQL JOIN）

```python
# 创建示例 DataFrame
df_left = pd.DataFrame({
    '员工ID': [1, 2, 3, 4],
    '姓名': ['张三', '李四', '王五', '赵六'],
    '部门': ['技术部', '销售部', '技术部', '人事部']
})

df_right = pd.DataFrame({
    '员工ID': [1, 2, 3, 5],
    '工资': [8000, 9000, 8500, 7500],
    '入职年份': [2020, 2019, 2021, 2022]
})

# 内连接（默认）- 只保留两边都有的
inner = pd.merge(df_left, df_right, on='员工ID', how='inner')
print("内连接:\n", inner)

# 左连接 - 保留左表所有记录
left = pd.merge(df_left, df_right, on='员工ID', how='left')
print("\n左连接:\n", left)

# 右连接 - 保留右表所有记录
right = pd.merge(df_left, df_right, on='员工ID', how='right')
print("\n右连接:\n", right)

# 外连接 - 保留所有记录
outer = pd.merge(df_left, df_right, on='员工ID', how='outer')
print("\n外连接:\n", outer)
```

### join - 基于索引合并

```python
df1 = pd.DataFrame({
    'A': ['A1', 'A2', 'A3']
}, index=[1, 2, 3])

df2 = pd.DataFrame({
    'B': ['B1', 'B2', 'B3']
}, index=[1, 2, 3])

result = df1.join(df2)
print("基于索引合并:\n", result)
```

---

## 本章小结

- 掌握了 Series 和 DataFrame 两种核心数据结构
- 学会创建 DataFrame：从字典、列表、CSV、Excel 等
- 能够查看和探索数据：`head()`, `info()`, `describe()`
- 熟练使用数据选择：`loc`, `iloc`, 条件筛选
- 掌握数据读写：CSV、Excel、JSON、SQL
- 能够清洗数据：处理缺失值、重复值、类型转换
- 学会数据转换：添加列、重命名、apply、map
- 掌握数据合并：`concat()`, `merge()`, `join()`

> 下一步：进入第四章，学习数据分组与聚合！

---

## 练习题

### 练习 1：学生成绩分析

创建一个学生成绩 DataFrame，并完成以下任务：

```python
import pandas as pd

# 创建数据
data = {
    '姓名': ['张三', '李四', '王五', '赵六', '钱七'],
    '数学': [85, 92, 78, 95, 88],
    '英语': [90, 85, 92, 88, 95],
    '语文': [88, 90, 85, 92, 90]
}
df = pd.DataFrame(data)

# 1. 计算每个学生的平均分
df['平均分'] = df[['数学', '英语', '语文']].mean(axis=1)

# 2. 找出平均分最高的学生
best_student = df.loc[df['平均分'].idxmax()]
print("最高分学生:", best_student['姓名'])

# 3. 计算每门课的平均分
subject_avg = df[['数学', '英语', '语文']].mean()
print("\n各科平均分:\n", subject_avg)
```

### 练习 2：销售数据清洗

```python
# 假设有一个含缺失值和重复值的销售数据
df = pd.DataFrame({
    '订单ID': [1, 2, 2, 3, 4, None],
    '产品': ['A', 'B', 'B', 'C', None, 'E'],
    '金额': [100, 200, 200, None, 400, 500]
})

# 1. 删除重复值
df = df.drop_duplicates()

# 2. 删除缺失值
df = df.dropna()

# 3. 重置索引
df = df.reset_index(drop=True)

print("清洗后的数据:\n", df)
```
