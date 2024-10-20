// components/LineChart.tsx

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface LineChartProps {
  className?: string;
}

const LineChart: React.FC<LineChartProps> = ({className}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {


        const labels = ['January', 'February', 'March', 'April', 'May','June'];
        const dataset1Data = [10, 25, 13, 18, 30, 25];
        const dataset2Data = [20, 15, 28, 22, 10, 15];

        const bodyClass = window.document.body.classList;
        const isDarkMode = bodyClass.contains('dark');
        
        chartInstanceRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Budgeted Cost',
                data: dataset1Data,
                borderColor: '#FEF200',
                borderWidth: 2,
                fill: false,
              },
              {
                label: 'Actual Cost',
                data: dataset2Data,
                borderColor: '#B22222',
                borderWidth: 2,
                fill: false,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Months',
                  font: {
                    size: 20,
                    weight: 'bold',
                    family: 'Arial',
                  },
                  color: isDarkMode ? '#FFFFFF' : '#B22222',
                },
                ticks: {
                  color: isDarkMode ? '#FFFFFF' : '#000000',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Values',
                  font: {
                    size: 20,
                    weight: 'bold',
                    family: 'Arial',
                  },
                  color: isDarkMode ? '#FFFFFF' : '#B22222',
                },
                beginAtZero: true,
                ticks: {
                  color: isDarkMode ? '#FFFFFF' : '#000000',
                },
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: isDarkMode ? '#FFFFFF' : '#000000',
                },
              },
            },
          },
        });
      }
    }
    
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className={`relative flex flex-grow justify-center items-center px-0 2xl:px-2 py-4 dark:text-white ${className}`}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default LineChart;
