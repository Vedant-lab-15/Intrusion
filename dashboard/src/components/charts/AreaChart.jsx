import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { areaChartData as defaultAreaChartData } from '../../data/mockData';

const AreaChartComponent = () => {
  const [chartData, setChartData] = useState(defaultAreaChartData);
  
  // Listen for updates to mock data from the Data Management panel
  useEffect(() => {
    // Check if data exists in localStorage first
    const storedAreaData = localStorage.getItem('ids_area_data');
    if (storedAreaData) {
      try { setChartData(JSON.parse(storedAreaData)); } catch { /* ignore */ }
    }
    
    const handleDataUpdate = () => {
      const updatedAreaData = localStorage.getItem('ids_area_data');
      if (updatedAreaData) {
        try { setChartData(JSON.parse(updatedAreaData)); } catch { /* ignore */ }
      }
    };
    
    window.addEventListener('mockDataUpdated', handleDataUpdate);
    return () => window.removeEventListener('mockDataUpdated', handleDataUpdate);
  }, []);

  // Custom tooltip to display security incident details
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-100 p-3 border border-gray-700 shadow-lg rounded-md">
          <p className="font-medium text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} stroke="#374151" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#9CA3AF', fontSize: 11 }}
            stroke="#4B5563"
            tickLine={{ stroke: '#4B5563' }}
            axisLine={{ stroke: '#4B5563' }}
          />
          <YAxis 
            tick={{ fill: '#9CA3AF', fontSize: 11 }}
            stroke="#4B5563"
            tickLine={{ stroke: '#4B5563' }}
            axisLine={{ stroke: '#4B5563' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="attacks" 
            stackId="1"
            stroke="#FF4560" 
            fill="#FF4560" 
            fillOpacity={0.6} 
            name="Security Attacks"
          />
          <Area 
            type="monotone" 
            dataKey="mitigated" 
            stackId="1"
            stroke="#00E396" 
            fill="#00E396" 
            fillOpacity={0.6} 
            name="Mitigated Attacks"
          />
          <Area 
            type="monotone" 
            dataKey="investigated" 
            stackId="1"
            stroke="#775DD0" 
            fill="#775DD0" 
            fillOpacity={0.6} 
            name="Investigated Incidents"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartComponent;