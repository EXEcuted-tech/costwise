import React, { useCallback, useEffect, useState } from 'react'
import PrimaryPagination from '@/components/pagination/PrimaryPagination';
import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { TiExport } from "react-icons/ti";
import { useRouter } from 'next/navigation';
import FormulationTable from './FormulationTable';
import { useFormulationContext } from '@/contexts/FormulationContext';
import CompareFormulaContainer from './CompareFormulaContainer';
import BOMListContainer from './BOMListContainer';
import { FaFileCircleXmark } from "react-icons/fa6";
import ConfirmDelete from '@/components/modals/ConfirmDelete';
import api from '@/utils/api';
import { Formulation, FormulationRecord } from '@/types/data';
import Spinner from '@/components/loaders/Spinner';
import Alert from '@/components/alerts/Alert';
import { formatMonthYear } from '@/utils/costwiseUtils';
import { useUserContext } from '@/contexts/UserContext';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { HiArchiveBoxXMark } from 'react-icons/hi2';

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
    setFilteredData: React.Dispatch<React.SetStateAction<Formulation[]>>;
    filteredData: Formulation[];
    isLoading: boolean;
    currentPage: number;
    handlePageChange: (e: React.ChangeEvent<unknown>, page: number) => void;
    setExportLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormulationContainer: React.FC<FormulationProps> = ({
    setView,
    view,
    filteredData,
    isLoading,
    currentPage,
    handlePageChange,
    setExportLoading,
    setFilteredData
}) => {
    const { edit, setEdit, viewFormulas, viewBOM } = useFormulationContext();
    const { currentUser, setError } = useUserContext();
    const [deleteModal, setDeleteModal] = useState(false);
    const [formulationToDelete, setFormulationToDelete] = useState<number | null>(null);
    const { formulaCode, setFormulaCode } = useFormulationContext();
    const [alertMessages, setAlertMessages] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState('');
    const { isOpen } = useSidebarContext();

    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentListPage = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const router = useRouter();

    const handleView = (id: number) => {
        const sysRoles = currentUser?.roles;
        if (!sysRoles?.includes(9)) {
            setAlertMessages(['You are not authorized to view formulations.']);
            return;
        }
        setEdit(false);
        setView(true);
        router.push(`/formulation?id=${id}`);
    }

    const handleEdit = (id: number, fc: string) => {
        const sysRoles = currentUser?.roles;
        if (!sysRoles?.includes(11)) {
            setAlertMessages(['You are not authorized to edit formulations.']);
            return;
        }
        setView(false);
        setEdit(true);
        setFormulaCode(fc);
        router.push(`/formulation?id=${id}`);
    }

    const handleExport = async (id: number) => {
        const sysRoles = currentUser?.roles;
        if (!sysRoles?.includes(17)) {
            setError('You are not authorized to export records or files.');
            return;
        }
        setExportLoading(true);
        try {
            const formulationId = id;

            const formulationResponse = await api.get('/formulations/retrieve', {
                params: { col: 'formulation_id', value: formulationId },
            });

            const response = await api.post('/formulations/export',
                { formulation_id: formulationId },
                { responseType: 'blob' }
            );

            const fileName = formulationResponse.data.data[0].formula_code;

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `[Formulation] ${fileName}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            setExportLoading(false);
            const user = localStorage.getItem('currentUser');
            const parsedUser = JSON.parse(user || '{}');

            const auditData = {
                userId: parsedUser?.userId,
                action: 'export',
                act: 'formulation_file',
                fileName: fileName,
            };

            api.post('/auditlogs/logsaudit', auditData)
                .then(response => {
                })
                .catch(error => {
                });

        } catch (error) {
        }
    }

    const handleDeleteClick = (formulationId: number, formulationCode: string) => {
        const sysRoles = currentUser?.roles;
        if (!sysRoles?.includes(12)) {
            setAlertMessages(['You are not authorized to archive formulations.']);
            return;
        }
        setFormulationToDelete(formulationId);
        setFormulaCode(formulationCode);
        setDeleteModal(true);
    }

    const handleDelete = async () => {
        if (formulationToDelete) {
            try {
                await api.post(`/formulations/delete`, { formulation_id: formulationToDelete });
                const updatedList = filteredData.filter(item => item.formulation_id !== formulationToDelete);
                setFilteredData(updatedList);
                setSuccessMessage('Formulation archived successfully');

                const user = localStorage.getItem('currentUser');
                const parsedUser = JSON.parse(user || '{}');

                const auditData = {
                    userId: parsedUser?.userId,
                    action: 'crud',
                    act: 'archive_formulation',
                    fileName: formulaCode,
                };

                api.post('/auditlogs/logsaudit', auditData)
                    .then(response => {
                    })
                    .catch(error => {
                    });
            } catch (error) {
                setAlertMessages(prev => [...prev, 'Failed to archive formulation']);
            } finally {
                setDeleteModal(false);
                setFormulationToDelete(null);
            }
        }
    }

    return (
        <>
            <div className="fixed top-4 right-4 z-50">
                <div className="flex flex-col items-end space-y-2">
                    {alertMessages && alertMessages.map((msg, index) => (
                        <Alert className="!relative" variant='critical' key={index} message={msg} setClose={() => {
                            setAlertMessages(prev => prev.filter((_, i) => i !== index));
                        }} />
                    ))}
                    {successMessage && <Alert className="!relative" variant='success' message={successMessage} setClose={() => setSuccessMessage('')} />}
                </div>
            </div>
            {deleteModal && <ConfirmDelete onClose={() => setDeleteModal(false)} onProceed={handleDelete} subject="formulation" />}
            {(view || edit) ? <FormulationTable view={view} setView={setView} /> :
                viewFormulas ? <CompareFormulaContainer /> :
                    viewBOM ? <BOMListContainer /> :
                        <div className={`${isOpen? '3xl:px-[20px]' : '3xl:px-[20px]'} w-full font-lato bg-white dark:bg-[#3C3C3C] mt-[20px] rounded-lg drop-shadow-lg mb-[20px]`}>
                            <table className='w-full'>
                                <thead className='border-b border-b-[#c4c4c4]'>
                                    <tr className='text-[#777777] font-bold xl:text-[14px] 2xl:text-[16px] 3xl:text-[18px] dark:text-[#d1d1d1]'>
                                        <th className='py-[10px] px-[8px] 2xl:px-[15px] text-left'>FORMULA CODE</th>
                                        <th className={`${isOpen? 'px-[5px] 2xl:px-[8px]' : 'px-[5px]' } text-left`}>ITEM CODE</th>
                                        <th className={`${isOpen? 'px-[5px] 2xl:px-[8px]' : 'px-[5px]' } text-left`}>DESCRIPTION</th>
                                        <th className={`${isOpen? 'px-[5px] 2xl:px-[8px]' : 'px-[5px]' } text-left`}>UNIT</th>
                                        <th className={`${isOpen? 'px-[5px] 2xl:px-[8px]' : 'px-[5px]' } 2xl:hidden text-center mt-[8px]`}>NO.</th>
                                        <th className={`${isOpen? '2xl:px-[8px]' : 'px-[5px]' } hidden 2xl:flex justify-center items-center text-center mt-2.5`}>FORMULATION NO.</th>
                                        <th className={`${isOpen? 'px-[5px] 2xl:px-[8px]' : 'px-[5px]' } text-left`}>MONTH-YEAR</th>
                                        <th className={`${isOpen? 'px-[5px] 2xl:px-[8px]' : 'px-[5px]' } text-right`}>BATCH QTY.</th>
                                        <th className={`${isOpen? 'px-[5px] 2xl:px-[8px]' : 'px-[5px]' } text-right`}>COST</th>
                                        <th className={`${isOpen? 'px-[5px] 2xl:px-[8px]' : 'px-[5px]' }`}>MANAGE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={9} className="text-center py-4">
                                                <div className='min-h-[500px] flex justify-center items-center'>
                                                    <Spinner />
                                                </div>
                                            </td>
                                        </tr>
                                    ) :
                                        currentListPage.length > 0 &&
                                        (currentListPage.map((data, index) => (
                                            <tr key={index} className={`${index % 2 == 1 && 'bg-[#FCF7F7] dark:bg-[#4c4c4c]'} dark:text-white text-[14px] 2xl:text-[16px]`}>
                                                
                                                <td className='py-[15px] xl:px-[8px] 2xl:px-[15px]'>{data.formula_code}</td>
                                                <td className='px-[15px] xl:px-[8px]'>{data.finishedGood.fg_code}</td>
                                                <td className='px-[15px] xl:px-[8px]'>{data.finishedGood.fg_desc}</td>
                                                <td className='px-[15px] xl:px-[8px] text-left'>{data.finishedGood.unit}</td>
                                                <td className='px-[15px] xl:px-[8px] text-center'>{data.finishedGood.formulation_no}</td>
                                                <td className='px-[15px] xl:px-[8px] text-left'>{formatMonthYear(data.finishedGood.monthYear)}</td>
                                                <td className='px-[15px] xl:px-[8px] text-right'>{data.finishedGood.total_batch_qty}</td>
                                                <td className='px-[15px] xl:px-[8px] text-right'>{data.finishedGood.rm_cost ?? 'N/A'}</td>
                                                <td className='px-[15px] xl:px-[8px]'>
                                                    <div className='h-[30px] grid grid-cols-4 border-1 border-[#868686] rounded-[5px]'>
                                                        <div className='flex justify-center items-center border-r-1 border-[#868686] h-full dark:border-[#5C5C5C] dark:hover:bg-[#4c4c4c]
                                                                cursor-pointer hover:bg-[#f7f7f7] rounded-l-[5px] transition-colors duration-200 ease-in-out'
                                                            onClick={() => handleView(data.formulation_id)}>
                                                            <FaEye className='!size-[11px] 2xl:!size-[16px]'/>
                                                        </div>
                                                        <div className='flex justify-center items-center border-r-1 border-[#868686] h-full dark:border-[#5C5C5C] dark:hover:bg-[#4c4c4c]
                                                                cursor-pointer hover:bg-[#f7f7f7] transition-colors duration-200 ease-in-out'
                                                            onClick={() => handleEdit(data.formulation_id, data.formula_code)}>
                                                            <FaPencilAlt className='!size-[10px] 2xl:!size-[16px]' />
                                                        </div>
                                                        <div className='flex justify-center items-center border-r-1 border-[#868686] h-full dark:border-[#5C5C5C] dark:hover:bg-[#4c4c4c]
                                                                cursor-pointer hover:bg-[#f7f7f7] transition-colors duration-200 ease-in-out'
                                                            onClick={() => handleExport(data.formulation_id)}>
                                                            <TiExport className='!size-[11px] 2xl:!size-[16px]' />
                                                        </div>
                                                        <div className='flex justify-center items-center h-full dark:border-[#5C5C5C]
                                                                cursor-pointer hover:bg-primary hover:text-white hover:rounded-r-[4px] transition-colors duration-200 ease-in-out'
                                                            onClick={() => handleDeleteClick(data.formulation_id, data.formula_code)}>
                                                            <HiArchiveBoxXMark />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )))}
                                </tbody>
                            </table>
                            {!isLoading && currentListPage.length > 0
                                ?
                                <div className='relative py-[1%]'>
                                    <PrimaryPagination
                                        data={filteredData}
                                        itemsPerPage={itemsPerPage}
                                        handlePageChange={handlePageChange}
                                        currentPage={currentPage}
                                    />
                                </div>
                                :
                                !isLoading && currentListPage.length == 0 &&
                                <div className='min-h-[350px] flex flex-col justify-center items-center p-12 font-semibold text-[#9F9F9F]'>
                                    <FaFileCircleXmark className='text-[75px]' />
                                    <p className='text-[30px]'>No File Found.</p>
                                </div>
                            }
                        </div>
            }
        </>
    )
}

export default FormulationContainer
