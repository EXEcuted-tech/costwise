import Alert from '@/components/alerts/Alert';
import ChooseFileDialog from '@/components/modals/ChooseFileDialog';
import { useUserContext } from '@/contexts/UserContext';
import React, { useState } from 'react'
import { CiFileOff } from "react-icons/ci";
import { FaFile } from "react-icons/fa6";

const NoFile = () => {
    const [dialog, setDialog] = useState(false);
    const { currentUser } = useUserContext();
    const [errorMsg, setErrorMsg] = useState('');
    const handleChooseFile = () => {
        const sysRoles = currentUser?.roles;
        if (!sysRoles?.includes(5)) {
            setErrorMsg('You are not authorized to view files.');
            return;
        }
        setDialog(true);
    }
    return (
        <>
            <div className="fixed top-4 right-4 z-50">
                <div className="flex flex-col items-end space-y-2">
                    {errorMsg != '' &&
                        <Alert
                            className="!relative"
                            variant='critical'
                            message={errorMsg}
                            setClose={() => setErrorMsg('')} />
                    }
                </div>
            </div>
            <div className='flex flex-col justify-center bg-white dark:bg-[#3C3C3C] rounded-[10px] drop-shadow text-white h-[660px] mx-auto'>
                <CiFileOff className='text-[#9A9999] text-[100px] mx-auto dark:text-white' />
                <p className='text-[#8F8F8F] text-[25px] mx-auto dark:text-white'>No file chosen yet.</p>
                <button className='bg-primary rounded-[20px] px-[50px] py-[5px] mx-auto my-[10px] flex items-center
                    hover:bg-gradient-to-r hover:from-primary hover:to-[#d42020] hover:animate-shrink-in'
                    onClick={handleChooseFile}>
                    <FaFile className='mr-1 text-[25px]' />
                    <p className='font-semibold text-[24px]'>Choose File</p>
                </button>
            </div>
            {dialog && <ChooseFileDialog dialogType={0} setDialog={setDialog} />}
        </>
    )
}

export default NoFile