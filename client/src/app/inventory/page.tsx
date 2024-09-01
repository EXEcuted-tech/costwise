"use client";
import React, { useState } from 'react';
import Header from '@/components/header/Header';
import { useSidebarContext } from '@/context/SidebarContext';
import { LuCircle } from "react-icons/lu";
import { MdTrolley, MdCalendarToday } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward, IoIosSearch } from "react-icons/io";
import PrimaryPagination from '@/components/pagination/PrimaryPagination';
import MonthSelector from '@/components/modal/MonthSelector';

export interface InventoryProps {
    itemCode: String;
    description: String;
    unit: String;
    cost: String;
    status: String;
    inStock: String;
    qty: String;
};

const Inventory = () => {
    const { isOpen } = useSidebarContext();
    const columnNames = ["Item Code", "Description", "Unit", "Price", "Status", "In Stock", "Qty"];
    const monthOptions = ["January 2024", "February 2024", "March 2024"];

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedMonth, setSelectedMonth] = useState<string>(monthOptions[1]); // Default to February 2024
    const [isMonthSelectorModalOpen, setMonthSelectorModalOpen] = useState(false);

    const handlePageChange = (e: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const openMonthSelectorModal = () => {
        setMonthSelectorModalOpen(true);
    };

    const closeMonthSelectorModal = () => {
        setMonthSelectorModalOpen(false);
    };

    const handleMonthSelect = (month: string) => {
        setSelectedMonth(month);
        closeMonthSelectorModal();
    };

    const handlePreviousMonth = () => {
        const currentIndex = monthOptions.indexOf(selectedMonth);
        const previousIndex = (currentIndex - 1 + monthOptions.length) % monthOptions.length;
        setSelectedMonth(monthOptions[previousIndex]);
    };

    const handleNextMonth = () => {
        const currentIndex = monthOptions.indexOf(selectedMonth);
        const nextIndex = (currentIndex + 1) % monthOptions.length;
        setSelectedMonth(monthOptions[nextIndex]);
    };

    const currentIndex = monthOptions.indexOf(selectedMonth);
    const indexOfLastItem = currentPage * 8;
    const indexOfFirstItem = indexOfLastItem - 8;
    const currentListPage = InventoryFakeData.slice(indexOfFirstItem, indexOfLastItem); //change to data

    return (
        <>
            {isMonthSelectorModalOpen &&
                <MonthSelector months={monthOptions} onMonthSelect={handleMonthSelect} onClose={closeMonthSelectorModal} />
            }

            <div className='w-full'>
                <div>
                    <Header icon={MdTrolley} title="Inventory" />
                </div>

                <div className={`${isOpen ? '4xl:h-[47rem] 3xl:h-[45rem] 2xl:h-[45rem] xl:h-[44rem]' : '4xl:h-[47rem] 3xl:h-[47rem] 2xl:h-[47rem] xl:h-[43rem]'} relative w-auto h-[47rem] ml-[4rem] mr-[3rem] my-[3rem] rounded-2xl bg-white border-1 border-[#656565] shadow-md animate-fade-in2`}>
                    {/* Header */}
                    <div className='flex h-14 rounded-t-2xl bg-[#B22222] text-white text-[26px] font-bold py-2 pl-5'>
                        <LuCircle className='text-[30px] mt-1 mr-3' /> <p>{selectedMonth}</p>

                        {/* Month Button */}
                        <button
                            onClick={openMonthSelectorModal}
                            className='ml-6 text-white text-[28px] bg-[#d9d9d98e] px-2 py-1 rounded-lg cursor-pointer opacity-100 hover:opacity-75 transition-opacity duration-300 ease-in-out'>
                            <MdCalendarToday className='' />
                        </button>

                        {/* Navigator Buttons */}
                        <div className='flex w-[8rem] ml-auto'>
                            <div className='w-[50%]'>
                                {currentIndex > 0 && (
                                    <button
                                        onClick={handlePreviousMonth}
                                        className='w-[2.5rem] h-[2.5rem] rounded-full text-white text-[30px] px-1 mr-4 bg-[#d9d9d98e] cursor-pointer opacity-100 hover:opacity-75 transition-opacity duration-300 ease-in-out'>
                                        <IoIosArrowBack />
                                    </button>
                                )}
                            </div>
                            {currentIndex < monthOptions.length - 1 && (
                                <button
                                    onClick={handleNextMonth}
                                    className='w-[2.5rem] h-[2.5rem] rounded-full text-white text-[30px] px-2 mr-4 bg-[#d9d9d98e] cursor-pointer opacity-100 hover:opacity-75 transition-opacity duration-300 ease-in-out'>
                                    <IoIosArrowForward />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Search Area */}
                    <div className='flex w-full h-[3.5rem] bg-[#F3F3F3] border-solid border-b border-[#868686]'>
                        <div className="mt-[0.8em] ml-7 text-gray-400">
                            <div className='flex absolute text-[1.3em] mt-[0.3rem] ml-3'>
                                <IoIosSearch />
                            </div>
                            <input
                                className={`${isOpen ? '4xl:w-[30rem] 3xl:w-[25rem] 2xl:w-[20rem] xl:w-[12rem]' : '4xl:w-[30rem] 3xl:w-[30rem] 2xl:w-[30rem] xl:w-[15rem]'} w-[30rem] bg-white h-8  px-5 pl-9 text-[1.1em] border border-gray-400 rounded-lg focus:outline-none`}
                                type="search"
                                name="search"
                                placeholder="Search here..."
                            />
                        </div>

                        <div className='mt-[0.8em] mr-4 ml-auto text-gray-400'>
                            <select
                                className={`${isOpen ? '4xl:w-[20rem] 3xl:w-[20rem] 2xl:w-[15rem] xl:w-[10rem]' : ''} bg-white h-8 w-[20rem] pl-3 text-[1.1em] mr-4 border border-gray-400 rounded-lg focus:outline-none`}
                            >
                                <option selected value="" disabled hidden>Item</option>
                                <option value="all">All</option>
                                <option value="meat-materials">Meat Materials</option>
                                <option value="food-additives">Food Additives & Meat Extenders</option>
                                <option value="packaging-materials">Packaging Materials</option>

                            </select>

                            <select
                                className='bg-white h-8 w-[8rem] pl-3 text-[1.1em] border border-gray-400 rounded-lg focus:outline-none'
                            >
                                <option selected value="" disabled hidden>Status</option>
                                <option value="all">All</option>
                                <option value="in-stock">In Stock</option>
                                <option value="low-stock">Low Stock</option>
                            </select>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className={`${isOpen ? '4xl:h-[552px] 3xl:h-[525px] 2xl:h-[525px] xl:h-[515px]' : '4xl:h-[552px] 3xl:h-[552px] 2xl:h-[552px] xl:h-[500px]'} h-[552px] overflow-x-auto`}>
                        <table className='table-auto w-full border-collapse'>
                            <thead>
                                <tr>
                                    {columnNames.map((columnName, index) => (
                                        <th key={index} className={`${isOpen ? '4xl:text-[20px] 3xl:text-[18px] 2xl:text-[18px] xl:text-[16px]' : '4xl:text-[20px] 3xl:text-[20px] 2xl:text-[20px] xl:text-[16px]'} text-[20px] text-center animate-zoomIn whitespace-nowrap font-bold  text-[#6B6B6B] py-2 px-6 border-b border-[#ACACAC]`}>
                                            {columnName}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {currentListPage.length > 0 ? (
                                    currentListPage.map((data, index) => (
                                        <tr key={index} className={`${isOpen ? '4xl:text-[20px] 3xl:text-[18px] 2xl:text-[18px] xl:text-[16px]' : '4xl:text-[20px] 3xl:text-[20px] 2xl:text-[20px] xl:text-[16px]'} text-[20px] text-black text-center border-b border-[#ACACAC] hover:bg-gray-50`}>
                                            <td className='w-[10rem] py-4'>{data.itemCode}</td>
                                            <td className='break-words'>{data.description}</td>
                                            <td>{data.unit}</td>
                                            <td>{data.unit}</td>
                                            <td>
                                                <div className='flex justify-center'>
                                                    <p
                                                        className={`${data.status === 'In Stock'
                                                            ? 'text-[#00930F] bg-[#9EE29E]'
                                                            : 'text-[#317AFA] bg-[#B6CDFF]'
                                                            } rounded-2xl w-[9rem]`}
                                                    >
                                                        {data.status}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className='w-[10%]'>{data.inStock}</td>
                                            <td className=''>{data.qty}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columnNames.length} className='text-center py-10 text-[#555555]'>
                                            No items found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="flex w-full justify-center h-[86px] rounded-b-xl border-[#868686]">
                        <PrimaryPagination
                            data={InventoryFakeData} //change to data
                            itemsPerPage={8}
                            handlePageChange={handlePageChange}
                            currentPage={currentPage}
                        />
                    </div>
                </div>
            </div>
        </>
    )
};

export default Inventory;

const InventoryFakeData = [
    {
        itemCode: "FG-01",
        description: "PACKAGING 4",
        unit: "strd",
        cost: "104.41",
        status: "In Stock",
        inStock: "20 strd",
        qty: "30 strd",
    },
    {
        itemCode: "FG-02",
        description: "FLAVOR 1",
        unit: "kg",
        cost: "104.41",
        status: "In Stock",
        inStock: "10 kg",
        qty: "20 kg",
    },
    {
        itemCode: "FG-03",
        description: "SEASONING 2",
        unit: "pcs",
        cost: "104.41",
        status: "Low Stock",
        inStock: "5 pcs",
        qty: "30 pcs",
    },
    {
        itemCode: "FG-04",
        description: "MEAT MATERIAL 1",
        unit: "kg",
        cost: "104.41",
        status: "In Stock",
        inStock: "20 kg",
        qty: "30 kg",
    },
    {
        itemCode: "FG-05",
        description: "ADDITIVE 3",
        unit: "g",
        cost: "104.41",
        status: "In Stock",
        inStock: "20 g",
        qty: "30 g",
    },
    {
        itemCode: "FG-06",
        description: "PACKAGING 3",
        unit: "strd",
        cost: "104.41",
        status: "In Stock",
        inStock: "20 strd",
        qty: "30 strd",
    },
    {
        itemCode: "FG-07",
        description: "FLAVOR 2",
        unit: "kg",
        cost: "118.97",
        status: "In Stock",
        inStock: "20 kg",
        qty: "30 kg",
    },
    {
        itemCode: "FG-08",
        description: "SEASONING 3",
        unit: "pcs",
        cost: "295.11",
        status: "Low Stock",
        inStock: "10 pcs",
        qty: "30 pcs",
    },
    {
        itemCode: "FG-08",
        description: "SEASONING 3",
        unit: "pcs",
        cost: "295.11",
        status: "Low Stock",
        inStock: "10 pcs",
        qty: "30 pcs",
    },
]