const TradingStrategies = require('../strategies/trading_strategies');
const config = require('../config');

class Backtester {
  constructor(historicalData, initialBalance = 10000) {
    this.data = historicalData;
    this.initialBalance = initialBalance;
    this.currentBalance = initialBalance;
    this.trades = [];
    this.openPositions = [];
  }

  _calculatePositionSize(price) {
    const riskAmount = this.currentBalance * config.RISK_PARAMS.max_position_size;
    return riskAmount / price;
  }

  _openPosition(candle) {
    const position = {
      entry_time: candle.datetime,
      entry_price: candle.close,
      size: this._calculatePositionSize(candle.close),
      stop_loss: candle.close * (1 - config.RISK_PARAMS.stop_loss_pct / 100),
      take_profit: candle.close * (1 + config.RISK_PARAMS.take_profit_pct / 100)
    };
    this.currentBalance -= position.size * position.entry_price;
    this.openPositions.push(position);
    return position;
  }

  _closePosition(position, candle) {
    const profit = (candle.close - position.entry_price) * position.size;
    this.currentBalance += position.size * candle.close;
    const trade = {
      ...position,
      exit_time: candle.datetime,
      exit_price: candle.close,
      profit,
      balance: this.currentBalance
    };
    this.trades.push(trade);
    this.openPositions = this.openPositions.filter(p => p !== position);
    return trade;
  }

  _checkExitConditions(candle) {
    for (const pos of [...this.openPositions]) {
      if (candle.close <= pos.stop_loss || candle.close >= pos.take_profit) {
        this._closePosition(pos, candle);
      }
    }
  }

  runBacktest() {
    const mainData = this.data['1m']; // Используем 1-минутный таймфрейм как основной
    for (let i = 1; i < mainData.length; i++) {
      const currentCandle = mainData[i];
      if (TradingStrategies.checkAllConditions(this.data)) {
        if (this.openPositions.length === 0 && this.currentBalance > 0) {
          this._openPosition(currentCandle);
        }
      }
      this._checkExitConditions(currentCandle);
    }
    return this.trades;
  }

  getPerformanceMetrics() {
    if (this.trades.length === 0) return {};
    const totalReturn = ((this.currentBalance / this.initialBalance - 1) * 100);
    const winningTrades = this.trades.filter(t => t.profit > 0).length;
    return {
      initial_balance: this.initialBalance,
      final_balance: this.currentBalance,
      total_return: totalReturn,
      total_trades: this.trades.length,
      win_rate: (winningTrades / this.trades.length) * 100
    };
  }
}

module.exports = Backtester;