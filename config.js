const moment = require('moment-timezone');

module.exports = {
  EXCHANGE: 'binance',                    // Биржа
  TIMEFRAMES: ['1m', '5m', '15m', '30m', '1h'], // Таймфреймы
  SYMBOLS: ['BTC/USDT', 'ETH/USDT'],      // Торговые пары
  TIMEZONE: moment.tz.zone('UTC'),        // Часовой пояс
  STRATEGY_PARAMS: {                      // Параметры стратегии
    rsi_period: 14,                       // Период для RSI
    cci_period: 20                        // Период для CCI
  },
  THRESHOLDS: {                           // Пороговые значения индикаторов
    rsi_1m: 50,
    rsi_5m: 50,
    rsi_30m: 50,
    rsi_1h: 55,
    cci_5m: 70,
    cci_15m: 75,
    cci_1h: 80
  },
  RISK_PARAMS: {                          // Параметры управления рисками
    max_position_size: 0.1,               // Максимальный размер позиции (10% от баланса)
    stop_loss_pct: 2,                     // Стоп-лосс (2%)
    take_profit_pct: 4                    // Тейк-профит (4%)
  },
  ACTIVE_FILTERS: {                       // Активные фильтры для проверки условий
    rsi_1m: true,
    rsi_5m: true,
    rsi_30m: true,
    rsi_1h: true,
    cci_5m: true,
    cci_15m: true,
    cci_1h: true
  }
};