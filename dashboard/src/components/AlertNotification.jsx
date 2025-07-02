import React, { useState, useEffect } from 'react';

const AlertNotification = ({ alert, onClose }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    // Auto-hide the alert after 5 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose && onClose();
      }, 300); // Allow time for the fade-out animation
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  if (!alert) return null;
  
  // Determine severity class
  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'critical':
        return 'border-l-4 border-red-500 bg-red-500/10';
      case 'high':
        return 'border-l-4 border-red-500 bg-red-500/10';
      case 'medium':
        return 'border-l-4 border-yellow-500 bg-yellow-500/10';
      case 'low':
        return 'border-l-4 border-blue-500 bg-blue-500/10';
      default:
        return 'border-l-4 border-gray-500 bg-gray-500/10';
    }
  };
  
  // Determine severity icon
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return (
          <div className="flex-shrink-0 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'medium':
        return (
          <div className="flex-shrink-0 text-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };
  
  return (
    <div className={`fixed bottom-6 right-6 max-w-sm w-full shadow-lg rounded-lg transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`flex items-start p-4 ${getSeverityClass(alert.severity)}`}>
        {getSeverityIcon(alert.severity)}
        
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className="text-sm font-medium text-white">
            {alert.type === 'failed-login' ? 'Failed Login Attempt' : 
             alert.type === 'blocked-user' ? 'User Blocked' : 
             alert.type === 'excessive-attempts' ? 'Excessive Login Attempts' : 
             'Security Alert'}
          </p>
          <p className="mt-1 text-sm text-gray-300">
            {alert.message}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Source IP: {alert.source}
          </p>
        </div>
        
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-200 focus:outline-none"
            onClick={() => {
              setVisible(false);
              setTimeout(() => onClose && onClose(), 300);
            }}
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertNotification;