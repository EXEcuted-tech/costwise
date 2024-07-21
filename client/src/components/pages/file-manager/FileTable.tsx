import React, { useState } from 'react'
import { FileTableProps } from './FileContainer';
import PrimaryPagination from '@/components/pagination/PrimaryPagination';
import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { TiExport } from "react-icons/ti";
import { IoTrash } from "react-icons/io5";
interface FileTableComponentProps {
    fileData: FileTableProps[];
}

const FileTable: React.FC<FileTableComponentProps> = ({ fileData }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const indexOfLastItem = currentPage * 8;
    const indexOfFirstItem = indexOfLastItem - 8;
    const currentListPage = fileData.slice(indexOfFirstItem, indexOfLastItem);
    return (
        <div className=''>
            <table className='w-full'>
                <thead className='text-left font-bold text-[#868686] border-b-[0.6px] border-[#868686]'>
                    <tr className=''>
                        <th className='pl-[46px] py-[5px]'>Title/Name</th>
                        <th className=''>File Type</th>
                        <th className=''>Date Added</th>
                        <th className=''>Added By</th>
                        <th className='pr-[46px]'>Manage</th>
                    </tr>
                </thead>
                <tbody>
                    {currentListPage.length > 0
                        ? (currentListPage.map(({ fileLabel, fileName, fileType, dateAdded, addedBy }, index) => (
                            <tr key={index} className='border-b-[0.3px] border-[#d9d9d9]'>
                                <td className='py-2 pl-[46px]'>
                                    <p className='text-primary text-[18px] cursor-pointer hover:underline'>{fileLabel}</p>
                                    <p className='italic text-[#868686]'>{fileName}</p>
                                </td>
                                <td>{fileType}</td>
                                <td>{dateAdded}</td>
                                <td>{addedBy}</td>
                                <td className='pr-[46px] w-[20%] 2xl:w-[15%]'>
                                    <div className='h-[30px] grid grid-cols-4 border-1 border-[#868686] rounded-[5px]'>
                                        <div className='flex justify-center items-center border-r-1 border-[#868686] h-full
                                                cursor-pointer hover:bg-[#f7f7f7]'>
                                            <FaEye />
                                        </div>
                                        <div className='flex justify-center items-center border-r-1 border-[#868686] h-full
                                        cursor-pointer hover:bg-[#f7f7f7]'>
                                            <FaPencilAlt />
                                        </div>
                                        <div className='flex justify-center items-center border-r-1 border-[#868686] h-full
                                        cursor-pointer hover:bg-[#f7f7f7]'>
                                            <TiExport />
                                        </div>
                                        <div className='flex justify-center items-center h-full
                                        cursor-pointer hover:bg-primary hover:text-white'>
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