import React, { useState } from 'react';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="bg-dark-200 shadow-md py-3 px-6 border-b border-gray-700">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-primary-500 mr-3" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
            />
          </svg>
          <div className="text-xl font-bold text-white">IDS Security Dashboard</div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              className="p-2 rounded-full hover:bg-dark-100 relative" 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-gray-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                />
              </svg>
              <span className="absolute -top-1 -right-1 bg-alert-high rounded-full w-5 h-5 text-xs text-white flex items-center justify-center">5</span>
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-dark-200 rounded-md shadow-lg overflow-hidden z-50 border border-gray-700">
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <h3 className="text-sm font-semibold text-white">Security Alerts</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="px-4 py-2 hover:bg-dark-100 border-b border-gray-700">
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-alert-high flex items-center justify-center mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Critical: Multiple login attempts</p>
                          <p className="text-xs text-gray-400">3 minutes ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2 hover:bg-dark-100 border-b border-gray-700">
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-alert-medium flex items-center justify-center mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">New suspicious IP detected</p>
                          <p className="text-xs text-gray-400">12 minutes ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2 hover:bg-dark-100">
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-alert-low flex items-center justify-center mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">System scan complete</p>
                          <p className="text-xs text-gray-400">45 minutes ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2 border-t border-gray-700">
                    <button className="text-xs text-primary-500 hover:text-primary-400 font-medium">View all alerts</button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)} 
              className="flex items-center focus:outline-none"
            >
              <div className="w-9 h-9 bg-primary-700 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-dark-200 rounded-md shadow-lg py-1 z-10 border border-gray-700">
                <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-dark-100">Your Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-dark-100">Settings</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-dark-100">Sign out</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;