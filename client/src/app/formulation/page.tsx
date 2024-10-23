"use client"
import Header from '@/components/header/Header'
import React, { useCallback, useEffect, useState } from 'react'
import { AiOutlineSearch, AiOutlineDown } from 'react-icons/ai';
import { HiClipboardList } from "react-icons/hi";
import { MdCompare } from "react-icons/md";
import { IoList } from "react-icons/io5";
import { BiSolidFile } from 'react-icons/bi';
import { IoMdAdd } from "react-icons/io";
import useOutsideClick from '@/hooks/useOutsideClick';
import FormulationContainer from '@/components/pages/formulation/FormulationContainer';
import { useSidebarContext } from '@/contexts/SidebarContext';
import CompareFormulaDialog from '@/components/modals/CompareFormulaDialog';
import { useFormulationContext } from '@/contexts/FormulationContext';
import { useRouter } from 'next/navigation';
import ChooseFileDialog from '@/components/modals/ChooseFileDialog';
import BillOfMaterialsList from '@/components/modals/BillOfMaterialsList';
import CompareFormulaContainer from '@/components/pages/formulation/CompareFormulaContainer';
import api from '@/utils/api';
import { Formulation } from '@/types/data';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { formatMonthYear } from '@/utils/costwiseUtils';
import Alert from '@/components/alerts/Alert';
import { useUserContext } from '@/contexts/UserContext';

