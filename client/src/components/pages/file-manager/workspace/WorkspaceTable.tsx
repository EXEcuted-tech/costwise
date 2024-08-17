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

    const formatHeader = (key: string): string => {
        const knownAcronyms = ['rm', 'total'];

        const words = key.split(/(?=[A-Z])|\s|_/).filter(word => word.length > 0);

        const formattedWords = words.map(word => {
            const lowerWord = word.toLowerCase();

            if (knownAcronyms.includes(lowerWord)) {
                return lowerWord.toUpperCase();
            }

            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });

        return formattedWords.join(' ').trim();
    };


    const handleInputChange = (rowIndex: number, key: string, value: string) => {
        const updatedData = tableData.map((row, i) => {
            if (i === rowIndex) {
                const isNumber = typeof row[key] === 'number';
                return { ...row, [key]: isNumber ? parseFloat(value) : value };
            }
            return row;
        });
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
                        <button className='hover:bg-[#961e1e] h-[35px] flex items-center justify-center font-medium text-[18px] text-white rounded-[10px] px-[15px] w-[135px] bg-primary'
                            onClick={addRow}>
                            <HiOutlinePlus className='mr-[5px]' />
                            Add Row
                        </button>
                    </div>
                    <div className='flex justify-end'>
                        <button className='hover:bg-[#00780c] h-[35px] flex items-center justify-center font-medium text-[18px] text-white rounded-[10px] px-[15px] w-[135px] bg-[#00930F]'
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
                            } else if (key === 'itemCode' || key === 'total') {
                                textAlignClass =  'text-center';
                            } else if (key === 'amount') {
                                textAlignClass = 'text-right';
                            }

                            return(
                            isEdit
                                ?
                                <th key={key} className={`animate-zoomIn ${key == 'itemCode' || key == 'total' ? 'text-center' : (key === 'amount' || key === 'rmCost' || key === 'factoryOverhead' || key === 'directLabor') ? 'text-right' : 'text-left'} 
                                                        whitespace-nowrap font-medium text-[20px] py-2 px-6 border-b border-gray-300`}>
                                    {formatHeader(key)}
                                </th>
                                :
                                <th key={key} className={`animate-zoomIn ${key == 'itemCode' || key == 'total' ? 'text-center' : (key === 'amount' || key === 'rmCost' || key === 'factoryOverhead' || key === 'directLabor') ? 'text-right' : 'text-left'} 
                                                        whitespace-nowrap font-medium text-[20px] py-2 px-6 border-b border-gray-300`}>
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
                            <tr key={rowIndex} className="">
                                <td className="text-center border-t border-b border-gray-300">
                                    <IoTrash className="ml-[5px] text-[#717171] text-[25px] cursor-pointer hover:text-red-700" 
                                    onClick={()=>removeRow(rowIndex)}/>
                                </td>
                                {Object.entries(row).map(([key, value], colIndex) => {
                                    let textAlignClass = 'text-left';
                                    if (typeof value === 'number') textAlignClass = 'text-right';
                                    if (key === 'itemCode' || key === 'total') textAlignClass = 'text-center';
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
                                                value={typeof value === 'number' ? value : String(value)}
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
                                    if (key === 'itemCode' || key === 'total') textAlignClass = 'text-center';
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
            {/* {isEdit && !isTransaction &&
                <div className='animate-zoomIn fixed flex flex-col right-[40px] justify-end'>
                    <div className={`flex justify-end mt-[25px] mb-[5px]`}>
                        <button className='hover:bg-[#961e1e] h-[30px] flex items-center justify-center font-medium text-[18px] text-white rounded-[10px] px-[15px] w-[135px] bg-primary'
                            onClick={addRow}>
                            <HiOutlinePlus className='mr-[5px]' />
                            Add Row
                        </button>
                    </div>
                    <div className='flex justify-end'>
                        <button className='hover:bg-[#00780c] h-[30px] flex items-center justify-center font-medium text-[18px] text-white rounded-[10px] px-[15px] w-[135px] bg-[#00930F]'
                            onClick={() => { setIsEdit(false) }}>
                            <IoIosSave className='mr-[5px]' />
                            Save
                        </button>
                    </div>
                </div>
            } */}
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