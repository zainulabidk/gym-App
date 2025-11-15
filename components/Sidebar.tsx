
import React from 'react';
import type { View } from '../types';
import { DashboardIcon, UsersIcon, SubscriptionsIcon, ContentIcon, MeetingsIcon } from './Icons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const navItems: { name: View; icon: React.ReactNode }[] = [
    { name: 'Dashboard', icon: <DashboardIcon /> },
    { name: 'Users', icon: <UsersIcon /> },
    { name: 'Subscriptions', icon: <SubscriptionsIcon /> },
    { name: 'Content', icon: <ContentIcon /> },
    { name: 'Meetings', icon: <MeetingsIcon /> },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-secondary text-gray-300 flex flex-col">
      <div className="h-20 flex items-center justify-center border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white tracking-wider">GYM ADMIN</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.name}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentView(item.name);
            }}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentView === item.name
                ? 'bg-primary text-white shadow-lg'
                : 'hover:bg-gray-700 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </a>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-center text-gray-500">&copy; 2024 Gym Inc. All rights reserved.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
