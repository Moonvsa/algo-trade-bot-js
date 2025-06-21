const ExchangeAPI = require('./utils/exchange_api');
const Backtester = require('./utils/backtester');
const config = require('./config');

async function main() {
  console.log('Запуск бэктестинга...');
  
  const api = new ExchangeAPI();
  await api.loadMarkets();

  const symbol = config.SYMBOLS[0]; // Берем первый символ из списка
  const data = await api.fetchMultipleTimeframes(symbol);

  if (!data || Object.values(data).some(tf => !tf)) {
    console.error('❌ Ошибка: данные не получены');
    return;
  }

  console.log('\nПолученные таймфреймы:');
  for (const tf in data) {
    console.log(`- ${tf}: ${data[tf].length} свечей`);
  }

  const backtester = new Backtester(data);
  const report = backtester.runBacktest();

  if (report.length > 0) {
    console.log('\nРезультаты торговли:');
    report.forEach(trade => {
      console.log(`Вход: ${trade.entry_time}, Цена входа: ${trade.entry_price}, Цена выхода: ${trade.exit_price}, Прибыль: ${trade.profit.toFixed(2)}`);
    });

    const metrics = backtester.getPerformanceMetrics();
    console.log(`\nМетрики производительности:`);
    console.log(`Начальный баланс: $${metrics.initial_balance.toFixed(2)}`);
    console.log(`Итоговый баланс: $${metrics.final_balance.toFixed(2)}`);
    console.log(`Доходность: ${metrics.total_return.toFixed(2)}%`);
    console.log(`Всего сделок: ${metrics.total_trades}`);
    console.log(`Процент выигрышных сделок: ${metrics.win_rate.toFixed(2)}%`);
  } else {
    console.log('\nТорговые сигналы не сгенерированы');
  }
}

main().catch(error => console.error(`Ошибка в main: ${error.message}`));