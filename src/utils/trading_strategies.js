const { RSI, CCI } = require('technicalindicators');
const { STRATEGY_PARAMS, THRESHOLDS, ACTIVE_FILTERS } = require('./config');

class TradingStrategies {
  static calculateRSI(data, period) {
    const closePrices = data.map(d => d.close);
    return RSI.calculate({ values: closePrices, period });
  }

  static calculateCCI(data, period) {
    const high = data.map(d => d.high);
    const low = data.map(d => d.low);
    const close = data.map(d => d.close);
    return CCI.calculate({ high, low, close, period });
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
      if (ACTIVE_FILTERS.rsi_1m) {
        const rsi1m = this.calculateRSI(dataDict['1m'], STRATEGY_PARAMS.rsi_period);
        conditions.push(rsi1m[rsi1m.length - 1] < THRESHOLDS.rsi_1m);
      }
      if (ACTIVE_FILTERS.rsi_5m) {
        const rsi5m = this.calculateRSI(dataDict['5m'], STRATEGY_PARAMS.rsi_period);
        conditions.push(rsi5m[rsi5m.length - 1] < THRESHOLDS.rsi_5m);
      }
      if (ACTIVE_FILTERS.rsi_30m) {
        const rsi30m = this.calculateRSI(dataDict['30m'], STRATEGY_PARAMS.rsi_period);
        conditions.push(rsi30m[rsi30m.length - 1] < THRESHOLDS.rsi_30m);
      }
      if (ACTIVE_FILTERS.rsi_1h) {
        const rsi1h = this.calculateRSI(dataDict['1h'], STRATEGY_PARAMS.rsi_period);
        conditions.push(rsi1h[rsi1h.length - 1] < THRESHOLDS.rsi_1h);
      }

      if (ACTIVE_FILTERS.cci_5m) {
        const cci5m = this.calculateCCI(dataDict['5m'], STRATEGY_PARAMS.cci_period);
        conditions.push(cci5m[cci5m.length - 1] < THRESHOLDS.cci_5m);
      }
      if (ACTIVE_FILTERS.cci_15m) {
        const cci15m = this.calculateCCI(dataDict['15m'], STRATEGY_PARAMS.cci_period);
        conditions.push(cci15m[cci15m.length - 1] < THRESHOLDS.cci_15m);
      }
      if (ACTIVE_FILTERS.cci_1h) {
        const cci1h = this.calculateCCI(dataDict['1h'], STRATEGY_PARAMS.cci_period);
        conditions.push(cci1h[cci1h.length - 1] < THRESHOLDS.cci_1h);
      }

      if (conditions.length === 0) {
        console.warn('⚠️ Нет активных фильтров');
        return false;
      }

      return conditions.every(c => c);
    } catch (error) {
      console.error(`🚨 Ошибка при проверке условий: ${error}`);
      return false;
    }
  }
}

module.exports = TradingStrategies;