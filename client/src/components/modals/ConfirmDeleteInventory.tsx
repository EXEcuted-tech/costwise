import React, { useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { TiWarning } from "react-icons/ti";
import { InventoryType } from '@/types/data';
import Alert from '../alerts/Alert';
import api from '@/utils/api';
import { useUserContext } from '@/contexts/UserContext';

interface ConfirmDeleteProps {
    onClose: () => void;
    inventoryList: InventoryType[];
    monthYear: string;
}

const ConfirmDeleteInventory: React.FC<ConfirmDeleteProps> = ({ onClose, inventoryList, monthYear }) => {
    const [alertMessages, setAlertMessages] = useState<string[]>([]);
    const [alertStatus, setAlertStatus] = useState<string>('');
    const { currentUser } = useUserContext();

    const handleDelete = async() => {
        try {
            const inventoryIds = inventoryList.map(inventory => inventory.inventory_id);
            const materialIds = inventoryList.map(inventory => inventory.material_id);
            
            const response = await api.delete('/inventory/archive', {
                data: {
                    inventory_ids: inventoryIds,
                    material_ids: materialIds,
                    inventory_monthYear: monthYear
                }
            });
            console.log("response", response);
            setAlertMessages([response.data.message]);
            setAlertStatus('success');

            const user = localStorage.getItem('currentUser');
            const parsedUser = JSON.parse(user || '{}');

            const auditData = {
                userId: parsedUser?.userId, 
                action: 'crud',
                act: 'archive_inventory'
              };

              api.post('/auditlogs/logsaudit', auditData)
              .then(response => {
                  console.log('Audit log created successfully:', response.data);
              })
              .catch(error => {
                  console.error('Error audit logs:', error);
              });
            setTimeout(function(){location.reload()}, 1000);

        } catch (error: any) {
            console.log(error);
            setAlertMessages([error.response.data.message]);
            setAlertStatus('error');
        }
    }

    return (
        <div className='flex justify-center items-center z-[1000] w-full h-full fixed top-0 left-0 p-4 overflow-auto bg-[rgba(0,0,0,0.5)]'>
            
            <div className='absolute top-0 right-0'>
            {alertMessages && alertMessages.map((msg, index) => (
            <Alert className="!relative" variant={alertStatus as "default" | "information" | "warning" | "critical" | "success" | undefined} key={index} message={msg} setClose={() => {
                setAlertMessages(prev => prev.filter((_, i) => i !== index));
            }} />
                ))}
            </div>

            <div className="flex flex-col w-[28rem] min-h-[380px] mx-[50px] px-3 py-2 bg-white rounded-[20px] animate-pop-out drop-shadow">

                {/* Close Button */}
                <div className='flex justify-end'>
                    <IoIosClose className='mt-[2px] text-[70px] text-[#CECECE] cursor-pointer hover:text-[#b3b3b3] transition-colors duration-250 ease-in-out'
                        onClick={onClose} />
                </div>

                <div className="flex justify-center">
                    <div className='flex flex-col items-center justify-center'>
                        <div className='mt-[-20px]'>
                            <TiWarning className="text-[7em] text-[#CB0000]" />
                        </div>
                        <div className='font-black text-[26px]'>
                            <p>Are You Sure?</p>
                        </div>
                        <div className='text-center text-[20px] text-[#9D9D9D] break-words'>
                            <p>Do you want to archive this inventory list? It will be archived and removed from the database.</p>
                        </div>

                        {/* Buttons */}
                        <div className='my-[20px] px-[50px] grid grid-cols-2 gap-4'>
                            <div className="relative bg-white border-1 border-primary overflow-hidden text-primary flex items-center justify-center rounded-[30px] cursor-pointer transition-all group"
                                onClick={handleDelete}>
                                <button className="text-[19px] font-black before:ease relative h-12 w-40 overflow-hidden bg-primary text-white shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-primary hover:before:-translate-x-40">
                                    <span className="relative z-10">Proceed</span>
                                </button>
                            </div>
                            <div className="relative bg-white border-1 border-primary overflow-hidden text-primary flex items-center justify-center rounded-[30px] cursor-pointer transition-all group"
                                onClick={onClose}>
                                <button className="text-[19px] font-black before:ease relative h-12 w-40 overflow-hidden bg-white text-primary shadow-2xl transition-all hover:bg-[#FFD3D3] before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-white hover:before:-translate-x-40">
                                    <span className="relative z-10">Cancel</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default ConfirmDeleteInventory;