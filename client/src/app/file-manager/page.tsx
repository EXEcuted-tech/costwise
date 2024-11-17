"use client"
// Import necessary components, hooks, and utilities
import Header from '@/components/header/Header';
import FileContainer from '@/components/pages/file-manager/FileContainer'
import FileTabs from '@/components/pages/file-manager/FileTabs';
import React, { useCallback, useEffect, useRef, useState } from 'react'
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
import Alert from "@/components/alerts/Alert";
import { File } from '@/types/data';
import { useUserContext } from '@/contexts/UserContext';
import Spinner from '@/components/loaders/Spinner';
import ConfirmFileDuplicate from '@/components/modals/ConfirmFileDuplicate';

const FileManagerPage = () => {
  // Context and state management
  const { isOpen } = useSidebarContext();
  const { deleteModal, setDeleteModal } = useFileManagerContext();
  const [tab, setTab] = useState('all');
  const [upload, setUpload] = useState(false);
  const [uploadType, setUploadType] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allData, setAllData] = useState<File[]>([]);
  const [masterFileData, setMasterFileData] = useState<File[]>([]);
  const [transactionData, setTransactionData] = useState<File[]>([]);
  const [duplicateModal, setDuplicateModal] = useState(false);
  
  const { fileToDelete, setFileToDelete, fileSettings } = useFileManagerContext();
  const { currentUser, setError } = useUserContext();

  const [exportLoading, setExportLoading] = useState(false);

  // Reference for handling file upload proceed/cancel
  const proceedRef = useRef("await");

  // Hook to handle clicking outside upload dropdown
  const ref = useOutsideClick(() => setUpload(false));

  // Function to fetch file data based on selected tab
  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      if (tab === 'all') {
        const response = await api.get('/files/retrieve_all');
        if (response.data.status === 200) {
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
          setAllData(response.data.data);
        }
      } else if (tab === 'masterfile') {
        const response = await api.get('/files/retrieve', {
          params: { col: 'file_type', value: 'master_file' },
        });
        if (response.data.status === 200) {
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
          setMasterFileData(response.data.data);
        }
      } else if (tab === 'transactionfile') {
        const response = await api.get('/files/retrieve', {
          params: { col: 'file_type', value: 'transactional_file' },
        });
        if (response.data.status === 200) {
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
          setTransactionData(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [tab]);

  // Fetch data when tab changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Load previously selected tab from localStorage
  useEffect(() => {
    const currentTab = localStorage.getItem('fileTab');
    if (currentTab) {
      setTab(currentTab);
    }
  }, []);

  // Handlers for duplicate file modal
  const onClose = () => {
    proceedRef.current = "close";
    setDuplicateModal(false);
    setIsLoading(false);
  };
  
  const onProceed = () => {
    proceedRef.current = "proceed";
    setDuplicateModal(false);
  };

  // File drop handler for file uploads
  const onDrop = useCallback(
    (acceptedFiles: any[]) => {
      setErrorMsg('');
      setInfoMsg('');
      setUpload(false);

      // Function to wait for user's choice on duplicate files
      const waitForUserChoice = () => {
        return new Promise((resolve) => {
          const checkProceed = () => {
            if (proceedRef.current == "proceed") {
              proceedRef.current = "await";
              resolve(true);
            } else if (proceedRef.current == "close") {
              proceedRef.current = "await";
              resolve(false);
            } else {
              setTimeout(checkProceed, 3000);
            }
          };
          checkProceed();
        });
      };

      // Process each dropped file
      const processFile = async (file: any) => {
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
          reader.onload = async (e: ProgressEvent<FileReader>) => {
            const data = e.target?.result;
            const fileName = file.name;

            // Check for duplicate files
            if (
              allData.some(
                (existingFile) =>
                  JSON.parse(existingFile.settings).file_name_with_extension === file.name
              )
            ) {
              setDuplicateModal(true);
              const shouldProceed = await waitForUserChoice();
              if (!shouldProceed) {
                proceedRef.current = "await";
                return;
              }
            }

            setIsLoading(true);
            if (data && data instanceof ArrayBuffer) {
              // Process Excel file and validate required sheets
              const dataArray = new Uint8Array(data);
              const workbook = XLSX.read(dataArray, { type: 'array' });

              const sheetNames = workbook.SheetNames;

              let hasRequiredSheets = false;
              let bomSheets = [];

              if (uploadType === 'master') {
                const requiredSheets = ['FODL Cost', 'Material Cost'];
                const bomSheetPattern = /^BOM/;
                hasRequiredSheets = requiredSheets.every(sheetName => sheetNames.includes(sheetName));
                bomSheets = sheetNames.filter(sheetName => bomSheetPattern.test(sheetName));
              } else if (uploadType === 'transactional') {
                const requiredSheets = ['Production Transactions'];
                hasRequiredSheets = requiredSheets.every(sheetName => sheetNames.includes(sheetName));
              }

              // Upload file if validation passes
              if (
                hasRequiredSheets &&
                ((uploadType === 'master' && bomSheets.length > 0) || uploadType === 'transactional')
              ) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('type', uploadType);

                try {
                  const response = await api.post('/files/upload', formData);
                  if (response.data.status === 200) {
                    // Log audit trail for successful upload
                    const user = localStorage.getItem('currentUser');
                    const parsedUser = JSON.parse(user || '{}');

                    const auditData = {
                      userId: parsedUser?.userId,
                      action: 'import',
                      fileName: fileName
                    };

                    api.post('/auditlogs/logsaudit', auditData)
                      .then(response => {
                      })
                      .catch(error => {
                      });

                    resolve(true);
                  } else {
                    reject(new Error('Upload failed'));
                  }
                } catch (error) {
                  console.error(error);
                  reject(error);
                }
              } else {
                reject(new Error('The Excel file does not contain the required sheets.'));
              }
            } else {
              reject(new Error('Error: FileReader result is not an ArrayBuffer.'));
            }
          };

          reader.onerror = (ex) => {
            reject(ex);
          };

          reader.readAsArrayBuffer(file);
        });
      };

      // Process all dropped files and handle results
      Promise.all(acceptedFiles.map(processFile))
        .then((results) => {
          const successCount = results.filter(Boolean).length;
          if (successCount > 0) {
            setInfoMsg(`Successfully uploaded ${successCount} file(s)!`);
          } else {
            setErrorMsg('Incorrect file type uploaded!');
          }
          fetchData();
        })
        .catch((error) => {
          setErrorMsg(error.message);
        })
        .finally(() => {
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        });
    },
    [allData, duplicateModal, fetchData, uploadType]
  );

  // Configure dropzone for file uploads
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

  // Handle upload button click
  const handleUpload = (type: React.SetStateAction<string>) => {
    const sysRoles = currentUser?.roles;
    if (sysRoles?.includes(6)) {
      setUploadType(type);
      setShouldOpenDropzone(true);
    } else {
      setErrorMsg('You are not authorized to upload files.');
    }
  };

  const [shouldOpenDropzone, setShouldOpenDropzone] = useState(false);

  // Open dropzone when upload type is selected
  useEffect(() => {
    if (shouldOpenDropzone) {
      open();
      setShouldOpenDropzone(false);
    }
  }, [uploadType, shouldOpenDropzone, open]);

  // Handle exporting all files
  const handleExportAll = async () => {
    const sysRoles = currentUser?.roles;
    if (!sysRoles?.includes(17)) {
      setError('You are not authorized to export records or files.');
      return;
    }
    setExportLoading(true);
    try {
      const response = await api.post('/files/export_all', {}, {
        responseType: 'blob',
      });

      if (response.data instanceof Blob) {
        // Create and trigger download link
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        const currentDate = new Date().toISOString().split('T')[0];
        a.download = `Costwise_ExportedFiles_${currentDate}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setInfoMsg('All files exported successfully!');
      } else {
        setErrorMsg('Unexpected response format');
      }

      // Log audit trail for export
      const user = localStorage.getItem('currentUser');
      const parsedUser = JSON.parse(user || '{}');

      const auditData = {
        userId: parsedUser?.userId,
        action: 'export',
        act: 'all files',
      };

      api.post('/auditlogs/logsaudit', auditData)
        .then(response => {
        })
        .catch(error => {
        });

    } catch (error) {
      console.error('Export all files failed:', error);
      setErrorMsg(`Failed to export file/s!`);
    } finally {
      setExportLoading(false);
    }
  };

  // Handle file deletion/archiving
  const handleDelete = async () => {
    if (fileToDelete) {
      try {
        setIsLoading(true);
        await api.post(`/files/delete`, { col: 'file_id', value: fileToDelete });

        const settings = JSON.parse(fileSettings);

        // Log audit trail for deletion
        const user = localStorage.getItem('currentUser');
        const parsedUser = JSON.parse(user || '{}');

        const auditData = {
          userId: parsedUser?.userId,
          action: 'crud',
          act: 'archive',
          fileName: settings.file_name
        };

        api.post('/auditlogs/logsaudit', auditData)
          .then(response => {
          })
          .catch(error => {
          });
        setIsLoading(false);
      } catch (error) {
        console.error('Delete failed:', error);
      } finally {
        setIsLoading(false);
        setDeleteModal(false);
        setFileToDelete(0);
        fetchData();
        setInfoMsg('File archived successfully!');
      }
    }
  }

  // Render file manager interface
  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <div className="flex flex-col items-end space-y-2">
          {errorMsg != '' &&
            <Alert
              className="!relative"
              variant='critical'
              message={errorMsg}
              setClose={() => { setErrorMsg(''); }} />
          }
          {infoMsg != '' &&
            <Alert
              className="!relative"
              variant='success'
              message={infoMsg}
              setClose={() => { setInfoMsg(''); }} />
          }
        </div>
      </div>
      {(exportLoading) &&
        <div className='fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center backdrop-brightness-50 z-[1500]'>
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
          <p className='text-primary font-light text-[20px] mt-[10px] text-white'>
            Exporting file(s)...
          </p>
        </div>
      }
      {duplicateModal && (
        <ConfirmFileDuplicate onClose={onClose} onProceed={onProceed} />
      )}
      {deleteModal && <ConfirmDelete onClose={() => { setDeleteModal(false) }} subject="file" onProceed={handleDelete} isLoading={isLoading} />}
      <Header icon={BsFolderFill} title={"File Manager"} />
      <div className={`${isOpen ? 'px-[10px] 2xl:px-[50px] mt-[75px] 2xl:mt-[40px]' : 'px-[50px] mt-[36px]'} ml-[45px]`}>
        <div className='flex relative'>
          <div className={`${isOpen ? 'w-[95%] 2xl:w-[95%] 4xl:w-[75%]' : 'w-[95%] 2xl:w-[80%] 3xl:w-[65%] 4xl:w-[60%]'} ml-[10px]`}>
            <FileTabs tab={tab} setTab={setTab} isOpen={isOpen} />
          </div>
          <div className={`${isOpen ? 'w-full' : 'w-full'} flex justify-end w-full pb-[6px]`}>
            <button className='flex justify-center items-center bg-white dark:text-white dark:bg-[#3C3C3C] border-1 border-[#D3D3D3] px-[10px] mr-[1%] drop-shadow rounded-[10px]
                            hover:bg-[#f7f7f7] hover:dark:bg-[#4C4C4C] transition-colors duration-200 ease-in-out'
              onClick={() => { window.location.href = '/file-manager/workspace' }}>
              <PiScrewdriverFill className={`${isOpen ? 'text-[10px] 2xl:text-[12px] 3xl:text-[16px]' : 'text-[12px] 2xl:text-[16px]'}`} />
              <p className={`ml-[5px] font-bold ${isOpen ? 'text-[10.5px] 2xl:text-[12px] 3xl:text-[16px]' : 'text-[12px] 2xl:text-[16px]'}`}>Workspace</p>
            </button>
            <button className='flex justify-center items-center bg-white border-1 border-[#D3D3D3] px-[10px] mr-[1%] drop-shadow rounded-[10px]
                            hover:bg-[#f7f7f7] transition-colors duration-200 ease-in-out dark:bg-[#3C3C3C] dark:hover:bg-[#4C4C4C] dark:text-white'>
              <VscExport className={`${isOpen ? 'text-[10.5px] 2xl:text-[12px] 3xl:text-[16px]' : 'text-[12px] 2xl:text-[16px]'}`} />
              <p className={`ml-[5px] font-bold ${isOpen ? 'hidden 2xl:block 2xl:text-[12px] 3xl:text-[16px]' : 'text-[12px] 2xl:text-[16px]'}`}
                onClick={handleExportAll}>
                Export All Files
              </p>
              <p className={`ml-[5px] font-bold ${isOpen ? 'text-[10.5px] 2xl:hidden' : 'hidden'}`}
                onClick={handleExportAll}>
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
                      onClick={() => handleUpload('transactional')}>
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
          {/* File container component to display files based on selected tab */}
          <FileContainer
            tab={tab}
            isOpen={isOpen}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setErrorMsg={setErrorMsg}
            setExportLoading={setExportLoading}
            allData={allData}
            masterFileData={masterFileData}
            transactionData={transactionData}
          />
        </div>
      </div>
    </>
  )
}

export default FileManagerPage