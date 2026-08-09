# Server Rules

- Use the scripts from `package.json`: `npm run dev` for local development,
  `npm run build` for production verification, and `npm run start` only after a
  successful build.
- Do not start a persistent development server unless the task requires browser
  verification. Stop temporary server processes after verification.
- Keep external finance requests, API keys, and environment-variable access in
  Server Components or Route Handlers. Never move them into browser code.
- Read secrets from environment variables. Keep real values in `.env.local`,
  placeholders in `.env.example`, and never print secret values to logs.
- Route Handlers must validate required configuration and upstream data, check
  unsuccessful HTTP responses, and return safe JSON errors with appropriate
  status codes.
- Fetch independent finance sources concurrently when their results do not
  depend on each other. Do not add retries, caching, or background jobs without
  a concrete requirement.
- Use `cache: "no-store"` for finance data that must be current. Any change to
  caching behavior must be explicit and documented.
- Keep server routes thin: network and HTTP concerns belong in `app/api/`, while
  parsing and revenue calculations belong in testable functions under `lib/`.
- Do not expose internal exception details, environment values, or upstream
  credentials in responses sent to the browser.
- When server behavior changes, run the relevant unit tests and `npm run build`,
  then report failures or checks that could not be completed.
