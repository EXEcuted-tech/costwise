import { useSidebarContext } from '@/context/SidebarContext';
import React from 'react'

const CostTable:React.FC<{className:string;}> = ({className}) => {
    const { isOpen } = useSidebarContext();
    
    return (
        <div>
            <div className={`relative overflow-y-auto ${className}`}>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className={`${isOpen ? 'text-[10px] 2xl:text-[13px]' : 'text-[10px] 2xl:text-[13px]'} sticky top-0 z-10 text-gray-500 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400`}>
                        <tr>
                            <th className="p-4">
                                Month
                            </th>
                            <th className="p-4">
                                Projected Cost
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className={`${isOpen && 'text-[10px] 2xl:text-[16px]'} bg-white border-b dark:bg-gray-800 dark:border-gray-700`}>
                            <th scope="row" className="p-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                January
                            </th>
                            <td className="p-4">
                                <span>Budgeted Cost: ₱10,000,000</span><br/>
                                <span>Actual Cost: ₱12,000,000</span>
                            </td>
                        </tr>
                        <tr className={`${isOpen && 'text-[10px] 2xl:text-[16px]'} bg-white border-b dark:bg-gray-800 dark:border-gray-700`}>
                            <th scope="row" className="p-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                February
                            </th>
                            <td className="p-4">
                                <span>Budgeted Cost: ₱10,000,000</span><br/>
                                <span>Actual Cost: ₱12,000,000</span>
                            </td>
                        </tr>
                        <tr className={`${isOpen && 'text-[10px] 2xl:text-[16px]'} bg-white border-b dark:bg-gray-800 dark:border-gray-700`}>
                            <th scope="row" className="p-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                March
                            </th>
                            <td className="p-4">
                                <span>Budgeted Cost: ₱10,000,000</span><br/>
                                <span>Actual Cost: ₱12,000,000</span>
                            </td>
                        </tr>
                        <tr className={`${isOpen && 'text-[10px] 2xl:text-[16px]'} bg-white border-b dark:bg-gray-800 dark:border-gray-700`}>
                            <th scope="row" className="p-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                April
                            </th>
                            <td className="p-4">
                                <span>Budgeted Cost: ₱10,000,000</span><br/>
                                <span>Actual Cost: ₱12,000,000</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default CostTable