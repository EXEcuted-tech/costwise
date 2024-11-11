import api from '@/utils/api';
import React, { useContext, useEffect, useState } from 'react';
import { FaCalendarPlus } from "react-icons/fa";
import Spinner from '../loaders/Spinner';
import { useUserContext } from '@/contexts/UserContext';
import Alert from '../alerts/Alert';

type AddEventModalProps = {
    date: Date;
    onClose: () => void;
    onAddEvent: (event: { date: Date; title: string; description: string; startTime: string; endTime: string }) => void;
};

const AddEventModal: React.FC<AddEventModalProps> = ({ date, onClose, onAddEvent }) => {
    const { currentUser } = useUserContext();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (startTime && endTime && startTime >= endTime) {
            setErrorMsg('End time must be after the start time.');
            return;
        }

        setIsLoading(true);
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            try {
                const response = await api.post('/events/create', {
                    user_id: parsedUser?.userId,
                    event_date: date.toDateString(),
                    title: title,
                    description: description,
                    start_time: startTime,
                    end_time: endTime
                });
                if (response.data.status === 201) {
                    setSuccessMsg(response.data.message);
                    setIsLoading(false);
                    setTimeout(() => {
                        onAddEvent({ date, title, description, startTime, endTime });
                        onClose();
                    }, 2000);
                } else {
                    setErrorMsg(response.data.message);
                    setIsLoading(false);
                }
            } catch (error) {
                setErrorMsg('Failed to add event!');
                setIsLoading(false);
            }
        }
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
                        <FaCalendarPlus className='text-[20px]' />
                        Add Event for:
                        <span className="text-primary text-[20px] font-semibold dark:text-[#ff4d4d]">{date.toDateString()}</span>
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 flex gap-4">
                            <div className="flex-1">
                                <label htmlFor="startTime" className="block mb-1 font-semibold text-[17px] dark:text-white">Start Time <span className='text-[#B22222] ml-1 font-bold'>*</span></label>
                                <input
                                    type="time"
                                    id="startTime"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full border rounded px-2 py-1 dark:bg-[#3C3C3C] dark:text-white"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="endTime" className="block mb-1 font-semibold text-[17px] dark:text-white">End Time <span className='text-[#B22222] ml-1 font-bold'>*</span></label>
                                <input
                                    type="time"
                                    id="endTime"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full border rounded px-2 py-1 dark:bg-[#3C3C3C] dark:text-white"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="title" className="block mb-1 font-semibold text-[17px] dark:text-white">Title <span className='text-[#B22222] ml-1 font-bold'>*</span></label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border rounded px-2 py-1 dark:bg-[#3C3C3C] dark:text-white"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block mb-1 font-semibold text-[17px] dark:text-white">Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full border rounded px-2 py-1 dark:bg-[#3C3C3C] dark:text-white"
                                rows={3}
                            ></textarea>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="mr-2 px-4 py-2 bg-gray-200 rounded font-semibold transition-colors hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-primary text-white rounded font-semibold transition-colors hover:bg-red-800 flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <div className='flex items-center justify-center'>
                                        <Spinner className="h-5 w-5 mr-2" />
                                        Add Event
                                    </div>
                                ) : (
                                    'Add Event'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddEventModal;