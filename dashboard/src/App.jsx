import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AlertNotification from './components/AlertNotification';

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

  return (
    <div className="flex flex-col min-h-screen bg-dark-100 text-gray-100">
      <Header />
      <div className="flex flex-1">
        <Sidebar onViewChange={handleViewChange} activeView={currentView} />
        <main className="flex-1 p-6 overflow-auto">
          <Dashboard currentView={currentView} />
        </main>
      </div>
      {showAlert && <AlertNotification alert={alertData} onClose={() => setShowAlert(false)} />}
    </div>
  );
}

export default App;