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


        const labels = ['January', 'February', 'March', 'April', 'May'];
        const dataset1Data = [10, 25, 13, 18, 30];
        const dataset2Data = [20, 15, 28, 22, 10];

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
                  color: '#B22222',
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
                  color: '#B22222',
                },
                beginAtZero: true,
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
    <div className={`relative px-2 py-4 ${className}`}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default LineChart;
