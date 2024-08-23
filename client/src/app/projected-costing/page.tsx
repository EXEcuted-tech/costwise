"use client";
import Header from "@/components/header/Header";
import { useState } from "react";
import { MdOutlineAnalytics } from "react-icons/md";
import { IoCalendarSharp } from "react-icons/io5";

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

  return (
    <div
      className="overflow-hidden bg-cover bg-center items-center justify-center bg-[#FFFAF8] bg-opacity-20"
      style={{ backgroundImage: "url('/images/usermanbg.png')" }}
    >
      <div>
        <Header icon={MdOutlineAnalytics} title={"Projected Costing"} />
      </div>
      <div
        className="w-full ml-[45px] pr-[45px] h-[90vh] flex flex-col items-start justify-start pt-[15px] py-[15px]
            "
      >
        <p className="text-[30px] text-tertiary">Equipment Costs</p>
        <div className="flex flex-row h-[5%] w-[100%] items-start justify-start flex-wrap">
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
                !isActiveStart ? "opacity-100" : "opacity-0"
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
      </div>
    </div>
  );
};

export default ProjectedCostPage;
