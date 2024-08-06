import React, { useEffect, useState } from 'react'
import { FileTableProps } from './FileContainer';
import PrimaryPagination from '@/components/pagination/PrimaryPagination';
import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { TiExport } from "react-icons/ti";
import { IoTrash } from "react-icons/io5";
import { useRouter } from 'next/navigation';
interface FileTableComponentProps {
    fileData: FileTableProps[];
    isOpen: boolean;
}

const FileTable: React.FC<FileTableComponentProps> = ({ fileData, isOpen }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const handlePageChange = (e: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const indexOfLastItem = currentPage * 8;
    const indexOfFirstItem = indexOfLastItem - 8;
    const currentListPage = fileData.slice(indexOfFirstItem, indexOfLastItem);
    const router = useRouter();

    const handleView = (data:FileTableProps) => {
        const encodedData = encodeURIComponent(JSON.stringify(data));
        router.push(`/file-manager/workspace?data=${encodedData}`); //change to number later
    }

    const handleEdit = (data:FileTableProps) => {

    }

    const handleExport = (data:FileTableProps) => {

    }

    const handleDelete = (data:FileTableProps) => {

    }

    return (
        <div className=''>
            <table className='w-full'>
                <thead className={` ${isOpen && 'text-[14px] 2xl:text-[16px]'} text-left font-bold text-[#868686] border-b-[0.6px] border-[#868686]`}>
                    <tr className=''>
                        <th className={`${isOpen ? 'pl-[20px] 2xl:pl-[46px]' : 'pl-[46px]'} py-[5px]`}>Title/Name</th>
                        <th className=''>File Type</th>
                        <th className=''>Date Added</th>
                        <th className=''>Added By</th>
                        <th className={`${isOpen ? 'pr-[20px] 2xl:pr-[46px]' : 'pr-[46px]'}`}>Manage</th>
                    </tr>
                </thead>
                <tbody>
                    {currentListPage.length > 0
                        ? (currentListPage.map((data, index) => (
                            <tr key={index} className='border-b-[0.3px] border-[#d9d9d9]'>
                                <td className={`${isOpen ? 'pl-[20px] 2xl:pl-[46px]' : 'pl-[46px]'} py-2`}>
                                    <p className={`${isOpen ? 'text-[16px] 2xl:text-[18px]' : 'text-[18px]'} text-primary cursor-pointer hover:underline`}>{data.fileLabel}</p>
                                    <p className={`${isOpen && 'text-[14px] 2xl:text-[16px]'}italic text-[#868686]`}>{data.fileName}</p>
                                </td>
                                <td className={`${isOpen && 'text-[14px] 2xl:text-[16px]'}`}>{data.fileType}</td>
                                <td className={`${isOpen && 'text-[14px] 2xl:text-[16px]'}`}>{data.dateAdded}</td>
                                <td className={`${isOpen && 'text-[14px] 2xl:text-[16px]'}`}>{data.addedBy}</td>
                                <td className={`${isOpen ? 'w-[20%] 3xl:w-[15%] pr-[20px] 2xl:pr-[46px]' : 'w-[20%] 2xl:w-[15%] pr-[46px]'}`}>
                                    <div className='h-[30px] grid grid-cols-4 border-1 border-[#868686] rounded-[5px]'>
                                        <div className='flex justify-center items-center border-r-1 border-[#868686] h-full
                                                cursor-pointer hover:bg-[#f7f7f7]'
                                            onClick={()=>handleView(data)}>
                                            <FaEye />
                                        </div>
                                        <div className='flex justify-center items-center border-r-1 border-[#868686] h-full
                                        cursor-pointer hover:bg-[#f7f7f7]'
                                            onClick={()=>handleEdit(data)}>
                                            <FaPencilAlt />
                                        </div>
                                        <div className='flex justify-center items-center border-r-1 border-[#868686] h-full
                                        cursor-pointer hover:bg-[#f7f7f7]'
                                            onClick={()=>handleExport(data)}>
                                            <TiExport />
                                        </div>
                                        <div className='flex justify-center items-center h-full
                                        cursor-pointer hover:bg-primary hover:text-white'
                                            onClick={()=>handleDelete(data)}>
                                            <IoTrash />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )))
                        : (
                            <p>No File.</p>
                        )}
                </tbody>
            </table>
            <div className='relative py-[1%]'>
                <PrimaryPagination
                    data={fileData}
                    itemsPerPage={8}
                    handlePageChange={handlePageChange}
                    currentPage={currentPage}
                />
            </div>
        </div>

    )
}

export default FileTable