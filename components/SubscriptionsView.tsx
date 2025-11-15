import React, { useState, useEffect, useCallback } from 'react';
import type { SubscriptionPlan } from '../types';
import { getPlans, addPlan, updatePlan, deletePlan } from '../services/mockApi';
import Modal from './Modal';
import { PlusIcon, EditIcon, DeleteIcon } from './Icons';

const PlanForm: React.FC<{ plan: Partial<SubscriptionPlan> | null; onSave: (plan: any) => void; onCancel: () => void }> = ({ plan, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    duration: 'monthly' as 'monthly' | 'yearly',
    ...plan,
    features: plan?.features?.join(', ') || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, features: formData.features.split(',').map(f => f.trim()) });
  };
  
  const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm";
  const labelClasses = "block text-sm font-medium text-gray-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClasses}>Plan Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClasses} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Price ($)</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} className={inputClasses} required />
        </div>
        <div>
          <label className={labelClasses}>Duration</label>
          <select name="duration" value={formData.duration} onChange={handleChange} className={inputClasses}>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelClasses}>Features (comma-separated)</label>
        <textarea name="features" value={formData.features} onChange={handleChange} rows={3} className={inputClasses} />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-transparent border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300">Cancel</button>
        <button type="submit" className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">Save Plan</button>
      </div>
    </form>
  );
};


const SubscriptionsView: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    const plansData = await getPlans();
    setPlans(plansData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleOpenModal = (plan: SubscriptionPlan | null = null) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };
  
  const handleSavePlan = async (plan: SubscriptionPlan) => {
    if (editingPlan) {
      await updatePlan({ ...editingPlan, ...plan });
    } else {
      await addPlan(plan);
    }
    fetchPlans();
    handleCloseModal();
  };

  const handleDeletePlan = async (planId: string) => {
    if(window.confirm('Are you sure you want to delete this plan?')) {
      await deletePlan(planId);
      fetchPlans();
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Subscription Plans</h1>
        <button onClick={() => handleOpenModal()} className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-indigo-700">
          <PlusIcon />
          Add Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col">
            <h2 className="text-xl font-bold text-gray-800">{plan.name}</h2>
            <p className="mt-2 text-4xl font-extrabold text-gray-900">${plan.price}<span className="text-base font-medium text-gray-500">/{plan.duration === 'monthly' ? 'mo' : 'yr'}</span></p>
            <ul className="mt-6 space-y-2 text-gray-600 flex-grow">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t flex justify-end space-x-2">
              <button onClick={() => handleOpenModal(plan)} className="text-sm font-medium text-primary hover:text-indigo-900 p-2"><EditIcon /></button>
              <button onClick={() => handleDeletePlan(plan.id)} className="text-sm font-medium text-red-600 hover:text-red-900 p-2"><DeleteIcon /></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Modal title={editingPlan ? 'Edit Plan' : 'Add New Plan'} onClose={handleCloseModal}>
          <PlanForm plan={editingPlan} onSave={handleSavePlan} onCancel={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
};

export default SubscriptionsView;