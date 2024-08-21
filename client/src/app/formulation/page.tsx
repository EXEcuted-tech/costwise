"use client"
import Header from '@/components/header/Header'
import React, { useState } from 'react'
import { AiOutlineSearch, AiOutlineDown } from 'react-icons/ai';
import { HiClipboardList } from "react-icons/hi";
import { MdCompare } from "react-icons/md";
import { IoList } from "react-icons/io5";
import { BiSolidFile } from 'react-icons/bi';
import { IoMdAdd } from "react-icons/io";
import useOutsideClick from '@/hooks/useOutsideClick';
import FormulationContainer from '@/components/pages/formulation/FormulationContainer';
import { useSidebarContext } from '@/context/SidebarContext';
import CompareFormulaDialog from '@/components/modal/CompareFormulaDialog';

const FormulationPage = () => {
    const { isOpen } = useSidebarContext();
    const [addFormula, setAddFormula] = useState(false);
    const [compareFormula, setCompareFormula] = useState(false);
    const ref = useOutsideClick(() => setAddFormula(false));

    return (
        <>
            <Header icon={HiClipboardList} title={"Formulations"} />
            {compareFormula && <CompareFormulaDialog setCompareFormula={setCompareFormula}/>}
            <div className={`${isOpen ? 'px-[10px] 2xl:px-[50px]' : 'px-[50px]'} mt-[25px] ml-[45px]`}>
                {/* Search and Buttons Section */}
                <div className='flex'>
                    {/* Search Component */}
                    <div className={`${isOpen ? 'w-[45%] 4xl:w-[50%]' : 'w-[45%] 2xl:w-[50%] 3xl:w-[60%]'} relative mr-[1%]`}>
                        <div className="absolute inset-y-0 left-0 flex items-center pl-1 pointer-events-none">
                            <AiOutlineSearch className={`${isOpen ? 'text-[14px] 2xl:text-[19px] 3xl:text-[22px]' : 'text-[19px] 2xl:text-[22px]'} text-[#575757]`} />
                        </div>
                        <input
                            type="text"
                            className={`${isOpen ? 'pl-[25px] 2xl:pl-[35px] w-[60%] 4xl:w-[50%] text-[14px] 2xl:text-[18px] 3xl:text-[21px]' : 'pl-[35px] w-[60%] 3xl:w-[50%] text-[18px] 2xl:text-[21px]'} focus:outline-none pr-[5px] py-[10px] bg-background border-b border-[#868686] placeholder-text-[#777777] text-[#5C5C5C]`}
                            placeholder="Search Formulation"
                            required
                        />
                    </div>
                    <div className={`${isOpen ? 'w-[55%] 4xl:w-[50%]' : 'w-[55%] 2xl:w-[50%] 3xl:w-[40%]'} flex items-end justify-end`}>
                        <button className={`${isOpen ? 'text-[12px] 2xl:text-[15px] 3xl:text-[18px]' : 'text-[15px] 2xl:text-[18px]'} mr-[10px] bg-white px-[15px] py-[5px] rounded-[5px] drop-shadow-lg flex items-center hover:bg-[#f7f7f7]`}
                            onClick={() => setCompareFormula(true)}>
                            <MdCompare className='mr-[5px]' />
                            <span className='font-bold'>Compare</span>
                        </button>
                        <button className={`${isOpen ? 'text-[12px] 2xl:text-[15px] 3xl:text-[18px]' : 'text-[15px] 2xl:text-[18px]'} mr-[10px] bg-white px-[15px] py-[5px] rounded-[5px] drop-shadow-lg flex items-center hover:bg-[#f7f7f7]`}>
                            <IoList className={`${isOpen ? 'text-[15px] 2xl:text-[22px]' : 'text-[22px]'} mr-[5px]`} />
                            <span className='font-bold'>BOM List</span>
                        </button>
                        <div ref={ref}>
                            <button className={`${isOpen ? 'text-[12px] 2xl:text-[15px] 3xl:text-[18px]' : 'text-[15px] 2xl:text-[18px]'} bg-primary text-white px-[15px] py-[5px] rounded-[5px] drop-shadow-lg flex items-center hover:bg-[#9c1c1c]`}
                                onClick={() => setAddFormula(!addFormula)}>
                                <span className='font-bold border-r-[2px] border-r-[#580000] pr-[10px] mr-[10px]'>Add Formula</span>
                                <span className=''><AiOutlineDown /></span>
                            </button>
                            {addFormula &&
                                <div className='absolute animate-pull-down bg-[#FFD3D3] z-50 w-[145px] 2xl:w-[165px] ml-[5px]'>
                                    <ul className='text-primary text-[14px] 2xl:text-[17px]'>
                                        <li className='pl-[15px] flex items-center justify-left py-[5px] cursor-pointer hover:text-[#851313]'>
                                            <IoMdAdd className='text-[20px] mr-[5px]' />
                                            <p>Add Manually</p>
                                        </li>
                                        <hr className='h-[2px] bg-primary opacity-50' />
                                        <li className='pl-[15px] flex items-center justify-left py-[5px] cursor-pointer hover:text-[#851313]'>
                                            <BiSolidFile className='text-[20px] mr-[5px]' />
                                            <p>Choose File</p>
                                        </li>
                                    </ul>
                                </div>
                            }
                        </div>

                    </div>
                </div>
                {/* File Container */}
                <div className='w-full'>
                    <FormulationContainer />
                </div>
            </div>
        </>
    )
}

export default FormulationPage