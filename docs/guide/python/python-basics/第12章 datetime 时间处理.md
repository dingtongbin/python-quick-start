### 12.1 datetime 对象创建

在 Python 中处理时间，我们最常打交道的就是 `datetime` 模块了。它属于标准库，不需要额外安装，开箱即用。`datetime` 模块里有个同名的类 `datetime`，专门用来表示具体的日期和时间（年、月、日、时、分、秒、微秒）。要创建一个 `datetime` 对象，最直接的方式就是手动指定这些时间组件。

下面这个表格列出了几种常用的创建方式：

| 功能名称          | 实例调用方法                                                 | 具体功能、注意事项、必需参数/可选参数                        |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 手动创建具体时间  | `datetime.datetime(year, month, day[, hour[, minute[, second[, microsecond]]]])` | 必需参数：year, month, day。其他都是可选的，默认为0。注意月份和日期不能超出范围，否则会抛出 `ValueError`。 |
| 获取当前本地时间  | `datetime.datetime.now()`                                    | 返回一个表示当前本地日期和时间的 `datetime` 对象。无参数。   |
| 获取当前 UTC 时间 | `datetime.datetime.now(timezone.utc)`                        | 推荐写法：返回一个表示当前世界协调时间（UTC）的 `datetime` 对象，带时区信息。需要导入 `timezone`。 |

现在，让我们通过代码来实际感受一下如何创建 `datetime` 对象。

```python
# 导入 datetime 模块中的 datetime 类和 timezone 类
from datetime import datetime, timezone

# 尝试手动创建一个 datetime 对象
try:
    # 创建一个代表 2026年5月4日 21:30:00 的对象
    # year, month, day 是必需参数
    specific_time = datetime(2026, 5, 4, 21, 30, 0)
    print(f"手动创建的时间: {specific_time}")
except ValueError as e:
    # 如果输入了无效的日期，比如 2月30日，会触发 ValueError
    print(f"创建时间失败，原因: {e}")

# 获取当前的本地时间
current_local_time = datetime.now()
print(f"当前本地时间: {current_local_time}")

# 获取当前的 UTC 时间（推荐写法）
current_utc_time = datetime.now(timezone.utc)
print(f"当前 UTC 时间: {current_utc_time}")
```

这段代码展示了三种基本的创建方式。记住，手动创建时一定要确保日期是合法的，比如你不能创建一个 `datetime(2026, 2, 30)`，因为2月没有30号，Python会毫不留情地抛出一个 `ValueError` 异常。所以，养成用 `try...except` 包裹的习惯是个好主意，尤其是在处理用户输入的时间时。

这节我们学习了如何使用 `datetime` 模块创建表示具体时刻的对象，包括手动指定时间和获取系统当前时间。这是进行任何时间相关操作的第一步，非常重要。

### 12.2 时间属性访问

一旦我们有了一个 `datetime` 对象，就像拿到了一个装满时间信息的百宝箱。我们可以轻松地从中取出年、月、日、时、分、秒等各个部分。这些信息都以只读属性的形式存在，使用起来非常直观。

下表总结了 `datetime` 对象的主要属性：

| 功能名称          | 实例调用方法      | 具体功能、注意事项、必需参数/可选参数                        |
| ----------------- | ----------------- | ------------------------------------------------------------ |
| 获取年份          | `dt.year`         | 返回一个整数，表示年份，例如 2026。                          |
| 获取月份          | `dt.month`        | 返回一个整数，表示月份（1-12）。                             |
| 获取日期          | `dt.day`          | 返回一个整数，表示当月的第几天（1-31）。                     |
| 获取小时          | `dt.hour`         | 返回一个整数，表示24小时制的小时（0-23）。                   |
| 获取分钟          | `dt.minute`       | 返回一个整数，表示分钟（0-59）。                             |
| 获取秒            | `dt.second`       | 返回一个整数，表示秒（0-59）。                               |
| 获取微秒          | `dt.microsecond`  | 返回一个整数，表示微秒（0-999999）。                         |
| 获取星期几        | `dt.weekday()`    | 返回一个整数，表示星期几（周一为0，周日为6）。这是一个方法，不是属性。 |
| 获取星期几（ISO） | `dt.isoweekday()` | 返回一个整数，表示星期几（周一为1，周日为7）。这也是一个方法。 |

