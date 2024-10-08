import React, { useState, useEffect } from "react";
import _ from "lodash";
import * as tf from "@tensorflow/tfjs";
import api from "@/utils/api";
import { MdModelTraining, MdOutlineCalculate, MdOnlinePrediction } from "react-icons/md";

interface Product {
  productName: string;
  cost: number;
}

interface CostDataEntry {
  monthYear: string;
  products: Product[];
}

function TrainingModel() {

  const [costData, setCostData] = useState<CostDataEntry[]>([]);
  const [model, setModel] = useState<tf.Sequential | null>(null);
  const [trained, setTrained] = useState(false);
  const [lossHistory, setLossHistory] = useState<number[]>([0]);
  const [latestDate, setLatestDate] = useState(0);
  let currentMonthYear: string = "";
  const [trainingSpeed, setTrainingSpeed] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const addNewData = (newData: CostDataEntry[]) => {
    setCostData((prevData) => [...prevData, ...newData]);
    if (costData) {
      const recentCostData = costData[costData.length - 1];
      localStorage.setItem('recentCost', JSON.stringify({
        cost: recentCostData.products.reduce((acc, product) => acc + product.cost, 0), // Sum of costs for the most recent month
        monthYear: recentCostData.monthYear,
      }));
    }
  };

  const [totalPrediction, setTotalPrediction] = useState<{ monthYear: string; cost: number }[]>([]);


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
            if (logs?.loss) currentLossHistory.push(parseFloat((logs.loss / costData.length).toFixed(6)));
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
      optimizer: 'adam',
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

      const formattedPredictions = predictionData.map((monthPredictions, index) => {
        const totalCost = monthPredictions.reduce((acc, prediction) => {
          return acc + parseFloat(prediction.cost);
        }, 0);

        return {
          monthYear: months[index],
          cost: totalCost.toFixed(2)
        };
      });

      console.log("Formatted Predictions: ", formattedPredictions);
      setTotalPrediction(formattedPredictions)

    } catch (error) {
      console.error("Failed to load models:", error);
    }
  };

  useEffect(() => {
    console.log("Total Prediction", totalPrediction)
    console.log(lossHistory)
  })

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
    setIsLoading(false);
  }, [costData]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 1; // Number of items to display at once

  const next = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + itemsPerPage, totalPrediction.length - itemsPerPage));
  };

  const prev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsPerPage, 0));
  };

  return (
    <div className="mx-auto p-2 flex flex-col xl:flex-row gap-6 h-[90%]">
      {/* Left Section */}
      {isLoading ? (
        <div className="flex items-center justify-center flex-1 bg-white shadow-lg rounded-lg p-8">
          {/* Loading Spinner or Message */}
          <p className="text-xl font-semibold text-primary">Loading...</p>
          {/* You can also use a spinner component here */}
        </div>
      ) : (
        <>
          <div className="w-[500px] flex-1 bg-white shadow-lg rounded-lg p-8 xl:p-2 flex flex-col items-center">
            <h2 className="flex items-center 2xl:text-2xl text-4xl font-semibold text-primary mb-4 xl:mb-2">
              <MdModelTraining className="2xl:text-4xl text-4xl font-semibold text-primary mr-2" />
              Training Duration
            </h2>
            <p className="text-5xl font-bold text-primary">{trainingSpeed}s</p>
            <p className="italic font-medium text-center text-[12px] 3xl:text-[14px] text-[#969696]">
              Duration of model training
            </p>
          </div>
          <div className="flex-1 bg-white shadow-lg rounded-lg p-8 xl:p-2 flex flex-col items-center">
            <h2 className="flex items-center 2xl:text-2xl text-4xl font-semibold text-primary mb-4 xl:mb-2">
              <MdOutlineCalculate className="2xl:text-4xl text-4xl font-semibold text-primary mr-2" />
              Average Loss
            </h2>
            <p className="text-5xl font-bold text-primary">{lossHistory[lossHistory.length - 1]}</p>
            <p className="italic font-medium text-center text-[12px] 3xl:text-[14px] text-[#969696]">
              Average loss of all predictions
            </p>
          </div>
        </>
      )}

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
            {totalPrediction.slice(currentIndex, currentIndex + itemsPerPage).map((monthData, index) => (
              <div
                key={index}
                className="bg-primary shadow-sm rounded-lg flex flex-col items-center transition-transform duration-300 hover:scale-105"
              >
                <p className="text-4xl font-bold text-white">₱{monthData.cost}</p>
                <p className="text-sm text-white">{monthData.monthYear}</p>
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
  );

}

export default TrainingModel;
