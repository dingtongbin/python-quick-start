# 第10章 探索性数据分析（EDA）

## 10.1 相关性分析：corr 与热力图绘制

在数据分析的江湖里，相关性分析就像是侦探手中的放大镜，能帮我们发现变量之间隐藏的关系。pandas 的 `corr()` 方法就是我们的第一把利器，它能快速计算数值列之间的相关系数。

### corr() 方法基础用法

```python
# 导入必要的库
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

# 创建示例数据
np.random.seed(42)  # 设置随机种子保证结果可重现
data = {
    '销售额': np.random.randint(1000, 10000, 100),
    '广告投入': np.random.randint(100, 1000, 100),
    '客户数量': np.random.randint(50, 500, 100),
    '产品评分': np.random.uniform(3.0, 5.0, 100)
}
df = pd.DataFrame(data)

# 计算相关系数矩阵
correlation_matrix = df.corr()
print("相关系数矩阵：")
print(correlation_matrix)
```

### 相关性分析方法表格

| 功能名称             | 调用方法                     | 具体功能与注意事项                   |
| -------------------- | ---------------------------- | ------------------------------------ |
| 计算皮尔逊相关系数   | `df.corr()`                  | 默认方法，衡量线性相关性，值域[-1,1] |
| 计算斯皮尔曼相关系数 | `df.corr(method='spearman')` | 衡量单调关系，对异常值更鲁棒         |
| 计算肯德尔相关系数   | `df.corr(method='kendall')`  | 基于排序的非参数方法，计算较慢但稳健 |

### 热力图可视化相关性

```python
# 设置中文字体支持（国内环境必备）
plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

# 创建热力图
plt.figure(figsize=(8, 6))
sns.heatmap(
    correlation_matrix,           # 相关系数矩阵
    annot=True,                  # 在格子中显示数值
    cmap='coolwarm',            # 颜色映射，蓝色负相关，红色正相关
    center=0,                    # 以0为中心的颜色分界
    square=True,                 # 使每个单元格为正方形
    fmt='.2f'                    # 数值格式，保留2位小数
)

plt.title('变量相关性热力图')
plt.tight_layout()
plt.show()
```

相关性分析帮助我们快速识别哪些变量之间存在强关联，为后续的特征选择和模型构建提供重要参考。记住，相关性不等于因果关系，这是数据分析的基本常识。

## 10.2 时间序列趋势分析与移动平均

时间序列分析是探索数据随时间变化规律的重要手段。移动平均则是平滑时间序列、消除噪声的经典方法，特别适合发现长期趋势。

### 时间序列数据准备

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# 创建时间序列数据
dates = pd.date_range('2023-01-01', periods=365, freq='D')
np.random.seed(42)
# 模拟带有趋势和季节性的销售数据
trend = np.linspace(100, 200, 365)  # 线性增长趋势
seasonal = 20 * np.sin(2 * np.pi * np.arange(365) / 365 * 4)  # 季节性波动
noise = np.random.normal(0, 10, 365)  # 随机噪声
sales = trend + seasonal + noise

ts_data = pd.Series(sales, index=dates)
```

### 移动平均计算与可视化

```python
# 计算不同窗口大小的移动平均
ts_data_ma7 = ts_data.rolling(window=7).mean()    # 7天移动平均
ts_data_ma30 = ts_data.rolling(window=30).mean()  # 30天移动平均

# 绘制原始数据和移动平均线
plt.figure(figsize=(12, 6))
plt.plot(ts_data.index, ts_data.values, alpha=0.3, label='原始数据')
plt.plot(ts_data_ma7.index, ts_data_ma7.values, label='7天移动平均', linewidth=2)
plt.plot(ts_data_ma30.index, ts_data_ma30.values, label='30天移动平均', linewidth=2)

plt.title('时间序列趋势分析 - 移动平均')
plt.xlabel('日期')
plt.ylabel('销售额')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()
```

### 时间序列分析方法表格

| 功能名称         | 调用方法                          | 具体功能与注意事项                 |
| ---------------- | --------------------------------- | ---------------------------------- |
| 简单移动平均     | `series.rolling(window=n).mean()` | 平滑短期波动，窗口越大越平滑       |
| 指数加权移动平均 | `series.ewm(span=n).mean()`       | 近期数据权重更大，对最新变化更敏感 |
| 移动标准差       | `series.rolling(window=n).std()`  | 衡量波动性，识别异常波动时期       |

### 指数加权移动平均示例

```python
# 计算指数加权移动平均
ts_data_ewm = ts_data.ewm(span=30).mean()

# 对比简单移动平均和指数加权移动平均
plt.figure(figsize=(12, 6))
plt.plot(ts_data.index[-100:], ts_data.values[-100:], alpha=0.5, label='原始数据')
plt.plot(ts_data_ma30.index[-100:], ts_data_ma30.values[-100:], label='30天简单移动平均')
plt.plot(ts_data_ewm.index[-100:], ts_data_ewm.values[-100:], label='30天指数加权移动平均')

