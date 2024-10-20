import React, { useEffect, useState, useMemo } from 'react'
import { AiOutlineSearch } from 'react-icons/ai';
import { BiSolidFile } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import CustomDatePicker from '../form-controls/CustomDatePicker';
import CustomSelect from '../form-controls/CustomSelect';
import { useSidebarContext } from '@/contexts/SidebarContext';
import api from '@/utils/api';
import { File, FileSettings } from '@/types/data';
import { FaFileCircleXmark } from 'react-icons/fa6';
import Spinner from '@/components/loaders/Spinner';
import { useRouter } from 'next/navigation';

interface ChooseFileProps {
  dialogType: number;
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChooseFileDialog: React.FC<ChooseFileProps> = ({ dialogType, setDialog }) => {
  const { isOpen } = useSidebarContext();
  const [selectedOption, setSelectedOption] = useState('all');
  const [chosen, setChosen] = useState('');
  const [fileData, setFileData] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [chosenFileId, setChosenFileId] = useState(0);
  const [chosenFileType, setChosenFileType] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let response;

        if (selectedOption === 'all') {
          response = await api.get('/files/retrieve_all');
        } else if (selectedOption === 'masterfile') {
          response = await api.get('/files/retrieve', {
            params: { col: 'file_type', value: 'master_file' },
          });
        } else if (selectedOption === 'transactions') {
          response = await api.get('/files/retrieve', {
            params: { col: 'file_type', value: 'transactional_file' },
          });
        }

        if (response && response.data.status === 200) {
          setFileData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedOption]);

  const processedFileData = useMemo(() => {
    return fileData.map((file) => {
      try {
        const settings = JSON.parse(file.settings);
        return {
          ...file,
          fileName: settings.file_name || '',
          addedBy: settings.user || '',
        };
      } catch (error) {
        console.error('Error parsing settings JSON:', error);
        return { ...file, fileName: '', addedBy: '' };
      }
    });
  }, [fileData]);

