import React from 'react';
import type { View } from '../types';
import { DashboardIcon, UsersIcon, SubscriptionsIcon, ContentIcon, MeetingsIcon, LogoutIcon, CurrencyDollarIcon } from './Icons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onLogout }) => {
  const navItems: { name: View; icon: React.ReactNode }[] = [
    { name: 'Dashboard', icon: <DashboardIcon /> },
    { name: 'Users', icon: <UsersIcon /> },
    { name: 'Subscriptions', icon: <SubscriptionsIcon /> },
    { name: 'Content', icon: <ContentIcon /> },
    { name: 'Meetings', icon: <MeetingsIcon /> },
    { name: 'Payments', icon: <CurrencyDollarIcon /> },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-secondary text-gray-300 flex flex-col">
      <div className="h-24 flex items-center justify-center border-b border-gray-700">
        <div className="flex flex-col items-center">
             {/* Logo Representation */}
             <div className="flex items-center gap-1">
                <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Q7</span>
                <span className="text-xl font-bold text-white tracking-widest mt-1">FITNESS</span>
             </div>
             <span className="text-[10px] tracking-[0.2em] text-gray-500 uppercase">Admin Panel</span>
        </div>
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
                ? 'bg-gradient-to-r from-primary to-yellow-600 text-white shadow-lg'
                : 'hover:bg-gray-700 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </a>
        ))}
      </nav>
      <div className="px-4 py-6 border-t border-gray-700">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onLogout();
            }}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-700 hover:text-white"
          >
            <LogoutIcon />
            <span className="font-medium">Logout</span>
          </a>
      </div>
    </aside>
  );
};

export default Sidebar;