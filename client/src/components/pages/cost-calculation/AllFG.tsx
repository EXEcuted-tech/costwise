import React, { useState } from "react";
import { AllFinishedGood } from "@/types/data";
import Spinner from "@/components/loaders/Spinner";
import { RiFileCloseFill } from "react-icons/ri";

type AllFGrops = {
  isOpen?: boolean;
  title: String;
  sheetData: AllFinishedGood[];
  isLoading: boolean;
};

const AllFG: React.FC<AllFGrops> = ({ isOpen, title, sheetData, isLoading }) => {

    const columnNames = [
    "No.",
    "Item Code",
    "Description",
    "Factory Overhead",
    "Direct Labor",
    "RM Cost",
    "Total Cost",
  ];

  return (
    <div
      className={`${
        isOpen ? "xl:ml-[4rem]" : ""
      } relative w-auto h-[40rem] ml-[5rem] mr-[35px] mb-10 bg-white dark:bg-[#3C3C3C] rounded-2xl border-1 border-[#656565] shadow-md animate-pull-down`}
    >
      {/* Header */}
      <div
        className={`${
          isOpen
            ? "xl:py-3 xl:text-[22px] 2xl:text-[23px] 3xl:text-[24px] 4xl:text-[24px]"
            : "xl:py-3 xl:text-[22px] 2xl:text-[24px] 3xl:text-[24px] 4xl:text-[24px] text-[24px]"
        } h-14 rounded-t-2xl bg-[#B22222] text-white font-bold py-2 pl-7 capitalize drop-shadow-xl`}
      >
        <p>📋 {title}</p>
      </div>

      {/* Main Content Area */}
      <div className="h-[582px] rounded-b-2xl overflow-x-auto overflow-y-scroll">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              {columnNames.map((columnName, index) => (
                <th
                  key={index}
                  className={`${
                    isOpen
                      ? "xl:pl-[35px] 2xl:pl-[40px] 3xl:pl-6 4xl:pl-6 xl:text-[16px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[20px]"
                      : "xl:text-[16px] 2xl:text-[20px] 3xl:text-[20px] text-[20px]"
                  } text-center animate-zoomIn whitespace-nowrap font-bold dark:text-[#d1d1d1] text-[#6B6B6B] py-2 px-6 border-b border-[#ACACAC]`}
                >
                  {columnName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
          {isLoading ? (
                <tr>
                  <td
                    colSpan={columnNames.length}
                    className="text-center py-[14rem] dark:text-white"
                  >
                    <div className='flex justify-center items-center'>
                      <Spinner />
                    </div>
                  </td>
                </tr>
              ) : sheetData.length > 0 ? (
                <>
                  {sheetData.map((data, index) => (
                    <tr
                      key={data.fg_id}
                className={`text-[#6B6B6B] dark:text-[#d1d1d1] ${
                  isOpen
                    ? "xl:text-[16px] 2xl:text-[17px] 3xl:text-[20px] 4xl:text-[20px]"
                    : "xl:text-[16px] 2xl:text-[20px] 3xl:text-[20px] 4xl:text-[20px] text-[20px]"
                }`}
              >
                <td className="text-center px-6 py-2">{index + 1}</td>
                <td className="text-center">{data.fg_code}</td>
                <td className="text-left pl-6">{data.fg_desc}</td>
                <td className="text-right px-6">{data.factory_overhead}</td>
                <td className="text-right px-6">{data.direct_labor}</td>
                <td className="text-right px-6">{data.rm_cost}</td>
                <td className="text-right px-6">{data.total_cost}</td>
              </tr>
            ))}
            
          </>
        ) : (
          <tr>
          <td colSpan={columnNames.length} className="items-center justify-items-center text-center font-semibold pt-[13rem] text-[#555555] dark:text-white">
            <RiFileCloseFill className='text-[85px] mb-4' />
            No report created. <br /> Select a month year period to
            create the cost summary report.
            </td>
          </tr>
          )}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllFG;
