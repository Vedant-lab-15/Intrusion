import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

// Custom rendering for TreeMap to make it more visually appealing
const CustomTreemap = ({ root, depth, x, y, width, height, index, colors, name, value }) => {
  return (
    <g>
      {root.children && root.children.map((node, i) => (
        <rect
          key={`rect-${i}`}
          x={node.x}
          y={node.y}
          width={node.width}
          height={node.height}
          style={{
            fill: node.children ? null : node.color || '#00C49F',
            stroke: '#121317',
            strokeWidth: 2 / (depth + 1e-10),
            strokeOpacity: 1 / (depth + 1e-10),
          }}
        />
      ))}
      
      {/* Add text labels for larger rectangles */}
      {root.children && root.children.map((node, i) => {
        const fontSize = Math.min(14, Math.max(8, node.width / 9));
        if ((node.width > 50 && node.height > 30) || node.width > 100) {
          return (
            <text
              key={`text-${i}`}
              x={node.x + node.width / 2}
              y={node.y + node.height / 2}
              textAnchor="middle"
              fill="#F3F4F6"
              fontSize={fontSize}
              fontWeight="medium"
              style={{ pointerEvents: 'none' }}
            >
              {node.name}
            </text>
          );
        }
        return null;
      })}
    </g>
  );
};

// Custom tooltip for better information display
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, size } = payload[0].payload;
    return (
      <div className="bg-dark-100 p-3 border border-gray-700 shadow-lg rounded-md">
        <p className="font-medium text-white">{name}</p>
        <p className="text-sm text-gray-300">Effectiveness: {size}</p>
      </div>
    );
  }
  return null;
};

const TreeMapChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <Treemap
        data={data}
        dataKey="size"
        ratio={4/3}
        stroke="#121317"
        animationDuration={1000}
        content={<CustomTreemap />}
      >
        <Tooltip content={<CustomTooltip />} />
      </Treemap>
    </ResponsiveContainer>
  );
};

export default TreeMapChart;