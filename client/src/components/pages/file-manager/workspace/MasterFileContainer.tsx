import React from 'react'
import FileLabel from './FileLabel'
import { FileTableProps } from '../FileContainer'
import { FaPencilAlt } from "react-icons/fa";
import WorkspaceTable from './WorkspaceTable';

const MasterFileContainer = (data: FileTableProps) => {

  return (
    <div className='w-full bg-white rounded-[10px] drop-shadow mb-[35px]'>
      <FileLabel {...data} />
      <div className='overflow-auto'>
        {/* Summary of Product Costing */}
        <div className='flex items-center border-y-1 border-[#868686] bg-[#F3F3F3] py-[15px] px-[20px]'>
          <h1 className='font-bold text-[20px] text-[#5C5C5C] mr-[10px]'>SUMMARY OF PRODUCT COSTING</h1>
          <FaPencilAlt className='text-[20px] text-[#5C5C5C] hover:animate-shake-tilt hover:brightness-75 cursor-pointer'/>
        </div>
        <div className='px-[40px] py-[30px]'>
          <WorkspaceTable data={dummyData} />
        </div>

        {/* FODL Costing */}
        <div className='flex items-center border-y-1 border-[#868686] bg-[#F3F3F3] py-[15px] px-[20px]'>
          <h1 className='font-bold text-[20px] text-[#5C5C5C] mr-[10px]'>FODL COSTING</h1>
          <FaPencilAlt className='text-[20px] text-[#5C5C5C] hover:animate-shake-tilt hover:brightness-75 cursor-pointer'/>
        </div>
        <div className='px-[40px] py-[30px]'>
          <WorkspaceTable data={fodlData} />
        </div>
      </div>
    </div>
  )
}

export default MasterFileContainer;

const dummyData = [
  {
    itemCode: 'FG-01',
    itemDescription: 'HOTDOG 1k',
    rmCost: 56.93,
    factoryOverhead: 11.0,
    directLabor: 4.0,
    total: 71.93,
  },
  {
    itemCode: 'FG-02',
    itemDescription: 'BEEF LOAF 100g',
    rmCost: 8.64,
    factoryOverhead: 11.0,
    directLabor: 4.0,
    total: 71.93,
  },
];

const fodlData = [
  {
    itemCode: 'FG-01',
    itemDescription: 'HOTDOG 1k',
    factoryOverhead: 11.0,
    directLabor: 4.0,
  },
  {
    itemCode: 'FG-02',
    itemDescription: 'BEEF LOAF 100g',
    factoryOverhead: 11.0,
    directLabor: 4.0,
  },
];