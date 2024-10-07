import { RemovedId } from '@/types/data';
import { formatHeader } from '@/utils/costwiseUtils';
import React, { useEffect, useState } from 'react'
import { HiOutlinePlus } from "react-icons/hi";
import { IoIosSave } from "react-icons/io";
import { IoTrash } from "react-icons/io5";

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
    setRemovedBomIds
}) => {
    const [tableData, setTableData] = useState(data);

    useEffect(() => {
        setTableData(data);
    }, [data]);

    const handleInputChange = (rowIndex: number, key: string, value: string) => {
        const updatedData = [...tableData];

        if (key == 'level' || key == 'formulation') {
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

    // const addRow = () => {
    //     const emptyRow = Object.keys(data[0]).reduce((acc, key) => {
    //         // if (!key.toLowerCase().includes('id')) { // Exclude ID fields
    //         //     acc[key] = '';
    //         // }
    //         acc[key] = '';
    //         return acc;
    //     }, {} as Record<string, unknown>);

    //     setTableData([...tableData, emptyRow]);
    // }

    const addRow = () => {
        const nextId = tableData.length > 0
            ? Math.max(...tableData.map(row => row.id as number)) + 1
            : 1;

        const emptyRow = Object.keys(tableData[0] || {}).reduce<Record<string, any>>((acc, key) => {
            acc[key] = key === 'id' ? nextId : '';
            return acc;
        }, {});

        setTableData([...tableData, emptyRow]);
    };
    // different addRow for BOM

    const removeRow = (index: number) => {
        const rowToRemove = tableData[index];
        const id = rowToRemove['id'];

        const confirmDeletion = window.confirm('Are you sure you want to delete this record?'); // Change this to modal!
        if (!confirmDeletion) return;

        setTableData(prevData => prevData.filter((_, i) => i !== index));

        if (removedIds && setRemovedIds) {
            if (id && typeof id === 'number' && !removedIds.includes(id)) {
                setRemovedIds(prevIds => [...prevIds, id]);
            }
        }
    };

    // const removeBomRow = (index: number, rowType: string) => {
    //     const rowToRemove = tableData[index];
    //     const id = rowToRemove?.id;

    //     if (id === undefined || typeof id !== 'number') {
    //         return;
    //     }

    //     const confirmDeletion = window.confirm(
    //         'Are you sure you want to delete this record?' // Change to modal
    //     );
    //     if (!confirmDeletion) return;

    //     setTableData(prevData => prevData.filter((_, i) => i !== index));

    //     const isAlreadyRemoved = removedBomIds?.some(
    //         removed => removed.id === id && removed.rowType === rowType
    //     );

    //     if (setRemovedBomIds && !isAlreadyRemoved) {
    //         setRemovedBomIds(prevIds => [...prevIds, { id, rowType }]);
    //     }
    // };

    const removeBomRow = (index: number, rowType: string) => {
        if(rowType == 'endIdentifier'){
            alert("That's a row identifier!");
            return;
        }
        const rowToRemove = tableData[index];
        const id = rowToRemove?.id;

        if (id === undefined || typeof id !== 'number') {
            return;
        }

        const confirmDeletion = window.confirm(
            'Are you sure you want to delete this record?' // Replace with modal please
        );
        if (!confirmDeletion) return;

        let indicesToRemove: number[] = [index];

        // If the rowType is 'finishedGood', identify subsequent rows to remove
        if (rowType === 'finishedGood') {
            // Iterate through the tableData starting from the next index
            for (let i = index + 1; i < tableData.length; i++) {
                const currentRow = tableData[i];
                if (currentRow.rowType === 'finishedGood') {
                    // Stop if the next 'finishedGood' is encountered
                    break;
                }
                indicesToRemove.push(i);
            }
        }

        // Sort indices in descending order to avoid index shifting issues when removing
        indicesToRemove.sort((a, b) => b - a);

        // Collect the IDs and rowTypes of rows to be removed
        const rowsToRemove = indicesToRemove.map(i => tableData[i]);

        // Remove the identified rows from tableData
        setTableData(prevData =>
            prevData.filter((_, i) => !indicesToRemove.includes(i))
        );

        // Update removedBomIds with the removed rows
        if (setRemovedBomIds) {
            setRemovedBomIds(prevIds => {
                const newRemoved = rowsToRemove.filter(
                    removed =>
                        !prevIds.some(
                            existing =>
                                existing.id === removed.id &&
                                existing.rowType === removed.rowType &&
                                existing.track_id === removed.track_id
                        )
                ).map(removed => ({ id: removed.id, rowType: removed.rowType, track_id: removed.track_id }));

                return [...prevIds, ...newRemoved];
            });
        }
    };

    return (
        <div className="overflow-x-auto">
            {isEdit &&
                <div className={`h-[40px] animate-zoomIn fixed flex items-center ${isTransaction ? 'left-[20px]' : 'left-[40px]'}`}>
                    <div className='flex justify-end my-[10px] mr-[10px]'>
                        <button className='hover:bg-[#961e1e] h-[35px] flex items-center justify-center font-medium text-[18px] text-white rounded-[10px] px-[15px] w-[135px] bg-primary transition-colors delay-50 duration-[1000] ease-in'
                            onClick={addRow}>
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
                <thead className='bg-primary text-white'>
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
                                } else if (key === 'materialCost' || key === 'amount') {
                                    textAlignClass = 'text-right';
                                }

                                return (
                                    isEdit
                                        ?
                                        <th key={key} className={`animate-zoomIn ${key == 'level' || key === 'formulation' ? 'text-center' : (key === 'materialCost' || key === 'amount' || key === 'rmCost' || key === 'factoryOverhead' || key === 'directLabor') ? 'text-right' : 'text-left'} 
                                                        whitespace-nowrap font-medium text-[20px] py-2 px-6 border-b border-gray-300`}>
                                            {formatHeader(key, ['rm', 'total'])}
                                        </th>
                                        :
                                        <th key={key} className={`animate-zoomIn ${key == 'level' || key === 'formulation' ? 'text-center' : (key === 'materialCost' || key === 'amount' || key === 'rmCost' || key === 'factoryOverhead' || key === 'directLabor') ? 'text-right' : 'text-left'} 
                                                        whitespace-nowrap font-medium text-[20px] py-2 px-6 border-b border-gray-300`}>
                                            {formatHeader(key, ['rm', 'total'])}
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
                                <td className="text-center border-t border-b border-gray-300">
                                    <IoTrash className="ml-[5px] text-[#717171] text-[25px] cursor-pointer hover:text-red-700 transition-colors duration-250 ease-in-out"
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
                                        if (key === 'factoryOverhead' || key === 'directLabor' || key === 'materialCost' || key === 'batchQty') textAlignClass = 'text-right';
                                        if (key == 'level' || key == 'formulation') textAlignClass = 'text-center';
                                        // const isReadOnly =
                                        //     value === null ||
                                        //     (typeof value === 'string' && value.trim() === '');

                                        const isReadOnly = value === null;
                                        const displayValue = isReadOnly
                                            ? ''
                                            : key == 'level' || key == 'formulation'
                                                ? Number(value).toFixed(0)
                                                : typeof value === 'number'
                                                    ? Number(value).toFixed(2)
                                                    : String(value);

                                        return (
                                            <td
                                                key={key}
                                                className={`
                                            py-2 px-6 
                                            border-t border-b border-gray-300
                                            ${colIndex === 0 ? 'border-l-0' : ''}
                                            ${colIndex === Object.keys(row).length - 1 ? 'border-r-0' : ''}
                                          `}
                                            >
                                                <input
                                                    type="text"
                                                    onChange={(e) => handleInputChange(rowIndex, key, e.target.value)}
                                                    value={displayValue}
                                                    readOnly={isReadOnly}
                                                    className={`${isTransaction ? 'w-auto' : 'w-full'} ${textAlignClass} animate-zoomIn transition-all duration-400 ease-in-out border border-[#D9D9D9] bg-[#F9F9F9] text-[20px] text-[#090909] px-[5px]`}
                                                />
                                            </td>
                                        );
                                    })}
                            </tr>
                        ))
                        :
                        tableData.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border border-gray-300 w-full">
                                {Object.entries(row) && Object.entries(row)
                                    .filter(([key]) =>
                                        !key.toLowerCase().includes('id') &&
                                        !key.toLowerCase().includes('rowtype') &&
                                        !key.toLowerCase().includes('track_id')
                                    )
                                    .map(([key, value], colIndex) => {
                                        let textAlignClass = 'text-left';
                                        if (typeof value === 'number') textAlignClass = 'text-right';
                                        if (key === 'factoryOverhead' || key === 'directLabor' || key === 'materialCost' || key === 'batchQty') textAlignClass = 'text-right';
                                        if (key == 'level' || key == 'formulation') textAlignClass = 'text-center';
                                        return (
                                            <td
                                                key={key}
                                                className={`
                                            py-2 px-6 
                                            text-[20px] 
                                            ${textAlignClass} 
                                            border-l border-r border-gray-300
                                            ${colIndex === 0 ? 'border-l-0' : ''}
                                            ${colIndex === Object.keys(row).length - 1 ? 'border-r-0' : ''}
                                            whitespace-nowrap
                                        `}
                                            >
                                                <span className='w-auto'>
                                                    {
                                                        key == 'level' || key == 'formulation'
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