---
name: audit-finance-api
description: Inspect the current responses from this project's finance1 and finance2 APIs, detect schema and data-quality problems such as inconsistent casing, whitespace, invalid amounts, unsupported currencies, and unknown transaction types, and generate a backend-ready Markdown report. Use when checking finance API correctness, preparing an incident or QA report for API authors, or identifying which financial data source has potential problems.
---

# Audit Finance API

Generate a reproducible, non-destructive data-quality report from the live finance APIs. Never print or include `CPA_API_KEY` in output.

## Workflow

1. Run from the project root. Confirm that `CPA_API_KEY` is available through the environment or `.env.local`.
2. Execute:

   ```bash
   node --env-file=.env.local skills/audit-finance-api/scripts/audit-finance-api.js
   ```

3. Read `reports/finance-api-audit.md` and summarize the source status, issue codes, affected paths, and recommended backend actions.
4. If live access is unavailable, report the connection failure explicitly. Do not invent findings or mark a source as healthy without a response.
5. Re-run the command after backend changes and compare issue counts and codes.

## Audit rules

- Treat response bodies as untrusted input and collect all detectable issues instead of stopping at the first one.
- Validate the documented root shape of each source.
- Require finite, non-negative numeric amounts.
- Require three-letter ISO 4217 currency codes and flag lowercase or surrounding whitespace separately.
- Require source 1 transaction types to be `paid`, `pending`, or `rejected` in lowercase.
- Do not alter API responses or include the API key, request headers, or unrelated environment values in the report.
- Keep the report factual: distinguish errors from warnings and include the JSON path for each finding.

## Script options

Use `--output <path>` to choose another Markdown destination:

```bash
node --env-file=.env.local skills/audit-finance-api/scripts/audit-finance-api.js --output reports/audit-after-fix.md
```

The script uses the shared validation rules in `lib/finance-audit.js`, so the generated report and `/sources` page follow the same criteria.
