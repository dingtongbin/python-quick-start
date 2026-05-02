# 第11章：Web 安全

本章学习 Django 的 Web 安全防护措施和最佳实践。

---

## 11.1 CSRF 保护

```python
# 表单中
<form method="POST">
    {% csrf_token %}
    ...
</form>

# AJAX 请求
fetch('/api/endpoint/', {
    method: 'POST',
    headers: {
        'X-CSRFToken': getCookie('csrftoken')
    }
})
```

---

## 11.2 XSS 防护

```python
# 模板自动转义（默认开启）
{{ user_input }}  # 自动转义

# 禁用转义（谨慎使用）
{% autoescape off %}
    {{ safe_html }}
{% endautoescape %}

# 标记安全字符串
from django.utils.safestring import mark_safe
safe_html = mark_safe(html_string)
```

---

## 11.3 SQL 注入防护

```python
# ✅ 安全 - 使用 ORM
User.objects.filter(username=username)

# ❌ 危险 - 原始 SQL
cursor.execute(f"SELECT * FROM user WHERE username='{username}'")

# ✅ 安全 - 参数化查询
cursor.execute("SELECT * FROM user WHERE username=%s", [username])
```

---

## 11.4 点击劫持防护

```python
# settings.py
MIDDLEWARE = [
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

X_FRAME_OPTIONS = 'DENY'  # 或 'SAMEORIGIN'
```

---

## 11.5 密码安全

```python
# settings.py
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.Argon2PasswordHasher',
]

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {'min_length': 8}
    },
]
```

---

## 11.6 HTTPS 配置

```python
# settings.py
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
```

---

## 11.7 本章小结

✅ **CSRF** - 跨站请求伪造
✅ **XSS** - 跨站脚本
✅ **SQL 注入** - 参数化查询
✅ **点击劫持** - X-Frame-Options
✅ **密码安全** - 哈希算法
✅ **HTTPS** - 安全传输

---

**下一章：** [第12章 - 测试与调试 →](./12、测试与调试.md)
