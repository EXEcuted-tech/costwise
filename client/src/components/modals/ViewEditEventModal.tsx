import api from '@/utils/api';
import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaEdit, FaTrash } from "react-icons/fa";
import ConfirmDelete from '@/components/modals/ConfirmDelete';

type ViewEditEventModalProps = {
    event: { id: string; date: Date; title: string; description: string; startTime: string; endTime: string };
    onClose: () => void;
    onUpdateEvent: (event: { id: string; date: Date; title: string; description: string; startTime: string; endTime: string }) => void;
    onDeleteEvent: (id: string) => void;
};

const ViewEditEventModal: React.FC<ViewEditEventModalProps> = ({ event, onClose, onUpdateEvent, onDeleteEvent }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(event.title);
    const [description, setDescription] = useState(event.description);
    const [startTime, setStartTime] = useState(event.startTime);
    const [endTime, setEndTime] = useState(event.endTime);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    useEffect(() => {
        setTitle(event.title);
        setDescription(event.description);
        setStartTime(event.startTime);
        setEndTime(event.endTime);
    }, [event]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const updatedEvent = { ...event, title, description, startTime, endTime };
        const response = await api.post(`/events/update`, updatedEvent);
        if (response.data.status === 200) {
            onUpdateEvent(updatedEvent);
            setIsLoading(false);
            setIsEditing(false);
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        const response = await api.post(`/events/delete`, { event_id: event.id });
        if (response.data.status === 200) {
            onDeleteEvent(event.id);
            setIsLoading(false);
            onClose();
        }
    };

    return (
        <div className="font-lato fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
            <div className="animate-pop-out bg-white p-6 rounded-lg w-[50%]">
                <h2 className="text-xl text-[20px] font-bold mb-4 flex items-center gap-2">
                    <FaCalendarAlt className='text-[20px]' />
                    {isEditing ? 'Edit Event' : 'View Event'}
                    <span className="text-primary text-[20px] font-semibold">{event.date.toDateString()}</span>
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="startTime" className="block mb-1 font-semibold text-[17px]">Start Time</label>
                            <input
                                type="time"
                                id="startTime"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full border rounded px-2 py-1"
                                required
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="endTime" className="block mb-1 font-semibold text-[17px]">End Time</label>
                            <input
                                type="time"
                                id="endTime"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full border rounded px-2 py-1"
                                required
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="title" className="block mb-1 font-semibold text-[17px]">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border rounded px-2 py-1"
                            required
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block mb-1 font-semibold text-[17px]">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border rounded px-2 py-1"
                            rows={3}
                            disabled={!isEditing}
                        ></textarea>
                    </div>
                    
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mr-2 px-4 py-2 bg-gray-200 rounded font-semibold transition-colors hover:bg-gray-300"
                        >
                            Close
                        </button>
                        {isEditing ? (
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
                                    className="px-4 py-2 bg-red-500 text-white rounded font-semibold transition-colors hover:bg-red-600"
                                    disabled={isLoading}
                                >
                                    <FaTrash className="inline-block mr-1" /> Delete
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
            {deleteModal && <ConfirmDelete onClose={() => { setDeleteModal(false) }} subject="event" onProceed={handleDelete} />}
        </div>
    );
};

export default ViewEditEventModal;