import React from 'react';

interface LoaderProps {
    className?: string;
}

const Loader: React.FC<LoaderProps> = ({ className }) => {
    return (
        <div
            className={`w-full h-12 rounded-lg bg-gradient-to-r from-gray-300 via-gray-200 to-gray-200 animate-pulse ${className}`}
        ></div>
    );
};

export default Loader;