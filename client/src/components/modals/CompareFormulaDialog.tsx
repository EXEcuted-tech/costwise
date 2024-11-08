import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { MdCompare } from 'react-icons/md'
import CustomCompareSelect from '../form-controls/CustomCompareSelect'
import CompareFormulaContainer from '../pages/formulation/CompareFormulaContainer'
import { useFormulationContext } from '@/contexts/FormulationContext'
import Alert from '../alerts/Alert'

const CompareFormulaDialog: React.FC<{ setCompareFormula: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setCompareFormula }) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const { setViewFormulas } = useFormulationContext();
    const [alertMessages, setAlertMessages] = useState<string[]>([]);

    const handleGenerateBOM = () => {
        const descriptions = selectedOptions.map(option => option.split('(')[0].trim());
        const uniqueDescriptions = new Set(descriptions);

        if (uniqueDescriptions.size > 1) {
            setAlertMessages(prev => [...prev, 'You can only compare similar finished goods. Please select options with the same item description.']);
            return;
        }

        if (selectedOptions.length < 2) {
            setAlertMessages(prev => [...prev, 'Please select at least two options for comparison.']);
            return;
        }
        setViewFormulas(true);
        setCompareFormula(false);
    }

    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setCompareFormula(false);
            }
        };
        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [setCompareFormula]);


    return (
        <>
            <div className="fixed top-4 right-4 z-[99999]">
                <div className="flex flex-col items-end space-y-2">
                    {alertMessages && alertMessages.map((msg, index) => (
                        <Alert className="!relative" variant='critical' key={index} message={msg} setClose={() => {
                            setAlertMessages(prev => prev.filter((_, i) => i !== index));
                        }} />
                    ))}
                </div>
            </div>
            <div className={`flex items-center justify-center w-full h-full top-0 left-0 fixed backdrop-brightness-50 z-[1000]`}>
                <div className='px-[35px] mx-[50px] 2xl:mx-0 animate-pop-out bg-white dark:bg-[#3C3C3C] w-[860px] min-h-[210px] mt-[-50px] rounded-[10px]'>
                    <div className='flex justify-between pt-[10px]'>
                        <div className='flex items-center'>
                            <MdCompare className='mr-[5px] text-[35px] dark:text-white' />
                            <h1 className='text-[35px] font-black dark:text-white'>Compare Formulas</h1>
                        </div>
                        <IoClose className='text-[60px] text-[#CECECE] cursor-pointer hover:text-[#b3b3b3] transition-colors duration-250 ease-in-out p-0'
                            onClick={() => setCompareFormula(false)} />
                    </div>
                    <hr />
                    <div className='mt-[10px]'>
                        <CustomCompareSelect
                            setSelectedOptions={setSelectedOptions}
                            selectedOptions={selectedOptions}
                            setAlertMessages={setAlertMessages}
                        />
                        <div className='flex justify-end pt-[20px] pb-[20px]'>
                            <div className="relative inline-flex bg-white overflow-hidden text-primary flex items-center justify-center rounded-[30px] cursor-pointer transition-all rounded group">
                                <button className="text-[18px] font-bold before:ease relative px-[30px] py-[3px] h-full w-full overflow-hidden bg-primary text-white shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-primary hover:before:-translate-x-52"
                                    onClick={handleGenerateBOM}>
                                    <span className="relative z-10">Generate BOM</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CompareFormulaDialog