import React, { useEffect, useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { FaFilePen } from "react-icons/fa6";
import { BiSolidSave } from "react-icons/bi";
import { ReleaseNote, ReleaseNoteContent } from '@/types/data';
import api from '@/utils/api';

interface CreateReleaseNotesProps {
    setCreateNotes: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateReleaseNotes: React.FC<CreateReleaseNotesProps> = ({setCreateNotes}) => {

    const [title, setTitle] = useState("");
    const [version, setVersion] = useState("");
    const [user_id, setUserId] = useState("");
    const [user, setUser] = useState("");
    const [notes, setNotes] = useState<ReleaseNote[]>([]);
    const [noteContent, setNoteContent] = useState<ReleaseNoteContent[]>([]);

    const [alertMessages, setAlertMessages] = useState<string[]>([]);
    const [alertStatus, setAlertStatus] = useState<string>('');
    const [titleError, setTitleError] = useState(false);
    const [versionError, setVersionError] = useState(false);
    const [contentError, setContentError] = useState(false);

    //Handle input changes
    const handleTitleChange = (title: string) => {
        setTitle(title);
    }

    const handleVersionChange = (version: string) => {
        setVersion(version);
    }

    const handleNoteContentChange = (content: string) => {
        setNoteContent([{note_type: "Added", note: content}]);
    }

    useEffect(() => {
        getCurrentUser();
    }, []);

    //Get current user
    const getCurrentUser = async () => {
        try {
            const response = await api.get('/user');
            if (response) {
                setUser(response.data.first_name + " " + response.data.middle_name + " " + response.data.last_name);
                setUserId(response.data.user_id);
            } 
        } catch (error) {
            setAlertMessages(["Failed to get current user"]);
            setAlertStatus("error");
        }
    }

    //Create release note
    const createReleaseNote = async () => {
        const newAlertMessages: string[] = [];

        //Reset errors
        setTitleError(false);
        setVersionError(false);
        setContentError(false);

        //Check errors
        if (title === "" || version === "" || noteContent.length === 0) {
            setTitleError(title === "");
            setVersionError(version === "");
            setContentError(noteContent.length === 0);
            return;
        }
        if (title === "") {
            newAlertMessages.push("Title is required");
            setTitleError(true);
        }
        if (version === "") {
            newAlertMessages.push("Version is required");
            setVersionError(true);
        }
        if (noteContent.length === 0) {
            newAlertMessages.push("Content is required");
            setContentError(true);
        }
        if (newAlertMessages.length > 0) {
            setAlertMessages(newAlertMessages);
            return;
        }

        try {
            const response = await api.post('/release_note/create', {
                title: title,
                version: version,
                content: noteContent,
                user_id: user_id
            });

            if (response.status === 200) {
                setAlertMessages(["Release note created successfully"]);
                setAlertStatus("success");

                //Reset form fields
                setTitle("");
                setVersion("");
                setNoteContent([]);

                window.location.reload();
            }
        } catch (error) {
            setAlertMessages(["Failed to create release note"]);
            setAlertStatus("error");
        }

    }

    return (
        <div className='flex justify-center items-center z-[1000] w-full h-full fixed p-4 overflow-auto top-0 left-0 bg-[rgba(0,0,0,0.5)]'>
            <div className="flex flex-col w-[60%] h-[700px] bg-white rounded-[20px] animate-pop-out drop-shadow">

                {/* Header */}
                <div className='flex items-center rounded-t-[10px] h-[10%] bg-[#F5F5F5] text-[27px] font-bold'>
                    <div className='flex items-center w-[80%] h-full ml-[20px] gap-[10px]'>
                        <FaFilePen className='text-[30px]' />
                        <p>Create Release Note</p>
                    </div>
                    <IoIosClose className='mt-[2px] text-[70px] text-[#CECECE] cursor-pointer hover:text-[#b3b3b3] transition-colors duration-250 ease-in-out'
                        onClick={()=>setCreateNotes(false)}/>
                </div>

                <div className="h-full">
                    {/* Title Area */}
                    <div className='flex-row mt-4 mb-4'>
                        <div className='flex h-[13%] items-center text-[25px] font-bold px-[30px] gap-[20px]'>
                            <p>Title: <span className='text-[#B22222] ml-1 font-bold'>*</span></p>
                            <input 
                                className='w-[30rem] h-[60%] py-1 px-[20px] rounded-xl border-black border drop-shadow-lg' 
                                placeholder='Release Note Title'
                                onChange={(e) => handleTitleChange(e.target.value)}
                            ></input>
                            <div className='flex ml-[20px] h-[13%] items-center text-[25px] font-bold gap-[20px]'>
                                <p>Version: <span className='text-[#B22222] ml-1 font-bold'>*</span></p>
                                <input 
                                    className='w-[6rem] h-[60%] py-1 px-4 rounded-xl border-black border drop-shadow-lg' 
                                    placeholder='1.0'
                                    type='number'
                                    onChange={(e) => handleVersionChange(e.target.value)}
                                ></input>
                            </div>
                        </div>
                    </div>
                    <div className='h-[3rem] px-[30px] mt-[20px]'>
                        <div className='flex gap-[20px] text-[22px] font-medium'>
                            <button className='bg-[#9EE29E] text-[#008000] px-[20px] py-[1px] rounded-full font-bold drop-shadow-lg'>Added</button>
                            <button className='bg-[#777777] text-white px-[20px] py-[1px] rounded-full drop-shadow-lg'>Updated</button>
                            <button className='bg-[#777777] text-white px-[20px] py-[1px] rounded-full drop-shadow-lg'>Removed</button>
                        </div>
                    </div>
                    <div className='h-[70%] px-[30px]'>
                        <textarea
                            name="content"
                            value="a"
                            onChange={(e) => handleNoteContentChange(e.target.value)}
                            className="w-full h-full p-[20px] border-black border rounded-xl mt-[20px] resize-none"
                            placeholder="Section Content"
                        />
                    </div>
                    <button 
                        className='flex items-center justify-center w-[10%] h-full bg-primary border-r-[2px] rounded-tb-[10px] rounded-tl-[10px] px-[10px] cursor-pointer'
                        onClick={createReleaseNote}
                    >
                        <BiSolidSave className='text-[35px] text-white'/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateReleaseNotes;