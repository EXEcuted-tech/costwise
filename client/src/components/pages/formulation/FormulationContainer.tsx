import React, { useEffect, useState } from 'react'
import PrimaryPagination from '@/components/pagination/PrimaryPagination';
import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { IoTrash } from "react-icons/io5";
import { TiExport } from "react-icons/ti";
import { useRouter } from 'next/navigation';
import FormulationTable from './FormulationTable';
import { useFormulationContext } from '@/context/FormulationContext';
import CompareFormulaContainer from './CompareFormulaContainer';
import BOMListContainer from './BOMListContainer';

export interface FormulationContainerProps {
    number: string;
    itemCode: string;
    description: string;
    batchQty: number;
    level: number;
    unit: string;
    cost: number;
    formulations: {
        level: number;
        itemCode: string;
        description: string;
        batchQty: number;
        unit: string;
    }[];
}

export interface FormulationProps {
    setView: React.Dispatch<React.SetStateAction<boolean>>;
    view: boolean;
}

const FormulationContainer: React.FC<FormulationProps> = ({ setView, view }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { edit, setEdit, viewFormulas, viewBOM } = useFormulationContext();

    const handlePageChange = (e: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const indexOfLastItem = currentPage * 8;
    const indexOfFirstItem = indexOfLastItem - 8;
    const currentListPage = fakeFormulaData.slice(indexOfFirstItem, indexOfLastItem);
    const router = useRouter();

    const handleView = (data: FormulationContainerProps) => {
        setEdit(false);
        setView(true);
        const encodedData = encodeURIComponent(JSON.stringify(data));
        router.push(`/formulation?data=${encodedData}`); //change to number later
    }

    const handleEdit = (data: FormulationContainerProps) => {
        setView(false);
        setEdit(true);
        const encodedData = encodeURIComponent(JSON.stringify(data));
        router.push(`/formulation?data=${encodedData}`); //change to number later
    }

    const handleExport = (data: FormulationContainerProps) => {

    }

    const handleDelete = (data: FormulationContainerProps) => {

    }


    return (
        <>
            {(view || edit) ? <FormulationTable view={view} setView={setView} /> :
                viewFormulas ? <CompareFormulaContainer /> :
                    viewBOM ? <BOMListContainer /> :
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
            }
        </>
    )
}

export default FormulationContainer

const fakeFormulaData: FormulationContainerProps[] = [
    {
        number: '34-222-V',
        level: 0,
        itemCode: 'FG-01',
        description: 'HOTDOG1K',
        batchQty: 3164.00,
        unit: 'packs',
        cost: 60.39,
        formulations: [
            { level: 1, itemCode: '', description: 'Emulsion', batchQty: 3164.00, unit: 'kg' },
            { level: 2, itemCode: 'FG-01-A', description: 'Spices Blend', batchQty: 500.00, unit: 'kg' },
            { level: 3, itemCode: 'FG-01-B', description: 'Meat Mix', batchQty: 1500.00, unit: 'kg' }
        ]
    },
    {
        number: '34-223-V',
        level: 0,
        itemCode: 'FG-01',
        description: 'HOTDOG1K',
        batchQty: 3164.00,
        unit: 'kg',
        cost: 59.61,
        formulations: [
            { level: 1, itemCode: 'FG-01', description: 'HOTDOG1K', batchQty: 3164.00, unit: 'kg' },
            { level: 2, itemCode: 'FG-01-C', description: 'Casing Material', batchQty: 200.00, unit: 'kg' },
            { level: 3, itemCode: 'FG-01-D', description: 'Preservatives', batchQty: 100.00, unit: 'kg' }
        ]
    },
    {
        number: '34-224-V',
        level: 0,
        itemCode: 'FG-01',
        description: 'HOTDOG1K',
        batchQty: 3164.00,
        unit: 'kg',
        cost: 56.93,
        formulations: [
            { level: 1, itemCode: 'FG-01', description: 'HOTDOG1K', batchQty: 3164.00, unit: 'kg' },
            { level: 2, itemCode: 'FG-01-E', description: 'Flavor Enhancer', batchQty: 300.00, unit: 'kg' },
            { level: 3, itemCode: 'FG-01-F', description: 'Coloring Agent', batchQty: 50.00, unit: 'kg' }
        ]
    },
    {
        number: '35-111-V',
        level: 0,
        itemCode: 'FG-02',
        description: 'BEEF LOAF 100g',
        batchQty: 12307.00,
        unit: 'tin',
        cost: 8.89,
        formulations: [
            { level: 1, itemCode: 'FG-02', description: 'BEEF LOAF 100g', batchQty: 12307.00, unit: 'tin' },
            { level: 2, itemCode: 'FG-02-A', description: 'Seasoning Mix', batchQty: 700.00, unit: 'kg' },
            { level: 3, itemCode: 'FG-02-B', description: 'Binding Agent', batchQty: 400.00, unit: 'kg' }
        ]
    },
    {
        number: '35-112-V',
        level: 0,
        itemCode: 'FG-02',
        description: 'BEEF LOAF 100g',
        batchQty: 12307.00,
        unit: 'tin',
        cost: 8.64,
        formulations: [
            { level: 1, itemCode: 'FG-02', description: 'BEEF LOAF 100g', batchQty: 12307.00, unit: 'tin' },
            { level: 2, itemCode: 'FG-02-C', description: 'Meat Emulsion', batchQty: 600.00, unit: 'kg' },
            { level: 3, itemCode: 'FG-02-D', description: 'Flavor Enhancer', batchQty: 200.00, unit: 'kg' }
        ]
    },
    {
        number: '35-113-V',
        level: 0,
        itemCode: 'FG-02',
        description: 'BEEF LOAF 100g',
        batchQty: 12307.00,
        unit: 'tin',
        cost: 8.75,
        formulations: [
            { level: 1, itemCode: 'FG-02', description: 'BEEF LOAF 100g', batchQty: 12307.00, unit: 'tin' },
            { level: 2, itemCode: 'FG-02-E', description: 'Spice Blend', batchQty: 500.00, unit: 'kg' },
            { level: 3, itemCode: 'FG-02-F', description: 'Preservative Mix', batchQty: 300.00, unit: 'kg' }
        ]
    }
];
