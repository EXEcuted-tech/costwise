"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { MdCompare } from 'react-icons/md'
import { TbPointFilled } from "react-icons/tb";
import { BsThreeDotsVertical } from "react-icons/bs";
import useOutsideClick from '@/hooks/useOutsideClick';
import BOMListContainer from '../pages/formulation/BOMListContainer';
import { useFormulationContext } from '@/contexts/FormulationContext';
import api from '@/utils/api';
import { BOM, Bom } from '@/types/data';
import Spinner from '../loaders/Spinner';
import ConfirmDelete from './ConfirmDelete';
import Alert from '../alerts/Alert';

const BillOfMaterialsList: React.FC<{ setBOM: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setBOM }) => {
    const [inputValue, setInputValue] = useState('');
    const [miniMenu, setMiniMenu] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState<number>(0);
    const { viewBOM, setViewBOM, setSelectedBomId } = useFormulationContext();
    const ref = useOutsideClick(() => setMiniMenu(null));
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [bomData, setBomData] = useState<Bom[]>([]);
    const [deleteModal, setDeleteModal] = useState(false);
    const [bomToDelete, setBomToDelete] = useState<{ id: number, index: number } | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [alertMessages, setAlertMessages] = useState<string[]>([]);

    const handleDelete = async () => {
        if (bomToDelete) {
            try {
                await api.post('/boms/delete', { bom_id: bomToDelete.id });
                setBomData((prevData) => prevData.filter((_, i) => i !== bomToDelete.index));
                setMiniMenu(null);
            } catch (error) {
                setAlertMessages(prev => [...prev, 'Failed to archive BOM']);
            } finally {
                setDeleteModal(false);
                setBomToDelete(null);
                setSuccessMessage('BOM archived successfully');
            }
        }
    };

    const filteredOptions = bomData.filter(
        (option) =>
            option.fg_name?.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.bom_name.toLowerCase().includes(inputValue.toLowerCase())
    );

    const handleMenuClick = (index: number, event: React.MouseEvent) => {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        const top = (rect.bottom + window.scrollY) - 290;
        setMenuPosition(top);
        setMiniMenu(miniMenu === index ? null : index);
    };

    const fetchData = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await api.get('/boms/retrieve_all');
            if (response.data.status === 200) {
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);

                setBomData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    useEffect(() => {
        const handleScroll = () => {
            setMiniMenu(null);
        };

        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (scrollElement) {
                scrollElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);
    
    const handleView = async (id: number) => {
        setSelectedBomId(id);
        setBOM(false);
        setViewBOM(true);
    }

    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setBOM(false);
            }
        };
        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [setBOM]);


    return (
        <>
            <div className="absolute top-0 right-0">
                {alertMessages && alertMessages.map((msg, index) => (
                    <Alert className="!relative" variant='critical' key={index} message={msg} setClose={() => {
                        setAlertMessages(prev => prev.filter((_, i) => i !== index));
                    }} />
                ))}
                {successMessage && <Alert className="!relative" variant='success' message={successMessage} setClose={() => setSuccessMessage('')} />}
            </div>
            {deleteModal && <ConfirmDelete onClose={() => setDeleteModal(false)} onProceed={handleDelete} subject="bill of materials" />}
            <div className={`flex items-center justify-center w-full h-full top-0 left-0 fixed backdrop-brightness-50 z-[1000]`}>
                {viewBOM && <BOMListContainer />}
                <div className='px-[35px] mx-[50px] 2xl:mx-0 animate-pop-out bg-white dark:bg-[#3C3C3C] w-[860px] mt-[-50px] rounded-[10px]'>
                    <div className='flex justify-between pt-[10px]'>
                        <div className='flex items-center dark:text-white'>
                            <MdCompare className='mr-[5px] text-[35px] dark:text-white' />
                            <h1 className='text-[35px] font-black dark:text-white'>Bill of Materials List</h1>
                        </div>
                        <IoClose className='text-[60px] text-[#CECECE] cursor-pointer hover:text-[#b3b3b3] transition-colors duration-250 p-0'
                            onClick={() => setBOM(false)} />
                    </div>
                    <hr />
                    <div className='mt-[10px]'>
                        <div className="w-full rounded-[20px] border border-[#B6B6B6] dark:border-[#5C5C5C] dark:bg-[#3C3C3C] dark:text-[#d1d1d1] bg-white text-[#5C5C5C] p-3">
                            <input
                                type="text"
                                className={`w-full flex-grow outline-none focus:ring-0 border-none pr-4 dark:bg-[#3C3C3C] dark:text-[#d1d1d1]`}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={'➯ Search Bill of Materials...'}
                                value={inputValue}
                            />
                        </div>
                        <div id="scroll-style" ref={scrollRef} className='h-[210px] my-[10px] overflow-y-auto'>
                            {isLoading ? (
                                <div className="flex justify-center items-center h-full">
                                    <Spinner />
                                </div>
                            ) : (
                                filteredOptions.map((options, index) =>
                                    <div key={index} className='w-full flex items-center py-[5px]'>
                                        <div className='flex items-center w-[95%]'>
                                            <TbPointFilled className='text-[20px] dark:text-white' />
                                            <p className='text-[20px] dark:text-white'>{options.bom_name} <span className='italic text-[#737373] dark:text-[#d1d1d1]'>({options.fg_name})</span></p>
                                        </div>
                                        <div className='w-[5%] flex justify-end relative'>
                                            <BsThreeDotsVertical className='text-[18px] text-[#818181] dark:text-white cursor-pointer hover:brightness-50'
                                                onClick={(e) => handleMenuClick(index, e)} />
                                            {miniMenu === index && (
                                                <div ref={ref} className='animate-pop-out fixed bg-white dark:bg-[#3C3C3C] shadow-lg rounded-md border dark:border-[#5C5C5C] z-[5000] right-[55px]'
                                                    style={{ top: menuPosition }}>
                                                    <p className='px-4 py-2 cursor-pointer dark:text-white border-b border-bg-gray-200 dark:border-b-[#5C5C5C] hover:bg-gray-200 dark:hover:bg-[#4c4c4c] transition-colors duration-250 ease-in-out'
                                                        onClick={() => {
                                                            handleView(options.bom_id);
                                                        }}>View</p>
                                                    <p className='px-4 py-2 cursor-pointer dark:text-white hover:bg-primary hover:bg-primary hover:text-white rounded-b-md transition-colors duration-250 ease-in-out'
                                                        onClick={() => {
                                                            setBomToDelete({ id: options.bom_id, index });
                                                            setDeleteModal(true);
                                                        }}>Archive</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BillOfMaterialsList