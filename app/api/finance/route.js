import { calculateRevenue } from "../../../lib/revenue";

const API_BASE_URL = "https://cpa-server-vtel.onrender.com/api";

async function requestSource(path) {
  const response = await fetch(`${API_BASE_URL}/${path}`, {
    headers: {
      "x-api-key": process.env.CPA_API_KEY,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Finance server returned status ${response.status}.`);
  }

  return response.json();
}

export async function GET() {
  if (!process.env.CPA_API_KEY) {
    return Response.json(
      { error: "CPA_API_KEY is not configured." },
      { status: 500 },
    );
  }

  try {
    const [source1, source2] = await Promise.all([
      requestSource("finance1"),
      requestSource("finance2"),
    ]);

    return Response.json(calculateRevenue(source1, source2));
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error." },
      { status: 500 },
    );
  }
}
