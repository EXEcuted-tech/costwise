import { formatHeader } from '@/utils/costwiseUtils';
import React, { useState } from 'react'
import { HiOutlinePlus } from "react-icons/hi";
import { IoIosSave } from "react-icons/io";
import { IoTrash } from "react-icons/io5";

interface WorkspaceTableProps {
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    data: Record<string, unknown>[]
    isTransaction: boolean;
}

const WorkspaceTable: React.FC<WorkspaceTableProps> = ({ data, isEdit, setIsEdit, isTransaction }) => {
    const [tableData, setTableData] = useState(data);

    const handleInputChange = (rowIndex: number, key: string, value: string) => {
        // const updatedData = tableData.map((row, i) => {
        //     if (i === rowIndex) {
        //         const isNumber = typeof row[key] === 'number';
        //         return { ...row, [key]: isNumber ? parseFloat(value) : value };
        //     }
        //     return row;
        // });
        const updatedData = [...tableData];

        // Check if the value is numeric (and not an empty string)
        if (!isNaN(Number(value)) && value !== '') {
          // Ensure the value is always represented with two decimal places
          const formattedValue = Number(value).toFixed(2);
        
          // Assign the formatted value as a string to preserve '11.00' format
          updatedData[rowIndex][key] = formattedValue;
        } else {
          // For non-numeric or empty values, assign as they are
          updatedData[rowIndex][key] = value;
        }
        
        setTableData(updatedData);
    };

    const addRow = () => {
        const emptyRow = Object.keys(data[0]).reduce((acc, key) => {
            acc[key] = '';
            return acc;
        }, {} as Record<string, unknown>);

        setTableData([...tableData, emptyRow]);
    }

    const removeRow = (index: number) => {
        setTableData(tableData.filter((_, i) => i !== index));
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
                            onClick={() => { setIsEdit(false) }}>
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

                        {Object.keys(data[0]).map((key) => {
                            let textAlignClass = 'text-left';
                            if (key === 'itemDescription') {
                                textAlignClass = 'text-left';
                            } else if (key === 'amount') {
                                textAlignClass = 'text-right';
                            }

                            return (
                                isEdit
                                    ?
                                    <th key={key} className={`animate-zoomIn ${key == 'itemCode' || key == 'total' ? 'text-center' : (key === 'amount' || key === 'rmCost' || key === 'factoryOverhead' || key === 'directLabor') ? 'text-right' : 'text-left'} 
                                                        whitespace-nowrap font-medium text-[20px] py-2 px-6 border-b border-gray-300`}>
                                        {formatHeader(key, ['rm', 'total'])}
                                    </th>
                                    :
                                    <th key={key} className={`animate-zoomIn ${key == 'itemCode' || key == 'total' ? 'text-center' : (key === 'amount' || key === 'rmCost' || key === 'factoryOverhead' || key === 'directLabor') ? 'text-right' : 'text-left'} 
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
                                        onClick={() => removeRow(rowIndex)} />
                                </td>
                                {Object.entries(row).map(([key, value], colIndex) => {
                                    let textAlignClass = 'text-left';
                                    if (typeof value === 'number') textAlignClass = 'text-right';
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
                                                value={typeof value === 'number' ? Number(value).toFixed(2) : String(value)}
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
                                {Object.entries(row).map(([key, value], colIndex) => {
                                    let textAlignClass = 'text-left';
                                    if (typeof value === 'number') textAlignClass = 'text-right';
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
                                            <span className='w-auto'>{renderValue(value)}</span>
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