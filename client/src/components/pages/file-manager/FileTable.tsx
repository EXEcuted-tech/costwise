import React, { useEffect, useState } from 'react'
import PrimaryPagination from '@/components/pagination/PrimaryPagination';
import { FaEye, FaPencilAlt } from "react-icons/fa";
import { TiExport } from "react-icons/ti";
import { IoTrash } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import { FaFileCircleXmark } from "react-icons/fa6";
import { useFileManagerContext } from '@/contexts/FileManagerContext';
import Spinner from '@/components/loaders/Spinner';
import { File, FileSettings } from '@/types/data';
import api from '@/utils/api';

interface FileTableComponentProps {
    fileData: File[];
    isOpen: boolean;
    isLoading: boolean;
}

const FileTable: React.FC<FileTableComponentProps> = ({ fileData, isOpen, isLoading }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { setDeleteModal, setFileToDelete } = useFileManagerContext();
    const handlePageChange = (e: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const indexOfLastItem = currentPage * 8;
    const indexOfFirstItem = indexOfLastItem - 8;
    const currentListPage = fileData.slice(indexOfFirstItem, indexOfLastItem);
    const router = useRouter();

    const handleView = (data: File) => {
        router.push(`/file-manager/workspace?id=${data.file_id}&type=${data.file_type}`);
    }

    const handleEdit = (data: File) => {
        localStorage.setItem("edit", "true");
        router.push(`/file-manager/workspace?id=${data.file_id}&type=${data.file_type}`);
    }

    const handleExport = async (data: File) => {
        try {
            const fileId = data.file_id;

            const response = await api.post('/files/export',
                { file_id: fileId },
                { responseType: 'blob' }
            );

            const settings = JSON.parse(data.settings);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `${settings.file_name_with_extension}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    const handleDelete = (data: File) => {
        setFileToDelete(data.file_id);
        setDeleteModal(true);
    }

    return (
        <div>
            <table className='w-full'>
                <thead className={` ${isOpen && 'text-[14px] 2xl:text-[16px]'} text-left font-bold text-[#868686] border-b-[0.6px] border-[#868686]`}>
                    <tr>
                        <th className={`${isOpen ? 'pl-[20px] 2xl:pl-[46px]' : 'pl-[46px]'} py-[5px]`}>Title/Name</th>
                        <th className=''>File Type</th>
                        <th className=''>Date Added</th>
                        <th className=''>Added By</th>
                        <th className={`${isOpen ? 'pr-[20px] 2xl:pr-[46px]' : 'pr-[46px]'}`}>Manage</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading &&
                        <td colSpan={5}>
                            <div className='h-[628px] flex justify-center items-center'>
                                <Spinner />
                            </div>
                        </td>
                    }
                    {(!isLoading && currentListPage.length > 0) &&
                        (currentListPage.map((data, index) => {
                            let settings: FileSettings;
                            try {
                                settings = JSON.parse(data.settings);
                            } catch (error) {
                                console.error('Error parsing settings:', error);
                                settings = {} as FileSettings;
                            }

                            const fileLabel = settings.file_name;
                            const fileName = settings.file_name_with_extension;
                            const fileType = data.file_type == 'master_file' ? 'Master File' : 'Transactional File';
                            const dateAdded = data.created_at &&
                                new Date(data.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    timeZone: 'UTC',
                                });
                            const addedBy = settings.user;
                            return (
                                <tr key={index} className='border-b-[0.3px] border-[#d9d9d9]'>
                                    <td className={`${isOpen ? 'pl-[20px] 2xl:pl-[46px]' : 'pl-[46px]'} py-2`}>
                                        <p className={`${isOpen ? 'text-[16px] 2xl:text-[18px]' : 'text-[14px] 2xl:text-[18px]'} text-primary cursor-pointer hover:underline`}>{fileLabel}</p>
                                        <p className={`${isOpen ? '!text-[14px] 2xl:text-[16px]' : '!text-[12px] 2xl:!text-[16px]'} italic text-[#868686]`}>{fileName}</p>
                                    </td>
                                    <td className={`text-[14px] 2xl:!text-[16px]`}>{fileType}</td>
                                    <td className={`text-[14px] 2xl:!text-[16px]`}>{dateAdded}</td>
                                    <td className={`text-[14px] 2xl:!text-[16px]`}>{addedBy}</td>
                                    <td className={`${isOpen ? 'w-[20%] 3xl:w-[15%] pr-[20px] 2xl:pr-[46px]' : 'w-[20%] 2xl:w-[15%] pr-[46px]'}`}>
                                        <div className='h-[30px] grid grid-cols-4 border-1 border-[#868686] rounded-[5px]'>
                                            <div className='flex justify-center items-center border-r-1 border-[#868686] h-full
                                                cursor-pointer hover:bg-[#f7f7f7] rounded-l-[5px] transition-colors duration-200 ease-in-out'
                                                onClick={() => handleView(data)}>
                                                <FaEye />
                                            </div>
                                            <div className='flex justify-center items-center border-r-1 border-[#868686] h-full
                                        cursor-pointer hover:bg-[#f7f7f7] transition-colors duration-200 ease-in-out'
                                                onClick={() => handleEdit(data)}>
                                                <FaPencilAlt />
                                            </div>
                                            <div className='flex justify-center items-center border-r-1 border-[#868686] h-full
                                        cursor-pointer hover:bg-[#f7f7f7] transition-colors duration-200 ease-in-out'
                                                onClick={() => handleExport(data)}>
                                                <TiExport />
                                            </div>
                                            <div className='flex justify-center items-center h-full transition-colors duration-200 ease-in-out
                                        cursor-pointer hover:bg-primary hover:text-white hover:rounded-r-[4px]'
                                                onClick={() => handleDelete(data)}>
                                                <IoTrash />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }))}
                </tbody>
            </table>
            {!isLoading && currentListPage.length > 0
                ?
                <div className='relative py-[1%]'>
                    <PrimaryPagination
                        data={fileData}
                        itemsPerPage={8}
                        handlePageChange={handlePageChange}
                        currentPage={currentPage}
                    />
                </div>
                :
                !isLoading &&
                <div className='min-h-[350px] flex flex-col justify-center items-center p-12 font-semibold text-[#9F9F9F]'>
                    <FaFileCircleXmark className='text-[75px]' />
                    <p className='text-[30px]'>No File Found.</p>
                </div>
            }
        </div>
    )
}

export default FileTable