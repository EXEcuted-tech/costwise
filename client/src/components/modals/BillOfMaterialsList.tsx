import React, { useEffect, useRef, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { MdCompare } from 'react-icons/md'
import { TbPointFilled } from "react-icons/tb";
import { BsThreeDotsVertical } from "react-icons/bs";
import useOutsideClick from '@/hooks/useOutsideClick';
import BOMListContainer from '../pages/formulation/BOMListContainer';
import { useFormulationContext } from '@/contexts/FormulationContext';

const BillOfMaterialsList: React.FC<{ setBOM: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setBOM }) => {
    const [inputValue, setInputValue] = useState('');
    const [miniMenu, setMiniMenu] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState<number>(0);
    const { viewBOM, setViewBOM } = useFormulationContext();
    const ref = useOutsideClick(() => setMiniMenu(null));
    const scrollRef = useRef<HTMLDivElement>(null);
    const [bomData, setBomData] = useState<{ bomName: string; formulation: string }[]>([
        { bomName: 'BOM LIST 1', formulation: 'HOTDOG1K' },
        { bomName: 'BOM LIST 2', formulation: 'HOTDOG1K' },
        { bomName: 'BOM LIST 3', formulation: 'HOTDOG1K' },
        { bomName: 'BOM LIST 4', formulation: 'BEEF LOAF 100g' },
        { bomName: 'BOM LIST 5', formulation: 'BEEF LOAF 100g' },
        { bomName: 'BOM LIST 6', formulation: 'BEEF LOAF 100g' },
        { bomName: 'BOM LIST 7', formulation: 'BEEF LOAF 100g' },
        { bomName: 'BOM LIST 8', formulation: 'BEEF LOAF 100g' },
    ]);

    const handleDelete = (index: number) => {
        setBomData((prevData) => prevData.filter((_, i) => i !== index));
        setMiniMenu(null);
    };

    const filteredOptions = bomData.filter(
        (option) =>
            option.formulation.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.bomName.toLowerCase().includes(inputValue.toLowerCase())
    );

    const handleMenuClick = (index: number, event: React.MouseEvent) => {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        const top = (rect.bottom + window.scrollY) - 290;
        setMenuPosition(top);
        setMiniMenu(miniMenu === index ? null : index);
    };

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

    return (
        <div className={`flex items-center justify-center w-full h-full top-0 left-0 fixed backdrop-brightness-50 z-[1000]`}>
            {viewBOM && <BOMListContainer />}
            <div className='px-[35px] mx-[50px] 2xl:mx-0 animate-pop-out bg-white w-[860px] mt-[-50px] rounded-[10px]'>
                <div className='flex justify-between pt-[10px]'>
                    <div className='flex items-center'>
                        <MdCompare className='mr-[5px] text-[35px]' />
                        <h1 className='text-[35px] font-black'>Bill of Materials List</h1>
                    </div>
                    <IoClose className='text-[60px] text-[#CECECE] cursor-pointer hover:text-[#b3b3b3] transition-colors duration-250 p-0'
                        onClick={() => setBOM(false)} />
                </div>
                <hr />
                <div className='mt-[10px]'>
                    <div className="w-full rounded-[20px] border border-[#B6B6B6] bg-white text-[#5C5C5C] p-3">
                        <input
                            type="text"
                            className={`w-full flex-grow outline-none focus:ring-0 border-none pr-4`}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={'➯ Search Bill of Materials...'}
                            value={inputValue}
                        />
                    </div>
                    <div id="scroll-style" ref={scrollRef} className='h-[210px] my-[10px] overflow-y-auto'>
                        {filteredOptions.map((options, index) =>
                            <div className='w-full flex items-center py-[5px]'>
                                <div className='flex items-center w-[95%]'>
                                    <TbPointFilled className='text-[20px]' />
                                    <p className='text-[20px]'>{options.bomName} <span className='italic text-[#737373]'>({options.formulation})</span></p>
                                </div>
                                <div className='w-[5%] flex justify-end relative'>
                                    <BsThreeDotsVertical className='text-[18px] text-[#818181] cursor-pointer hover:brightness-50'
                                        onClick={(e) => handleMenuClick(index, e)} />
                                    {miniMenu === index && (
                                        <div ref={ref} className='animate-pop-out fixed bg-white shadow-lg rounded-md border z-[5000] right-[55px]'
                                            style={{ top: menuPosition }}>
                                            <p className='px-4 py-2 cursor-pointer border-b border-bg-gray-200 hover:bg-gray-200 transition-colors duration-250 ease-in-out'
                                                onClick={() => {
                                                    setBOM(false);
                                                    setViewBOM(true);
                                                }}>View</p>
                                            <p className='px-4 py-2 cursor-pointer hover:bg-primary hover:bg-primary hover:text-white rounded-b-md transition-colors duration-250 ease-in-out'
                                                onClick={() => {
                                                    handleDelete(index);
                                                }}>Delete</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BillOfMaterialsList