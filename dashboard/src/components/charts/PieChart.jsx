import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#FF4560', '#FF8042', '#FFBB28', '#00C49F', '#0088FE', '#8884d8'];

const PieChartComponent = ({ data }) => {
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="500"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={renderCustomizedLabel}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={1} stroke="#121317" />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value, name) => [`${value}`, `${name}`]}
          contentStyle={{ 
            backgroundColor: '#1a1c23', 
            border: '1px solid #4B5563',
            borderRadius: '4px',
            color: '#E5E7EB' 
          }}
        />
        <Legend 
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{
            paddingTop: '10px',
            color: '#E5E7EB'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;