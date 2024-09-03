import React, { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai';
import { BiSolidFile } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import CustomDatePicker from '../form-controls/CustomDatePicker';
import CustomSelect from '../form-controls/CustomSelect';
import { useSidebarContext } from '@/context/SidebarContext';
import { FileTableProps } from '../pages/file-manager/FileContainer';

interface ChooseFileProps {
  dialogType: number;
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChooseFileDialog: React.FC<ChooseFileProps> = ({ dialogType, setDialog }) => {
  const { isOpen } = useSidebarContext();
  const [selectedOption, setSelectedOption] = useState('all');
  const [chosen, setChosen] = useState('');
  const [fileData, setFileData] = useState<FileTableProps[]>([]);

  useEffect(() => {
    let file = selectedOption === 'all' ? fakeFileAllData : selectedOption === 'masterfile' ? fakeFileMasterData : fakeFileTransactionData;
    if(dialogType==1){
      file = fakeFileMasterData;
    }
    setFileData(file);
  }, [selectedOption])

  return (
    <>
      <div className={`flex items-center justify-center w-full h-full top-0 left-0 fixed backdrop-brightness-50 z-[1000]`}>
        <div className='mx-[50px] 2xl:mx-0 animate-pop-out bg-white w-[1100px] h-[860px] rounded-[20px]'>
          {/* Title Section */}
          <div className='flex items-center py-[10px] px-[30px]'>
            <div className='mr-[5px]'>
              <BiSolidFile className='text-[35px] text-[#383838]' />
            </div>
            <div className='flex-grow'>
              <h1 className='text-[#383838] font-bold text-[35px]'>{dialogType == 0 ? 'File List' : 'Master File List'}</h1>
            </div>
            <div className='ml-auto'>
              <IoClose className='text-[60px] text-[#CECECE] cursor-pointer hover:text-[#b3b3b3] transition-colors duration-250 ease-in-out p-0'
                onClick={() => setDialog(false)} />
            </div>
          </div>

          {/* Filter and Settings */}
          <div className='flex items-center px-[30px] pb-[20px]'>
            <div className={`w-[50%] relative mr-[1%]`}>
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                <AiOutlineSearch className="text-[#B0B0B0] text-[22px]" />
              </div>
              <input
                type="text"
                className="w-full pl-[35px] pr-[5px] bg-white border border-[#868686] placeholder-text-[#B0B0B0] text-[#5C5C5C] text-[15px] rounded-[5px] py-[3px]"
                placeholder="Search here..."
                required
              />
            </div>

            {dialogType == 0 &&
              <div className={`w-[23%] 2xl:w-[20%] relative mr-[1%]`}>
                <CustomSelect
                  setSelectedOption={setSelectedOption}
                  selectedOption={selectedOption} />
              </div>
            }
            <div className={`w-[20%] 2xl:w-[18%] relative`}>
              <CustomDatePicker />
            </div>
          </div>

          {/* Table */}
          <div className='overflow-auto h-[645px]'>
            <table className='w-full'>
              {/* <thead className={` ${isOpen && 'text-[14px] 2xl:text-[16px]'} sticky top-0 bg-white border-[0.6px] border-y-[#868686] text-left font-bold text-[#868686]`}> */}
              <thead className={`
                ${isOpen && 'text-[14px] 2xl:text-[16px]'} 
                sticky top-0 
                bg-white 
                text-left 
                font-bold 
                text-[#868686]
                before:content-[''] 
                before:absolute 
                before:left-0 
                before:right-0 
                before:bottom-0 
                before:h-[0.6px] 
                before:bg-[#868686]
                after:content-[''] 
                after:absolute 
                after:left-0 
                after:right-0 
                after:top-0 
                after:h-[0.6px] 
                after:bg-[#868686]
              `}>
                <tr className=''>
                  <th className={`${isOpen ? 'pl-[20px] 2xl:pl-[46px]' : 'pl-[46px]'} py-[5px]`}>Title/Name</th>
                  <th className=''>File Type</th>
                  <th className=''>Date Added</th>
                  <th className=''>Added By</th>
                </tr>
              </thead>
              <tbody>
                {fileData.length > 0
                  ? (fileData.map((data, index) => (
                    <tr key={index} className={`${chosen == data.fileName && 'bg-[#DFEFFD]'} cursor-pointer hover:bg-[#DFEFFD]
                        ${index !== fileData.length - 1 && 'border-b-[0.3px] border-[#d9d9d9] '}`}
                      onClick={() => setChosen(data.fileName)}>
                      <td className={`${isOpen ? 'pl-[20px] 2xl:pl-[46px]' : 'pl-[46px]'} py-2`}>
                        <p className={`${isOpen ? 'text-[16px] 2xl:text-[18px]' : 'text-[18px]'} text-primary`}>{data.fileLabel}</p>
                        <p className={`${isOpen && 'text-[14px] 2xl:text-[16px]'}italic text-[#868686]`}>{data.fileName}</p>
                      </td>
                      <td className={`${isOpen && 'text-[14px] 2xl:text-[16px]'}`}>{data.fileType}</td>
                      <td className={`${isOpen && 'text-[14px] 2xl:text-[16px]'}`}>{data.dateAdded}</td>
                      <td className={`${isOpen && 'text-[14px] 2xl:text-[16px]'}`}>{data.addedBy}</td>
                    </tr>
                  )))
                  : (
                    <p>No File.</p>
                  )}
              </tbody>
            </table>
          </div>

          {/* Button */}
          <div className='border-t-1 border-[#d9d9d9] flex justify-center py-[20px]'>
            <div className="relative inline-flex bg-white overflow-hidden text-primary flex items-center justify-center rounded-[30px] cursor-pointer transition-all rounded group">
              <button className="text-[22px] font-bold before:ease relative px-[30px] py-[2px] h-full w-full overflow-hidden bg-primary text-white shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-primary hover:before:-translate-x-40">
                <span className="relative z-10">Choose File</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChooseFileDialog

const fakeFileAllData: FileTableProps[] = [
  {
    fileLabel: 'Bom and Cost 1',
    fileName: 'Bom_Cost_1.csv',
    fileType: 'Master File',
    dateAdded: '07/01/2024',
    addedBy: 'Alice Smith'
  },
  {
    fileLabel: 'Transactional File',
    fileName: 'Transaction_1.csv',
    fileType: 'Transaction',
    dateAdded: '07/02/2024',
    addedBy: 'Bob Johnson'
  },
  {
    fileLabel: 'Bom and Cost 2',
    fileName: 'Bom_Cost_2.csv',
    fileType: 'Master File',
    dateAdded: '07/03/2024',
    addedBy: 'Carol White'
  },
  {
    fileLabel: 'Transactional File',
    fileName: 'Transaction_2.csv',
    fileType: 'Transaction',
    dateAdded: '07/04/2024',
    addedBy: 'David Browning'
  },
  {
    fileLabel: 'Bom and Cost 3',
    fileName: 'Bom_Cost_3.csv',
    fileType: 'Master File',
    dateAdded: '07/05/2024',
    addedBy: 'Eva Davis'
  },
  {
    fileLabel: 'Transactional File',
    fileName: 'Transaction_3.csv',
    fileType: 'Transaction',
    dateAdded: '07/06/2024',
    addedBy: 'Frank Miller'
  },
  {
    fileLabel: 'Bom and Cost 4',
    fileName: 'Bom_Cost_4.csv',
    fileType: 'Master File',
    dateAdded: '07/07/2024',
    addedBy: 'Grace Wilson'
  },
  {
    fileLabel: 'Transactional File',
    fileName: 'Transaction_4.csv',
    fileType: 'Transaction',
    dateAdded: '07/08/2024',
    addedBy: 'Henry Moore'
  },
  {
    fileLabel: 'Bom and Cost 5',
    fileName: 'Bom_Cost_5.csv',
    fileType: 'Master File',
    dateAdded: '07/09/2024',
    addedBy: 'Ivy Taylor'
  },
  {
    fileLabel: 'Transactional File',
    fileName: 'Transaction_5.csv',
    fileType: 'Transaction',
    dateAdded: '07/10/2024',
    addedBy: 'Jack Anderson'
  }
];

const fakeFileMasterData = [
  { fileLabel: 'Bom and Cost 1', fileName: 'Bom_Cost_1.csv', fileType: 'Master File', dateAdded: '12/01/2024', addedBy: 'Alice Smith' },
  { fileLabel: 'Bom and Cost 2', fileName: 'Bom_Cost_2.csv', fileType: 'Master File', dateAdded: '12/02/2024', addedBy: 'Bob Johnson' },
  { fileLabel: 'Bom and Cost 3', fileName: 'Bom_Cost_3.csv', fileType: 'Master File', dateAdded: '12/03/2024', addedBy: 'Carol White' },
  { fileLabel: 'Bom and Cost 4', fileName: 'Bom_Cost_4.csv', fileType: 'Master File', dateAdded: '12/04/2024', addedBy: 'David Brown' },
  { fileLabel: 'Bom and Cost 5', fileName: 'Bom_Cost_5.csv', fileType: 'Master File', dateAdded: '12/05/2024', addedBy: 'Eva Davis' },
];

const fakeFileTransactionData = [
  { fileLabel: 'Transactional File 1', fileName: 'Transaction_1.csv', fileType: 'Transaction', dateAdded: '12/06/2024', addedBy: 'Frank Miller' },
  { fileLabel: 'Transactional File 2', fileName: 'Transaction_2.csv', fileType: 'Transaction', dateAdded: '12/07/2024', addedBy: 'Grace Wilson' },
  { fileLabel: 'Transactional File 3', fileName: 'Transaction_3.csv', fileType: 'Transaction', dateAdded: '12/08/2024', addedBy: 'Henry Moore' },
  { fileLabel: 'Transactional File 4', fileName: 'Transaction_4.csv', fileType: 'Transaction', dateAdded: '12/09/2024', addedBy: 'Ivy Taylor' },
  { fileLabel: 'Transactional File 5', fileName: 'Transaction_5.csv', fileType: 'Transaction', dateAdded: '12/10/2024', addedBy: 'Jack Anderson' },
];
