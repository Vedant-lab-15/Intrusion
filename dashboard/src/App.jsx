import React, { useState, useEffect } from 'react';
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

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState(null);
  
  // Simulate random alerts
  useEffect(() => {
    const alertTypes = ['failed-login', 'blocked-user', 'excessive-attempts'];
    const alertSeverity = ['low', 'medium', 'high', 'critical'];
    
    const alertInterval = setInterval(() => {
      const randomAlert = {
        id: Date.now(),
        type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        severity: alertSeverity[Math.floor(Math.random() * alertSeverity.length)],
        message: `Security alert detected at ${new Date().toLocaleTimeString()}`,
        timestamp: new Date(),
        source: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      };
      
      setAlertData(randomAlert);
      setShowAlert(true);
      
      // Hide alert after 5 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }, 15000); // Generate a new alert every 15 seconds
    
    return () => clearInterval(alertInterval);
  }, []);

  // Handle view changes from sidebar
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  // Render content based on current view
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard currentView={currentView} />;
      case 'data':
        return <DataManagement />;
      case 'alerts':
        return <SecurityAlerts />;
      case 'rules':
        return <SecurityRules />;
      case 'login-attempts':
        return <LoginAttempts />;
      case 'blocked-ips':
        return <BlockedIPs />;
      case 'threats':
        return <ThreatAnalysis />;
      case 'system':
        return <SystemHealth />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard currentView={currentView} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-100 text-gray-100">
      <Header />
      <div className="flex flex-1">
        <Sidebar onViewChange={handleViewChange} activeView={currentView} />
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
      {showAlert && <AlertNotification alert={alertData} onClose={() => setShowAlert(false)} />}
    </div>
  );
}

export default App;