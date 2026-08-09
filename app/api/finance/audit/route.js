import { auditFinanceResponses } from "../../../../lib/finance-audit";
import {
  FINANCE_SOURCES,
  requestFinanceSource,
} from "../../../../lib/finance-sources";

export async function GET() {
  if (!process.env.CPA_API_KEY) {
    return Response.json(
      { error: "CPA_API_KEY is not configured." },
      { status: 500 },
    );
  }

  try {
    const [firstSource, secondSource] = await Promise.all([
      requestFinanceSource("finance1", process.env.CPA_API_KEY),
      requestFinanceSource("finance2", process.env.CPA_API_KEY),
    ]);

    return Response.json({
      sources: FINANCE_SOURCES,
      audit: auditFinanceResponses(firstSource, secondSource),
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error." },
      { status: 502 },
    );
  }
}
