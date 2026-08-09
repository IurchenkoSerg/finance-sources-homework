export const FINANCE_API_BASE_URL = "https://cpa-server-vtel.onrender.com/api";

export const FINANCE_SOURCES = [
  {
    id: "finance1",
    name: "Finance API · Transactions",
    endpoint: `${FINANCE_API_BASE_URL}/finance1`,
    format: "Object with a transactions array",
  },
  {
    id: "finance2",
    name: "Finance API · Payments",
    endpoint: `${FINANCE_API_BASE_URL}/finance2`,
    format: 'Array of strings in the form "amount CURRENCY"',
  },
];

export async function requestFinanceSource(sourceId, apiKey) {
  const response = await fetch(`${FINANCE_API_BASE_URL}/${sourceId}`, {
    headers: { "x-api-key": apiKey },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `${sourceId} returned HTTP ${response.status} ${response.statusText}`.trim(),
    );
  }

  return response.json();
}
