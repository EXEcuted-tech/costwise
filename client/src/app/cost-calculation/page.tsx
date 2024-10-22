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
import Alert from "@/components/alerts/Alert";
import { select } from "@nextui-org/theme";

const CostCalculation = () => {
  const { isOpen } = useSidebarContext();
  const [selectedFG, setSelectedFG] = useState<string>("Specific-FG");
  const [alertMessages, setAlertMessages] = useState<string[]>([]);
  const [alertStatus, setAlertStatus] = useState<string>("");

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
  const [sheets, setSheets] = useState<
    { id: number; data: SpecificFinishedGood | null }[]
  >([{ id: 0, data: null }]);

  const handleFGClick = (fg: React.SetStateAction<string>) => {
    setSelectedFG(fg);
  };

  // Sheet functions
  const handleAddSheet = () => {
    setSheets((prevSheets) => {
      if (prevSheets.length >= FGOptions.length) {
        setAlertMessages([
          "Cannot add more sheets. All finished goods have been added.",
        ]);
        setAlertStatus("warning");
        return prevSheets;
      }

      if (
        prevSheets.length === 0 ||
        prevSheets[prevSheets.length - 1].data !== null
      ) {
        const newId = Math.max(...prevSheets.map((sheet) => sheet.id), 0) + 1;
        return [...prevSheets, { id: newId, data: null }];
      }
      setAlertMessages([
        "Cannot add more sheets. All finished goods have been added.",
      ]);
      setAlertStatus("critical");
      return prevSheets;
    });
  };
  const handleRemoveSheet = (id: number) => {
    setSheets(sheets.filter((sheet) => sheet.id !== id));
  };

  const updateSheetData = (id: number, data: SpecificFinishedGood) => {
    setSheets((prevSheets) => {
      const existingIndex = prevSheets.findIndex(
        (sheet) => sheet.data?.code === data.code
      );

      if (existingIndex !== -1) {
        return prevSheets.map((sheet, index) =>
          index === existingIndex ? { ...sheet, data } : sheet
        );
      } else {
        return prevSheets.map((sheet) =>
          sheet.id === id ? { ...sheet, data } : sheet
        );
      }
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
    let sheetData = {};
    if (selectedFG === "Specific-FG") {
      sheetData = sheets
        .filter((sheet) => sheet.data !== null)
        .map((sheet) => sheet.data);
      if (sheetData.length === 0) {
        setAlertMessages(["No sheets are selected"]);
        setAlertStatus("critical");
        return;
      }
    } else {
      sheetData = allFGData;
    }

    console.log("Sheet Data", sheetData);

    try {
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

        setAlertMessages(["Report exported successfully."]);
        setAlertStatus("success");
      } else {
        setAlertMessages(["Error exporting workbook:", response.data.message]);
        setAlertStatus("critical");
      }
    } catch (error) {
      console.error("Error exporting workbook:", error);
    }
  };

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
      console.log(error);
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
      <div className="absolute top-0 right-0">
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
                setAlertMessages((prev) => prev.filter((_, i) => i !== index));
              }}
            />
          ))}
      </div>
      <div className="w-full">
        <div>
          <Header icon={BiSolidReport} title="Cost Calculation" />
        </div>

        <div className="flex mt-[30px] ml-[80px] mr-[35px]">
          <div className="w-[30rem] pb-8">
            {/* Date Range */}
            <div className="flex">
              <div className="text-[19px] mr-5 pt-4">
                Month & Year{" "}
                <span className="text-[#B22222] ml-1 font-bold">*</span>
              </div>
            </div>
            <div className="mt-2">
              <BiCalendarEvent className="absolute text-[30px] text-[#6b6b6b82] mt-[6px] ml-2 z-[3]" />
              <select
                className="w-[220px] h-[45px] text-[21px] pl-[42px] pr-4 text-[#000000] bg-white border-1 border-[#929090] rounded-md drop-shadow-md cursor-pointer"
                name="Month & Year"
                defaultValue=""
                onChange={(e) =>
                  handleMonthYear(
                    e.target.value,
                    e.target.options[e.target.selectedIndex].text
                  )
                }
              >
                <option value="" disabled>
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
                                    ${selectedFG === "Specific-FG"
                    ? "bg-[#B22222] text-white"
                    : "bg-white hover:bg-[#ebebeb] text-black transition-colors duration-200 ease-in-out"
                  }`}
              >
                Specific-FG
              </div>
              <div
                onClick={() => handleFGClick("All-FG")}
                className={`w-[140px] h-[45px] text-[21px] py-1 text-center rounded-r-md border-1 border-[#929090] drop-shadow-md cursor-pointer 
                                    ${selectedFG === "All-FG"
                    ? "bg-[#B22222] text-white"
                    : "bg-white hover:bg-[#ebebeb] text-black transition-colors duration-200 ease-in-out"
                  }`}
              >
                All-FG
              </div>
            </div>
          </div>

          <div className="flex flex-col ml-auto">
            {/* Export Button */}
            <div className="flex ml-auto">
              <div className="text-[19px] mr-5 pt-4">Export File</div>
            </div>
            <div className="flex mt-2 ml-auto">
              <select
                className="w-[95px] h-[45px] text-[21px] pl-[10px] text-[#000000] bg-white border-1 border-[#929090] rounded-l-md drop-shadow-md cursor-pointer"
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

        <div>
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
              />
            ))
          )}
          {/*  */}
        </div>
      </div>
    </>
  );
};

export default CostCalculation;
