import React, { useCallback, useEffect, useState } from 'react';
import { AiOutlineDown } from 'react-icons/ai';
import useOutsideClick from '@/hooks/useOutsideClick';
import api from '@/utils/api';
import { useFormulationContext } from '@/contexts/FormulationContext';

interface CustomCompareSelectProps {
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
  selectedOptions: string[];
  setAlertMessages?: React.Dispatch<React.SetStateAction<string[]>>;
}

interface Option {
  number: string;
  description: string;
  formulation_id: number;
  monthYear: number;
}

interface SelectedOption {
  text: string;
  formulation_id: number;
}

const CustomCompareSelect: React.FC<CustomCompareSelectProps> = ({
  setSelectedOptions,
  selectedOptions,
  setAlertMessages
}) => {
  const ref = useOutsideClick(() => setIsDropdownOpen(false));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setSelectedChoices, selectedChoices } = useFormulationContext();
  const [options, setOptions] = useState<Option[]>([]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await api.get('/formulations/retrieve_all_fg');
      if (response.data.status === 200) {
        const formulations = response.data.data;
        const newOptions = formulations.map((formulation: any) => ({
          number: formulation.formula_code,
          description: formulation.finishedGood.fg_desc,
          formulation_id: formulation.formulation_id,
          monthYear: formulation.monthYear
        }));
        setOptions(newOptions);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [selectedOptionObjects, setSelectedOptionObjects] = useState<SelectedOption[]>([]);

  // ... existing fetchData function ...

  const handleOptionClick = (option: Option) => {
    const optionText = `${option.description} (${option.number})`;

    setSelectedOptionObjects((prevOptions) => {
      const isSelected = prevOptions.some(item => item.formulation_id === option.formulation_id);
      if (isSelected) {
        return prevOptions.filter(item => item.formulation_id !== option.formulation_id);
      } else {
        if (prevOptions.length < 10) {
          return [...prevOptions, { text: optionText, formulation_id: option.formulation_id }];
        } else {
          setAlertMessages && setAlertMessages(prev => [...prev, 'You can only select up to 10 options.']);
          return prevOptions;
        }
      }
    });

    // Update setSelectedChoices based on the new selectedOptionObjects
    setSelectedChoices((prev) => {
      const updatedChoices = selectedOptionObjects.map(item => item.formulation_id);
      if (updatedChoices.includes(option.formulation_id)) {
        return updatedChoices.filter(id => id !== option.formulation_id);
      } else if (updatedChoices.length < 10) {
        return [...updatedChoices, option.formulation_id];
      }
      return prev;
    });
    setInputValue('');
  };

  // Update selectedOptions whenever selectedOptionObjects changes
  useEffect(() => {
    setSelectedOptions(selectedOptionObjects.map(item => item.text));
  }, [selectedOptionObjects, setSelectedOptions]);

  // const handleOptionClick = (option: Option) => {
  //   const optionText = `${option.description} (${option.number})`;

  //   setSelectedOptions((prevOptions) => {
  //     if (prevOptions.includes(optionText)) {
  //       setSelectedChoices(prev => prev.filter(id => id !== option.formulation_id));
  //       return prevOptions.filter(item => item !== optionText);
  //     } else {
  //       if (prevOptions.length < 10) {
  //         setSelectedChoices(prev => [...prev, option.formulation_id]);
  //         return [...prevOptions, optionText];
  //       } else {
  //         alert('You can only select up to 10 options.');
  //         return prevOptions;
  //       }
  //     }
  //   });
  //   setInputValue('');
  // };

  // const handleOptionClick = (option: { number: string; description: string }) => {
  //   const optionText = `${option.description} (${option.number})`;

  //   setSelectedOptions((prevOptions) => {
  //     if (prevOptions.includes(optionText)) {
  //       return prevOptions.filter(item => item !== optionText);
  //     } else {
  //       if (prevOptions.length < 10) {
  //         return [...prevOptions, optionText];
  //       } else {
  //         alert('You can only select up to 10 options.');
  //         return prevOptions;
  //       }
  //     }
  //   });
  //   setInputValue('');
  // };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setIsDropdownOpen(true);
  };

  const filteredOptions = options
    .filter(
      (option) =>
        option.description.toLowerCase().includes(inputValue.toLowerCase()) ||
        option.number.toLowerCase().includes(inputValue.toLowerCase())
    )
    .sort((a, b) => a.monthYear - b.monthYear);

  return (
    <div ref={ref} className="relative w-full font-lato z-[1000]">
      <div
        className="w-full rounded-[20px] border border-[#B6B6B6] bg-white dark:bg-[#3C3C3C] dark:border-[#5C5C5C] text-[#5C5C5C] dark:text-[#d1d1d1] cursor-pointer p-3"
        onClick={() => {
          setIsDropdownOpen(!isDropdownOpen);
        }}
      >
        <div className="flex flex-wrap items-center w-full">
          {selectedOptions.map((option, index) => (
            <span key={index} className="mr-1">
              {option}
              {index < selectedOptions.length - 1 || inputValue ? ',\u00A0' : ''}
            </span>
          ))}
          <input
            type="text"
            className={`min-w-[150px] flex-grow outline-none focus:ring-0 border-none pr-4 dark:bg-[#3C3C3C] dark:text-[#d1d1d1]`}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={inputValue === '' ? '➯ Select or type formulation...' : '➯'}
            value={inputValue}
          />
        </div>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <AiOutlineDown className="text-[#868686] text-[15px]" />
        </div>
      </div>
      {isDropdownOpen && (
        <div id="scroll-style" className="animate-pull-down absolute w-full bg-white dark:bg-[#3C3C3C] z-10 mt-1 border border-[#B6B6B6] dark:border-[#5C5C5C] dark:text-[#d1d1d1] drop-shadow-lg rounded-l-[10px] rounded-r-[5px] max-h-[180px] overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-[#4c4c4c]"
              >
                <label className="relative flex items-center p-3 rounded-full cursor-pointer"

                  onClick={() => handleOptionClick(option)}>
                  <input type="checkbox"
                    checked={selectedOptionObjects.some(item => item.formulation_id === option.formulation_id)}
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
                <span>{option.description} ({option.number})</span>
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

export default CustomCompareSelect;
