import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#FF4560', '#00E396', '#FEB019', '#008FFB', '#775DD0', '#F86624', '#00D4BD'];

const BubbleChart = ({ data }) => {
  // Custom tooltip to display detailed bubble information
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value, count } = payload[0].payload;
      return (
        <div className="bg-dark-100 p-3 border border-gray-700 shadow-lg rounded-md">
          <p className="font-medium text-white">{name}</p>
          <p className="text-sm text-gray-300">Severity: {value}</p>
          <p className="text-sm text-gray-300">Occurrences: {count}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 40,
          left: 25,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} stroke="#374151" />
        <XAxis 
          type="category" 
          dataKey="name" 
          name="Attack Type" 
          tick={{ fill: '#9CA3AF', fontSize: 11 }}
          stroke="#4B5563"
          tickLine={{ stroke: '#4B5563' }}
          axisLine={{ stroke: '#4B5563' }}
        />
        <YAxis 
          type="number" 
          dataKey="value" 
          name="Severity Score" 
          domain={[0, 400]}
          tick={{ fill: '#9CA3AF', fontSize: 11 }}
          stroke="#4B5563"
          tickLine={{ stroke: '#4B5563' }}
          axisLine={{ stroke: '#4B5563' }}
          label={{ 
            value: 'Severity', 
            angle: -90, 
            position: 'insideLeft',
            offset: -5,
            style: { fill: '#9CA3AF', fontSize: 12 } 
          }}
        />
        <ZAxis 
          type="number" 
          dataKey="count" 
          range={[60, 400]} 
          name="Occurrences" 
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }} />
        <Legend 
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          iconSize={10}
          formatter={(value) => (
            <span style={{ color: '#E5E7EB', fontSize: '12px' }}>{value}</span>
          )}
        />
        {data.map((entry, index) => (
          <Scatter 
            key={index} 
            name={entry.name} 
            data={[entry]} 
            fill={COLORS[index % COLORS.length]}
            shape="circle"
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default BubbleChart;