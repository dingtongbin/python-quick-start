# 第15章：Docker 部署

本章学习如何使用 Docker 容器化部署 Django 应用。

---

## 15.1 Dockerfile

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "myproject.wsgi:application", "--bind", "0.0.0.0:8000"]
```

---

## 15.2 docker-compose.yml

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=mysql://root:password@db:3306/mydb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: mydb
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:7-alpine

volumes:
  mysql_data:
```

---

## 15.3 运行

```bash
docker-compose up -d
docker-compose logs -f
```

---

## 15.4 本章小结

✅ **Dockerfile** - 镜像构建
✅ **docker-compose** - 多容器编排
✅ **数据卷** - 持久化存储

---

**下一章：** [第16章 - 实战项目 →](./16、实战项目.md)
