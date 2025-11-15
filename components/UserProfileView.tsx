import React, { useState, useEffect, useMemo } from 'react';
import type { User } from '../types';
import { SubscriptionStatus } from '../types';
import { getUser } from '../services/mockApi';
import { ChevronLeftIcon, DumbbellIcon } from './Icons';
import StatCard from './StatCard';

const UserProfileView: React.FC<{ userId: string; onBack: () => void }> = ({ userId, onBack }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const userData = await getUser(userId);
      setUser(userData);
      setLoading(false);
    };
    fetchUser();
  }, [userId]);

  const getStatusBadge = (status: SubscriptionStatus) => {
    switch (status) {
      case SubscriptionStatus.Active: return 'bg-green-100 text-green-800';
      case SubscriptionStatus.Inactive: return 'bg-yellow-100 text-yellow-800';
      case SubscriptionStatus.Cancelled: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const workoutsThisMonth = useMemo(() => {
    if (!user?.progress?.workoutLogs) return 0;
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return user.progress.workoutLogs.filter(log => new Date(log.date) >= oneMonthAgo).length;
  }, [user]);

  const totalWorkoutTime = useMemo(() => {
    if (!user?.progress?.workoutLogs) return 0;
    const totalMinutes = user.progress.workoutLogs.reduce((acc, log) => acc + log.durationMinutes, 0);
    return (totalMinutes / 60).toFixed(1); // Return hours
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!user) {
    return (
        <div>
            <button onClick={onBack} className="inline-flex items-center gap-2 mb-4 text-sm font-medium text-gray-600 hover:text-gray-900">
                <ChevronLeftIcon /> Back to Users
            </button>
            <p className="text-center text-gray-500">User not found.</p>
        </div>
    );
  }

  const sortedWorkoutLogs = user.progress?.workoutLogs?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];

  return (
    <div>
      <button onClick={onBack} className="inline-flex items-center gap-2 mb-6 text-sm font-medium text-gray-600 hover:text-gray-900">
        <ChevronLeftIcon />
        Back to Users List
      </button>

      {/* Profile Header */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex items-center space-x-6">
          <img className="h-24 w-24 rounded-full" src={user.avatarUrl} alt={`${user.name}'s avatar`} />
          <div className="flex-1">
            <div className="flex items-baseline space-x-3">
              <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(user.subscriptionStatus)}`}>
                {user.subscriptionStatus}
              </span>
            </div>
            <p className="text-gray-500 mt-1">{user.email}</p>
            <p className="text-sm text-gray-500 mt-2">Plan: <span className="font-medium text-gray-700">{user.subscriptionPlan}</span></p>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard title="Workouts This Month" value={workoutsThisMonth.toString()} />
          <StatCard title="Total Workout Time (hrs)" value={totalWorkoutTime} />
          <StatCard title="Member Since" value={new Date(user.joinDate).toLocaleDateString()} />
      </div>

      {/* Workout History */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-4">
            <DumbbellIcon />
            <h2 className="text-xl font-semibold text-gray-700">Workout History</h2>
        </div>
        {sortedWorkoutLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workout</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedWorkoutLogs.map(log => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.workoutName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.durationMinutes} mins</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.notes || '–'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No workout data logged for this user.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfileView;
