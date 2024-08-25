import React from 'react';

type AllFGrops = {
    isOpen?: boolean;
};

const AllFG: React.FC<AllFGrops> = ({ isOpen }) => {
    return (       
        <div className={`${isOpen ? 'xl:mx-[2rem]' : '' } relative w-auto h-[35rem] ml-[5rem] mr-[35px] mb-10 bg-white rounded-2xl border-1 border-[#656565] shadow-md animate-fade-in2`}>
            <div className='h-14 rounded-t-2xl bg-[#B22222] text-white text-[26px] font-bold py-2 pl-7 uppercase'>
                <p>HOTDOGGG</p>
            </div>
        </div>
    )
}

export default AllFG;