import api from '@/utils/api';
import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaEdit } from "react-icons/fa";
import ConfirmDelete from '@/components/modals/ConfirmDelete';
import { Router } from 'next/router';
import { useUserContext } from '@/contexts/UserContext';
import { HiArchiveBoxXMark } from 'react-icons/hi2';
import Alert from '../alerts/Alert';
import Loader from '../loaders/Loader';
import { truncate } from 'lodash';

type ViewEditEventModalProps = {
    event: { id: number, title: string };
    onClose: () => void;
};

const ViewEditEventModal: React.FC<ViewEditEventModalProps> = ({ event, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [date, setDate] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [id, setId] = useState(0);
    const { currentUser, setError } = useUserContext();
    const [creatorId, setCreatorId] = useState(0);
    const [isCreator, setIsCreator] = useState(false);
    const sysRoles = currentUser?.roles;
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchEventDetails = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/events/retrieve`, { params: { col: 'event_id', val: event.id } });
                if (response.data.status === 200) {
                    const eventData = response.data.data;
                    const eventUserId = Number(eventData.user_id);
                    const user = localStorage.getItem('currentUser');
                    const parsedUser = JSON.parse(user || '{}');

                    setId(eventData.event_id);
                    setTitle(eventData.title);
                    setDescription(eventData.description);
                    setStartTime(formatTime(eventData.start_time));
                    setEndTime(formatTime(eventData.end_time));
                    setDate(new Date(eventData.event_date));

                    setIsCreator(eventUserId === parsedUser?.userId);
                }
            } catch (error) {
                console.error('Failed to fetch event details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEventDetails();

    }, [event.id]);

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


    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`; // Returns time in HH:MM format
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const updatedEvent = { id: event.id, title, description, startTime, endTime, date: date as Date };

        if (date) {
            const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            const updatedEventWithAdjustedDate = { ...updatedEvent, date: adjustedDate };
            const response = await api.post(`/events/update`, updatedEventWithAdjustedDate);

            const user = localStorage.getItem('currentUser');
            const parsedUser = JSON.parse(user || '{}');

            const auditData = {
                userId: parsedUser?.userId,
                action: 'general',
                act: 'events_edit',
                event: event.title,
            };

            api.post('/auditlogs/logsaudit', auditData)
                .then(response => {
                })
                .catch(error => {
                });
            if (response.data.status === 200) {
                setSuccessMsg(response.data.message);
                setIsLoading(false);
                setIsEditing(false);
            } else {
                setErrorMsg(response.data.message);
                setIsLoading(false);
            }
        }
    };

    const handleDelete = async () => {
        if (!sysRoles?.includes(16)) {
            setError('You are not authorized to archive this event.');
            return;
        }
        setIsLoading(true);
        const user = localStorage.getItem('currentUser');
        const parsedUser = JSON.parse(user || '{}');

        const auditData = {
            userId: parsedUser?.userId,
            action: 'general',
            act: 'events_archive',
            event: event.title,
        };

        api.post('/auditlogs/logsaudit', auditData)
            .then(response => {
            })
            .catch(error => {
            });

        const response = await api.post(`/events/delete`, { event_id: id });
        if (response.data.status === 200) {
            setSuccessMsg(response.data.message);
            setIsLoading(false);
            setTimeout(() => {
                onClose();
            }, 2000);
        } else {
            setErrorMsg(response.data.message);
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="fixed top-4 right-4 z-[10000]">
                <div className="flex flex-col items-end space-y-2">
                    {errorMsg &&
                        <Alert className="!relative" message={errorMsg} variant='critical' setClose={() => setErrorMsg('')} />
                    }
                    {successMsg &&
                        <Alert className="!relative" message={successMsg} variant='success' setClose={() => setSuccessMsg('')} />
                    }
                </div>
            </div>
            <div className="font-lato fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
                <div className="animate-pop-out bg-white dark:bg-[#3C3C3C] p-6 rounded-lg w-[50%]">
                    <h2 className="text-xl text-[20px] font-bold mb-4 flex items-center gap-2 dark:text-white">
                        <FaCalendarAlt className='text-[20px]' />
                        {isEditing ? 'Edit Event' : 'View Event'}
                        <span className="text-primary text-[20px] font-semibold dark:text-[#ff4d4d]">{date?.toDateString()}</span>
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 flex gap-4">
                            <div className="flex-1">
                                <label htmlFor="startTime" className="block mb-1 font-semibold text-[17px] dark:text-white">Start Time</label>
                                {isLoading ? (
                                    <div className="w-full h-[34px] flex items-center"><Loader className='h-8 w-4' /></div>
                                ) : (
                                    <input
                                        type="time"
                                        id="startTime"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="w-full border rounded px-2 py-1 dark:bg-[#3C3C3C] dark:text-white"
                                        required
                                        disabled={!isEditing}
                                    />
                                )}
                            </div>
                            <div className="flex-1">
                                <label htmlFor="endTime" className="block mb-1 font-semibold text-[17px] dark:text-white">End Time</label>
                                {isLoading ? (
                                    <div className="w-full h-[34px] flex items-center"><Loader className='h-8 w-4' /></div>
                                ) : (
                                    <input
                                        type="time"
                                        id="endTime"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="w-full border rounded px-2 py-1 dark:bg-[#3C3C3C] dark:text-white"
                                        required
                                        disabled={!isEditing}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="title" className="block mb-1 font-semibold text-[17px] dark:text-white">Title</label>
                            {isLoading ? (
                                <div className="w-full h-[34px] flex items-center"><Loader className='h-8 w-4' /></div>
                            ) : (
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full border rounded px-2 py-1 dark:bg-[#3C3C3C] dark:text-white"
                                    required
                                    disabled={!isEditing}
                                />
                            )}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block mb-1 font-semibold text-[17px] dark:text-white">Description</label>
                            {isLoading ? (
                                <div className="w-full h-[82px] flex items-center"><Loader className='h-20 w-4' /></div>
                            ) : (
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border rounded px-2 py-1 dark:bg-[#3C3C3C] dark:text-white"
                                    rows={3}
                                    disabled={!isEditing}
                                ></textarea>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="mr-2 px-4 py-2 bg-gray-200 rounded font-semibold transition-colors hover:bg-gray-300 dark:hover:bg-[#4C4C4C]"
                            >
                                Close
                            </button>
                            {isCreator && (
                                isEditing ? (
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-primary text-white rounded font-semibold transition-colors hover:bg-red-800"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="mr-2 px-4 py-2 bg-blue-500 text-white rounded font-semibold transition-colors hover:bg-blue-600"
                                        >
                                            <FaEdit className="inline-block mr-1" /> Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteModal(true)}
                                            className="px-4 py-2 bg-primary text-white rounded font-semibold transition-colors hover:bg-red-600"
                                            disabled={isLoading}
                                        >
                                            <HiArchiveBoxXMark className="inline-block mr-1" /> Archive
                                        </button>
                                    </>
                                )
                            )}
                        </div>
                    </form>
                </div>
                {deleteModal && <ConfirmDelete onClose={() => { setDeleteModal(false) }} subject="event" onProceed={handleDelete} />}
            </div>
            );
        </>
    );
};

export default ViewEditEventModal;