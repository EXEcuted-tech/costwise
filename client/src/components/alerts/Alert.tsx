"use client"
import { useEffect, useState } from 'react'
import { IoAlertCircleOutline, IoClose } from "react-icons/io5";
import { IoIosCheckmarkCircleOutline, IoIosInformationCircleOutline } from "react-icons/io";
import { CiBellOn, CiWarning } from "react-icons/ci";
import classNames from 'classnames';

interface AlertProps {
    className?: string;
    variant?: 'default' | 'information' | 'warning' | 'critical' | 'success';
    message: string;
    setClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const Alert: React.FC<AlertProps> = ({ className, variant = 'default', message, setClose }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return prevProgress + 1;
            });
        }, 75);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const autoCloseTimer = setTimeout(() => {
            setClose(false);
        }, 20000);

        return () => clearTimeout(autoCloseTimer);
    }, [setClose]);

    const outerElement = classNames(
        {
            [`bg-white border border-gray-500 text-gray-500`]: variant === 'default',
            [`bg-[#f3faf2] border border-[#3e8635] text-[#3e8635]`]: variant === 'success',
            [`bg-[#fdf7e7] border border-[#f0ab00] text-[#f0ab00]`]: variant === 'warning',
            [`bg-[#F7C8C7] border border-primary text-primary`]: variant === 'critical',
            [`bg-[#e7f1fa] border border-[#2b9af3] text-[#2b9af3]`]: variant === 'information',
        },
        className
    );

    const loadingStyle = classNames(
        {
            [`bg-gray-500`]: variant === 'default',
            [`bg-[#3e8635]`]: variant === 'success',
            [`bg-[#f0ab00]`]: variant === 'warning',
            [`bg-primary`]: variant === 'critical',
            [`bg-[#2b9af3]`]: variant === 'information',
        },
    );

    return (
        <div className={`absolute top-0 right-0 z-[99999] ${className}`}>
            <div className="relative right-6 mt-4 z-[99999]">
                <div className={`animate-shake rounded-b-[10px] px-4 py-3 relative overflow-hidden ${outerElement}`}>
                    <div
                        className={`absolute top-0 left-0 h-1 ${loadingStyle} transition-all duration-300 ease-out`}
                        style={{ width: `${progress}%` }}
                    />
                    <div className="flex items-center">
                        {variant == 'critical' && <IoAlertCircleOutline className="h-5 w-5 mr-2" />}
                        {variant == 'default' && <CiBellOn className="h-5 w-5 mr-2" />}
                        {variant == 'success' && <IoIosCheckmarkCircleOutline className="h-5 w-5 mr-2" />}
                        {variant == 'warning' && <CiWarning className="h-5 w-5 mr-2" />}
                        {variant == 'information' && <IoIosInformationCircleOutline className="h-5 w-5 mr-2" />}
                        <p className="text-[18px] mr-4">{message}</p>
                        <IoClose className='text-[20px] text-gray-500 cursor-pointer hover:text-gray-400 transition-colors duration-250 ease-in-out p-0'
                            onClick={() => { setClose(false) }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Alert