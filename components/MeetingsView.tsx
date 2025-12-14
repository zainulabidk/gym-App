import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ZoomMeeting } from '../types';
import { getMeetings, addMeeting, deleteMeeting } from '../services/api';
import Modal from './Modal';
import Pagination from './Pagination';
import { PlusIcon, DeleteIcon } from './Icons';

const MeetingForm: React.FC<{ onSave: (meeting: any) => void; onCancel: () => void }> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    topic: '',
    startTime: '',
    duration: 60,
    host: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'duration' ? parseInt(value, 10) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, startTime: new Date(formData.startTime).toISOString() });
  };

  const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm";
  const labelClasses = "block text-sm font-medium text-gray-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClasses}>Topic</label>
        <input type="text" name="topic" value={formData.topic} onChange={handleChange} className={inputClasses} required />
      </div>
      <div>
        <label className={labelClasses}>Start Time</label>
        <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} className={inputClasses} required />
      </div>
      <div>
        <label className={labelClasses}>Duration (minutes)</label>
        <input type="number" name="duration" value={formData.duration} onChange={handleChange} className={inputClasses} required />
      </div>
       <div>
        <label className={labelClasses}>Host</label>
        <input type="text" name="host" value={formData.host} onChange={handleChange} className={inputClasses} required />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-transparent border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300">Cancel</button>
        <button type="submit" className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">Schedule Meeting</button>
      </div>
    </form>
  );
};


const MeetingsView: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: meetings = [], isLoading } = useQuery({ 
      queryKey: ['meetings'], 
      queryFn: getMeetings,
      select: (data) => data.sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
  });

  const addMeetingMutation = useMutation({
    mutationFn: addMeeting,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['meetings'] });
        setIsModalOpen(false);
    }
  });

  const deleteMeetingMutation = useMutation({
    mutationFn: deleteMeeting,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['meetings'] });
    }
  });

  const handleSaveMeeting = async (meeting: Omit<ZoomMeeting, 'id'>) => {
    addMeetingMutation.mutate(meeting);
  };
  
  const handleDeleteMeeting = async (meetingId: string) => {
    if(window.confirm('Are you sure you want to cancel this meeting?')) {
        deleteMeetingMutation.mutate(meetingId);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const totalPages = Math.ceil(meetings.length / itemsPerPage);
  const paginatedMeetings = meetings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Zoom Meetings</h1>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-indigo-700">
          <PlusIcon />
          Schedule Meeting
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg flex flex-col">
        <ul className="divide-y divide-gray-200">
          {paginatedMeetings.map((meeting) => (
            <li key={meeting.id} className="p-4 sm:p-6 hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                    <span className="text-sm font-medium text-primary bg-indigo-100 px-2 py-1 rounded">{new Date(meeting.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    <p className="ml-3 text-lg font-semibold text-gray-800">{meeting.topic}</p>
                </div>
                <div className="mt-2 sm:ml-4 sm:flex sm:items-baseline sm:space-x-4 text-sm text-gray-500">
                    <span>Time: {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="hidden sm:inline">·</span>
                    <span>Duration: {meeting.duration} mins</span>
                    <span className="hidden sm:inline">·</span>
                    <span>Host: {meeting.host}</span>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex-shrink-0 flex items-center space-x-3">
                <button onClick={() => alert('Secure link functionality: Link will be sent to users directly. Cannot be copied here.')} className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700">
                  Join
                </button>
                <button onClick={() => handleDeleteMeeting(meeting.id)} className="text-red-600 hover:text-red-800 p-2">
                  <DeleteIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
        />
      </div>

      {isModalOpen && (
        <Modal title="Schedule New Meeting" onClose={() => setIsModalOpen(false)}>
          <MeetingForm onSave={handleSaveMeeting} onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default MeetingsView;