"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FormulationRecord } from '@/types/data';
import { IoIosArrowRoundBack, IoIosSave } from 'react-icons/io';
import { HiOutlinePlus } from 'react-icons/hi2';
import { IoTrash } from 'react-icons/io5';
import { useFormulationContext } from '@/contexts/FormulationContext';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { HiClipboardList } from 'react-icons/hi';
import Header from '@/components/header/Header';
import api from '@/utils/api';
import Alert from '@/components/alerts/Alert';
import ButtonSpinner from '@/components/loaders/ButtonSpinner';
import WkspConfirmDialog from '@/components/modals/WkspConfirmDialog';

const AddFormulationPage = () => {
    const [formulaData, setFormulaData] = useState<FormulationRecord[]>([
        {
            formula: '34-222-V',
            level: '',
            itemCode: 'FG-01',
            description: 'HOTDOG1K',
            formulation: '',
            batchQty: 0,
            unit: 'kg',
        },
        {
            formula: '',
            level: '1',
            itemCode: '',
            description: 'EMULSION',
            formulation: '',
            batchQty: 0,
            unit: 'kg',
        }
    ]);
    const [removedRows, setRemovedRows] = useState<FormulationRecord[]>([]);
    const [alertMessages, setAlertMessages] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen } = useSidebarContext();
    const { add, setAdd } = useFormulationContext();
    const router = useRouter();

    const handleBack = () => {
        setAdd(false);
        router.back();
    }

    const addRow = () => {
        const newRow: FormulationRecord = {
            formula: '',
            level: '',
            itemCode: '',
            description: '',
            formulation: '',
            batchQty: 0,
            unit: '',
        };
        setFormulaData([...formulaData, newRow]);
    };

    const [confirmDialog, setConfirmDialog] = useState(false);
    const [rowToRemove, setRowToRemove] = useState<{ index: number } | null>(null);

    const removeRow = (index: number) => {
        setRowToRemove({ index });
        setConfirmDialog(true);
    };

    // const removeRow = (index: number) => {
    //     if (index === 0) return; // Prevent removing the first row
    //     const updatedData = formulaData.filter((_, i) => i !== index);
    //     setFormulaData(updatedData);
    // };
    const confirmRemoveRow = () => {
        if (rowToRemove === null) return;

        const { index } = rowToRemove;
        const rowToRemoveData = formulaData[index];

        if (index === 0) return;
        // Remove the row from formulaData
        setFormulaData(prevData => prevData.filter((_, i) => i !== index));

        // Add the removed row to removedRows
        if(rowToRemoveData.itemCode != '' && rowToRemoveData.description != ''){
            setRemovedRows(prevRows => [...prevRows, rowToRemoveData]);
        }

        setConfirmDialog(false);
        setRowToRemove(null);
    };

    const handleInputChange = (index: number, key: keyof FormulationRecord, value: string | number) => {
        setFormulaData((prevData) => {
            const updated = [...prevData];
            updated[index] = {
                ...updated[index],
                [key]: value
            };

            // Calculate emulsion batch quantity
            const emulsionIndex = updated.findIndex(row => row.description === 'EMULSION');
            if (emulsionIndex !== -1) {
                let totalBatchQty = 0;
                for (let i = 0; i < updated.length; i++) {
                    if (i !== emulsionIndex 
                        && !updated[i].description?.toUpperCase().includes('EMULSION')
                        && !updated[i].description?.toUpperCase().includes('PACKAGING')
                        && updated[i].formulation === "") {
                        totalBatchQty += Number(updated[i].batchQty) || 0;
                    }
                }
                updated[emulsionIndex].batchQty = totalBatchQty;
            }

            return updated;
        });
    };

    const onSave = async () => {
        const hasEmptyRow = formulaData.some(row =>
            !row.description ||
            (row.batchQty === null || row.batchQty <= 0) ||
            !row.unit
        );

        if (hasEmptyRow) {
            setAlertMessages(prev => [...prev, 'Please fill in all fields!']);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const finishedGood = formulaData[0];

            let fgRow = {
                fg_code: finishedGood.itemCode,
                fg_desc: finishedGood.description,
                total_batch_qty: finishedGood.batchQty,
                unit: finishedGood.unit,
                formulation_no: parseInt(finishedGood.formulation ?? '0', 10),
            };

            const fgResponse = await api.post('/finished_goods/create', fgRow);

            if (fgResponse.data.status !== 201) {
                setAlertMessages([fgResponse.data.message]);
            }

            let emulsion = formulaData.find(item => item.description?.toLowerCase() === 'emulsion');

            const transformedEmulsionData = emulsion
                ? {
                    level: emulsion.level,
                    batch_qty: emulsion.batchQty,
                    unit: emulsion.unit
                }
                : {};

            const materials = formulaData.filter(item =>
                item.description?.toLowerCase() !== 'emulsion' &&
                item.level !== null &&
                item.level !== '' &&
                !item.formulation
            );

            const transformedMaterialData = materials.map(item => ({
                material_code: item.itemCode,
                material_desc: item.description,
                unit: item.unit,
                level: item.level,
                batchQty: item.batchQty,
            }));

            const payload = {
                fg_id: fgResponse.data.fg_id,
                formula_code: finishedGood.formula,
                emulsion: emulsion ? transformedEmulsionData : {},
                materials: transformedMaterialData,
            };


            const saveResponse = await api.post('/formulations/create', payload);

            if (saveResponse.data.status === 200) {
                setIsLoading(false);
                setSuccessMessage("Formulation created successfully.");
                setAdd(false);
            } else {
                setIsLoading(false);
                if (saveResponse.data.message) {
                    setAlertMessages([saveResponse.data.message]);
                } else if (saveResponse.data.errors) {
                    setAlertMessages(saveResponse.data.errors);
                }
            }

            setSuccessMessage("Formulation saved successfully.");

            setAdd(false);
        } catch (error: any) {
            setIsLoading(false);
            if (error.response?.data?.message) {
                setAlertMessages([error.response.data.message]);
            } else if (error.response?.data?.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat() as string[];
                setAlertMessages(errorMessages);
            } else {
                setAlertMessages(['Error saving Formulation. Please try again.']);
            }
        }
    };

    return (
        <>
            <div className="absolute top-0 right-0">
                {alertMessages && alertMessages.map((msg, index) => (
                    <Alert className="!relative" variant='critical' key={index} message={msg} setClose={() => {
                        setAlertMessages(prev => prev.filter((_, i) => i !== index));
                    }} />
                ))}
                {successMessage && <Alert className="!relative" variant='success' message={successMessage} setClose={() => setSuccessMessage('')} />}
            </div>
            {confirmDialog && (
                <div className="absolute z-[1000]">
                    <WkspConfirmDialog
                        setConfirmDialog={setConfirmDialog}
                        onConfirm={confirmRemoveRow}
                    />
                </div>
            )}
            <Header icon={HiClipboardList} title={"Formulations"} />
            <div className={`${isOpen ? 'px-[10px] 2xl:px-[50px]' : 'px-[50px]'} mt-[25px] ml-[45px]`}>
                <div className='bg-white dark:bg-[#3c3c3c] rounded-[10px] drop-shadow px-[30px] min-h-[820px] pb-[30px] mb-[25px]'>
                    <div className='flex items-center py-[10px]'>
                        <IoIosArrowRoundBack className='text-primary dark:text-white text-[45px] pt-[5px] mr-[5px] hover:text-[#D13131] transition-colors duration-300 ease-in-out cursor-pointer'
                            onClick={handleBack} />
                        <h1 className='font-bold text-[28px] text-primary dark:text-white'>
                            Add Formulation
                        </h1>
                    </div>
                    <hr className='border-[#ACACAC]' />
                    <div className='flex w-full items-center'>
                        {add && (
                            <div className='w-full flex justify-end'>
                                <div className='my-[10px] mr-[10px] flex justify-end'>
                                    <button className={`text-[18px] hover:bg-[#961e1e] transition-colors duration-250 ease-in-out h-[35px] flex items-center justify-center font-medium text-white rounded-[10px] px-[15px] w-[135px] bg-primary`}
                                        onClick={addRow}>
                                        <HiOutlinePlus className='mr-[5px]' />
                                        Add Row
                                    </button>
                                </div>
                                <div className='flex justify-end my-[10px]'>
                                    <button className={`flex text-[18px] hover:bg-[#00780c] transition-colors duration-250 ease-in-out h-[35px] flex items-center justify-center font-medium text-white rounded-[10px] px-[15px] w-[135px] bg-[#00930F]`}
                                        onClick={onSave}>
                                        <div className="flex items-center transition-opacity duration-300 ease-in-out">
                                            {isLoading ? (
                                                <ButtonSpinner className='!size-[20px] mr-[2px] opacity-100' />
                                            ) : (
                                                <IoIosSave className='mr-[5px] opacity-100' />
                                            )}
                                            <span>
                                                Save
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='rounded-[5px] border border-[#656565] overflow-x-auto'>
                        <table className='table-auto w-full border-collapse'>
                            <thead>
                                <tr>
                                    <th className='text-left animate-zoomIn whitespace-nowrap font-bold text-[20px] text-[#6B6B6B] py-2 px-6 border-b border-[#ACACAC] dark:text-[#d1d1d1] dark:border-[#5C5C5C]'>Formula</th>
                                    <th className='text-center animate-zoomIn whitespace-nowrap font-bold text-[20px] text-[#6B6B6B] py-2 px-6 border-b border-[#ACACAC] dark:text-[#d1d1d1] dark:border-[#5C5C5C]'>Level</th>
                                    <th className='text-left animate-zoomIn whitespace-nowrap font-bold text-[20px] text-[#6B6B6B] py-2 px-6 border-b border-[#ACACAC] dark:text-[#d1d1d1] dark:border-[#5C5C5C]'>Item Code</th>
                                    <th className='text-left animate-zoomIn whitespace-nowrap font-bold text-[20px] text-[#6B6B6B] py-2 px-6 border-b border-[#ACACAC] dark:text-[#d1d1d1] dark:border-[#5C5C5C]'>Description</th>
                                    <th className='text-center animate-zoomIn whitespace-nowrap font-bold text-[20px] text-[#6B6B6B] py-2 px-6 border-b border-[#ACACAC] dark:text-[#d1d1d1] dark:border-[#5C5C5C]'>Formulation</th>
                                    <th className='text-right animate-zoomIn whitespace-nowrap font-bold text-[20px] text-[#6B6B6B] py-2 px-6 border-b border-[#ACACAC] dark:text-[#d1d1d1] dark:border-[#5C5C5C]'>Batch Qty</th>
                                    <th className='text-left animate-zoomIn whitespace-nowrap font-bold text-[20px] text-[#6B6B6B] py-2 px-6 border-b border-[#ACACAC] dark:text-[#d1d1d1] dark:border-[#5C5C5C]'>Unit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formulaData && (
                                    <>
                                        <tr className='animate-zoomIn text-center font-bold text-black text-[18px] border-b border-[#ACACAC] dark:text-[#d1d1d1] dark:border-[#5C5C5C]'>
                                            <td className='py-[10px] px-6 text-left'>
                                                {add ? (
                                                    <input
                                                        type="text"
                                                        onChange={(e) => handleInputChange(0, 'formula', e.target.value)}
                                                        value={formulaData[0]?.formula || ''}
                                                        className={`text-left animate-zoomIn transition-all duration-400 ease-in-out dark:border-[#5C5C5C] dark:bg-[#4C4C4C] dark:text-[#d1d1d1] border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] px-[5px] w-[160px]`}
                                                    />
                                                ) : (
                                                    <span>{formulaData[0]?.formula || ''}</span>
                                                )}
                                            </td>
                                            <td></td>
                                            <td className='px-6 text-left'>
                                                {add ? (
                                                    <input
                                                        type="text"
                                                        onChange={(e) => handleInputChange(0, 'itemCode', e.target.value)}
                                                        value={formulaData[0]?.itemCode || ''}
                                                        className="text-left px-2 animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] dark:border-[#5C5C5C] dark:bg-[#4C4C4C] dark:text-[#d1d1d1]"
                                                    />
                                                ) : (
                                                    <span className='text-left'>{formulaData[0]?.itemCode || ''}</span>
                                                )}
                                            </td>
                                            <td className='px-6 text-left'>
                                                {add ? (
                                                    <input
                                                        type="text"
                                                        onChange={(e) => handleInputChange(0, 'description', e.target.value)}
                                                        value={formulaData[0]?.description || ''}
                                                        className="text-left px-2 animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] dark:border-[#5C5C5C] dark:bg-[#4C4C4C] dark:text-[#d1d1d1]"
                                                    />
                                                ) : (
                                                    <span>{formulaData[0]?.description}</span>
                                                )}
                                            </td>
                                            <td className='px-6 text-center'>
                                                {add ? (
                                                    <input
                                                        type="text"
                                                        onChange={(e) => handleInputChange(0, 'formulation', e.target.value)}
                                                        value={formulaData[0]?.formulation || ''}
                                                        className={`mx-[5px] text-center animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] px-[5px] w-[80px] dark:border-[#5C5C5C] dark:bg-[#4C4C4C] dark:text-[#d1d1d1]`}
                                                    />
                                                ) : (
                                                    <span>{formulaData[0]?.formulation || ''}</span>
                                                )}
                                            </td>
                                            <td className='px-6 text-right'>
                                                {add ? (
                                                    <input
                                                        type="text"
                                                        onChange={(e) => handleInputChange(0, 'batchQty', e.target.value)}
                                                        value={Number(formulaData[0]?.batchQty).toFixed(2) ?? ''}
                                                        className={`text-right animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] px-[5px] dark:border-[#5C5C5C] dark:bg-[#4C4C4C] dark:text-[#d1d1d1]`}
                                                    />
                                                ) : (
                                                    <span>{Number(formulaData[0]?.batchQty).toFixed(2) ?? ''}</span>
                                                )}
                                            </td>
                                            <td className='px-6 text-left'>
                                                {add ? (
                                                    <input
                                                        type="text"
                                                        onChange={(e) => handleInputChange(0, 'unit', e.target.value)}
                                                        value={formulaData[0]?.unit || ''}
                                                        className={`w-full text-left animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] px-[5px] w-[110px] dark:border-[#5C5C5C] dark:bg-[#4C4C4C] dark:text-[#d1d1d1]`}
                                                    />
                                                ) : (
                                                    <span>{formulaData[0]?.unit}</span>
                                                )}
                                            </td>
                                        </tr>

                                        {formulaData.slice(1).map((item, index) => (
                                            <tr key={index + 1} className={`${(index + 1) % 2 === 1 && 'bg-[#FCF7F7] dark:bg-[#4c4c4c]'} animate-zoomIn text-center font-medium text-[#6B6B6B] text-[18px] dark:text-white`}>
                                                <td className='flex justify-center items-center py-[15px]'>
                                                    {add ? (
                                                        <IoTrash className="text-[#717171] text-[25px] cursor-pointer hover:text-red-700 transition-colors duration-300 ease-in-out dark:text-[#d1d1d1] dark:hover:text-red-500"
                                                            onClick={() => removeRow(index + 1)} />
                                                    ) : (<td></td>)}
                                                </td>
                                                <td className='text-center px-6 py-[10px]'>
                                                    {add ? (
                                                        <input
                                                            type="text"
                                                            onChange={(e) => handleInputChange(index + 1, 'level', e.target.value)}
                                                            value={item.level || ''}
                                                            className="w-full text-center animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] w-[60px] dark:border-[#5C5C5C] dark:bg-[#4C4C4C] dark:text-[#d1d1d1]"
                                                        />
                                                    ) : (
                                                        <span>{item.level || ''}</span>
                                                    )}
                                                </td>
                                                {item.description?.toLowerCase() !== 'emulsion' ? (
                                                    <td className='px-6 text-left'>
                                                        {add ? (
                                                            <input
                                                                type="text"
                                                                onChange={(e) => handleInputChange(index + 1, 'itemCode', e.target.value)}
                                                                value={item.itemCode || ''}
                                                                className="w-full text-left px-2 animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] dark:border-[#5C5C5C] dark:bg-[#4C4C4C] dark:text-[#d1d1d1]"
                                                            />
                                                        ) : (
                                                            <span>{item.itemCode || ''}</span>
                                                        )}
                                                    </td>
                                                ) : <td></td>}
                                                <td className='px-6 text-left'>
                                                    {add ? (
                                                        <input
                                                            type="text"
                                                            onChange={(e) => handleInputChange(index + 1, 'description', e.target.value)}
                                                            value={item.description || ''}
                                                            className="w-full text-left px-2 animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] dark:border-[#5C5C5C] dark:bg-[#4C4C4C] dark:text-[#d1d1d1]"
                                                        />
                                                    ) : (
                                                        <span>{item.description}</span>
                                                    )}
                                                </td>
                                                <td>
                                                </td>
                                                <td className='px-6 text-right'>
                                                    {add ? (
                                                        <input
                                                            type="text"
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                                                    handleInputChange(index + 1, 'batchQty', value);
                                                                }
                                                            }}
                                                            value={item.batchQty !== undefined && item.batchQty !== null ? Number(item.batchQty).toFixed(2) : ''}
                                                            className="w-full text-right px-2 animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] dark:border-[#5C5C5C] dark:bg-[#4C4C4C] dark:text-[#d1d1d1]"
                                                        />
                                                    ) : (
                                                        <span>{item.batchQty !== undefined && item.batchQty !== null ? Number(item.batchQty).toFixed(2) : ''}</span>
                                                    )}
                                                </td>
                                                <td className='px-6 text-left'>
                                                    {add ? (
                                                        <input
                                                            type="text"
                                                            onChange={(e) => handleInputChange(index + 1, 'unit', e.target.value)}
                                                            value={item.unit || ''}
                                                            className="w-full text-left px-2 animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] w-[100px] dark:border-[#5C5C5C] dark:bg-[#4C4C4C] dark:text-[#d1d1d1]"
                                                        />
                                                    ) : (
                                                        <span>{item.unit}</span>
                                                    )}
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