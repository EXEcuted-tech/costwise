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
import { SpecificFinishedGood, Component } from '@/types/data';
import api from '@/utils/api';


const CostCalculation =() => {
    const { isOpen } = useSidebarContext();
    const [selectedFG, setSelectedFG] = useState<string>('Specific-FG');
    const [alertMessages, setAlertMessages] = useState<string[]>([]);
    const [alertStatus, setAlertStatus] = useState<string>('');

    const [monthYearOptions, setMonthYearOptions] = useState<{value: number, label: string}[]>([]);
    const [monthYear, setMonthYear] = useState<{value: number, label: string}>({value: 0, label: ''});
    const [exportType, setExportType] = useState<string>('xlsx');
    const [sheets, setSheets] = useState<{id: number, data: SpecificFinishedGood | null}[]>([{ id: 0, data: null }]);

    const handleFGClick = (fg: React.SetStateAction<string>) => {
        setSelectedFG(fg);
    };

    const handleAddSheet = () => {
        setSheets([...sheets, { id: sheets.length, data: null }]);
    };

    const handleRemoveSheet = (id: number) => {
        setSheets(sheets.filter(sheet => sheet.id !== id));
    };

    const updateSheetData = (id: number, data: SpecificFinishedGood) => {
        setSheets(sheets.map(sheet => sheet.id === id ? { ...sheet, data } : sheet));
    };

    const handleMonthYear = (value: string, label: string)  => {
        const numericValue = parseInt(value, 10);
        if (!isNaN(numericValue)) {
            setMonthYear({value: numericValue, label: label});
        }
    };

    const handleExport = async () => {
        const sheetData = sheets.filter(sheet => sheet.data !== null).map(sheet => sheet.data);
        if (sheetData.length === 0) {
           setAlertMessages(["No sheets are selected"]);
           setAlertStatus("error");
           return;
        }

        try {
            const response = await api.post('/cost_calculation/export', {
                sheets: sheetData,
                exportType: exportType,
                monthYear: monthYear.value
            });

            if (response.status === 200) {
                setAlertMessages(["Workbook exported successfully"]);
                setAlertStatus("success");
            } else {
                setAlertMessages(["Error exporting workbook:", response.data.message]);
                setAlertStatus("error");
            }
        } catch (error) {
            console.error('Error exporting workbook:', error);
            // Show an error alert
        }
    };

    const retrieveMonthYearOptions = async () => {
        try {
            const response = await api.get('/cost_calculation/retrieve_month_year_options');
            if (response.status === 200) {
                setMonthYearOptions(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    //Retrieve month and year options
    useEffect(() => {
        retrieveMonthYearOptions();

        console.log("sheets: ", sheets);
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
                        <div className='text-[19px] mr-5 pt-4'>Month & Year  <span className='text-[#B22222] ml-1 font-bold'>*</span></div>
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
                            value={exportType}
                            onChange={(e) => setExportType(e.target.value)}
                            >
                                <option value="xlsx">XLSX</option>
                                <option value="csv">CSV</option>
                            </select>
                            
                        <button 
                            className='w-[40px] h-[45px] bg-[#B22222] hover:bg-[#961d1d] transition-colors duration-200 ease-in-out px-[5px] rounded-r-md cursor-pointer'
                            onClick={handleExport}
                            >
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
                {sheets.map(sheet => (
                    <SpecificFG 
                        key={sheet.id} 
                        id={sheet.id} 
                        removeSheet={handleRemoveSheet}
                        updateSheetData={updateSheetData}
                        isOpen={isOpen} 
                        monthYear={monthYear}
                    />
                ))}
                {/* {selectedFG === 'All-FG' && <AllFG title={FakeProdReportTitle} isOpen={isOpen} sheetData={FGSheetFakeData} />} */}
            </div>
        </div>
    )
}

export default CostCalculation;