让我们通过代码来访问这些属性。

```python
# 导入 datetime 模块
from datetime import datetime

# 创建一个具体的 datetime 对象作为示例
example_time = datetime(2026, 5, 4, 15, 30, 45, 123456)

# 访问各个时间属性
print(f"年份: {example_time.year}")        # 输出: 2026
print(f"月份: {example_time.month}")       # 输出: 5
print(f"日期: {example_time.day}")         # 输出: 4
print(f"小时: {example_time.hour}")        # 输出: 15
print(f"分钟: {example_time.minute}")      # 输出: 30
print(f"秒: {example_time.second}")        # 输出: 45
print(f"微秒: {example_time.microsecond}") # 输出: 123456

# 调用方法获取星期信息
# weekday() 方法，周一为0
print(f"星期几 (weekday, 周一=0): {example_time.weekday()}")  # 2026-05-04 是星期一，输出: 0

# isoweekday() 方法，周一为1
print(f"星期几 (isoweekday, 周一=1): {example_time.isoweekday()}") # 输出: 1
```

如你所见，访问这些属性就像是在和对象对话：“嘿，把你的年份告诉我！”、“把你的小时数给我看看！”。这种方式非常符合直觉，也是 Python 以人为本设计哲学的体现。通过这些属性，我们可以方便地对时间进行解析和格式化。

这节我们讲解了如何从一个 `datetime` 对象中提取出具体的年、月、日、时、分、秒等组成部分。掌握这些属性的访问方法，是进行时间格式化和逻辑判断的基础。

### 12.3 时间差计算（timedelta）

在实际开发中，我们经常需要计算两个时间点之间相差了多少天、多少小时，或者给某个时间点加上/减去一段时间。这时候，`timedelta` 对象就派上大用场了。你可以把它想象成一个“时间长度”或“时间间隔”的度量衡。

`timedelta` 对象表示两个 `datetime` 对象之间的差值。它本身也可以被创建，并用于与 `datetime` 对象进行加减运算。

下面是关于 `timedelta` 的常用操作：

| 功能名称     | 实例调用方法                                                 | 具体功能、注意事项、必需参数/可选参数                        |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 创建时间差   | `datetime.timedelta(days=0, seconds=0, microseconds=0, milliseconds=0, minutes=0, hours=0, weeks=0)` | 所有参数都是可选的，默认为0。可以组合使用，例如 `timedelta(days=1, hours=2)` 表示1天2小时。内部会统一转换为天、秒和微秒存储。 |
| 计算两时间差 | `dt1 - dt2`                                                  | 两个 `datetime` 对象相减，结果是一个 `timedelta` 对象。      |
| 时间点加减   | `dt + delta` 或 `dt - delta`                                 | `datetime` 对象可以和 `timedelta` 对象相加或相减，得到一个新的 `datetime` 对象。 |
| 获取总秒数   | `delta.total_seconds()`                                      | 返回 `timedelta` 对象表示的总时长，以浮点数秒为单位。        |

让我们通过代码来体验 `timedelta` 的强大功能。

```python
# 导入所需的类
from datetime import datetime, timedelta

# 创建两个 datetime 对象
start_time = datetime(2026, 5, 1, 10, 0, 0)
end_time = datetime(2026, 5, 4, 18, 30, 0)

# 计算两个时间点之间的差值
time_difference = end_time - start_time
print(f"从 {start_time} 到 {end_time} 相差: {time_difference}")
# 输出类似于: 3 days, 8:30:00

# 直接创建一个 timedelta 对象，表示 5 天 3 小时 30 分钟
custom_duration = timedelta(days=5, hours=3, minutes=30)
print(f"自定义的时间间隔: {custom_duration}")

# 给一个时间点加上这个时间间隔
future_time = start_time + custom_duration
print(f"{start_time} 加上 {custom_duration} 后是: {future_time}")

# 从一个时间点减去这个时间间隔
past_time = end_time - custom_duration
print(f"{end_time} 减去 {custom_duration} 后是: {past_time}")

# 获取时间差的总秒数
total_secs = time_difference.total_seconds()
print(f"时间差总共包含 {total_secs} 秒")
```

通过 `timedelta`，我们可以非常灵活地进行时间的算术运算。无论是计算项目周期、倒计时，还是处理日志中的时间戳，它都是不可或缺的工具。

