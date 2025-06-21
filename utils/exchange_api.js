const ccxt = require('ccxt');
const config = require('../config');

class ExchangeAPI {
  constructor() {
    this.exchange = new ccxt[config.EXCHANGE]({
      apiKey: config.API_KEY,
      secret: config.API_SECRET,
      enableRateLimit: true,
    });
  }

  async fetchHistoricalData(symbol, timeframe, since, limit = 100) {
    try {
      const data = await this.exchange.fetchOHLCV(symbol, timeframe, since, limit);
      return data.map(candle => ({
        timestamp: candle[0],
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4],
        volume: candle[5],
      }));
    } catch (error) {
      console.error(`Ошибка получения данных: ${error.message}`);
      return null;
    }
  }
}

module.exports = ExchangeAPI;