import React, { useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { SubscriptionStatus } from '../types';
import { getUsers, addUser, updateUser, deleteUser } from '../services/mockApi';
import Modal from './Modal';
import { PlusIcon, EditIcon, DeleteIcon } from './Icons';

const UserForm: React.FC<{ user: Partial<User> | null; onSave: (user: any) => void; onCancel: () => void }> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    subscriptionPlan: 'Basic',
    subscriptionStatus: SubscriptionStatus.Active,
    ...user,
    joinDate: user?.joinDate || new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm";
  const labelClasses = "block text-sm font-medium text-gray-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClasses}>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClasses} required />
      </div>
      <div>
        <label className={labelClasses}>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClasses} required />
      </div>
      <div>
        <label className={labelClasses}>Mobile</label>
        <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses}>Subscription Plan</label>
        <select name="subscriptionPlan" value={formData.subscriptionPlan} onChange={handleChange} className={inputClasses}>
          <option>Free Trial</option>
          <option>Basic</option>
          <option>Premium</option>
          <option>Premium Yearly</option>
        </select>
      </div>
      <div>
        <label className={labelClasses}>Subscription Status</label>
        <select name="subscriptionStatus" value={formData.subscriptionStatus} onChange={handleChange} className={inputClasses}>
          {Object.values(SubscriptionStatus).map(status => <option key={status} value={status}>{status}</option>)}
        </select>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-transparent border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300">Cancel</button>
        <button type="submit" className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">Save User</button>
      </div>
    </form>
  );
};


const UsersView: React.FC<{ onSelectUser: (userId: string) => void }> = ({ onSelectUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const usersData = await getUsers();
    setUsers(usersData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenModal = (user: User | null = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = async (user: User) => {
    if (editingUser) {
      await updateUser({ ...editingUser, ...user });
    } else {
      await addUser(user);
    }
    fetchUsers();
    handleCloseModal();
  };

  const handleDeleteUser = async (userId: string) => {
    if(window.confirm('Are you sure you want to delete this user?')) {
        await deleteUser(userId);
        fetchUsers();
    }
  };

  const getStatusBadge = (status: SubscriptionStatus) => {
    switch (status) {
      case SubscriptionStatus.Active: return 'bg-green-100 text-green-800';
      case SubscriptionStatus.Inactive: return 'bg-yellow-100 text-yellow-800';
      case SubscriptionStatus.Cancelled: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <button onClick={() => handleOpenModal()} className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-indigo-700">
            <PlusIcon />
            Add User
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onSelectUser(user.id)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.mobile}</div>
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.subscriptionPlan}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(user.subscriptionStatus)}`}>
                      {user.subscriptionStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.joinDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center space-x-3">
                        <button onClick={() => handleOpenModal(user)} className="text-primary hover:text-indigo-900"><EditIcon/></button>
                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900"><DeleteIcon /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {isModalOpen && (
        <Modal title={editingUser ? 'Edit User' : 'Add New User'} onClose={handleCloseModal}>
          <UserForm user={editingUser} onSave={handleSaveUser} onCancel={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
};

export default UsersView;