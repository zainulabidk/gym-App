import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PaymentRequest } from '../types';
import { PaymentStatus } from '../types';
import { getPaymentRequests, updatePaymentStatus } from '../services/api';
import Modal from './Modal';
import Pagination from './Pagination';
import { CheckIcon, XMarkIcon, EyeIcon } from './Icons';

const PaymentsView: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedPayment, setSelectedPayment] = useState<PaymentRequest | null>(null);

  // Rejection Modal State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [paymentToRejectId, setPaymentToRejectId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: getPaymentRequests,
    select: (data) => data.sort((a, b) => {
        if (a.status === PaymentStatus.Pending && b.status !== PaymentStatus.Pending) return -1;
        if (a.status !== PaymentStatus.Pending && b.status === PaymentStatus.Pending) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
  });

  const updateStatusMutation = useMutation({
    mutationFn: updatePaymentStatus,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['payments'] });
        queryClient.invalidateQueries({ queryKey: ['users'] }); // Since approving might update user sub status
    }
  });

  const handleApprove = async (id: string) => {
    if (window.confirm('Are you sure you want to approve this payment?')) {
        updateStatusMutation.mutate({ id, status: PaymentStatus.Approved });
        if (selectedPayment?.id === id) {
            setSelectedPayment(null);
        }
    }
  };

  const handleRejectClick = (id: string) => {
    setPaymentToRejectId(id);
    setRejectionReason('');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
      if (paymentToRejectId) {
          updateStatusMutation.mutate({ id: paymentToRejectId, status: PaymentStatus.Rejected, notes: rejectionReason });
          setIsRejectModalOpen(false);
          setPaymentToRejectId(null);
          if (selectedPayment?.id === paymentToRejectId) {
              setSelectedPayment(null);
          }
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

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const totalPages = Math.ceil(payments.length / itemsPerPage);
  const paginatedPayments = payments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Payment Requests</h1>

      <div className="bg-white shadow-md rounded-lg flex flex-col">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan & Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedPayments.map((payment) => (
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
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                        onClick={() => setSelectedPayment(payment)}
                        className="text-primary hover:text-yellow-700 inline-flex items-center justify-center p-2 rounded-full hover:bg-yellow-50 transition-colors"
                        title="View Details"
                    >
                        <EyeIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {payments.length === 0 && (
              <div className="p-6 text-center text-gray-500">No payment requests found.</div>
          )}
        </div>
        <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
        />
      </div>
      
      {selectedPayment && (
        <Modal title="Payment Request Details" onClose={() => setSelectedPayment(null)}>
          <div className="flex flex-col gap-4">
             {/* Header Info */}
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div>
                    <h3 className="font-bold text-gray-900">{selectedPayment.userName}</h3>
                    <p className="text-sm text-gray-500">{selectedPayment.userEmail}</p>
                </div>
                <div className="mt-2 sm:mt-0 text-left sm:text-right">
                    <p className="text-lg font-bold text-primary">${selectedPayment.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-600 uppercase font-semibold">{selectedPayment.planName}</p>
                </div>
             </div>

             {/* Screenshot Area */}
             <div className="relative bg-gray-100 rounded-lg border border-gray-200 p-2 flex items-center justify-center min-h-[300px]">
                <img 
                    src={selectedPayment.screenshotUrl} 
                    alt="Payment Proof" 
                    className="max-w-full max-h-[50vh] object-contain rounded shadow-sm" 
                />
             </div>
             
             {/* Metadata */}
             <div className="flex justify-between items-center text-xs text-gray-500 px-1">
                 <span>Submitted: {new Date(selectedPayment.date).toLocaleString()}</span>
                 <span>ID: {selectedPayment.id}</span>
             </div>

             {selectedPayment.notes && (
                <div className={`bg-yellow-50 border border-yellow-100 p-3 rounded text-sm ${selectedPayment.status === PaymentStatus.Rejected ? 'text-red-800 bg-red-50 border-red-100' : 'text-yellow-800'}`}>
                    <span className="font-bold block mb-1">{selectedPayment.status === PaymentStatus.Rejected ? 'Rejection Reason / Notes:' : 'Notes:'}</span> 
                    {selectedPayment.notes}
                </div>
             )}

             {/* Action Footer */}
             <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                <button 
                    onClick={() => setSelectedPayment(null)} 
                    className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                >
                    Close
                </button>
                
                {selectedPayment.status === PaymentStatus.Pending && (
                    <>
                         <button 
                             onClick={() => handleRejectClick(selectedPayment.id)}
                             className="w-full sm:w-auto px-4 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                         >
                             <XMarkIcon /> Reject
                         </button>
                         <button 
                              onClick={() => handleApprove(selectedPayment.id)}
                             className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                         >
                             <CheckIcon /> Approve Payment
                         </button>
                    </>
                )}
             </div>
          </div>
        </Modal>
      )}

      {/* Rejection Modal */}
      {isRejectModalOpen && (
          <Modal title="Reject Payment" onClose={() => setIsRejectModalOpen(false)}>
              <div className="space-y-4">
                  <p className="text-gray-600 text-sm">Please provide a reason for rejecting this payment request. This note will be saved with the request.</p>
                  <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                      rows={4}
                      placeholder="Enter rejection reason (e.g., Screenshot unclear, Payment not received...)"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                  ></textarea>
                  <div className="flex justify-end gap-3 pt-2">
                      <button 
                          onClick={() => setIsRejectModalOpen(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                          Cancel
                      </button>
                      <button 
                          onClick={handleConfirmReject}
                          className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!rejectionReason.trim()}
                      >
                          Confirm Rejection
                      </button>
                  </div>
              </div>
          </Modal>
      )}
    </div>
  );
};

export default PaymentsView;