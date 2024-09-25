"use client"
import Header from '@/components/header/Header';
import FileContainer from '@/components/pages/file-manager/FileContainer'
import FileTabs from '@/components/pages/file-manager/FileTabs';
import React, { useCallback, useEffect, useState } from 'react'
import { BsFolderFill } from "react-icons/bs";
import { PiScrewdriverFill } from "react-icons/pi";
import { VscExport } from "react-icons/vsc";
import { PiUploadLight } from "react-icons/pi";
import { IoIosArrowDown } from "react-icons/io";
import { useSidebarContext } from '@/contexts/SidebarContext';
import { BiSolidFile } from "react-icons/bi";
import { BiFile } from "react-icons/bi";
import useOutsideClick from '@/hooks/useOutsideClick';
import ConfirmDelete from '@/components/modals/ConfirmDelete';
import { useFileManagerContext } from '@/contexts/FileManagerContext';
import { useDropzone } from 'react-dropzone';
import api from '@/utils/api';
import * as XLSX from 'xlsx';

const FileManagerPage = () => {
  const { isOpen } = useSidebarContext();
  const { deleteModal, setDeleteModal } = useFileManagerContext();
  const [tab, setTab] = useState('all');
  const [upload, setUpload] = useState(false);
  const ref = useOutsideClick(() => setUpload(false));

  useEffect(() => {
    const currentTab = localStorage.getItem('fileTab');
    if (currentTab) {
      setTab(currentTab);
    }
  }, []);

  const [uploadType, setUploadType] = useState('');

  const onDrop = useCallback(
    (acceptedFiles: any[]) => {
      const file = acceptedFiles[0];
  
      if (file.type === 'text/csv') {
        // Handle CSV file
        // ... (CSV handling code as before)
      } else {
        // Handle Excel file
        const reader = new FileReader();
  
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const data = e.target?.result;
  
          if (data && data instanceof ArrayBuffer) {
            const dataArray = new Uint8Array(data);
            const workbook = XLSX.read(dataArray, { type: 'array' });
  
            // Get the sheet names
            const sheetNames = workbook.SheetNames;
  
            // Now you can check the sheet names
            console.log('Sheet Names:', sheetNames);
  
            // Add your condition here to check for specific sheet names
            if (sheetNames.includes('SUMMARY OF PRODUCT COSTING')) {
              // Proceed with uploading the file
              const formData = new FormData();
              formData.append('file', file);
              formData.append('type', uploadType);
  
              api
                .post('/api/upload', formData)
                .then((response) => {
                  console.log("Response: ",response);
                })
                .catch((error) => {
                  console.error(error);
                });
            } else {
              // Handle the case where the required sheet is not present
              alert('The Excel file does not contain the required sheets.');
            }
          } else {
            console.error('Error: FileReader result is not an ArrayBuffer.');
          }
        };
  
        reader.onerror = (ex) => {
          console.error(ex);
        };
  
        reader.readAsArrayBuffer(file);
      }
    },
    [uploadType]
  );
  
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
  });

  const handleUpload = (type: React.SetStateAction<string>) => {
    setUploadType(type);
    open();
  };

  return (
    <>
      {deleteModal && <ConfirmDelete onClose={() => { setDeleteModal(false) }} subject="file" />}
      <Header icon={BsFolderFill} title={"File Manager"} />
      <div className={`${isOpen ? 'px-[10px] 2xl:px-[50px] mt-[75px] 2xl:mt-[40px]' : 'px-[50px] mt-[36px]'} ml-[45px]`}>
        <div className='flex relative'>
          <div className={`${isOpen ? 'w-[95%] 2xl:w-[95%] 4xl:w-[75%]' : 'w-[95%] 2xl:w-[80%] 3xl:w-[65%] 4xl:w-[60%]'} ml-[10px]`}>
            <FileTabs tab={tab} setTab={setTab} isOpen={isOpen} />
          </div>
          <div className={`${isOpen ? 'w-full' : 'w-full'} flex justify-end w-full pb-[6px]`}>
            <button className='flex justify-center items-center bg-white border-1 border-[#D3D3D3] px-[10px] mr-[1%] drop-shadow rounded-[10px]
                            hover:bg-[#f7f7f7] transition-colors duration-200 ease-in-out'
              onClick={() => { window.location.href = '/file-manager/workspace' }}>
              <PiScrewdriverFill className={`${isOpen ? 'text-[10px] 2xl:text-[12px] 3xl:text-[16px]' : 'text-[12px] 2xl:text-[16px]'}`} />
              <p className={`ml-[5px] font-bold ${isOpen ? 'text-[10.5px] 2xl:text-[12px] 3xl:text-[16px]' : 'text-[12px] 2xl:text-[16px]'}`}>Workspace</p>
            </button>
            <button className='flex justify-center items-center bg-white border-1 border-[#D3D3D3] px-[10px] mr-[1%] drop-shadow rounded-[10px]
                            hover:bg-[#f7f7f7] transition-colors duration-200 ease-in-out'>
              <VscExport className={`${isOpen ? 'text-[10.5px] 2xl:text-[12px] 3xl:text-[16px]' : 'text-[12px] 2xl:text-[16px]'}`} />
              <p className={`ml-[5px] font-bold ${isOpen ? 'hidden 2xl:block 2xl:text-[12px] 3xl:text-[16px]' : 'text-[12px] 2xl:text-[16px]'}`}>
                Export All Files
              </p>
              <p className={`ml-[5px] font-bold ${isOpen ? 'text-[10.5px] 2xl:hidden' : 'hidden'}`}>
                Export All
              </p>
            </button>
            <div ref={ref}>
              <button className='h-full flex justify-center items-center bg-primary text-white border-1 border-[#D3D3D3] px-[15px] 2xl:px-[30px] mr-[1%] drop-shadow rounded-[10px]
                            hover:bg-[#9c1c1c] transition-colors duration-200 ease-in-out'
                onClick={() => { setUpload(!upload) }}>
                <PiUploadLight className={`${isOpen ? 'text-[10px] 2xl:text-[12px] 3xl:text-[16px]' : 'text-[12px] 2xl:text-[16px]'}`} />
                <p className={`mx-[5px] font-bold ${isOpen ? 'text-[10.5px] 2xl:text-[12px] 3xl:text-[16px]' : 'text-[12px] 2xl:text-[16px]'}`}>Upload</p>
                <IoIosArrowDown className={`${isOpen ? 'text-[10px] 2xl:text-[12px] 3xl:text-[16px]' : 'text-[12px] 2xl:text-[16px]'}`} />
              </button>
              {upload &&
                <div className={`${isOpen ? 'top-[27px] 2xl:top-[30px] 3xl:top-[33px] right-[10px] 2xl:right-[14px] 3xl:right-[13px]' : 'top-[27px] 2xl:top-[33px] right-[7px] 2xl:right-[13px]'} absolute animate-pull-down bg-[#FFD3D3] z-50`}>
                  <ul className={`${isOpen ? 'py-0.5 2xl:py-1' : 'py-0.5 2xl:py-1'} relative flex flex-col justify-start text-primary `}>
                    <li className={`${isOpen ? 'px-1 2xl:px-3' : 'px-1 2xl:px-3'} flex cursor-pointer hover:text-[#851313] items-center my-[5px]`}
                      onClick={() => handleUpload('master')}>
                      <BiSolidFile className={`${isOpen ? 'text-[12px] 2xl:text-[18px] 3xl:text-[21px]' : 'text-[17px] 2xl:text-[21px]'} mr-1`} />
                      <p className={`${isOpen ? 'text-[10.5px] 2xl:text-[12px] 3xl:text-[16px]' : 'text-[12px] 2xl:text-[16px]'} `}>Master File</p>
                    </li>
                    <hr className='h-[2px] bg-primary opacity-50' />
                    <li className={`${isOpen ? 'px-1 2xl:px-3' : 'px-1 2xl:px-3'} flex cursor-pointer hover:text-[#851313] items-center my-[5px]`}
                      onClick={() => handleUpload('transaction')}>
                      <BiFile className={`${isOpen ? 'text-[12px] 2xl:text-[18px] 3xl:text-[21px]' : 'text-[17px] 2xl:text-[21px]'} mr-1`} />
                      <p className={`${isOpen ? 'text-[10.5px] 2xl:text-[12px] 3xl:text-[16px]' : 'text-[12px] 2xl:text-[16px]'} `}>Transaction</p>
                    </li>
                  </ul>
                </div>
              }
            </div>
          </div>
        </div>
        <div>
          <FileContainer tab={tab} isOpen={isOpen} />
        </div>
      </div>
    </>
  )
}

export default FileManagerPage