import React, { useEffect, useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { FaCodeBranch } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { ReleaseNote } from '@/types/data';
import api from '@/utils/api';
import Loader from '../loaders/Loader';
import Alert from '../alerts/Alert';

interface ViewReleaseNotesProps {
    note_id: number;
    setViewNotes: React.Dispatch<React.SetStateAction<boolean>>
}


const ViewReleaseNotes: React.FC<ViewReleaseNotesProps> = ({note_id, setViewNotes}) => {
    const [title, setTitle] = useState("");
    const [version, setVersion] = useState("");
    const [note, setNote] = useState<ReleaseNote>();

    const [alertMessages, setAlertMessages] = useState<string[]>([]);
    const [alertStatus, setAlertStatus] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [titleError, setTitleError] = useState(false);
    const [versionError, setVersionError] = useState(false);
    const [contentError, setContentError] = useState(false);

    useEffect(() => {
        retrieveReleaseNote();
    }, [note_id]);

    //Retrieve release note data
    const retrieveReleaseNote = async () => {
        try {
            const response = await api.get(`/release_note/retrieve`, {
                params: {
                    note_id: note_id
                }
            });

            if (response.status === 200) {
                setNote(response.data.data);
                setIsLoading(false);
            }
        }catch (error) {
            setAlertMessages(["Failed to retrieve release note data"]);
            setAlertStatus("error");
        }
    }

    //Edit release note 
    const handleSaveEdit = async () => {
        const newAlertMessages: string[] = [];

        //Reset errors
        setTitleError(false);
        setVersionError(false);
        setContentError(false); 

        //Check errors
        if (title === "" || version === "" || !note) {
            setTitleError(true);
            setVersionError(true);
            setContentError(true);
            setAlertStatus("critical");
            return;
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
        if (!note) {
            newAlertMessages.push("Content is required");
            setContentError(true);
            setAlertStatus("critical");
        }
        if (newAlertMessages.length > 0) {
            setAlertMessages(newAlertMessages);
            setAlertStatus("critical");
            return;
        }

        try {
            const response = await api.post('/release_note/update', {
                note_id: note_id,
                title: title,
                version: version,
                content: note
            });

            if (response.status === 200) {
                setAlertMessages(["Release note successfully updated"]);
                setAlertStatus("success");
            }
        } catch (error) {
            setAlertMessages(["Failed to edit release note"]);
            setAlertStatus("critical");
        }
    }  

    //Delete release note
    const deleteReleaseNote = async () => {
        try {
            const response = await api.post('/release_note/delete', {
                note_id: note_id
            });

            if (response.status === 200) {
                setAlertMessages(["Release note successfully deleted"]);
                setAlertStatus("success");
                window.location.reload();
            }
        } catch (error) {
            setAlertMessages(["Failed to delete release note"]);
            setAlertStatus("critical");
        }
    }

    const formatDateShort = (dateString: String) => {
        const date = new Date(dateString as string);
        const options = { month: 'short', day: 'numeric' } as const;
        return date.toLocaleDateString('en-US', options);
    };

    const formatDateLong = (dateString: String) => {
        const date = new Date(dateString as string);
        const options = { month: 'long', day: 'numeric', year: 'numeric' } as const;
        return date.toLocaleDateString('en-US', options);
    };

    const getHeadingColors = (noteType: string) => {
        switch (noteType) {
            case 'added':
                return 'bg-[#9EE29E] text-[#007100]';
            case 'updated':
                return 'bg-[#90CAF9] text-[#1565C0]';
            case 'removed':
                return 'bg-[#EF9A9A] text-[#B71C1C]';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    return (
        <div className='flex justify-center items-center z-[1000] w-full h-full fixed top-0 left-0 p-4 overflow-auto backdrop-brightness-50'>
            <div className='absolute top-0 right-0'>
                {alertMessages && alertMessages.map((msg, index) => (
                <Alert className="!relative" variant={alertStatus as "default" | "information" | "warning" | "critical" | "success" | undefined} key={index} message={msg} setClose={() => {
                    setAlertMessages(prev => prev.filter((_, i) => i !== index));
                }} />
                ))}
            </div>
            <div className="flex flex-col w-[60%] h-[750px] bg-white rounded-[20px] animate-pop-out drop-shadow">
                {/* Header */}
                <div className='flex items-center rounded-t-[10px] h-[10%] bg-[#F5F5F5] text-[22px]'>
                    <div className='flex items-center justify-center w-[10%] h-full bg-[#F1F1F1] border-r-[2px] rounded-tl-[10px] px-[10px]'>
                        {isLoading ? <Loader className='h-6 w-4'/>
                            : <p>{formatDateShort(note?.created_at as string)}</p>
                        }
                    </div>
                    <div className='flex items-center w-[80%] h-full text-[25px] font-semibold  ml-[20px] gap-[10px]'>
                        <FaCodeBranch className='text-[30px] text-[#5B5353] opacity-60'/>
                        {isLoading ? <Loader className='h-6 w-4'/>
                            : <p>{note?.title}</p>
                        }
                    </div>
                    <IoIosClose className='mt-[2px] text-[70px] text-[#CECECE] cursor-pointer hover:text-[#b3b3b3] transition-colors duration-250 ease-in-out'
                        onClick={()=>setViewNotes(false)}/>
                </div>

                {/* Main Content Area */}
                <div className="h-[80%]">
                    <div className='flex h-[10%] items-end text-[24px] pb-2 pl-[30px] border-b-[4px]'>
                        {isLoading ? <Loader className='h-6'/>
                            : <p>Version {note?.version} - {formatDateLong(note?.created_at as string)}</p>
                        }
                        <MdModeEdit className='text-[28px] ml-4 mb-1 text-[#5B5353] cursor-pointer hover:text-[#921B1BFF] hover:animate-shake transition-colors duration-250 ease-in-out'
                            onClick={handleSaveEdit}/>
                    </div>      

                    {/* Release Note Content */}
                    <div className='h-[540px] text-[20px] p-7 pb-[10px] border-b-[4px] overflow-y-scroll'>
                        {isLoading ? <Loader className='h-60 w-4'/>
                            : note?.content && Object.entries(note?.content).map(([noteType, items]) => (
                                <div key={noteType}>
                                    <h3 className={`font-bold ${getHeadingColors(noteType)} inline-block px-3 py-1 rounded-full`}>
                                {noteType.charAt(0).toUpperCase() + noteType.slice(1)}</h3>
                            <ul className='list-disc pl-12 mt-4'>
                                {Array.isArray(items) && items.map((item: string, idx: number) => (
                                    <li key={idx} className="text-justify mb-6">{item}</li>
                                ))}
                            </ul>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Footer */}
                <div className='flex h-[5rem] items-center text-[24px] rounded-b-[10px]'>
                    <div className='flex items-center justify-center w-[7%] h-full bg-[#F1F1F1] border-r-[2px] rounded-bl-[10px] hover:bg-[#921B1BFF] group transition-colors duration-250 ease-in-out'>
                        <RiDeleteBinLine 
                            className='text-[28px] text-[#5B5353] cursor-pointer group-hover:text-white group-hover:animate-shake transition-colors duration-250 ease-in-out'
                            onClick={deleteReleaseNote}
                        />
                    </div>
                    <div className='flex h-[10%] items-center ml-auto mr-[30px] text-[20px]'>
                        <div className=''>
                            {isLoading ? <Loader className='h-6 w-4'/>
                                : <p>Author: {note?.user.name}</p>
                            }
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ViewReleaseNotes;