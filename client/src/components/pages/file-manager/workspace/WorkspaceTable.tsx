import React from 'react'

interface WorkspaceTableProps {
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    data: Record<string, unknown>[]
}

const WorkspaceTable: React.FC<WorkspaceTableProps> = ({ data }) => {
    const formatHeader = (key: string): string => {
        const knownAcronyms = ['rm', 'total'];

        const words = key.split(/(?=[A-Z])|\s|_/).filter(word => word.length > 0);

        const formattedWords = words.map(word => {
            const lowerWord = word.toLowerCase();

            if (knownAcronyms.includes(lowerWord)) {
                return lowerWord.toUpperCase();
            }

            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });

        return formattedWords.join(' ').trim();
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full bg-white border-collapse">
                <thead className='bg-primary text-white'>
                    <tr>
                        {Object.keys(data[0]).map((key) => (
                            <th key={key} className={`${key == 'itemDescription' ? 'text-left' : (key == 'itemCode' || key == 'total') ? 'text-center' : 'text-right'} font-medium text-[20px] py-2 px-6 border-b border-gray-300`}>
                                {formatHeader(key)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border border-gray-300">
                            {Object.entries(row).map(([key, value], colIndex) => {
                                let textAlignClass = 'text-left';
                                if (typeof value === 'number') textAlignClass = 'text-right';
                                if (colIndex === 0 || key === 'total') textAlignClass = 'text-center';
                                return (
                                    <td
                                        key={key}
                                        className={`
                                            py-2 px-6 
                                            text-[20px] 
                                            ${textAlignClass} 
                                            border-l border-r border-gray-300
                                            ${colIndex === 0 ? 'border-l-0' : ''}
                                            ${colIndex === Object.keys(row).length - 1 ? 'border-r-0' : ''}
                                        `}
                                    >
                                        {renderValue(value)}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function renderValue(value: unknown): React.ReactNode {
    if (typeof value === 'string' || typeof value === 'boolean') {
        return String(value);
    }

    if (typeof value === 'number') {
        return value.toFixed(2);
    }

    if (value === null || value === undefined) {
        return '';
    }

    if (React.isValidElement(value)) {
        return value;
    }
    return JSON.stringify(value);
}

export default WorkspaceTable