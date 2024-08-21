import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { MdCompare } from 'react-icons/md'
import CustomCompareSelect from '../form-controls/CustomCompareSelect'

const CompareFormulaDialog:React.FC<{setCompareFormula:React.Dispatch<React.SetStateAction<boolean>>}> = ({setCompareFormula}) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    
    return (
        <div className={`flex items-center justify-center w-full h-full top-0 left-0 fixed backdrop-brightness-50 z-[1000]`}>
            <div className='px-[35px] mx-[50px] 2xl:mx-0 animate-pop-out bg-white w-[860px] h-[240px] rounded-[10px]'>
                <div className='flex justify-between py-[5px]'>
                    <div className='flex items-center'>
                        <MdCompare className='mr-[5px] text-[35px]' />
                        <h1 className='text-[35px] font-black'>Compare Formulas</h1>
                    </div>
                    <IoClose className='text-[60px] text-[#CECECE] cursor-pointer hover:brightness-90 p-0'
                onClick={() => setCompareFormula(false)} />
                </div>
                <hr />
                <div className='mt-[10px]'>
                    <CustomCompareSelect setSelectedOptions={setSelectedOptions} selectedOptions={selectedOptions}/>
                </div>
            </div>
        </div>
    )
}

export default CompareFormulaDialog