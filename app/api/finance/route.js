import { calculateRevenue } from "../../../lib/revenue";
import { requestFinanceSource } from "../../../lib/finance-sources";

export async function GET() {
  if (!process.env.CPA_API_KEY) {
    return Response.json(
      { error: "CPA_API_KEY is not configured." },
      { status: 500 },
    );
  }

  try {
    const [source1, source2] = await Promise.all([
      requestFinanceSource("finance1", process.env.CPA_API_KEY),
      requestFinanceSource("finance2", process.env.CPA_API_KEY),
    ]);

    return Response.json(calculateRevenue(source1, source2));
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error." },
      { status: 500 },
    );
  }
}
