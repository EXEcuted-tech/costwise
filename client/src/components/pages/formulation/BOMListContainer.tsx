import React, { useState } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { formatHeader } from '@/utils/costwiseUtils';
import { useFormulationContext } from '@/context/FormulationContext';
import { CompareFormulaProps } from './CompareFormulaContainer';
import { FiArchive } from 'react-icons/fi';

const BOMListContainer = () => {
  const router = useRouter();
  const { setViewBOM } = useFormulationContext();
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
            setViewBOM(false);
          }} />
        <h1 className='font-bold text-[28px] text-primary'>
          Bill of Materials
        </h1>
      </div>
      <hr className='border-[#ACACAC]' />
      <div className='flex items-center pt-[15px]'>
        <FiArchive className='text-[28px] mr-[5px]'/>
        <p className='text-black text-[25px] font-black underline underline-offset-4 mr-[5px]'>BOM ITEM 1 </p>
        <p className='text-[25px] text-[#8F8F8F] font-semibold italic'>(HOTDOG 1k)</p>
      </div>
      <div className='flex w-full items-center pt-[10px]'>
        <p className='w-full text-[#8F8F8F] text-[18px]'>
          The following formulas are being compared:
        </p>
      </div>
      <div className='flex flex-wrap items-center w-full'>
        {data.map((info, index) =>
          <p className='italic font-semibold text-[18px]'>{info.description} ({info.number}){index != data.length - 1 && ',\u00A0'}</p>
        )}
      </div>
      <div className='rounded-[5px] border border-[#656565] overflow-x-auto mt-[10px]'>
        <table className='table-auto w-full border-collapse'>
          <thead>
            <tr>
              {data && Object.keys(data[0]).map((key) =>
                (key != 'formulations') &&
                <th className={`text-center animate-zoomIn whitespace-nowrap font-bold text-[20px] text-[#6B6B6B] py-2 px-6`}>
                  {formatHeader(key)}{key == 'batchQty' && '.'}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data && data.map((info, index) =>
              <>
                <tr className={`${info.productCost === maxProductCost ? 'text-[#930101]' : 'text-black'} animate-zoomIn text-center font-bold text-[18px] border-y border-[#ACACAC]`}>
                  <td className='py-[10px] relative'>
                    {info.productCost === maxProductCost &&
                      <>
                        <div className="absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-[#D9D9D9]"></div>
                        <div className="absolute font-light text-black top-[50px] left-0 right-0 mx-auto w-max bg-[#D9D9D9] rounded-full px-4 py-2 shadow-lg z-10">
                          Least-Cost Formula
                        </div>
                      </>
                    }
                    {info.number}
                  </td>
                  <td></td>
                  <td>{info.itemCode}</td>
                  <td>{info.description}</td>
                  <td>{info.batchQty}</td>
                  <td>{info.unit}</td>
                  <td>{info.materialCost}</td>
                  <td>{info.productCost}</td>
                </tr>

                {info.formulations?.map((formulation, index) => (
                  <tr key={index} className={`${index % 2 == 1 && 'bg-[#FCF7F7]'} animate-zoomIn text-center font-medium text-[#6B6B6B] text-[18px]`}>
                    <td></td>
                    <td className='py-[10px]'>{formulation.level}</td>
                    <td>{formulation.itemCode}</td>
                    <td>{formulation.description}</td>
                    <td>{formulation.batchQty}</td>
                    <td>{formulation.unit}</td>
                    <td>{formulation.materialCost}</td>
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

export default BOMListContainer