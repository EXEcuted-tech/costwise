"use client";
import React, { useEffect, useState } from 'react';
import Header from '@/components/header/Header';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { MdTrolley, MdCalendarToday } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward, IoIosSearch } from "react-icons/io";
import PrimaryPagination from '@/components/pagination/PrimaryPagination';
import MonthSelector from '@/components/modals/MonthSelector';
import { CiImport } from "react-icons/ci";
import { IoTrash } from 'react-icons/io5';
import ImportInventoryList from '@/components/modals/ImportInventory';
import ConfirmDelete from '@/components/modals/ConfirmDelete';
import api from '@/utils/api';
import { InventoryType } from '@/types/data';

const Inventory = () => {
    const { isOpen } = useSidebarContext();
    const columnNames = ["Item Code", "Description", "Unit", "Purchased Qty", "Total Qty", "Usage Qty", "Status"];

    const [alertMessages, setAlertMessages] = useState<string[]>([]);
    const [alertStatus, setAlertStatus] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isMonthSelectorModalOpen, setMonthSelectorModalOpen] = useState(false);
    const [isImportInventoryListModalOpen, setImportInventoryListModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const monthOptions = [""];
    const [selectedMonth, setSelectedMonth] = useState<string>(monthOptions[1]);
    const [inventoryList, setInventoryList] = useState<InventoryType[]>([]);

    const currentIndex = monthOptions.indexOf(selectedMonth);
    const indexOfLastItem = currentPage * 8;
    const indexOfFirstItem = indexOfLastItem - 8;
    const currentListPage = inventoryList.slice(indexOfFirstItem, indexOfLastItem);

    // Modals
    const openImportInventoryListModal = () => {
        setImportInventoryListModalOpen(true);
    }

    const closeImportInventoryListModal = () => {
        setImportInventoryListModalOpen(false);
    }

    const openMonthSelectorModal = () => {
        setMonthSelectorModalOpen(true);
    };

    const closeMonthSelectorModal = () => {
        setMonthSelectorModalOpen(false);
    };

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    // Month Pagination
    const handlePageChange = (e: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
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

    //Format numbers
    const numberWithCommas = (x: number) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Retrieve inventory list
     useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await api.get('/inventory');

                setInventoryList(response.data);
                console.log("RETREIVED INVENTORY LIST:", response.data);
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);

            } catch (error) {
                setIsLoading(false);
                setAlertMessages(["Error retrieving inventory list. Please try again later."]);
                setAlertStatus("error");
                console.error('Error retrieving inventory list:', error);
            }
        };
        fetchInventory();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>
            {isMonthSelectorModalOpen &&
                <MonthSelector months={monthOptions} onMonthSelect={handleMonthSelect} onClose={closeMonthSelectorModal} />
            }

            {isImportInventoryListModalOpen &&
                <ImportInventoryList onClose={closeImportInventoryListModal} />
            }

            {isDeleteModalOpen && <ConfirmDelete subject={"inventory list"} onClose={closeDeleteModal}/>}

            <div className='w-full'>
                <div>
                    <Header icon={MdTrolley} title="Inventory" />
                </div>

                <div className={`${isOpen ? '4xl:h-[47rem] 3xl:h-[45rem] 2xl:h-[45rem] xl:h-[44rem]' : '4xl:h-[47rem] 3xl:h-[47rem] 2xl:h-[47rem] xl:h-[43rem]'} relative w-auto h-[47rem] ml-[4rem] mr-[3rem] my-[3rem] rounded-2xl bg-white border-1 border-[#656565] shadow-md animate-fade-in2`}>
                    {/* Header */}
                    <div className='flex h-14 rounded-t-2xl bg-[#B22222] text-white text-[26px] font-bold py-2 pl-5'>

                        {/* Month Button */}
                        <button
                            onClick={openMonthSelectorModal}
                            className='mt-1 mr-3 text-white text-[28px] bg-[#bd2a2a] px-2 py-1 rounded-lg cursor-pointer hover:bg-[#D9D9D98E] transition-colors duration-300 ease-in-out'>
                            <MdCalendarToday className='' />
                        </button>

                        <p className="animate-appearance-in">{selectedMonth}</p>

                        {/* Navigator Buttons */}
                        <div className='flex w-[8rem] ml-auto'>
                            <div className='w-[50%]'>
                                {currentIndex > 0 && (
                                    <button
                                        onClick={handlePreviousMonth}
                                        className='w-[2.5rem] h-[2.5rem] rounded-full text-white text-[30px] px-1 mr-4 bg-[#d9d9d98e] cursor-pointer hover:bg-[#bd2a2a] transition-colors duration-300 ease-in-out'>
                                        <IoIosArrowBack />
                                    </button>
                                )}
                            </div>
                            {currentIndex < monthOptions.length - 1 && (
                                <button
                                    onClick={handleNextMonth}
                                    className='w-[2.5rem] h-[2.5rem] rounded-full text-white text-[30px] px-2 mr-4 bg-[#d9d9d98e] cursor-pointer hover:bg-[#bd2a2a] transition-colors duration-300 ease-in-out'>
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

                        <div className='flex mt-[0.8em] mr-4 ml-auto text-gray-400 gap-4'>
                            <select
                                className={`${isOpen ? '4xl:w-[20rem] 3xl:w-[20rem] 2xl:w-[15rem] xl:w-[10rem]' : ''} bg-white h-8 w-[20rem] pl-3 text-[1.1em] border border-gray-400 rounded-lg focus:outline-none`}
                            >
                                <option selected value="" disabled hidden>Item Category</option>
                                <option value="all">All</option>
                                <option value="meat_material">Meat Materials</option>
                                <option value="meat_alternate">Meat Alternates</option>
                                <option value="food_ingredient">Food Ingredients</option>
                                <option value="packaging">Packaging Materials</option>
                                <option value="casing">Casing</option>
                                <option value="tin_can">Tin Can</option>
                                <option value="other">Other</option>

                            </select>

                            <select
                                className='bg-white h-8 w-[8rem] pl-3 text-[1.1em] border border-gray-400 rounded-lg focus:outline-none'
                            >
                                <option selected value="" disabled hidden>Status</option>
                                <option value="all">All</option>
                                <option value="in-stock">In Stock</option>
                                <option value="low-stock">Low Stock</option>
                            </select>

                            {/* Action Buttons */}
                            <button 
                                className={`${isOpen ? 'text-[15px] 3xl:text-[18px]' : 'text-[15px] 2xl:text-[18px]'} h-8 w-[7rem] px-[8px] py-[5px] bg-primary text-white rounded-[5px] drop-shadow-lg flex items-center hover:bg-[#9c1c1c] transition-colors duration-200 ease-in-out`}
                                onClick={openImportInventoryListModal}
                            >
                                <span><CiImport className='w-[30px] h-[22px]'/></span>
                                <span className='font-semibold'>Import</span>
                            </button>
                            <button 
                                className={`${isOpen ? 'text-[15px] 3xl:text-[18px]' : 'text-[15px] 2xl:text-[18px]'} h-8 px-[8px] py-[5px] bg-primary text-white rounded-[5px] drop-shadow-lg flex items-center hover:bg-[#9c1c1c] transition-colors duration-200 ease-in-out`}
                                onClick={openDeleteModal}
                            >
                                <IoTrash className="text-[25px] transition-colors duration-250 ease-in-out" />
                            </button>
                            
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
                                            <td className='w-[10rem] py-4'>a</td>
                                            <td className='break-words'>a</td>
                                            <td>a</td>
                                            <td className='w-[10%] text-right pr-6'>{numberWithCommas(data.purchased_qty)}</td>
                                            <td className='text-right pr-6 font-semibold'>{numberWithCommas(data.total_qty)}</td>
                                            <td className='text-right pr-6'>{numberWithCommas(data.usage_qty)}</td>
                                            <td>
                                                <div className='flex justify-center'>
                                                    <p
                                                        className={`${data.stock_status === 'In Stock'
                                                            ? 'text-[#00930F] bg-[#9EE29E]'
                                                            : 'text-primary bg-[#F5BABA]'
                                                            } rounded-2xl w-[9rem]`}
                                                    >
                                                        {data.stock_status}
                                                    </p>
                                                </div>
                                            </td>
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
                            data={inventoryList}
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
