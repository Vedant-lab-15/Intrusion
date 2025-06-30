import React from 'react';

const AlertNotification = ({ alert, onClose }) => {
  // Map severity to colors
  const severityClasses = {
    'low': 'bg-alert-low',
    'medium': 'bg-alert-medium',
    'high': 'bg-alert-high',
    'critical': 'bg-alert-critical',
  };

  // Map alert types to icons
  const alertIcons = {
    'failed-login': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    'blocked-user': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    'excessive-attempts': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    )
  };

  return (
    <div className={`fixed top-20 right-6 p-4 rounded-lg shadow-lg ${severityClasses[alert.severity]} text-white max-w-md animate-fade-in-right z-50`}>
      <div className="flex items-start">
        <div className="mr-3">
          {alertIcons[alert.type]}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold">Security Alert - {alert.severity.toUpperCase()}</h3>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <p className="mt-1">{alert.message}</p>
          <div className="mt-2 text-sm">
            <div>Source IP: {alert.source}</div>
            <div>Time: {alert.timestamp.toLocaleTimeString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertNotification;