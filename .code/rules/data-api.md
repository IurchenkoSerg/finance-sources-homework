# Data and API Rules

- Keep the finance API key server-side and never expose it to Client
  Components, browser code, logs, or committed files.
- Check `response.ok` before reading successful response data.
- Return clear HTTP status codes and safe error messages from Route Handlers.
- Validate source shapes and numeric amounts without excessive complexity.
- Count only transactions whose `type` is `"paid"` in revenue totals.
- Preserve `pending` and `rejected` transactions for display when the interface
  needs to show that they exist, but never add them to paid revenue.
- Parse amount and currency explicitly from string-based source entries.
- Never silently add different currencies. Keep separate totals by currency or
  convert them using an explicit, current exchange rate.
- Do not mutate API responses or other input data.
