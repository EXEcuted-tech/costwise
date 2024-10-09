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
  data: ChartDataEntry[];
}

const ProductCostChart = ({ data }: ProductCostChartProps) => {
  const [chartData, setChartData] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(
    "VIRGINIA Cocktail Hotdog 250g"
  );

  // Handle product selection
  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
  };

  return (
    <div>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Cost per Month/Year",
            },
          },
        }}
      />
    </div>
  );
};

export default ProductCostChart;
