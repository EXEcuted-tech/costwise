"use client";
import React, { useState, useEffect } from "react";
import CustomCalendar from "@/components/calendar/CustomCalendar";
import CardHeader from "@/components/pages/dashboard/CardHeader";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { IoMdClock } from "react-icons/io";
import { MdDarkMode } from "react-icons/md";
import { GiFactory, GiMoneyStack } from "react-icons/gi";
import {
  FaCircleArrowDown,
  FaCircleArrowUp,
  FaArrowTrendUp,
} from "react-icons/fa6";
import { PiPackageFill } from "react-icons/pi";
import ProductCostChart from "@/components/pages/dashboard/LineChart";
import UserActivity from "@/components/pages/dashboard/UserActivity";
import api from "@/utils/api";
import { formatDistanceToNow } from "date-fns";
import Spinner from "@/components/loaders/Spinner";
import useColorMode from "@/hooks/useColorMode";

enum ActionType {
  General = "general",
  Crud = "crud",
  Import = "import",
  Export = "export",
  Stock = "stock",
}

export interface AuditLogs {
  employeeName: string;
  action: ActionType;
  description: string;
  time: Date;
  profile: string;
  formattedTime: string;
}

const DashboardPage = () => {
  const { isOpen, isAdmin } = useSidebarContext();
  const [averageCost, setAverageCost] = useState(0);
  const [fgPercentageChange, setFgPercentageChange] = useState(0);
  const [fgTrend, setFgTrend] = useState("");
  const [totalProductionCost, setTotalProductionCost] = useState("");
  const [productCostPercentageChange, setProductCostPercentageChange] =
    useState(0);
  const [productCostTrend, setProductCostTrend] = useState("");
  const [lastUpdate, setLastUpdate] = useState("");
  const [materialCost, setMaterialCost] = useState(0);
  const [materialCostPercentageChange, setMaterialCostPercentageChange] =
    useState(0);
  const [materialCostTrend, setMaterialCostTrend] = useState("");
  const [name, setName] = useState("");

  const [auditLogs, setAuditLogs] = useState<AuditLogs[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuditLoading, setIsAuditLoading] = useState(true);

  //Prediction Fetch
  const fetchPredictions = async () => {
    try {
      const response = await api.post("/prediction/data", {
        numberOfProducts: 4,
      });

      const predictionData = response.data.data;

      const targetMonthYear = predictionData[0]?.monthYear;

      const selectedMonthPredictions = predictionData.filter(
        (prediction: { monthYear: string }) =>
          prediction.monthYear === targetMonthYear
      );

      const totalCostForMonth = selectedMonthPredictions.reduce(
        (acc: number, prediction: { cost: string; }) => {
          const parsedCost = parseFloat(prediction.cost);
          return acc + parsedCost;
        },
        0
      );
      const formattedPredictions = [
        {
          monthYear: targetMonthYear,
          cost: totalCostForMonth.toFixed(2),
        },
      ];

      setTotalPrediction(formattedPredictions);
    } catch (error) {
      console.error("Failed to load models:", error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setName(user.name);
      fetchAverageCost();
      fetchTotalProductionCost();
      fetchMaterialCostUtilization();
      fetchPredictions();
      fetchAuditLogs();
    }
    setLastUpdate(
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  }, []);

  const fetchAverageCost = async () => {
    setIsLoading(true);
    const response = await api.get("/finished_goods/average_cost");
    setAverageCost(parseFloat(response.data.average_cost));
    setFgPercentageChange(response.data.percentage_change);
    setFgTrend(response.data.trend);
    setIsLoading(false);
  };

  const fetchTotalProductionCost = async () => {
    setIsLoading(true);
    const response = await api.get("/transactions/total_production_cost");
    const formattedCost = Number(
      response.data.total_production_cost
    ).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setTotalProductionCost(formattedCost);
    setProductCostPercentageChange(response.data.percentage_change);
    setProductCostTrend(response.data.trend);
    setIsLoading(false);
  };

  const fetchMaterialCostUtilization = async () => {
    setIsLoading(true);
    const response = await api.get("/materials/material_cost_utilization");
    setMaterialCost(response.data.material_cost_utilization);
    setMaterialCostPercentageChange(response.data.percentage_change);
    setMaterialCostTrend(response.data.trend);
    setIsLoading(false);
  };

  const fetchData = async () => {
    try {
      const res = await api.get('/auditlogs');
      const logs = res.data.map((log: any) => ({
        employeeName: `${log.user.first_name} ${log.user.middle_name ? log.user.middle_name.charAt(0) + '. ' : ''}${log.user.last_name}`,
        description: log.description,
        actionEvent: log.action as ActionType,
        profile: log.user.display_picture,
        time: new Date(log.timestamp),  // Store the Date object for sorting
              formattedTime: formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })  // Separate field for display
      }));
          const sortedLogs = logs.sort((a: AuditLogs, b: AuditLogs) => b.time.getTime() - a.time.getTime());
      setAuditLogs(sortedLogs.slice(0, 15));
      setIsAuditLoading(false);
    } catch (error: any) {
      console.error("Failed to fetch audit logs:", error);
      setIsAuditLoading(false);
    } finally {
      setIsAuditLoading(false);
    }
  }

  const fetchAuditLogs = async () => {
    const initialFetchTimeout = setTimeout(fetchData, 100);

    const fetchInterval = setInterval(fetchData, 30000);

    return () => {
        clearTimeout(initialFetchTimeout);
        clearInterval(fetchInterval);
    };
  };

  const [totalPrediction, setTotalPrediction] = useState<
    { monthYear: string; cost: number }[]
  >([]);
  const [colorMode, setColorMode] = useColorMode();

  return (
    <div
      className={`${isOpen ? "px-[10px] 2xl:px-[25px]" : "px-[25px]"
        } bg-background dark:bg-[#1E1E1E] mt-[30px] ml-[45px] transition-all duration-400 ease-in-out`}
    >
      <div className="flex justify-between">
        <div className="flex flex-col flex-wrap w-[72%] 4xl:w-[75%]">
          <h1
            className={`${isOpen
                ? "text-[34px] 2xl:text-[42px] 3xl:text-[52px] 4xl:text-[58px]"
                : "text-[40px] 2xl:text-[55px] 3xl:text-[68px]"
              } truncate text-ellipsis text-[#414141] font-bold animate-color-pulse dark:animate-color-pulse-dark`}
          >
            {new Date().getHours() < 12 ? "Good Morning" : new Date().getHours() < 17 ? "Good Afternoon" : "Good Evening"},{" "}
            <span className="animate-color-pulse2 dark:animate-color-pulse-dark2">
              {name}!
            </span>
          </h1>
          <p
            className={`${isOpen
                ? "text-[16px] 2xl:text-[18px] 3xl:text-[22px]"
                : "text-[18px] 2xl:text-[20px] 3xl:text-[28px]"
              } font-medium text-[#868686] dark:text-[#C6C6C6]`}
          >
            Welcome to CostWise: Virginia’s Product Costing System!
          </p>
        </div>
        <div className="w-[27%] 4xl:w-[20%] flex flex-col justify-center mr-[5px]">
          <h2
            className={`${isOpen
                ? "text-[18px] 2xl:text-[24px]"
                : "text-[19px] 2xl:text-[25px] 3xl:text-[30px]"
              } text-[#414141] dark:text-white font-bold text-right`}
          >
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h2>
          <p
            className={`${isOpen
                ? "text-[14px] 2xl:text-[16px]"
                : "text-[16px] 3xl:text-[21px]"
              } text-[#414141] italic dark:text-white text-right`}
          >
            {new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
        <div>
          <div
            title="Toggle Dark Mode"
            className={`${isOpen
                ? "text-[1.2em] 2xl:text-[1.8em]"
                : "text-[1.2em] 2xl:text-[1.5em] 3xl:text-[2.2em]"
              } text-primary p-3 drop-shadow-lg bg-white rounded-full cursor-pointer hover:text-white hover:bg-primary transition-colors duration-300 ease-in-out`}
            onClick={() =>
              setColorMode(colorMode === "light" ? "dark" : "light")
            }
          >
            <MdDarkMode />
          </div>
        </div>
      </div>

      <div
        className={`${isOpen ? "gap-3" : "gap-8"
          } my-[30px] flex justify-between`}
      >
        <div className="w-[70%]">
          <CardHeader cardName="Analytics Overview" />
          <div
            className={`${isOpen ? "min-h-[316px]" : "min-h-[304px]"
              } bg-white dark:bg-[#3C3C3C] rounded-b-[10px] drop-shadow-lg px-[40px] py-[20px]`}
          >
            <div className="flex items-center">
              <IoMdClock className="text-[25px] 2xl:text-[28px] 3xl:text-[32px] text-[#C6C6C6] dark:text-white mr-[5px]" />
              <h2 className="text-[#C6C6C6] font-light text-[20px]">
                Last Update: <span className="italic">{lastUpdate}</span>
              </h2>
            </div>
            <div className="my-[30px] 3xl:my-[20px] flex justify-between">
              <div className="w-[20%] flex flex-col items-center">
                <div className="animate-border-pulse w-24 h-24 flex p-4 justify-center items-center rounded-full border border-primary bg-white drop-shadow-lg relative">
                  <GiFactory className="text-primary text-[68px] hover:animate-shake-tilt" />
                </div>
                <div>
                  <div className="flex items-center mr-[-20px] justify-end">
                    {productCostTrend === "decreased" && (
                      <FaCircleArrowDown className="text-[10px] 2xl:text-[12px] 3xl:text-[16px] text-[#CD3939] mr-[5px]" />
                    )}
                    {productCostTrend === "increased" && (
                      <FaCircleArrowUp className="text-[10px] 2xl:text-[12px] 3xl:text-[16px] text-[#039300] mr-[5px]" />
                    )}
                    <p
                      className={`text-[10px] 2xl:text-[12px] 3xl:text-[16px] ${productCostTrend === "decreased"
                          ? "text-[#CD3939]"
                          : "text-[#039300]"
                        } font-semibold`}
                    >
                      {productCostPercentageChange
                        ? `${productCostTrend === "decreased" ? "-" : "+"
                        }${productCostPercentageChange}%`
                        : "‎"}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <h1 className="text-[14px] 2xl:text-[21px] 3xl:text-[28px] font-bold text-primary dark:text-white">
                      ₱{totalProductionCost ? totalProductionCost : '0.00'}
                    </h1>
                    <p className="italic font-medium text-center text-[12px] 3xl:text-[14px] text-[#969696]">
                      Total Production Cost
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-[20%] flex flex-col items-center">
                <div className="animate-border-pulse w-24 h-24 flex p-4 justify-center items-center rounded-full border border-primary bg-white drop-shadow-lg relative">
                  <PiPackageFill className="text-primary text-[68px] hover:animate-shake-tilt" />
                </div>
                <div>
                  <div className="flex items-center mr-[-20px] justify-end">
                    {fgTrend === "decreased" && (
                      <FaCircleArrowDown className="text-[10px] 2xl:text-[12px] 3xl:text-[16px] text-[#CD3939] mr-[5px]" />
                    )}
                    {fgTrend === "increased" && (
                      <FaCircleArrowUp className="text-[10px] 2xl:text-[12px] 3xl:text-[16px] text-[#039300] mr-[5px]" />
                    )}
                    <p
                      className={`text-[10px] 2xl:text-[12px] 3xl:text-[16px] ${fgTrend === "decreased"
                          ? "text-[#CD3939]"
                          : "text-[#039300]"
                        } font-semibold`}
                    >
                      {fgPercentageChange
                        ? `${fgTrend === "decreased" ? "" : "+"
                        }${fgPercentageChange}%`
                        : "‎"}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <h1 className="text-[14px] 2xl:text-[21px] 3xl:text-[28px] font-bold text-primary dark:text-white">
                      ₱
                      {(isNaN(averageCost) ? 0 : averageCost).toLocaleString(
                        "en-US",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )}
                    </h1>
                    <p className="italic text-center font-medium text-[12px] 3xl:text-[14px] text-[#969696]">
                      Average Cost Per Product
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-[20%] flex flex-col items-center">
                <div className="animate-border-pulse2 w-24 h-24 flex p-4 justify-center items-center rounded-full border-2 border-white bg-primary drop-shadow-lg relative">
                  <GiMoneyStack className="text-white text-[68px] hover:animate-shake-tilt" />
                </div>
                <div>
                  <div className="flex items-center mr-[-20px] justify-end">
                    {materialCostTrend === "decreased" && (
                      <FaCircleArrowDown className="text-[10px] 2xl:text-[12px] 3xl:text-[16px] text-[#CD3939] mr-[5px]" />
                    )}
                    {materialCostTrend === "increased" && (
                      <FaCircleArrowUp className="text-[10px] 2xl:text-[12px] 3xl:text-[16px] text-[#039300] mr-[5px]" />
                    )}
                    <p
                      className={`text-[10px] 2xl:text-[12px] 3xl:text-[16px] ${materialCostTrend === "decreased"
                          ? "text-[#CD3939]"
                          : "text-[#039300]"
                        } font-semibold`}
                    >
                      {materialCostPercentageChange
                        ? `${materialCostTrend === "decreased" ? "" : "+"
                        }${materialCostPercentageChange}%`
                        : "‎"}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <h1 className="text-[14px] 2xl:text-[21px] 3xl:text-[28px] font-bold text-primary dark:text-white">
                      ₱
                      {materialCost.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </h1>
                    <p className="italic font-medium text-center text-[12px] 3xl:text-[14px] text-[#969696]">
                      Material Cost Utilization
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-[20%] flex flex-col items-center">
                <div className="animate-border-pulse2 w-24 h-24 flex p-4 justify-center items-center rounded-full border-2 border-white bg-primary drop-shadow-lg relative">
                  <FaArrowTrendUp className="text-white text-[68px] hover:animate-shake-tilt" />
                </div>
                <div>
                  <div className="flex items-center mr-[-20px] justify-end">
                    {/* <FaCircleArrowUp className="text-[10px] 2xl:text-[12px] 3xl:text-[16px] text-[#039300] mr-[5px]" /> */}
                    <p className="text-[10px] 2xl:text-[12px] 3xl:text-[16px] text-[#039300] font-semibold">
                      {/* +17% */}‎
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <h1 className="text-[14px] 2xl:text-[21px] 3xl:text-[28px] font-bold text-primary dark:text-white">
                    ₱{totalPrediction.length > 0 ? totalPrediction[0]?.cost : '0.00'}
                    </h1>
                    <p className="italic font-medium text-center text-[12px] 3xl:text-[14px] text-[#969696]">
                      Total Prediction Cost
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[30%]">
          <CustomCalendar
            className={`${isOpen
                ? "min-h-[366px] 2xl:min-h-[378px]"
                : "min-h-[355px] 2xl:min-h-[366px]"
              } w-full`}
          />
        </div>
      </div>

      <div
        className={`${isOpen ? "gap-3" : "gap-8"
          } flex-col 3xl:flex-row flex my-[30px] justify-between`}
      >
        <div className={`${isAdmin ? "w-full 3xl:w-[70%]" : "w-full"}`}>
          <CardHeader cardName="Projected Costing" />
          <div
            className={`${isOpen ? "3xl:px-[20px]" : "px-[5px] 2xl:px-[20px]"
              } flex flex-grow bg-white dark:bg-[#3C3C3C] h-[600px] rounded-b-[10px] drop-shadow-lg items-center justify-center`}
          >
            <ProductCostChart
              selectedHalf="Second"
              selectedYear="2024"
              className={`${isOpen ? "w-full 3xl:w-[60%]" : "w-full"}`}
              colorMode={colorMode}
            />
            {/* <div className='flex justify-center mt-[30px] pr-[20px] w-full'>
                <CostTable className='h-[280px] w-full'/>
              </div> */}
          </div>
        </div>
        {isAdmin && (
          <div className="w-full 3xl:w-[30%]">
            <CardHeader cardName="User Activity" />
            <div
              id="scroll-style"
              className="bg-white dark:bg-[#3C3C3C] h-[600px] rounded-b-[10px] drop-shadow-lg overflow-y-auto py-[15px]"
            >
              {isAuditLoading ? (
                <div className="flex justify-center items-center h-[550px]">
                  <Spinner className="!size-[60px]" />{" "}
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="flex justify-center items-center h-[550px] text-xl text-gray-500">
                  No logs to display.
                </div>
              ) : (
                auditLogs.map((data, index) => (
                  <div key={index}>
                    <UserActivity
                      url={data.profile}
                      name={data.employeeName}
                      activity={data.action}
                      description={data.description}
                      formattedTime={data.formattedTime}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