const FormulationPage = () => {
    const { isOpen } = useSidebarContext();
    const { edit, setEdit, add, setAdd, viewFormulas, viewBOM } = useFormulationContext();
    const { currentUser } = useUserContext();

    const [addFormula, setAddFormula] = useState(false);
    const [compareFormula, setCompareFormula] = useState(false);
    const [bomList, setBomList] = useState(false);
    const [view, setView] = useState(false);

    const ref = useOutsideClick(() => setAddFormula(false));
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [allData, setAllData] = useState<Formulation[]>([]);
    const [filteredData, setFilteredData] = useState<Formulation[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [infoMsg, setInfoMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handlePageChange = (e: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        const filtered = allData
            .filter((formulation) => {
                const searchTermLower = searchTerm.toLowerCase();
                const matchesSearch = (
                    formulation.formula_code.toLowerCase().includes(searchTermLower) ||
                    formulation.finishedGood.fg_code.toLowerCase().includes(searchTermLower) ||
                    formulation.finishedGood.fg_desc.toLowerCase().includes(searchTermLower) ||
                    formulation.finishedGood.unit.toLowerCase().includes(searchTermLower) ||
                    formatMonthYear(formulation.finishedGood.monthYear).toLowerCase().includes(searchTermLower)
                );
                return matchesSearch;
            })
            .sort((a, b) => b.finishedGood.monthYear - a.finishedGood.monthYear);

        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page when filter changes
    }, [allData, searchTerm]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await api.get('/formulations/retrieve_all_fg');
            if (response.data.status === 200) {
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);

                setAllData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            setErrorMsg('');
            setInfoMsg('');
            setIsLoading(true);

            const uploadPromises = acceptedFiles.map(async (file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();

                    reader.onload = async (e: ProgressEvent<FileReader>) => {
                        const data = e.target?.result;

                        if (data && data instanceof ArrayBuffer) {
                            const dataArray = new Uint8Array(data);
                            const workbook = XLSX.read(dataArray, { type: 'array' });

                            // const sheetNames = workbook.SheetNames;

                            const formData = new FormData();
                            formData.append('file', file);

                            try {
                                const response = await api.post('/formulations/upload', formData);
                                if (response.data.status == 200) {
                                    resolve(`Successfully uploaded the file!`);
                                    fetchData();

                                    const fileName = file.name; 
                                    const user = localStorage.getItem('currentUser');
                                    const parsedUser = JSON.parse(user || '{}');

                                    const auditData = {
                                        userId: parsedUser?.userId,
                                        action: 'import',
                                        fileName: fileName
                                      };
                                      api.post('/auditlogs/logsaudit', auditData)
                                      .then(response => {
                                          console.log('Audit log created successfully:', response.data);
                                      })
                                      .catch(error => {
                                          console.error('Error audit logs:', error);
                                      });
                                } else {
                                    reject(response.data.data.message);
                                }
                            } catch (error: any) {
                                reject([error.response.data.message]);
                            }
                        } else {
                            reject(`Error reading ${file.name}`);
                        }
                    };

                    reader.onerror = () => {
                        reject(`Error reading ${file.name}`);
                    };

                    reader.readAsArrayBuffer(file);
                });
            });

            try {
                const results = await Promise.all(uploadPromises);
                setInfoMsg(results.join(', '));
            } catch (errors) {
                console.log("Errors", errors);
                if (Array.isArray(errors)) {
                    setErrorMsg(errors.join(', '));
                } else {
                    setErrorMsg('An error occurred during file upload');
                }
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop,
        noClick: true,
        noKeyboard: true,
        multiple: true,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
            'text/csv': ['.csv'],
        },
    });

    return (
        <>
            <div className="absolute top-0 right-0">
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
            <Header icon={HiClipboardList} title={"Formulations"} />
            {compareFormula && <CompareFormulaDialog setCompareFormula={setCompareFormula} />}
            {bomList && <BillOfMaterialsList setBOM={setBomList} />}
            <div className={`${isOpen ? 'px-[10px] 2xl:px-[50px]' : 'px-[50px]'} mt-[25px] ml-[45px] transition-all duration-400 ease-in-out`}>
                {(!view && !edit && !viewFormulas && !viewBOM) &&
                    <div className='flex'>
                        {/* Search Component */}
                        <div className={`${isOpen ? 'w-[40%] 4xl:w-[50%] 4xl:mr-[1%]' : 'w-[45%] 2xl:w-[50%] 3xl:w-[60%] mr-[1%]'} relative transition-all duration-400 ease-in-out`}>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-1 pointer-events-none">
                                <AiOutlineSearch className={`${isOpen ? 'text-[14px] 2xl:text-[19px] 3xl:text-[22px]' : 'text-[19px] 2xl:text-[22px]'} text-[#575757] dark:bg-[#1E1E1E]`} />
                            </div>
                            <input
                                type="text"
                                className={`${isOpen ? 'pl-[25px] 2xl:pl-[35px] w-[70%] 4xl:w-[50%] text-[15px] 2xl:text-[18px] 3xl:text-[21px]' : 'pl-[35px] w-[60%] 3xl:w-[50%] text-[18px] 2xl:text-[21px]'} dark:bg-[#1E1E1E] dark:text-[#d1d1d1] focus:outline-none pr-[5px] py-[10px] bg-background border-b border-[#868686] placeholder-text-[#777777] text-[#5C5C5C]`}
                                placeholder="Search Formulation"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                required
                            />
                        </div>
                        <div className={`${isOpen ? 'w-[60%] 4xl:w-[50%]' : 'w-[55%] 2xl:w-[50%] 3xl:w-[40%]'} flex flex-grow items-end justify-end`}>
                            <button className={`${isOpen ? 'text-[15px] 3xl:text-[18px]' : 'text-[15px] 2xl:text-[18px]'} mr-[10px] bg-white dark:bg-[#3C3C3C] dark:text-[#d1d1d1] dark:border-[#5C5C5C] dark:hover:bg-[#4c4c4c] px-[15px] py-[5px] rounded-[5px] drop-shadow-lg flex items-center hover:bg-[#f7f7f7] transition-colors duration-200 ease-in-out`}
                                onClick={() => setCompareFormula(true)}>
                                <MdCompare className='mr-[5px]' />
                                <span className='font-bold'>Compare</span>
                            </button>
                            <button className={`${isOpen ? 'text-[15px] 3xl:text-[18px]' : 'text-[15px] 2xl:text-[18px]'} mr-[10px] bg-white dark:bg-[#3C3C3C] dark:text-[#d1d1d1] dark:border-[#5C5C5C] dark:hover:bg-[#4c4c4c] px-[15px] py-[5px] rounded-[5px] drop-shadow-lg flex items-center hover:bg-[#f7f7f7] transition-colors duration-200 ease-in-out`}
                                onClick={() => setBomList(true)}>
                                <IoList className={`${isOpen ? 'text-[15px] 2xl:text-[22px]' : 'text-[22px]'} mr-[5px]`} />
                                <span className='font-bold'>BOM List</span>
                            </button>
                            <div ref={ref}>
                                <button className={`${isOpen ? 'text-[15px] 3xl:text-[18px]' : 'text-[15px] 2xl:text-[18px]'} px-[15px] py-[5px] bg-primary text-white rounded-[5px] drop-shadow-lg flex items-center hover:bg-[#9c1c1c] transition-colors duration-200 ease-in-out`}
                                    onClick={() => setAddFormula(!addFormula)}>
                                    <span className='font-bold border-r-[2px] border-r-[#920000] pr-[10px] mr-[10px]'>Add Formula</span>
                                    <span><AiOutlineDown /></span>
                                </button>
                                {addFormula &&
                                    <div className={`${isOpen ? 'w-[125px] 2xl:w-[145px] 3xl:w-[165px]' : 'w-[145px] 2xl:w-[165px]'} ml-[5px] absolute animate-pull-down bg-[#FFD3D3] z-50`}>
                                        <ul className='text-primary text-[14px] 2xl:text-[17px]'>
                                            <li className={`${isOpen ? 'pl-[6px] 3xl:pl-[15px]' : 'pl-[15px]'} flex items-center justify-left py-[5px] cursor-pointer hover:text-[#851313]`}
                                                onClick={() => {
                                                    setAdd(true);
                                                    router.push('/formulation/create');
                                                }}>
                                                <IoMdAdd className='text-[20px] mr-[5px]' />
                                                <p>Add Manually</p>
                                            </li>
                                            <hr className='h-[2px] bg-primary opacity-50' />
                                            <li className={`${isOpen ? 'pl-[6px] 3xl:pl-[15px]' : 'pl-[15px]'} flex items-center justify-left py-[5px] cursor-pointer hover:text-[#851313]`}
                                                onClick={open}>
                                                <BiSolidFile className='text-[20px] mr-[5px]' />
                                                <p>Import Files</p>
                                            </li>
                                        </ul>
                                    </div>
                                }
                            </div>

                        </div>
                    </div>
                }
                {/* File Container */}
                <div className='w-full '>
                    <FormulationContainer
                        setView={setView}
                        view={view}
                        setFilteredData={setFilteredData}
                        filteredData={filteredData}
                        isLoading={isLoading}
                        currentPage={currentPage}
                        handlePageChange={handlePageChange}
                    />
                </div>
            </div>
        </>
    )
}

export default FormulationPage