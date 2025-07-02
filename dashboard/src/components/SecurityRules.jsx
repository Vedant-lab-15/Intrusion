import React from 'react';
import { securityRules } from '../data/mockData';

const statusColors = {
  active: 'bg-green-500',
  inactive: 'bg-gray-500',
};

const severityColors = {
  low: 'bg-green-400',
  medium: 'bg-yellow-400',
  high: 'bg-red-400',
  critical: 'bg-red-700',
};

const SecurityRules = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Security Rules</h2>
      <table className="min-w-full bg-dark-200 text-gray-100 rounded-md overflow-hidden">
        <thead className="bg-dark-300">
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Description</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Severity</th>
            <th className="py-2 px-4 text-left">Last Triggered</th>
            <th className="py-2 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {securityRules.map((rule) => (
            <tr key={rule.id} className="border-b border-gray-700">
              <td className="py-2 px-4">{rule.name}</td>
              <td className="py-2 px-4">{rule.description}</td>
              <td className="py-2 px-4">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${statusColors[rule.status] || 'bg-gray-500'}`}
                  title={rule.status}
                ></span>
              </td>
              <td className="py-2 px-4">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    severityColors[rule.severity] || 'bg-gray-400'
                  }`}
                >
                  {rule.severity}
                </span>
              </td>
              <td className="py-2 px-4">{rule.lastTriggered}</td>
              <td className="py-2 px-4">{rule.actionType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SecurityRules;
