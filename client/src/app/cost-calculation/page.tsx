"use client";
import React, { useState } from 'react';
import Header from '@/components/header/Header';
import { BiSolidReport } from "react-icons/bi";
import { BiCalendarEvent } from "react-icons/bi";
import { MdDownloadForOffline } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import SpecificFG from '@/components/pages/cost-calculation/SpecificFG';
import AllFG from '@/components/pages/cost-calculation/AllFG';

export interface ReportGenerationProps {
    no: Number;
    itemCode: String;
    description: String;
    weight: Number;
    unit: String;
    stdQty: Number;
    actQty: Number;
};

const ReportGeneration:React.FC<ReportGenerationProps> =({}) => {
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
                                ${selectedFG === 'Specific-FG' ? 'bg-[#B22222] text-white' : 'bg-white text-black'}`}
                        >
                            Specific-FG
                        </div>
                        <div 
                            onClick={() => handleFGClick('All-FG')}
                            className={`w-[140px] h-[45px] text-[21px] py-1 text-center rounded-r-md border-1 border-[#929090] drop-shadow-md cursor-pointer 
                                ${selectedFG === 'All-FG' ? 'bg-[#B22222] text-white' : 'bg-white text-black'}`}
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
                            
                            <button className='w-[40px] h-[45px] bg-[#B22222] px-[5px] rounded-r-md cursor-pointer'>
                                <MdDownloadForOffline className='text-white text-[30px]' />
                            </button>
                        </div>

                        {selectedFG === 'Specific-FG' && (
                            <div 
                                onClick={handleAddSheet} 
                                className='flex items-center w-full h-[45px] text-white bg-[#B22222] px-[5px] rounded-md cursor-pointer'>
                                <IoMdAdd className='text-[24px] mr-1' /> <p className='text-[21px] font-bold'>FG Sheet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div>
                {selectedFG === 'Specific-FG' && 
                    specificFGSheets.map(sheet => (
                        <SpecificFG key={sheet.id} id={sheet.id} removeSheet={handleRemoveSheet} />
                    ))
                }
                {selectedFG === 'All-FG' && <AllFG />}
            </div>
        </div>
    )
}

export default ReportGeneration;

const FGSheetFakeData = [
    {
        no: '1',
        itemCode: '4800088288330',
        description: 'BIG SHOT Hotdog Classic Super Jumbo 1k',
        weight: '3,164.00',
        unit: 'pack',
        stdQty: '79,663.000',
        actQty: '2,741.000'
    },

    {
        no: '1',
        itemCode: '4800088288330',
        description: 'BIG SHOT Hotdog Classic King Size 1k',
        weight: '3,164.00',
        unit: 'pack',
        stdQty: '79,663.000',
        actQty: '2,741.000'
    },

    {
        no: '',
        itemCode: 'SA-MP-GR-CH-BA-0001',
        description: 'SA 132',
        weight: '0.00',
        unit: 'kg',
        stdQty: '26,709.000',
        actQty: '104,449.500'
    },

    {
        no: '',
        itemCode: 'SA-MP-GR-CH-SK-0001',
        description: 'SA 142',
        weight: '0.00',
        unit: 'kg',
        stdQty: '6,100.000',
        actQty: '24,705.000 '
    },
    {
        no: '',
        itemCode: 'SA-MP-GR-MD-ME-0001A',
        description: 'SA 144',
        weight: '0.00',
        unit: 'kg',
        stdQty: '6,100.000',
        actQty: '44,752.500'
    },
]