import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const datasets = {
  2023: [10, 25, 13, 18, 30, 25, 5, 15, 23, 66],
  2024: [15, 30, 20, 25, 35, 30, 12, 55, 23, 52],
};

const LineChart: React.FC<{ className?: string }> = ({ className }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [selectedYear, setSelectedYear] = useState("2023");
  const [selectedHalf, setSelectedHalf] = useState("first");

  const getData = () => {
    const data = datasets[selectedYear];
    return selectedHalf === "first" ? data.slice(0, 6) : data.slice(6);
  };

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        const labels = ["January", "February", "March", "April", "May", "June"];
        chartInstanceRef.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Budgeted Cost",
                data: getData(),
                borderColor: "#FEF200",
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
                  text: "Months",
                  font: {
                    size: 20,
                    weight: "bold",
                    family: "Arial",
                  },
                  color: "#B22222",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Values",
                  font: {
                    size: 20,
                    weight: "bold",
                    family: "Arial",
                  },
                  color: "#B22222",
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
  }, [selectedYear, selectedHalf]);

  return (
    <div
      className={`relative flex flex-grow justify-center items-center ${className} -z-1`}
    >
      <canvas ref={chartRef} />
    </div>
  );
  // return (
  //   <div className={`relative flex flex-col items-center ${className}`}>
  //     <div>
  //       <button onClick={() => setSelectedYear("2023")}>2023</button>
  //       <button onClick={() => setSelectedYear("2024")}>2024</button>
  //     </div>
  //     <div>
  //       <button onClick={() => setSelectedHalf("first")}>First Half</button>
  //       <button onClick={() => setSelectedHalf("second")}>Second Half</button>
  //     </div>
  //     <canvas ref={chartRef} />
  //   </div>
  // );
};

export default LineChart;