plt.title('简单移动平均 vs 指数加权移动平均')
plt.xlabel('日期')
plt.ylabel('销售额')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()
```

时间序列趋势分析通过移动平均等技术帮助我们从噪声中提取有用信号，识别数据的长期走向。这对于业务预测、库存管理和资源规划都具有重要价值。

## 10.3 分组对比分析与交叉表

分组对比分析让我们能够从不同维度切片数据，发现群体间的差异和模式。交叉表（crosstab）则是分析两个或多个分类变量关系的强大工具。

### 分组对比分析基础

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# 创建示例数据
np.random.seed(42)
categories = ['A', 'B', 'C']
regions = ['北区', '南区', '东区', '西区']
data = []
for i in range(200):
    category = np.random.choice(categories)
    region = np.random.choice(regions)
    sales = np.random.normal(1000 if category == 'A' else (1500 if category == 'B' else 800), 200)
    data.append({'类别': category, '区域': region, '销售额': max(sales, 0)})

df = pd.DataFrame(data)
```

### 分组统计与可视化

```python
# 按类别分组计算平均销售额
category_sales = df.groupby('类别')['销售额'].mean()
print("各类别平均销售额：")
print(category_sales)

# 按区域和类别分组
region_category_sales = df.groupby(['区域', '类别'])['销售额'].mean().unstack()
print("\n区域-类别销售额交叉表：")
print(region_category_sales)

# 可视化分组对比
fig, axes = plt.subplots(1, 2, figsize=(12, 5))

# 类别对比柱状图
category_sales.plot(kind='bar', ax=axes[0], color=['skyblue', 'lightgreen', 'salmon'])
axes[0].set_title('各类别平均销售额对比')
axes[0].set_ylabel('平均销售额')
axes[0].tick_params(axis='x', rotation=0)

# 区域-类别热力图
im = axes[1].imshow(region_category_sales.values, cmap='YlOrRd', aspect='auto')
axes[1].set_xticks(range(len(region_category_sales.columns)))
axes[1].set_xticklabels(region_category_sales.columns)
axes[1].set_yticks(range(len(region_category_sales.index)))
axes[1].set_yticklabels(region_category_sales.index)
axes[1].set_title('区域-类别销售额热力图')

# 添加数值标签
for i in range(len(region_category_sales.index)):
    for j in range(len(region_category_sales.columns)):
        axes[1].text(j, i, f'{region_category_sales.iloc[i, j]:.0f}', 
                    ha='center', va='center')

plt.tight_layout()
plt.show()
```

### 交叉表分析方法表格

| 功能名称           | 调用方法                                                     | 具体功能与注意事项               |
| ------------------ | ------------------------------------------------------------ | -------------------------------- |
| 基础交叉表         | `pd.crosstab(df[col1], df[col2])`                            | 计算两个分类变量的频数交叉表     |
| 带数值汇总的交叉表 | `pd.crosstab(df[col1], df[col2], values=df[value_col], aggfunc='mean')` | 按分类变量分组计算数值列的统计量 |
| 百分比交叉表       | `pd.crosstab(df[col1], df[col2], normalize=True)`            | 显示相对频率而非绝对频数         |

### 交叉表示例

```python
# 创建分类数据用于交叉表
np.random.seed(42)
customer_data = pd.DataFrame({
    '客户类型': np.random.choice(['新客户', '老客户'], 1000, p=[0.3, 0.7]),
    '购买状态': np.random.choice(['已购买', '未购买'], 1000, p=[0.6, 0.4]),
    '满意度': np.random.choice(['满意', '一般', '不满意'], 1000)
})

# 基础交叉表
cross_tab = pd.crosstab(customer_data['客户类型'], customer_data['购买状态'])
print("客户类型与购买状态交叉表：")
print(cross_tab)

# 百分比交叉表
cross_tab_pct = pd.crosstab(customer_data['客户类型'], customer_data['购买状态'], normalize=True)
print("\n百分比交叉表：")
print(cross_tab_pct)

# 可视化交叉表
fig, axes = plt.subplots(1, 2, figsize=(12, 5))

cross_tab.plot(kind='bar', ax=axes[0])
axes[0].set_title('客户类型 vs 购买状态（频数）')
axes[0].set_ylabel('客户数量')
axes[0].legend(title='购买状态')

cross_tab_pct.plot(kind='bar', ax=axes[1])
axes[1].set_title('客户类型 vs 购买状态（百分比）')
axes[1].set_ylabel('比例')
axes[1].legend(title='购买状态')

plt.tight_layout()
plt.show()
```

分组对比分析和交叉表帮助我们深入理解不同群体的特征差异，为精准营销、用户细分和业务决策提供数据支撑。这种多维度的分析视角是探索性数据分析的核心组成部分。

## 10.4 异常检测与离群点识别方法

