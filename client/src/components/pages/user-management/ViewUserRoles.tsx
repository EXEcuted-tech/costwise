import React, { useEffect, useState } from 'react'
import { IoIosClose } from "react-icons/io";
import CustomRoleSelect from '../../form-controls/CustomRoleSelect';
import { BsPersonLock } from 'react-icons/bs';
import { CiSquareCheck } from "react-icons/ci";
import api from '@/utils/api';

interface AddUserRolesProps { 
  user_id: number;
  onClose: () => void;
}

const ViewUserRoles: React.FC<AddUserRolesProps> = ({ onClose, user_id }) => {
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCloseModal = () => {
    onClose();
  };

  const getRoleName = (roleId: number): string => {
    const roleNames: { [key: number]: string } = {
        0: 'Create Account',
        1: 'Update Account',
        2: 'View Account',
        3: 'Archive Account',
        4: 'View Audit Log',
        5: 'View File',
        6: 'Upload File',
        7: 'Edit File',
        8: 'Archive File',
        9: 'View Formula',
        10: 'Upload Formula',
        11: 'Edit Formula',
        12: 'Archive Formula',
        13: 'View Event',
        14: 'Create Event',
        15: 'Edit Event',
        16: 'Archive Event',
        17: 'Export File/Record'
    };
    return roleNames[roleId] || 'Unknown Role';
};
  const fetchRoles = async () => {
    try {
        const response = await api.get(`/user/roles`, {
            params: {
                user_id: user_id
            }
        })
        setRoles(response.data.map(getRoleName));
    } catch (error) {
    }
  }


  return (
    <div className='flex items-center justify-center w-full h-full top-0 left-0 fixed backdrop-brightness-50 z-[1000]'>
      <div className='animate-pop-out flex flex-col bg-white w-[850px] h-auto rounded-[20px] px-[10px] overflow-y-auto'>
        <div className='flex justify-end'>
          <IoIosClose className='text-[60px] text-[#CECECE] cursor-pointer hover:text-[#b3b3b3] transition-colors duration-250 ease-in-out'
            onClick={handleCloseModal} />
        </div>
        <div className='flex justify-center '>
          <BsPersonLock className='text-[55px] text-[#5B5353]' />
        </div>
        <div className='flex flex-col justify-center items-center pb-[20px]'>
          <h1 className='font-black text-[28px]'>User Roles</h1>
          <p className='text-center text-[#9D9D9D] text-[18px] px-[30px]'>
            These are the roles (permissions) assigned to you.
          </p>
        </div>

          {/* Selected Roles */}
          <div className='w-full px-4 mb-5'>
            <div className='border border-[#B6B6B6] px-4 rounded-lg h-[270px] overflow-y-auto'>
              <div className='grid grid-cols-3 gap-x-4 gap-y-2 p-3'>
                {roles.map((role, index) => (
                  <div key={index} className='flex items-center pl-3 animate-zoomIn'>
                    <CiSquareCheck className='text-primary text-[19px] mr-2 flex-shrink-0' />
                    <p className=' text-[21px] truncate'>{role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default ViewUserRoles