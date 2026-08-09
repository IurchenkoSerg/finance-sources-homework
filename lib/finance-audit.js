const VALID_TRANSACTION_TYPES = new Set(["paid", "pending", "rejected"]);

function isSupportedCurrency(currency) {
  try {
    return Intl.supportedValuesOf("currency").includes(currency);
  } catch {
    try {
      new Intl.NumberFormat("en", { style: "currency", currency }).format(0);
      return true;
    } catch {
      return false;
    }
  }
}

function createIssue(sourceId, severity, code, path, message, value) {
  return {
    sourceId,
    severity,
    code,
    path,
    message,
    ...(value === undefined ? {} : { value: String(value) }),
  };
}

function auditCurrency(value, sourceId, path) {
  if (typeof value !== "string") {
    return [
      createIssue(
        sourceId,
        "error",
        "INVALID_CURRENCY_TYPE",
        path,
        "Currency must be a string.",
        value,
      ),
    ];
  }

  const trimmedCurrency = value.trim();
  const normalizedCurrency = trimmedCurrency.toUpperCase();
  const issues = [];

  if (!/^[A-Za-z]{3}$/.test(trimmedCurrency)) {
    issues.push(
      createIssue(
        sourceId,
        "error",
        "INVALID_CURRENCY_FORMAT",
        path,
        "Currency must contain exactly three Latin letters.",
        value,
      ),
    );
    return issues;
  }

  if (value !== trimmedCurrency) {
    issues.push(
      createIssue(
        sourceId,
        "warning",
        "CURRENCY_WHITESPACE",
        path,
        "Currency contains leading or trailing whitespace.",
        value,
      ),
    );
  }

  if (trimmedCurrency !== normalizedCurrency) {
    issues.push(
      createIssue(
        sourceId,
        "warning",
        "CURRENCY_CASE",
        path,
        `Currency should use uppercase: ${normalizedCurrency}.`,
        value,
      ),
    );
  }

  if (!isSupportedCurrency(normalizedCurrency)) {
    issues.push(
      createIssue(
        sourceId,
        "error",
        "UNKNOWN_CURRENCY",
        path,
        "Currency is not present in the runtime ISO 4217 currency list.",
        value,
      ),
    );
  }

  return issues;
}

function auditAmount(value, sourceId, path) {
  if (!Number.isFinite(value) || value < 0) {
    return [
      createIssue(
        sourceId,
        "error",
        "INVALID_AMOUNT",
        path,
        "Amount must be a finite non-negative number.",
        value,
      ),
    ];
  }

  return [];
}

function auditFirstSource(data) {
  const sourceId = "finance1";

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return [
      createIssue(
        sourceId,
        "error",
        "INVALID_ROOT",
        "$",
        "Response must be an object.",
      ),
    ];
  }

  if (!Array.isArray(data.transactions)) {
    return [
      createIssue(
        sourceId,
        "error",
        "MISSING_TRANSACTIONS",
        "$.transactions",
        "Response must contain a transactions array.",
      ),
    ];
  }

  return data.transactions.flatMap((transaction, index) => {
    const path = `$.transactions[${index}]`;

    if (!transaction || typeof transaction !== "object" || Array.isArray(transaction)) {
      return [
        createIssue(
          sourceId,
          "error",
          "INVALID_TRANSACTION",
          path,
          "Transaction must be an object.",
        ),
      ];
    }

    const issues = [
      ...auditAmount(transaction.amount, sourceId, `${path}.amount`),
      ...auditCurrency(transaction.currency, sourceId, `${path}.currency`),
    ];

    if (typeof transaction.type !== "string") {
      issues.push(
        createIssue(
          sourceId,
          "error",
          "INVALID_TRANSACTION_TYPE",
          `${path}.type`,
          "Transaction type must be a string.",
          transaction.type,
        ),
      );
    } else if (!VALID_TRANSACTION_TYPES.has(transaction.type)) {
      const normalizedType = transaction.type.trim().toLowerCase();
      const isCaseProblem = VALID_TRANSACTION_TYPES.has(normalizedType);
      issues.push(
        createIssue(
          sourceId,
          isCaseProblem ? "warning" : "error",
          isCaseProblem ? "TRANSACTION_TYPE_CASE" : "UNKNOWN_TRANSACTION_TYPE",
          `${path}.type`,
          isCaseProblem
            ? `Transaction type should use lowercase: ${normalizedType}.`
            : "Transaction type is not paid, pending, or rejected.",
          transaction.type,
        ),
      );
    }

    return issues;
  });
}

