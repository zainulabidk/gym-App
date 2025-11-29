
import type { User, SubscriptionPlan, FitnessContent, ZoomMeeting, UserProgress, PaymentRequest } from '../types';
import { SubscriptionStatus, ContentType, PaymentStatus } from '../types';

const user1Progress: UserProgress = {
    workoutLogs: [
        { id: 'wl1', workoutName: 'Full Body HIIT', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 30 },
        { id: 'wl2', workoutName: 'Advanced Abs', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 20, notes: "Felt strong today." },
        { id: 'wl3', workoutName: 'Morning Yoga Flow', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 45 },
    ]
};

const user2Progress: UserProgress = {
    workoutLogs: [
        { id: 'wl4', workoutName: 'Full Body HIIT', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 30 },
        { id: 'wl5', workoutName: 'Healthy Meal Prep', date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 15, notes: "Not a workout, but logged time." },
    ]
};

let users: User[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', mobile: '123-456-7890', joinDate: '2023-01-15', subscriptionPlan: 'Premium', subscriptionStatus: SubscriptionStatus.Active, avatarUrl: 'https://picsum.photos/seed/user1/200', progress: user1Progress },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', mobile: '234-567-8901', joinDate: '2023-02-20', subscriptionPlan: 'Basic', subscriptionStatus: SubscriptionStatus.Active, avatarUrl: 'https://picsum.photos/seed/user2/200', progress: user2Progress },
  { id: '3', name: 'Mike Johnson', email: 'mike.j@example.com', mobile: '345-678-9012', joinDate: '2023-03-10', subscriptionPlan: 'Premium', subscriptionStatus: SubscriptionStatus.Inactive, avatarUrl: 'https://picsum.photos/seed/user3/200', progress: { workoutLogs: [] } },
  { id: '4', name: 'Emily Davis', email: 'emily.d@example.com', mobile: '456-789-0123', joinDate: '2023-04-05', subscriptionPlan: 'Free Trial', subscriptionStatus: SubscriptionStatus.Cancelled, avatarUrl: 'https://picsum.photos/seed/user4/200' },
];

let plans: SubscriptionPlan[] = [
  { id: '1', name: 'Free Trial', price: 0, duration: 'monthly', features: ['Access to basic workouts', 'Community access'] },
  { id: '2', name: 'Basic', price: 19.99, duration: 'monthly', features: ['All Free features', 'Access to all workouts', 'Personalized plans'] },
  { id: '3', name: 'Premium', price: 49.99, duration: 'monthly', features: ['All Basic features', '1-on-1 coaching', 'Live classes via Zoom'] },
  { id: '4', name: 'Premium Yearly', price: 499.99, duration: 'yearly', features: ['All Premium features', '2 months free'] },
];

let content: FitnessContent[] = [
  { id: '1', title: 'Full Body HIIT', type: ContentType.Video, description: 'A 30-minute high-intensity interval training session.', thumbnailUrl: 'https://picsum.photos/seed/content1/400/300', uploadDate: '2023-05-01' },
  { id: '2', title: 'Morning Yoga Flow', type: ContentType.Video, description: 'Start your day with this refreshing yoga routine.', thumbnailUrl: 'https://picsum.photos/seed/content2/400/300', uploadDate: '2023-05-02' },
  { id: '3', title: 'Healthy Meal Prep', type: ContentType.Image, description: 'Ideas for a week of healthy meals.', thumbnailUrl: 'https://picsum.photos/seed/content3/400/300', uploadDate: '2023-05-03' },
  { id: '4', title: 'Advanced Abs', type: ContentType.Video, description: 'Challenge your core with these advanced exercises.', thumbnailUrl: 'https://picsum.photos/seed/content4/400/300', uploadDate: '2023-05-04' },
];

let meetings: ZoomMeeting[] = [
  { id: '1', topic: 'HIIT Live Session', startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), duration: 45, host: 'Coach Sarah', meetingUrl: '#' },
  { id: '2', topic: 'Advanced Yoga Workshop', startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), duration: 90, host: 'Coach David', meetingUrl: '#' },
  { id: '3', topic: 'Nutrition Q&A', startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), duration: 60, host: 'Dr. Evans', meetingUrl: '#' },
];

