
import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { CropDoctor } from './components/CropDoctor';
import { Notes } from './components/Notes';
import { ExpertSupport } from './components/ExpertSupport';
import { Layout } from './components/Layout';
import { AppView, User, WeatherData } from './types';

// Mock Weather Data Service
const MOCK_WEATHER: WeatherData = {
  temp: 24,
  condition: 'Partly Cloudy',
  humidity: 65,
  windSpeed: 12
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  
  // Persist auth state
  useEffect(() => {
    // Check localStorage (Remember Me) first, then sessionStorage (Session only)
    const savedUser = localStorage.getItem('agroai_user') || sessionStorage.getItem('agroai_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (newUser: User, remember: boolean) => {
    setUser(newUser);
    if (remember) {
      localStorage.setItem('agroai_user', JSON.stringify(newUser));
      // Clear session if it exists to avoid duplicates
      sessionStorage.removeItem('agroai_user');
    } else {
      sessionStorage.setItem('agroai_user', JSON.stringify(newUser));
      // Clear local if it exists to ensure we respect the "uncheck"
      localStorage.removeItem('agroai_user');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('agroai_user');
    sessionStorage.removeItem('agroai_user');
    setView(AppView.DASHBOARD);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (view) {
      case AppView.DASHBOARD:
        return <Dashboard user={user} weather={MOCK_WEATHER} onChangeView={setView} />;
      case AppView.DIAGNOSIS:
        return <CropDoctor />;
      case AppView.NOTES:
        return <Notes />;
      case AppView.EXPERT:
        return <ExpertSupport />;
      default:
        return <Dashboard user={user} weather={MOCK_WEATHER} onChangeView={setView} />;
    }
  };

  return (
    <Layout currentView={view} onNavigate={setView} onLogout={handleLogout}>
      {renderContent()}
    </Layout>
  );
};

export default App;
