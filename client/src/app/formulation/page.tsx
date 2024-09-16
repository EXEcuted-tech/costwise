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
import { useSidebarContext } from '@/contexts/SidebarContext';
import CompareFormulaDialog from '@/components/modals/CompareFormulaDialog';
import { useFormulationContext } from '@/contexts/FormulationContext';
import { useRouter } from 'next/navigation';
import ChooseFileDialog from '@/components/modals/ChooseFileDialog';
import BillOfMaterialsList from '@/components/modals/BillOfMaterialsList';
import CompareFormulaContainer from '@/components/pages/formulation/CompareFormulaContainer';

const FormulationPage = () => {
    const { isOpen } = useSidebarContext();
    const { edit, setEdit, add, setAdd, viewFormulas, viewBOM } = useFormulationContext();

    const [addFormula, setAddFormula] = useState(false);
    const [compareFormula, setCompareFormula] = useState(false);
    const [bomList, setBomList] = useState(false);
    const [view, setView] = useState(false);
    const [dialog, setDialog] = useState(false);

    const ref = useOutsideClick(() => setAddFormula(false));
    const router = useRouter();

    return (
        <>
            <Header icon={HiClipboardList} title={"Formulations"} />
            {compareFormula && <CompareFormulaDialog setCompareFormula={setCompareFormula} />}
            {dialog && <ChooseFileDialog dialogType={1} setDialog={setDialog} />}
            {bomList && <BillOfMaterialsList setBOM={setBomList} />}
            <div className={`${isOpen ? 'px-[10px] 2xl:px-[50px]' : 'px-[50px]'} mt-[25px] ml-[45px]`}>
                {(!view && !edit && !viewFormulas && !viewBOM) &&
                    <div className='flex'>
                        {/* Search Component */}
                        <div className={`${isOpen ? 'w-[40%] 4xl:w-[50%] 4xl:mr-[1%]' : 'w-[45%] 2xl:w-[50%] 3xl:w-[60%] mr-[1%]'} relative`}>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-1 pointer-events-none">
                                <AiOutlineSearch className={`${isOpen ? 'text-[14px] 2xl:text-[19px] 3xl:text-[22px]' : 'text-[19px] 2xl:text-[22px]'} text-[#575757]`} />
                            </div>
                            <input
                                type="text"
                                className={`${isOpen ? 'pl-[25px] 2xl:pl-[35px] w-[70%] 4xl:w-[50%] text-[15px] 2xl:text-[18px] 3xl:text-[21px]' : 'pl-[35px] w-[60%] 3xl:w-[50%] text-[18px] 2xl:text-[21px]'} focus:outline-none pr-[5px] py-[10px] bg-background border-b border-[#868686] placeholder-text-[#777777] text-[#5C5C5C]`}
                                placeholder="Search Formulation"
                                required
                            />
                        </div>
                        <div className={`${isOpen ? 'w-[60%] 4xl:w-[50%]' : 'w-[55%] 2xl:w-[50%] 3xl:w-[40%]'} flex flex-grow items-end justify-end`}>
                            <button className={`${isOpen ? 'text-[15px] 3xl:text-[18px]' : 'text-[15px] 2xl:text-[18px]'} mr-[10px] bg-white px-[15px] py-[5px] rounded-[5px] drop-shadow-lg flex items-center hover:bg-[#f7f7f7] transition-colors duration-200 ease-in-out`}
                                onClick={() => setCompareFormula(true)}>
                                <MdCompare className='mr-[5px]' />
                                <span className='font-bold'>Compare</span>
                            </button>
                            <button className={`${isOpen ? 'text-[15px] 3xl:text-[18px]' : 'text-[15px] 2xl:text-[18px]'} mr-[10px] bg-white px-[15px] py-[5px] rounded-[5px] drop-shadow-lg flex items-center hover:bg-[#f7f7f7] transition-colors duration-200 ease-in-out`}
                                onClick={() => setBomList(true)}>
                                <IoList className={`${isOpen ? 'text-[15px] 2xl:text-[22px]' : 'text-[22px]'} mr-[5px]`} />
                                <span className='font-bold'>BOM List</span>
                            </button>
                            <div ref={ref}>
                                <button className={`${isOpen ? 'text-[15px] 3xl:text-[18px]' : 'text-[15px] 2xl:text-[18px]'} px-[15px] py-[5px] bg-primary text-white rounded-[5px] drop-shadow-lg flex items-center hover:bg-[#9c1c1c] transition-colors duration-200 ease-in-out`}
                                    onClick={() => setAddFormula(!addFormula)}>
                                    <span className='font-bold border-r-[2px] border-r-[#920000] pr-[10px] mr-[10px]'>Add Formula</span>
                                    <span><AiOutlineDown /></span>
                                </button>
                                {addFormula &&
                                    <div className={`${isOpen ? 'w-[125px] 2xl:w-[145px] 3xl:w-[165px]' : 'w-[145px] 2xl:w-[165px]'} ml-[5px] absolute animate-pull-down bg-[#FFD3D3] z-50`}>
                                        <ul className='text-primary text-[14px] 2xl:text-[17px]'>
                                            <li className={`${isOpen ? 'pl-[6px] 3xl:pl-[15px]' : 'pl-[15px]'} flex items-center justify-left py-[5px] cursor-pointer hover:text-[#851313]`}
                                                onClick={() => {
                                                    setAdd(true);
                                                    router.push('/formulation/create');
                                                }}>
                                                <IoMdAdd className='text-[20px] mr-[5px]' />
                                                <p>Add Manually</p>
                                            </li>
                                            <hr className='h-[2px] bg-primary opacity-50' />
                                            <li className={`${isOpen ? 'pl-[6px] 3xl:pl-[15px]' : 'pl-[15px]'} flex items-center justify-left py-[5px] cursor-pointer hover:text-[#851313]`}
                                                onClick={() => setDialog(true)}>
                                                <BiSolidFile className='text-[20px] mr-[5px]' />
                                                <p>Choose File</p>
                                            </li>
                                        </ul>
                                    </div>
                                }
                            </div>

                        </div>
                    </div>
                }
                {/* File Container */}
                <div className='w-full '>
                    <FormulationContainer view={view} setView={setView} />
                </div>
            </div>
        </>
    )
}

export default FormulationPage