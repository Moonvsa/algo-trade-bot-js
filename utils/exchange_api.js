const ccxt = require('ccxt');
const config = require('../config');

class ExchangeAPI {
  constructor() {
    try {
      this.exchange = new ccxt[config.EXCHANGE]({
        enableRateLimit: true,              // Ограничение скорости запросов
        options: { defaultType: 'future' }  // Тип рынка (фьючерсы)
      });
    } catch (error) {
      throw new Error(`Биржа ${config.EXCHANGE} не поддерживается`);
    }
  }

  async loadMarkets() {
    try {
      await this.exchange.loadMarkets();
      console.log('Рынки успешно загружены');
    } catch (error) {
      console.error(`Ошибка при загрузке рынков: ${error.message}`);
    }
  }

  async fetchOHLCV(symbol, timeframe, limit = 100) {
    try {
      const data = await this.exchange.fetchOHLCV(symbol, timeframe, undefined, limit);
      return data.map(candle => ({
        timestamp: candle[0],
        datetime: new Date(candle[0]).toISOString(),
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4],
        volume: candle[5]
      }));
    } catch (error) {
      console.error(`Ошибка при получении данных OHLCV для ${symbol} (${timeframe}): ${error.message}`);
      return null;
    }
  }

  async fetchMultipleTimeframes(symbol) {
    const data = {};
    for (const tf of config.TIMEFRAMES) {
      data[tf] = await this.fetchOHLCV(symbol, tf);
    }
    return data;
  }
}

module.exports = ExchangeAPI;