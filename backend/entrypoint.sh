#!/bin/sh
echo "......"

while ! nc -z $DATABASE_HOST $DATABASE_PORT; do
  sleep 1
done

echo "Rodando migrations..."
uv run python manage.py migrate

echo "Iniciando servidor with gunicorn -> Uvicorn..."

uv run gunicorn config.asgi:application -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000