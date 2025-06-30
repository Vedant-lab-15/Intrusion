import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';

const RadarChartComponent = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="#4B5563" />
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ fill: '#9CA3AF', fontSize: 10 }}
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 100]} 
          tick={{ fill: '#9CA3AF', fontSize: 10 }}
        />
        <Radar
          name="Threat Level"
          dataKey="A"
          stroke="#FF4560"
          fill="#FF4560"
          fillOpacity={0.4}
        />
        <Legend 
          wrapperStyle={{
            paddingTop: '10px',
            color: '#E5E7EB'
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChartComponent;