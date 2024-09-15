"use client";
import React, { useState } from 'react';
import Header from '@/components/header/Header';
import { useSidebarContext } from '@/context/SidebarContext';
import PrimaryPagination from '@/components/pagination/PrimaryPagination';
import { GrSystem } from "react-icons/gr";
import { AiFillDatabase } from "react-icons/ai";
import { PiFilesFill } from "react-icons/pi";
import { IoGitNetworkOutline } from "react-icons/io5";
import { IoMdAdd, IoIosSearch } from "react-icons/io";
import ReleaseNoteTile from '@/components/pages/system-maintenance/ReleaseNoteTile';
import CreateReleaseNotes from '@/components/modals/CreateReleaseNotes';


export interface SystemMaintenanceProps {
    date: String;
    title: String;
    author: String;
    //contents, idk how to structure it rn
};

const SystemMaintenance = () => {
    const { isOpen } = useSidebarContext();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [createNotes, setCreateNotes] = useState(false);

    const handlePageChange = (e: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };


    const indexOfLastItem = currentPage * 4;
    const indexOfFirstItem = indexOfLastItem - 4;
    const currentListPage = ReleaseNotesFakeData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className='w-full h-screen bg-background'>
            <div>
                <Header icon={GrSystem} title="System Maintenance" />
            </div>
            {createNotes && <CreateReleaseNotes setCreateNotes={setCreateNotes}/>}
            <div className='ml-[45px]'>
                {/* Info Tiles */}
                <div className='flex mx-16 mt-12 mb-9 gap-[5rem] justify-center'>
                    {/* Database Storage */}
                    
                    <div className={`${isOpen ? 'w-[40%] 2xl:w-[32%]' : 'w-[32%]' } flex flex-col p-4 h-[17rem] bg-white rounded-lg drop-shadow-lg`}>
                        <div className='flex flex-col mb-8'>
                            <div className='flex'>
                                <span className='text-[38px] mr-2'>128</span>
                                <span className='text-[30px] pt-2'>GB</span>
                                <AiFillDatabase className='text-[60px] ml-auto mr-3 text-gray-200'/>
                            </div>
                            <span className='text-[23px] font-light'>Database Storage</span>
                        </div>

                        <div className='flex flex-col'>
                            <div className='w-full h-[1.5rem] bg-gray-100 rounded-full'>
                                <div className='w-[20%] h-[1.5rem] bg-[#DD8383] rounded-full'></div>
                            </div>
                            <span className='text-[17px] pt-1 pl-1 font-light'>20gb used</span>
                        </div>

                        <button className='w-[9rem] text-[16px] mt-6 border border-[#9290905b] font-light bg-white shadow-lg rounded-lg'>View Database</button>
                    </div>

                    {/* Files */}
                    <div className={`${isOpen ? 'w-[40%] 2xl:w-[32%]' : 'w-[32%]' } flex flex-col p-4 h-[17rem] bg-white rounded-lg drop-shadow-lg`}>
                        <div className='flex flex-col mb-8'>
                            <div className='flex'>
                                <span className='text-[38px] mr-2'>50</span>
                                <span className='text-[30px] pt-2'>FILES</span>
                                <PiFilesFill className='text-[60px] ml-auto mr-3 text-gray-200'/>
                            </div>
                            <span className='text-[23px] font-light'>Total No. of Files</span>
                        </div>

                        <div className='flex flex-col'>
                            <div className='flex w-full h-[1.5rem] bg-gray-100 rounded-full'>
                                <div className='w-[20%] h-[1.5rem] bg-[hsl(0,57%,69%)] rounded-l-full'></div>
                                <div className='w-[30%] h-[1.5rem] bg-[#9EE29E]'></div>
                                <div className='w-[30%] h-[1.5rem] bg-[#B6CDFF] rounded-r-full'></div>
                            </div>
                            <div className='flex flex-col p-3'>
                                <div className='flex'>
                                    <div className='w-4 h-4 mt-1 mr-2 bg-[#DD8383] rounded-full'></div>
                                    <span className='text-[17px] font-light'>Material-Cost</span>
                                </div>
                                <div className='flex'>
                                    <div className='w-4 h-4 mt-1 mr-2 bg-[#9EE29E] rounded-full'></div>
                                    <span className='text-[17px] font-light'>Transactions</span>
                                </div>
                                <div className='flex'>
                                    <div className='w-4 h-4 mt-1 mr-2 bg-[#B6CDFF] rounded-full'></div>
                                    <span className='text-[17px] font-light'>Inventory</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Release Notes */}
                <div className={`${isOpen ? 'mx-9 2xl:mx-16' : 'mx-16' } flex flex-col h-[31rem] bg-white rounded-lg drop-shadow-md`}>
                    {/* Header */}
                    <div className='flex w-full h-[4rem] px-4 py-3 font-medium bg-white border border-[#9290906c] drop-shadow-md rounded-t-lg'>
                        <IoGitNetworkOutline className='text-[32px] text-gray-500 mt-1 mr-3' />
                        <span className='text-[28px] text-[#5B5353]'>Release Notes</span>
                        <button className={`${isOpen ? 'ml-2 2xl:ml-5' : 'ml-5' } w-[2rem] h-[2rem] text-[25px] mt-1 px-[3px] text-gray-500 border border-[#9290905b] bg-white drop-shadow-md rounded-lg`} onClick={()=>setCreateNotes(true)}><IoMdAdd /></button>
                        <div className="mt-[3px] ml-auto text-gray-600">
                            <div className='flex absolute text-[1.3em] text-gray-400 mt-[0.3rem] ml-3'>
                                <IoIosSearch />
                            </div>
                            <input
                            
                                className={`${isOpen ? 'w-[20rem]' : 'w-[20rem]'} bg-white h-8 px-5 pl-9 text-[1.1em] border border-[#9290906c] rounded-lg focus:outline-none`}
                                type="search"
                                name="search"
                                placeholder="Search here..."
                            />
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className={`${isOpen ? 'px-10' : 'px-16' } w-full h-[21rem] mt-6`}>
                        {currentListPage.map((note, index) => (
                            <ReleaseNoteTile 
                                key={index}
                                date={note.date}
                                title={note.title}
                                author={note.author}
                            />
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="flex w-full justify-center h-[86px] rounded-b-xl border-[#868686]">
                        <PrimaryPagination
                            data={ReleaseNotesFakeData} //change to data
                            itemsPerPage={4}
                            handlePageChange={handlePageChange}
                            currentPage={currentPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SystemMaintenance;

const ReleaseNotesFakeData = [
    {
        date: "January 12, 2024",
        title: "Projected costing algorithm",
        author: "Michael Huang"
    },
    
    {
        date: "December 3, 2023",
        title: "Calculation fix for recipe formulation",
        author: "Franz Ondiano"
    },

    {
        date: "July 1, 2023",
        title: "User interface fixes",
        author: "Franz Ondiano"
    },

    {
        date: "June 3, 2023",
        title: "Database cleanup",
        author: "Tyrone Ybanez"
    },

    {
        date: "March 3, 2023",
        title: "Responsivenes fixes",
        author: "Hannah Angelica Galve"
    },

    {
        date: "January 12, 2023",
        title: "Projected costing algorithm",
        author: "Michael Huang"
    },
    
    {
        date: "November 3, 2022",
        title: "Calculation fix for recipe formulation",
        author: "Franz Ondiano"
    },

    {
        date: "October 1, 2022",
        title: "User interface fixes",
        author: "Franz Ondiano"
    },

    {
        date: "June 3, 2022",
        title: "Database cleanup",
        author: "Tyrone Ybanez"
    },

    {
        date: "April 3, 2022",
        title: "Responsivenes fixes",
        author: "Hannah Angelica Galve"
    },
    
]