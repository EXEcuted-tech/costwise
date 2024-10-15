import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { FormulationContainerProps, FormulationProps } from './FormulationContainer';
import { IoIosArrowRoundBack, IoIosSave } from 'react-icons/io';
import { formatHeader, formatMonthYear } from '@/utils/costwiseUtils';
import { HiOutlinePlus } from 'react-icons/hi2';
import { IoTrash } from 'react-icons/io5';
import { useFormulationContext } from '@/contexts/FormulationContext';
import { useSidebarContext } from '@/contexts/SidebarContext';
import api from '@/utils/api';
import { FormulationRecord } from '@/types/data';
import Spinner from '@/components/loaders/Spinner';
import Loader from '@/components/loaders/Loader';
import Alert from '@/components/alerts/Alert';
import { FaRegCalendarDays } from "react-icons/fa6";

const FormulationTable: React.FC<{
    setView: React.Dispatch<React.SetStateAction<boolean>>;
    view: boolean;
}> = ({
    setView,
    view,
}) => {
        const [formulaData, setFormulaData] = useState<FormulationRecord[]>([]);
        const [removedRows, setRemovedRows] = useState<FormulationRecord[]>([]);
        const [fgDesc, setFgDesc] = useState<string>('');
        const [formulaCode, setFormulaCode] = useState<string>('');
        const { isOpen } = useSidebarContext();
        const { edit, setEdit } = useFormulationContext();
        const router = useRouter();
        const searchParams = useSearchParams();
        const [isLoading, setIsLoading] = useState(false);
        const [alertMessages, setAlertMessages] = useState<string[]>([]);
        const [successMessage, setSuccessMessage] = useState('');
        const containerRef = useRef<HTMLDivElement | null>(null);
        const [monthYear, setMonthYear] = useState<number>(202401);

        useEffect(() => {
            const formulationId = searchParams.get('id');
            if (formulationId) {
                retrieveFormulationData(parseInt(formulationId));
            }
        }, [searchParams]);

        const retrieveFormulationData = async (formulationId: number) => {
            setIsLoading(true);
            try {
                const formulationResponse = await api.get('/formulations/retrieve', {
                    params: { col: 'formulation_id', value: formulationId },
                });

                if (formulationResponse.data.status !== 200) {
                    throw new Error("Failed to fetch formulation data");
                }

                const formulation = formulationResponse.data.data[0];
                const finishedGoodResponse = await api.get('/finished_goods/retrieve', {
                    params: { col: 'fg_id', value: formulation.fg_id },
                });

                if (finishedGoodResponse.data.status !== 200) {
                    throw new Error("Failed to fetch finished good data");
                }

                const finishedGood = finishedGoodResponse.data.data[0];
                setMonthYear(finishedGood.monthYear);
                setFgDesc(finishedGood.fg_desc);
                setFormulaCode(formulation.formula_code);

                const allMaterialIds: number[] = [];
                if (formulation.material_qty_list) {
                    const materialList = JSON.parse(formulation.material_qty_list);
                    materialList.forEach((material: {}) => {
                        const materialId = Object.keys(material)[0];
                        allMaterialIds.push(parseInt(materialId, 10));
                    });
                }

                const materialResponse = await api.get('/materials/retrieve_batch', {
                    params: { col: 'material_id', values: allMaterialIds },
                });

                if (materialResponse.data.status !== 200) {
                    throw new Error("Failed to fetch material data");
                }

                const materialDataArray = materialResponse.data.data;

                let currentFormulation: FormulationRecord[] = [];

                if (finishedGood) {
                    let fgRow: FormulationRecord = {
                        id: finishedGood.fg_id,
                        track_id: formulationId,
                        rowType: 'finishedGood',
                        formula: formulation.formula_code,
                        level: null,
                        itemCode: finishedGood.fg_code,
                        description: finishedGood.fg_desc,
                        formulation: parseFloat(finishedGood.formulation_no).toString(),
                        batchQty: parseFloat(finishedGood.total_batch_qty),
                        unit: finishedGood.unit,
                    };
                    currentFormulation.push(fgRow);
                }

                if (formulation.emulsion) {
                    const emulsionData = JSON.parse(formulation.emulsion);
                    if (Object.keys(emulsionData).length !== 0) {
                        currentFormulation.push({
                            id: formulationId,
                            track_id: formulationId,
                            rowType: 'emulsion',
                            formula: null,
                            level: emulsionData.level,
                            itemCode: null,
                            description: "EMULSION",
                            formulation: null,
                            batchQty: emulsionData.batch_qty,
                            unit: emulsionData.unit,
                        });
                    }
                }

                if (formulation.material_qty_list) {
                    const materials = JSON.parse(formulation.material_qty_list);
                    materials.forEach((material: { [key: string]: any }) => {
                        const materialId = Object.keys(material)[0];
                        const materialInfo = material[materialId];
                        const materialDetails = materialDataArray.find((m: { material_id: string; }) => m.material_id == materialId);

                        if (materialDetails) {
                            currentFormulation.push({
                                id: materialDetails.material_id,
                                track_id: formulationId,
                                rowType: 'material',
                                formula: null,
                                level: parseFloat(materialInfo.level).toString(),
                                itemCode: materialDetails.material_code,
                                description: materialDetails.material_desc,
                                formulation: null,
                                batchQty: materialInfo.qty,
                                unit: materialDetails.unit,
                            });
                        }
                    });
                }
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
                setFormulaData(currentFormulation);
            } catch (error) {
                console.error('Error retrieving formulation data:', error);
            }
        };

        const handleBack = () => {
            setView(false);
            setEdit(false);
            router.back();
        }

        const addRow = () => {
            const emptyRow: FormulationRecord = {
                id: 0, // Set default values as needed
                track_id: 0,
                rowType: 'material',
                formula: null,
                level: '',
                itemCode: '',
                description: '',
                batchQty: 0,
                unit: '',
                formulation: null,
            };

            setFormulaData([...formulaData, emptyRow]);
        };

        const removeRow = (index: number) => {
            const rowToRemove = formulaData[index];

            const confirmDeletion = window.confirm(
                'Are you sure you want to delete this record?' // Replace with modal in the future
            );
            if (!confirmDeletion) return;

            // Remove the row from formulaData
            const updatedFormulas = formulaData.filter((_, i) => i !== index);
            setFormulaData(updatedFormulas);

            // Add the removed row to removedRows
            setRemovedRows(prevRows => [...prevRows, rowToRemove]);
        };
        // const removeRow = (index: number) => {
        //     const updatedFormulas = formulaData.filter((_, i) => i !== index);
        //     setFormulaData(updatedFormulas);
        // };

        // const handleInputChange = (index: number, key: keyof FormulationRecord, value: string | number) => {
        //     setFormulaData((prevData) => {
        //         const updated = [...prevData];
        //         updated[index] = {
        //             ...updated[index],
        //             [key]: value
        //         };
        //         return updated;
        //     });
        // };

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
                    let emulsionBatchQty = 0;
                    for (let i = 1; i < emulsionIndex; i++) {
                        if (!updated[i].description.toUpperCase().startsWith('PACKAGING')) {
                            console.log(updated[i].description);
                            emulsionBatchQty += Number(updated[i].batchQty) || 0;
                        }
                    }
                    updated[emulsionIndex].batchQty = emulsionBatchQty;
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
            // const hasEmptyRow = formulaData.some(row => {
            //     const isEmpty = !row.itemCode || !row.description || (row.batchQty === null || row.batchQty <= 0) || !row.unit;
            //     console.log(`Row: ${JSON.stringify(row)}, IsEmpty: ${isEmpty}`);
            //     return isEmpty;
            // });

            if (hasEmptyRow) {
                setAlertMessages(prev => [...prev, 'Please fill in all fields and also ensure batch quantity is greater than 0.00']);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const finishedGood = formulaData[0];

                let fgRow = {
                    fg_id: finishedGood.id,
                    fg_code: finishedGood.itemCode,
                    fg_desc: finishedGood.description,
                    total_batch_qty: finishedGood.batchQty,
                    unit: finishedGood.unit,
                    formulation_no: parseInt(finishedGood.formulation ?? '0', 10),
                };

                const fgResponse = await api.post('/finished_goods/update', fgRow);

                if (fgResponse.data.status !== 200) {
                    throw new Error('Failed to update finished good');
                }

                let emulsion = formulaData.find(item => item.description === 'EMULSION');

                const transformedEmulsionData = emulsion
                    ? {
                        level: emulsion.level,
                        batch_qty: emulsion.batchQty,
                        unit: emulsion.unit
                    }
                    : {};

                const materials = formulaData.filter(item => item.rowType === 'material');

                const transformedMaterialData = materials.map(item => ({
                    material_id: item.id,
                    material_code: item.itemCode,
                    material_desc: item.description,
                    unit: item.unit,
                    level: item.level,
                    batchQty: item.batchQty,
                }));

                const payload = {
                    emulsion: emulsion ? transformedEmulsionData : {},
                    materials: transformedMaterialData,
                    formulation_id: finishedGood.track_id,
                    formula_code: finishedGood.formula
                };

                const saveResponse = await api.post('/boms/update_batch', payload);

                if (saveResponse.data.status === 200) {
                    setIsLoading(false);
                    setSuccessMessage("Formulation saved successfully.");
                    setEdit(false);
                    setView(true);
                } else {
                    setIsLoading(false);
                    if (saveResponse.data.message) {
                        setAlertMessages([saveResponse.data.message]);
                    } else if (saveResponse.data.errors) {
                        setAlertMessages(saveResponse.data.errors);
                    }
                }


                // Handle deletions if needed (similar to your existing code)
                // ...

                if (removedRows.length > 0) {
                    const materialIds = removedRows
                        .filter(row => row.rowType === 'material')
                        .map(row => row.id);

                    if (materialIds.length > 0) {
                        const payload = {
                            formulation_id: formulaData[0].track_id,
                            material_ids: materialIds
                        };

                        const deleteMaterialResponse = await api.post('/formulations/delete_material', payload);
                        if (deleteMaterialResponse.data.status !== 200) {
                            throw new Error('Failed to delete materials');
                        }
                    }

                    const hasEmulsion = removedRows.some(row => row.rowType === 'emulsion');
                    if (hasEmulsion) {
                        const updateEmulsionResponse = await api.post('/formulations/update_emulsion', {
                            formulation_id: formulaData[0].track_id
                        });

                        if (updateEmulsionResponse.data.status !== 200) {
                            throw new Error('Failed to update emulsion');
                        }
                    }
                }

                setRemovedRows([]);
                setSuccessMessage("Formulation saved successfully.");

                setEdit(false);
                setView(true);
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

        const handleMouseMove = (e: React.MouseEvent) => {
            const container = containerRef.current;

            if (!container) return;

            // Check if there's overflow
            if (container.scrollWidth > container.clientWidth) {
                const { clientX } = e;
                const { left, right } = container.getBoundingClientRect();

                const distanceToRight = right - clientX;
                const distanceToLeft = clientX - left;

                const threshold = 100;
                const scrollStep = 50;

                if (distanceToRight < threshold) {
                    container.scrollLeft += scrollStep;
                } else if (distanceToLeft < threshold) {
                    container.scrollLeft -= scrollStep;
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
                <div className='bg-white rounded-[10px] drop-shadow px-[30px] min-h-[820px] pb-[25px] mb-[20px]'>
                    {/* header */}
                    <div className='flex items-center py-[10px]'>
                        <IoIosArrowRoundBack className='text-primary text-[45px] pt-[5px] mr-[5px] hover:text-[#D13131] transition-colors duration-200 ease-in-out cursor-pointer'
                            onClick={handleBack} />
                        <h1 className='font-bold text-[28px] text-primary'>
                            {view ? 'View Formulation' : 'Edit Formulation'}
                        </h1>
                    </div>
                    <hr className='border-[#ACACAC]' />
                    <div className='flex w-full items-center'>
                        <FaRegCalendarDays className='text-[#8F8F8F] text-[25px] mt-[20px] mr-[5px]' />
                        <h1 className='flex text-[#8F8F8F] text-[25px] pt-[20px]'>
                            For the month of
                            {
                                !isLoading ?
                                    <span className='font-semibold italic text-primary'>
                                        ‎ {formatMonthYear(monthYear)}
                                    </span>
                                    :
                                    <span className='ml-[5px] !w-[150px] h-[10px]'>
                                        <Loader className='w-[50px] !h-[30px]' />
                                    </span>
                            }
                        </h1>
                    </div>
                    <div className='flex w-full items-center'>
                        <p className={`${isLoading && 'flex'} ${(isOpen && edit) ? 'w-[80%] 3xl:w-[50%]' : edit ? 'w-[80%] 2xl:w-[50%]' : 'w-full'} pt-[10px] pb-[20px] text-[#8F8F8F] text-[18px]`}>The following formula is shown:
                            {
                                !isLoading ?
                                    <span className='font-semibold italic text-black'>
                                        ‎ {fgDesc} ({formulaCode})
                                    </span>
                                    :
                                    <span className='ml-[5px] !w-[150px] h-[10px]'>
                                        <Loader className='w-[50px] !h-[30px]' />
                                    </span>
                            }

                        </p>
                        {edit &&
                            <div className={`${isOpen ? 'flex-col 3xl:flex-row w-[20%] 3xl:w-[50%] ' : 'flex-col 2xl:flex-row w-[20%] 2xl:w-[50%]'} flex justify-end`}>
                                <div className={`${isOpen ? 'mt-[10px] 3xl:mr-[10px]' : 'mt-[10px] 2xl:my-[10px] 2xl:mr-[10px]'} flex justify-end`}>
                                    <button className={`${isOpen ? 'text-[15px] 2xl:text-[18px]' : 'text-[18px]'} hover:bg-[#961e1e] transition-colors duration-250 ease-in-out h-[35px] flex items-center justify-center font-medium text-white rounded-[10px] px-[15px] w-[135px] bg-primary`}
                                        onClick={addRow}>
                                        <HiOutlinePlus className='mr-[5px]' />
                                        Add Row
                                    </button>
                                </div>
                                <div className='flex justify-end mt-[5px] mb-[10px] 2xl:my-[10px]'>
                                    <button className={`${isOpen ? 'text-[15px] 2xl:text-[18px]' : 'text-[18px]'} hover:bg-[#00780c] transition-colors duration-250 ease-in-out h-[35px] flex items-center justify-center font-medium text-white rounded-[10px] px-[15px] w-[135px] bg-[#00930F]`}
                                        onClick={onSave}>
                                        <IoIosSave className='mr-[5px]' />
                                        Save
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                    <div ref={containerRef} onMouseMove={handleMouseMove} className='rounded-[5px] border border-[#656565] overflow-x-auto'>
                        <table className='table-auto w-full border-collapse'>
                            <thead>
                                {!isLoading ?
                                    <tr>
                                        {formulaData.length > 0 && Object.keys(formulaData[0])
                                            .filter(key =>
                                                !key.toLowerCase().includes('id') &&
                                                !key.toLowerCase().includes('rowtype') &&
                                                !key.toLowerCase().includes('track_id')
                                            )
                                            .map((key) => {
                                                let textAlignClass = 'text-left';
                                                if (key === 'level' || key === 'formulation') {
                                                    textAlignClass = 'text-center';
                                                } else if (key === 'batchQty') {
                                                    textAlignClass = 'text-right';
                                                }

                                                return (
                                                    <th key={key} className={`${textAlignClass} animate-zoomIn whitespace-nowrap font-bold text-[20px] text-[#6B6B6B] py-2 px-6 border-b border-[#ACACAC]`}>
                                                        {formatHeader(key)}{key == 'batchQty' && '.'}
                                                    </th>
                                                );
                                            })}
                                    </tr>
                                    :
                                    <tr>
                                        <th className='py-2 px-6 border-b border-[#ACACAC]'><Loader className='h-[30px] w-[100px]' /></th>
                                        <th className='py-2 px-6 border-b border-[#ACACAC]'><Loader className='h-[30px] w-[100px]' /></th>
                                        <th className='py-2 px-6 border-b border-[#ACACAC]'><Loader className='h-[30px] w-[150px]' /></th>
                                        <th className='py-2 px-6 border-b border-[#ACACAC]'><Loader className='h-[30px] w-[160px]' /></th>
                                        <th className='py-2 px-6 border-b border-[#ACACAC]'><Loader className='h-[30px] w-[100px]' /></th>
                                        <th className='py-2 px-6 border-b border-[#ACACAC]'><Loader className='h-[30px] w-[120px]' /></th>
                                        <th className='py-2 px-6 border-b border-[#ACACAC]'><Loader className='h-[30px] w-[100px]' /></th>
                                    </tr>
                                }
                            </thead>
                            <tbody>
                                {!isLoading ?
                                    <>
                                        {!edit ?
                                            <>
                                                {formulaData.map((item, index) => (
                                                    <tr key={index} className={`${index % 2 === 1 ? 'bg-[#FCF7F7]' : ''} animate-zoomIn text-center ${index === 0 ? 'font-bold text-black' : 'font-medium text-[#6B6B6B]'} text-[18px] ${index === 0 ? 'border-b border-[#ACACAC]' : ''}`}>
                                                        <td className='py-[10px] px-6 text-left'>{index === 0 ? item.formula : ''}</td>
                                                        <td className='py-[10px] px-6'>{index === 0 ? '' : item.level}</td>
                                                        <td className='py-[10px] px-6 text-left'>{item.itemCode}</td>
                                                        <td className='py-[10px] px-6 text-left'>{item.description}</td>
                                                        <td className='py-[10px] px-6 text-center'>{item.formulation}</td>
                                                        <td className='px-6 text-right'>{Number(item.batchQty).toFixed(2)}</td>
                                                        <td className='px-6 text-left'>{item.unit}</td>
                                                    </tr>
                                                ))}
                                            </>
                                            :
                                            <>
                                                {formulaData && (
                                                    <>
                                                        <tr className='animate-zoomIn text-center font-bold text-black text-[18px] border-b border-[#ACACAC]'>
                                                            <td className='w-[150px] py-[10px] px-6 text-left'>{formulaData[0]?.formula}</td>
                                                            <td></td>
                                                            <td className='px-6 text-left'>
                                                                <input
                                                                    type="text"
                                                                    onChange={(e) => handleInputChange(0, 'itemCode', e.target.value)}
                                                                    value={formulaData[0]?.itemCode || ''}
                                                                    className={`text-left animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909]`}
                                                                />
                                                            </td>
                                                            <td className='px-6 text-left'>
                                                                <input
                                                                    type="text"
                                                                    onChange={(e) => handleInputChange(0, 'description', e.target.value)}
                                                                    value={formulaData[0]?.description}
                                                                    className={`text-left animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] px-[5px]`}
                                                                />
                                                            </td>
                                                            <td className='px-6 text-center'>
                                                                <input
                                                                    type="text"
                                                                    onChange={(e) => handleInputChange(0, 'formulation', e.target.value)}
                                                                    value={formulaData[0]?.formulation || ''}
                                                                    className={`text-center animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] px-[5px] w-[80px]`} // Set width for formulation
                                                                />
                                                            </td>
                                                            <td className='px-6 text-right'>
                                                                <input
                                                                    type="text"
                                                                    onChange={(e) => handleInputChange(0, 'batchQty', e.target.value)}
                                                                    value={Number(formulaData[0]?.batchQty).toFixed(2) ?? ''}
                                                                    className={`text-right animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] px-[5px]`}
                                                                />
                                                            </td>
                                                            <td className='px-6 text-left'>
                                                                <input
                                                                    type="text"
                                                                    onChange={(e) => handleInputChange(0, 'unit', e.target.value)}
                                                                    value={formulaData[0]?.unit}
                                                                    className={`w-full text-left animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] px-[5px] w-[110px]`}
                                                                />
                                                            </td>
                                                        </tr>

                                                        {formulaData.slice(1).map((item, index) => (
                                                            <tr key={index + 1} className={`${(index + 1) % 2 === 1 && 'bg-[#FCF7F7]'} animate-zoomIn text-center font-medium text-[#6B6B6B] text-[18px]`}>
                                                                <td className='flex justify-center items-center py-[15px]'>
                                                                    <IoTrash className="text-[#717171] text-[25px] cursor-pointer hover:text-red-700 transition-colors duration-300 ease-in-out"
                                                                        onClick={() => removeRow(index + 1)} />
                                                                </td>
                                                                <td className='text-center px-6 py-[10px]'>
                                                                    <input
                                                                        type="text"
                                                                        onChange={(e) => handleInputChange(index + 1, 'level', e.target.value)}
                                                                        value={item.level || ''}
                                                                        className="text-center animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] w-[60px]"
                                                                    />
                                                                </td>
                                                                {item.description.toLowerCase() !== 'emulsion' ? (
                                                                    <td className='px-6 text-left'>
                                                                        <input
                                                                            type="text"
                                                                            onChange={(e) => handleInputChange(index + 1, 'itemCode', e.target.value)}
                                                                            value={item.itemCode || ''}
                                                                            className="w-full text-left px-2 animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909]"
                                                                        />
                                                                    </td>
                                                                ) : <td></td>}
                                                                <td className='px-6 text-left'>
                                                                    <input
                                                                        type="text"
                                                                        onChange={(e) => handleInputChange(index + 1, 'description', e.target.value)}
                                                                        value={item.description}
                                                                        className="w-full text-left px-2 animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909]"
                                                                    />
                                                                </td>
                                                                <td>
                                                                </td>
                                                                <td className='px-6 text-right'>
                                                                    <input
                                                                        type="text"
                                                                        onChange={(e) => {
                                                                            const value = e.target.value;
                                                                            if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                                                                handleInputChange(index + 1, 'batchQty', value);
                                                                            }
                                                                        }}
                                                                        value={item.batchQty !== undefined && item.batchQty !== null ? Number(item.batchQty).toFixed(2) : ''}
                                                                        className="w-full text-right px-2 animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909]"
                                                                    />
                                                                </td>
                                                                <td className='px-6 text-left'>
                                                                    <input
                                                                        type="text"
                                                                        onChange={(e) => handleInputChange(index + 1, 'unit', e.target.value)}
                                                                        value={item.unit}
                                                                        className="w-full text-left px-2 animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] w-[100px]"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                )}
                                            </>
                                        }
                                    </>
                                    :
                                    <tr>
                                        <td colSpan={8} className="text-center py-4">
                                            <div className='min-h-[500px] flex justify-center items-center'>
                                                <Spinner />
                                            </div>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        )
    }

export default FormulationTable