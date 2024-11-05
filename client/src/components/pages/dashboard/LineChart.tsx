import React, { useState, useEffect, useRef } from "react";
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
  className?: string;
  colorMode?: string;
}

const ProductCostChart: React.FC<ProductCostChartProps> = ({
  selectedYear,
  selectedHalf,
  className,
  colorMode
}) => {
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
      const [month, year] = entry.monthYear
        .split(" ")
        .map((item) => item.trim());
      const monthIndex = new Date(`${month} 1, ${year}`).getMonth() + 1;

      if (year === selectedYear) {
        if (selectedHalf === "First") {
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

      const costNames = Array.from(
        new Set(
          filteredData.flatMap((entry) =>
            entry.products.map((product) => product.productName)
          )
        )
      );

      const datasets = costNames.map((costName, index) => {
        const data = filteredData.map((entry) => {
          const product = entry.products.find(
            (product) => product.productName === costName
          );
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

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (colorMode === 'dark') {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, [colorMode]);

  if (!chartData) {
    return (
      <div className="flex flex-col items-center justify-center animate-fadeIn">
        <h2 className="text-4xl font-semibold text-gray-700 transition-transform dark:text-white transform hover:scale-105">
          No Data Available
        </h2>
        <p className="mt-2 text-gray-500 text-2xl transition-transform transform dark:text-[#d1d1d1] hover:scale-105">
          Please select a year half to view the data.
        </p>
      </div>
    );
  }

  return (
    <div className={`h-full w-full ${className}`}>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              labels:{
                color: isDarkMode ? "#ffffff" : "#666666",
              },
            },
            title: {
              display: true,
              text: `Cost per Month/Year (${selectedYear} - ${selectedHalf})`,
              color: isDarkMode ? "#ffffff" : "#666666",
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
                color: isDarkMode ? "#e31b1b" : "#B22222",
              },
              ticks: {
                color: isDarkMode ? "#ffffff" : "#666666",
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
                color: isDarkMode ? "#e31b1b" : "#B22222",
              },
              ticks: {
                color: isDarkMode ? "#ffffff" : "#666666",
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
