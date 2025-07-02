import React from 'react';
import { authMetrics, lineChartData } from '../data/mockData';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const LoginAttempts = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Login Attempts</h2>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-200 p-4 rounded-md text-gray-100">
          <h3 className="text-sm font-medium">Failed Logins</h3>
          <p className="text-2xl font-bold">{authMetrics.failedLogins}</p>
        </div>
        <div className="bg-dark-200 p-4 rounded-md text-gray-100">
          <h3 className="text-sm font-medium">Successful Logins</h3>
          <p className="text-2xl font-bold">{authMetrics.successfulLogins}</p>
        </div>
        <div className="bg-dark-200 p-4 rounded-md text-gray-100">
          <h3 className="text-sm font-medium">Blocked Attempts</h3>
          <p className="text-2xl font-bold">{authMetrics.blockedAttempts}</p>
        </div>
        <div className="bg-dark-200 p-4 rounded-md text-gray-100">
          <h3 className="text-sm font-medium">MFA Usage (%)</h3>
          <p className="text-2xl font-bold">{authMetrics.mfaUsage}</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Failed" stroke="#ff4d4f" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="Blocked" stroke="#faad14" />
          <Line type="monotone" dataKey="Successful" stroke="#52c41a" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LoginAttempts;
