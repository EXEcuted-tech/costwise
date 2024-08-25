import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FormulationContainerProps, FormulationProps } from './FormulationContainer';
import { IoIosArrowRoundBack, IoIosSave } from 'react-icons/io';
import { formatHeader } from '@/utils/costwiseUtils';
import { HiOutlinePlus } from 'react-icons/hi2';
import { IoTrash } from 'react-icons/io5';
import { useFormulationContext } from '@/context/FormulationContext';
import { useSidebarContext } from '@/context/SidebarContext';

const FormulationTable: React.FC<FormulationProps> = ({ setView, view }) => {
    const [fileData, setFileData] = useState<FormulationContainerProps | null>(null);
    const { isOpen } = useSidebarContext();
    const { edit, setEdit } = useFormulationContext();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const data = searchParams.get('data');
        if (data) {
            try {
                const decodedData = JSON.parse(decodeURIComponent(data)) as FormulationContainerProps;

                setFileData(decodedData);
                console.log(decodedData);
            } catch (error) {
                console.error('Error parsing file data:', error);
            }
        }
    }, [searchParams]);

    const handleBack = () => {
        setView(false);
        setEdit(false);
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
            if (prevData === null) {
                return null;
            }
            return {
                ...prevData,
                [key]: value
            };
        });
    };

    const handleFormulationInputChange = (index: number, key: keyof FormulationContainerProps['formulations'][0], value: string | number) => {
        setFileData((prevData) => {
            if (prevData === null) {
                return null;
            }

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
        <div className='bg-white rounded-[10px] drop-shadow px-[30px] min-h-[820px] pb-[30px] mb-[25px]'>
            {/* header */}
            <div className='flex items-center py-[10px]'>
                <IoIosArrowRoundBack className='text-primary text-[45px] pt-[5px] mr-[5px] hover:text-[#D13131] cursor-pointer'
                    onClick={handleBack} />
                <h1 className='font-bold text-[28px] text-primary'>
                    {view ? 'View Formulation' : 'Edit Formulation'}
                </h1>
            </div>
            <hr className='border-[#ACACAC]' />
            <div className='flex w-full items-center'>
                <p className={`${(isOpen && edit) ? 'w-[80%] 3xl:w-[50%]' : edit ? 'w-[80%] 2xl:w-[50%]' : 'w-full'} py-[20px] text-[#8F8F8F] text-[18px]`}>The following formula is shown:
                    <span className='font-semibold italic text-black'> {fileData?.description} ({fileData?.number})</span>
                </p>
                {edit &&
                    <div className={`${isOpen ? 'flex-col 3xl:flex-row w-[20%] 3xl:w-[50%] ' : 'flex-col 2xl:flex-row w-[20%] 2xl:w-[50%]'} flex justify-end`}>
                        <div className={`${isOpen ? 'mt-[10px] 3xl:mr-[10px]' : 'mt-[10px] 2xl:my-[10px] 2xl:mr-[10px]'} flex justify-end`}>
                            <button className={`${isOpen ? 'text-[15px] 2xl:text-[18px]': 'text-[18px]'} hover:bg-[#961e1e] h-[35px] flex items-center justify-center font-medium text-white rounded-[10px] px-[15px] w-[135px] bg-primary`}
                                onClick={addRow}>
                                <HiOutlinePlus className='mr-[5px]' />
                                Add Row
                            </button>
                        </div>
                        <div className='flex justify-end mt-[5px] mb-[10px] 2xl:my-[10px]'>
                            <button className={`${isOpen ? 'text-[15px] 2xl:text-[18px]': 'text-[18px]'} hover:bg-[#00780c] h-[35px] flex items-center justify-center font-medium text-white rounded-[10px] px-[15px] w-[135px] bg-[#00930F]`}
                                onClick={() => { 
                                    setEdit(false); 
                                    setView(true);
                                }}>
                                <IoIosSave className='mr-[5px]' />
                                Save
                            </button>
                        </div>
                    </div>
                }
            </div>
            <div className='rounded-[5px] border border-[#656565] overflow-x-auto'>
                <table className='table-auto w-full border-collapse'>
                    <thead>
                        <tr>
                            {fileData && Object.keys(fileData).map((key) =>
                                (key != 'formulations' && key != 'cost') &&
                                <th key={key} className={`text-center animate-zoomIn whitespace-nowrap font-bold text-[20px] text-[#6B6B6B] py-2 px-6 border-b border-[#ACACAC]`}>
                                    {formatHeader(key)}{key == 'batchQty' && '.'}
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {!edit ?
                            <>
                                {fileData && (
                                    <>
                                        <tr className='animate-zoomIn text-center font-bold text-black text-[18px] border-b border-[#ACACAC]'>
                                            <td className='py-[10px]'>{fileData.number}</td>
                                            <td></td>
                                            <td>{fileData.itemCode}</td>
                                            <td>{fileData.description}</td>
                                            <td>{fileData.batchQty}</td>
                                            <td>{fileData.unit}</td>
                                        </tr>

                                        {fileData.formulations?.map((formulation, index) => (
                                            <tr key={index} className={`${index % 2 == 1 && 'bg-[#FCF7F7]'} animate-zoomIn text-center font-medium text-[#6B6B6B] text-[18px]`}>
                                                <td></td>
                                                <td className='py-[10px]'>{formulation.level}</td>
                                                <td>{formulation.itemCode}</td>
                                                <td>{formulation.description}</td>
                                                <td>{formulation.batchQty}</td>
                                                <td>{formulation.unit}</td>
                                            </tr>
                                        ))}
                                    </>
                                )}
                            </>
                            :
                            <>
                                {fileData && (
                                    <>
                                        <tr className='animate-zoomIn text-center font-bold text-black text-[18px] border-b border-[#ACACAC]'>
                                            <td className='py-[10px]'>{fileData.number}</td>
                                            <td></td>
                                            <td>
                                                <input
                                                    type="text"
                                                    onChange={(e) => handleInputChange('itemCode', e.target.value)}
                                                    value={fileData.itemCode}
                                                    className={`mx-[5px] text-center animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] px-[5px]`}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                                    value={fileData.description}
                                                    className={`mx-[5px] text-center animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] px-[5px]`}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    onChange={(e) => handleInputChange('batchQty', e.target.value)}
                                                    value={fileData.batchQty}
                                                    className={`mx-[5px] text-center animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] px-[5px]`}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    onChange={(e) => handleInputChange('unit', e.target.value)}
                                                    value={fileData.unit}
                                                    className={`mx-[5px] text-center animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] px-[5px]`}
                                                />
                                            </td>
                                        </tr>

                                        {fileData.formulations?.map((formulation, index) => (
                                            <tr key={index} className={`${index % 2 == 1 && 'bg-[#FCF7F7]'} animate-zoomIn text-center font-medium text-[#6B6B6B] text-[18px]`}>
                                                <td className='flex justify-center items-center py-[15px]'>
                                                    <IoTrash className="text-[#717171] text-[25px] cursor-pointer hover:text-red-700"
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
                                                        className="text-center animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909]"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        onChange={(e) => handleFormulationInputChange(index, 'description', e.target.value)}
                                                        value={formulation.description}
                                                        className="text-center animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909]"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        onChange={(e) => handleFormulationInputChange(index, 'batchQty', parseFloat(e.target.value))}
                                                        value={formulation.batchQty}
                                                        className="text-center animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909]"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        onChange={(e) => handleFormulationInputChange(index, 'unit', e.target.value)}
                                                        value={formulation.unit}
                                                        className="text-center animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909]"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                )}
                            </>
                        }

                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default FormulationTable