import React from 'react';
import { resourceUsage, statsCardsData } from '../data/mockData';

const SystemHealth = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">System Health</h2>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {statsCardsData.map((card, index) => (
          <div key={index} className="bg-dark-200 p-4 rounded-md text-gray-100 flex items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full mr-4 ${card.icon.bgColor}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={card.icon.path} />
              </svg>
            </div>
            <div>
              <p className="text-sm">{card.title}</p>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className={`text-sm ${card.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {card.change} vs last week
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-dark-200 p-4 rounded-md text-gray-100">
        <h3 className="text-lg font-semibold mb-2">Resource Usage</h3>
        <ul>
          <li>CPU: {resourceUsage.cpu}%</li>
          <li>Memory: {resourceUsage.memory}%</li>
          <li>Disk: {resourceUsage.disk}%</li>
          <li>Network: {resourceUsage.network}%</li>
        </ul>
      </div>
    </div>
  );
};

export default SystemHealth;
