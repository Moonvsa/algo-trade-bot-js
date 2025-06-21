const ExchangeAPI = require('./utils/exchange_api');
const Backtester = require('./utils/backtester');
const config = require('./config');
const moment = require('moment-timezone');

async function runBacktest() {
  const api = new ExchangeAPI();
  const since = moment().subtract(1, 'year').valueOf(); // Данные за год
  const historicalData = await api.fetchHistoricalData(config.SYMBOL, config.TIMEFRAME, since, 1000);

  if (!historicalData) {
    console.error('Не удалось получить данные');
    return;
  }

  const backtester = new Backtester(historicalData, config.STRATEGY, config.INITIAL_BALANCE);
  const results = backtester.run();

  console.log('Результаты бэктестинга:');
  console.log(`Итоговый баланс: ${results.finalBalance.toFixed(2)}`);
  console.log(`Всего сделок: ${results.totalTrades}`);
  console.log(`Процент выигрышей: ${results.winRate.toFixed(2)}%`);
}

runBacktest();