import React, { useEffect, useState } from 'react'
import FileLabel from './FileLabel'
import { FileTableProps } from '../FileContainer'
import { FaPencilAlt } from "react-icons/fa";
import { TbProgress } from "react-icons/tb";
import WorkspaceTable from './WorkspaceTable';

const MasterFileContainer = (data: FileTableProps) => {
  const [isEditA,setIsEditA] = useState(false);
  const [isEditB,setIsEditB] = useState(false);

  useEffect (()=>{
    if(localStorage.getItem("edit") === "true"){
      setIsEditA(true);
    }
  },[])

  return (
    <div className='w-full bg-white rounded-[10px] drop-shadow mb-[35px]'>
      <FileLabel {...data} />
      <div className='overflow-auto'>
        {/* Summary of Product Costing */}
        <div className='flex items-center border-y-1 border-[#868686] bg-[#F3F3F3] py-[15px] px-[20px]'>
          <h1 className='font-bold text-[20px] text-[#5C5C5C] mr-[10px]'>SUMMARY OF PRODUCT COSTING</h1>
          { isEditA ?
            <TbProgress className='text-[24px] text-[#5C5C5C] animate-spin'/>
          :
            <FaPencilAlt className='text-[20px] text-[#5C5C5C] hover:animate-shake-tilt hover:brightness-75 cursor-pointer'
            onClick={()=>{setIsEditA(true)}}/>
          }
        </div>
        <div className={`${isEditA ? 'pb-[30px] pt-[15px]': 'py-[30px]'} px-[40px]`}>
          <WorkspaceTable data={dummyData} isEdit={isEditA} setIsEdit={setIsEditA} isTransaction={false}/>
        </div>

        {/* FODL Costing */}
        <div className='flex items-center border-y-1 border-[#868686] bg-[#F3F3F3] py-[15px] px-[20px]'>
          <h1 className='font-bold text-[20px] text-[#5C5C5C] mr-[10px]'>FODL COSTING</h1>
          { isEditB ?
            <TbProgress className='text-[24px] text-[#5C5C5C] animate-spin'/>
          :
            <FaPencilAlt className='text-[20px] text-[#5C5C5C] hover:animate-shake-tilt hover:brightness-75 cursor-pointer'
            onClick={()=>{setIsEditB(true)}}/>
          }
        </div>
        <div className={`${isEditA ? 'pb-[30px] pt-[15px]': 'py-[30px]'} px-[40px]`}>
          <WorkspaceTable data={fodlData} isEdit={isEditB} setIsEdit={setIsEditB} isTransaction={false}/>
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
    factoryOverhead: 11.00,
    directLabor: 4.00,
    total: 71.93,
  },
  {
    itemCode: 'FG-02',
    itemDescription: 'BEEF LOAF 100g',
    rmCost: 8.64,
    factoryOverhead: 11.00,
    directLabor: 4.00,
    total: 71.93,
  },
];

const fodlData = [
  {
    itemCode: 'FG-01',
    itemDescription: 'HOTDOG 1k',
    factoryOverhead: 11.00,
    directLabor: 4.00,
  },
  {
    itemCode: 'FG-02',
    itemDescription: 'BEEF LOAF 100g',
    factoryOverhead: 11.00,
    directLabor: 4.00,
  },
];