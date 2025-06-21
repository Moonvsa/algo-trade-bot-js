const ccxt = require('ccxt');
const { EXCHANGE, TIMEFRAMES, SYMBOLS, TIMEZONE } = require('./config');
const moment = require('moment-timezone');

class ExchangeAPI {
  constructor() {
    this.exchange = new ccxt[EXCHANGE]({
      enableRateLimit: true,
      options: { defaultType: 'future' },
    });
    this.timezone = TIMEZONE;
  }

  async fetchOHLCV(symbol, timeframe, limit = 100) {
    try {
      const data = await this.exchange.fetchOHLCV(symbol, timeframe, undefined, limit);
      return data.map(candle => ({
        timestamp: candle[0],
        datetime: moment.tz(candle[0], this.timezone).format(),
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4],
        volume: candle[5],
      }));
    } catch (error) {
      console.error(`Ошибка при получении данных: ${error}`);
      return null;
    }
  }

  async fetchMultipleTimeframes(symbol) {
    const data = {};
    for (const tf of TIMEFRAMES) {
      data[tf] = await this.fetchOHLCV(symbol, tf);
    }
    return data;
  }

  async getValidSymbols() {
    await this.exchange.loadMarkets();
    return this.exchange.symbols.filter(s => s.endsWith('/USDT'));
  }
}

module.exports = ExchangeAPI;