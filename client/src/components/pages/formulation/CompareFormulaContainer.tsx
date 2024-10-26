import { Router } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react'
import { FormulationContainerProps } from './FormulationContainer';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { formatHeader } from '@/utils/costwiseUtils';
import { useFormulationContext } from '@/contexts/FormulationContext';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { FormulationRecord } from '@/types/data';
import api from '@/utils/api';
import BillOfMaterialsName from '@/components/modals/BillOfMaterialsName';
import Alert from '@/components/alerts/Alert';
import Loader from '@/components/loaders/Loader';
import Spinner from '@/components/loaders/Spinner';

export interface CompareFormulaProps {
    number: string;
    itemCode: string;
    description: string;
    batchQty: number;
    level: number;
    unit: string;
    materialCost: number;
    productCost: number;
    formulations: {
        level: number;
        itemCode: string;
        description: string;
        batchQty: number;
        unit: string;
        materialCost: number;
    }[];
}


const CompareFormulaContainer = () => {
    const router = useRouter();
    const { isOpen } = useSidebarContext();
    const { setViewFormulas, selectedChoices, bomName } = useFormulationContext();
    const [data, setData] = useState<FormulationRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [saveBomName, setSaveBomName] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [alertMessages, setAlertMessages] = useState<string[]>([]);

    const minProductCost = Math.min(...data.filter(info => info.rowType === 'finishedGood').map(info => Number(info.cost) || 0));

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        console.log("SELECTED CHOICES: ", selectedChoices);
        try {
            const allFormulationIds = selectedChoices;

            const formulationResponse = await api.get('/formulations/retrieve_batch', {
                params: { col: 'formulation_id', values: allFormulationIds },
            });

            if (formulationResponse.data.status !== 200) {
                throw new Error("Failed to fetch formulations");
            }

            const formulationDataArray = formulationResponse.data.data;
            const allMaterialIds: number[] = [];
            const allFinishedGoodIds: number[] = [];

            formulationDataArray.forEach((formulation: { material_qty_list: string; fg_id: number }) => {
                allFinishedGoodIds.push(formulation.fg_id);

                if (formulation.material_qty_list) {
                    const materialList = JSON.parse(formulation.material_qty_list);
                    materialList.forEach((material: {}) => {
                        const materialId = Object.keys(material)[0];
                        allMaterialIds.push(parseInt(materialId, 10));
                    });
                }
            });

            const finishedGoodResponse = await api.get('/finished_goods/retrieve_batch', {
                params: { col: 'fg_id', values: allFinishedGoodIds },
            });

            if (finishedGoodResponse.data.status !== 200) {
                throw new Error("Failed to fetch finished goods");
            }

            const finishedGoodDataArray = finishedGoodResponse.data.data;

            const materialResponse = await api.get('/materials/retrieve_batch', {
                params: { col: 'material_id', values: allMaterialIds },
            });

            if (materialResponse.data.status !== 200) {
                throw new Error("Failed to fetch materials");
            }

            const materialDataArray = materialResponse.data.data;

            const currentFormulations: FormulationRecord[] = [];

            selectedChoices.forEach((formulationId: number) => {
                const formulation = formulationDataArray.find(
                    (f: { formulation_id: number }) => f.formulation_id === formulationId
                );

                if (formulation) {
                    const finishedGood = finishedGoodDataArray.find(
                        (fg: { fg_id: number }) => fg.fg_id === formulation.fg_id
                    );

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
                            isLeastCost: finishedGood.is_least_cost,
                            cost: finishedGood.rm_cost,
                        };
                        currentFormulations.push(fgRow);
                    }

                    if (formulation.emulsion) {
                        const emulsionData = JSON.parse(formulation.emulsion);
                        if (Object.keys(emulsionData).length !== 0) {
                            currentFormulations.push({
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
                        materials.forEach((material: { [x: string]: any }) => {
                            const materialId = Object.keys(material)[0];
                            const materialInfo = material[materialId];
                            const materialDetails = materialDataArray.find(
                                (m: { material_id: string }) => m.material_id == materialId
                            );

                            if (materialDetails) {
                                currentFormulations.push({
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
                                    cost: materialDetails.material_cost,
                                });
                            }
                        });
                    }
                }
            });

            console.log(currentFormulations);
            setData(currentFormulations);

        } catch (error) {
            console.error("Error fetching formulation data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedChoices]);

    useEffect(() => {
        if (selectedChoices.length > 0) {
            fetchData();
        }
    }, [fetchData, selectedChoices]);

    const handleSaveToBOMList = async () => {
        setIsLoading(true);
        if (bomName === '') {
            setAlertMessages(prev => [...prev, 'Please provide a name for this BOM.']);
            setIsLoading(false);
            return;
        }
        try {
            const response = await api.post('/boms/create', { formulation_ids: selectedChoices, bom_name: bomName });
            if (response.data.status !== 201) {
                setAlertMessages(prev => [...prev, 'Failed to save BOM']);
                return;
            }

        } catch (error) {
            setAlertMessages(prev => [...prev, 'Failed to save BOM']);
            return;
        } finally {
            setIsLoading(false);
            setSuccessMessage('Saved to BOM List successfully');
            setSaveBomName(false);
            router.push('/formulation');
        }
    };

    return (
        <>
            {saveBomName &&
                <BillOfMaterialsName
                    setSaveBomName={setSaveBomName}
                    handleSaveToBOMList={handleSaveToBOMList}
                    isLoading={isLoading}
                />
            }
            <div className="absolute top-0 right-0">
                {alertMessages && alertMessages.map((msg, index) => (
                    <Alert className="!relative" variant='critical' key={index} message={msg} setClose={() => {
                        setAlertMessages(prev => prev.filter((_, i) => i !== index));
                    }} />
                ))}
                {successMessage && <Alert className="!relative" variant='success' message={successMessage} setClose={() => setSuccessMessage('')} />}
            </div>
            <div className='bg-white rounded-[10px] dark:bg-[#3C3C3C] drop-shadow px-[30px] min-h-[820px] pb-[30px] mb-[20px]'>
                {/* header */}
                <div className='flex items-center py-[10px]'>
                    <IoIosArrowRoundBack className='text-primary dark:text-[#ff4d4d] text-[45px] pt-[5px] mr-[5px] hover:text-[#D13131] cursor-pointer'
                        onClick={() => {
                            setViewFormulas(false);
                        }} />
                    <h1 className='font-bold text-[28px] text-primary dark:text-[#ff4d4d]'>
                        Compare Formulas
                    </h1>
                </div>
                <hr className='border-[#ACACAC]' />
                <div className='flex w-full items-center pt-[20px]'>
                    <p className='w-full text-[#8F8F8F] text-[18px]'>
                        The following formulas are being compared:
                    </p>
                </div>
                <div className='flex flex-col 3xl:flex-row 3xl:items-center'>
                    <div className='flex flex-wrap 3xl:w-[80%] 4xl:w-[85%]'>
                        {isLoading ? (
                            <Loader className='w-[200px] h-[30px]' />
                        ) : (
                            data
                                .filter(item => item.rowType === 'finishedGood')
                                .map((info, index, array) => (
                                    <p key={index} className='italic font-semibold text-[18px] dark:text-white'>
                                        {info.description} ({info.formula})
                                        {index !== array.length - 1 && ',\u00A0'}
                                    </p>
                                ))
                        )}
                    </div>
                    <div className='flex mt-[20px] 3xl:mt-0 justify-start 3xl:justify-end w-full 3xl:w-[20%] 4xl:w-[15%]'>
                        <button className={`${isOpen ? 'text-[17px]' : 'text-[19px]'} hover:brightness-95 text-white font-semibold bg-primary px-[15px] py-[5px] rounded-[5px]`}
                            onClick={() => { setSaveBomName(true) }}>Save to BOM List</button>
                    </div>
                </div>
                <div className='rounded-[5px] border border-[#656565] overflow-x-auto mt-[10px]'>
                    <table className='table-auto w-full border-collapse'>
                        <thead>
                            <tr>
                                {data && data.length > 0 && Object.keys(data[0])
                                    .filter(key =>
                                        !key.toLowerCase().includes('id') &&
                                        !key.toLowerCase().includes('rowtype') &&
                                        !key.toLowerCase().includes('track_id') &&
                                        !key.toLowerCase().includes('isleastcost') &&
                                        key !== 'cost'
                                    )
                                    .concat(['materialCost', 'productCost'])
                                    .map((key) => {
                                        let textAlignClass = 'text-left';
                                        if (key === 'level' || key === 'formulation') {
                                            textAlignClass = 'text-center';
                                        } else if (key === 'batchQty' || key === 'materialCost' || key === 'productCost') {
                                            textAlignClass = 'text-right';
                                        }

                                        return (
                                            <th key={key} className={`${textAlignClass} animate-zoomIn whitespace-nowrap font-bold text-[20px] text-[#6B6B6B] py-2 px-6`}>
                                                {formatHeader(key)}{key == 'batchQty' && '.'}
                                            </th>
                                        );
                                    })}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-4">
                                        <div className="flex justify-center items-center h-[200px]">
                                            <Spinner />
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                data && data.reduce((acc: FormulationRecord[][], currentFormula, index, array) => {
                                    if (currentFormula.rowType === 'finishedGood' || index === 0) {
                                        const nextFinishedGoodIndex = array.findIndex((item, i) => i > index && item.rowType === 'finishedGood');
                                        const groupEndIndex = nextFinishedGoodIndex === -1 ? array.length : nextFinishedGoodIndex;
                                        acc.push(array.slice(index, groupEndIndex));
                                    }
                                    return acc;
                                }, []).map((group, groupIndex) => (
                                    <React.Fragment key={groupIndex}>
                                        {group.map((info, index) => (
                                            <tr key={index} className={`${info.rowType === 'finishedGood' ? (Number(info.cost) === minProductCost ? 'bg-[#fff873] text-black dark:text-black' : 'text-black dark:text-white') : (index % 2 === 1 ? 'bg-[#FCF7F7] dark:bg-[#4C4C4C]' : '')} animate-zoomIn text-center ${info.rowType === 'finishedGood' ? 'font-bold' : 'font-medium'} ${info.rowType === 'finishedGood' ? '' : 'text-[#6B6B6B] dark:text-[#d1d1d1]'} text-[18px] ${info.rowType === 'finishedGood' ? 'border-y border-[#ACACAC]' : ''}`}>
                                                <td className={`py-[10px] ${info.rowType === 'finishedGood' ? 'relative text-left px-6' : ''}`}>
                                                    {info.rowType === 'finishedGood' && (
                                                        <>
                                                            {Number(info.cost) === minProductCost && (
                                                                <>
                                                                    <div className="absolute bottom-[-5px] left-[30%] transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-[#D9D9D9]"></div>
                                                                    <div className="absolute font-light text-black top-[50px] left-0 right-0 mx-auto w-max bg-[#D9D9D9] rounded-full px-4 py-2 shadow-lg z-10">
                                                                        Least-Cost Formula
                                                                    </div>
                                                                </>
                                                            )}
                                                            {info.formula}
                                                        </>
                                                    )}
                                                </td>
                                                <td className={`${info.rowType !== 'finishedGood' ? 'py-[10px]' : ''}`}>{info.rowType !== 'finishedGood' ? info.level : ''}</td>
                                                <td className='text-left px-6'>{info.itemCode}</td>
                                                <td className='text-left px-6'>{info.description}</td>
                                                <td className='text-center px-6'>{info.formulation}</td>
                                                <td className='text-right px-6'>{info.batchQty}</td>
                                                <td className='text-left px-6'>{info.unit}</td>
                                                <td className='text-right px-6'>{info.rowType !== 'finishedGood' ? info.cost : ''}</td>
                                                <td className='text-right px-6'>{info.rowType === 'finishedGood' ? info.cost : ''}</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default CompareFormulaContainer