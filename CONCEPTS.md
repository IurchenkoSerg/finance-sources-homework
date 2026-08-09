# Где живут основные концепции Next.js в проекте

Этот checklist показывает, какие концепции Next.js уже используются в проекте
Finance Sources, в каких файлах они находятся и как работают.

## Краткий checklist

| Концепция | Статус | Где находится |
|---|---|---|
| Маршрутизация | Есть | `app/page.js`, `app/api/finance/route.js` |
| Data fetching | Есть | `app/api/finance/route.js`, `app/components/FinanceDashboard.js` |
| Работа с состояниями | Есть | `app/components/FinanceDashboard.js` |
| Обработка ошибок | Есть | `app/api/finance/route.js`, `app/components/FinanceDashboard.js`, `lib/revenue.js` |
| Стилизация | Есть | `app/globals.css` |
| Работа с формами | Полноценной формы нет | Есть доступные интерактивные кнопки |
| Работа с metadata | Есть | `app/layout.js` |
| Оптимизация | Частично есть | Server Route, `Promise.all`, Server/Client Components, production build |

## 1. Маршрутизация

Next.js использует file-system routing: адрес страницы определяется положением
файла внутри папки `app`.

### Главная страница

Файл `app/page.js` создаёт маршрут:

```text
/
```

Компонент `HomePage` подключает основной интерфейс:

```js
import FinanceDashboard from "./components/FinanceDashboard";

export default function HomePage() {
  return <FinanceDashboard />;
}
```

### API route

Файл `app/api/finance/route.js` создаёт server endpoint:

```text
/api/finance
```

Функция `GET()` отвечает на HTTP-запрос методом `GET`.

Сейчас в приложении одна пользовательская страница, поэтому переходов через
`Link` пока нет. При необходимости вторая страница может быть создана, например,
файлом `app/about/page.js`, который автоматически получит адрес `/about`.

[Официальная документация: Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)

## 2. Data fetching

Data fetching разделён на два уровня.

### Запросы Next.js server к внешним API

В `app/api/finance/route.js` функция `requestSource()` вызывает внешний server:

```js
const response = await fetch(`${API_BASE_URL}/${path}`, {
  headers: {
    "x-api-key": process.env.CPA_API_KEY,
  },
  cache: "no-store",
});
```

API key читается из `.env.local` только на server. Он не попадает в JavaScript,
который загружает browser.

Оба источника запрашиваются параллельно:

```js
const [source1, source2] = await Promise.all([
  requestSource("finance1"),
  requestSource("finance2"),
]);
```

Параллельное выполнение быстрее последовательного: второй запрос не ждёт
завершения первого.

### Запрос Client Component к Next.js server

В `FinanceDashboard.js` browser обращается уже к внутреннему endpoint:

```js
const response = await fetch("/api/finance", { cache: "no-store" });
const data = await response.json();
```

`cache: "no-store"` используется, потому что финансовые данные должны
обновляться при каждом запросе.

[Официальная документация: Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data)

## 3. Работа с состояниями

Файл `FinanceDashboard.js` начинается с директивы:

```js
"use client";
```

Она нужна, потому что компонент интерактивный и использует browser API, события
и React state.

В компоненте есть четыре состояния:

```js
const [language, setLanguage] = useState("ru");
const [theme, setTheme] = useState("light");
const [report, setReport] = useState(null);
const [status, setStatus] = useState({ type: "loading", key: "loading" });
```

- `language` хранит выбранный язык `ru` или `en`;
- `theme` хранит тему `light` или `dark`;
- `report` хранит полученный финансовый отчёт;
- `status` хранит состояние запроса: загрузка, успех или ошибка.

`useEffect()` восстанавливает язык и тему из `localStorage`, применяет их к
странице и сохраняет новые значения после переключения.

`useCallback()` сохраняет функцию `loadRevenue`, чтобы она не создавалась
заново при каждом render и могла безопасно использоваться внутри `useEffect`.

## 4. Обработка ошибок

Ошибки обрабатываются на трёх уровнях.

### Проверка ответа внешнего server

В `app/api/finance/route.js` проверяется HTTP status:

```js
if (!response.ok) {
  throw new Error(`Finance server returned status ${response.status}.`);
}
```

Также проверяется наличие `CPA_API_KEY`. Весь server-код заключён в
`try...catch`, а при ошибке endpoint возвращает JSON и status `500`.

### Проверка формата данных

В `lib/revenue.js` проверяются:

- структура первого и второго источника;
- формат транзакций;
- числовые значения;
- формат валюты;
- формат строк второго источника.

