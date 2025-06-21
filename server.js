// server.js
const express = require('express');
const path = require('path');
const ExchangeAPI = require('./utils/exchange_api');
const backtester = require('./utils/backtester');
const config = require('./config');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

// OHLCV
app.get('/api/ohlcv', async (req, res) => {
  try {
    const { symbol = config.SYMBOL, timeframe = config.TIMEFRAME } = req.query;
    const since = Date.now() - 1000 * 60 * 60 * 24 * 30; // 30 дней
    const data = await new ExchangeAPI().fetchOHLCV(symbol, timeframe, since, 1000);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Бэктестинг
app.get('/api/backtest', async (req, res) => {
  try {
    const { strategy = 'rsi', timeframe = config.TIMEFRAME } = req.query;
    const initialBalance = 1000;
    const trades = await backtester.run(strategy, timeframe, initialBalance);
    const totalProfit = trades.reduce((sum, t) => sum + t.profitPct, 0);
    res.json({ initialBalance, totalProfit, trades });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
