# Дед&Жара — сайт банного мастера

Продающий одностраничник личного бренда пармастера **Сергея Аперина** (Балахна · Нижний Новгород) с рабочей формой заявки, уведомлениями в Telegram и мини-CRM для приёма записей.

**Стек:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Prisma 7 · SQLite (по умолчанию) / PostgreSQL · Zod.

---

## Содержание

1. [Что внутри](#что-внутри)
2. [Требования](#требования)
3. [Быстрый старт (локально за 2 минуты)](#быстрый-старт)
4. [Переменные окружения](#переменные-окружения)
5. [База данных: SQLite и PostgreSQL](#база-данных)
6. [Telegram-бот: токен и chat_id](#telegram-бот)
7. [Мини-CRM /admin](#мини-crm-admin)
8. [Как заменить фото и видео](#фото-и-видео)
9. [Где менять тексты и контакты](#тексты-и-контакты)
10. [Деплой на Vercel](#деплой-на-vercel)
11. [Деплой на VPS через Docker](#деплой-на-vps-через-docker)
12. [Чеклист плейсхолдеров перед запуском](#чеклист-плейсхолдеров)
13. [Структура проекта](#структура-проекта)

---

## Что внутри

- Атмосферный тёмный дизайн «Пар и дуб»: своя палитра, шрифты с кириллицей (Cormorant + Golos Text), анимации, зерно, параллакс.
- Секции: герой, услуги, как проходит сеанс, о мастере, польза, выезды/экспедиции, галерея с лайтбоксом и видео, отзывы, FAQ, контакты с формой.
- **Форма заявки** → серверная валидация (Zod) → запись в БД → уведомление в Telegram (+ опционально e-mail). Honeypot и rate-limit от спама.
- **Мини-CRM `/admin`**: таблица заявок, смена статуса, фильтры, поиск, экспорт в CSV, счётчики.
- SEO: метаданные, Open Graph, JSON-LD (LocalBusiness + Person), `sitemap.xml`, `robots.txt`, OG-картинка, брендовый favicon.
- Доступность: семантика, фокус, контраст, уважение к `prefers-reduced-motion`.

---

## Требования

- **Node.js 20+** (проверено на Node 24) и npm.
- Больше ничего: база по умолчанию — файловый SQLite, никаких серверов поднимать не нужно.

---

## Быстрый старт

```bash
# 1. Установить зависимости (заодно сгенерируется Prisma Client)
npm install

# 2. Проверить .env
#    Файл .env уже создан и заполнен для мгновенного локального запуска (SQLite).
#    Логин/пароль админки: admin / ded-zhara-2026 (смени перед деплоем!).
#    Если .env отсутствует (например, после git clone) — создай из примера:
#      cp .env.example .env

# 3. Создать таблицы в базе (SQLite-файл dev.db появится сам)
npm run db:push

# 4. Запустить
npm run dev
```

Открой **http://localhost:3000** — сайт.
Админка: **http://localhost:3000/admin** (логин/пароль из `.env`).

Продакшен-сборка локально:

```bash
npm run build
npm start
```

---

## Переменные окружения

Все секреты — только в `.env` (он в `.gitignore`, в репозиторий не попадает). Шаблон — в `.env.example`.

| Переменная | Зачем | Обязательна |
|---|---|---|
| `DATABASE_URL` | Строка подключения к БД. По умолчанию `file:./dev.db` (SQLite). | да |
| `TELEGRAM_BOT_TOKEN` | Токен бота от @BotFather для уведомлений. | для уведомлений |
| `TELEGRAM_CHAT_ID` | Куда слать заявки (ваш chat_id или id группы). | для уведомлений |
| `ADMIN_USER` | Логин в `/admin`. | да |
| `ADMIN_PASSWORD` | Пароль в `/admin`. | да |
| `ADMIN_SESSION_SECRET` | Длинная случайная строка для подписи cookie-сессии. | да |
| `NOTIFY_EMAIL` | Дублировать заявки на почту (пусто = выключено). | нет |
| `NEXT_PUBLIC_SITE_URL` | Публичный адрес сайта для OG/sitemap/canonical. | для прода |

> Если Telegram не настроен — заявки **всё равно сохраняются в БД**, просто без уведомления. Заявку потерять нельзя.

Сгенерировать надёжный `ADMIN_SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## База данных

Проект использует **Prisma 7** с driver-адаптерами.

### По умолчанию — SQLite (ноль настройки)

Уже настроено. `DATABASE_URL="file:./dev.db"`, схема — `prisma/schema.prisma` (`provider = "sqlite"`).
Применить схему / обновить таблицы:

```bash
npm run db:push        # создать/обновить таблицы
npm run db:studio      # визуальный просмотр БД (Prisma Studio)
```

### Переключение на PostgreSQL (для прода / Vercel)

Бесплатный Postgres дают [Neon](https://neon.tech) и [Supabase](https://supabase.com).

1. **`prisma/schema.prisma`** — поменяй провайдер:
   ```prisma
   datasource db {
     provider = "postgresql"
   }
   ```
2. **`.env`** — вставь строку подключения:
   ```
   DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
   ```
3. **Поставь Postgres-адаптер и подмени его в `src/lib/db.ts`:**
   ```bash
   npm install @prisma/adapter-pg pg
   npm install -D @types/pg
   ```
   В `src/lib/db.ts` замени блок адаптера (там есть подробный комментарий-инструкция):
   ```ts
   import { PrismaPg } from "@prisma/adapter-pg";
   const adapter = new PrismaPg({ connectionString: databaseUrl });
   ```
4. **Сгенерируй клиент и применяй схему:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

> В Prisma 7 строка подключения для миграций берётся из `prisma.config.ts` (`datasource.url`), а для рантайма — из адаптера в `src/lib/db.ts`. При переключении правим оба места; обе берут значение из одного `DATABASE_URL`.

---

## Telegram-бот

### 1. Создать бота и получить токен

1. Напиши [@BotFather](https://t.me/BotFather) → команда `/newbot`.
2. Задай имя и username бота. BotFather пришлёт **токен** вида `123456789:AAE...`.
3. Вставь его в `.env` → `TELEGRAM_BOT_TOKEN`.

### 2. Узнать chat_id (куда слать заявки)

**Личные уведомления себе:**
1. Напиши своему боту в Telegram любое сообщение (например, «привет»).
2. Открой в браузере: `https://api.telegram.org/bot<ТОКЕН>/getUpdates`
3. Найди `"chat":{"id":123456789,...}` — это твой `TELEGRAM_CHAT_ID`.

**В группу:**
1. Добавь бота в группу.
2. Напиши сообщение в группе.
3. В `getUpdates` возьми `chat.id` группы — он отрицательный, вида `-1001234567890`.

Вставь значение в `.env` → `TELEGRAM_CHAT_ID`. Перезапусти `npm run dev`.

---

## Мини-CRM /admin

- Адрес: `/admin`. Вход по `ADMIN_USER` / `ADMIN_PASSWORD` из `.env`.
- Возможности: таблица заявок (новые сверху), смена статуса прямо в строке (`Новая → В работе → Записан → Завершена / Отказ`), фильтр по статусу и услуге, поиск по имени/телефону, **экспорт в CSV** (открывается в Excel с кириллицей), счётчики «всего» и «новых сегодня».
- Защита: подписанная HMAC cookie-сессия (7 дней). Раздел закрыт от индексации (`robots`).

> **Перед запуском обязательно смени** `ADMIN_PASSWORD` и `ADMIN_SESSION_SECRET` на свои.

---

## Фото и видео

Все изображения — **временные плейсхолдеры** (атмосферные, без лиц и логотипов), лежат в `public/images/`. Единый реестр путей и `alt` — в **`src/content/media.ts`**.

**Чтобы поставить реальное фото — два способа:**
- положить файл с тем же именем в `public/images/` (например, заменить `hero.jpg`), **или**
- поменять путь в одной строке в `src/content/media.ts`.

Имена слотов: `hero.jpg`, `service-classic.jpg`, `service-ritual.jpg`, `service-gift.jpg`, `about-master.jpg`, `vyezd-splav.jpg`, `vyezd-mountains.jpg`, `gallery-1..6.jpg`, `video-poster.jpg`, `og.jpg`.

**Видео парения:** в `src/content/media.ts` → `media.video.src` укажи путь к файлу (`/videos/parenie.mp4`) или внешнюю ссылку; `poster` — кадр-обложка.

Перегенерировать атмосферные плейсхолдеры (если нужно): `npm run gen:media`.

---

## Тексты и контакты

- **`src/content/site.ts`** — бренд, слоган, **контакты** (телефон, Telegram, MAX), соцсети, юр. реквизиты, гео для карты.
- **`src/content/copy.ts`** — все тексты секций (герой, услуги, шаги, о мастере, польза, выезды, отзывы, FAQ).
- Значения в формате `{{ВОТ_ТАК}}` — **плейсхолдеры**: цены, длительность, опыт, даты, телефон, ссылки. Их нужно заменить на реальные. По коду они заметны и собраны в одном месте (см. чеклист ниже).

---

## Деплой на Vercel

1. Залей проект в Git (GitHub/GitLab).
2. Создай бесплатный Postgres (Neon/Supabase) и выполни шаги из [переключения на PostgreSQL](#переключение-на-postgresql-для-прода--vercel).
3. На [vercel.com](https://vercel.com) → **Import Project** → выбери репозиторий.
4. В **Environment Variables** добавь: `DATABASE_URL` (Postgres), `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `ADMIN_USER`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL` (например `https://ded-zhara.ru`).
5. Deploy. Скрипт сборки сам выполнит `prisma generate`. Один раз применить схему к БД: локально с продовым `DATABASE_URL` запусти `npx prisma db push` (или добавь шаг в CI).

---

## Деплой на VPS через Docker

В проекте есть `Dockerfile`. По умолчанию контейнер работает на **SQLite** (файл в томе `/data`).

```bash
# Сборка
docker build -t ded-zhara .

# Запуск (SQLite в персистентном томе, секреты из .env)
docker run -d --name ded-zhara \
  -p 3000:3000 \
  -v ded-zhara-data:/data \
  --env-file .env \
  -e DATABASE_URL="file:/data/dev.db" \
  ded-zhara
```

Контейнер при старте сам применит схему (`prisma db push`) и поднимет сервер на порту 3000. Поставь спереди Nginx/Caddy с HTTPS.

**Для PostgreSQL в Docker:** передай `-e DATABASE_URL="postgresql://..."` и заранее переключи провайдер и адаптер (см. раздел про БД). Тогда том `/data` не нужен.

---

## Чеклист плейсхолдеров

Перед публикацией заменить (поиск по `{{` найдёт всё):

- [ ] **Контакты** (`src/content/site.ts`): телефон, Telegram-хэндл для связи, MAX, VK, юр. реквизиты (ИП/ИНН), координаты карты.
- [ ] **Цены и длительность** услуг и выездов (`src/content/copy.ts`).
- [ ] **Опыт мастера** в годах и статистика (`about` в `copy.ts`).
- [ ] **Даты** выездов и экспедиций.
- [ ] **Ссылка на турклуб** — только после подтверждения (`clubLink` в `site.ts`).
- [ ] **Отзывы** — заменить примеры на реальные (`reviews` в `copy.ts`).
- [ ] **Фото и видео** — реальные файлы в `public/images/` (см. выше).
- [ ] **Карта**: вставить `src` Яндекс-карты в `site.mapEmbedSrc`.
- [ ] **Секреты** в `.env`: пароль админки, `ADMIN_SESSION_SECRET`, токен и chat_id Telegram.
- [ ] **`NEXT_PUBLIC_SITE_URL`** — реальный домен (для OG/sitemap).
- [ ] **Политика обработки ПДн** (`app/privacy/page.tsx`) — проверить реквизиты оператора.

---

## Структура проекта

```
ded-zhara/
├─ app/
│  ├─ layout.tsx                # шрифты, метаданные, grain
│  ├─ page.tsx                  # сборка лендинга из секций
│  ├─ globals.css               # дизайн-система (токены Tailwind v4)
│  ├─ icon.svg                  # брендовый favicon
│  ├─ sitemap.ts · robots.ts    # SEO
│  ├─ privacy/page.tsx          # политика обработки ПДн (152-ФЗ)
│  ├─ api/lead/route.ts         # приём формы → БД + Telegram
│  ├─ api/admin/export/route.ts # выгрузка заявок в CSV
│  └─ admin/                    # мини-CRM (вход, таблица, статусы)
├─ src/
│  ├─ components/ui/            # Button, Container, Reveal, Heading
│  ├─ components/sections/      # Hero, Services, About, Trips, Gallery…
│  ├─ content/site.ts           # бренд, контакты (плейсхолдеры)
│  ├─ content/copy.ts           # тексты секций
│  ├─ content/media.ts          # реестр фото/видео
│  └─ lib/                      # db, telegram, email, validation, auth…
├─ prisma/schema.prisma         # модель Lead
├─ prisma.config.ts             # конфиг Prisma 7
├─ scripts/gen-placeholders.mjs # генератор плейсхолдеров
├─ public/images/               # плейсхолдеры медиа
├─ Dockerfile · .dockerignore   # деплой на VPS
└─ .env.example                 # шаблон переменных окружения
```

---

_«Ваш Дед&Жара» 🔥_
