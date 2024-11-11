"use client";
import Header from "@/components/header/Header";
import { useEffect, useState } from "react";
import { MdOutlineAnalytics } from "react-icons/md";
import { IoCalendarSharp } from "react-icons/io5";
import { IoIosInformationCircle } from "react-icons/io";
import ProductCost from "@/components/charts/LineChart";
import { useSidebarContext } from "@/contexts/SidebarContext";
import api from "@/utils/api";
import TrainingModel, {
  numberToMonthYear,
  monthYearToNumber,
} from "../../components/model/sketch";
import { ProductEntry, CostDataEntry } from "@/types/data";
import useOutsideClick from '@/hooks/useOutsideClick';
import { Tooltip } from "@nextui-org/react";
import useColorMode from "@/hooks/useColorMode";
import HeaderProjected from "@/components/header/HeaderProjected";
import { AiOutlineFundProjectionScreen, AiOutlineProject } from "react-icons/ai";

const ProjectedCostPage = () => {
  const { isOpen } = useSidebarContext();
  const [isActiveStart, setIsActiveStart] = useState(false);
  const [isActiveEnd, setIsActiveEnd] = useState(false);
  const [activeStart, setActiveStart] = useState("(Select Year)");
  const [activeEnd, setActiveEnd] = useState("(Select Half)");
  const [activeFG, setActiveFG] = useState({
    product_num: 1,
    product_name: "",
    cost: 0,
  });
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
  const [yearList, setyearList] = useState([
    { year: "2022" },
    { year: "2023" },
    { year: "2024" },
  ]);
  const [half, setHalf] = useState([{ half: "First" }, { half: "Second" }]);

  const [recentCost, setRecentCost] = useState<number>(0);

  const [pItemCost, setpItemCost] = useState<ProductEntry[]>([
    {
      product_num: 0,
      product_name: "(Empty)",
      cost: 0,
      monthYear: currentMonthYear,
    },
  ]);

  const fetchPredictions = async () => {
    try {
      let projectedMonthYear = numberToMonthYear(
        monthYearToNumber(currentMonthYear) + 1
      );
      const response = api.post("/prediction/current_data", {
        monthYear: projectedMonthYear,
      });

      const listItemCost = (await response).data.data;

      const formattedData: ProductEntry[] = listItemCost.map((item: any) => ({
        product_num: item.product_num,
        product_name: item.product_name,
        cost: parseFloat(item.cost),
        monthYear: item.monthYear,
      }));
      setpItemCost(formattedData);

    } catch (error) {
    }
  };
  const recentTotalCost = () => {
    let initialSum = 0;
    pItemCost.forEach((cost) => {
      initialSum +=
        typeof cost.cost === "string" ? parseFloat(cost.cost) : cost.cost;
    });
    setRecentCost(initialSum);
  };
  const fetchMonth = async () => {
    try {
      const response = await api.get("/training/data");

      const dataString = response.data.data[0].settings;

      let parsedData: CostDataEntry[];

      if (typeof dataString === "string") {
        parsedData = JSON.parse(dataString);
      } else {
        parsedData = dataString;
      }

      let monthYearList: any[] = [];

      parsedData.map((entry) => {
        const [month, year] = entry.monthYear.split(" ");
        if (!monthYearList.some((item) => item.year === year)) {
          monthYearList.push({ year: year });
        }
      });

      setyearList(monthYearList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchMonth();
    fetchPredictions();
  }, []);

  useEffect(() => {
    recentTotalCost();
  }, [pItemCost])

  const ref = useOutsideClick(() => setIsActiveStart(false));
  const ref2 = useOutsideClick(() => setIsActiveEnd(false));
  const [colorMode, setColorMode] = useColorMode();

  return (
    <div className="overflow-auto overflow-x-hidden bg-cover bg-center items-center justify-center bg-[#FFFAF8] dark:bg-[#1E1E1E] bg-opacity-20">
      <div>
        <HeaderProjected icon={MdOutlineAnalytics} title={"Projected Costing"} setColorMode={setColorMode} colorMode={colorMode} />
      </div>
      <div className="w-full ml-[60px] pr-[45px] h-full 2xl:h-[90vh] flex flex-col items-start justify-start pt-[15px] py-[15px]">
        <p className="text-[30px] text-tertiary dark:text-white">Projected Product Costs</p>
        <div className="flex flex-row h-[10%] w-full items-start justify-start flex-wrap">
          {/* Dropdown List Start*/}
          <div ref={ref} className="min-w-[200px] relative mt-[15px] text-[16px]">
            <div
              className="text-tertiary flex justify-between border border-[#D9D9D9] rounded-xl p-[5px] cursor-pointer transition items-start hover:border-primary hover:text-primary"
              onClick={() => {
                setIsActiveStart(!isActiveStart);
              }}
            >
              <p className="absolute ml-4 bottom-7 px-2 bg-[#FFFAF8] dark:bg-[#1E1E1E] dark:text-white">
                Cost Year
              </p>
              <span className="selected flex flex-row text-[16px]">
                <IoCalendarSharp className="mr-[10px] ml-[5px] mt-[4px] text-[22px] dark:text-[#d1d1d1]" />
                <p className="dark:text-white">{activeStart}</p>
              </span>
              <ul
                className={`list-none px-[1px] absolute border border-gray-300 dark:bg-[#3c3c3c] rounded-lg top-[2.7em] left-50% w-full translate-[-50%] transition z-1 overflow-hidden bg-white shadow-md ${!isActiveStart
                  ? "opacity-0 pointer-events-none"
                  : "block opacity-100"
                  } ${yearList.length < 6 ? " " : "overflow-y-scroll h-[175px]"}`}
              >
                {yearList.map((date) => (
                  <li
                    key={date.year}
                    className={`px-[2px] py-[2px] mx-[0.1em] cursor-pointer hover:shadow-lg text-[20px] text-black dark:text-white ${activeStart === date.year ? "shadow-lg" : " "
                      }`}
                    onClick={() => {
                      setActiveStart(date.year);
                      setIsActiveStart(false);
                    }}
                  >
                    {date.year}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Dropdown List End*/}
          <div ref={ref2} className="min-w-[200px] relative ml-[50px] mt-[15px] text-[16px]">
            <div
              className="text-tertiary flex justify-between border border-[#D9D9D9] rounded-xl p-[5px] cursor-pointer transition items-start hover:border-primary hover:text-primary"
              onClick={() => {
                setIsActiveEnd(!isActiveEnd);
              }}
            >
              <p className="absolute ml-4 bottom-7 px-2 bg-[#FFFAF8] dark:bg-[#1E1E1E] dark:text-white">
                Year Half
              </p>
              <span className="selected flex flex-row text-[16px]">
                <IoCalendarSharp className="mr-[10px] ml-[5px] mt-[4px] text-[22px] dark:text-[#d1d1d1]" />
                <p className="dark:text-white">{activeEnd}</p>
              </span>
            </div>
            <ul
              className={`list-none px-[1px] absolute border border-gray-300 rounded-lg dark:bg-[#3c3c3c] top-[2.7em] left-50% w-full translate-[-50%] transition z-1 overflow-hidden bg-white shadow-md ${!isActiveEnd ? "opacity-0 pointer-events-none" : "opacity-100"
                } ${half.length < 6 ? " " : "overflow-y-scroll h-[175px]"}`}
            >
              {half.map((half, key) => (
                <li
                  key={key}
                  className={`px-[2px] py-[2px] mx-[0.1em] cursor-pointer hover:shadow-lg text-[20px] dark:text-white ${activeEnd === half.half ? "shadow-lg" : " "
                    }`}
                  onClick={() => {
                    setActiveEnd(half.half);
                    setIsActiveEnd(false);
                  }}
                >
                  {half.half}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
          className={`${isOpen ? "flex flex-col 4xl:flex-row" : "flex flex-col 3xl:flex-row"
            } w-[97%] h-full gap-[2%] rounded-xl mt-[10px] 2xl:mt-0 dark:bg-[#1E1E1E]`}
        >
          {/* Left Div */}
          <div
            className={`${isOpen ? "w-full 4xl:w-[55%]" : "w-full 3xl:w-[55%]"
              } flex flex-col h-full rounded-lg shadow-lg`}
          >
            <div className="flex text-[30px] font-bold h-[10%] bg-white dark:bg-[#3c3c3c] rounded-t-[20px] items-center justify-start border-b-2 pl-10">
              <p className="w-[95%] text-[#585858] dark:text-white">Graph</p>
            </div>
            <div className="flex items-center justify-center h-[500px] lg:h-full w-full bg-white dark:bg-[#3c3c3c] p-2">
              <ProductCost
                selectedYear={activeStart}
                selectedHalf={activeEnd}
                colorMode={colorMode}
              />
            </div>
            <div className="flex text-[30px] text-[#585858] font-bold bg-white dark:bg-[#3c3c3c] items-center justify-start border-y-2 pl-10">
              <p className="w-[95%] dark:text-white">Estimated Summary</p>
              <Tooltip className="dark:text-white" content="Key metrics overview from the model's performance" placement="right">
                <span><IoIosInformationCircle className="dark:text-[#d1d1d1] text-[35px] text-[#625F5F] hover:brightness-50 mr-[10px]" /></span>
              </Tooltip>
            </div>
            <div className="flex items-center justify-center bg-white dark:bg-[#3c3c3c] p-2 2xl:p-2 rounded-b-[20px] shadow-b-lg">
              <TrainingModel isOpen={isOpen} />
            </div>
          </div>
          {/* Right Div */}
          <div
            className={`${isOpen ? "w-full 4xl:w-[45%]" : "w-full 3xl:w-[45%]"
              } flex flex-col gap-[20px] h-full mt-[10px] 2xl:mt-0`}
          >
            <div
              className={`${isOpen
                ? "flex flex-col 2xl:flex-row 4xl:flex-col"
                : "flex flex-row 2xl:flex-col"
                } gap-[20px] w-full`}
            >
              {/* Predictions Section */}
              <div
                className={`${isOpen ? "h-full " : ""
                  } flex flex-col bg-white dark:bg-[#3c3c3c] p-[10px] mr-1 w-full border-l-[15px] border-blue-500 rounded-e-lg shadow-lg`}
              >
                <div className="border-b-1 border-[#D9D9D9] flex flex-row">
                  <AiOutlineFundProjectionScreen className="mr-[10px] mt-1 text-[29px]" />
                  <p className="text-[24px] font-bold w-[95%] dark:text-white">
                    Prediction:
                    <span className="text-primary ml-[10px]">{activeFG.product_name}</span>
                  </p>
                  <Tooltip className="dark:text-white" content="Projected cost and cost percentage overview based on the model's predictions" placement="left">
                    <span><IoIosInformationCircle className="dark:text-[#d1d1d1] text-[35px] text-[#625F5F] hover:brightness-50" /></span>
                  </Tooltip>
                </div>
                <div className="flex flex-row w-full h-full items-center justify-center">
                  <div className="flex flex-col w-full items-center justify-center  font-bold">
                    <p className={`${activeFG.cost === 0 ? "text-[#6B6B6B]" : "text-[#005898]"} text-[32px] dark:brightness-200`}>₱{activeFG.cost.toFixed(6)}</p>
                    <p className={`${activeFG.cost === 0 ? "text-[#6B6B6B]" : "text-[#005898]"} text-[1em] dark:brightness-200`}>Projected Cost</p>
                  </div>
                  <div className="flex flex-col w-full items-center justify-center text-primary font-bold">
                    <p className={`${activeFG.cost === 0 ? "text-[#6B6B6B]" : "text-primary"} text-[32px] dark:brightness-200`}>
                      {activeFG.cost / recentCost <= 0 || NaN
                        ? 0
                        : ((activeFG.cost / recentCost) * 100).toFixed(2)}
                      %
                    </p>
                    <p className={`${activeFG.cost === 0 ? "text-[#6B6B6B]" : "text-primary"} text-[1em] dark:brightness-200`}>Cost Percentage</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Projected Product Cost Case Section */}
            <div className="flex flex-col bg-white dark:bg-[#3c3c3c] p-[10px] h-full w-full rounded-lg shadow-lg">
              <div className="flex flex-row p-[5px]">
                <AiOutlineProject className="mr-[10px] mt-1 text-[29px]" />
                <p className="text-[24px] font-bold w-[95%] dark:text-white">
                  Projected Finished Goods Cost
                </p>
                <Tooltip className="dark:text-white" content="Lists the predicted cost for each item or finished good" placement="left">
                  <span><IoIosInformationCircle className="dark:text-[#d1d1d1] text-[35px] text-[#625F5F] hover:brightness-50" /></span>
                </Tooltip>
              </div>
              <div className="flex flex-col w-full px-10 py-1 border-t-1 border-[#D9D9D9] text-[#585858] dark:text-white">
                  <p className="text-[1em]">Please select one of the finished goods below to calculate the prediction above.</p>
              </div>
              <div className="table-container overflow-x-auto">
                <table className="table-auto w-full">
                  <thead className="sticky top-0 bg-white dark:bg-[#3c3c3c] z-10 border-y-1 border-[#D9D9D9]">

                    <tr className="border-y-1 border-[#D9D9D9]">
                      <th className="px-10 py-2 text-left">
                        <p className="dark:text-[#d1d1d1]">Item</p>
                      </th>
                      <th className="px-10 py-2 text-left">
                        <p className="dark:text-[#d1d1d1]">Predicted Cost</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="overflow-y-auto max-h-96 w-full">
                    {pItemCost

                      .map((item) => (
                        <tr
                          key={item.product_num}
                          className={`text-[#383838] ${item.product_name === activeFG.product_name
                            ? "bg-primary font-bold text-white "
                            : item.product_num % 2 === 0
                              ? "bg-[#F6EBEB] dark:bg-[#4c4c4c]"
                              : ""
                            } w-full cursor-pointer hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white hover:animate-pull-down transition-colors duration-300 ease-in-out`}
                          onClick={() => setActiveFG(item)}
                        >
                          <td className="px-10 py-2">
                            <p className="dark:text-white">{item.product_name}</p>
                          </td>
                          <td className="px-10 py-2">
                            <p className="dark:text-white">{item.cost.toFixed(6)}</p>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectedCostPage;
