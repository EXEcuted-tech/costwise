import { useFileManagerContext } from '@/contexts/FileManagerContext';
import { RemovedId } from '@/types/data';
import { formatHeader } from '@/utils/costwiseUtils';
import React, { useEffect, useRef, useState } from 'react'
import { HiOutlinePlus } from "react-icons/hi";
import { IoIosSave } from "react-icons/io";
import { IoTrash } from "react-icons/io5";
import WkspConfirmDialog from '@/components/modals/WkspConfirmDialog';

interface WorkspaceTableProps {
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    data: Record<string, any>[]
    isTransaction: boolean;
    onSave?: (updatedData: Record<string, any>[]) => void;
    removedIds?: number[];
    setRemovedIds?: React.Dispatch<React.SetStateAction<number[]>>;
    bomId?: number;
    onSaveBOM?: (updatedData: Record<string, any>[], bomId: number) => void;
    removedBomIds?: RemovedId[];
    setRemovedBomIds?: React.Dispatch<React.SetStateAction<RemovedId[]>>;
    transactionCount?: number;
}

const WorkspaceTable: React.FC<WorkspaceTableProps> = ({
    data,
    isEdit,
    setIsEdit,
    isTransaction,
    onSave,
    onSaveBOM,
    bomId,
    removedIds,
    setRemovedIds,
    removedBomIds,
    setRemovedBomIds,
    transactionCount,
}) => {
    const [tableData, setTableData] = useState(data);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [rowToRemove, setRowToRemove] = useState<{ index: number, rowType?: string } | null>(null);

    const [initialData, setInitialData] = useState<Record<string, any>[]>([]);

    // useEffect(() => {
    //     if (initialData.length === 0) {
    //         setInitialData(data);
    //         setTableData(data);
    //     }
    // }, [data, initialData.length]);
    useEffect(()=>{
        setTableData(data);
    },[data])

    const handleInputChange = (rowIndex: number, key: string, value: string) => {
        const updatedData = [...tableData];

        if (key == 'level' || key == 'formulation' || key == 'year' || key == 'month' || key == 'date') {
            const formattedValue = String(value);
            updatedData[rowIndex][key] = formattedValue;
        } else if (!isNaN(Number(value)) && value !== '') {
            const formattedValue = Number(value).toFixed(2);
            updatedData[rowIndex][key] = formattedValue;
        } else {
            updatedData[rowIndex][key] = value;
        }

        setTableData(updatedData);
    };

    const addRow = () => {
        const nextId = typeof transactionCount === 'number'
            ? transactionCount + 1
            : (tableData.length > 0
                ? Math.max(...tableData.map(row => row.id as number)) + 1
                : 1);

        const emptyRow = Object.keys(tableData[0] || {}).reduce<Record<string, any>>((acc, key) => {
            acc[key] = key === 'id' ? nextId : '';
            return acc;
        }, {});

        setTableData([...tableData, emptyRow]);
    };

    const addBomRow = () => {
        const nextId = tableData.length > 0
            ? Math.max(...tableData.map(row => (row.id as number) || 0)) + 1
            : 1;
        const addedData = tableData.filter(row => !initialData.some(initialRow => initialRow.id === row.id));
        const hasEndIdentifier = addedData.some(row => row.rowType === 'endIdentifier');


        if (!hasEndIdentifier) {
            const endIdentifierRow = {
                id: 0,
                rowType: 'endIdentifier',
                formula: null,
                level: null,
                itemCode: null,
                description: null,
                formulation: null,
                batchQty: null,
                unit: null
            };

            const finishedGoodRow = {
                id: 0,
                rowType: 'finishedGood',
                formula: 'RWD-XXX',
                level: null,
                itemCode: tableData[0].itemCode,
                description: tableData[0].description,
                formulation: '',
                batchQty: '',
                unit: ''
            };

            setTableData([...tableData, endIdentifierRow, finishedGoodRow]);
        } else {
            const formulationRow = {
                id: 0,
                rowType: 'material',
                formula: null,
                level: '',
                itemCode: '',
                description: '',
                formulation: null,
                batchQty: '',
                unit: ''
            };

            setTableData([...tableData, formulationRow]);
        }
    };

    const removeRow = (index: number) => {
        setRowToRemove({ index });
        setConfirmDialog(true);
    };

    const confirmRemoveRow = () => {
        if (rowToRemove === null) return;

        const { index } = rowToRemove;
        const rowToRemoveData = tableData[index];
        const id = rowToRemoveData['id'];

        console.log(index, id);
        setTableData(prevData => prevData.filter((_, i) => i !== index));

        if (removedIds && setRemovedIds) {
            if (id && typeof id === 'number' && !removedIds.includes(id)) {
                setRemovedIds(prevIds => [...prevIds, id]);
            }
        }

        setConfirmDialog(false);
        setRowToRemove(null);
    };

    const removeBomRow = (index: number, rowType: string) => {
        if (rowType == 'endIdentifier') {
            alert("That's a row identifier!");
            return;
        }
        setRowToRemove({ index, rowType });
        setConfirmDialog(true);
    };

    const confirmRemoveBomRow = () => {
        if (rowToRemove === null) return;

        const { index, rowType } = rowToRemove;
        const rowToRemoveData = tableData[index];
        const id = rowToRemoveData?.id;

        if (id === undefined || typeof id !== 'number') {
            setConfirmDialog(false);
            setRowToRemove(null);
            return;
        }

        let indicesToRemove: number[] = [index];

        if (rowType === 'finishedGood') {
            for (let i = index + 1; i < tableData.length; i++) {
                const currentRow = tableData[i];
                if (currentRow.rowType === 'finishedGood') {
                    break;
                }
                indicesToRemove.push(i);
            }
        }

        indicesToRemove.sort((a, b) => b - a);

        const rowsToRemove = indicesToRemove.map(i => tableData[i]);

        setTableData(prevData =>
            prevData.filter((_, i) => !indicesToRemove.includes(i))
        );

        if (setRemovedBomIds) {
            setRemovedBomIds(prevIds => {
                const newRemoved = rowsToRemove.filter(
                    removed =>
                        !prevIds.some(
                            existing =>
                                existing.id === removed.id &&
                                existing.rowType === removed.rowType &&
                                existing.track_id === removed.track_id
                        ) && removed.id > 0
                ).map(removed => ({ id: removed.id, rowType: removed.rowType, track_id: removed.track_id }));

                return [...prevIds, ...newRemoved];
            });
        }

        setConfirmDialog(false);
        setRowToRemove(null);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const container = containerRef.current;

        if (!container) return;

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
    };

    return (
        <>
            {confirmDialog && (
                <div className="absolute z-[1000]">
                    <WkspConfirmDialog
                        setConfirmDialog={setConfirmDialog}
                        onConfirm={removedIds ? confirmRemoveRow : confirmRemoveBomRow}
                    />
                </div>
            )}
            <div ref={containerRef} onMouseMove={handleMouseMove} className="overflow-x-auto">
                {isEdit &&
                    <div className={`h-[40px] animate-zoomIn fixed flex items-center ${isTransaction ? 'left-[20px]' : 'left-[40px]'}`}>
                        <div className='flex justify-end my-[10px] mr-[10px]'>
                            <button className='hover:bg-[#961e1e] h-[35px] flex items-center justify-center font-medium text-[18px] text-white rounded-[10px] px-[15px] w-[135px] bg-primary transition-colors delay-50 duration-[1000] ease-in'
                                onClick={
                                    bomId ? addBomRow : addRow
                                }>
                                <HiOutlinePlus className='mr-[5px]' />
                                Add Row
                            </button>
                        </div>
                        <div className='flex justify-end'>
                            <button className='hover:bg-[#00780c] h-[35px] flex items-center justify-center font-medium text-[18px] text-white rounded-[10px] px-[15px] w-[135px] bg-[#00930F] transition-colors delay-50 duration-[1000] ease-in'
                                onClick={() => {
                                    if (onSave) {
                                        onSave(tableData);
                                    } else if (onSaveBOM && bomId) {
                                        onSaveBOM(tableData, bomId);
                                    }
                                    setIsEdit(false);
                                }}>
                                <IoIosSave className='mr-[5px]' />
                                Save
                            </button>
                        </div>
                    </div>
                }
                <table className={`${isEdit && 'mt-[50px]'} w-full bg-white border-collapse`}>
                    <thead className='bg-primary text-white dark:border-[#5C5C5C]'>
                        <tr>
                            {isEdit && <th className="w-[10px]"></th>}

                            {data.length > 0 && Object?.keys(data[0])
                                .filter(key =>
                                    !key.toLowerCase().includes('id') &&
                                    !key.toLowerCase().includes('rowtype') &&
                                    !key.toLowerCase().includes('track_id')
                                )
                                .map((key) => {
                                    let textAlignClass = 'text-left';
                                    if (key === 'itemDescription') {
                                        textAlignClass = 'text-left';
                                    } else if (key === 'materialCost' || key === 'amount' || key === 'quantity') {
                                        textAlignClass = 'text-right';
                                    }

                                    return (
                                        // isEdit
                                        //     ?
                                        //     <th key={key} className={`animate-zoomIn ${key == 'level' || key === 'formulation' || key == 'year' || key == 'month' ? 'text-center' : (key === 'materialCost' || key === 'amount' || key === 'rmCost' || key === 'factoryOverhead' || key === 'directLabor') ? 'text-right' : 'text-left'} 
                                        //                     whitespace-nowrap font-medium text-[20px] py-2 px-6 border-b border-gray-300`}>
                                        //         {formatHeader(key, ['rm', 'total'])}
                                        //     </th>
                                        //     :
                                        <th key={key} className={`animate-zoomIn ${key == 'level' || key === 'formulation' || key == 'year' || key == 'month' ? 'text-center' : (key === 'materialCost' || key === 'amount' || key === 'quantity' || key === 'factoryOverhead' || key === 'directLabor') ? 'text-right' : 'text-left'} 
                                                        whitespace-nowrap font-medium text-[20px] py-2 px-6 border-b border-gray-300 dark:border-[#5C5C5C]`}>
                                            {formatHeader(key)}
                                        </th>
                                    );
                                })}
                        </tr>
                    </thead>
                    <tbody>
                        {isEdit
                            ?
                            tableData.map((row, rowIndex) => (
                                <tr key={rowIndex} className="animate-pull-down">
                                    <td className="text-center border-t border-b border-gray-300 dark:bg-[#3C3C3C] dark:border-[#5C5C5C]">
                                        <IoTrash className="ml-[5px] text-[#717171] dark:text-[#d1d1d1] text-[25px] cursor-pointer hover:text-red-700 dark:hover:text-red-500 transition-colors duration-250 ease-in-out"
                                            onClick={() => {
                                                console.log(row);
                                                if (removedIds) {
                                                    removeRow(rowIndex)
                                                } else if (removedBomIds) {
                                                    removeBomRow(rowIndex, row.rowType)
                                                }
                                            }} />
                                    </td>
                                    {Object.entries(row) && Object?.entries(row)
                                        .filter(([key]) =>
                                            !key.toLowerCase().includes('id') &&
                                            !key.toLowerCase().includes('rowtype') &&
                                            !key.toLowerCase().includes('track_id')
                                        )
                                        .map(([key, value], colIndex) => {
                                            let textAlignClass = 'text-left';
                                            if (typeof value === 'number') textAlignClass = 'text-right';
                                            if (key === 'factoryOverhead' || key === 'directLabor' || key === 'materialCost' || key === 'batchQty' || key === 'quantity' || key === 'amount') textAlignClass = 'text-right';
                                            if (key == 'level' || key == 'formulation' || key == 'year' || key == 'month') textAlignClass = 'text-center';
                                            // const isReadOnly =
                                            //     value === null ||
                                            //     (typeof value === 'string' && value.trim() === '');

                                            const isReadOnly = value === null;
                                            let displayValue = '';

                                            if (isReadOnly) {
                                                displayValue = '';
                                            } else if (key === 'level' || key === 'formulation' || key === 'year' || key === 'month') {
                                                displayValue = Number(value).toFixed(0); // Display as integer without decimals
                                            } else if (key === 'entryNumber' || key === 'glAccount' || key === 'journal') {
                                                displayValue = String(Number(value).toFixed(0)); // Explicitly treat as string
                                            } else if (typeof value === 'number') {
                                                displayValue = Number(value).toFixed(2); // Display as number with 2 decimal places for all other numeric fields
                                            } else {
                                                displayValue = String(value); // Default to string conversion
                                            }

                                            return (
                                                <td
                                                    key={key}
                                                    className={`
                                            py-2 px-6 
                                            border-t border-b border-gray-300 dark:bg-[#3C3C3C] dark:border-[#5C5C5C]
                                            ${colIndex === 0 ? 'border-l-0' : ''}
                                            ${colIndex === Object.keys(row).length - 1 ? 'border-r-0' : ''}
                                          `}
                                                >
                                                    <input
                                                        type="text"
                                                        onChange={(e) => handleInputChange(rowIndex, key, e.target.value)}
                                                        value={displayValue}
                                                        readOnly={isReadOnly}
                                                        className={`${isTransaction ? 'w-auto' : 'w-full'} ${textAlignClass} animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] dark:border-[#5C5C5C] bg-[#F9F9F9] dark:bg-[#3C3C3C] text-[20px] text-[#090909] dark:text-[#d1d1d1] px-[5px]`}
                                                    />
                                                </td>
                                            );
                                        })}
                                </tr>
                            ))
                            :
                            tableData.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border border-gray-300 dark:bg-[#3C3C3C] dark:border-[#5C5C5C] dark:text-[#d1d1d1] w-full">
                                    {Object.entries(row) && Object.entries(row)
                                        .filter(([key]) =>
                                            !key.toLowerCase().includes('id') &&
                                            !key.toLowerCase().includes('rowtype') &&
                                            !key.toLowerCase().includes('track_id')
                                        )
                                        .map(([key, value], colIndex) => {
                                            let textAlignClass = 'text-left';
                                            if (typeof value === 'number') textAlignClass = 'text-right';
                                            if (key === 'factoryOverhead' || key === 'directLabor' || key === 'materialCost' || key === 'batchQty' || key === 'quantity' || key === 'amount') textAlignClass = 'text-right';
                                            if (key == 'level' || key == 'formulation' || key == 'year' || key == 'month') textAlignClass = 'text-center';
                                            return (
                                                <td
                                                    key={key}
                                                    className={`
                                            py-2 px-6 
                                            text-[20px] 
                                            ${textAlignClass} 
                                            border-l border-r border-gray-300 dark:border-[#5C5C5C]
                                            ${colIndex === 0 ? 'border-l-0' : ''}
                                            ${colIndex === Object.keys(row).length - 1 ? 'border-r-0' : ''}
                                            whitespace-nowrap
                                        `}
                                                >
                                                    <span className='w-auto'>
                                                        {
                                                            key == 'level' || key == 'formulation' || key == 'year' || key == 'month'
                                                                ?
                                                                value == null ? '' : String(value)
                                                                :
                                                                renderValue(value)
                                                        }
                                                    </span>
                                                </td>
                                            );
                                        })}
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    );
}

function renderValue(value: unknown): React.ReactNode {
    if (typeof value === 'string' || typeof value === 'boolean') {
        return String(value);
    }

    if (typeof value === 'number') {
        return value.toFixed(2);
    }

    if (value === null || value === undefined) {
        return '';
    }

    if (React.isValidElement(value)) {
        return value;
    }
    return JSON.stringify(value);
}

export default WorkspaceTable