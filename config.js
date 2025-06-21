require('dotenv').config();

module.exports = {
  EXCHANGE: 'binance', // Укажи свою биржу
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
  SYMBOL: 'BTC/USDT', // Торговый символ
  TIMEFRAME: '1h', // Таймфрейм
  STRATEGY: 'simple_strategy', // Используемая стратегия
  INITIAL_BALANCE: 1000, // Начальный баланс для бэктеста
  LOG_LEVEL: 'info', // Уровень логирования
};