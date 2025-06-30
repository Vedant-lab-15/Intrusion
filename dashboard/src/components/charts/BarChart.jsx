import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarChartComponent = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
        <XAxis 
          dataKey="name" 
          stroke="#9CA3AF"
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
        />
        <YAxis 
          stroke="#9CA3AF"
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1a1c23', 
            border: '1px solid #4B5563',
            borderRadius: '4px',
            color: '#E5E7EB' 
          }} 
        />
        <Legend 
          wrapperStyle={{
            paddingTop: '10px',
            color: '#E5E7EB'
          }}
        />
        <Bar dataKey="attacks" name="Attack Count" fill="#FF4560" radius={[4, 4, 0, 0]} />
        <Bar dataKey="blocked" name="Blocked" fill="#00C49F" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;