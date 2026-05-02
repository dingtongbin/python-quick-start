# 第10章：Celery 异步任务

本章学习如何使用 Celery 处理异步任务、定时任务和分布式任务队列。

---

## 10.1 安装与配置

```bash
pip install celery==5.3.6
pip install redis==5.0.8  # 作为 broker
```

### 配置

```python
# settings.py
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/1'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'Asia/Shanghai'
```

### 创建 Celery 应用

```python
# myproject/celery.py
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')

app = Celery('myproject')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# myproject/__init__.py
from .celery import app as celery_app
__all__ = ('celery_app',)
```

---

## 10.2 定义任务

```python
# tasks.py
from celery import shared_task
from django.core.mail import send_mail

@shared_task
def send_email(subject, message, recipient_list):
    send_mail(
        subject,
        message,
        'from@example.com',
        recipient_list,
    )
    return f'Email sent to {len(recipient_list)} recipients'

@shared_task(bind=True, max_retries=3)
def process_data(self, data_id):
    try:
        # 处理数据
        pass
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)
```

---

## 10.3 调用任务

```python
# 延迟执行
send_email.delay('Subject', 'Message', ['user@example.com'])

# 指定时间执行
from datetime import timedelta
send_email.apply_async(
    args=['Subject', 'Message', ['user@example.com']],
    eta=timezone.now() + timedelta(hours=1)
)

# 获取结果
result = send_email.delay(...)
print(result.status)
print(result.get(timeout=10))
```

---

## 10.4 定时任务

```python
# settings.py
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'cleanup-every-day': {
        'task': 'blog.tasks.cleanup_old_posts',
        'schedule': crontab(hour=0, minute=0),
    },
    'send-digest-every-week': {
        'task': 'blog.tasks.send_weekly_digest',
        'schedule': crontab(day_of_week=1, hour=8),
    },
}
```

---

## 10.5 运行 Celery

```bash
# Worker
celery -A myproject worker --loglevel=info

# Beat（定时任务）
celery -A myproject beat --loglevel=info

# Flower（监控）
pip install flower
celery -A myproject flower --port=5555
```

---

## 10.6 本章小结

✅ **Celery 配置** - Broker、Backend
✅ **任务定义** - shared_task
✅ **任务调用** - delay、apply_async
✅ **定时任务** - Celery Beat
✅ **监控** - Flower

---

**下一章：** [第11章 - Web 安全 →](./11、Web安全.md)
