import React, { useEffect, useState } from 'react'
import { IoIosClose } from "react-icons/io";
import CustomRoleSelect from '../../form-controls/CustomRoleSelect';
import { BsPersonLock } from 'react-icons/bs';
import { CiSquareCheck } from "react-icons/ci";

interface AddUserRolesProps { 
  onConfirm: (roles: number[], roleNames: string[], userType: string) => void;
  onClose: () => void;
  initialSelectedRoles: string[];
  initialSelectedRoleValues: number[];
}

export interface CheckboxState {
  allRoles: boolean;
  accounts: boolean;
  audit: boolean;
  files: boolean;
  formulations: boolean;
  events: boolean;
  export: boolean;
}

const AddUserRoles: React.FC<AddUserRolesProps> = ({ 
  onClose, 
  onConfirm, 
  initialSelectedRoles, 
  initialSelectedRoleValues, 
}) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(initialSelectedRoles);
  const [selectedRoleValues, setSelectedRoleValues] = useState<number[]>(initialSelectedRoleValues);    
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState<CheckboxState>(
    getInitialCheckboxStates(initialSelectedRoleValues)
);
const [selectedUserType, setSelectedUserType] = useState<string>('Regular');

  const handleCloseModal = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(selectedRoleValues, selectedRoles, selectedUserType);
    onClose();
  }

  function getInitialCheckboxStates(roles: number[]): CheckboxState {
    return {
        allRoles: roles.length === 13,
        accounts: roles.some(r => [0,1,2,3].includes(r)),
        audit: roles.includes(4),
        files: roles.some(r => [5,6,7,8].includes(r)),
        formulations: roles.some(r => [9,10,11,12].includes(r)),
        events: roles.some(r => [13,14,15,16].includes(r)),
        export: roles.includes(17)
    };
}

  const roleMap: { [key: string]: { ids: number[], names: string[] } } = {
    accounts: { ids: [0, 1, 2, 3], names: ['Create Account', 'Update Account', 'View Account', 'Archive Account'] },
    audit: { ids: [4], names: ['View Audit Log'] },
    files: { ids: [5, 6, 7, 8], names: ['View File', 'Upload File', 'Edit File', 'Archive File'] },
    formulations: { ids: [9, 10, 11, 12], names: ['View Formula', 'Upload Formula', 'Edit Formula', 'Archive Formula'] },
    events : { ids: [13, 14, 15, 16], names: ['View Event', 'Create Event', 'Edit Event', 'Archive Event'] },
    export: { ids: [17], names: ['Export File/Record'] }
  };

  const handleCheckCategory = (category: keyof CheckboxState, e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setCheckboxStates(prev => ({...prev, [category]: isChecked}));

    if (category === 'allRoles') {
      setIsAllChecked(isChecked);
      if (isChecked) {
        setSelectedRoles(Object.values(roleMap).flatMap(r => r.names));
        setSelectedRoleValues(Object.values(roleMap).flatMap(r => r.ids));
        setCheckboxStates({ allRoles: true, accounts: true, audit: true, files: true, formulations: true, events: true, export: true });
      } else {
        setSelectedRoles([]);
        setSelectedRoleValues([]);
        setCheckboxStates({ allRoles: false, accounts: false, audit: false, files: false, formulations: false, events: false, export: false });
      }
    } else {
      const { ids, names } = roleMap[category];
      setSelectedRoles(prev => 
        isChecked ? Array.from(new Set([...prev, ...names])) : prev.filter(role => !names.includes(role))
      );
      setSelectedRoleValues(prev => 
        isChecked ? Array.from(new Set([...prev, ...ids])) : prev.filter(id => !ids.includes(id))
      );
    }
  };

  const handleClearAll = () => {
    setSelectedRoles([]);
    setSelectedRoleValues([]);
    setCheckboxStates({ allRoles: false, accounts: false, audit: false, files: false, formulations: false, events: false, export: false });
    setIsAllChecked(false);
  };

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
        document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUserType = e.target.value;
    setSelectedUserType(newUserType);
    
    if (newUserType === 'Admin') {
      setIsAllChecked(true);
      setSelectedRoles(Object.values(roleMap).flatMap(r => r.names));
      setSelectedRoleValues(Object.values(roleMap).flatMap(r => r.ids));
      setCheckboxStates({ allRoles: true, accounts: true, audit: true, files: true, formulations: true, events: true, export: true });
    }
  };
  
  return (
    <div className='flex items-center justify-center w-full h-full top-0 left-0 fixed backdrop-brightness-50 z-[1000]'>
      <div className='animate-pop-out flex flex-col bg-white dark:bg-[#3C3C3C] w-[950px] h-auto rounded-[20px] px-[10px] overflow-y-auto'>
        <div className='flex justify-end'>
          <IoIosClose className='text-[60px] text-[#CECECE] cursor-pointer hover:text-[#b3b3b3] transition-colors duration-250 ease-in-out'
            onClick={handleCloseModal} />
        </div>
        <div className='flex justify-center '>
          <BsPersonLock className='text-[55px] text-[#5B5353]' />
        </div>
        <div className='flex flex-col justify-center items-center pb-[20px]'>
          <h1 className='font-black text-[28px] dark:text-white'>Assign User Roles</h1>
          <p className='text-center text-[#9D9D9D] dark:text-[#d1d1d1] text-[17px] px-[30px]'>
            Select the user&apos;s type and roles (access rights) you want to assign to the user.
          </p>
        </div>

        <div className='flex flex-row justify-center items-center gap-[10px] mb-2'>
          <p className='text-[17px] dark:text-white'>User Type: <span className='text-[#B22222] ml-1 font-bold'>*</span></p>
          <select className='w-[150px] text-[17px] rounded-lg border border-gray-300 p-1'
            value={selectedUserType}
            onChange={handleUserTypeChange}
          >
            <option value="Regular">Regular</option>
            <option value="Admin">Super Admin</option>
          </select>
        </div>

        {/* Role Select */}
        <div className='flex flex-row justify-between px-[30px] mt-2'>
          <div className='w-[48%]'>
            <h2 className='font-bold text-[22px] mb-3 dark:text-white'>Select Roles</h2>
            <CustomRoleSelect 
              selectedRoles={selectedRoles}
              setSelectedRoles={setSelectedRoles}
              selectedRoleValues={selectedRoleValues}
              setSelectedRoleValues={setSelectedRoleValues}
            />
            {/* CheckBoxes */}
            <div className='flex mt-4 ml-1 gap-[6rem]'>
              <div className='grid grid-cols-2 gap-5 dark:text-white'>
                <div className='flex items-center'>
                    <input 
                      type="checkbox"
                      className='w-5 h-5 mr-3 rounded bg-primary text-primary focus:ring-primary focus:ring-1'
                      onChange={(e) => handleCheckCategory('allRoles', e)}
                      checked={checkboxStates.allRoles}
                    />
                    <label className='text-[17px]'>All Roles</label>
                  </div>

                  <div className='flex items-center'>
                    <input 
                      type="checkbox"
                      className={'w-5 h-5 mr-3 rounded bg-primary text-primary focus:ring-primary focus:ring-1'}
                      onChange={(e) => handleCheckCategory('accounts', e)}
                      disabled={isAllChecked}
                      checked={checkboxStates.accounts}
                    />
                    <label className='text-[17px]'>All Accounts Roles</label>
                  </div>

                  <div className='flex items-center'>
                    <input 
                      type="checkbox"
                      className='w-5 h-5 mr-3 rounded bg-primary text-primary focus:ring-primary focus:ring-1'
                      onChange={(e) => handleCheckCategory('audit', e)}
                      disabled={isAllChecked}
                      checked={checkboxStates.audit}
                    />
                    <label className='text-[17px]'>View Audit Log</label>
                  </div>

                  <div className='flex items-center'>
                    <input 
                      type="checkbox"
                      className='w-5 h-5 mr-3 rounded bg-primary text-primary focus:ring-primary focus:ring-1'
                      onChange={(e) => handleCheckCategory('files', e)}
                      disabled={isAllChecked}
                      checked={checkboxStates.files}
                    />
                    <label className='text-[17px]'>All File Roles</label>
                  </div>

                  <div className='flex items-center'>
                    <input 
                      type="checkbox"
                      className='w-5 h-5 mr-3 rounded bg-primary text-primary focus:ring-primary focus:ring-1'
                      onChange={(e) => handleCheckCategory('formulations', e)}
                      disabled={isAllChecked}
                      checked={checkboxStates.formulations}
                    />
                    <label className='text-[17px]'>All Formulations Roles</label>
                  </div>

                  <div className='flex items-center'>
                    <input 
                      type="checkbox"
                      className='w-5 h-5 mr-3 rounded bg-primary text-primary focus:ring-primary focus:ring-1'
                      onChange={(e) => handleCheckCategory('events', e)}
                      disabled={isAllChecked}
                      checked={checkboxStates.events}
                    />
                    <label className='text-[17px]'>All Events Roles</label>
                  </div>

                  <div className='flex items-center'>
                    <input 
                      type="checkbox"
                      className='w-5 h-5 mr-3 rounded bg-primary text-primary focus:ring-primary focus:ring-1'
                      onChange={(e) => handleCheckCategory('export', e)}
                      disabled={isAllChecked}
                      checked={checkboxStates.export}
                    />
                    <label className='text-[17px]'>Export File/Record</label>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Roles */}
          <div className='w-[48%]'>
            <div className='flex justify-between mb-3'>
              <h2 className='font-bold text-[22px] dark:text-white'>Selected Roles</h2>
                <button 
                  className='text-[17px] bg-gray-200 text-[#5B5353] px-4 py-1 rounded-lg border border-gray-300 hover:bg-gray-300 cursor-pointer transition-colors duration-300 ease-in-out'
                  onClick={handleClearAll}
                >Clear All</button>
            </div>
            <div className='border border-[#B6B6B6] px-4 rounded-lg h-[250px] overflow-y-auto'>
              <div className='grid grid-cols-2 gap-x-4 gap-y-2 p-3'>
                {selectedRoles.map((role, index) => (
                  <div key={index} className='flex items-center animate-fade-in3 dark:text-[#d1d1d1]'>
                    <CiSquareCheck className='text-primary text-[19px] mr-2 flex-shrink-0' />
                    <p className=' text-[19px] truncate'>{role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className='mt-8 px-9 mb-8 grid grid-cols-2 gap-9'>
          <div className="relative bg-white border-1 border-primary overflow-hidden text-primary flex items-center justify-center  cursor-pointer transition-all rounded-lg group"
            onClick={handleCloseModal}
          >
            <button className="text-[19px] font-black before:ease relative h-12 w-full overflow-hidden bg-white text-primary shadow-2xl transition-all hover:bg-[#FFD3D3] before:absolute before:right-0 before:top-0 before:h-12 before:w-20 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-white hover:before:-translate-x-40">
              <span className="relative z-10">Cancel</span>
            </button>
          </div>
          <div className="relative bg-white border-1 border-primary overflow-hidden text-primary flex items-center justify-center cursor-pointer transition-all rounded-lg group"
            >
            <button 
              className="text-[19px] font-black before:ease relative h-12 w-full overflow-hidden bg-primary text-white shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-primary hover:before:-translate-x-[450px]"
              onClick={handleConfirm}
            >
              <span className="relative z-10">Confirm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddUserRoles