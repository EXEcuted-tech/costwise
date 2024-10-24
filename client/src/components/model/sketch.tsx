import React, { useState, useEffect } from "react";
import _ from "lodash";
import * as tf from "@tensorflow/tfjs";
import api from "@/utils/api";
import {
  MdModelTraining,
  MdOutlineCalculate,
  MdOnlinePrediction,
} from "react-icons/md";
import LoadingAnimation from "../loaders/LoadingAnimation";
import { CostDataEntry } from "@/types/data";

tf.setBackend("webgl");

// Helper function to convert Month-Year to number
export function monthYearToNumber(monthYearValue: string): number {
  const [month, year] = monthYearValue.split(" ");
  const monthIndex = new Date(Date.parse(month + " 1, " + year)).getMonth() + 1;
  return (parseInt(year) - 2022) * 12 + monthIndex;
}

// Helper function to convert number to Month-Year
export function numberToMonthYear(value: number): string {
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

// Helper function for uploading predictions
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

// Model Creation Function
export function createModel() {
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

// Model Initialization Function
export async function initializeModel(
  costData: CostDataEntry[],
  model: tf.Sequential | null,
  setModel: React.Dispatch<React.SetStateAction<tf.Sequential | null>>,
  setTrained: React.Dispatch<React.SetStateAction<boolean>>,
  setTrainingSpeed: React.Dispatch<React.SetStateAction<number>>,
  setLossHistory: React.Dispatch<React.SetStateAction<number[]>>
) {
  console.log("Currently training model, please wait for results...");

  const monthYears = costData.map((d) => monthYearToNumber(d.monthYear));
  let currentLossHistory: number[] = [];

  const productNames = _.uniq(
    costData.flatMap((entry) =>
      entry.products.map((product) => product.productName)
    )
  );

  const getProductCosts = (productName: string) =>
    costData.flatMap((entry) =>
      entry.products
        .filter((product) => product.productName === productName)
        .map((product) => product.cost)
    );

  const costs = productNames.map(getProductCosts);

  const newModel = model || createModel();

  // Wrapping tensor creation and model fitting in tf.tidy
  const inputTensor = tf.tensor2d(monthYears, [monthYears.length, 1]);
  const labelTensor = tf.tensor2d(costs, [
    productNames.length,
    monthYears.length,
  ]);

  const earlyStopping = tf.callbacks.earlyStopping({
    monitor: "val_loss",
    patience: 5,
    minDelta: 0.01,
  });

  const startTime = performance.now();

  console.log(`Number of active tensors: ${tf.memory().numTensors}`);

  try {
    await newModel.fit(inputTensor, labelTensor.transpose(), {
      epochs: 1000,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          currentLossHistory.push(logs.loss);
          console.log("This is epoch number: ", epoch)
          console.log("This is the loss value", logs)
        },
        ...[earlyStopping],
      },
    });

    const endTime = performance.now();
    const duration = (endTime - startTime) / 1000;

    console.log("Training complete");
    console.log(`Model training complete in ${duration.toFixed(2)} seconds`);
    console.log(currentLossHistory);

    setTrained(true);
    setModel(newModel);
    setTrainingSpeed(duration);
    setLossHistory(currentLossHistory);
  } catch (error) {
    console.error("An error occurred during model training:", error);
  } finally {
    inputTensor.dispose();
    labelTensor.dispose();
    // newModel.dispose();
    console.log(
      `Number of active tensors after disposal: ${tf.memory().numTensors}`
    );
  }
}

// Exported function
export const makePrediction = async (
  trained: boolean,
  model: tf.Sequential | null,
  costData: CostDataEntry[]
) => {
  if (trained && model) {
    // Dynamically get product names from the last entry in costData
    const productNames = costData[costData.length - 1].products.map(
      (product) => product.productName
    );

    const lastMonthYearNumber = monthYearToNumber(
      costData[costData.length - 1].monthYear
    );

    for (let i = lastMonthYearNumber + 1; i <= lastMonthYearNumber + 3; i++) {
      const predictionTensor = model.predict(tf.tensor2d([[i]])) as tf.Tensor;
      const predictionArray: any = await predictionTensor.array();

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

        await uploadPredictions(
          productIndex,
          productPrediction,
          monthYear,
          productName
        );

        console.log(
          `Prediction for ${productName}, ${monthYear}:`,
          productPrediction
        );
      }
    }
    model.dispose();
    console.log("Predictions complete.");
  } else {
    console.log("Model is not yet trained.");
  }
};

function TrainingModel() {
  const [costData, setCostData] = useState<CostDataEntry[]>([]);
  const [model, setModel] = useState<tf.Sequential | null>(null);
  const [trained, setTrained] = useState(false);
  const [lossHistory, setLossHistory] = useState<number[]>([0]);
  let currentMonthYear = () => {
    const date = new Date();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${year}-${month}`;
  };
  const [trainingSpeed, setTrainingSpeed] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const [totalPrediction, setTotalPrediction] = useState<
    { monthYear: string; cost: number }[]
  >([]);

  // Helper function for cost extraction
  const getProductCosts = (productName: string): number[] =>
    costData.flatMap((entry) =>
      entry.products
        .filter((product) => product.productName === productName)
        .map((product) => product.cost)
    );
  const fetchData = async () => {
    try {
      const response = await api.get("/training/data");

      const dataString = response.data.data[0].settings;
      let parsedData: CostDataEntry[];

      parsedData = JSON.parse(dataString);

      if (costData.length === 0) {
        setCostData(parsedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchPredictions = async () => {
    console.log("Test Data", costData);
    const numProd = costData[costData.length - 1].products.length;

    console.log("Number of data", numProd);

    try {
      const response = await api.post("/prediction/data", {
        numberOfProducts: numProd,
      });

      const predictionData = response.data.data;

      const predictionsMap: { [key: string]: number } = {};

      predictionData.forEach(
        (prediction: { monthYear: string; cost: string }) => {
          const { monthYear, cost } = prediction;
          const parsedCost = parseFloat(cost);

          if (predictionsMap[monthYear]) {
            predictionsMap[monthYear] += parsedCost;
          } else {
            predictionsMap[monthYear] = parsedCost;
          }
        }
      );

      // Format the predictions into the desired array format
      const formattedPredictions = Object.entries(predictionsMap).map(
        ([monthYear, totalCost]) => ({
          monthYear,
          cost: totalCost.toFixed(2),
        })
      );

      console.log("Formatted Predictions Data", formattedPredictions);

      setTotalPrediction(formattedPredictions);
    } catch (error) {
      console.error("Failed to load models:", error);
    }
  };

  useEffect(() => {
    if (costData.length > 0) {
      setIsLoading(true);
      try {
        initializeModel(
          costData,
          model,
          setModel,
          setTrained,
          setTrainingSpeed,
          setLossHistory
        );
      } catch (error) {
        console.log("Error Creating model: ", error);
      } finally {
        model?.dispose();
        fetchPredictions();
      }
    }
  }, [costData]);

  useEffect(() => {
    if (trainingSpeed > 0 || lossHistory.length > 0) {
      setIsLoading(false);
    }
  }, [trainingSpeed, lossHistory, trained]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 1;

  const next = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + itemsPerPage, totalPrediction.length - itemsPerPage)
    );
  };

  const prev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsPerPage, 0));
  };

  return (
    <div>
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <div className="mx-auto p-5 flex flex-col xl:flex-row gap-6 h-[90%]">
          {/* Left Section */}
          <div className="w-[500px] flex-1 bg-white shadow-lg rounded-lg p-8 xl:p-2 flex flex-col items-center">
            <h2 className="flex items-center 2xl:text-2xl text-4xl font-semibold text-primary mb-4 xl:mb-2">
              <MdModelTraining className="2xl:text-4xl text-4xl font-semibold text-primary mr-2" />
              Training Duration
            </h2>
            <p className="text-5xl font-bold text-primary">
              {trainingSpeed.toFixed(2)}s
            </p>
            <p className="italic font-medium text-center text-[12px] 3xl:text-[14px] text-[#969696]">
              Duration of model training
            </p>
          </div>

          <div className="flex-1 bg-white shadow-lg rounded-lg p-8 xl:p-2 flex flex-col items-center">
            <h2 className="flex items-center 2xl:text-2xl text-4xl font-semibold text-primary mb-4 xl:mb-2">
              <MdOutlineCalculate className="2xl:text-4xl text-4xl font-semibold text-primary mr-2" />
              Average Loss
            </h2>
            <p className="text-5xl font-bold text-primary">
              {(lossHistory[lossHistory.length - 1] / 4).toFixed(6)}
            </p>
            <p className="italic font-medium text-center text-[12px] 3xl:text-[14px] text-[#969696]">
              Average loss of all predictions
            </p>
          </div>

          {/* Right Section */}
          <div className="flex-1 bg-primary shadow-lg rounded-lg p-4 grid grid-cols-1 gap-4 items-center justify-center">
            <h2 className="flex items-center text-2xl font-semibold text-white">
              <MdOnlinePrediction className="text-4xl font-semibold text-white mr-2" />
              Total Cost Prediction
            </h2>

            <div className="flex items-center justify-between w-full">
              <button
                onClick={prev}
                disabled={currentIndex === 0}
                className="p-1 pl-[10%] text-white hover:text-gray-900 disabled:opacity-50 transition-opacity duration-200"
                aria-label="Previous predictions"
              >
                &#9664; {/* Left arrow */}
              </button>

              <div className="flex-grow flex flex-wrap justify-center p-0">
                {totalPrediction
                  .slice(currentIndex, currentIndex + itemsPerPage)
                  .map((monthData, index) => (
                    <div
                      key={index}
                      className="bg-primary shadow-sm rounded-lg flex flex-col items-center transition-transform duration-300 hover:scale-105"
                    >
                      <p className="text-4xl font-bold text-white">
                        ₱{monthData.cost}
                      </p>
                      <p className="text-sm text-white">
                        {monthData.monthYear}
                      </p>
                    </div>
                  ))}
              </div>

              <button
                onClick={next}
                disabled={currentIndex + itemsPerPage >= totalPrediction.length}
                className="p-1 pr-[10%] text-white hover:text-gray-900 disabled:opacity-50 transition-opacity duration-200"
                aria-label="Next predictions"
              >
                &#9654; {/* Right arrow */}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainingModel;