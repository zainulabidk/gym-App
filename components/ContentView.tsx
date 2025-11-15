import React, { useState, useEffect, useCallback } from 'react';
import type { FitnessContent } from '../types';
import { ContentType } from '../types';
import { getContent, addContent, deleteContent } from '../services/mockApi';
import Modal from './Modal';
import { PlusIcon, DeleteIcon } from './Icons';

const ContentForm: React.FC<{ onSave: (content: any) => void; onCancel: () => void }> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: ContentType.Video,
    description: '',
    uploadDate: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, file upload would be handled here.
    onSave(formData);
  };

  const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm";
  const labelClasses = "block text-sm font-medium text-gray-600";
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClasses}>Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputClasses} required />
      </div>
      <div>
        <label className={labelClasses}>Content Type</label>
        <select name="type" value={formData.type} onChange={handleChange} className={inputClasses}>
          {Object.values(ContentType).map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>
      <div>
        <label className={labelClasses}>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className={inputClasses} />
      </div>
       <div>
        <label className={labelClasses}>File</label>
        <input type="file" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"/>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-transparent border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300">Cancel</button>
        <button type="submit" className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">Upload Content</button>
      </div>
    </form>
  );
};


const ContentView: React.FC = () => {
  const [content, setContent] = useState<FitnessContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    const contentData = await getContent();
    setContent(contentData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleSaveContent = async (item: Omit<FitnessContent, 'id'>) => {
    await addContent(item);
    fetchContent();
    setIsModalOpen(false);
  };
  
  const handleDeleteContent = async (contentId: string) => {
      if(window.confirm('Are you sure you want to delete this content?')) {
          await deleteContent(contentId);
          fetchContent();
      }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Fitness Content</h1>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-indigo-700">
          <PlusIcon />
          Upload Content
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {content.map((item) => (
          <div key={item.id} className="group relative bg-white rounded-lg shadow-md overflow-hidden">
            <img src={item.thumbnailUrl} alt={item.title} className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              {item.type === ContentType.Video && (
                <svg className="w-16 h-16 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 truncate">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1 h-10 overflow-hidden">{item.description}</p>
              <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                <span>{item.type}</span>
                <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
              </div>
            </div>
             <button onClick={() => handleDeleteContent(item.id)} className="absolute top-2 right-2 p-1.5 bg-white bg-opacity-70 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <DeleteIcon />
            </button>
          </div>
        ))}
      </div>
      
      {isModalOpen && (
        <Modal title="Upload New Content" onClose={() => setIsModalOpen(false)}>
          <ContentForm onSave={handleSaveContent} onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default ContentView;