import React from 'react';

interface LoaderProps {
    className?: string;
}

const Loader: React.FC<LoaderProps> = ({ className }) => {
    return (
        <div
            className={`w-full h-12 rounded-lg bg-gradient-to-r from-gray-300 dark:from-gray-200 via-gray-200 dark:via-gray-300 to-gray-200 dark:to-[#d1d1d1] animate-pulse ${className}`}
        ></div>
    );
};

export default Loader;