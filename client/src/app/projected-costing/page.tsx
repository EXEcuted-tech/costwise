"use client";
import Header from "@/components/header/Header";
import { useState } from "react";
import { MdOutlineAnalytics } from "react-icons/md";
import { IoCalendarSharp } from "react-icons/io5";
import { IoIosInformationCircle } from "react-icons/io";
import { Chart as ChartJS } from "chart.js/auto";
import LineChart from "@/components/charts/LineChart";

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
  const [data] = useState({
    labels: priceData.map((date) => date.month), // Use month instead of year for labels
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
              className={`text-tertiary flex justify-between border border-tertiary rounded-xl p-[5px] cursor-pointer transition items-start ${
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
            </div>
            <ul
              className={`list-none px-[1px] absolute border border-gray-300 rounded-lg top-[2.7em] left-50% w-full translate-[-50%] transition z-1 overflow-hidden bg-white shadow-md ${
                !isActiveStart ? "block opacity-100" : "opacity-0"
              } ${monthList.length < 6 ? " " : "overflow-y-scroll h-[175px]"}`}
            >
              {monthList.map((date) => (
                <li
                  className={`px-[2px] py-[2px] mx-[0.1em] cursor-pointer hover:shadow-lg text-[20px] ${
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
          {/* Dropdown List End*/}
          <div className="min-w-[200px] relative ml-[50px] mt-[15px] text-[16px]">
            <div
              className={`text-tertiary flex justify-between border border-tertiary rounded-xl p-[5px] cursor-pointer transition items-start ${
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
                !isActiveEnd ? "opacity-100" : "opacity-0"
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
            <div>
              <LineChart chartData={data} />
            </div>
            <div className="h-[45%] bg-green-300">{/* <Camera /> */}</div>
          </div>
          {/* Right Div */}
          <div className="w-[45%] h-full bg-yellow-300"></div>
        </div>
      </div>
    </div>
  );
};

export default ProjectedCostPage;
