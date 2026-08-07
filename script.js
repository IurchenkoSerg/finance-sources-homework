const source1 = {
  transactions: [
    { type: "paid", amount: 100, currency: "USD" },
    { type: "pending", amount: 50, currency: "USD" },
    { type: "paid", amount: 880, currency: "USD" },
    { type: "paid", amount: 130, currency: "USD" },
    { type: "rejected", amount: 560, currency: "USD" },
  ],
  address: {
    city: "New York",
    street: "5th Avenue",
    houseNumber: 10,
  },
};

const source2 = ["300 USD", "150 USD", "200 USD", "400 USD"];

function calculateTotalRevenue(firstSource, secondSource) {
  if (
    firstSource === null ||
    typeof firstSource !== "object" ||
    !Array.isArray(firstSource.transactions)
  ) {
    throw new TypeError("The first source must contain a transactions array.");
  }

  if (!Array.isArray(secondSource)) {
    throw new TypeError("The second source must be an array.");
  }

  const paidTransactions = firstSource.transactions.filter((transaction) => {
    if (
      transaction === null ||
      typeof transaction !== "object" ||
      typeof transaction.type !== "string"
    ) {
      throw new TypeError("Every transaction must be a valid object with a type.");
    }

    return transaction.type === "paid";
  });

  const firstSourcePayments = paidTransactions.map((transaction) => {
    if (!Number.isFinite(transaction.amount) || transaction.amount < 0) {
      throw new TypeError("Every paid transaction must have a valid amount.");
    }

    if (typeof transaction.currency !== "string" || !transaction.currency.trim()) {
      throw new TypeError("Every paid transaction must have a currency.");
    }

    return {
      amount: transaction.amount,
      currency: transaction.currency.trim().toUpperCase(),
    };
  });

  const secondSourcePayments = secondSource.map((payment) => {
    if (typeof payment !== "string") {
      throw new TypeError("Every item in the second source must be a string.");
    }

    const match = payment.trim().match(/^(\d+(?:\.\d+)?)\s+([A-Za-z]{3})$/);

    if (!match) {
      throw new TypeError(`Invalid payment format: "${payment}".`);
    }

    const amount = Number(match[1]);
    const currency = match[2].toUpperCase();

    if (!Number.isFinite(amount)) {
      throw new TypeError(`Invalid payment amount: "${payment}".`);
    }

    return { amount, currency };
  });

  const allPayments = [...firstSourcePayments, ...secondSourcePayments];
  const currencies = new Set(allPayments.map((payment) => payment.currency));

  if (currencies.size > 1) {
    throw new Error("Cannot add amounts in different currencies.");
  }

  const total = allPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  const firstSourceTotal = firstSourcePayments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  const secondSourceTotal = secondSourcePayments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  const address = firstSource.address
    ? [
        firstSource.address.houseNumber,
        firstSource.address.street,
        firstSource.address.city,
      ]
        .filter((addressPart) => addressPart !== undefined && addressPart !== "")
        .join(", ") || "N/A"
    : "N/A";

  return {
    total,
    currency: allPayments[0]?.currency ?? null,
    source1: {
      address,
      transactions: firstSource.transactions.map((transaction) => ({
        ...transaction,
      })),
      payments: firstSourcePayments,
      total: firstSourceTotal,
      currency: firstSourcePayments[0]?.currency ?? null,
    },
    source2: {
      address: "N/A",
      payments: secondSourcePayments,
      total: secondSourceTotal,
      currency: secondSourcePayments[0]?.currency ?? null,
    },
  };
}

function displayResult(result) {
  console.dir(result, { depth: null });
}

console.log("1. Original data:");
displayResult(calculateTotalRevenue(source1, source2));
// Expected total: 2160 USD; source1: 1110 USD; source2: 1050 USD

console.log("\n2. Pending transaction:");
displayResult(
  calculateTotalRevenue(
    {
      transactions: [{ type: "pending", amount: 50, currency: "USD" }],
    },
    [],
  ),
);
// Expected total: 0; both source totals: 0

console.log("\n3. Rejected transaction:");
displayResult(
  calculateTotalRevenue(
    {
      transactions: [{ type: "rejected", amount: 560, currency: "USD" }],
    },
    [],
  ),
);
// Expected total: 0; both source totals: 0

console.log("\n4. Empty sources:");
displayResult(calculateTotalRevenue({ transactions: [] }, []));
// Expected total: 0; both source totals: 0

console.log("\n5. Different currencies:");
try {
  displayResult(
    calculateTotalRevenue(
      {
        transactions: [{ type: "paid", amount: 100, currency: "USD" }],
      },
      ["300 EUR"],
    ),
  );
} catch (error) {
  console.log(error.message);
}
// Expected: Cannot add amounts in different currencies.
