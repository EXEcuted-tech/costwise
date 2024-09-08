import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { MdCompare } from 'react-icons/md'
import CustomCompareSelect from '../form-controls/CustomCompareSelect'
import CompareFormulaContainer from '../pages/formulation/CompareFormulaContainer'
import { useFormulationContext } from '@/context/FormulationContext'

const CompareFormulaDialog: React.FC<{ setCompareFormula: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setCompareFormula }) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const { setViewFormulas } = useFormulationContext();

    return (
        <div className={`flex items-center justify-center w-full h-full top-0 left-0 fixed backdrop-brightness-50 z-[1000]`}>
            <div className='px-[35px] mx-[50px] 2xl:mx-0 animate-pop-out bg-white w-[860px] min-h-[210px] mt-[-50px] rounded-[10px]'>
                <div className='flex justify-between pt-[10px]'>
                    <div className='flex items-center'>
                        <MdCompare className='mr-[5px] text-[35px]' />
                        <h1 className='text-[35px] font-black'>Compare Formulas</h1>
                    </div>
                    <IoClose className='text-[60px] text-[#CECECE] cursor-pointer hover:text-[#b3b3b3] transition-colors duration-250 ease-in-out p-0'
                        onClick={() => setCompareFormula(false)} />
                </div>
                <hr />
                <div className='mt-[10px]'>
                    <CustomCompareSelect setSelectedOptions={setSelectedOptions} selectedOptions={selectedOptions} />
                    <div className='flex justify-end pt-[20px] pb-[20px]'>
                        <div className="relative inline-flex bg-white overflow-hidden text-primary flex items-center justify-center rounded-[30px] cursor-pointer transition-all rounded group">
                            <button className="text-[18px] font-bold before:ease relative px-[30px] py-[3px] h-full w-full overflow-hidden bg-primary text-white shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-primary hover:before:-translate-x-52"
                                onClick={() => {
                                    setViewFormulas(true);
                                    setCompareFormula(false);
                                }}>
                                <span className="relative z-10">Generate BOM</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompareFormulaDialog