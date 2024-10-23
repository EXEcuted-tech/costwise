import React, { useCallback, useEffect, useState } from 'react'
import PrimaryPagination from '@/components/pagination/PrimaryPagination';
import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { IoTrash } from "react-icons/io5";
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
}

const FormulationContainer: React.FC<FormulationProps> = ({
    setView,
    view,
    filteredData,
    isLoading,
    currentPage,
    handlePageChange,
    setFilteredData
}) => {
    const { edit, setEdit, viewFormulas, viewBOM } = useFormulationContext();
    const { currentUser } = useUserContext();
    const [deleteModal, setDeleteModal] = useState(false);
    const [formulationToDelete, setFormulationToDelete] = useState<number | null>(null);
    const { formulaCode, setFormulaCode } = useFormulationContext();
    const [alertMessages, setAlertMessages] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState('');

    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentListPage = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const router = useRouter();

    const handleView = (id: number) => {
        setEdit(false);
        setView(true);
        router.push(`/formulation?id=${id}`);
    }

    const handleEdit = (id: number, fc: string) => {
        setView(false);
        setEdit(true);
        setFormulaCode(fc);
        router.push(`/formulation?id=${id}`);
    }

    const handleExport = async (id: number) => {
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
                  console.log('Audit log created successfully:', response.data);
              })
              .catch(error => {
                  console.error('Error audit logs:', error);
              });

        } catch (error) {
            console.error('Export failed:', error);
        }
    }

    const handleDeleteClick = (formulationId: number, formulationCode: string) => {
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
                setSuccessMessage('Formulation deleted successfully');

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
                    console.log('Audit log created successfully:', response.data);
                })
                .catch(error => {
                    console.error('Error audit logs:', error);
                });
            } catch (error) {
                setAlertMessages(prev => [...prev, 'Failed to delete formulation']);
            } finally {
                setDeleteModal(false);
                setFormulationToDelete(null);
            }
        }
    }

    return (
        <>
            <div className="absolute top-0 right-0">
                {alertMessages && alertMessages.map((msg, index) => (
                    <Alert className="!relative" variant='critical' key={index} message={msg} setClose={() => {
                        setAlertMessages(prev => prev.filter((_, i) => i !== index));
                    }} />
                ))}
                {successMessage && <Alert className="!relative" variant='success' message={successMessage} setClose={() => setSuccessMessage('')} />}
            </div>
            {deleteModal && <ConfirmDelete onClose={() => setDeleteModal(false)} onProceed={handleDelete} subject="formulation" />}
            {(view || edit) ? <FormulationTable view={view} setView={setView} /> :
                viewFormulas ? <CompareFormulaContainer /> :
                    viewBOM ? <BOMListContainer /> :
                        <div className='w-full font-lato bg-white mt-[20px] px-[20px] rounded-lg drop-shadow-lg'>
                            <table className='w-full '>
                                <thead className='border-b border-b-[#c4c4c4]'>
                                    <tr className='text-[#777777] font-bold text-[18px]'>
                                        <th className='py-[10px] px-[15px] text-left'>FORMULA CODE</th>
                                        <th className='px-[15px] text-left'>ITEM CODE</th>
                                        <th className='px-[15px] text-left'>DESCRIPTION</th>
                                        <th className='px-[15px] text-left'>UNIT</th>
                                        <th className='px-[15px] text-center'>FORMULATION NO.</th>
                                        <th className='px-[15px] text-left'>MONTH-YEAR</th>
                                        <th className='px-[15px] text-right'>BATCH QTY.</th>
                                        <th className='px-[15px] text-right'>COST</th>
                                        <th className='px-[15px]'>MANAGE</th>
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
                                            <tr key={index} className={`${index % 2 == 1 && 'bg-[#FCF7F7]'}`}>
                                                <td className='py-[15px] px-[15px]'>{data.formula_code}</td>
                                                <td className='px-[15px]'>{data.finishedGood.fg_code}</td>
                                                <td className='px-[15px]'>{data.finishedGood.fg_desc}</td>
                                                <td className='px-[15px] text-left'>{data.finishedGood.unit}</td>
                                                <td className='px-[15px] text-center'>{data.finishedGood.formulation_no}</td>
                                                <td className='px-[15px] text-left'>{formatMonthYear(data.finishedGood.monthYear)}</td>
                                                <td className='px-[15px] text-right'>{data.finishedGood.total_batch_qty}</td>
                                                <td className='px-[15px] text-right'>{data.finishedGood.total_cost ?? 'N/A'}</td>
                                                <td className='px-[15px]'>
                                                    <div className='h-[30px] grid grid-cols-4 border-1 border-[#868686] rounded-[5px]'>
                                                        <div className='flex justify-center items-center border-r-1 border-[#868686] h-full
                                                                cursor-pointer hover:bg-[#f7f7f7] rounded-l-[5px] transition-colors duration-200 ease-in-out'
                                                            onClick={() => handleView(data.formulation_id)}>
                                                            <FaEye />
                                                        </div>
                                                        <div className='flex justify-center items-center border-r-1 border-[#868686] h-full
                                                                cursor-pointer hover:bg-[#f7f7f7] transition-colors duration-200 ease-in-out'
                                                            onClick={() => handleEdit(data.formulation_id, data.formula_code)}>
                                                            <FaPencilAlt />
                                                        </div>
                                                        <div className='flex justify-center items-center border-r-1 border-[#868686] h-full
                                                                cursor-pointer hover:bg-[#f7f7f7] transition-colors duration-200 ease-in-out'
                                                            onClick={() => handleExport(data.formulation_id)}>
                                                            <TiExport />
                                                        </div>
                                                        <div className='flex justify-center items-center h-full
                                                                cursor-pointer hover:bg-primary hover:text-white hover:rounded-r-[4px] transition-colors duration-200 ease-in-out'
                                                            onClick={() => handleDeleteClick(data.formulation_id, data.formula_code)}>
                                                            <IoTrash />
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
