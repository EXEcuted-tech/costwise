"use client";
import React, { useState } from 'react';
import Header from '@/components/header/Header';
import { BiSolidReport } from "react-icons/bi";
import { BiCalendarEvent } from "react-icons/bi";
import { MdDownloadForOffline } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import SpecificFG from '@/components/pages/cost-calculation/SpecificFG';
import AllFG from '@/components/pages/cost-calculation/AllFG';
import { useSidebarContext } from '@/contexts/SidebarContext';

export interface ReportProps {
    no: String;
    itemCode: String;
    description: String;
    weight: String;
    unit: String;
    stdQty: String;
    actQty: String;
    itemType: number; // 1-(Main) 2-(Meat Materials) 3-(Food Additive) 4-(Packaging Materials)
};


const CostCalculation =() => {
    const { isOpen } = useSidebarContext();

    const [selectedFG, setSelectedFG] = useState('Specific-FG');
    const [specificFGSheets, setSpecificFGSheets] = useState([{ id: 0 }]);

    const handleFGClick = (fg: React.SetStateAction<string>) => {
        setSelectedFG(fg);
    };

    const handleAddSheet = () => {
        setSpecificFGSheets([...specificFGSheets, { id: specificFGSheets.length }]);
    };

    const handleRemoveSheet = (id: number) => {
        setSpecificFGSheets(specificFGSheets.filter(sheet => sheet.id !== id));
    };

    return (
        <div className='w-full'>
            <div>
                <Header icon={BiSolidReport} title="Cost Calculation" />
            </div>

            <div className='flex ml-[80px] mr-[35px]'>
                {/* Date Range */}
                <div className='w-[87rem] pt-14 pb-8'>
                    <div className='flex mb-4'>
                        <div className='text-[19px] mr-5 pt-2'>From</div>
                        <div className=''>
                            <BiCalendarEvent className='absolute text-[30px] text-[#6b6b6b82] mt-[6px] ml-2 z-[3]'/>
                            <select 
                                className='w-[220px] h-[45px] text-[21px] pl-[42px] pr-4 text-[#000000] bg-white border-1 border-[#929090] rounded-md drop-shadow-md cursor-pointer'
                                name="fromDate"
                                defaultValue=""
                            >
                                <option value="Jan24">January 2024</option>
                                <option value="Feb24">February 2024</option>
                            </select>
                        </div>
                    </div>
                    <div className='flex'>
                        <div className='text-[19px] ml-6 mr-5 pt-2 '>To</div>
                        <div className=''>
                            <BiCalendarEvent className='absolute text-[30px] text-[#6b6b6b82] mt-[6px] ml-2 z-[3]'/>
                            <select 
                                className='w-[220px] h-[45px] text-[21px] pl-[42px] pr-4 text-[#000000] bg-white border-1 border-[#929090] rounded-md drop-shadow-md cursor-pointer'
                                name="fromDate"
                                defaultValue=""
                            >
                                <option value="Jan24">January 2024</option>
                                <option value="Feb24">February 2024</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col pt-14 pb-8">
                    {/* FG Selector */}
                    <div className='flex mb-4'>
                        <div 
                            onClick={() => handleFGClick('Specific-FG')}
                            className={`w-[140px] h-[45px] text-[21px] py-1 text-center rounded-l-md border-1 border-[#929090] drop-shadow-md cursor-pointer 
                                ${selectedFG === 'Specific-FG' ? 'bg-[#B22222] text-white' : 'bg-white hover:bg-[#ebebeb] text-black transition-colors duration-200 ease-in-out'}`}
                        >
                            Specific-FG
                        </div>
                        <div 
                            onClick={() => handleFGClick('All-FG')}
                            className={`w-[140px] h-[45px] text-[21px] py-1 text-center rounded-r-md border-1 border-[#929090] drop-shadow-md cursor-pointer 
                                ${selectedFG === 'All-FG' ? 'bg-[#B22222] text-white' : 'bg-white hover:bg-[#ebebeb] text-black transition-colors duration-200 ease-in-out'}`}
                        >
                            All-FG
                        </div>
                    </div>

                    {/* Export Button */}
                    <div className={`${selectedFG === 'Specific-FG' && 'gap-2'} flex`}>
                        <div className={`${selectedFG !== 'Specific-FG' && 'w-full'} flex`}>
                            <select 
                                className={`${selectedFG === 'Specific-FG' ? 'w-[95px]' : 'w-full'} h-[45px] text-[21px] pl-[10px] text-[#000000] bg-white border-1 border-[#929090] rounded-l-md drop-shadow-md cursor-pointer`}
                                name="fromDate"
                                defaultValue=""
                            >
                                <option value="XLSX">XLSX</option>
                                <option value="CSV">CSV</option>
                            </select>
                            
                            <button className='w-[40px] h-[45px] bg-[#B22222] hover:bg-[#961d1d] transition-colors duration-200 ease-in-out px-[5px] rounded-r-md cursor-pointer'>
                                <MdDownloadForOffline className='text-white text-[30px] hover:animate-shake-tilt' />
                            </button>
                        </div>

                        {selectedFG === 'Specific-FG' && (
                            <div 
                                onClick={handleAddSheet} 
                                className='flex items-center w-full h-[45px] text-white bg-[#B22222] hover:bg-[#961d1d] transition-colors duration-200 ease-in-out px-[5px] rounded-md cursor-pointer'>
                                <IoMdAdd className='text-[24px] mr-1' /> <p className='text-[21px] font-bold'>FG Sheet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div>
                {selectedFG === 'Specific-FG' && 
                    specificFGSheets.map(sheet => (
                        <SpecificFG key={sheet.id} id={sheet.id} removeSheet={handleRemoveSheet} isOpen={isOpen} sheetData={FGSheetFakeData} finishedGoods={FinishedGoodsList} />
                    ))
                }
                {selectedFG === 'All-FG' && <AllFG title={FakeProdReportTitle} isOpen={isOpen} sheetData={FGSheetFakeData} />}
            </div>
        </div>
    )
}

export default CostCalculation;

const FinishedGoodsList = ["BIG SHOT Hotdog Classic Super Jumbo 1k", "BIG SHOT Hotdog with Cheese Super Jumbo 1k", "BIG SHOT Hotdog Sweet Style "];

const FGSheetFakeData = [
    {
        no: '1',
        itemCode: '4800088288330',
        description: 'BIG SHOT Hotdog Classic Super Jumbo 1k',
        weight: '3,164.00',
        unit: 'pack',
        stdQty: '79,663.000',
        actQty: '2,741.000',
        itemType: 1
    },
    {
        no: '1',
        itemCode: '4800088288330',
        description: 'BIG SHOT Hotdog Classic King Size 1k',
        weight: '3,164.00',
        unit: 'pack',
        stdQty: '79,663.000',
        actQty: '2,741.000',
        itemType: 1
    },
    {
        no: '',
        itemCode: 'SA-MP-GR-CH-BA-0001',
        description: 'SA 132',
        weight: '0.00',
        unit: 'kg',
        stdQty: '26,709.000',
        actQty: '104,449.500',
        itemType: 2
    },
    {
        no: '',
        itemCode: 'SA-MP-GR-CH-SK-0001',
        description: 'SA 142',
        weight: '0.00',
        unit: 'kg',
        stdQty: '6,100.000',
        actQty: '24,705.000 ',
        itemType: 2
    },
    {
        no: '',
        itemCode: 'SA-MP-GR-MD-ME-0001A',
        description: 'SA 144',
        weight: '0.00',
        unit: 'kg',
        stdQty: '6,100.000',
        actQty: '44,752.500',
        itemType: 2
    },
    {
        no: '',
        itemCode: 'RM-NM-FI-FC-01-0001',
        description: 'FOOD COLOR 01',
        weight: '0.00',
        unit: 'kg',
        stdQty: '14.500',
        actQty: '31.500',
        itemType: 3
    },
    {
        no: '',
        itemCode: 'RM-NM-FI-LF-03-0002',
        description: 'LIQUID FLAVOR 02',
        weight: '0.00',
        unit: 'liter',
        stdQty: '3,596.000',
        actQty: '7,812.000',
        itemType: 3
    },
    {
        no: '',
        itemCode: 'RM-NM-FI-PH-03-0001',
        description: 'PHOSPHATE 01',
        weight: '0.00',
        unit: 'kg',
        stdQty: '203.000',
        actQty: '7,812.000',
        itemType: 3
    },
    {
        no: '',
        itemCode: 'RM-NM-PK-LP-VF-TO01',
        description: 'LAMINATED PLASTIC 113',
        weight: '0.00',
        unit: 'pc',
        stdQty: '379,030.000',
        actQty: '501,607.000',
        itemType: 4
    },
    {
        no: '',
        itemCode: 'RM-NM-PK-LP-VF-TO02',
        description: 'LAMINATED PLASTIC 114',
        weight: '0.00',
        unit: 'pc',
        stdQty: '84,942.000',
        actQty: '41,129.000',
        itemType: 4
    },
    {
        no: '',
        itemCode: 'RM-NM-PK-PO-05-1003',
        description: 'POLYBAG 10',
        weight: '0.00',
        unit: 'pc',
        stdQty: '13,068.000',
        actQty: '0.000',
        itemType: 4
    },    
    
]

const FakeProdReportTitle = "Cost of Production Report as of January 2024";
