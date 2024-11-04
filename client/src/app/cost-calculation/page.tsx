"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header/Header";
import { BiSolidReport } from "react-icons/bi";
import { BiCalendarEvent } from "react-icons/bi";
import { MdDownloadForOffline } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import SpecificFG from "@/components/pages/cost-calculation/SpecificFG";
import AllFG from "@/components/pages/cost-calculation/AllFG";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { SpecificFinishedGood, Component, AllFinishedGood } from "@/types/data";
import api from "@/utils/api";
import * as tf from "@tensorflow/tfjs";
import Alert from "@/components/alerts/Alert";
import { CostDataEntry, Product } from "@/types/data";
import { initializeModel, makePrediction } from "@/components/model/sketch";
import { request } from "http";
import TrainingLoader from "@/components/loaders/TrainingLoader";
import { useUserContext } from "@/contexts/UserContext";
import ConfirmTraining from "@/components/modals/ConfirmTraining";

const CostCalculation = () => {
  const { isOpen } = useSidebarContext();
  const [selectedFG, setSelectedFG] = useState<string>("Specific-FG");
  const [alertMessages, setAlertMessages] = useState<string[]>([]);
  const [alertStatus, setAlertStatus] = useState<string>("");
  const { currentUser, setError } = useUserContext();

  const [monthYearOptions, setMonthYearOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [monthYear, setMonthYear] = useState<{ value: number; label: string }>({
    value: 0,
    label: "",
  });
  const [FGOptions, setFGOptions] = useState<{ name: string; id: number }[]>(
    []
  );
  const [allFGData, setAllFGData] = useState<AllFinishedGood[]>([]);
  const [fileName, setFileName] = useState<string>("sample");
  const [exportType, setExportType] = useState<string>("xlsx");
  const [selectedGoods, setSelectedGoods] = useState<
    { id: number; name: string }[]
  >([]);
  const [sheets, setSheets] = useState<
    { id: number; data: SpecificFinishedGood | null }[]
  >([{ id: 0, data: null }]);
  const [exportLoading, setExportLoading] = useState(false);
  // ===============> Month Year Format <=====================
  const monthNames = [
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
  const currentDate = new Date();
  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  const currentMonthYear = `${currentMonthName} ${currentYear}`;
  //================> Machine Learning Code <====================
  const [costData, setCostData] = useState<CostDataEntry[]>([]);
  const [model, setModel] = useState<tf.Sequential | null>(null);
  const [trained, setTrained] = useState(false);
  const [lossHistory, setLossHistory] = useState<number[]>([0]);
  const [trainingSpeed, setTrainingSpeed] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState(false);

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

  const handleFGClick = (fg: React.SetStateAction<string>) => {
    setSelectedFG(fg);
  };

  // Sheet functions
  const handleAddSheet = () => {
    setSheets((prevSheets) => {
      if (prevSheets.length >= FGOptions.length && prevSheets.length != 0) {
        if (FGOptions.length == 0) {
          setAlertMessages(["Choose Month Year first!"]);
          setAlertStatus("critical");
        } else {
          setAlertMessages([
            "Cannot add more sheets. All finished goods have been added.",
          ]);
          setAlertStatus("warning");
        }
        return prevSheets;
      }

      if (
        prevSheets.length === 0 ||
        prevSheets[prevSheets.length - 1].data !== null
      ) {
        const newId = Math.max(...prevSheets.map((sheet) => sheet.id), 0) + 1;
        return [...prevSheets, { id: newId, data: null }];
      }
      setAlertMessages(["Choose a Finished Good first!"]);
      setAlertStatus("critical");
      return prevSheets;
    });
  };

  const handleRemoveSheet = (id: number) => {
    const sheetToRemove = sheets.find((sheet) => sheet.id === id);
    setSheets(sheets.filter((sheet) => sheet.id !== id));
    if (sheetToRemove) {
      setSelectedGoods((prev) => {
        return prev.filter(
          (goodId) => goodId.name !== sheetToRemove.data?.desc
        );
      });
    }
  };

  const updateSheetData = (id: number, data: SpecificFinishedGood) => {
    const previousSheets = sheets;

    setSheets((prevSheets) => {
      const existingIndex = prevSheets.findIndex(
        (sheet) => sheet.data?.code === data.code
      );

      const newSheets =
        existingIndex !== -1
          ? prevSheets.map((sheet, index) =>
              index === existingIndex ? { ...sheet, data } : sheet
            )
          : prevSheets.map((sheet) =>
              sheet.id === id ? { ...sheet, data } : sheet
            );

      previousSheets.forEach((previousSheet, index) => {
        if (previousSheet.data === null || newSheets[index].data === null) {
          return;
        }

        if (previousSheet.data !== null && newSheets[index].data !== null) {
          if (previousSheet.data.desc != newSheets[index].data.desc) {
            setSelectedGoods((prev) => {
              return prev.filter(
                (goodId) => goodId.name !== previousSheet.data?.desc
              );
            });
          }
        }
      });
      return newSheets;
    });
  };

  const handleMonthYear = (value: string, label: string) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue)) {
      setMonthYear({ value: numericValue, label: label });
    }
  };

  //Save file name
  const createFileName = () => {
    if (selectedFG === "Specific-FG") {
      setFileName(`${monthYear.label}_Cost Calculation Breakdown Report`);
    } else {
      setFileName(
        `${monthYear.label}_Cost Calculation Finished Goods Summary Report`
      );
    }
  };

  //Export
  const handleExport = async () => {
    const sysRoles = currentUser?.roles;
    if (!sysRoles?.includes(17)) {
      setError("You are not authorized to export records or files.");
      return;
    }

    let sheetData = {};
    if (selectedFG === "Specific-FG") {
      sheetData = sheets
        .filter((sheet) => sheet.data !== null)
        .map((sheet) => sheet.data);
      const sheetDataArray = sheetData as SpecificFinishedGood[];
      if (sheetDataArray.length === 0) {
        setAlertMessages(["No sheets are selected"]);
        setAlertStatus("critical");
        return;
      }
    } else {
      sheetData = allFGData;
    }

    if (
      selectedFG === "All-FG" &&
      !costData.some((entry) => entry.monthYear === currentMonthYear) &&
      costData[0].products.every((product) =>
        allFGData.some(
          (allFGProduct) => product.productName == allFGProduct.fg_desc
        )
      )
    ) {
      setPrompt(true);
    } else {
      exportFile(sheetData);
    }
  };

  const promptProceed = () => {
    setPrompt(false);
    setIsLoading(true);
    const products: Product[] = allFGData
      .filter((fg) =>
        costData[0].products.some(
          (product) => product.productName === fg.fg_desc
        )
      )
      .map((fg) => ({
        productName: fg.fg_desc,
        cost: parseFloat(fg.total_cost) || 0,
      }));

    let newData: CostDataEntry = {
      monthYear: currentMonthYear,
      products: products,
    };

    const updatedCostData = [...costData, newData];
    setCostData(updatedCostData);
    updateTraininingData(updatedCostData);
    exportFile(allFGData);
  };

  const exportFile = async (sheetData: any) => {
    try {
      setExportLoading(true);
      const response = await api.post(
        "/cost_calculation/export",
        {
          selected_fg: selectedFG,
          data: sheetData,
          export_type: exportType,
          file_name: fileName,
        },
        { responseType: "blob" }
      );

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName}.${exportType}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setExportLoading(false);
        setAlertMessages(["Report exported successfully."]);
        setAlertStatus("success");
      } else {
        setExportLoading(false);
        setAlertMessages(["Error exporting workbook:", response.data.message]);
        setAlertStatus("critical");
      }
    } catch (error) {
      setExportLoading(false);
      console.error("Error exporting workbook:", error);
    }
  };

  const updateTraininingData = async (updatedData: any[]) => {
    setIsLoading(true);
    try {
      const response = await api.post("/training/update", {
        settings: JSON.stringify(updatedData),
      });
    } catch (err) {
    } finally {
      initializeModel(
        costData,
        model,
        setModel,
        setTrained,
        setTrainingSpeed,
        setLossHistory
      );
    }
  };

  useEffect(() => {
    makePrediction(trained, model, costData);
    setIsLoading(false);
  }, [trained]);

  //Retrieve month and year options
  const retrieveMonthYearOptions = async () => {
    try {
      const response = await api.get(
        "/cost_calculation/retrieve_month_year_options"
      );
      if (response.status === 200) {
        setMonthYearOptions(response.data.data);
      }
    } catch (error) {
      setAlertMessages(["Error retrieving month and year options."]);
      setAlertStatus("critical");
    }
  };

  //Retrieve FG options
  const retrieveFGOptions = async (monthYear: number) => {
    try {
      const response = await api.get("/cost_calculation/retrieve_fg", {
        params: { monthYear: monthYear },
      });

      if (response.status === 200) {
        setFGOptions(
          response.data.data.map((fg: SpecificFinishedGood) => ({
            name: fg.fg_desc,
            id: fg.fg_id,
          }))
        );
      } else {
        setAlertMessages([...alertMessages, "Error retrieving FG options."]);
        setAlertStatus("critical");
      }
    } catch (error) {
      console.error("Error retrieving FG options:", error);
      setAlertMessages([...alertMessages, "Error retrieving FG options."]);
      setAlertStatus("critical");
    }
  };

  const retrieveAllFG = async (monthYear: number) => {
    try {
      const response = await api.get("/finished_goods/retrieve_allFG", {
        params: { monthYear: monthYear },
      });

      if (response.status === 200) {
        setAllFGData(response.data.data);
      } else {
        setAlertMessages([...alertMessages, "Error retrieving FG options."]);
        setAlertStatus("critical");
      }
    } catch (error) {
      console.error("Error retrieving FG options:", error);
      setAlertMessages([...alertMessages, "Error retrieving FG options."]);
      setAlertStatus("critical");
    }
  };

  useEffect(() => {
    retrieveMonthYearOptions();
    createFileName();
    if (monthYear.value !== 0) {
      retrieveAllFG(monthYear.value);
      retrieveFGOptions(monthYear.value);
    } else {
      setFGOptions([]);
    }
  }, [sheets, monthYear]);

  return (
    <>
      {prompt && (
        <ConfirmTraining
          setConfirmDialog={setPrompt}
          onProceed={promptProceed}
        />
      )}
      {isLoading && <TrainingLoader />}
      {exportLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center backdrop-brightness-50 z-[1500]">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
          <p className="text-primary font-light text-[20px] mt-[10px] text-white">
            Exporting file(s)...
          </p>
        </div>
      )}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex flex-col items-end space-y-2">
          {alertMessages &&
            alertMessages.map((msg, index) => (
              <Alert
                className="!relative"
                variant={
                  alertStatus as
                    | "default"
                    | "information"
                    | "warning"
                    | "critical"
                    | "success"
                    | undefined
                }
                key={index}
                message={msg}
                setClose={() => {
                  setAlertMessages((prev) =>
                    prev.filter((_, i) => i !== index)
                  );
                }}
              />
            ))}
        </div>
      </div>

      <Header icon={BiSolidReport} title="Cost Calculation" />

      <div className="flex mt-[30px] ml-[80px] mr-[35px]">
        <div className="w-[30rem] pb-8">
          {/* Date Range */}
          <div className="flex">
            <div className="text-[19px] mr-5 pt-4 dark:text-white">
              Month & Year{" "}
              <span className="text-[#B22222] ml-1 font-bold">*</span>
            </div>
          </div>
          <div className="mt-2">
            <BiCalendarEvent className="absolute text-[30px] text-[#6b6b6b82] dark:text-[#d1d1d1] mt-[6px] ml-2 z-[3]" />
            <select
              className="w-[220px] h-[45px] text-[21px] pl-[42px] pr-4 text-[#000000] dark:text-[#d1d1d1] bg-white dark:bg-[#1E1E1E] border-1 border-[#929090] rounded-md drop-shadow-md cursor-pointer"
              name="Month & Year"
              defaultValue=""
              onChange={(e) =>
                handleMonthYear(
                  e.target.value,
                  e.target.options[e.target.selectedIndex].text
                )
              }
            >
              <option value="" className="dark:text-white" disabled>
                mm-yyyy
              </option>
              {monthYearOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {/* FG Selector */}
          <div className="flex mt-4">
            <div
              onClick={() => handleFGClick("Specific-FG")}
              className={`w-[140px] h-[45px] text-[21px] py-1 text-center rounded-l-md border-1 border-[#929090] drop-shadow-md cursor-pointer 
                                    ${
                                      selectedFG === "Specific-FG"
                                        ? "bg-[#B22222] text-white"
                                        : "bg-white hover:bg-[#ebebeb] dark:bg-[#1E1E1E] dark:text-white text-black transition-colors duration-200 ease-in-out"
                                    }`}
            >
              Specific-FG
            </div>
            <div
              onClick={() => handleFGClick("All-FG")}
              className={`w-[140px] h-[45px] text-[21px] py-1 text-center rounded-r-md border-1 border-[#929090] drop-shadow-md cursor-pointer 
                                    ${
                                      selectedFG === "All-FG"
                                        ? "bg-[#B22222] text-white"
                                        : "bg-white hover:bg-[#ebebeb] dark:bg-[#1E1E1E] dark:text-white text-black transition-colors duration-200 ease-in-out"
                                    }`}
            >
              All-FG
            </div>
          </div>
        </div>

        <div className="flex flex-col ml-auto">
          {/* Export Button */}
          <div className="flex ml-auto">
            <div className="text-[19px] mr-5 pt-4 dark:text-white">Export File</div>
          </div>
          <div className="flex mt-2 ml-auto">
            <select
              className="w-[95px] h-[45px] text-[21px] pl-[10px] text-[#000000] bg-white dark:text-white dark:bg-[#1E1E1E] border-1 border-[#929090] rounded-l-md drop-shadow-md cursor-pointer"
              name="fromDate"
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
            >
              <option value="xlsx">XLSX</option>
              <option value="csv">CSV</option>
            </select>

            <button
              className="w-[40px] h-[45px] bg-[#B22222] hover:bg-[#961d1d] transition-colors duration-200 ease-in-out px-[5px] rounded-r-md cursor-pointer"
              onClick={handleExport}
            >
              <MdDownloadForOffline className="text-white text-[30px] hover:animate-shake-tilt" />
            </button>
          </div>

          {/* Add Sheet Button */}
          <div className="h-[45px] mt-4">
            {selectedFG === "Specific-FG" && (
              <div
                onClick={handleAddSheet}
                className="flex items-center w-[170px] px-4 h-[45px] text-white bg-[#B22222] hover:bg-[#961d1d] transition-colors duration-200 ease-in-out rounded-md cursor-pointer"
              >
                <IoMdAdd className="text-[28px] mr-3" />{" "}
                <p className="text-[21px] font-bold">FG Sheet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-background dark:bg-[#1E1E1E] pb-[15px]">
        {selectedFG === "All-FG" ? (
          <AllFG
            title={`Cost Summary Report: ${monthYear.label}`}
            isOpen={isOpen}
            sheetData={allFGData}
          />
        ) : (
          sheets.map((sheet) => (
            <SpecificFG
              key={sheet.id}
              id={sheet.id}
              removeSheet={handleRemoveSheet}
              updateSheetData={updateSheetData}
              isOpen={isOpen}
              monthYear={monthYear}
              FGOptions={FGOptions}
              setSelectedGoods={setSelectedGoods}
              selectedGoods={selectedGoods}
            />
          ))
        )}
      </div>
    </>
  );
};

export default CostCalculation;
