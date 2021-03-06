const apiBase = `https://api.polygon.io`;
const apiKey = process.env.API_KEY;
let mic = `XNAS`;

const stockAPI = {
  stocks: `${apiBase}/v3/reference/tickers?market=stocks&exchange=${mic}&active=true&sort=ticker&order=asc&apiKey=${apiKey}`,
  stockDetails: (ticker) => `${apiBase}/v1/meta/symbols/${ticker}/company?&apiKey=${apiKey}`,
  stockPrevDay: (ticker) =>
    `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${apiKey}`,
};

module.exports = stockAPI;