Неправильные данные приводят к `TypeError`, а не к неправильному расчёту.

### Error UI в browser

В `FinanceDashboard.js` проверяется ответ внутреннего API:

```js
if (!response.ok) {
  throw new Error(data.error ?? "Request failed.");
}
```

`catch` переводит интерфейс в состояние `error`. Сообщение выводится внутри
элемента с `aria-live="polite"`, поэтому его могут объявить screen readers.

Для большого приложения дополнительно можно создать `app/error.js` — Next.js
Error Boundary для непредвиденных ошибок render. Сейчас ошибки запросов уже
обрабатываются непосредственно в компоненте.

[Официальная документация: Error Handling](https://nextjs.org/docs/app/getting-started/error-handling)

## 5. Стилизация

Глобальные стили находятся в `app/globals.css` и подключаются один раз в
`app/layout.js`:

```js
import "./globals.css";
```

В проекте используются:

- CSS variables для цветов и тем;
- selector `:root[data-theme="dark"]` для тёмной темы;
- Grid и Flexbox;
- `backdrop-filter` для liquid glass эффекта;
- responsive design через `@media`;
- `:focus-visible` для keyboard navigation;
- `prefers-reduced-motion` для пользователей, уменьшающих анимацию.

CSS Modules и Tailwind CSS не используются: для одной страницы одного
глобального файла достаточно.

## 6. Работа с формами

Полноценной формы с `<form>`, текстовыми полями и отправкой данных в проекте
пока нет. Она не требуется текущим заданием, потому что пользователь ничего не
вводит вручную.

Однако в интерфейсе есть доступные interactive controls:

- у всех кнопок указан `type="button"`;
- активные варианты языка и темы имеют `aria-pressed`;
- группы переключателей имеют `role="group"` и `aria-label`;
- во время загрузки кнопка обновления получает `disabled`;
- CSS `:focus-visible` показывает keyboard focus.

Если позже появится форма, нужно будет добавить:

- связанные `<label>` и `<input>`;
- проверку значений до отправки;
- понятные сообщения об ошибках;
- `aria-invalid` и `aria-describedby` для неправильных полей;
- обработчик `onSubmit`;
- server-side validation, которой нельзя доверять только browser.

## 7. Работа с metadata

Metadata объявлены в Server Component `app/layout.js`:

```js
export const metadata = {
  title: "Finance Sources",
  description: "Revenue report from two finance sources",
};
```

Next.js автоматически превращает объект в теги `<title>` и
`<meta name="description">` внутри `<head>`.

В будущем можно добавить:

- `openGraph` для красивого preview ссылки;
- favicon через `app/favicon.ico`;
- `robots.js`;
- `sitemap.js`;
- отдельную metadata для каждой новой страницы.

[Официальная документация: Metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)

## 8. Оптимизация

В проекте уже используются следующие оптимизации.

### Server и Client Components

`app/page.js` и `app/layout.js` являются Server Components по умолчанию.
Интерактивная логика изолирована в одном Client Component
`FinanceDashboard.js`. Поэтому лишний browser JavaScript не добавляется в
layout и page.

### Параллельные запросы

`Promise.all()` запускает оба внешних запроса одновременно.

### Безопасный server route

API key и внешние запросы находятся на server. Это уменьшает client code и не
раскрывает credential.

### Разделение интерфейса на компоненты

`Totals`, `Payments`, `Transactions` и `SourceCard` уменьшают повторение JSX и
делают render предсказуемым.

### Production build

Команда:

```bash
npm run build
```

создаёт оптимизированную production-сборку Next.js: выполняет bundling,
minification, tree shaking и разделение кода по маршрутам.

### Что пока не используется

- `next/image`, потому что на странице нет изображений;
- `next/font`, потому что используется системный Apple-подобный font stack;
- `loading.js` и streaming, потому что загрузка происходит в Client Component;
- server caching, потому что финансовые данные специально загружаются свежими;
- dynamic imports, потому что приложение небольшое.

Если появятся изображения или custom fonts, следует использовать `next/image`
и `next/font`. `next/font` загружает и self-hosts шрифты без дополнительных
browser-запросов и уменьшает layout shift.

[Официальная документация: Font Optimization](https://nextjs.org/docs/app/api-reference/components/font)

## Итог

Проект использует семь из восьми перечисленных концепций. Полноценной формы нет,
потому что текущий сценарий не требует пользовательского ввода. Это не ошибка:
важно применять концепции там, где они действительно нужны, а не добавлять их
искусственно.
