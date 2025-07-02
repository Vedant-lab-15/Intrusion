import React from 'react';

const Sidebar = ({ onViewChange, activeView = 'dashboard' }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'alerts', name: 'Security Alerts', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { id: 'rules', name: 'Security Rules', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { id: 'login-attempts', name: 'Login Attempts', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'blocked-ips', name: 'Blocked IPs', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
    { id: 'threats', name: 'Threat Analysis', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'system', name: 'System Health', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'settings', name: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { id: 'data', name: 'Data Management', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
  ];

  return (
    <aside className="bg-dark-200 w-64 border-r border-gray-700 hidden md:block">
      <div className="p-4">
        <div className="flex items-center px-2 py-3 mb-6">
          <div className="font-medium text-gray-300 text-xs uppercase tracking-wider">IDS Security Suite</div>
        </div>
        
        <nav>
          <div className="space-y-1">
            <div className="px-3 pb-2">
              <h3 className="text-xs uppercase font-semibold text-gray-500 tracking-wider">
                Monitoring
              </h3>
            </div>
            
            {menuItems.slice(0, 3).map((item) => (
              <a
                key={item.id}
                href="#"
                className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                  activeView === item.id
                    ? 'bg-primary-700/20 text-primary-500'
                    : 'text-gray-300 hover:bg-dark-100 hover:text-white'
                }`}
                onClick={() => onViewChange(item.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={item.icon}
                  />
                </svg>
                {item.name}
              </a>
            ))}

            <div className="px-3 py-2 mt-6">
              <h3 className="text-xs uppercase font-semibold text-gray-500 tracking-wider">
                Security
              </h3>
            </div>
            
            {menuItems.slice(3, 6).map((item) => (
              <a
                key={item.id}
                href="#"
                className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                  activeView === item.id
                    ? 'bg-primary-700/20 text-primary-500'
                    : 'text-gray-300 hover:bg-dark-100 hover:text-white'
                }`}
                onClick={() => onViewChange(item.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={item.icon}
                  />
                </svg>
                {item.name}
              </a>
            ))}
            
            <div className="px-3 py-2 mt-6">
              <h3 className="text-xs uppercase font-semibold text-gray-500 tracking-wider">
                System
              </h3>
            </div>
            
            {menuItems.slice(6).map((item) => (
              <a
                key={item.id}
                href="#"
                className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                  activeView === item.id
                    ? 'bg-primary-700/20 text-primary-500'
                    : 'text-gray-300 hover:bg-dark-100 hover:text-white'
                }`}
                onClick={() => onViewChange(item.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={item.icon}
                  />
                </svg>
                {item.name}
              </a>
            ))}
          </div>
        </nav>
      </div>
      
      <div className="border-t border-gray-700 p-4 mt-6">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-700 rounded-full flex items-center justify-center text-white font-bold mr-3">
            A
          </div>
          <div>
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">Security Analyst</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;