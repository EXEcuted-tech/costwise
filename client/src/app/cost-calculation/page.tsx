"use client";
import React, { useEffect, useState } from 'react';
import Header from '@/components/header/Header';
import { BiSolidReport } from "react-icons/bi";
import { BiCalendarEvent } from "react-icons/bi";
import { MdDownloadForOffline } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import SpecificFG from '@/components/pages/cost-calculation/SpecificFG';
import AllFG from '@/components/pages/cost-calculation/AllFG';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { FinishedGood } from '@/types/data';
import api from '@/utils/api';


const CostCalculation =() => {
    const { isOpen } = useSidebarContext();

    const [selectedFG, setSelectedFG] = useState('Specific-FG');
    const [specificFGSheets, setSpecificFGSheets] = useState([{ id: 0 }]);

    const [monthYearOptions, setMonthYearOptions] = useState<{value: number, label: string}[]>([]);
    const [monthYear, setMonthYear] = useState<{value: number, label: string}>({value: 0, label: ''});
    const [exportType, setExportType] = useState<string>('');


    const handleFGClick = (fg: React.SetStateAction<string>) => {
        setSelectedFG(fg);
    };

    const handleAddSheet = () => {
        setSpecificFGSheets([...specificFGSheets, { id: specificFGSheets.length }]);
    };

    const handleRemoveSheet = (id: number) => {
        setSpecificFGSheets(specificFGSheets.filter(sheet => sheet.id !== id));
    };

    const handleExportType = (type: string) => {
        setExportType(type);
    };

    const handleMonthYear = (value: string, label: string)  => {
        const numericValue = parseInt(value, 10);
        if (!isNaN(numericValue)) {
            setMonthYear({value: numericValue, label: label});
        }
    };

    //Retrieve month and year options
    useEffect(() => {
        const retrieveMonthYearOptions = async () => {
            try {
                const response = await api.get('/finished_goods/retrieve_month_year_options');
                if (response.status === 200) {
                    setMonthYearOptions(response.data.data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        retrieveMonthYearOptions();
    }, []);

    return (
        <div className='w-full'>
            <div>
                <Header icon={BiSolidReport} title="Cost Calculation" />
            </div>

            <div className='flex mt-[30px] ml-[80px] mr-[35px]'>
                <div className='w-[30rem] pb-8'>
                    {/* Date Range */}
                    <div className='flex'>
                        <div className='text-[19px] mr-5 pt-4'>Month & Year</div>
                    </div>
                    <div className='mt-2'>
                        <BiCalendarEvent className='absolute text-[30px] text-[#6b6b6b82] mt-[6px] ml-2 z-[3]'/>
                        <select 
                            className='w-[220px] h-[45px] text-[21px] pl-[42px] pr-4 text-[#000000] bg-white border-1 border-[#929090] rounded-md drop-shadow-md cursor-pointer'
                            name="Month & Year"
                            defaultValue=""
                            onChange={(e) => handleMonthYear(e.target.value, e.target.options[e.target.selectedIndex].text)}
                            >
                                <option value="" disabled>mm-yyyy</option>
                                {monthYearOptions.map((option, index) => (
                                    <option key={index} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                        </select>
                    </div>
                    {/* FG Selector */}
                    <div className='flex mt-4'>
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
                </div>

                <div className="flex flex-col ml-auto">
                    {/* Export Button */}
                    <div className='flex ml-auto'>
                        <div className='text-[19px] mr-5 pt-4'>Export File</div>
                    </div>
                    <div className='flex mt-2 ml-auto'>
                        <select 
                            className='w-[95px] h-[45px] text-[21px] pl-[10px] text-[#000000] bg-white border-1 border-[#929090] rounded-l-md drop-shadow-md cursor-pointer'
                            name="fromDate"
                            defaultValue="xlsx"
                            onChange={(e) => handleExportType(e.target.value)}
                            >
                                <option value="xlsx">XLSX</option>
                                <option value="csv">CSV</option>
                            </select>
                            
                        <button className='w-[40px] h-[45px] bg-[#B22222] hover:bg-[#961d1d] transition-colors duration-200 ease-in-out px-[5px] rounded-r-md cursor-pointer'>
                            <MdDownloadForOffline className='text-white text-[30px] hover:animate-shake-tilt' />
                        </button>
                    </div>

                    {/* Add Sheet Button */}
                    <div className="h-[45px] mt-4">
                        {selectedFG === 'Specific-FG' && (
                            <div 
                                onClick={handleAddSheet} 
                                className='flex items-center w-[170px] px-4 h-[45px] text-white bg-[#B22222] hover:bg-[#961d1d] transition-colors duration-200 ease-in-out rounded-md cursor-pointer'>
                                <IoMdAdd className='text-[28px] mr-3' /> <p className='text-[21px] font-bold'>FG Sheet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <div>
                {selectedFG === 'Specific-FG' && 
                    specificFGSheets.map(sheet => (
                        <SpecificFG key={sheet.id} id={sheet.id} removeSheet={handleRemoveSheet} isOpen={isOpen} monthYear={monthYear} exportType={exportType} />
                    ))
                }
                {/* {selectedFG === 'All-FG' && <AllFG title={FakeProdReportTitle} isOpen={isOpen} sheetData={FGSheetFakeData} />} */}
            </div>
        </div>
    )
}

export default CostCalculation;