  const filteredData = processedFileData.filter((file) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = (
      file.fileName.toLowerCase().includes(searchTermLower) ||
      file.addedBy.toLowerCase().includes(searchTermLower) ||
      file.file_type.toLowerCase().includes(searchTermLower)
    );

    const matchesDate = !selectedDate || (file.created_at && file.created_at.startsWith(selectedDate));

    return matchesSearch && matchesDate;
  });

  const handleSetFile = (fileName: string, id:number, type:string) => {
    setChosen(fileName);
    setChosenFileId(id);
    setChosenFileType(type);
  };

  const handleChooseFile = () => {
    console.log(chosenFileId, chosenFileType);
    router.push(`/file-manager/workspace?id=${chosenFileId}&type=${chosenFileType}`);
  };

  return (
    <>
      <div className={`flex items-center justify-center w-full h-full top-0 left-0 fixed backdrop-brightness-50 z-[1000]`}>
        <div className='mx-[50px] 2xl:mx-0 animate-pop-out bg-white w-[1100px] h-[860px] rounded-[20px]'>
          {/* Title Section */}
          <div className='flex items-center py-[10px] px-[30px]'>
            <div className='mr-[5px]'>
              <BiSolidFile className='text-[35px] text-[#383838]' />
            </div>
            <div className='flex-grow'>
              <h1 className='text-[#383838] font-bold text-[35px]'>{dialogType == 0 ? 'File List' : 'Master File List'}</h1>
            </div>
            <div className='ml-auto'>
              <IoClose className='text-[60px] text-[#CECECE] cursor-pointer hover:text-[#b3b3b3] transition-colors duration-250 ease-in-out p-0'
                onClick={() => setDialog(false)} />
            </div>
          </div>

          {/* Filter and Settings */}
          <div className='flex items-center px-[30px] pb-[20px]'>
            <div className={`w-[50%] relative mr-[1%]`}>
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                <AiOutlineSearch className="text-[#B0B0B0] text-[22px]" />
              </div>
              <input
                type="text"
                className="w-full pl-[35px] pr-[5px] bg-white border border-[#868686] placeholder-text-[#B0B0B0] text-[#5C5C5C] text-[15px] rounded-[5px] py-[3px]"
                placeholder="Search here..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                required
              />
            </div>

            {dialogType == 0 &&
              <div className={`w-[23%] 2xl:w-[20%] relative mr-[1%]`}>
                <CustomSelect
                  setSelectedOption={setSelectedOption}
                  selectedOption={selectedOption} />
              </div>
            }
            <div className={`w-[20%] 2xl:w-[18%] relative`}>
              <CustomDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            </div>
          </div>

          {/* Table */}
          <div className='overflow-auto h-[645px]'>
            <table className='w-full'>
              <thead className={`
                ${isOpen && 'text-[14px] 2xl:text-[16px]'} 
                sticky top-0 
                bg-white 
                text-left 
                font-bold 
                text-[#868686]
                before:content-[''] 
                before:absolute 
                before:left-0 
                before:right-0 
                before:bottom-0 
                before:h-[0.6px] 
                before:bg-[#868686]
                after:content-[''] 
                after:absolute 
                after:left-0 
                after:right-0 
                after:top-0 
                after:h-[0.6px] 
                after:bg-[#868686]
              `}>
                <tr className=''>
                  <th className={`${isOpen ? 'pl-[20px] 2xl:pl-[46px]' : 'pl-[46px]'} py-[5px]`}>Title/Name</th>
                  <th className=''>File Type</th>
                  <th className=''>Date Added</th>
                  <th className=''>Added By</th>
                </tr>
              </thead>
              {isLoading ? (
                <tbody>
                  <tr>
                    <td colSpan={4}>
                      <div className="flex justify-center items-center h-[550px]">
                        <Spinner />
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {filteredData.length > 0
                    ? (filteredData.map((data, index) => {
                      let settings: FileSettings;
                      try {
                        settings = JSON.parse(data.settings);
                      } catch (error) {
                        console.error('Error parsing settings:', error);
                        settings = {} as FileSettings;
                      }

                      const fileLabel = settings.file_name;
                      const fileName = settings.file_name_with_extension;
                      const fileType = data.file_type == 'master_file' ? 'Master File' : 'Transactional File';
                      const dateAdded = data.created_at &&
                        new Date(data.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          timeZone: 'UTC',
                        });
                      const addedBy = settings.user;
                      return (
                        <tr key={index} className={`${chosen == fileName && 'bg-[#DFEFFD]'} cursor-pointer hover:bg-[#DFEFFD]
                          ${index !== filteredData.length - 1 && 'border-b-[0.3px] border-[#d9d9d9] '}`}
                          onClick={() => handleSetFile(fileName,data.file_id,data.file_type)}>
                          <td className={`${isOpen ? 'pl-[20px] 2xl:pl-[46px]' : 'pl-[46px]'} py-2`}>
                            <p className={`${isOpen ? 'text-[16px] 2xl:text-[18px]' : 'text-[18px]'} text-primary`}>{fileLabel}</p>
                            <p className={`${isOpen && 'text-[14px] 2xl:text-[16px]'}italic text-[#868686]`}>{fileName}</p>
                          </td>
                          <td className={`${isOpen && 'text-[14px] 2xl:text-[16px]'}`}>{fileType}</td>
                          <td className={`${isOpen && 'text-[14px] 2xl:text-[16px]'}`}>{dateAdded}</td>
                          <td className={`${isOpen && 'text-[14px] 2xl:text-[16px]'}`}>{addedBy}</td>
                        </tr>
                      )
                    }))
                    : (
                      <tr>
                        <td colSpan={4} className='text-center'>
                          <div className='min-h-[550px] flex flex-col justify-center items-center p-12 font-semibold text-[#9F9F9F]'>
                            <FaFileCircleXmark className='text-[75px]' />
                            <p className='text-[30px]'>No File Found.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                </tbody>
              )}
            </table>
          </div>

          {/* Button */}
          <div className='border-t-1 border-[#d9d9d9] flex justify-center py-[20px]'>
            <div className="relative inline-flex bg-white overflow-hidden text-primary flex items-center justify-center rounded-[30px] cursor-pointer transition-all rounded group"
              onClick={handleChooseFile}>
              <button className="text-[22px] font-bold before:ease relative px-[30px] py-[2px] h-full w-full overflow-hidden bg-primary text-white shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-primary hover:before:-translate-x-40">
                <span className="relative z-10">Choose File</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChooseFileDialog