import React from 'react';
import { recentAlertsData } from '../data/mockData';

const severityColors = {
  critical: 'bg-red-700',
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

const SecurityAlerts = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Security Alerts</h2>
      <table className="min-w-full bg-dark-200 text-gray-100 rounded-md overflow-hidden">
        <thead className="bg-dark-300">
          <tr>
            <th className="py-2 px-4 text-left">Severity</th>
            <th className="py-2 px-4 text-left">Alert</th>
            <th className="py-2 px-4 text-left">Source</th>
            <th className="py-2 px-4 text-left">Time</th>
          </tr>
        </thead>
        <tbody>
          {recentAlertsData.map((alert) => (
            <tr key={alert.id} className="border-b border-gray-700">
              <td className="py-2 px-4">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${severityColors[alert.severity] || 'bg-gray-500'}`}
                  title={alert.severity}
                ></span>
              </td>
              <td className="py-2 px-4">{alert.message}</td>
              <td className="py-2 px-4">{alert.source}</td>
              <td className="py-2 px-4">{alert.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SecurityAlerts;
