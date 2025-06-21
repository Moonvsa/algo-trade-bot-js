import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Chart = ({ data, trades }) => {
  const chartData = {
    labels: data.map(d => d.datetime),
    datasets: [
      {
        label: 'Цена закрытия',
        data: data.map(d => d.close),
        borderColor: 'blue',
        fill: false,
      },
      {
        label: 'Покупка',
        data: trades.map(t => ({ x: t.entry_time, y: t.entry_price })),
        type: 'scatter',
        pointBackgroundColor: 'green',
        pointRadius: 5,
      },
      {
        label: 'Продажа',
        data: trades.map(t => ({ x: t.exit_time, y: t.exit_price })),
        type: 'scatter',
        pointBackgroundColor: 'red',
        pointRadius: 5,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default Chart;