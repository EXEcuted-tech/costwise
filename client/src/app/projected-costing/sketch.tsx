mport React, { useState } from 'react';
import Papa from 'papaparse';
import _ from 'lodash';
import * as tf from '@tensorflow/tfjs';

tf.setBackend('webgl'); 

function modelTrain() {
  const [costData, setCostData] = useState([]);
  const [model, setModel] = useState(null);  // Persist the model
  const [trained, setTrained] = useState(false);  // Track if the model is trained
  const [lossHistory, setLossHistory] = useState([]);
  let currentMonthYear = '';

  // Add new data to the existing dataset
  const addNewData = (newData) => {
    setCostData(prevData => [...prevData, ...newData]);
  };

  Papa.parsePromise = function (file) {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (parseData) => {
          const parsedCostData = [];
          parseData.data.forEach((row) => {
            if (row.length === 0 || row[0] === 'Item Code') return;

            if (row[0] && !row[2]) {
              currentMonthYear = row[0];
            } else if (row[0] && row[2]) {
              const productName = row[1];
              const productCost = parseFloat(row[2]);

              let monthYearEntry = parsedCostData.find(entry => entry.monthYear === currentMonthYear);
              if (!monthYearEntry) {
                monthYearEntry = { monthYear: currentMonthYear, products: [] };
                parsedCostData.push(monthYearEntry);
              }

              monthYearEntry.products.push({
                productName: productName,
                cost: productCost,
              });
            }
          });
          resolve(parsedCostData);
        },
        header: false,
      });
    });
  };

  // Handles dataset import
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const newData = await Papa.parsePromise(file);
      addNewData(newData); // Append new data
    }
  };

  // Month-Year conversion to number
  function monthYearToNumber(monthYearValue) {
    const [month, year] = monthYearValue.split(" ");
    const monthIndex = new Date(Date.parse(month + " 1, " + year)).getMonth() + 1;
    return (parseInt(year) - 2022) * 12 + monthIndex;
  }

  function measurePerformance(callback, label){
    const start = performance.now()
    return callback().then(()=> {
      const end = performance.now()
      console.log(`${label} took ${(end - start).toFixed(2)} milliseconds`)
    })
  }

  // Helper function for cost extraction
  const getProductCosts = (productName) => 
    costData.flatMap(entry => 
      entry.products.filter(product => product.productName === productName).map(product => product.cost)
    );
  // Initialize or retrain the model with the current dataset
  const initializeModel = () => {
    console.log("Currently training model, please wait for results...")

    const monthYears = costData.map(d => monthYearToNumber(d.monthYear));
    const currentLossHistory = [];

    // Extract costs for each product
    const vch250gCost = getProductCosts('VIRGINIA Cocktail Hotdog 250g')
    const sh250gCost = getProductCosts('VIRGINIA Sweet Ham 250g')
    const vChH250gCost = getProductCosts('VIRGINIA Chicken Hotdog 250g')
    const cdcH250gCost = getProductCosts('VIRGINIA Chorizo de Cebu 250g')

    // Creating the model (or use an existing one)
    const newModel = model || createModel();

    const inputTensor = tf.tensor2d(monthYears, [monthYears.length, 1]);
    const labelTensor = tf.tensor2d([vch250gCost, sh250gCost, vChH250gCost,cdcH250gCost], [4, monthYears.length]);

    const earlyStopping = tf.callbacks.earlyStopping({
      monitor: 'loss',
      patience: 5
    })

    const startTime = performance.now();

    newModel.fit(inputTensor, labelTensor.transpose(), {
      epochs: 10000,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          currentLossHistory.push(logs.loss);
        },
        ...[earlyStopping]
      }
    }).then(() => {
      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000; // Convert to seconds
      console.log('Training complete');
      console.log(`Model training complete in ${duration.toFixed(2)} seconds`);
      console.log(JSON.stringify(newModel.toJSON()))
      // newModel.evaluate()
      setModel(newModel); 
      setTrained(true);  
      setLossHistory(currentLossHistory);  
    });
  };

  // Make predictions with the trained model
  const makePrediction = () => {
    if (trained && model) {
      measurePerformance(() => {
        const prediction = model.predict(tf.tensor2d([[monthYearToNumber("January 2025")]]));
        const prediction_1 = model.predict(tf.tensor2d([[monthYearToNumber("February 2025")]]));
        prediction.print();
        prediction_1.print()
        return prediction.array().then(() => {
          console.log("Prediction complete");
        });
      }, "Model prediction");
    } else {
      console.log("Model is not yet trained.");
    }
  };

  // Model Creation Function
  function createModel() {
    const newModel = tf.sequential();
    // L2 regularization to the first dense layer
    newModel.add(tf.layers.dense({ 
      units: 16, 
      inputShape: [1], 
      activation: 'relu',
      kernelRegularizer: tf.regularizers.l2({l2: 0.01})
    }));

    newModel.add(tf.layers.batchNormalization());

    newModel.add(tf.layers.dropout({rate: 0.2}))

    newModel.add(tf.layers.dense({ 
      units: 16, 
      activation: 'relu',
      kernelRegularizer: tf.regularizers.l2({l2: 0.01}) 
    }));

    newModel.add(tf.layers.batchNormalization());

    newModel.add(tf.layers.dropout({rate: 0.2}))

    newModel.add(tf.layers.dense({ units: 4 }));
    newModel.compile({ optimizer: tf.train.adam(0.5), loss: 'meanSquaredError' });
    return newModel;
  }

  return (
    <div className="App">
      <h1>Cost Prediction Model</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={initializeModel}>Train Model</button>
      <button onClick={makePrediction}>Predict</button>
      <div id="outcome-cont"></div>
    </div>
  );
}

export default App;
