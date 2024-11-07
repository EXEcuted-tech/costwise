import React, { useEffect, useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { FaFilePen } from "react-icons/fa6";
import { BiSolidSave } from "react-icons/bi";
import { ReleaseNote } from '@/types/data';
import api from '@/utils/api';
import Alert from '../alerts/Alert';

interface CreateReleaseNotesProps {
    setCreateNotes: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateReleaseNotes: React.FC<CreateReleaseNotesProps> = ({setCreateNotes}) => {

    const [title, setTitle] = useState("");
    const [version, setVersion] = useState("");
    const [user_id, setUserId] = useState("");
    const [user, setUser] = useState("");
    const [notes, setNotes] = useState<ReleaseNote[]>([]);
    const [noteContent, setNoteContent] = useState<{[key: string]: string}>({
        Added: '',
        Updated: '',
        Removed: ''
    });
    const [currentNoteType, setCurrentNoteType] = useState<string>("Added");
    const [currentNote, setCurrentNote] = useState<string>("");

    const [alertMessages, setAlertMessages] = useState<string[]>([]);
    const [alertStatus, setAlertStatus] = useState<string>('');
    const [titleError, setTitleError] = useState(false);
    const [versionError, setVersionError] = useState(false);
    const [contentError, setContentError] = useState(false);
    const [isSelected, setIsSelected] = useState(true);

    //Handle input changes
    const handleNoteTypeClick = (noteType: string) => {
        setCurrentNoteType(noteType);
        setIsSelected(true);
    }

    const handleTitleChange = (title: string) => {
        setTitle(title);
    }

    const handleVersionChange = (version: string) => {
        setVersion(version);
    }

    const handleNoteContentChange = (content: string) => {
        setCurrentNote(content);
        setNoteContent(prev => ({
            ...prev,
            [currentNoteType]: content
        }));
    }

    const formatContent = (content: {[key: string]: string}): string => {
        const formattedContent: { [key: string]: string[] } = {
            added: [],
            updated: [],
            removed: []
        };

        const hasAnyContent = Object.values(content).some(value => value.trim() !== '');

        Object.entries(content).forEach(([key, value]) => {
            if (value.trim()) {
                formattedContent[key.toLowerCase()].push(value.trim());
            } else if (hasAnyContent) {
                formattedContent[key.toLowerCase()].push("No changes.");
            }
        });

        return JSON.stringify(formattedContent);
    }

    useEffect(() => {
        getCurrentUser();
    }, []);

    //Get current user
    const getCurrentUser = async () => {
        try {
            const response = await api.get('/user');
            if (response) {
                const userData = response.data;
                const fullName = [userData.first_name, userData.middle_name, userData.last_name]
                    .filter(Boolean)
                    .join(' ');
                setUser(fullName);
                setUserId(userData.user_id);
            } 
        } catch (error) {
            setAlertMessages(["Failed to get current user"]);
            setAlertStatus("critical");
        }
    }

    //Create release note
    const handleSubmit = async () => {
        const newAlertMessages: string[] = [];

        //Reset errors
        setTitleError(false);
        setVersionError(false);
        setContentError(false);

        //Check errors
        if (!title && !version && !noteContent) {
            newAlertMessages.push("All fields are required");
            setAlertStatus("critical");
            setTitleError(true);
            setVersionError(true);
            setContentError(true);
            return;
        }

        if (Object.values(noteContent).every(content => content.trim() === '')) {
            newAlertMessages.push("At least one section must have content");
            setAlertStatus("critical");
            setContentError(true);
        }

        if (title === "") {
            newAlertMessages.push("Title is required");
            setTitleError(true);
            setAlertStatus("critical");
        }
        if (version === "") {
            newAlertMessages.push("Version is required");
            setVersionError(true);
            setAlertStatus("critical");
        }
        if (newAlertMessages.length > 0) {
            setAlertMessages(newAlertMessages);
            return;
        }

        try {
            const formattedContent = formatContent(noteContent);
            const response = await api.post('/release_note/create', {
                title: title,
                version: version,
                content: formattedContent,
                user_id: user_id
            });

            if (response.status === 200) {
                setAlertMessages(["Release note created successfully"]);
                setAlertStatus("success");

                //Reset form fields
                setTitle("");
                setVersion("");

                window.location.reload();
            }
        } catch (error) {
            setAlertMessages(["Failed to create release note"]);
            setAlertStatus("critical");
        }

    }

    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setCreateNotes(false);
            }
        };
        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [setCreateNotes]);

    return (
        <div className='flex justify-center items-center z-[1000] w-full h-full fixed overflow-auto top-0 left-0 bg-[rgba(0,0,0,0.5)]'>
            <div className='absolute top-0 right-0'>
                {alertMessages && alertMessages.map((msg, index) => (
                <Alert className="!relative" variant={alertStatus as "default" | "information" | "warning" | "critical" | "success" | undefined} key={index} message={msg} setClose={() => {
                    setAlertMessages(prev => prev.filter((_, i) => i !== index));
                }} />
                ))}
            </div>
            <div className="flex flex-col w-[70%] 2xl:w-[60%] 3xl:w-[50%] h-[750px] bg-white dark:bg-[#3C3C3C] rounded-[20px] animate-pop-out drop-shadow">

                {/* Header */}
                <div className='flex items-center rounded-[20px] h-[10%] bg-[#F5F5F5] dark:bg-[#121212] text-[27px] font-bold'>
                    <div className='flex items-center w-full h-full ml-[20px] gap-[10px]'>
                        <FaFilePen className='text-[#777777] dark:text-[#d1d1d1] text-[30px]' />
                        <p className='dark:text-white'>Create Release Note</p>
                    </div>
                    <IoIosClose className='mt-[2px] text-[70px] text-[#CECECE] cursor-pointer hover:text-[#b3b3b3] transition-colors duration-250 ease-in-out'
                        onClick={()=>setCreateNotes(false)}/>
                </div>

                <div className="h-full ">
                    {/* Title Area */}
                    <div className='flex flex-row mt-4 mb-4 dark:text-white '>
                        <div className='flex h-[13%] items-center text-[25px] font-bold px-[30px] gap-[30px]'>
                            <p className='flex'>Title: <span className='text-[#B22222] ml-1 font-bold'>*</span></p>
                            <input 
                                className={` ${titleError ? 'border-red-500 border-2' : 'border-[###777777] focus:border-[#777777]'} w-[80%] h-[60%] py-1 px-[20px] rounded-xl border drop-shadow-lg`}
                                placeholder='Release Note Title'
                                onChange={(e) => handleTitleChange(e.target.value)}
                            ></input>
                            <div className='flex items-center text-[25px] font-bold gap-[20px]'>
                                <p className='flex'>Version: <span className='text-[#B22222] ml-1 font-bold'>*</span></p>
                                <input 
                                    className={` ${versionError ? 'border-red-500 border-2' : 'border-[###777777] focus:border-[#777777]'} w-[30%] h-[60%] py-1 px-[10px] rounded-xl border drop-shadow-lg`}
                                    placeholder='1.0'
                                    step='0.1'
                                    type='number'
                                    min="1"
                                    onChange={(e) => handleVersionChange(e.target.value)}
                                ></input>
                            </div>
                        </div>
                    </div>
                    <div className='h-[3rem] px-[30px] mt-[25px]'>
                        <div className='flex gap-[20px] text-[22px] font-medium'>
                            <span>Sections: </span>
                            {['Added', 'Updated', 'Removed'].map((type) => {
                                let activeColor, activeTextColor, inactiveColor;
                                switch (type) {
                                    case 'Added':
                                        activeColor = 'bg-[#9EE29E] hover:bg-[#86c386]';
                                        activeTextColor = 'text-[#007100]';
                                        inactiveColor = 'bg-[#C8E6C9] hover:bg-[#b3d3b3]';
                                        break;
                                    case 'Updated':
                                        activeColor = 'bg-[#90CAF9] hover:bg-[#79b3d3]';
                                        activeTextColor = 'text-[#1565C0]';
                                        inactiveColor = 'bg-[#BBDEFB] hover:bg-[#a3c3d3]';
                                        break;
                                    case 'Removed':
                                        activeColor = 'bg-[#EF9A9A] hover:bg-[#d38686]';
                                        activeTextColor = 'text-[#B71C1C]';
                                        inactiveColor = 'bg-[#FFCDD2] hover:bg-[#e3b3b3]';
                                        break;
                                }
                                return (
                                    <button 
                                        key={type}
                                        className={`px-[20px] py-[1px] rounded-full font-bold drop-shadow-lg ${
                                            currentNoteType === type 
                                                ? `${activeColor} ${activeTextColor}` 
                                                : `${inactiveColor} text-white`
                                        }`}
                                        onClick={() => handleNoteTypeClick(type)}
                                    >
                                        {type}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className='h-[70%] px-[30px] dark:text-white'>
                        <textarea
                            name="content"
                            value={noteContent[currentNoteType]}
                            onChange={(e) => handleNoteContentChange(e.target.value)}
                            className={` ${contentError ? 'border-red-500 border-2' : 'border-[##777777] focus:border-[#777777]'} w-full h-full p-[20px] mt-[10px] text-[20px] border rounded-xl resize-none`}
                            placeholder="Section Content"
                        />
                    </div>
                    <div className='flex mt-6 mr-7 items-center justify-end'>
                        <button 
                            className='flex items-center justify-center w-[8rem] font-semibold bg-primary text-white text-[20px] border-r-[2px] rounded-[10px] px-3 py-1 cursor-pointer'
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateReleaseNotes;
