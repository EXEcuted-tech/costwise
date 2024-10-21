import React, { useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { FaCodeBranch } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { ReleaseNote, ReleaseNoteContent } from '@/types/data';
import api from '@/utils/api';

interface ViewReleaseNotesProps {
    note_id: number;
    setViewNotes: React.Dispatch<React.SetStateAction<boolean>>
}


const ViewReleaseNotes: React.FC<ViewReleaseNotesProps> = ({note_id, setViewNotes}) => {
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


    //Retrieve release note data
    const retrieveReleaseNote = async () => {
        try {
            const response = await api.get(`/release_note/retrieve`, {
                params: {
                    note_id: note_id
                }
            });

            if (response.status === 200) {
                setTitle(response.data.title);
                setVersion(response.data.version);
                setUserId(response.data.user_id);
                setUser(response.data.user);
                setNotes(response.data.notes);
                setNoteContent(response.data.note_content);
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
            const response = await api.post('/release_note/update', {
                note_id: note_id,
                title: title,
                version: version,
                content: noteContent
            });

            if (response.status === 200) {
                setAlertMessages(["Release note successfully updated"]);
                setAlertStatus("success");
            }
        } catch (error) {
            setAlertMessages(["Failed to edit release note"]);
            setAlertStatus("error");
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

                setViewNotes(false);
                // window.location.reload();
            }
        } catch (error) {
            setAlertMessages(["Failed to delete release note"]);
            setAlertStatus("error");
        }
    }

    return (
        <div className='flex justify-center items-center z-[1000] w-full h-full fixed top-0 left-0 p-4 overflow-auto backdrop-brightness-50'>
            <div className="flex flex-col w-[60%] h-[700px] bg-white rounded-[20px] animate-pop-out drop-shadow">

                {/* Header */}
                <div className='flex items-center rounded-t-[10px] h-[10%] bg-[#F5F5F5] text-[22px]'>
                    <div className='flex items-center justify-center w-[10%] h-full bg-[#F1F1F1] border-r-[2px] rounded-tl-[10px] px-[10px]'>
                        <p>15 Jan</p>
                    </div>
                    <div className='flex items-center w-[80%] h-full text-[25px] font-semibold  ml-[20px] gap-[10px]'>
                        <FaCodeBranch className='text-[30px] text-[#5B5353] opacity-60'/>
                        <p>Version 3.0 Changes</p>
                    </div>
                    <IoIosClose className='mt-[2px] text-[70px] text-[#CECECE] cursor-pointer hover:text-[#b3b3b3] transition-colors duration-250 ease-in-out'
                        onClick={()=>setViewNotes(false)}/>
                </div>

                {/* Main Content Area */}
                <div className="h-[80%]">
                    <div className='flex h-[12%] items-end text-[24px] pl-[30px] pb-[10px] border-b-[4px]'>
                        <p>Version 1.0 - January 15, 2024</p>
                        <MdModeEdit className='text-[28px] ml-4 mb-1 text-[#5B5353] cursor-pointer hover:text-[#921B1BFF] hover:animate-shake transition-colors duration-250 ease-in-out'
                            onClick={()=>setViewNotes(false)}/>
                    </div>

                    {/* Release Note Content */}
                    <div className='h-[88%] text-[20px] p-7 border-b-[4px]'>
                        <p>huh</p>
                    </div>
                </div>

                {/* Footer */}
                <div className='flex h-[10%] items-center text-[24px] rounded-b-[10px]'>
                    <div className='flex items-center justify-center w-[10%] h-full bg-[#F1F1F1] border-r-[2px] rounded-bl-[10px] px-[10px]'>
                        <RiDeleteBinLine 
                            className='text-[28px] text-[#5B5353] opacity-60 cursor-pointer hover:text-[#921B1BFF] hover:animate-shake transition-colors duration-250 ease-in-out'
                            onClick={deleteReleaseNote}
                        />
                    </div>
                    <div className='flex h-[10%] items-center ml-auto mr-[30px] text-[24px]'>
                        <div className=''>
                            Prepared by: Michael Huang
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ViewReleaseNotes;