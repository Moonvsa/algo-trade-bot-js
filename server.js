const ExchangeAPI = require('./utils/exchange_api');
const config = require('./config');

const api = new ExchangeAPI();

async function runBacktest() {
  const since = Date.now() - 1000 * 60 * 60 * 24 * 30; // Например, данные за 30 дней
  const historicalData = await api.fetchOHLCV(config.SYMBOL, config.TIMEFRAME, since, 1000);
  console.log(historicalData);
}

runBacktest();