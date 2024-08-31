import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  DoughnutController,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { height, width } from "@mui/system";

// Register the required components
ChartJS.register(ArcElement, DoughnutController, Title, Tooltip, Legend);

type DatasetProps = {
  label: string;
  data: number[];
  fill?: boolean;
};

type DoughnutDataProps = {
  chartData: {
    labels: string[];
    datasets: DatasetProps[];
  };
};

const DoughnutChart = ({ doughnutData }: DoughnutDataProps) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Monthly cost per FG",
        width: 10,
        height: 10
      },
    },
  };

  return (
    <Doughnut data={doughnutData} options={options} />
  );
};

export default DoughnutChart;
