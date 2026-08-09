import assert from "node:assert/strict";
import { test } from "node:test";
import { auditFinanceResponses } from "../lib/finance-audit.js";

test("reports casing and unsupported currency issues without mutating data", () => {
  const firstSource = {
    transactions: [
      { type: "Paid", amount: 100, currency: "usd" },
      { type: "pending", amount: 50, currency: "ZZZ" },
    ],
  };
  const secondSource = ["20 eur"];
  const originalFirstSource = structuredClone(firstSource);
  const originalSecondSource = structuredClone(secondSource);

  const audit = auditFinanceResponses(firstSource, secondSource);
  const issueCodes = audit.issues.map((issue) => issue.code);

  assert.ok(issueCodes.includes("TRANSACTION_TYPE_CASE"));
  assert.equal(issueCodes.filter((code) => code === "CURRENCY_CASE").length, 2);
  assert.ok(issueCodes.includes("UNKNOWN_CURRENCY"));
  assert.deepEqual(firstSource, originalFirstSource);
  assert.deepEqual(secondSource, originalSecondSource);
});

test("reports invalid shapes, amounts, and payment formats", () => {
  const audit = auditFinanceResponses(
    { transactions: [{ type: "paid", amount: -1, currency: "USD" }] },
    ["not-a-payment"],
  );

  assert.deepEqual(
    audit.issues.map((issue) => issue.code),
    ["INVALID_AMOUNT", "INVALID_PAYMENT_FORMAT"],
  );
  assert.equal(audit.summary.errors, 2);
});

test("marks valid API responses as healthy", () => {
  const audit = auditFinanceResponses(
    { transactions: [{ type: "paid", amount: 10, currency: "USD" }] },
    ["20 EUR"],
  );

  assert.equal(audit.summary.total, 0);
  assert.ok(audit.sources.every((source) => source.status === "ok"));
});
