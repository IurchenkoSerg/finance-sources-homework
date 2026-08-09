# Testing and Verification Rules

- Add or update tests when calculation or parsing behavior changes.
- Cover paid transactions, pending transactions, rejected transactions, empty
  sources, invalid values, and multiple currencies where relevant.
- Assert that pending and rejected values are visible in their dedicated data
  while contributing zero to paid revenue.
- Run `npm test` after revenue logic changes.
- Run `npm run build` after changes involving Next.js pages, layouts, API routes,
  metadata, imports, or client/server boundaries.
- For interface changes, verify loading, success, empty, and error states in the
  browser when tools are available.
- Report which checks passed and disclose any check that could not be run.
