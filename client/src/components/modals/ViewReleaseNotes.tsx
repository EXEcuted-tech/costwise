import React, { useEffect, useState } from 'react';
import { IoIosClose} from 'react-icons/io';
import { FaCodeBranch } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { ReleaseNote } from '@/types/data';
import api from '@/utils/api';
import Loader from '../loaders/Loader';
import Alert from '../alerts/Alert';
import ConfirmChanges from './ConfirmChanges';

interface ViewReleaseNotesProps {
    note_id: number;
    setViewNotes: React.Dispatch<React.SetStateAction<boolean>>
}


const ViewReleaseNotes: React.FC<ViewReleaseNotesProps> = ({note_id, setViewNotes}) => {
    const [note, setNote] = useState<ReleaseNote>();
    const [editedNote, setEditedNote] = useState<ReleaseNote>();

    const [showConfirmChanges, setShowConfirmChanges] = useState(false);
    const [alertMessages, setAlertMessages] = useState<string[]>([]);
    const [alertStatus, setAlertStatus] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [titleError, setTitleError] = useState(false);
    const [versionError, setVersionError] = useState(false);
    const [contentError, setContentError] = useState(false);

    useEffect(() => {
        retrieveReleaseNote();
    }, [note_id]);

    const handleClose = () => {
        if (isEditing) {
            setShowConfirmChanges(true);
        } else {
            setViewNotes(false);
        }
    }
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
                setEditedNote(response.data.data);
                setIsLoading(false);
            }
        }catch (error) {
            setAlertMessages(["Failed to retrieve release note data"]);
            setAlertStatus("error");
        }
    }

    //Edit release note 
    const handleEdit = async () => {
        setIsEditing(true);
        setEditedNote(note);
    }  

    const handleCancelEdit = () => {
        setShowConfirmChanges(true);
        setIsEditing(false);
        setEditedNote(note);
    }

    const handleSaveEdit = async () => {        
        if (!editedNote) return;
        setIsEditing(false);

        const newAlertMessages: string[] = [];

        //Reset errors
        setTitleError(false);
        setVersionError(false);
        setContentError(false); 

        //Check errors
        if (editedNote.title === "" && editedNote.version === "" && Object.values(editedNote.content).some(arr => arr.length === 0 || arr.some(item => item.trim() === ''))) {
            setTitleError(true);
            setVersionError(true);
            setContentError(true);
            setIsEditing(true);
            setAlertMessages(["Title, version, and content are required"]);
            setAlertStatus("critical");
            return;
        }
        if (editedNote.title === "") {
            newAlertMessages.push("Title is required");
            setTitleError(true);
            setAlertStatus("critical");
        }
        if (editedNote.version === "") {
            newAlertMessages.push("Version is required");
            setVersionError(true);
            setAlertStatus("critical"); 
        }
        // Check if all content sections are empty
        const isContentEmpty = Object.values(editedNote.content).every(arr => arr.length === 0 || arr.every(item => item.trim() === ''));
        if (isContentEmpty) {
            newAlertMessages.push("At least one content section must have a non-empty item");
            setContentError(true);
        }
        if (newAlertMessages.length > 0) {
            setAlertMessages(newAlertMessages);
            setAlertStatus("critical");
            setIsEditing(true);
            return;
        }

        try {
            const response = await api.post('/release_note/update', {
                note_id: note_id,
                title: editedNote.title,
                version: editedNote.version,
                content: editedNote.content
            });

            if (response.status === 200) {
                setNote(editedNote);
                setIsEditing(false);
                setAlertMessages(["Release note successfully updated"]);
                setAlertStatus("success");
            }
        } catch (error) {
            setAlertMessages(["Failed to edit release note"]);
            setAlertStatus("critical");
            setIsEditing(true);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editedNote) return;
        const { name, value } = e.target;
        setEditedNote(prev => {
            if (!prev) return undefined;
            if (name === 'version') {
                const numValue = parseFloat(value);
                if (!isNaN(numValue) && numValue > 0) {
                    return {...prev, [name]: numValue.toFixed(1)};
                }
                return prev; 
            }
            return {...prev, [name]: value};
        });
    }

    const handleContentChange = (noteType: keyof ReleaseNote['content'], index: number, value: string) => {
        if (!editedNote || !editedNote.content) return;
        const newContent = {...editedNote.content};
        newContent[noteType][index] = value;
        setEditedNote(prev => prev ? {...prev, content: newContent} : undefined);
    }

    //Delete release note
    const deleteReleaseNote = async () => {
        try {
            const response = await api.post('/release_note/delete', {
                note_id: note_id
            });

            if (response.status === 200) {
                setAlertMessages(["Release note successfully archived"]);
                setAlertStatus("success");
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        } catch (error) {
            setAlertMessages(["Failed to archive release note"]);
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

    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setViewNotes(false);
            }
        };
        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [setViewNotes]);


    return (
        <div className='flex justify-center items-center z-[1000] w-full h-full fixed top-0 left-0 p-4 overflow-auto backdrop-brightness-50'>
            <div className='absolute top-0 right-0'>
                {alertMessages && alertMessages.map((msg, index) => (
                <Alert className="!relative" variant={alertStatus as "default" | "information" | "warning" | "critical" | "success" | undefined} key={index} message={msg} setClose={() => {
                    setAlertMessages(prev => prev.filter((_, i) => i !== index));
                }} />
                ))}
            </div>
            {showConfirmChanges && (
                <ConfirmChanges 
                    setConfirmChanges={setShowConfirmChanges} 
                    onConfirm={() => {
                        setShowConfirmChanges(false);
                        setViewNotes(false);
                    }}
                />
            )}
            <div className="flex flex-col w-[60%] h-[750px] bg-white dark:bg-[#3C3C3C] rounded-[20px] animate-pop-out drop-shadow">
                {/* Header */}
                <div className='flex items-center rounded-t-[10px] h-[10%] bg-[#F5F5F5] dark:bg-[#121212] text-[22px]'>
                    <div className='flex items-center justify-center w-[17%] 2xl:w-[15%] 3xl:w-[12%] 4xl:w-[10%] h-full bg-[#F1F1F1] dark:bg-[#121212] border-r-[2px] rounded-tl-[10px] px-[10px]'>
                        {isLoading ? <Loader className='h-6 w-4'/>
                            : <p className='dark:text-white text-[22px]'>{formatDateShort(note?.created_at as string)}</p>
                        }
                    </div>
                    <div className='flex items-center w-[80%] h-full text-[25px] font-semibold  ml-[20px] gap-[10px]'>
                        <FaCodeBranch className='text-[30px] text-[#5B5353] dark:text-[#d1d1d1] opacity-60'/>
                        {isLoading ? (
                            <Loader className='h-6 w-4'/>
                        ) : isEditing ? (
                            <input
                                type="text"
                                name="title"
                                value={editedNote?.title || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded dark:text-white"
                            />
                        ) : (
                            <p className='dark:text-white'>{note?.title}</p>
                        )}
                    </div>
                    <IoIosClose className='mt-[2px] text-[70px] text-[#CECECE] cursor-pointer hover:text-[#b3b3b3] transition-colors duration-250 ease-in-out'
                        onClick={handleClose}/>
                </div>

                {/* Main Content Area */}
                <div className="h-[80%]">
                    <div className='flex h-[10%] items-end text-[24px] dark:text-white pb-2 pl-[30px] border-b-[4px]'>
                        {isLoading ? (
                            <Loader className='h-6 !w-[300px]'/>
                        ) : isEditing ? (
                            <div className="flex items-center">
                                <span>Version</span>
                                <input
                                    name='version'
                                    step='0.1'
                                    type='number'
                                    min="1"
                                    value={editedNote?.version || ''}
                                    onChange={handleInputChange}
                                    className="w-20 mx-2 p-1 border rounded"
                                />
                                <span>- {formatDateLong(note?.created_at as string)}</span>
                            </div>
                        ) : (
                            <p>Version {note?.version} - {formatDateLong(note?.created_at as string)}</p>
                        )}
                        {isEditing ? 
                            <div className='flex justify-center items-center h-full gap-1 animate-pop-out'>
                                <FaCheck className='text-[28px] mt-3 ml-4 text-[#007100] cursor-pointer hover:animate-shake-infinite'
                                    onClick={handleSaveEdit}/>
                                <IoIosClose className='text-[45px] mt-3 text-[#921B1BFF] cursor-pointer hover:animate-shake-infinite'
                                    onClick={handleCancelEdit}/>
                            </div>
                            : 
                            <div className='flex justify-center items-center h-full gap-1 animate-pop-out'>
                                <MdModeEdit className='text-[24px] mt-3 ml-4 mb-1 text-[#5B5353] dark:text-[#d1d1d1] cursor-pointer animate-pop-out hover:text-[#921B1BFF] hover:animate-shake transition-colors duration-250 ease-in-out'
                                    onClick={handleEdit}/>
                            </div>
                        }
                    </div>

                    {/* Release Note Content */}
                    <div className='h-[540px] text-[20px] p-7 pb-[10px] border-b-[4px] overflow-y-scroll dark:text-white'>
                        {isLoading ? <Loader className='h-60 w-4'/> : 
                            editedNote?.content && Object.entries(editedNote.content).map(([noteType, items]) => (
                                <div key={noteType}>
                                    <h3 className={`font-bold ${getHeadingColors(noteType)} inline-block px-3 py-1 rounded-full`}>
                                        {noteType.charAt(0).toUpperCase() + noteType.slice(1)}
                                    </h3>
                                    <ul className='list-disc pl-12 mt-4'>
                                        {Array.isArray(items) && items.map((item: string, idx: number) => (
                                            <li key={idx} className="text-justify mb-6">
                                                {isEditing ? (
                                                    <textarea
                                                        value={item}
                                                        onChange={(e) => handleContentChange(noteType as keyof ReleaseNote['content'], idx, e.target.value)}
                                                        className="w-full p-2 border rounded"
                                                    />
                                                ) : (
                                                    item
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* Footer */}
                <div className='flex h-[5rem] items-center text-[24px] rounded-b-[10px]'>
                    <div className='flex items-center justify-center w-[7%] h-full bg-[#F1F1F1] border-t-[3px] dark:bg-[#121212] border-r-[2px] rounded-bl-[10px] hover:bg-[#921B1BFF] group transition-colors duration-250 ease-in-out'>
                        <RiDeleteBinLine 
                            className='text-[28px] text-[#5B5353] dark:text-[#d1d1d1] cursor-pointer group-hover:text-white group-hover:animate-shake transition-colors duration-250 ease-in-out'
                            onClick={deleteReleaseNote}
                        />
                    </div>
                    <div className='flex h-[10%] items-center ml-auto mr-[30px] text-[20px]'>
                        <div className=''>
                            {isLoading ? <Loader className='h-6 w-4'/>
                                : <p className='dark:text-white'>Author: {note?.user.name}</p>
                            }
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ViewReleaseNotes;