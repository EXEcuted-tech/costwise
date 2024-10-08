import React, { useEffect, useState } from 'react'
import FileLabel from './FileLabel'
import { FileTableProps } from '../FileContainer'
import WorkspaceTable from './WorkspaceTable'
import { FaPencilAlt } from 'react-icons/fa'
import { TbProgress } from 'react-icons/tb'

const TransactionFileContainer = (data: FileTableProps) => {
  const [isEdit,setIsEdit] = useState(false);

  useEffect (()=>{
    if(localStorage.getItem("edit") === "true"){
      setIsEdit(true);
    }
  },[])
  
  return (
    <div className='bg-white rounded-[10px] drop-shadow mb-[35px] overflow-hidden'>
      <FileLabel {...data} />
      <div className=''>
        {/* Summary of Product Costing */}
        <div className='flex items-center border-y-1 border-[#868686] bg-[#F3F3F3] py-[15px] px-[20px]'>
          <h1 className='font-bold text-[20px] text-[#5C5C5C] mr-[10px]'>PRODUCTION TRANSACTIONS</h1>
          { isEdit ?
            <TbProgress className='text-[24px] text-[#5C5C5C] animate-spin'/>
          :
            <FaPencilAlt className='text-[20px] text-[#5C5C5C] hover:animate-shake-tilt hover:brightness-75 cursor-pointer'
            onClick={()=>{setIsEdit(true)}}/>
          }
        </div>
        <div className='p-[20px] overflow-x-auto'>
          <WorkspaceTable data={dummyData} isEdit={isEdit} setIsEdit={setIsEdit} isTransaction={true}/>
        </div>
      </div>
    </div>
  )
}


export default TransactionFileContainer;


const dummyData = [
  {
    year: '2024',
    month: '1',
    date: '1/3/2024 12:00:00 AM',
    journal: '540',
    entryNumber: '29400364',
    description: 'HOTDOG',
    amount: 100,
    status: 'Completed',
    department: 'Sales',
    region: 'North',
    manager: 'John Doe',
    currency: 'USD',
    transactionType: 'Credit',
    comments: 'N/A',
  },
  {
    year: '2024',
    month: '1',
    date: '1/4/2024 12:00:00 AM',
    journal: '541',
    entryNumber: '29400365',
    description: 'BEEF LOAF',
    amount: 200,
    status: 'Pending',
    department: 'Marketing',
    region: 'South',
    manager: 'Jane Doe',
    currency: 'EUR',
    transactionType: 'Debit',
    comments: 'Urgent',
  },
  {
    year: '2024',
    month: '2',
    date: '2/5/2024 12:00:00 AM',
    journal: '542',
    entryNumber: '29400366',
    description: 'CHICKEN SAUSAGE',
    amount: 150,
    status: 'Completed',
    department: 'Finance',
    region: 'East',
    manager: 'John Smith',
    currency: 'GBP',
    transactionType: 'Credit',
    comments: 'Follow up',
  },
  {
    year: '2024',
    month: '3',
    date: '3/6/2024 12:00:00 AM',
    journal: '543',
    entryNumber: '29400367',
    description: 'VEGGIE BURGER',
    amount: 180,
    status: 'Completed',
    department: 'R&D',
    region: 'West',
    manager: 'Jane Smith',
    currency: 'JPY',
    transactionType: 'Debit',
    comments: 'Reviewed',
  },
];
