"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FormulationContainerProps } from '@/components/pages/formulation/FormulationContainer';
import { IoIosArrowRoundBack, IoIosSave } from 'react-icons/io';
import { formatHeader } from '@/utils/costwiseUtils';
import { HiOutlinePlus } from 'react-icons/hi2';
import { IoTrash } from 'react-icons/io5';
import { useFormulationContext } from '@/contexts/FormulationContext';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { HiClipboardList } from 'react-icons/hi';
import Header from '@/components/header/Header';

const AddFormulationPage = () => {
    const [fileData, setFileData] = useState<FormulationContainerProps>(
        {
            number: '34-222-V',
            level: 0,
            itemCode: 'FG-01',
            description: 'HOTDOG1K',
            batchQty: 0,
            unit: 'unit',
            cost: 0,
            formulations: [
                { level: 0, itemCode: '', description: 'Emulsion', batchQty: 0, unit: 'kg' },
            ]
        }
    );
    const { isOpen } = useSidebarContext();
    const { setAdd } = useFormulationContext();
    const router = useRouter();

    useEffect(() => {

    }, []);

    const handleBack = () => {
        setAdd(false);
        router.back();
    }

    const addRow = () => {
        if (fileData) {
            const emptyRow: FormulationContainerProps = {
                number: '',
                level: 0, // Set default values as needed
                itemCode: '',
                description: '',
                batchQty: 0,
                unit: '',
                cost: 0,
                formulations: []
            };

            setFileData({
                ...fileData,
                formulations: [...(fileData.formulations || []), emptyRow], // Append the new row to the formulations array
            });
        }
    };

    const removeRow = (index: number) => {
        if (fileData) {
            const updatedFormulations = fileData.formulations?.filter((_, i) => i !== index) || [];

            setFileData({
                ...fileData,
                formulations: updatedFormulations,
            });
        }
    };

    const handleInputChange = (key: keyof FormulationContainerProps, value: string | number) => {
        setFileData((prevData) => {
            return {
                ...prevData,
                [key]: value
            };
        });
    };

    const handleFormulationInputChange = (index: number, key: keyof FormulationContainerProps['formulations'][0], value: string | number) => {
        setFileData((prevData) => {
            const updatedFormulations = [...prevData.formulations];
            updatedFormulations[index] = {
                ...updatedFormulations[index],
                [key]: value
            };

            return {
                ...prevData,
                formulations: updatedFormulations
            };
        });
    };

    return (
        <>
            <Header icon={HiClipboardList} title={"Formulations"} />
            <div className={`${isOpen ? 'px-[10px] 2xl:px-[50px]' : 'px-[50px]'} mt-[25px] ml-[45px]`}>
                <div className='bg-white rounded-[10px] drop-shadow px-[30px] min-h-[820px] pb-[30px] mb-[25px]'>
                    <div className='flex items-center py-[10px]'>
                        <IoIosArrowRoundBack className='text-primary text-[45px] pt-[5px] mr-[5px] hover:text-[#D13131] transition-colors duration-300 ease-in-out cursor-pointer'
                            onClick={handleBack} />
                        <h1 className='font-bold text-[28px] text-primary'>
                            Add Formulation
                        </h1>
                    </div>
                    <hr className='border-[#ACACAC]' />
                    <div className='flex w-full items-center'>
                        <div className='w-full flex justify-end'>
                            <div className='my-[10px] mr-[10px] flex justify-end'>
                                <button className={`text-[18px] hover:bg-[#961e1e] transition-colors duration-250 ease-in-out h-[35px] flex items-center justify-center font-medium text-white rounded-[10px] px-[15px] w-[135px] bg-primary`}
                                    onClick={addRow}>
                                    <HiOutlinePlus className='mr-[5px]' />
                                    Add Row
                                </button>
                            </div>
                            <div className='flex justify-end my-[10px]'>
                                <button className={`text-[18px] hover:bg-[#00780c] transition-colors duration-250 ease-in-out h-[35px] flex items-center justify-center font-medium text-white rounded-[10px] px-[15px] w-[135px] bg-[#00930F]`}
                                    onClick={() => {
                                        setAdd(false);
                                    }}>
                                    <IoIosSave className='mr-[5px]' />
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='rounded-[5px] border border-[#656565] overflow-x-auto'>
                        <table className='table-auto w-full border-collapse'>
                            <thead>
                                <tr>
                                    {fileData && Object.keys(fileData).map((key) => {
                                        let textAlignClass = 'text-left';
                                        if (key === 'level') {
                                            textAlignClass = 'text-center';
                                        } else if (key === 'batchQty') {
                                            textAlignClass = 'text-right';
                                        }

                                        return (
                                            (key != 'formulations' && key != 'cost') &&
                                            <th key={key} className={`${textAlignClass} animate-zoomIn whitespace-nowrap font-bold text-[20px] text-[#6B6B6B] py-2 px-6 border-b border-[#ACACAC]`}>
                                                {formatHeader(key)}{key == 'batchQty' && '.'}
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {fileData && (
                                    <>
                                        <tr className='animate-zoomIn text-center font-bold text-black text-[18px] border-b border-[#ACACAC]'>
                                            <td className='py-[10px] px-6 text-left'>{fileData.number}</td>
                                            <td></td>
                                            <td>
                                                <input
                                                    type="text"
                                                    onChange={(e) => handleInputChange('itemCode', e.target.value)}
                                                    value={fileData.itemCode}
                                                    className={`mx-[5px] text-left animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] px-[5px]`}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                                    value={fileData.description}
                                                    className={`mx-[5px] text-left animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] px-[5px]`}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    onChange={(e) => handleInputChange('batchQty', e.target.value)}
                                                    value={fileData.batchQty}
                                                    className={`mx-[5px] text-right animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] px-[5px]`}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    onChange={(e) => handleInputChange('unit', e.target.value)}
                                                    value={fileData.unit}
                                                    className={`mx-[5px] text-left animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] px-[5px]`}
                                                />
                                            </td>
                                        </tr>

                                        {fileData.formulations?.map((formulation, index) => (
                                            <tr key={index} className={`${index % 2 == 1 && 'bg-[#FCF7F7]'} animate-zoomIn text-center font-medium text-[#6B6B6B] text-[18px]`}>
                                                <td className='flex justify-center items-center py-[15px]'>
                                                    <IoTrash className="text-[#717171] text-[25px] cursor-pointer hover:text-red-700 transition-colors duration-300 ease-in-out"
                                                        onClick={() => removeRow(index)} />
                                                </td>
                                                <td className='py-[10px]'>
                                                    <input
                                                        type="text"
                                                        onChange={(e) => handleFormulationInputChange(index, 'level', parseInt(e.target.value))}
                                                        value={formulation.level}
                                                        className="text-center animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909]"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        onChange={(e) => handleFormulationInputChange(index, 'itemCode', e.target.value)}
                                                        value={formulation.itemCode}
                                                        className="text-left px-2 animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909]"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        onChange={(e) => handleFormulationInputChange(index, 'description', e.target.value)}
                                                        value={formulation.description}
                                                        className="text-left px-2 animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909]"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        onChange={(e) => handleFormulationInputChange(index, 'batchQty', parseFloat(e.target.value))}
                                                        value={formulation.batchQty}
                                                        className="text-right px-2 animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909]"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        onChange={(e) => handleFormulationInputChange(index, 'unit', e.target.value)}
                                                        value={formulation.unit}
                                                        className="text-left px-2 animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909]"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddFormulationPage