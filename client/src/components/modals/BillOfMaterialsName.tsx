import { useFormulationContext } from '@/contexts/FormulationContext';
import React, { useEffect } from 'react'
import { FaFileSignature } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import Spinner from '../loaders/Spinner';


const BillOfMaterialsName = ({ setSaveBomName, handleSaveToBOMList, setError, isLoading, error }: {
    setSaveBomName: (value: boolean) => void,
    handleSaveToBOMList: () => void,
    setError: (value: boolean) => void,
    isLoading: boolean,
    error: boolean
}) => {

    const { setBomName } = useFormulationContext();

    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setSaveBomName(false);
                setError(false);
            }
        };
        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [setError, setSaveBomName]);

    return (
        <div className='flex items-center justify-center w-full h-full top-0 left-0 fixed backdrop-brightness-50 z-[1000] z-[1000]'>
            <div className='animate-pop-out bg-white dark:bg-[#3c3c3c] w-[460px] h-[380px] rounded-[20px] px-[10px]'>
                <div className='flex justify-end'>
                    <IoIosClose className='mt-[2px] text-[70px] text-[#CECECE] cursor-pointer hover:text-[#b3b3b3] transition-colors duration-250 ease-in-out'
                        onClick={() => { 
                            setSaveBomName(false)
                            setError(false)
                        }} />
                </div>
                <div className='flex justify-center'>
                    <FaFileSignature className='text-[75px] text-[#FFCC00]' />
                </div>
                <div className='flex flex-col justify-center items-center pb-[10px]'>
                    <h1 className='font-black text-[30px] dark:text-white'>Name Your BOM</h1>
                    <p className='text-center text-[#9D9D9D] text-[19px] px-[30px]'>
                        Before saving, please provide a name for this Bill of Materials!
                    </p>
                </div>
                <div className='px-[30px] w-full'>
                    <input
                        type="text"
                        placeholder="Enter BOM name"
                        className={`${error ? 'border-red-500 placeholder:text-red-500' : 'border-gray-300'} w-full px-[15px] py-[10px] border rounded-[10px] text-[16px] dark:border-[#5C5C5C] dark:bg-[#4C4C4C] dark:text-[#d1d1d1]`}
                        onChange={(e) => setBomName(e.target.value)}
                    />
                </div>
                <div className='flex justify-center items-center my-[15px] px-[50px]'>
                    <div className="relative inline-flex bg-white border-1 border-primary overflow-hidden text-primary flex items-center justify-center rounded-[30px] cursor-pointer transition-all rounded group"
                        onClick={handleSaveToBOMList}>
                        <button className="flex justify-center items-center text-[19px] font-black before:ease relative h-8 w-40 overflow-hidden bg-primary text-white shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-primary hover:before:-translate-x-40">
                            {isLoading && <Spinner />}
                            <span className="relative z-10">Proceed</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BillOfMaterialsName