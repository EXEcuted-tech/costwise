import React, { useState, useEffect } from "react";
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
import api from "@/utils/api";

// Register components from Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Product {
  productName: string;
  cost: number;
}

interface ChartDataEntry {
  monthYear: string;
  products: Product[];
}

interface ProductCostChartProps {
  selectedYear: string;
  selectedHalf: string;
}

const ProductCostChart: React.FC<ProductCostChartProps> = ({ selectedYear = "2022", selectedHalf = "First" }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [priceData, setPriceData] = useState<ChartDataEntry[]>([]);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await api.get("/training/data");
        const fetchedData = JSON.parse(response.data.data[0].settings);
        setPriceData(fetchedData);
      } catch (error) {
        console.error("Error fetching file: ", error);
      }
    };

    fetchFile();
  }, []);

  const filterDataByYearAndHalf = () => {
    return priceData.filter((entry) => {
      const [month, year] = entry.monthYear.split(" ");
      if (year === selectedYear) {
        const monthIndex = new Date(`${month} 1, ${year}`).getMonth() + 1;
        if (selectedHalf === "first") {
          return monthIndex >= 1 && monthIndex <= 6;
        } else {
          return monthIndex >= 7 && monthIndex <= 12;
        }
      }
      return false;
    });
  };

  useEffect(() => {
    const prepareChartData = () => {
      const filteredData = filterDataByYearAndHalf();

      if (!filteredData || filteredData.length === 0) return;
      const labels = filteredData.map((entry) => entry.monthYear);

      const costNames = Array.from(new Set(filteredData.flatMap(entry =>
        entry.products.map(product => product.productName)
      )));

      const datasets = costNames.map((costName, index) => {
        const data = filteredData.map(entry => {
          const product = entry.products.find(product => product.productName === costName);
          return product ? product.cost : 0;
        });

        return {
          label: costName,
          data,
          borderColor: `hsl(${(index * 60) % 360}, 100%, 50%)`,
          borderWidth: 2,
          fill: false,
        };
      });

      setChartData({
        labels,
        datasets,
      });
    };

    prepareChartData();
  }, [priceData, selectedYear, selectedHalf]);

  if (!chartData) return <p>Loading chart...</p>;

  return (
    <div className="h-full w-full">
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Cost per Month/Year",
            },
          },
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
        }}
      />
    </div>
  );
};

export default ProductCostChart;

