
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import UsersView from './components/UsersView';
import SubscriptionsView from './components/SubscriptionsView';
import ContentView from './components/ContentView';
import MeetingsView from './components/MeetingsView';
import UserProfileView from './components/UserProfileView';
import LoginView from './components/LoginView';
import PaymentsView from './components/PaymentsView';
import type { View } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>('Dashboard');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleBackToUsers = () => {
    setSelectedUserId(null);
  };
  
  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('Dashboard'); // Reset to default view on logout
  };

  const renderView = () => {
    switch (currentView) {
      case 'Dashboard':
        return <DashboardView setCurrentView={setCurrentView} />;
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
      case 'Payments':
        return <PaymentsView />;
      default:
        return <DashboardView setCurrentView={setCurrentView} />;
    }
  };
  
  const handleSetCurrentView = (view: View) => {
    setSelectedUserId(null); // Reset selected user when changing main views
    setCurrentView(view);
  };

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar currentView={currentView} setCurrentView={handleSetCurrentView} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
