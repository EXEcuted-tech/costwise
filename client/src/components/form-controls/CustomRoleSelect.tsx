import React, { useState } from 'react';
import { AiOutlineDown } from 'react-icons/ai';
import useOutsideClick from '@/hooks/useOutsideClick';

interface CustomRoleSelectProps {
  setSelectedRoles: React.Dispatch<React.SetStateAction<string[]>>;
  selectedRoles: string[];
  setSelectedRoleValues: React.Dispatch<React.SetStateAction<number[]>>;
  selectedRoleValues: number[];
}

const CustomRoleSelect: React.FC<CustomRoleSelectProps> = ({
  setSelectedRoles,
  selectedRoles,
  setSelectedRoleValues,
  selectedRoleValues,
}) => {
  const ref = useOutsideClick(() => setIsDropdownOpen(false));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const options = [
    { role: 'Create Account', description: 'User can create an account.', value: 0 },
    { role: 'Update Account', description: "User can update a user's information", value: 1 },
    { role: 'View Account', description: 'User can view user information.', value: 2 },
    { role: 'Archive Account', description: 'User can archive a user.', value: 3 },
    { role: 'View Audit Log', description: 'User can view audit logs.', value: 4 },
    { role: 'View File', description: 'User can view files.', value: 5 },
    { role: 'Upload File', description: 'User can upload files.', value: 6 },
    { role: 'Edit File', description: 'User can edit files.', value: 7 },
    { role: 'Archive File', description: 'User can archive files.', value: 8 },
    { role: 'View Formula', description: 'User can view formulas.', value: 9 },
    { role: 'Upload Formula', description: 'User can upload formulas.', value: 10 },
    { role: 'Edit Formula', description: 'User can edit formulas.', value: 11 },
    { role: 'Archive Formula', description: 'User can archive formulas.', value: 12 },
    { role: 'View Event', description: 'User can view events.', value: 13 },
    { role: 'Create Event', description: 'User can create events.', value: 14 },
    { role: 'Edit Event', description: 'User can edit events.', value: 15 },
    { role: 'Archive Event', description: 'User can archive events.', value: 16 },
    { role: 'Export File/Record', description: 'User can export files/records.', value: 17 },
  ];

  const handleOptionClick = (option: { role: string, value: number; description: string }) => {
    const optionText = `${option.role}`;

    setSelectedRoles((prevOptions) => {
      if (prevOptions.includes(optionText)) {
        return prevOptions.filter(item => item !== optionText);
      } else {
        return [...prevOptions, optionText];
      }
    });

    setSelectedRoleValues((prevValues: number[]): number[] => {
      if (prevValues.includes(option.value)) {
        return prevValues.filter(value => value !== option.value);
      } else {
        return [...prevValues, option.value];
      }
    });
    setInputValue('');
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setIsDropdownOpen(true);
  };

  const filteredOptions = options.filter(
    (option) =>
      option.role.toLowerCase().includes(inputValue.toLowerCase()) ||
      option.description.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div ref={ref} className="relative w-full font-lato z-[1000]">
      <div
        className="w-full rounded-lg border border-[#B6B6B6] bg-white dark:bg-[#3C3C3C] text-[#5C5C5C] cursor-pointer p-2"
        onClick={() => {
          setIsDropdownOpen(!isDropdownOpen);
        }}
      >
        <div className="flex flex-wrap items-center">
          {/* {selectedRoles.map((role, index) => (
            <span key={index} className="mr-1 font-semibold animate-fade-in3">
              {role}
              {index < selectedRoles.length - 1 || inputValue ? ',\u00A0' : ''}
            </span>
          ))} */}
          <input
            type="text"
            className={`min-w-[150px] outline-none focus:ring-0 border-none pr-4 dark:bg-[#3C3C3C] dark:text-white`}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={inputValue === '' ? '➯ Select or type role...' : '➯'}
            value={inputValue}
          />
        </div>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <AiOutlineDown className="text-[#868686] text-[15px]" />
        </div>
      </div>
      {isDropdownOpen && (
        <div id="scroll-style" className="animate-pull-down absolute w-full bg-white dark:bg-[#3C3C3C] dark:text-white z-10 mt-1 border border-[#B6B6B6] drop-shadow-lg rounded-l-[10px] rounded-r-[5px] max-h-[180px] overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                className="flex items-center p-2 hover:bg-gray-100 hover:dark:bg-[#3C3C3C]"
              >
                <label className="relative flex items-center p-3 rounded-full cursor-pointer"

                  onClick={() => handleOptionClick(option)}>
                  <input type="checkbox"
                    checked={selectedRoles.includes(`${option.role}`)}
                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-[#686868] transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-[#3A7CA0] checked:bg-[#3A7CA0] checked:before:bg-gray-900 hover:before:opacity-10"
                    id="check" />
                  <span
                    className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                      stroke="currentColor" stroke-width="1">
                      <path fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"></path>
                    </svg>
                  </span>
                </label>
                <span> {option.role}</span> <span className='text-[#838383] italic ml-2'> : </span> 
                <span className='text-[#838383] italic ml-2'> {option.description}</span>
              </div>
            ))
          ) : (
            <div className="p-2 text-center text-gray-500">No options found</div>
          )}
        </div>
      )}

    </div>
  );
};

export default CustomRoleSelect;
