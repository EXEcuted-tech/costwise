"use client"
import React from 'react';
import { CgRemoveR } from "react-icons/cg";
import { ReportProps } from '@/app/cost-calculation/page';
import CustomGoodsSelect from '@/components/form-controls/CustomGoodsSelect';

type SpecificFGProps = {
    id: number;
    removeSheet: (id: number) => void;
    isOpen: boolean;
    sheetData: ReportProps[];
    finishedGoods: string[];
};

const SpecificFG: React.FC<SpecificFGProps> = ({ id, removeSheet, isOpen, sheetData, finishedGoods }) => {
    const columnNames = ["No.", "Item Code", "Description", "Weight", "Unit", "StdQty", "ActQty"];

    // Grouping data by itemType
    const groupedData = sheetData.reduce((acc, item) => {
        if (!acc[item.itemType]) {
            acc[item.itemType] = [];
        }
        acc[item.itemType].push(item);
        return acc;
    }, {} as { [key: number]: ReportProps[] });

    const itemTypeLabels = {
        1: "OUTPUT - VOLUME PRODUCED",
        2: "MEAT MATERIALS",
        3: "FOOD ADDITIVES & MEAT EXTENDERS",
        4: "PACKAGING MATERIALS"
    } as { [key: number]: string };

    const handleChange = (selectedValue: string) => {
        // console.log('Selected:', selectedValue);
        // Add your logic here
      };

      
    return (
        <div className={`${isOpen ? '' : ''} relative w-auto h-[40rem] ml-[5rem] mr-[35px] mb-10 bg-white rounded-2xl border-1 border-[#656565] shadow-md animate-pull-down`}>
            {/* Header */}
            <div className='flex h-14 rounded-t-2xl bg-[#B22222] text-white text-[26px] font-bold py-2 pl-7 drop-shadow-xl'>
                <CustomGoodsSelect
                    options={finishedGoods}
                    placeholder="Choose Finished Good"
                    isOpen={isOpen}
                    onChange={handleChange}
                />

                {/* Delete Button */}
                <button
                    onClick={() => removeSheet(id)}
                    className='text-[30px] ml-auto mr-4 cursor-pointer opacity-100 hover:opacity-75 transition-opacity duration-300 ease-in-out'>
                    <CgRemoveR />
                </button>
            </div>

            {/* Main Content Area */}
            <div className='h-[582px] rounded-b-2xl overflow-x-auto overflow-y-scroll'>
                <table className='table-auto w-full border-collapse'>
                    <thead>
                        <tr>
                            {columnNames.map((columnName, index) => (
                                <th key={index} className={`${isOpen ? 'xl:pl-[35px] 2xl:pl-[40px] 3xl:pl-6 4xl:pl-6 xl:text-[16px] 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[20px]' : 'xl:text-[16px] 2xl:text-[20px] 3xl:text-[20px] text-[20px]'} text-center animate-zoomIn whitespace-nowrap font-bold  text-[#6B6B6B] py-2 px-6 border-b border-[#ACACAC]`}>
                                    {columnName}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(groupedData).map(key => {
                            const numericKey = Number(key);
                            return (
                                <React.Fragment key={numericKey}>
                                    {/* Section Separator */}
                                    <tr>
                                        <td colSpan={7} className={`${isOpen ? 'xl:text-[16px] 2xl:text-[17px] 3xl:text-[19px] 4xl:text-[19px]' : ' xl:text-[16px] 2xl:text-[19px] 3xl:text-[19px] 4xl:text-[19px] text-[19px]'} text-left font-bold  text-[#6B6B6B] px-6 py-1 bg-gray-100`}>
                                            {itemTypeLabels[numericKey]}
                                        </td>
                                    </tr>
                                    {groupedData[numericKey].map((data, index) => (
                                        <tr key={index}
                                            className={`text-[#6B6B6B]
                                            ${isOpen ? 'xl:text-[16px] 2xl:text-[17px] 3xl:text-[20px] 4xl:text-[20px]' : ' xl:text-[14px] 2xl:text-[20px] 3xl:text-[20px] 4xl:text-[20px] text-[20px]'}
                                            ${data.itemType === 1 ? 'font-bold' : ''} `}
                                        >
                                            <td className='text-center px-6 py-2'>{data.no}</td>
                                            <td className='text-center'>{data.itemCode}</td>
                                            <td className={`${isOpen ? 'xl:pl-9 2xl:pl-5 3xl:pl-5 4xl:pl-5' : 'xl:pl-5 2xl:pl-5 3xl:pl-0 4xl:pl-0'}`}>{data.description}</td>
                                            <td className='text-right'>{data.weight}</td>
                                            <td className={`${isOpen ? 'xl:pl-9 2xl:pl-14 3xl:pl-0 4xl:pl-0' : ''} text-center`}>{data.unit}</td>
                                            <td className='text-right'>{data.stdQty}</td>
                                            <td className={`${isOpen ? 'xl:pl-9 2xl:pl-5 3xl:pl-5 4xl:pl-5' : 'xl:pl-5 2xl:pl-5 3xl:pl-0 4xl:pl-0'} text-right pr-4 `}>{data.actQty}</td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SpecificFG;