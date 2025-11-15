import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import UsersView from './components/UsersView';
import SubscriptionsView from './components/SubscriptionsView';
import ContentView from './components/ContentView';
import MeetingsView from './components/MeetingsView';
import UserProfileView from './components/UserProfileView';
import type { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('Dashboard');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleBackToUsers = () => {
    setSelectedUserId(null);
  };

  const renderView = () => {
    switch (currentView) {
      case 'Dashboard':
        return <DashboardView />;
      case 'Users':
        return selectedUserId ? (
          <UserProfileView userId={selectedUserId} onBack={handleBackToUsers} />
        ) : (
          <UsersView onSelectUser={handleSelectUser} />
        );
      case 'Subscriptions':
        return <SubscriptionsView />;
      case 'Content':
        return <ContentView />;
      case 'Meetings':
        return <MeetingsView />;
      default:
        return <DashboardView />;
    }
  };
  
  const handleSetCurrentView = (view: View) => {
    setSelectedUserId(null); // Reset selected user when changing main views
    setCurrentView(view);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar currentView={currentView} setCurrentView={handleSetCurrentView} />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        {renderView()}
      </main>
    </div>
  );
};

export default App;