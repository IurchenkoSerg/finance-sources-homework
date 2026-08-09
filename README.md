# Finance Sources

Next.js приложение получает данные о прибыли из двух внешних API через
собственный server route и выводит суммы отдельно для каждой валюты.

## Возможности

- отдельные итоги для `USD` и `EUR`;
- в прибыль входят только транзакции `paid`;
- `pending` и `rejected` отображаются, но не входят в итог;
- русский и английский интерфейс;
- светлая и тёмная темы;
- `liquid glass` оформление;
- понятный интерфейс загрузки и ошибок;
- сохранение языка и темы в `localStorage`.

## Настройка

Создайте `.env.local` на основе `.env.example`:

```text
CPA_API_KEY=your_api_key_here
```

Файл `.env.local` не загружается в GitHub.

## Запуск

```bash
npm install
npm run dev
```

После запуска откройте:

```text
http://localhost:3000
```

## Проверка

```bash
npm test
npm run build
```

## Структура

- `app/page.js` — главная страница.
- `app/layout.js` — корневой layout и metadata.
- `app/components/FinanceDashboard.js` — интерактивный React interface.
- `app/api/finance/route.js` — server requests к внешним источникам.
- `app/globals.css` — стили интерфейса.
- `lib/revenue.js` — проверка данных и расчёт прибыли.
- `tests/revenue.test.js` — unit tests расчёта.

## Работа с валютами

`USD` и `EUR` не складываются между собой. Функция возвращает отдельный итог
для каждой валюты в `totalsByCurrency`:

```js
{
  USD: 3020,
  EUR: 1910,
}
```

API key используется только внутри Next.js server route и не попадает в browser
bundle.
