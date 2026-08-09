#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  auditFinanceResponses,
  formatFinanceAuditReport,
} from "../../../lib/finance-audit.js";
import {
  FINANCE_SOURCES,
  requestFinanceSource,
} from "../../../lib/finance-sources.js";

function readOutputPath(argumentsList) {
  const outputIndex = argumentsList.indexOf("--output");

  if (outputIndex === -1) {
    return "reports/finance-api-audit.md";
  }

  const outputPath = argumentsList[outputIndex + 1];

  if (!outputPath) {
    throw new Error("--output requires a file path.");
  }

  return outputPath;
}

async function main() {
  if (!process.env.CPA_API_KEY) {
    throw new Error(
      "CPA_API_KEY is not configured. Pass it through the environment or use node --env-file=.env.local.",
    );
  }

  const outputPath = resolve(process.cwd(), readOutputPath(process.argv.slice(2)));
  const [firstSource, secondSource] = await Promise.all([
    requestFinanceSource("finance1", process.env.CPA_API_KEY),
    requestFinanceSource("finance2", process.env.CPA_API_KEY),
  ]);
  const audit = auditFinanceResponses(firstSource, secondSource);
  const report = formatFinanceAuditReport(audit, FINANCE_SOURCES);

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, report, "utf8");

  const relativeOutputPath = outputPath.replace(`${process.cwd()}/`, "");
  console.log(
    `Audit complete: ${audit.summary.errors} errors, ${audit.summary.warnings} warnings.`,
  );
  console.log(`Report: ${relativeOutputPath}`);
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFilePath) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : "Audit failed.");
    process.exitCode = 1;
  });
}
