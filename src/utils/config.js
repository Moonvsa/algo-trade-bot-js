module.exports = {
  EXCHANGE: 'binance',
  TIMEFRAMES: ['1m', '5m', '15m', '30m', '1h'],
  SYMBOLS: ['BTC/USDT', 'ETH/USDT'],
  TIMEZONE: 'UTC',
  STRATEGY_PARAMS: {
    rsi_period: 14,
    cci_period: 20,
  },
  THRESHOLDS: {
    rsi_1m: 50,
    rsi_5m: 50,
    rsi_30m: 50,
    rsi_1h: 55,
    cci_5m: 70,
    cci_15m: 75,
    cci_1h: 80,
  },
  RISK_PARAMS: {
    max_position_size: 0.1,  // 10% от баланса
    stop_loss_pct: 2,        // 2% стоп-лосс
    take_profit_pct: 4,      // 4% тейк-профит
  },
  ACTIVE_FILTERS: {
    rsi_1m: true,
    rsi_5m: true,
    rsi_30m: true,
    rsi_1h: true,
    cci_5m: true,
    cci_15m: true,
    cci_1h: true,
  },
};