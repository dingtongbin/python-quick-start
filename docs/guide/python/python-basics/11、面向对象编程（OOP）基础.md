# 第十一章：面向对象编程（OOP）基础

面向对象编程（Object-Oriented Programming，简称 OOP）是 Python 中一种重要的编程范式。它通过“类”和“对象”的概念，将数据和操作数据的方法组织在一起，提高代码的可重用性、可维护性和可扩展性。

------

## 11.1 类与对象的概念

- **类（Class）**：是对一类具有相同属性和行为的对象的抽象描述，可以看作是一个模板或蓝图。
- **对象（Object）**：是类的具体实例。一个类可以创建多个对象，每个对象拥有自己的状态（属性值），但共享类中定义的方法。

例如，“狗”是一个类，而“旺财”、“小白”则是该类的两个对象。

------

## 11.2 定义类与创建实例

在 Python 中，使用 `class` 关键字定义类。类名通常采用大驼峰命名法（PascalCase）。

```python
class Dog:
    pass

# 创建实例
dog1 = Dog()
dog2 = Dog()
```

上述代码定义了一个名为 `Dog` 的空类，并创建了两个实例 `dog1` 和 `dog2`。

------

## 11.3 实例属性与方法（`self` 的作用）

- **实例属性**：属于某个具体对象的变量，通常在 `__init__` 方法中初始化。
- **实例方法**：定义在类中的函数，第一个参数必须是 `self`，代表当前调用该方法的对象。

`self` 是 Python 自动传入的参数，用于访问对象自身的属性和其他方法。

```python
class Dog:
    def __init__(self, name):
        self.name = name  # 实例属性

    def bark(self):       # 实例方法
        print(f"{self.name} says woof!")
```

------

## 11.4 构造方法 `__init__`

`__init__` 是类的构造方法（也称初始化方法），在创建对象时自动调用，用于初始化对象的状态。

- 必须定义为 `def __init__(self, ...)`。
- 可以接受任意数量的位置参数和关键字参数。
- 不返回任何值（返回 `None`），其作用是设置初始状态。

```python
class Dog:
    def __init__(self, name, age=0):
        self.name = name
        self.age = age
```

------

## 11.5 封装简介（公有 vs 私有约定）

Python 没有严格的访问控制机制（如 `private`、`protected`），但通过命名约定实现封装：

| 命名形式 | 含义               | 访问建议           |
| -------- | ------------------ | ------------------ |
| `name`   | 公有属性/方法      | 可自由访问         |
| `_name`  | 受保护（内部使用） | 不建议外部直接访问 |
| `__name` | 私有（名称改写）   | 外部无法直接访问   |

> 注意：`__name` 会被 Python 解释器改写为 `_ClassName__name`，仍可通过此方式访问，但不推荐。

```python
class Dog:
    def __init__(self, name):
        self.name = name          # 公有
        self._age = 0             # 受保护
        self.__secret = "bone"    # 私有

    def get_secret(self):
        return self.__secret      # 内部可访问
```

------

## 示例：完整使用示例

以下是一个完整的面向对象示例，包含错误处理和注释说明：

```python
class BankAccount:
    """
    银行账户类，演示 OOP 基础用法。
    """

    def __init__(self, owner: str, initial_balance: float = 0.0):
        """
        初始化账户。
        :param owner: 账户持有人姓名（字符串）
        :param initial_balance: 初始余额（浮点数，默认为 0.0）
        :raises ValueError: 如果初始余额为负数
        """
        if initial_balance < 0:
            raise ValueError("初始余额不能为负数")
        self.owner = owner
        self.__balance = initial_balance  # 私有属性，防止外部直接修改

    def deposit(self, amount: float) -> None:
        """
        存款方法。
        :param amount: 存款金额（必须为正数）
        :raises ValueError: 如果存款金额非正
        """
        if amount <= 0:
            raise ValueError("存款金额必须大于 0")
        self.__balance += amount

    def withdraw(self, amount: float) -> None:
        """
        取款方法。
        :param amount: 取款金额（必须为正数且不超过余额）
        :raises ValueError: 如果取款金额无效或余额不足
        """
        if amount <= 0:
            raise ValueError("取款金额必须大于 0")
        if amount > self.__balance:
            raise ValueError("余额不足")
        self.__balance -= amount

    def get_balance(self) -> float:
        """
        获取当前余额（只读接口）。
        :return: 当前余额
        """
        return self.__balance


# 使用示例
if __name__ == "__main__":
    try:
        # 创建账户
        account = BankAccount("Alice", 100.0)

        # 存款
        account.deposit(50.0)

        # 取款
        account.withdraw(30.0)

        # 打印余额
        print(f"当前余额: {account.get_balance()}")  # 输出: 当前余额: 120.0

        # 尝试非法操作
        account.withdraw(200.0)  # 将抛出 ValueError

    except ValueError as e:
        print(f"操作失败: {e}")
```

------

## 整体调用注意事项

- **`self` 参数**：所有实例方法的第一个参数必须是 `self`，调用时无需手动传入。

- **私有属性访问**：不要尝试通过 `_ClassName__attribute` 方式绕过封装，这会破坏设计意图。

- **异常处理**：在涉及状态变更的方法中（如存款、取款），应主动校验输入并抛出合适的异常。

- 返回值类型：

  - 构造方法 `__init__` 不返回值（隐式返回 `None`）。
  - 属性访问方法（如 `get_balance`）应明确返回类型，便于类型提示和调试。
  
- **可变默认参数**：避免在 `__init__` 中使用可变对象（如列表、字典）作为默认参数，应使用 `None` 并在方法内初始化。

------