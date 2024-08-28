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
        position: "bottom",
      },
      title: {
        display: true,
        text: "Monthly cost per FG",
      },
    },
  };
  const textCenter = {
    id: "textCenter",
    beforeDatasetsDraw(chart, args, pluginOptions) {
      const { ctx, data } = chart;

      ctx.save();
      ctx.font = "bolder 30px sans-serif";
      (ctx.fillStyle = "red"),
        ctx.fillText("text", chart.getDatasetMeta(0).data[0].x, y);
    },
  };

  return (
    <Doughnut data={doughnutData} options={options} plugins={textCenter} />
  );
};

export default DoughnutChart;
