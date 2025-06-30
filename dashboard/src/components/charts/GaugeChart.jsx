import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const GaugeChart = ({ value = 75, min = 0, max = 100 }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  // Calculate the percentage of the value within the min-max range
  const percentage = ((value - min) / (max - min)) * 100;
  
  // Colors for different ranges
  const getColor = (percent) => {
    if (percent < 30) return '#FF4560'; // Red for low values
    if (percent < 70) return '#FEB019'; // Yellow for medium values
    return '#00E396'; // Green for high values
  };

  // Animation effect
  useEffect(() => {
    const animationDuration = 1000; // 1 second
    const stepTime = 10; // Update every 10ms
    const steps = animationDuration / stepTime;
    const stepValue = value / steps;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep += 1;
      setAnimatedValue(Math.min(currentStep * stepValue, value));
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [value]);

  // Gauge chart data - We create a full circle and show only half of it
  const data = [
    { name: 'value', value: animatedValue },
    { name: 'empty', value: max - animatedValue }
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#E5E7EB" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="14"
        fontWeight="bold"
      >
        {`${percentage.toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius="55%"
            outerRadius="80%"
            dataKey="value"
            labelLine={false}
            label={renderCustomizedLabel}
            isAnimationActive={false}
          >
            <Cell key="value" fill={getColor(percentage)} strokeWidth={0} />
            <Cell key="empty" fill="#1F2937" strokeWidth={0} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center mt-2">
        <div className="text-2xl font-bold text-white">{animatedValue.toFixed(0)}</div>
        <div className="text-sm text-gray-400">Security Score</div>
      </div>
    </div>
  );
};

export default GaugeChart;