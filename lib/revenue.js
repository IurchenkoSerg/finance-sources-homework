function normalizeCurrency(currency) {
  if (typeof currency !== "string" || !/^[A-Za-z]{3}$/.test(currency.trim())) {
    throw new TypeError(`Invalid currency: "${currency}".`);
  }

  return currency.trim().toUpperCase();
}

function validateAmount(amount) {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new TypeError(`Invalid amount: "${amount}".`);
  }

  return amount;
}

function parseSecondSourcePayment(value) {
  if (typeof value !== "string") {
    throw new TypeError("Every item in source 2 must be a string.");
  }

  const match = value.trim().match(/^(\d+(?:\.\d+)?)\s+([A-Za-z]{3})$/);

  if (!match) {
    throw new TypeError(`Invalid payment format: "${value}".`);
  }

  return {
    amount: validateAmount(Number(match[1])),
    currency: normalizeCurrency(match[2]),
  };
}

function sumByCurrency(payments) {
  return payments.reduce((totals, payment) => {
    totals[payment.currency] =
      (totals[payment.currency] ?? 0) + payment.amount;
    return totals;
  }, {});
}

function formatAddress(address) {
  if (!address || typeof address !== "object") {
    return "N/A";
  }

  const addressParts = [address.houseNumber, address.street, address.city]
    .filter((part) => part !== undefined && String(part).trim() !== "")
    .map(String);

  return addressParts.length > 0 ? addressParts.join(", ") : "N/A";
}

export function calculateRevenue(firstSource, secondSource) {
  if (
    !firstSource ||
    typeof firstSource !== "object" ||
    !Array.isArray(firstSource.transactions)
  ) {
    throw new TypeError("Source 1 must contain a transactions array.");
  }

  if (!Array.isArray(secondSource)) {
    throw new TypeError("Source 2 must be an array.");
  }

  const transactions = firstSource.transactions.map((transaction) => {
    if (
      !transaction ||
      typeof transaction !== "object" ||
      typeof transaction.type !== "string"
    ) {
      throw new TypeError("Every transaction must be a valid object.");
    }

    return { ...transaction };
  });

  const source1Payments = transactions
    .filter((transaction) => transaction.type === "paid")
    .map((transaction) => ({
      amount: validateAmount(transaction.amount),
      currency: normalizeCurrency(transaction.currency),
    }));

  const source2Payments = secondSource.map(parseSecondSourcePayment);
  const allPayments = [...source1Payments, ...source2Payments];

  return {
    totalsByCurrency: sumByCurrency(allPayments),
    source1: {
      address: formatAddress(firstSource.address),
      transactions,
      payments: source1Payments,
      totalsByCurrency: sumByCurrency(source1Payments),
    },
    source2: {
      address: "N/A",
      payments: source2Payments,
      totalsByCurrency: sumByCurrency(source2Payments),
    },
  };
}
