import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import _ from "lodash";
import * as tf from "@tensorflow/tfjs";
import api from "@/utils/api";
import { initialize } from "next/dist/server/lib/render-server";
interface Product {
  productName: string;
  cost: number;
}

interface CostDataEntry {
  monthYear: string;
  products: Product[];
}

interface MonthDataEntry {
  monthYear: string;
  cost: number;
}

interface ProductEntry {
  product_num: number;
  product_name: string;
  cost: number;
  monthYear: string;
}

function TrainingModel() {
  const [costData, setCostData] = useState<CostDataEntry[]>([]);
  const [model, setModel] = useState<tf.Sequential | null>(null);
  const [trained, setTrained] = useState(false);
  const [lossHistory, setLossHistory] = useState<number[]>([]);
  const [latestDate, setLatestDate] = useState(0);
  let currentMonthYear: string = "";
  const [trainingSpeed, setTrainingSpeed] = useState<number>(0);

  const addNewData = (newData: CostDataEntry[]) => {
    setCostData((prevData) => [...prevData, ...newData]);
  };

  const [totalPrediction, setTotalPrediction] = useState<MonthDataEntry[]>([]);

  const [metrics, setMetrics] = useState({
    mse: 0,
    precision: 0,
    accuracy: 0,
  });

  // Month-Year conversion to number
  function monthYearToNumber(monthYearValue: string): number {
    const [month, year] = monthYearValue.split(" ");
    const monthIndex =
      new Date(Date.parse(month + " 1, " + year)).getMonth() + 1;
    return (parseInt(year) - 2022) * 12 + monthIndex;
  }

  // Numbert to Month-Year coversion
  function numberToMonthYear(value: number): string {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthIndex = (value - 1) % 12;
    const year = Math.floor((value - 1) / 12) + 2022;

    const month = months[monthIndex];
    return `${month} ${year}`;
  }

  function measurePerformance(callback: () => Promise<void>, label: string) {
    const start = performance.now();
    return callback().then(() => {
      const end = performance.now();
      console.log(`${label} took ${(end - start).toFixed(2)} milliseconds`);
    });
  }

  // Helper function for cost extraction
  const getProductCosts = (productName: string): number[] =>
    costData.flatMap((entry) =>
      entry.products
        .filter((product) => product.productName === productName)
        .map((product) => product.cost)
    );

  // Initialize or retrain the model with the current dataset
  const initializeModel = async () => {
    console.log("Currently training model, please wait for results...");

    const monthYears = costData.map((d) => monthYearToNumber(d.monthYear));
    const currentLossHistory: number[] = [];

    // Extract costs for each product
    const vch250gCost = getProductCosts("VIRGINIA Cocktail Hotdog 250g");
    const sh250gCost = getProductCosts("VIRGINIA Sweet Ham 250g");
    const vChH250gCost = getProductCosts("VIRGINIA Chicken Hotdog 250g");
    const cdcH250gCost = getProductCosts("VIRGINIA Chorizo de Cebu 250g");

    const newModel = model || createModel();

    const inputTensor = tf.tensor2d(monthYears, [monthYears.length, 1]);
    const labelTensor = tf.tensor2d(
      [vch250gCost, sh250gCost, vChH250gCost, cdcH250gCost],
      [4, monthYears.length]
    );

    const earlyStopping = tf.callbacks.earlyStopping({
      monitor: "loss",
      patience: 5,
    });

    const startTime = performance.now();

    newModel
      .fit(inputTensor, labelTensor.transpose(), {
        epochs: 1000,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            if (logs?.loss) currentLossHistory.push(logs.loss / 4);
          },
          ...[earlyStopping],
        },
      })
      .then(async () => {
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;
        console.log("Training complete");
        setTrainingSpeed(duration.toFixed(2));
        console.log(
          `Model training complete in ${duration.toFixed(2)} seconds`
        );
        console.log(JSON.stringify(newModel.toJSON()));
        // newModel.evaluate()
        setModel(newModel);
        setModel(newModel);
        setTrained(true);
        setLossHistory(currentLossHistory);
      });
  };

  const makePrediction = async () => {
    if (trained && model) {
      await measurePerformance(async () => {
        const productNames = [
          "VIRGINIA Cocktail Hotdog 250g",
          "VIRGINIA Sweet Ham 250g",
          "VIRGINIA Chicken Hotdog 250g",
          "VIRGINIA Chorizo de Cebu 250g",
        ];

        // Get the last monthYear from costData
        const lastMonthYearNumber = monthYearToNumber(
          costData[costData.length - 1].monthYear
        );

        for (
          let i = lastMonthYearNumber + 1;
          i <= lastMonthYearNumber + 3;
          i++
        ) {
          const predictionTensor = model.predict(
            tf.tensor2d([[i]])
          ) as tf.Tensor;
          const predictionArray = await predictionTensor.array();

          const monthYear = numberToMonthYear(i);
          let totalPredictionForMonth = 0;

          for (
            let productIndex = 0;
            productIndex < productNames.length;
            productIndex++
          ) {
            const productName = productNames[productIndex];
            const productPrediction = predictionArray[0][productIndex];
            totalPredictionForMonth += productPrediction;

            // await uploadPredictions(
            //   productIndex,
            //   productPrediction,
            //   monthYear,
            //   productName
            // );

            console.log(
              `Prediction for ${productName}, ${monthYear}:`,
              productPrediction
            );
          }

          totalPrediction.push(totalPredictionForMonth);
          console.log(
            `Total Prediction for ${monthYear}:`,
            totalPredictionForMonth
          );
        }

        console.log("Predictions complete.");
      }, "Model prediction");
    } else {
      console.log("Model is not yet trained.");
    }
  };

  // Model Creation Function
  function createModel(): tf.Sequential {
    const newModel = tf.sequential();
    // L2 regularization to the first dense layer
    newModel.add(
      tf.layers.dense({
        units: 16,
        inputShape: [1],
        activation: "relu",
        kernelRegularizer: tf.regularizers.l2({ l2: 0.01 }),
      })
    );

    newModel.add(tf.layers.batchNormalization());

    newModel.add(tf.layers.dropout({ rate: 0.2 }));

    newModel.add(
      tf.layers.dense({
        units: 16,
        activation: "relu",
        kernelRegularizer: tf.regularizers.l2({ l2: 0.01 }),
      })
    );

    newModel.add(tf.layers.batchNormalization());

    newModel.add(tf.layers.dropout({ rate: 0.2 }));

    newModel.add(tf.layers.dense({ units: 4 }));
    newModel.compile({
      optimizer: tf.train.adam(0.5),
      loss: "meanSquaredError",
    });
    return newModel;
  }

  const uploadPredictions = async (
    product_num: number,
    cost: number,
    monthYear: string,
    product_name: string
  ) => {
    try {
      const response = await api.post("/prediction/upload", {
        product_num,
        product_name,
        cost,
        monthYear,
      });
      console.log(
        `Uploaded predictions for ${monthYear}, product ${product_name}:`,
        response.data.data
      );
    } catch (error: any) {
      console.error("Error uploading predictions:", error);
    }
  };

  const fetchPredictions = async () => {
    const months = ["January 2025", "February 2025", "March 2025"];

    try {
      const responses = await Promise.all(
        months.map((month) =>
          api.post("/prediction/data", { monthYear: month })
        )
      );

      const predictionData = responses.map((res) => res.data.data);
      const totalledPredictions = predictionData.reduce(
        (acc: Record<string, number>, entry) => {
          const cost = parseFloat(entry.cost.toString());

          if (acc[entry.monthYear]) {
            acc[entry.monthYear] += cost;
          } else {
            acc[entry.monthYear] = cost;
          }
          return acc;
        },
        {}
      );

      const formattedPredictions = Object.entries(totalledPredictions).map(
        ([monthYear, cost]) => ({
          monthYear,
          cost,
        })
      );
      setTotalPrediction(formattedPredictions);
      console.log("Predictions loaded successfully", formattedPredictions);
    } catch (error) {
      console.error("Failed to load models:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/training/data");

        const dataString = response.data.data[0].settings;
        let parsedData: CostDataEntry[];

        if (typeof dataString === "string") {
          parsedData = JSON.parse(dataString);
        } else {
          parsedData = dataString;
        }
        addNewData(parsedData);
        await initializeModel();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchPredictions();
  }, []);

  useEffect(() => {
    if (costData.length > 0) {
      initializeModel();
    }
  }, [costData]);

  return (
    <div className="App container mx-auto p-4">
      <div id="outcome-cont" className="mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
          <p className="text-3xl font-bold text-[#005898]">{trainingSpeed}s</p>
          <p className="text-lg text-gray-500">Training Duration</p>
        </div>
        {totalPrediction.map((monthData, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center"
          >
            <p className="text-3xl font-bold text-[#005898]">
              {monthData.cost ? monthData.cost.toFixed(2) : "N/A"}
            </p>
            <p className="text-lg text-gray-500">{monthData.monthYear}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrainingModel;
