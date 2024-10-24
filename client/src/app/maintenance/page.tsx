"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/header/Header';
import { useSidebarContext } from '@/contexts/SidebarContext';
import PrimaryPagination from '@/components/pagination/PrimaryPagination';
import { GrSystem } from "react-icons/gr";
import { AiFillDatabase } from "react-icons/ai";
import { PiFilesFill } from "react-icons/pi";
import { IoGitNetworkOutline } from "react-icons/io5";
import { IoMdAdd, IoIosSearch } from "react-icons/io";
import ReleaseNoteTile from '@/components/pages/system-maintenance/ReleaseNoteTile';
import CreateReleaseNotes from '@/components/modals/CreateReleaseNotes';
import ViewReleaseNotes from '@/components/modals/ViewReleaseNotes';
import api from '@/utils/api';
import { ReleaseNote, User } from '@/types/data';
import Alert from '@/components/alerts/Alert';
import Spinner from '@/components/loaders/Spinner';
import Loader from '@/components/loaders/Loader';
import { PiNewspaperLight } from "react-icons/pi";

const SystemMaintenance = () => {
    const { isOpen } = useSidebarContext();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [createNotes, setCreateNotes] = useState(false);
    const [viewNotes, setViewNotes] = useState(false);
    const [storage, setStorage] = useState<any>(null);
    const [totalFiles, setTotalFiles] = useState<number>(0);
    const [fileTypes, setFileTypes] = useState<any>(null);
    const [releaseNotes, setReleaseNotes] = useState<ReleaseNote[]>([]);
    const [filteredReleaseNotes, setFilteredReleaseNotes] = useState<ReleaseNote[]>([]);
    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
    const [alertMessages, setAlertMessages] = useState<string[]>([]);
    const [alertStatus, setAlertStatus] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const fetchSystemData = async () => {
            try {
                const response = await api.get('/system/retrieve_data');
                setStorage(response.data.storage);
                setTotalFiles(response.data.total_files);
                setFileTypes(response.data.file_types);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching system data:', error);
            }
        };

        //Retrieve all release notes
        const retrieveAllReleaseNotes = async () => {
            try {
                const response = await api.get('/release_note/retrieve_all');
                if (response.status === 200) {
                    setReleaseNotes(response.data.data);
                    setFilteredReleaseNotes(response.data.data);
                } else {
                    setAlertMessages(["Failed to retrieve release notes"]);
                    setAlertStatus("critical");
                }
            } catch (error) {
                console.error('Error retrieving release notes:', error);
            }
        }

        fetchSystemData();
        retrieveAllReleaseNotes();
    }, []);

    useEffect(() => {
    //Search function
        if (releaseNotes.length > 0) {
            if (searchTerm === '') {
                setFilteredReleaseNotes(releaseNotes);
            }
            else {
                const filtered = releaseNotes.filter(note =>
                    note.title.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setFilteredReleaseNotes(filtered);
            }
        }
    }, [searchTerm]);

    const handlePageChange = (e: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const indexOfLastItem = currentPage * 4;
    const indexOfFirstItem = indexOfLastItem - 4;
    const currentListPage = filteredReleaseNotes.slice(indexOfFirstItem, indexOfLastItem);

    const handleViewDatabase = () => {
        const phpMyAdminUrl = process.env.NEXT_PUBLIC_PHPMYADMIN_URL || 'http://localhost/phpmyadmin';
        window.open(phpMyAdminUrl, '_blank');
    };

    const onViewNotes = (noteId: number) => {
        setSelectedNoteId(noteId);
        setViewNotes(true);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    return (
        <div className='w-full h-screen bg-background'>
            <div className='absolute top-0 right-0'>
                {alertMessages && alertMessages.map((msg, index) => (
                <Alert className="!relative" variant={alertStatus as "default" | "information" | "warning" | "critical" | "success" | undefined} key={index} message={msg} setClose={() => {
                    setAlertMessages(prev => prev.filter((_, i) => i !== index));
                }} />
                ))}
            </div>
            <div>
                <Header icon={GrSystem} title="System Maintenance" />
            </div>
            {createNotes && <CreateReleaseNotes setCreateNotes={setCreateNotes} />}
            {viewNotes && selectedNoteId && <ViewReleaseNotes note_id={selectedNoteId} setViewNotes={setViewNotes} />}
            <div className='ml-[45px]'>
                {/* Info Tiles */}
                <div className='flex mx-16 mt-12 mb-9 gap-[5rem] justify-center'>
                    {/* Database Storage */}
                    <div className={`${isOpen ? 'w-[40%] 2xl:w-[32%]' : 'w-[32%]'} flex flex-col p-4 h-[17rem] bg-white rounded-lg drop-shadow-lg hover:animate-shrink-in2`}>
                        <div className='flex flex-col mb-8'>
                            <div className='flex'>
                                {isLoading ? <Loader className='h-12 w-[2rem]'/>
                                            : <span className='text-[38px] mr-2'>{storage?.total.split(' ')[0]}</span> }
                                {isLoading ? ''
                                            : <span className='text-[30px] pt-2'>{storage?.total.split(' ')[1]}</span> }
                                <AiFillDatabase className='text-[60px] ml-auto mr-3 text-gray-200' />
                            </div>
                            <span className='text-[23px] font-light'>Database Storage</span>
                        </div>

                        <div className='flex flex-col'>
                            <div className='w-full h-[1.5rem] bg-gray-100 rounded-full'>
                                <div className='h-[1.5rem] bg-[#DD8383] rounded-full' style={{ width: `${(parseFloat(storage?.used.split(' ')[0]) / parseFloat(storage?.total.split(' ')[0])) * 100}%` }}></div>
                            </div>
                                {isLoading ? <Loader className='mt-2 h-6 w-4'/>
                                            : <span className='text-[17px] pt-1 pl-1 font-light'>{storage?.used || '0 GB'} used</span> }
                        </div>
                        <button className='w-[9rem] text-[16px] mt-6 border border-[#9290905b] font-light bg-white shadow-lg rounded-lg'
                            onClick={handleViewDatabase}>View Database</button>
                    </div>

                    {/* Files */}
                    <div className={`${isOpen ? 'w-[40%] 2xl:w-[32%]' : 'w-[32%]'} flex flex-col p-4 h-[17rem] bg-white rounded-lg drop-shadow-lg hover:animate-shrink-in2`}>
                        <div className='flex flex-col mb-8'>
                            <div className='flex'>
                                {isLoading ? <Loader className='h-12 w-[2rem]'/>
                                    : <span className='text-[38px] mr-2'>{totalFiles || '0'}</span>}
                                {isLoading ? ''
                                    : <span className='text-[30px] pt-2'>FILES</span>}
                                <PiFilesFill className='text-[60px] ml-auto mr-3 text-gray-200' />
                            </div>
                            <span className='text-[23px] font-light'>Total No. of Files</span>
                        </div>

                        <div className='flex flex-col'>
                            <div className='flex w-full h-[1.5rem] bg-gray-100 rounded-full'>
                                {fileTypes && Object.entries(fileTypes).map(([type, count], index, array) => {
                                    if ((count as number) > 0) {
                                        const width = ((count as number) / totalFiles) * 100;
                                        const isFirst = index === 0;
                                        const isLast = index === array.length - 1;
                                        let bgColor;
                                        switch (type) {
                                            case 'master_file':
                                                bgColor = 'hsl(0,57%,69%)';
                                                break;
                                            case 'transactional_file':
                                                bgColor = '#9EE29E';
                                                break;
                                            case 'inventory_file':
                                                bgColor = '#B6CDFF';
                                                break;
                                            case 'training_file':
                                                bgColor = '#FFE135';
                                                break;
                                            default:
                                                bgColor = 'gray';
                                        }
                                        return (
                                            <div
                                                key={type}
                                                className={`h-[1.5rem] ${isFirst ? 'rounded-l-full' : ''} ${isLast ? 'rounded-r-full' : ''}`}
                                                style={{ width: `${width}%`, backgroundColor: bgColor }}
                                            ></div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                            <div className='flex mt-[5px] p-3'>
                                <div className='w-[50%]'>
                                    <div className='flex'>
                                        <div className='w-4 h-4 mt-1 mr-2 bg-[#DD8383] rounded-full'></div>
                                        <span className='text-[17px] font-light'>Master Files</span>
                                    </div>
                                    <div className='flex'>
                                        <div className='w-4 h-4 mt-1 mr-2 bg-[#9EE29E] rounded-full'></div>
                                        <span className='text-[17px] font-light'>Transactions</span>
                                    </div>
                                </div>
                                <div className='w-[50%]'>
                                    <div className='flex'>
                                        <div className='w-4 h-4 mt-1 mr-2 bg-[#B6CDFF] rounded-full'></div>
                                        <span className='text-[17px] font-light'>Inventory</span>
                                    </div>
                                    <div className='flex'>
                                        <div className='w-4 h-4 mt-1 mr-2 bg-[#FFE135] rounded-full'></div>
                                        <span className='text-[17px] font-light'>Training Files</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Release Notes */}
                <div className={`${isOpen ? 'mx-9 2xl:mx-16' : 'mx-16'} flex flex-col h-[31rem] bg-white rounded-lg drop-shadow-md`}>
                    {/* Header */}
                    <div className='flex w-full h-[4rem] px-4 py-3 font-medium bg-white border border-[#9290906c] drop-shadow-md rounded-t-lg'>
                        <IoGitNetworkOutline className='text-[32px] text-gray-500 mt-1 mr-3' />
                        <span className='text-[28px] text-[#5B5353]'>Release Notes</span>
                        <button className={`${isOpen ? 'ml-2 2xl:ml-5' : 'ml-5'} w-[2rem] h-[2rem] text-[25px] mt-1 px-[3px] text-gray-500 border border-[#9290905b] bg-white drop-shadow-md rounded-lg`} onClick={() => setCreateNotes(true)}><IoMdAdd /></button>
                        <div className="mt-[3px] ml-auto text-gray-600">
                            <div className='flex absolute text-[1.3em] text-gray-400 mt-[0.3rem] ml-3'>
                                <IoIosSearch />
                            </div>
                            <input

                                className={`${isOpen ? 'w-[20rem]' : 'w-[20rem]'} bg-white h-8 px-5 pl-9 text-[1.1em] border border-[#9290906c] rounded-lg focus:outline-none`}
                                type="search"
                                name="search"
                                placeholder="Search here..."
                                onChange={handleSearch}
                                value={searchTerm}
                            />
                        </div>
                    </div>

                    {/* Main Content Area */}
                    {isLoading ? 
                        <div className='flex justify-center items-center w-full h-[21rem] mt-6'>
                            <Spinner className='h-12 w-[2rem]'/>
                        </div>
                        : <div className={`${isOpen ? 'px-10' : 'px-16'} w-full h-[21rem] mt-6`}>
                            {currentListPage.map((note) => (
                                <ReleaseNoteTile
                                    key={note.note_id}
                                    note={note}
                                    onViewNotes={onViewNotes}
                                />
                            ))}
                            {currentListPage.length === 0 && (
                                <div className="text-center  items-center justify-items-center text-[#555555] mt-20">
                                    <PiNewspaperLight className='text-[80px] mb-4' />
                                    <p className='text-[20px]'>No release notes found matching your search.</p>
                                </div>
                            )}
                        </div>
                    }

                    {/* Footer */}
                    <div className="flex w-full justify-center h-[86px] rounded-b-xl border-[#868686]">
                        <PrimaryPagination
                            data={filteredReleaseNotes}
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
