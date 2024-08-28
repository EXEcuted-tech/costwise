"use client";
import Header from "@/components/header/Header";
import { useState } from "react";
import { MdOutlineAnalytics } from "react-icons/md";
import { IoCalendarSharp } from "react-icons/io5";
import { IoIosInformationCircle } from "react-icons/io";
import { Chart as ChartJS } from "chart.js/auto";
import LineChart from "@/components/charts/LineChart";
import DoughnutChart from "@/components/charts/DoughnutChart";

const ProjectedCostPage = () => {
  const [isActiveStart, setIsActiveStart] = useState(false);
  const [isActiveEnd, setIsActiveEnd] = useState(false);
  const [activeStart, setActiveStart] = useState("mm/yy");
  const [activeEnd, setActiveEnd] = useState("mm/yy");
  const [monthList, setMonthList] = useState([
    {
      month: "January",
      year: "2023",
    },
    {
      month: "Febuary",
      year: "2023",
    },
    {
      month: "March",
      year: "2023",
    },
    {
      month: "April",
      year: "2023",
    },
    {
      month: "May",
      year: "2023",
    },
    {
      month: "June",
      year: "2023",
    },
    {
      month: "July",
      year: "2023",
    },
  ]);
  const [priceData, setPriceData] = useState([
    {
      id: 1,
      price: 15.0,
      year: 2023,
      month: "January",
    },
    {
      id: 2,
      price: 25.0,
      year: 2023,
      month: "Febuary",
    },
    {
      id: 3,
      price: 20.0,
      year: 2023,
      month: "March",
    },
    {
      id: 4,
      price: 14.0,
      year: 2023,
      month: "April",
    },
    {
      id: 5,
      price: 12.0,
      year: 2023,
      month: "May",
    },
    {
      id: 6,
      price: 11.0,
      year: 2023,
      month: "June",
    },
  ]);

  const [costData, setCostData] = useState([
    { id: 1, product: "Hotdog", cost: 25.0 },
    { id: 2, product: "Bacon", cost: 33.0 },
    { id: 3, product: "Corned Beef", cost: 5.0 },
    { id: 4, product: "Siomai", cost: 15.0 },
    { id: 5, product: "Beef Loaf", cost: 17.0 },
    { id: 6, product: "Ham", cost: 21.0 },
    { id: 7, product: "Sausage", cost: 12.0 },
  ]);

  const [data] = useState({
    labels: priceData.map((date) => date.month),
    datasets: [
      {
        label: "Price",
        data: priceData.map((prices) => prices.price),
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        fill: false,
      },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  const [doughnutData] = useState({
    labels: costData.map((product) => product.product),
    datasets: [
      {
        label: "Price Distribution",
        data: costData.map((costs) => costs.cost),
        backgroundColor: [
          "rgba(75,192,192,0.2)",
          "rgba(54,162,235,0.2)",
          "rgba(255,206,86,0.2)",
          "rgba(75,192,192,0.2)",
          "rgba(153,102,255,0.2)",
          "rgba(255,159,64,0.2)",
        ],
        borderColor: [
          "rgba(75,192,192,1)",
          "rgba(54,162,235,1)",
          "rgba(255,206,86,1)",
          "rgba(75,192,192,1)",
          "rgba(153,102,255,1)",
          "rgba(255,159,64,1)",
        ],
        borderWidth: 1,
      },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  return (
    <div
      className="overflow-hidden bg-cover bg-center items-center justify-center bg-[#FFFAF8] bg-opacity-20"
      style={{ backgroundImage: "url('/images/usermanbg.png')" }}
    >
      <div>
        <Header icon={MdOutlineAnalytics} title={"Projected Costing"} />
      </div>
      <div className="w-full ml-[60px] pr-[45px] h-[90vh] flex flex-col items-start justify-start pt-[15px] py-[15px]">
        <p className="text-[30px] text-tertiary">Equipment Costs</p>
        <div className="flex flex-row h-[10%] w-[100%] items-start justify-start flex-wrap">
          {/* Dropdown List Start*/}
          <div className="min-w-[200px] relative mt-[15px] text-[16px]">
            <div
              className={`text-tertiary flex justify-between border border-[#D9D9D9] rounded-xl p-[5px] cursor-pointer transition items-start ${
                isActiveStart ? " " : " border-3"
              } hover:border-primary hover:text-primary`}
              onClick={() => {
                setIsActiveStart(!isActiveStart);
              }}
            >
              <p className="absolute ml-4 bottom-7 px-2 bg-[#FFFAF8]">
                Start Date
              </p>
              <span className="selected flex flex-row text-[16px]">
                <IoCalendarSharp className="mr-[10px] ml-[5px] mt-[4px] text-[22px]" />
                <p className="">{activeStart}</p>
              </span>
              <ul
                className={`list-none px-[1px] absolute border border-gray-300 rounded-lg top-[2.7em] left-50% w-full translate-[-50%] transition z-1 overflow-hidden bg-white shadow-md ${
                  !isActiveStart
                    ? "opacity-0 pointer-events-none"
                    : "block opacity-100"
                } ${
                  monthList.length < 6 ? " " : "overflow-y-scroll h-[175px]"
                }`}
              >
                {monthList.map((date) => (
                  <li
                    className={`px-[2px] py-[2px] mx-[0.1em] cursor-pointer hover:shadow-lg text-[20px] text-black ${
                      activeStart === date.month + " " + date.year
                        ? "shadow-lg bg-gray-50"
                        : " "
                    }`}
                    onClick={() => {
                      setActiveStart(date.month + " " + date.year);
                    }}
                  >
                    {date.month} {date.year}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Dropdown List End*/}
          <div className="min-w-[200px] relative ml-[50px] mt-[15px] text-[16px]">
            <div
              className={`text-tertiary flex justify-between border border-[#D9D9D9] rounded-xl p-[5px] cursor-pointer transition items-start ${
                isActiveEnd ? " " : " border-3"
              } hover:border-primary hover:text-primary`}
              onClick={() => {
                setIsActiveEnd(!isActiveEnd);
              }}
            >
              <p className="absolute ml-4 bottom-7 px-2 bg-[#FFFAF8]">
                End Date
              </p>
              <span className="selected flex flex-row text-[16px]">
                <IoCalendarSharp className="mr-[10px] ml-[5px] mt-[4px] text-[22px]" />
                <p className="">{activeEnd}</p>
              </span>
            </div>
            <ul
              className={`list-none px-[1px] absolute border border-gray-300 rounded-lg top-[2.7em] left-50% w-full translate-[-50%] transition z-1 overflow-hidden bg-white shadow-md ${
                !isActiveEnd ? "opacity-0 pointer-events-none" : "opacity-100"
              } ${monthList.length < 6 ? " " : "overflow-y-scroll h-[175px]"}`}
            >
              {monthList.map((date) => (
                <li
                  className={`px-[2px] py-[2px] mx-[0.1em] cursor-pointer hover:shadow-lg text-[20px] ${
                    activeEnd === date.month + " " + date.year
                      ? "shadow-lg bg-gray-50"
                      : " "
                  }`}
                  onClick={() => {
                    setActiveEnd(date.month + " " + date.year);
                  }}
                >
                  {date.month} {date.year}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-row w-[97%] h-[100%] gap-[2%]">
          {/* Left Div */}
          <div className="flex flex-col w-[65%] h-full rounded-lg shadow-xl">
            <div className="flex text-[30px] text-[#585858] font-bold h-[10%] bg-white items-center justify-start  border-b-2 pl-10">
              <p className="w-[95%]">GRAPHS</p>
              <IoIosInformationCircle className="text-[35px] text-[#625F5F]" />
            </div>
            <div className="flex items-center justify-center h-[50%] w-[100%] bg-white">
              <LineChart chartData={data} />
            </div>
            <div className="flex text-[30px]  font-bold h-[10%] bg-white items-center justify-start pl-10">
              <p className="w-[95%] text-[#585858]">Estimated Summary</p>
            </div>
            <div className="flex items-center justify-center h-[47%] bg-white">
              <DoughnutChart doughnutData={doughnutData} />
            </div>
          </div>
          {/* Right Div */}
          <div className="flex flex-col gap-[15px] bg-white h-full w-[45%]">
            {/* Predictions Section */}
            <div className="flex flex-col bg-white p-[10px] m-1 h-[25%] border-l-[15px] border-blue-500 rounded-e-lg shadow-lg">
              <div className="border-b-1 border-[#D9D9D9] flex flex-row">
                <p className="text-[24px] font-bold w-[95%]">Prediction</p>
                <IoIosInformationCircle className="text-[35px] text-[#625F5F]" />
              </div>
              <div className="flex flex-row w-full h-full items-center justify-center">
                <div className="flex flex-col w-full items-center justify-center text-[#005898] font-bold">
                  <p className="text-[32px]">22.9%</p>{" "}
                  <p className="text-[1em]">Growth Rate (Surge)</p>
                </div>
                <div className="flex flex-col w-full items-center justify-center text-primary font-bold">
                  <p className="text-[32px]">77.1%</p>{" "}
                  <p className="text-[1em]">Drop Rate (Recline)</p>
                </div>
              </div>
            </div>
            {/* Best & Worst Case Section */}
            <div className="flex flex-col bg-white p-[10px] m-1 h-[25%] border-l-[15px] border-[#C7DCE1] rounded-e-lg shadow-lg">
              <div className="flex flex-row border-b-1 border-[#D9D9D9] items-center justify-center w-full pl-[20px]">
                <div className="flex items-center justify-center w-[50%]">
                  <p className="text-[24px] flex">Best Case</p>
                </div>
                <div className="flex items-center justify-center w-[50%]">
                  <p className="text-[24px]">Worst Case</p>
                </div>
                <IoIosInformationCircle className="text-[35px] text-[#625F5F] absolute right-[65px]" />
              </div>
              <div className="flex flex-row w-full h-full items-center justify-center">
                <div className="flex flex-row w-full items-center justify-center font-bold">
                  {/* Left Case Prediction Stat */}
                  <div className="flex flex-col w-full justify-center items-center text-[#005898]">
                    <div className="flex flex-col h-fit items-center justify-center">
                      <p className="text-[32px]">65%</p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[16px]">Surge</p>
                    </div>
                  </div>
                  <div className="flex flex-col w-full justify-center items-center text-primary">
                    <div className="flex flex-col h-fit items-center justify-center">
                      <p className="text-[32px]">35%</p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[16px]">Recline</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row w-full items-center justify-center font-bold border-l-2">
                  {/* Right Case Prediction Stat */}
                  <div className="flex flex-col w-full justify-center items-center text-[#005898]">
                    <div className="flex flex-col h-fit items-center justify-center">
                      <p className="text-[32px]">10%</p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[16px]">Surge</p>
                    </div>
                  </div>
                  <div className="flex flex-col w-full justify-center items-center text-primary">
                    <div className="flex flex-col h-fit items-center justify-center">
                      <p className="text-[32px]">90%</p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[16px]">Recline</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Projected Product Cost Case Section */}
            <div className="flex flex-col bg-white p-[10px] m-1 h-[50%] rounded-lg shadow-lg">
              <div className="border-b-1 border-[#D9D9D9] flex flex-row p-[5px]">
                <p className="text-[24px] font-bold w-[95%]">
                  Projected Product Cost
                </p>
                <IoIosInformationCircle className="text-[35px] text-[#625F5F]" />
              </div>
              <table className="border-b-1 border-[#D9D9D9]">
                <th className="flex items-start px-10 py-2">
                  <p>Material</p>
                </th>
                <th>
                  <p>Cost</p>
                </th>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectedCostPage;
