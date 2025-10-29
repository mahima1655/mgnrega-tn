import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useLanguage } from '../utils/LanguageContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceChart = ({ data }) => {
  const { t } = useLanguage();

  const chartData = {
    labels: data.slice(0, 6).reverse().map(item => `${item.month} ${item.fin_year}`),
    datasets: [
      {
        label: t('jobsProvided'),
        data: data.slice(0, 6).reverse().map(item => item.total_households_worked),
        backgroundColor: 'rgba(76, 175, 80, 0.6)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 2,
      },
      {
        label: t('beneficiaries'),
        data: data.slice(0, 6).reverse().map(item => item.total_active_workers),
        backgroundColor: 'rgba(33, 150, 243, 0.6)',
        borderColor: 'rgba(33, 150, 243, 1)',
        borderWidth: 2,
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: t('performance'),
        font: {
          size: 18
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default PerformanceChart;