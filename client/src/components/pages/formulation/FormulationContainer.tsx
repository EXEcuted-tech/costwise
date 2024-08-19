import React, { useEffect, useState } from 'react'
import PrimaryPagination from '@/components/pagination/PrimaryPagination';
import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { IoTrash } from "react-icons/io5";
import { TiExport } from "react-icons/ti";
import { useRouter } from 'next/navigation';

export interface FormulationContainerProps {
    number: number;
    itemCode: string;
    description: string;
    batchQty: number;
    unit: string;
    cost: number;
}

const FormulationContainer = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const handlePageChange = (e: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const indexOfLastItem = currentPage * 8;
    const indexOfFirstItem = indexOfLastItem - 8;
    const currentListPage = fakeFormulaData.slice(indexOfFirstItem, indexOfLastItem);
    const router = useRouter();

    const handleView = (data: FormulationContainerProps) => {
        const encodedData = encodeURIComponent(JSON.stringify(data));
        router.push(`/file-manager/workspace?data=${encodedData}`); //change to number later
    }

    const handleEdit = (data: FormulationContainerProps) => {
        const encodedData = encodeURIComponent(JSON.stringify(data));
        localStorage.setItem("edit", "true");
        router.push(`/file-manager/workspace?data=${encodedData}`); //change to number later
    }

    const handleExport = (data: FormulationContainerProps) => {

    }

    const handleDelete = (data: FormulationContainerProps) => {

    }


    return (
        <div className='w-full font-lato bg-white mt-[20px] px-[20px] rounded-lg drop-shadow-lg'>
            <table className='w-full '>
                <thead className='border-b border-b-[#c4c4c4]'>
                    <tr className='text-[#777777] font-bold text-[18px]'>
                        <th className='py-[10px]'>NO.</th>
                        <th>ITEM CODE</th>
                        <th>DESCRIPTION</th>
                        <th>BATCH QTY</th>
                        <th>UNIT</th>
                        <th>COST</th>
                        <th>MANAGE</th>
                    </tr>
                </thead>
                <tbody>
                    {currentListPage.length > 0
                        ? (currentListPage.map((data, index) => (
                            <tr key={index} className={`${index % 2 == 1 && 'bg-[#FCF7F7]'} text-center`}>
                                <td className='py-[15px]'>{data.number}</td>
                                <td>{data.itemCode}</td>
                                <td>{data.description}</td>
                                <td>{data.batchQty}</td>
                                <td>{data.unit}</td>
                                <td>{data.cost}</td>
                                <td>
                                    <div className='h-[30px] grid grid-cols-4 border-1 border-[#868686] rounded-[5px]'>
                                        <div className='flex justify-center items-center border-r-1 border-[#868686] h-full
                                                cursor-pointer hover:bg-[#f7f7f7] hover:rounded-l-[5px]'
                                            onClick={() => handleView(data)}>
                                            <FaEye />
                                        </div>
                                        <div className='flex justify-center items-center border-r-1 border-[#868686] h-full
                                        cursor-pointer hover:bg-[#f7f7f7]'
                                            onClick={() => handleEdit(data)}>
                                            <FaPencilAlt />
                                        </div>
                                        <div className='flex justify-center items-center border-r-1 border-[#868686] h-full
                                        cursor-pointer hover:bg-[#f7f7f7]'
                                            onClick={() => handleExport(data)}>
                                            <TiExport />
                                        </div>
                                        <div className='flex justify-center items-center h-full
                                        cursor-pointer hover:bg-primary hover:text-white hover:rounded-r-[4px]'
                                            onClick={() => handleDelete(data)}>
                                            <IoTrash />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )))
                        : (
                            <p>No File.</p>
                        )}
                </tbody>
            </table>
            <div className='relative py-[1%]'>
                <PrimaryPagination
                    data={fakeFormulaData}
                    itemsPerPage={8}
                    handlePageChange={handlePageChange}
                    currentPage={currentPage}
                />
            </div>
        </div>
    )
}

export default FormulationContainer

const fakeFormulaData: FormulationContainerProps[] = [
    {
        number: 1,
        itemCode: 'FG-01',
        description: 'HOTDOG 1k',
        batchQty: 3164.00,
        unit: 'pack',
        cost: 60.39
    },
    {
        number: 2,
        itemCode: 'FG-01',
        description: 'HOTDOG 1k',
        batchQty: 3164.00,
        unit: 'pack',
        cost: 59.61
    },
    {
        number: 3,
        itemCode: 'FG-01',
        description: 'HOTDOG 1k',
        batchQty: 3164.00,
        unit: 'pack',
        cost: 56.93
    },
    {
        number: 1,
        itemCode: 'FG-02',
        description: 'BEEF LOAF 100g',
        batchQty: 12307.00,
        unit: 'tin',
        cost: 8.89
    },
    {
        number: 2,
        itemCode: 'FG-02',
        description: 'BEEF LOAF 100g',
        batchQty: 12307.00,
        unit: 'tin',
        cost: 8.64
    },
    {
        number: 3,
        itemCode: 'FG-02',
        description: 'BEEF LOAF 100g',
        batchQty: 12307.00,
        unit: 'tin',
        cost: 8.75
    },
]