import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChartComponent = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
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
        <Line 
          type="monotone" 
          dataKey="Failed" 
          stroke="#FF4560" 
          strokeWidth={2}
          activeDot={{ r: 6 }} 
        />
        <Line 
          type="monotone" 
          dataKey="Blocked" 
          stroke="#FF8042" 
          strokeWidth={2}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="Successful" 
          stroke="#00C49F" 
          strokeWidth={2}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;