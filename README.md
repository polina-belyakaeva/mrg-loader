# MRG Loader

Приложение для загрузки и просмотра данных МРГ.

## Требования

- Docker
- Docker Compose

## Быстрый старт

1. Клонируйте репозиторий:
```bash
git clone git@github.com:polina-belyakaeva/mrg-loader.git
cd mrg-loader
```

2. Запустите проект с помощью Docker Compose:
```bash
docker-compose up --build
```

3. Откройте приложение в браузере:
- Клиент: http://localhost
- API документация: http://localhost/api

## Структура проекта

```
packages/
├── client/          # React приложение
└── server/          # NestJS API
```

## Основные функции

- Загрузка данных из Excel файла
- Просмотр данных в таблице
- Отображение уровня загрузки с цветовой индикацией
- Просмотр графиков по данным

## Технологии

- Frontend: React, TypeScript, @tanstack/react-virtual
- Backend: NestJS, TypeScript, Prisma, PostgreSQL
- Инфраструктура: Docker, Docker Compose

## Разработка

Для локальной разработки:

1. Установите зависимости:
```bash
pnpm install
```

2. Запустите базу данных:
```bash
docker-compose up db
```

3. Запустите клиент:
```bash
pnpm nx serve client
```

4. Запустите сервер:
```bash
pnpm nx serve server
``` 