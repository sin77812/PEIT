'use client';

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  data: { [key: string]: number };
  category?: 'political' | 'economic';
}

export default function RadarChart({ data, category = 'political' }: RadarChartProps) {
  const labels = Object.keys(data);
  const values = Object.values(data);

  const chartData = {
    labels,
    datasets: [
      {
        label: category === 'political' ? '정치 성향' : '경제 성향',
        data: values,
        backgroundColor: category === 'political' 
          ? 'rgba(139, 92, 246, 0.2)'
          : 'rgba(239, 68, 68, 0.2)',
        borderColor: category === 'political' 
          ? 'rgba(139, 92, 246, 1)'
          : 'rgba(239, 68, 68, 1)',
        borderWidth: 3,
        pointBackgroundColor: category === 'political' 
          ? 'rgba(139, 92, 246, 1)'
          : 'rgba(239, 68, 68, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
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
      r: {
        beginAtZero: true,
        max: 100,
        min: 0,
        ticks: {
          stepSize: 20,
          display: true,
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
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1,
        },
        pointLabels: {
          font: {
            size: 14,
            weight: 'bold' as const,
          },
          color: '#333',
          padding: 20,
        },
      },
    },
    elements: {
      line: {
        tension: 0.1,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div className="w-full h-80">
      <Radar data={chartData} options={options} />
    </div>
  );
}