let paymentRequests: PaymentRequest[] = [
    { 
        id: 'pay1', 
        userId: '3', 
        userName: 'Mike Johnson', 
        userEmail: 'mike.j@example.com',
        amount: 49.99, 
        currency: 'USD', 
        screenshotUrl: 'https://picsum.photos/seed/pay1/300/600', 
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), 
        status: PaymentStatus.Pending, 
        planName: 'Premium',
        notes: 'Transaction ID: TXN12345'
    },
    { 
        id: 'pay2', 
        userId: '2', 
        userName: 'Jane Smith', 
        userEmail: 'jane.smith@example.com',
        amount: 19.99, 
        currency: 'USD', 
        screenshotUrl: 'https://picsum.photos/seed/pay2/300/600', 
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), 
        status: PaymentStatus.Approved, 
        planName: 'Basic'
    },
    { 
        id: 'pay3', 
        userId: '1', 
        userName: 'John Doe', 
        userEmail: 'john.doe@example.com',
        amount: 499.99, 
        currency: 'USD', 
        screenshotUrl: 'https://picsum.photos/seed/pay3/300/600', 
        date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), 
        status: PaymentStatus.Rejected, 
        planName: 'Premium Yearly',
        notes: 'Screenshot blurry, please re-upload'
    },
];

const simulateDelay = <T,>(data: T): Promise<T> => new Promise(res => setTimeout(() => res(data), 500));

// User API
export const getUsers = () => simulateDelay([...users]);
export const getUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return simulateDelay(user ? { ...user } : null);
};
export const addUser = (user: Omit<User, 'id' | 'avatarUrl'>) => {
  const newUser: User = { ...user, id: String(Date.now()), avatarUrl: `https://picsum.photos/seed/user${Date.now()}/200` };
  users.push(newUser);
  return simulateDelay(newUser);
};
export const updateUser = (updatedUser: User) => {
  users = users.map(u => u.id === updatedUser.id ? updatedUser : u);
  return simulateDelay(updatedUser);
};
export const deleteUser = (userId: string) => {
  users = users.filter(u => u.id !== userId);
  return simulateDelay({ success: true });
};

// Subscription API
export const getPlans = () => simulateDelay([...plans]);
export const addPlan = (plan: Omit<SubscriptionPlan, 'id'>) => {
  const newPlan: SubscriptionPlan = { ...plan, id: String(Date.now()) };
  plans.push(newPlan);
  return simulateDelay(newPlan);
};
export const updatePlan = (updatedPlan: SubscriptionPlan) => {
  plans = plans.map(p => p.id === updatedPlan.id ? updatedPlan : p);
  return simulateDelay(updatedPlan);
};
export const deletePlan = (planId: string) => {
  plans = plans.filter(p => p.id !== planId);
  return simulateDelay({ success: true });
};

// Content API
export const getContent = () => simulateDelay([...content]);
export const addContent = (item: Omit<FitnessContent, 'id' | 'thumbnailUrl'>) => {
  const newItem: FitnessContent = { ...item, id: String(Date.now()), thumbnailUrl: `https://picsum.photos/seed/content${Date.now()}/400/300` };
  content.push(newItem);
  return simulateDelay(newItem);
};
export const deleteContent = (contentId: string) => {
  content = content.filter(c => c.id !== contentId);
  return simulateDelay({ success: true });
};

// Meetings API
export const getMeetings = () => simulateDelay([...meetings]);
export const addMeeting = (meeting: Omit<ZoomMeeting, 'id' | 'meetingUrl'>) => {
  const newMeeting: ZoomMeeting = { ...meeting, id: String(Date.now()), meetingUrl: '#' };
  meetings.push(newMeeting);
  return simulateDelay(newMeeting);
};
export const deleteMeeting = (meetingId: string) => {
  meetings = meetings.filter(m => m.id !== meetingId);
  return simulateDelay({ success: true });
};

// Payment API
export const getPaymentRequests = () => simulateDelay([...paymentRequests]);
export const updatePaymentStatus = (paymentId: string, status: PaymentStatus, notes?: string) => {
    paymentRequests = paymentRequests.map(p => {
        if (p.id === paymentId) {
            return { ...p, status, ...(notes ? { notes } : {}) };
        }
        return p;
    });
    // Also simulate updating user subscription status if approved
    if (status === PaymentStatus.Approved) {
        const payment = paymentRequests.find(p => p.id === paymentId);
        if (payment) {
            const user = users.find(u => u.id === payment.userId);
            if (user) {
                user.subscriptionStatus = SubscriptionStatus.Active;
                user.subscriptionPlan = payment.planName;
            }
        }
    }
    const updatedPayment = paymentRequests.find(p => p.id === paymentId);
    return simulateDelay(updatedPayment);
};
