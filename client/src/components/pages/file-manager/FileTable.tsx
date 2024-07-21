import React from 'react'

const FileTable:React.FC<{ tab: string }> = ({tab}) => {
    return (
        <div className='bg-white w-full rounded-lg drop-shadow-lg'>
            {/* Title */}
            <h1 className='font-bold text-[32px] ml-[46px] py-[2px]'>
            {tab==='all' ? 'All Files' : tab === 'masterfile' ? 'Master Files': 'Transactional Files'}
            </h1>
            <div>

            </div>
        </div>
    )
}

export default FileTable