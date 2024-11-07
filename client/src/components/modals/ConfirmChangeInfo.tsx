import React, { useEffect } from 'react';
import { FaRegCheckCircle } from "react-icons/fa";
import { TiWarning } from "react-icons/ti";
import { useRouter } from 'next/navigation';

interface SuccessChangeInfoProps {
    setSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const SuccessChangeInfo: React.FC<SuccessChangeInfoProps> = ({ setSuccessModal }) => {
    const router = useRouter();

    const handleConfirm = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setSuccessModal(false);
        window.location.reload();

    }

    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setSuccessModal(false);
            }
        };
        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [setSuccessModal]);


    return (
        <div className='flex justify-center items-center z-[1000] w-full h-full fixed top-0 left-0 p-4 overflow-auto backdrop-brightness-50'>
            <div className="flex flex-col w-[28rem] min-h-[380px] mx-[50px] px-3 py-2 bg-white rounded-[20px] animate-pop-out drop-shadow">
                <div className="flex justify-center m-auto">
                    <div className='flex flex-col items-center justify-center'>
                        <div className='mt-[10px]'>
                            <FaRegCheckCircle className="text-[6em] text-[#039200]" />
                        </div>
                        <div className='font-black text-[26px] mt-[10px]'>
                            <p>Edit Profile Successful</p>
                        </div>
                        <div className='text-center text-[20px] text-[#9D9D9D] mt-2 break-words'>
                            <p>User Information successfully changed.</p>
                        </div>

                        {/* Buttons */}
                        <div className='mt-[2rem]'>
                            <div className="flex justify-center bg-white border-1 border-primary overflow-hidden text-primary flex items-center justify-center rounded-[30px] cursor-pointer transition-all rounded group"
                                onClick={handleConfirm}>
                                <button className="text-[19px] font-black before:ease relative h-12 w-40 overflow-hidden bg-white text-primary shadow-2xl transition-all hover:bg-[#FFD3D3] before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-white hover:before:-translate-x-40">
                                    <span className="relative z-10">Continue</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default SuccessChangeInfo;