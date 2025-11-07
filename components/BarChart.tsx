'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: { [key: string]: number };
  category?: 'political' | 'economic';
}

export default function BarChart({ data, category = 'political' }: BarChartProps) {
  const labels = Object.keys(data);
  const values = Object.values(data);

  const chartData = {
    labels,
    datasets: [
      {
        label: category === 'political' ? '정치 성향' : '경제 성향',
        data: values,
        backgroundColor: category === 'political' 
          ? 'rgba(139, 92, 246, 0.8)'
          : 'rgba(239, 68, 68, 0.8)',
        borderColor: category === 'political' 
          ? 'rgba(139, 92, 246, 1)'
          : 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: category === 'political' 
          ? 'rgba(139, 92, 246, 1)'
          : 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          font: {
            size: 12,
          },
          color: '#666',
          callback: function(value: any) {
            return value + '%';
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1,
        },
        border: {
          display: false,
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
            weight: 'bold' as const,
          },
          color: '#333',
          maxRotation: 45,
          minRotation: 0,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 8,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div className="w-full h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
}
