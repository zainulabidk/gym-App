import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import StatCard from './StatCard';
import { getUsers, getPlans, getMeetings, getContent } from '../services/api';
import type { User, FitnessContent, View } from '../types';
import { SubscriptionStatus } from '../types';
import { UserPlusIcon, CreditCardIcon, VideoCameraIcon, ClockIcon, ArrowRightIcon } from './Icons';

type Activity = {
  type: 'new_user' | 'new_content' | 'upgraded_plan';
  date: Date;
  data: User | FitnessContent | { name: string; plan: string };
};

interface DashboardViewProps {
  setCurrentView: (view: View) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ setCurrentView }) => {
  // Parallel fetching with useQuery
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({ queryKey: ['users'], queryFn: getUsers });
  const { data: plans = [], isLoading: isLoadingPlans } = useQuery({ queryKey: ['plans'], queryFn: getPlans });
  const { data: meetings = [], isLoading: isLoadingMeetings } = useQuery({ queryKey: ['meetings'], queryFn: getMeetings });
  const { data: content = [], isLoading: isLoadingContent } = useQuery({ queryKey: ['content'], queryFn: getContent });

  const loading = isLoadingUsers || isLoadingPlans || isLoadingMeetings || isLoadingContent;

  const totalUsers = users.length;
  const activeSubscriptions = users.filter(u => u.subscriptionStatus === SubscriptionStatus.Active).length;
  
  const monthlyRevenue = useMemo(() => {
    return users.reduce((acc, user) => {
        if (user.subscriptionStatus === SubscriptionStatus.Active) {
            const plan = plans.find(p => p.name === user.subscriptionPlan);
            if (plan) {
                return acc + (plan.duration === 'monthly' ? plan.price : plan.price / 12);
            }
        }
        return acc;
    }, 0);
  }, [users, plans]);

  const recentActivity = useMemo((): Activity[] => {
    const userActivities: Activity[] = users.map(u => ({ type: 'new_user', data: u, date: new Date(u.joinDate) }));
    const contentActivities: Activity[] = content.map(c => ({ type: 'new_content', data: c, date: new Date(c.uploadDate) }));
    // Add a synthetic upgrade activity for demonstration (would normally come from API)
    const upgradeActivity: Activity[] = users[0] ? [{ type: 'upgraded_plan', data: { name: users[0].name, plan: 'Premium' }, date: new Date(Date.now() - 24 * 60 * 60 * 1000)}] : [];
    
    return [...userActivities, ...contentActivities, ...upgradeActivity]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  }, [users, content]);

  const upcomingMeetings = useMemo(() => {
    return meetings
        .filter(m => new Date(m.startTime) > new Date())
        .sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        .slice(0, 3);
  }, [meetings]);

  const timeSince = (date: Date) => {
      const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
      let interval = seconds / 31536000;
      if (interval > 1) return Math.floor(interval) + " years ago";
      interval = seconds / 2592000;
      if (interval > 1) return Math.floor(interval) + " months ago";
      interval = seconds / 86400;
      if (interval > 1) return Math.floor(interval) + " days ago";
      interval = seconds / 3600;
      if (interval > 1) return Math.floor(interval) + " hours ago";
      interval = seconds / 60;
      if (interval > 1) return Math.floor(interval) + " minutes ago";
      return Math.floor(seconds) + " seconds ago";
  };

  const renderActivityItem = (activity: Activity) => {
    switch (activity.type) {
        case 'new_user':
            const user = activity.data as User;
            return <><span className="font-semibold">{user.name}</span> registered.</>;
        case 'new_content':
            const item = activity.data as FitnessContent;
            return <><span className="font-semibold">{item.title}</span> was uploaded.</>;
        case 'upgraded_plan':
            const upgrade = activity.data as { name: string, plan: string };
            return <><span className="font-semibold">{upgrade.name}</span> upgraded to the <span className="font-semibold">{upgrade.plan}</span> plan.</>;
        default:
            return null;
    }
  };

  const activityIcons: Record<Activity['type'], React.ReactNode> = {
    new_user: <UserPlusIcon />,
    new_content: <VideoCameraIcon />,
    upgraded_plan: <CreditCardIcon />,
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={totalUsers.toString()} />
        <StatCard title="Active Subscriptions" value={activeSubscriptions.toString()} />
        <StatCard title="Est. Monthly Revenue" value={`$${monthlyRevenue.toFixed(2)}`} />
        <StatCard title="Upcoming Meetings" value={meetings.length.toString()} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
            <ul className="space-y-4">
                {recentActivity.map((activity, index) => (
                    <li key={index} className="flex items-center space-x-4">
                        <div className="flex-shrink-0 bg-gray-100 rounded-full p-2 text-gray-600">{activityIcons[activity.type]}</div>
                        <div className="flex-1 text-sm text-gray-700">
                           {renderActivityItem(activity)}
                           <p className="text-xs text-gray-500">{timeSince(activity.date)}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Upcoming Meetings</h2>
            <ul className="space-y-4">
              {upcomingMeetings.length > 0 ? upcomingMeetings.map(meeting => (
                  <li key={meeting.id}>
                      <p className="font-semibold text-gray-800">{meeting.topic}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                          <ClockIcon />
                          <span className="ml-2">{new Date(meeting.startTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                  </li>
              )) : <p className="text-sm text-gray-500">No upcoming meetings.</p>}
            </ul>
             {meetings.length > 0 && (
                 <button 
                    onClick={() => setCurrentView('Meetings')}
                    className="mt-6 w-full text-sm font-semibold text-primary hover:text-indigo-700 flex items-center justify-center gap-2">
                    <span>View all meetings</span>
                    <ArrowRightIcon />
                </button>
             )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;