# Finance API data quality report

Generated: 2026-08-09T08:05:20.545Z

## Summary

- Issues: 9
- Errors: 0
- Warnings: 9

## Finance API · Transactions

- Endpoint: https://cpa-server-vtel.onrender.com/api/finance1
- Status: ok
- Expected format: Object with a transactions array

No potential data quality problems detected.

## Finance API · Payments

- Endpoint: https://cpa-server-vtel.onrender.com/api/finance2
- Status: warning
- Expected format: Array of strings in the form "amount CURRENCY"

- **WARNING · CURRENCY_CASE** at `$[0].currency`: Currency should use uppercase: USD. Received: `usd`.
- **WARNING · CURRENCY_CASE** at `$[1].currency`: Currency should use uppercase: EUR. Received: `eur`.
- **WARNING · CURRENCY_CASE** at `$[2].currency`: Currency should use uppercase: USD. Received: `usd`.
- **WARNING · CURRENCY_CASE** at `$[3].currency`: Currency should use uppercase: USD. Received: `usd`.
- **WARNING · CURRENCY_CASE** at `$[4].currency`: Currency should use uppercase: EUR. Received: `eur`.
- **WARNING · CURRENCY_CASE** at `$[5].currency`: Currency should use uppercase: USD. Received: `usd`.
- **WARNING · CURRENCY_CASE** at `$[6].currency`: Currency should use uppercase: USD. Received: `usd`.
- **WARNING · CURRENCY_CASE** at `$[7].currency`: Currency should use uppercase: USD. Received: `usd`.
- **WARNING · CURRENCY_CASE** at `$[8].currency`: Currency should use uppercase: EUR. Received: `eur`.

## Recommended backend actions

1. Return currency codes as uppercase ISO 4217 values.
2. Keep transaction types lowercase and limited to paid, pending, or rejected.
3. Return finite non-negative numeric amounts.
4. Enforce the documented response schemas before sending a response.
