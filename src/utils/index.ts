const API_URL = "https://api.coingecko.com/api/v3";

export async function getBitcoinPrice() {
  const URL = `${API_URL}/simple/price?ids=bitcoin&vs_currencies=usd`;

  const res = await fetch(URL);
  const data = await res.json();

  return data.bitcoin.usd;
}

export function formatToCurrency(value: number) {
  return value.toLocaleString("en-US", {
    currency: "USD",
    style: "currency",
  });
}
