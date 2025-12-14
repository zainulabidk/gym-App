import api from '../lib/axios';
import type { User, SubscriptionPlan, FitnessContent, ZoomMeeting, PaymentRequest } from '../types';
import { PaymentStatus } from '../types';

// --- Users ---
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/users');
  return response.data;
};

export const getUser = async (userId: string): Promise<User> => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const addUser = async (user: Omit<User, 'id' | 'avatarUrl'>): Promise<User> => {
  const response = await api.post('/users', user);
  return response.data;
};

export const updateUser = async (user: User): Promise<User> => {
  const response = await api.put(`/users/${user.id}`, user);
  return response.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
  await api.delete(`/users/${userId}`);
};

// --- Subscriptions ---
export const getPlans = async (): Promise<SubscriptionPlan[]> => {
  const response = await api.get('/plans');
  return response.data;
};

export const addPlan = async (plan: Omit<SubscriptionPlan, 'id'>): Promise<SubscriptionPlan> => {
  const response = await api.post('/plans', plan);
  return response.data;
};

export const updatePlan = async (plan: SubscriptionPlan): Promise<SubscriptionPlan> => {
  const response = await api.put(`/plans/${plan.id}`, plan);
  return response.data;
};

export const deletePlan = async (planId: string): Promise<void> => {
  await api.delete(`/plans/${planId}`);
};

// --- Content ---
export const getContent = async (): Promise<FitnessContent[]> => {
  const response = await api.get('/content');
  return response.data;
};

export const addContent = async (content: Omit<FitnessContent, 'id' | 'thumbnailUrl'>): Promise<FitnessContent> => {
  // Note: For real file uploads, you would typically use FormData here
  const response = await api.post('/content', content);
  return response.data;
};

export const deleteContent = async (contentId: string): Promise<void> => {
  await api.delete(`/content/${contentId}`);
};

// --- Meetings ---
export const getMeetings = async (): Promise<ZoomMeeting[]> => {
  const response = await api.get('/meetings');
  return response.data;
};

export const addMeeting = async (meeting: Omit<ZoomMeeting, 'id' | 'meetingUrl'>): Promise<ZoomMeeting> => {
  const response = await api.post('/meetings', meeting);
  return response.data;
};

export const deleteMeeting = async (meetingId: string): Promise<void> => {
  await api.delete(`/meetings/${meetingId}`);
};

// --- Payments ---
export const getPaymentRequests = async (): Promise<PaymentRequest[]> => {
  const response = await api.get('/payments');
  return response.data;
};

export const updatePaymentStatus = async (data: { id: string; status: PaymentStatus; notes?: string }): Promise<PaymentRequest> => {
  const response = await api.put(`/payments/${data.id}`, { status: data.status, notes: data.notes });
  return response.data;
};
