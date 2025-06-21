const { RSI } = require('technicalindicators');
const config = require('../config');

class Backtester {
  constructor(historicalData, strategy, initialBalance) {
    this.data = historicalData;
    this.strategy = strategy;
    this.balance = initialBalance;
    this.position = null;
    this.trades = [];
  }

  run() {
    const closes = this.data.map(d => d.close);
    const rsiValues = RSI.calculate({ values: closes, period: 14 });

    for (let i = 1; i < this.data.length; i++) {
      const currentRSI = rsiValues[i - 1];
      const currentPrice = this.data[i].close;

      if (!this.position && currentRSI < 30) {
        this.position = { entryPrice: currentPrice, entryTime: this.data[i].timestamp };
      } else if (this.position && currentRSI > 70) {
        const profit = currentPrice - this.position.entryPrice;
        this.trades.push({
          entryTime: this.position.entryTime,
          exitTime: this.data[i].timestamp,
          profit,
        });
        this.balance += profit;
        this.position = null;
      }
    }

    return {
      finalBalance: this.balance,
      totalTrades: this.trades.length,
      winRate: (this.trades.filter(t => t.profit > 0).length / this.trades.length) * 100 || 0,
    };
  }
}

module.exports = Backtester;