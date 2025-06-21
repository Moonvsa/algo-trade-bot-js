// backtester.js
const ExchangeAPI = require('./utils/exchange_api');
const TradingStrategies = require('./strategies/trading_strategies');
const config = require('./config');

/**
 * Запуск бэктеста по заданной стратегии и таймфрейму
 * @param {string} strategy — имя стратегии ('rsi' или 'cci')
 * @param {string} timeframe — таймфрейм ('1m','5m',…)
 * @param {number} initialBalance — стартовый баланс (USDT)
 * @returns {Promise<Array>} — список сделок вида { entryTime, exitTime, entryPrice, exitPrice, profitPct }
 */
async function run(strategy = 'rsi', timeframe = config.TIMEFRAME, initialBalance = 1000) {
  // 1) Загрузка исторических данных по всем таймфреймам
  const api = new ExchangeAPI();
  const since = Date.now() - 1000 * 60 * 60 * 24 * 30; // последние 30 дней
  const data = {};
  for (const tf of config.TIMEFRAMES) {
    data[tf] = await api.fetchOHLCV(config.SYMBOL, tf, since, 1000);
    if (!data[tf]) {
      throw new Error(`Не удалось загрузить данные для ${tf}`);
    }
  }

  // 2) Инициализация переменных
  const candles = data[timeframe];
  const trades = [];
  let balance = initialBalance;
  let openPos = null;

  // 3) Основной цикл по свечам
  for (let i = 1; i < candles.length; i++) {
    const candle = candles[i];

    // Если есть открытая позиция — проверяем стоп‑лосс/тейк‑профит
    if (openPos) {
      if (candle.close <= openPos.stop_loss || candle.close >= openPos.take_profit) {
        // Закрываем позицию
        const profit = (candle.close - openPos.entry_price) * openPos.size;
        balance += openPos.size * candle.close;

        trades.push({
          entryTime: openPos.entry_time,
          exitTime: candle.timestamp,
          entryPrice: openPos.entry_price,
          exitPrice: candle.close,
          profitPct: ((candle.close / openPos.entry_price - 1) * 100)
        });

        openPos = null;
      }
    } else {
      // Нет открытой позиции — проверяем условия стратегии
      // Здесь мы используем общий метод: TradingStrategies.checkAllConditions
      // (он смотрит и RSI, и CCI везде, согласно config) :contentReference[oaicite:0]{index=0}
      if (TradingStrategies.checkAllConditions(data)) {
        // Открываем новую позицию
        const size = (balance * config.RISK_PARAMS.max_position_size) / candle.close;
        openPos = {
          entry_time: candle.timestamp,
          entry_price: candle.close,
          size,
          stop_loss: candle.close * (1 - config.RISK_PARAMS.stop_loss_pct / 100),
          take_profit: candle.close * (1 + config.RISK_PARAMS.take_profit_pct / 100)
        };
        balance -= size * candle.close;
      }
    }
  }

  return trades;
}

module.exports = { run };