function auditSecondSource(data) {
  const sourceId = "finance2";

  if (!Array.isArray(data)) {
    return [
      createIssue(
        sourceId,
        "error",
        "INVALID_ROOT",
        "$",
        "Response must be an array.",
      ),
    ];
  }

  return data.flatMap((payment, index) => {
    const path = `$[${index}]`;

    if (typeof payment !== "string") {
      return [
        createIssue(
          sourceId,
          "error",
          "INVALID_PAYMENT_TYPE",
          path,
          "Payment must be a string.",
          payment,
        ),
      ];
    }

    const match = payment.trim().match(/^(\S+)\s+([A-Za-z]{3})$/);

    if (!match) {
      return [
        createIssue(
          sourceId,
          "error",
          "INVALID_PAYMENT_FORMAT",
          path,
          'Payment must match "amount CURRENCY".',
          payment,
        ),
      ];
    }

    const amount = Number(match[1]);
    const issues = [
      ...auditAmount(amount, sourceId, `${path}.amount`),
      ...auditCurrency(match[2], sourceId, `${path}.currency`),
    ];

    if (payment !== payment.trim()) {
      issues.push(
        createIssue(
          sourceId,
          "warning",
          "PAYMENT_WHITESPACE",
          path,
          "Payment contains leading or trailing whitespace.",
          payment,
        ),
      );
    }

    return issues;
  });
}

export function auditFinanceResponses(firstSource, secondSource) {
  const issues = [...auditFirstSource(firstSource), ...auditSecondSource(secondSource)];
  const sources = ["finance1", "finance2"].map((sourceId) => {
    const sourceIssues = issues.filter((issue) => issue.sourceId === sourceId);
    return {
      sourceId,
      status: sourceIssues.some((issue) => issue.severity === "error")
        ? "error"
        : sourceIssues.length > 0
          ? "warning"
          : "ok",
      issueCount: sourceIssues.length,
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      total: issues.length,
      errors: issues.filter((issue) => issue.severity === "error").length,
      warnings: issues.filter((issue) => issue.severity === "warning").length,
    },
    sources,
    issues,
  };
}

export function formatFinanceAuditReport(audit, sourceDefinitions) {
  const lines = [
    "# Finance API data quality report",
    "",
    `Generated: ${audit.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Issues: ${audit.summary.total}`,
    `- Errors: ${audit.summary.errors}`,
    `- Warnings: ${audit.summary.warnings}`,
    "",
  ];

  for (const source of sourceDefinitions) {
    const sourceAudit = audit.sources.find((item) => item.sourceId === source.id);
    const issues = audit.issues.filter((issue) => issue.sourceId === source.id);
    lines.push(`## ${source.name}`, "", `- Endpoint: ${source.endpoint}`);
    lines.push(`- Status: ${sourceAudit?.status ?? "unknown"}`);
    lines.push(`- Expected format: ${source.format}`, "");

    if (issues.length === 0) {
      lines.push("No potential data quality problems detected.", "");
      continue;
    }

    for (const issue of issues) {
      const value = issue.value === undefined ? "" : ` Received: \`${issue.value}\`.`;
      lines.push(
        `- **${issue.severity.toUpperCase()} · ${issue.code}** at \`${issue.path}\`: ${issue.message}${value}`,
      );
    }
    lines.push("");
  }

  lines.push(
    "## Recommended backend actions",
    "",
    "1. Return currency codes as uppercase ISO 4217 values.",
    "2. Keep transaction types lowercase and limited to paid, pending, or rejected.",
    "3. Return finite non-negative numeric amounts.",
    "4. Enforce the documented response schemas before sending a response.",
    "",
  );

  return lines.join("\n");
}
