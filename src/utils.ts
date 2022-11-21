const API_URL = "https://api.coingecko.com/api/v3";

export async function getCoinCurrentPrice(coinId: string): Promise<number> {
  const URL = `${API_URL}/simple/price?ids=${coinId}&vs_currencies=usd`;

  const res = await fetch(URL);
  const data = await res.json();

  return data[coinId].usd;
}

export function formatToCurrency(value: number): string {
  return value.toLocaleString("en-US", {
    currency: "USD",
    style: "currency",
  });
}

// dateString should be in format dd-mm-yyyy
export async function searcHistoricalPrice(
  coinId: string,
  dateString: string
): Promise<number> {
  const URL = `${API_URL}/coins/${coinId}/history?date=${dateString}`;

  const res = await fetch(URL);
  const data = await res.json();

  return data.market_data.current_price.usd;
}
