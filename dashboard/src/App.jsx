import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth/AuthContext';
import LoginPage from './auth/LoginPage';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DataManagement from './components/DataManagement';
import AlertNotification from './components/AlertNotification';
import SecurityAlerts from './components/SecurityAlerts';
import SecurityRules from './components/SecurityRules';
import LoginAttempts from './components/LoginAttempts';
import BlockedIPs from './components/BlockedIPs';
import ThreatAnalysis from './components/ThreatAnalysis';
import SystemHealth from './components/SystemHealth';
import Settings from './components/Settings';

// Predefined alert pool — no random IP generation
const ALERT_POOL = [
  { type: 'failed-login', severity: 'high', message: 'Multiple failed login attempts detected', source: '203.0.113.42' },
  { type: 'blocked-user', severity: 'medium', message: 'User account temporarily blocked after threshold exceeded', source: '198.51.100.17' },
  { type: 'excessive-attempts', severity: 'critical', message: 'Brute-force pattern detected — IP auto-blocked', source: '192.0.2.88' },
  { type: 'failed-login', severity: 'low', message: 'Single failed login attempt from known network', source: '10.0.0.55' },
  { type: 'excessive-attempts', severity: 'high', message: 'Credential stuffing attempt detected', source: '203.0.113.99' },
];

function AppShell() {
  const { session, refreshSession } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState(null);
  const [alertIndex, setAlertIndex] = useState(0);

  // Refresh session on user activity
  const handleActivity = useCallback(() => {
    refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, handleActivity, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, handleActivity));
  }, [handleActivity]);

  // Cycle through predefined alerts — no random IP generation
  useEffect(() => {
    const alertInterval = setInterval(() => {
      const alert = ALERT_POOL[alertIndex % ALERT_POOL.length];
      setAlertData({ ...alert, id: Date.now(), timestamp: new Date() });
      setShowAlert(true);
      setAlertIndex((i) => i + 1);

      setTimeout(() => setShowAlert(false), 5000);
    }, 15000);

    return () => clearInterval(alertInterval);
  }, [alertIndex]);

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard currentView={currentView} />;
      case 'data': return <DataManagement />;
      case 'alerts': return <SecurityAlerts />;
      case 'rules': return <SecurityRules />;
      case 'login-attempts': return <LoginAttempts />;
      case 'blocked-ips': return <BlockedIPs />;
      case 'threats': return <ThreatAnalysis />;
      case 'system': return <SystemHealth />;
      case 'settings': return <Settings />;
      default: return <Dashboard currentView={currentView} />;
    }
  };

  if (!session) return <LoginPage />;

  return (
    <div className="flex flex-col min-h-screen bg-dark-100 text-gray-100">
      <Header onViewChange={handleViewChange} />
      <div className="flex flex-1">
        <Sidebar onViewChange={handleViewChange} activeView={currentView} />
        <main className="flex-1 p-6 overflow-auto">
          <ErrorBoundary key={currentView}>
            {renderContent()}
          </ErrorBoundary>
        </main>
      </div>
      {showAlert && <AlertNotification alert={alertData} onClose={() => setShowAlert(false)} />}
    </div>
  );
}

function App() {
  return <AppShell />;
}

export default App;