这节我们学习了 `timedelta` 对象，它是表示时间间隔的核心工具。通过它可以轻松实现时间点的加减运算以及两个时间点之间差值的精确计算。

### 12.4 时间格式化输出

计算机内部存储的时间对我们人类来说并不友好，通常是一长串数字。为了让时间信息更易读、更符合我们的习惯，我们需要将 `datetime` 对象“翻译”成字符串。这个过程就叫**格式化**。反过来，将字符串“翻译”回 `datetime` 对象的过程叫**解析**，不过本节我们先专注于格式化。

Python 的 `datetime` 对象提供了一个强大的方法 `strftime()`（string format time），它可以根据我们提供的格式指令，生成各种样式的字符串。

下表列出了一些最常用的格式化指令：

| 功能名称         | 格式指令 | 说明与示例                       |
| ---------------- | -------- | -------------------------------- |
| 四位年份         | `%Y`     | 例如：2026                       |
| 两位年份         | `%y`     | 例如：26                         |
| 月份（数字）     | `%m`     | 01-12                            |
| 月份（英文缩写） | `%b`     | Jan, Feb, ..., Dec               |
| 月份（英文全称） | `%B`     | January, February, ..., December |
| 日期             | `%d`     | 01-31                            |
| 星期（英文缩写） | `%a`     | Mon, Tue, ..., Sun               |
| 星期（英文全称） | `%A`     | Monday, Tuesday, ..., Sunday     |
| 24小时制小时     | `%H`     | 00-23                            |
| 12小时制小时     | `%I`     | 01-12                            |
| 分钟             | `%M`     | 00-59                            |
| 秒               | `%S`     | 00-59                            |
| AM/PM            | `%p`     | AM or PM                         |

现在，让我们用代码来实践一下 `strftime` 方法。

```python
# 导入 datetime
from datetime import datetime

# 创建一个 datetime 对象
now = datetime(2026, 5, 4, 21, 15, 30)

# 使用 strftime 进行各种格式化
# 标准的年-月-日 时:分:秒 格式
standard_format = now.strftime("%Y-%m-%d %H:%M:%S")
print(f"标准格式: {standard_format}")  # 输出: 2026-05-04 21:15:30

# 更人性化的格式
friendly_format = now.strftime("%Y年%m月%d日 %A %H点%M分")
print(f"友好格式: {friendly_format}")  # 输出: 2026年05月04日 Monday 21点15分

# 简洁的日志格式
log_format = now.strftime("[%Y-%m-%d %H:%M:%S]")
print(f"日志格式: {log_format}")       # 输出: [2026-05-04 21:15:30]

# 带AM/PM的12小时制格式
twelve_hour_format = now.strftime("%Y-%m-%d %I:%M:%S %p")
print(f"12小时制格式: {twelve_hour_format}") # 输出: 2026-05-04 09:15:30 PM

# 错误处理：如果格式字符串中有非法指令会怎样？
try:
    bad_format = now.strftime("%Y-%m-%d %Q")  # %Q 不是一个有效的指令
except ValueError as e:
    print(f"格式化出错: {e}")
```

`strftime` 方法非常强大，几乎可以满足你所有的时间展示需求。只需要记住对应的格式指令，就能随心所欲地定制输出样式。这对于生成报告、记录日志或者向用户展示信息都至关重要。

这节我们掌握了使用 `strftime` 方法将 `datetime` 对象格式化为各种人类可读字符串的技巧。这是让程序输出更专业、更友好的关键一步。

### 12.5 时区处理初步

在实际应用中，我们经常需要处理不同时区的时间。Python 3.8 中可以使用 `timezone` 类来处理时区信息。

```python
from datetime import datetime, timezone, timedelta

# 创建带时区的时间
tz_beijing = timezone(timedelta(hours=8))
t = datetime(2025, 1, 1, 12, 0, 0, tzinfo=tz_beijing)
print(t)  # 2025-01-01 12:00:00+08:00

# 转换为其它时区
tz_newyork = timezone(timedelta(hours=-5))
t_newyork = t.astimezone(tz_newyork)
print(t_newyork)  # 2025-01-01 04:00:00-05:00
```

::: tip 提示
注意：Python 3.9 引入了 zoneinfo 标准库，在高于 3.8 的版本中可直接使用，此处以 3.8 可用的处理方式为例。
:::