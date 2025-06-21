const { RSI, CCI } = require('technicalindicators');
const config = require('../config');

class TradingStrategies {
  static calculateRSI(data, period) {
    const closes = data.map(d => d.close);
    return RSI.calculate({ values: closes, period });
  }

  static calculateCCI(data, period) {
    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);
    const closes = data.map(d => d.close);
    return CCI.calculate({ high: highs, low: lows, close: closes, period });
  }

  static checkAllConditions(dataDict) {
    const requiredTFs = ['1m', '5m', '15m', '30m', '1h'];
    for (const tf of requiredTFs) {
      if (!dataDict[tf] || dataDict[tf].length === 0) {
        console.warn(`⚠️ Отсутствуют данные для таймфрейма ${tf}`);
        return false;
      }
    }

    const conditions = [];
    try {
      if (config.ACTIVE_FILTERS.rsi_11m) {
        const rsi1m = this.calculateRSI(dataDict['1m'], config.STRATEGY_PARAMS.rsi_period);
        conditions.push(rsi1m[rsi1m.length - 1] < config.THRESHOLDS.rsi_1m);
      }
      if (config.ACTIVE_FILTERS.rsi_5m) {
        const rsi5m = this.calculateRSI(dataDict['5m'], config.STRATEGY_PARAMS.rsi_period);
        conditions.push(rsi5m[rsi5m.length - 1] < config.THRESHOLDS.rsi_5m);
      }
      if (config.ACTIVE_FILTERS.rsi_30m) {
        const rsi30m = this.calculateRSI(dataDict['30m'], config.STRATEGY_PARAMS.rsi_period);
        conditions.push(rsi30m[rsi30m.length - 1] < config.THRESHOLDS.rsi_30m);
      }
      if (config.ACTIVE_FILTERS.rsi_1h) {
        const rsi1h = this.calculateRSI(dataDict['1h'], config.STRATEGY_PARAMS.rsi_period);
        conditions.push(rsi1h[rsi1h.length - 1] < config.THRESHOLDS.rsi_1h);
      }
      if (config.ACTIVE_FILTERS.cci_5m) {
        const cci5m = this.calculateCCI(dataDict['5m'], config.STRATEGY_PARAMS.cci_period);
        conditions.push(cci5m[cci5m.length - 1] < config.THRESHOLDS.cci_5m);
      }
      if (config.ACTIVE_FILTERS.cci_15m) {
        const cci15m = this.calculateCCI(dataDict['15m'], config.STRATEGY_PARAMS.cci_period);
        conditions.push(cci15m[cci15m.length - 1] < config.THRESHOLDS.cci_15m);
      }
      if (config.ACTIVE_FILTERS.cci_1h) {
        const cci1h = this.calculateCCI(dataDict['1h'], config.STRATEGY_PARAMS.cci_period);
        conditions.push(cci1h[cci1h.length - 1] < config.THRESHOLDS.cci_1h);
      }

      if (conditions.length === 0) {
        console.warn('⚠️ Нет активных фильтров');
        return false;
      }

      return conditions.every(c => c);
    } catch (error) {
      console.error(`🚨 Ошибка при проверке условий: ${error.message}`);
      return false;
    }
  }
}

module.exports = TradingStrategies;