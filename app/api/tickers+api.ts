export async function GET(request: Request) {
  const ticker = request.url.split('?')[1].split('=')[1];
  console.log('ticker', ticker);
  const startDate = new Date(
    Date.now() - 364 * 24 * 60 * 60 * 1000
  ).toISOString();
  const endDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString();
  const interval = '1d';
  const limit = 365;
  const quote = 'usd';
  const response = await fetch(
    `https://api.coinpaprika.com/v1/tickers/${ticker}/historical?start=${startDate}&end=${endDate}&interval=${interval}&limit=${limit}&quote=${quote}`,
    {
      method: 'GET',
    }
  );
  const data = await response.json();
  return Response.json(data);
}
