import { Router } from 'next/router';
import React, { useState } from 'react'
import { FormulationContainerProps } from './FormulationContainer';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { formatHeader } from '@/utils/costwiseUtils';
import { useFormulationContext } from '@/contexts/FormulationContext';
import { useSidebarContext } from '@/contexts/SidebarContext';

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
    const { setViewFormulas } = useFormulationContext();
    const [data, setData] = useState<CompareFormulaProps[]>([
        {
            number: '34-222-V',
            level: 0,
            itemCode: 'FG-01',
            description: 'HOTDOG1K',
            batchQty: 3164.00,
            unit: 'packs',
            materialCost: 58961.20,
            productCost: 60.39,
            formulations: [
                { level: 1, itemCode: '', description: 'Emulsion', batchQty: 3164.00, unit: 'kg', materialCost: 58961.20 },
                { level: 2, itemCode: 'FG-01-A', description: 'Spices Blend', batchQty: 500.00, unit: 'kg', materialCost: 58961.20 },
                { level: 3, itemCode: 'FG-01-B', description: 'Meat Mix', batchQty: 1500.00, unit: 'kg', materialCost: 58961.20 }
            ]
        },
        {
            number: '34-223-V',
            level: 0,
            itemCode: 'FG-01',
            description: 'HOTDOG1K',
            batchQty: 3164.00,
            unit: 'kg',
            materialCost: 58961.20,
            productCost: 59.61,
            formulations: [
                { level: 1, itemCode: 'FG-01', description: 'HOTDOG1K', batchQty: 3164.00, unit: 'kg', materialCost: 58961.20 },
                { level: 2, itemCode: 'FG-01-C', description: 'Casing Material', batchQty: 200.00, unit: 'kg', materialCost: 58961.20 },
                { level: 3, itemCode: 'FG-01-D', description: 'Preservatives', batchQty: 100.00, unit: 'kg', materialCost: 58961.20 }
            ]
        },
        {
            number: '34-224-V',
            level: 0,
            itemCode: 'FG-01',
            description: 'HOTDOG1K',
            batchQty: 3164.00,
            unit: 'kg',
            materialCost: 58961.20,
            productCost: 56.93,
            formulations: [
                { level: 1, itemCode: 'FG-01', description: 'HOTDOG1K', batchQty: 3164.00, unit: 'kg', materialCost: 58961.20 },
                { level: 2, itemCode: 'FG-01-E', description: 'Flavor Enhancer', batchQty: 300.00, unit: 'kg', materialCost: 58961.20 },
                { level: 3, itemCode: 'FG-01-F', description: 'Coloring Agent', batchQty: 50.00, unit: 'kg', materialCost: 58961.20 }
            ]
        },
        {
            number: '34-225-V',
            level: 0,
            itemCode: 'FG-01',
            description: 'HOTDOG1K',
            batchQty: 3164.00,
            unit: 'kg',
            materialCost: 58961.20,
            productCost: 56.93,
            formulations: [
                { level: 1, itemCode: 'FG-01', description: 'HOTDOG1K', batchQty: 3164.00, unit: 'kg', materialCost: 58961.20 },
                { level: 2, itemCode: 'FG-01-E', description: 'Flavor Enhancer', batchQty: 300.00, unit: 'kg', materialCost: 58961.20 },
                { level: 3, itemCode: 'FG-01-F', description: 'Coloring Agent', batchQty: 50.00, unit: 'kg', materialCost: 58961.20 }
            ]
        },
    ])

    const maxProductCost = Math.max(...data.map(info => info.productCost));

    return (
        <div className='bg-white rounded-[10px] drop-shadow px-[30px] min-h-[820px] pb-[30px] mb-[20px]'>
            {/* header */}
            <div className='flex items-center py-[10px]'>
                <IoIosArrowRoundBack className='text-primary text-[45px] pt-[5px] mr-[5px] hover:text-[#D13131] cursor-pointer'
                    onClick={() => {
                        setViewFormulas(false);
                    }} />
                <h1 className='font-bold text-[28px] text-primary'>
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
                    {data.map((info, index) =>
                        <p key={index} className='italic font-semibold text-[18px]'>{info.description} ({info.number}){index != data.length - 1 && ',\u00A0'}</p>
                    )}
                </div>
                <div className='flex mt-[20px] 3xl:mt-0 justify-start 3xl:justify-end w-full 3xl:w-[20%] 4xl:w-[15%]'>
                    <button className={`${isOpen ? 'text-[17px]' : 'text-[19px]'} hover:brightness-95 text-white font-semibold bg-primary px-[15px] py-[5px] rounded-[5px]`}>Save to BOM List</button>
                </div>
            </div>
            <div className='rounded-[5px] border border-[#656565] overflow-x-auto mt-[10px]'>
                <table className='table-auto w-full border-collapse'>
                    <thead>
                        <tr>
                            {data && Object.keys(data[0]).map((key) => {
                                let textAlignClass = 'text-left';
                                if (key === 'level') {
                                    textAlignClass = 'text-center';
                                } else if (key === 'batchQty' || key === 'materialCost' || key === 'productCost') {
                                    textAlignClass = 'text-right';
                                }

                                return (
                                    (key != 'formulations') &&
                                    <th key={key} className={`${textAlignClass} animate-zoomIn whitespace-nowrap font-bold text-[20px] text-[#6B6B6B] py-2 px-6`}>
                                        {formatHeader(key)}{key == 'batchQty' && '.'}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.map((info, index) =>
                            <>
                                <tr className={`${info.productCost === maxProductCost ? 'bg-[#fff873]' : 'text-black'} animate-zoomIn text-center font-bold text-[18px] border-y border-[#ACACAC]`}>
                                    <td className='py-[10px] relative text-left px-6'>
                                        {info.productCost === maxProductCost &&
                                            <>
                                                <div className="absolute bottom-[-5px] left-[30%] transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-[#D9D9D9]"></div>
                                                <div className="absolute font-light text-black top-[50px] left-0 right-0 mx-auto w-max bg-[#D9D9D9] rounded-full px-4 py-2 shadow-lg z-10">
                                                    Least-Cost Formula
                                                </div>
                                            </>
                                        }
                                        {info.number}
                                    </td>
                                    <td></td>
                                    <td className='text-left px-6'>{info.itemCode}</td>
                                    <td className='text-left px-6'>{info.description}</td>
                                    <td className='text-left px-6'>{info.unit}</td>
                                    <td className='text-right px-6'>{info.batchQty}</td>
                                    <td className='text-right px-6'>{info.materialCost}</td>
                                    <td className='text-right px-6'>{info.productCost}</td>
                                </tr>

                                {info.formulations?.map((formulation, index) => (
                                    <tr key={index} className={`${index % 2 == 1 && 'bg-[#FCF7F7]'} animate-zoomIn text-center font-medium text-[#6B6B6B] text-[18px]`}>
                                        <td></td>
                                        <td className='py-[10px]'>{formulation.level}</td>
                                        <td className='text-left px-6'>{formulation.itemCode}</td>
                                        <td className='text-left px-6'>{formulation.description}</td>
                                        <td className='text-left px-6'>{formulation.unit}</td>
                                        <td className='text-right px-6'>{formulation.batchQty}</td>
                                        <td className='text-right px-6'>{formulation.materialCost}</td>
                                        <td></td>
                                    </tr>
                                ))}
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default CompareFormulaContainer