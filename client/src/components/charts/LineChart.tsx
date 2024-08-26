import React from "react";
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

type DatasetProps = {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
  fill?: boolean;
};

type ChartDataProps = {
  chartData: {
    labels: string[];
    datasets: DatasetProps[];
  };
};

const LineChart = ({ chartData }: ChartDataProps) => {
  return <Line data={chartData} />;
};

export default LineChart;
