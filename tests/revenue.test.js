import assert from "node:assert/strict";
import { calculateRevenue } from "../lib/revenue.js";

const source1 = {
  transactions: [
    { type: "paid", amount: 100, currency: "USD" },
    { type: "pending", amount: 50, currency: "USD" },
    { type: "rejected", amount: 560, currency: "USD" },
    { type: "paid", amount: 230, currency: "EUR" },
  ],
  address: {
    city: "New York",
    street: "5th Avenue",
    houseNumber: 10,
  },
};

const source2 = ["300 usd", "200 eur"];
const report = calculateRevenue(source1, source2);

assert.deepEqual(report.totalsByCurrency, { USD: 400, EUR: 430 });
assert.deepEqual(report.source1.totalsByCurrency, { USD: 100, EUR: 230 });
assert.equal(report.source1.transactions.length, 4);
assert.equal(report.source1.payments.length, 2);
assert.equal(report.source1.address, "10, 5th Avenue, New York");
assert.equal(report.source2.address, "N/A");

const emptyReport = calculateRevenue({ transactions: [] }, []);
assert.deepEqual(emptyReport.totalsByCurrency, {});

console.log("All revenue tests passed.");
