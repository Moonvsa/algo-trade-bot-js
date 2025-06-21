import React, { useState, useEffect } from 'react';
import ExchangeAPI from './utils/exchange_api';
import Backtester from './utils/backtester';
import TradingStrategies from './utils/trading_strategies';
import Chart from './components/Chart';
import FilterSelector from './components/FilterSelector';
import { SYMBOLS, ACTIVE_FILTERS } from './utils/config';

function App() {
  const [symbol, setSymbol] = useState(SYMBOLS[0]);
  const [filters, setFilters] = useState(ACTIVE_FILTERS);
  const [data, setData] = useState(null);
  const [trades, setTrades] = useState([]);
  const [metrics, setMetrics] = useState({});

  const runBacktest = async () => {
    const api = new ExchangeAPI();
    const historicalData = await api.fetchMultipleTimeframes(symbol);
    if (!historicalData) return;

    TradingStrategies.ACTIVE_FILTERS = filters;
    const backtester = new Backtester(historicalData);
    const tradeResults = backtester.runBacktest();
    setData(historicalData['1h']);
    setTrades(tradeResults);
    setMetrics(backtester.getPerformanceMetrics());
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Algo Trading System</h1>
      <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
        {SYMBOLS.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <FilterSelector filters={filters} setFilters={setFilters} />
      <button onClick={runBacktest}>Запустить бэктест</button>
      {data && <Chart data={data} trades={trades} />}
      {metrics.total_trades > 0 && (
        <div>
          <h3>Результаты:</h3>
          <p>Начальный баланс: ${metrics.initial_balance.toFixed(2)}</p>
          <p>Конечный баланс: ${metrics.final_balance.toFixed(2)}</p>
          <p>Доходность: {metrics.total_return.toFixed(2)}%</p>
          <p>Всего сделок: {metrics.total_trades}</p>
          <p>Процент прибыльных: {metrics.win_rate.toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}

export default App;