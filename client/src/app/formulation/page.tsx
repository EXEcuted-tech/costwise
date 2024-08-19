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

const FormulationPage = () => {
    const [addFormula, setAddFormula] = useState(false);
    const ref = useOutsideClick(() => setAddFormula(false));

    return (
        <>
            <Header icon={HiClipboardList} title={"Formulations"} />
            <div className='px-[50px] mt-[25px] ml-[45px]'>
                {/* Search and Buttons Section */}
                <div className='flex'>
                    {/* Search Component */}
                    <div className={`relative mr-[1%] w-[50%]`}>
                        <div className="absolute inset-y-0 left-0 flex items-center pl-1 pointer-events-none">
                            <AiOutlineSearch className="text-[#575757] text-[22px]" />
                        </div>
                        <input
                            type="text"
                            className="focus:outline-none w-[40%] pl-[35px] pr-[5px] py-[10px] bg-background border-b border-[#868686] placeholder-text-[#777777] text-[#5C5C5C] text-[21px]"
                            placeholder="Search Formulation"
                            required
                        />
                    </div>
                    <div className='flex items-end justify-end w-[50%]'>
                        <button className='mr-[10px] bg-white px-[15px] py-[5px] text-[18px] rounded-[5px] drop-shadow-lg flex items-center hover:bg-[#f7f7f7]'>
                            <MdCompare className='mr-[5px]' />
                            <span className='font-bold'>Compare</span>
                        </button>
                        <button className='mr-[10px] bg-white px-[15px] py-[5px] text-[18px] rounded-[5px] drop-shadow-lg flex items-center hover:bg-[#f7f7f7]'>
                            <IoList className='text-[22px] mr-[5px]' />
                            <span className='font-bold'>BOM List</span>
                        </button>
                        <div ref={ref}>
                            <button className='bg-primary text-white px-[15px] py-[5px] text-[18px] rounded-[5px] drop-shadow-lg flex items-center hover:bg-[#9c1c1c]'
                                onClick={()=>setAddFormula(!addFormula)}>
                                <span className='font-bold border-r-[2px] border-r-[#580000] pr-[10px] mr-[10px]'>Add Formula</span>
                                <span className=''><AiOutlineDown /></span>
                            </button>
                            {addFormula &&
                                <div className='absolute animate-pull-down bg-[#FFD3D3] z-50 w-[165px] ml-[5px]'>
                                    <ul className='text-primary text-[17px]'>
                                        <li className='pl-[15px] flex items-center justify-left py-[5px] cursor-pointer hover:text-[#851313]'>
                                            <IoMdAdd className='text-[20px] mr-[5px]'/>
                                            <p>Add Manually</p>
                                        </li>
                                        <hr className='h-[2px] bg-primary opacity-50'/>
                                        <li className='pl-[15px] flex items-center justify-left py-[5px] cursor-pointer hover:text-[#851313]'>
                                            <BiSolidFile className='text-[20px] mr-[5px]'/>
                                            <p>Choose File</p>
                                        </li>
                                    </ul>
                                </div>
                            }
                        </div>

                    </div>
                </div>
                {/* File Container */}
                <div>
                    <FormulationContainer />
                </div>
            </div>
        </>
    )
}

export default FormulationPage