异常检测就像是数据世界里的"找不同"游戏，帮我们识别那些与众不同的数据点。这些离群点可能是错误数据，也可能是重要的业务信号。

### 基于统计的异常检测

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# 创建包含异常值的数据
np.random.seed(42)
normal_data = np.random.normal(100, 15, 1000)
outliers = np.array([200, 210, -50, -60])  # 人为添加异常值
data_with_outliers = np.concatenate([normal_data, outliers])

df = pd.DataFrame({'数值': data_with_outliers})
```

### Z-Score 方法检测异常

```python
# Z-Score 方法
def detect_outliers_zscore(data, threshold=3):
    """
    使用Z-Score方法检测异常值
    参数:
    data: 输入数据序列
    threshold: Z-Score阈值，默认3（对应99.7%置信区间）
    返回:
    异常值的布尔掩码
    """
    z_scores = np.abs((data - data.mean()) / data.std())
    return z_scores > threshold

# 应用Z-Score检测
zscore_outliers = detect_outliers_zscore(df['数值'])
print(f"Z-Score方法检测到 {zscore_outliers.sum()} 个异常值")

# IQR方法检测异常
def detect_outliers_iqr(data, factor=1.5):
    """
    使用IQR方法检测异常值
    参数:
    data: 输入数据序列
    factor: IQR倍数因子，默认1.5
    返回:
    异常值的布尔掩码
    """
    Q1 = data.quantile(0.25)
    Q3 = data.quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - factor * IQR
    upper_bound = Q3 + factor * IQR
    return (data < lower_bound) | (data > upper_bound)

iqr_outliers = detect_outliers_iqr(df['数值'])
print(f"IQR方法检测到 {iqr_outliers.sum()} 个异常值")
```

### 异常检测方法表格

| 功能名称         | 调用方法                           | 具体功能与注意事项                     |
| ---------------- | ---------------------------------- | -------------------------------------- |
| Z-Score检测      | 自定义函数或`scipy.stats.zscore`   | 假设数据正态分布，对非正态数据效果较差 |
| IQR检测          | 自定义函数基于四分位数             | 不依赖分布假设，对偏态数据更稳健       |
| Isolation Forest | `sklearn.ensemble.IsolationForest` | 基于树的无监督异常检测，适合高维数据   |

### 可视化异常检测结果

```python
# 创建可视化图表
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# 原始数据直方图
axes[0, 0].hist(df['数值'], bins=50, alpha=0.7, color='skyblue')
axes[0, 0].set_title('原始数据分布')
axes[0, 0].set_xlabel('数值')
axes[0, 0].set_ylabel('频数')

# 箱线图显示异常值
axes[0, 1].boxplot(df['数值'])
axes[0, 1].set_title('箱线图（自动显示异常值）')
axes[0, 1].set_ylabel('数值')

# Z-Score检测结果
axes[1, 0].scatter(range(len(df)), df['数值'], alpha=0.6, color='blue')
axes[1, 0].scatter(df[zscore_outliers].index, df[zscore_outliers]['数值'], 
                  color='red', s=50, label='异常值')
axes[1, 0].set_title('Z-Score异常检测结果')
axes[1, 0].set_xlabel('数据点索引')
axes[1, 0].set_ylabel('数值')
axes[1, 0].legend()

# IQR检测结果
axes[1, 1].scatter(range(len(df)), df['数值'], alpha=0.6, color='green')
axes[1, 1].scatter(df[iqr_outliers].index, df[iqr_outliers]['数值'], 
                  color='red', s=50, label='异常值')
axes[1, 1].set_title('IQR异常检测结果')
axes[1, 1].set_xlabel('数据点索引')
axes[1, 1].set_ylabel('数值')
axes[1, 1].legend()

plt.tight_layout()
plt.show()
```

### Isolation Forest 高级异常检测

```python
from sklearn.ensemble import IsolationForest

# 准备数据（需要二维数组）
X = df['数值'].values.reshape(-1, 1)

# 训练Isolation Forest模型
iso_forest = IsolationForest(contamination=0.05, random_state=42)
outlier_labels = iso_forest.fit_predict(X)

# -1表示异常值，1表示正常值
isoforest_outliers = outlier_labels == -1
print(f"Isolation Forest检测到 {isoforest_outliers.sum()} 个异常值")

# 可视化Isolation Forest结果
plt.figure(figsize=(10, 6))
plt.scatter(range(len(df)), df['数值'], c=np.where(isoforest_outliers, 'red', 'blue'), alpha=0.6)
plt.title('Isolation Forest异常检测结果')
plt.xlabel('数据点索引')
plt.ylabel('数值')
plt.show()
```

异常检测是数据质量控制和业务洞察发现的关键步骤。不同的方法适用于不同的场景：Z-Score适合正态分布数据，IQR对分布形状不敏感，而Isolation Forest则能处理复杂的高维数据。选择合适的方法需要结合数据特性和业务需求。