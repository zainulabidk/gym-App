
import React, { useState, useEffect, useCallback } from 'react';
import type { PaymentRequest } from '../types';
import { PaymentStatus } from '../types';
import { getPaymentRequests, updatePaymentStatus } from '../services/mockApi';
import Modal from './Modal';
import { CheckIcon, XMarkIcon, EyeIcon } from './Icons';

const PaymentsView: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    const data = await getPaymentRequests();
    // Sort by pending first, then date
    const sortedData = data.sort((a, b) => {
        if (a.status === PaymentStatus.Pending && b.status !== PaymentStatus.Pending) return -1;
        if (a.status !== PaymentStatus.Pending && b.status === PaymentStatus.Pending) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    setPayments(sortedData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleStatusUpdate = async (id: string, status: PaymentStatus) => {
    const message = status === PaymentStatus.Approved 
        ? 'Are you sure you want to approve this payment?' 
        : 'Are you sure you want to reject this payment?';
    
    if (window.confirm(message)) {
        await updatePaymentStatus(id, status);
        fetchPayments();
    }
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.Approved: return 'bg-green-100 text-green-800';
      case PaymentStatus.Rejected: return 'bg-red-100 text-red-800';
      case PaymentStatus.Pending: return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Payment Requests</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan & Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Screenshot</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.userName}</div>
                    <div className="text-sm text-gray-500">{payment.userEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.planName}</div>
                    <div className="text-sm font-semibold text-gray-700">${payment.amount.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.date).toLocaleDateString()}
                    <div className="text-xs">{new Date(payment.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                        onClick={() => setSelectedImage(payment.screenshotUrl)}
                        className="flex items-center space-x-1 text-sm text-primary hover:text-indigo-800"
                    >
                        <EyeIcon />
                        <span>View</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {payment.status === PaymentStatus.Pending && (
                        <div className="flex items-center justify-end space-x-3">
                            <button 
                                onClick={() => handleStatusUpdate(payment.id, PaymentStatus.Approved)} 
                                className="text-green-600 hover:text-green-900 flex items-center gap-1 bg-green-50 px-2 py-1 rounded border border-green-200"
                                title="Approve"
                            >
                                <CheckIcon /> Approve
                            </button>
                            <button 
                                onClick={() => handleStatusUpdate(payment.id, PaymentStatus.Rejected)} 
                                className="text-red-600 hover:text-red-900 flex items-center gap-1 bg-red-50 px-2 py-1 rounded border border-red-200"
                                title="Reject"
                            >
                                <XMarkIcon /> Reject
                            </button>
                        </div>
                    )}
                    {payment.status !== PaymentStatus.Pending && (
                        <span className="text-gray-400 italic text-xs">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {payments.length === 0 && (
              <div className="p-6 text-center text-gray-500">No payment requests found.</div>
          )}
        </div>
      </div>
      
      {selectedImage && (
        <Modal title="Payment Receipt" onClose={() => setSelectedImage(null)}>
          <div className="flex justify-center">
            <img src={selectedImage} alt="Payment Receipt" className="max-w-full max-h-[80vh] rounded shadow-lg" />
          </div>
          <div className="mt-4 flex justify-end">
              <button onClick={() => setSelectedImage(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Close</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PaymentsView;
