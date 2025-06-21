module.exports = {
  // Биржа для CCXT
  EXCHANGE: 'binance',

  // Символ(ы) для торговли и бэктестинга
  SYMBOL: 'BTC/USDT',             // для single fetch
  SYMBOLS: ['BTC/USDT'],         // для множественного fetch

  // Таймфрейм(ы)
  TIMEFRAME: '1m',                // для single fetchOHLCV
  TIMEFRAMES: ['1m', '5m', '15m', '30m', '1h'],  // для fetchMultipleTimeframes

  // Стратегии
  STRATEGIES: ['rsi', 'cci'],     // доступные стратегии

  // Параметры риска
  RISK_PARAMS: {
    max_position_size: 0.01,      // доля баланса, рискуемая в одной позиции
    stop_loss_pct: 1,             // % стоп-лосса
    take_profit_pct: 2            // % тейк-профита
  },

  // Параметры стратегий
  STRATEGY_PARAMS: {
    rsi: { period: 14, threshold: { low: 30, high: 70 } },
    cci: { period: 20, threshold: { low: -100, high: 100 } }
  }
};