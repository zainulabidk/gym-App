export type View = 'Dashboard' | 'Users' | 'Subscriptions' | 'Content' | 'Meetings';

export enum SubscriptionStatus {
    Active = 'Active',
    Inactive = 'Inactive',
    Cancelled = 'Cancelled'
}

export interface WorkoutLog {
    id: string;
    workoutName: string;
    date: string; // ISO string
    durationMinutes: number;
    notes?: string;
}

export interface UserProgress {
    workoutLogs: WorkoutLog[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  joinDate: string;
  subscriptionPlan: string;
  subscriptionStatus: SubscriptionStatus;
  avatarUrl: string;
  progress?: UserProgress;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: 'monthly' | 'yearly';
  features: string[];
}

export enum ContentType {
    Video = 'Video',
    Image = 'Image'
}

export interface FitnessContent {
  id: string;
  title: string;
  type: ContentType;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
}

export interface ZoomMeeting {
  id: string;
  topic: string;
  startTime: string;
  duration: number; // in minutes
  host: string;
  meetingUrl: string;
}