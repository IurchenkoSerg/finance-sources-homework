const API_BASE_URL = "https://cpa-server-vtel.onrender.com/api";
const API_KEY = "prodcpakey333";

async function requestJson(path) {
  const response = await fetch(`${API_BASE_URL}/${path}`, {
    headers: {
      "x-api-key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Server request failed with status ${response.status}.`);
  }

  return response.json();
}

export async function fetchFinanceSources() {
  const [source1, source2] = await Promise.all([
    requestJson("finance1"),
    requestJson("finance2"),
  ]);

  return { source1, source2 };
}
