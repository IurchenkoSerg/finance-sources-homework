# Локальные правила агента для Finance Sources Dashboard

Этот файл содержит локальные правила Codex для учебного проекта на Next.js.
Прямые указания пользователя имеют приоритет над этими правилами. Правила
применяются совместно: агент выбирает все разделы, относящиеся к текущей задаче.

## Общие правила

- Общаться с пользователем на русском языке. Код, identifiers, commands и
  комментарии в коде писать на английском.
- Перед изменением изучить относящиеся к задаче файлы и существующее поведение.
- Не изменять посторонние пользовательские правки.
- Предпочитать простые и понятные решения, подходящие для учебного проекта.
- Не добавлять лишние abstractions, dependencies или функциональность.
- Использовать понятные английские имена функций и переменных.
- Не изменять входные данные, если mutation явно не требуется.
- После выполнения кратко описать изменения и команды для их проверки.

## Стиль кода

- Использовать современные JavaScript ES modules с `import` и `export`.
- Предпочитать `const`; применять `let` только при необходимости переназначения
  и не использовать `var`.
- Называть React components в `PascalCase`, функции и переменные — в
  `camelCase`.
- Каждая функция должна иметь понятную ответственность. Выносить helper
  functions, когда это устраняет дублирование или упрощает тестирование.
- Предпочитать раннюю validation и early returns глубокой вложенности.
- Хранить финансовые расчёты в чистых функциях внутри `lib/`, отдельно от React
  rendering и network requests.
- Не изменять arguments, API responses, React state и импортированные данные.
- Явно обрабатывать ожидаемые ошибки; не оставлять пустые `catch` blocks и не
  игнорировать rejected promises.
- Комментарии должны объяснять неочевидную причину, а не повторять код.
- Соблюдать существующее форматирование и организацию файлов проекта.

## Next.js и структура проекта

- Использовать App Router и хранить routes внутри `app/`.
- Использовать `page.js` для route UI, `layout.js` для общего layout и metadata,
  а `route.js` — для Route Handlers.
- Предпочитать Server Components. Добавлять `"use client"` только для browser
  API, React state, effects или event handlers.
- Не использовать `next/head` в App Router.
- Экспортировать static `metadata`; применять `generateMetadata` только для
  metadata, зависящих от dynamic data.
- При изменении архитектуры, структуры каталогов или data contracts обновлять
  `docs/ARCHITECTURE.md`.
- Сохранять корректные loading, success, empty и error states.
- Проверять актуальную документацию Next.js, если API или поведение framework
  могли измениться.

## Работа с сервером

- Использовать scripts из `package.json`: `npm run dev` для разработки,
  `npm run build` для production-проверки и `npm run start` после успешной
  сборки.
- Не запускать постоянный development server без необходимости browser
  verification. После проверки останавливать временные процессы.
- Хранить external requests, API keys и чтение environment variables только на
  server side.
- Настоящие secret values хранить в `.env.local`, placeholders — в
  `.env.example`; никогда не выводить secrets в logs.
- Route Handlers должны проверять configuration, upstream data и HTTP status и
  возвращать безопасные JSON errors с подходящими status codes.
- Независимые finance sources запрашивать параллельно.
- Использовать `cache: "no-store"` для финансовых данных, которые должны быть
  актуальными. Изменения caching должны быть явными и документированными.
- Оставлять server routes тонкими: HTTP и network logic размещать в `app/api/`,
  parsing и revenue calculations — в тестируемых функциях внутри `lib/`.
- Не передавать browser внутренние exception details, environment values или
  upstream credentials.

## Финансы и API

- Никогда не передавать finance API key в Client Components, browser bundle,
  logs или repository.
- Проверять `response.ok` перед обработкой успешного ответа.
- Проверять структуру источников и корректность числовых сумм.
- Включать в revenue только transactions с `type: "paid"`.
- Сохранять `pending` и `rejected` для отображения, но не добавлять их суммы в
  paid revenue.
- Явно разбирать amount и currency из строковых значений источника.
- Не складывать разные currencies. Хранить отдельные totals по currency либо
  использовать явно заданный актуальный exchange rate.
- Не изменять исходные API responses.

## UI, состояние и доступность

- Явно представлять loading, success, empty и error states.
- Хранить state в минимальном компоненте, которому он нужен.
- Использовать controlled fields, если validation или отправляемые значения
  зависят от React state.
- Проверять user input и показывать понятную ошибку рядом с соответствующим
  полем.
- Связывать controls с видимыми labels и использовать semantic HTML.
- Сохранять keyboard navigation и видимые focus states.
- Указывать явный `type` у buttons внутри forms.
- Использовать `aria-live` для важных asynchronous statuses и errors.

## Стили и локализация

- Хранить global styles в `app/globals.css`, если компоненту не требуется
  изоляция стилей.
- Сохранять liquid-glass visual direction, readable contrast и responsive
  layout.
- Учитывать `prefers-reduced-motion` для необязательных animations.
- Поддерживать light и dark themes с видимым переключателем.
- Поддерживать русский и английский языки через явный `RU`/`EN` control.
- Хранить interface text в translation objects, не распределяя language
  conditions по JSX.
- Форматировать numbers и currencies через `Intl.NumberFormat`.
- Не переводить data values, currency codes, identifiers и API fields.

## Тестирование и проверка

- Добавлять или обновлять tests при изменении calculation или parsing behavior.
- Для финансовой логики проверять `paid`, `pending`, `rejected`, empty sources,
  invalid values и multiple currencies, когда они относятся к изменению.
- Проверять, что `pending` и `rejected` доступны для отображения, но дают нулевой
  вклад в paid revenue.
- После изменения revenue logic запускать `npm test`.
- После изменения pages, layouts, API routes, metadata, imports или границ
  Client/Server Components запускать `npm run build`.
- Для UI-изменений по возможности проверять loading, success, empty и error
  states в browser.
- В отчёте указывать выполненные проверки и проверки, которые запустить не
  удалось.

## Безопасность и Git

- Никогда не добавлять в Git API keys, tokens, passwords, `.env*.local` и
  private user data.
- Использовать environment variables для secrets и документировать только их
  placeholder names.
- Перед commit проверять `git status` и относящийся к задаче diff.
- Не использовать destructive Git commands без прямого указания пользователя.
- Не выполнять commit, push, publish или создание pull request без запроса.
- Делать commits небольшими и писать краткие commit messages на английском.
- Перед публикацией по возможности проверять tests и production build.
- Предпочитать official documentation и official MCP servers.

## Приоритет правил

1. Прямые указания пользователя.
2. Локальные правила из этого файла.
3. Глобальные правила агента.

Если несколько разделов относятся к одной задаче, необходимо применять их
совместно. При конфликте выбирается более безопасное и более конкретное правило.
