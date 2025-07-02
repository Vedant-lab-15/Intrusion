import React, { useState } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  AreaChart, Area,
} from 'recharts';
import { radarChartData as initialRadarData, bubbleChartData as initialBubbleData, areaChartData as initialAreaData } from '../data/mockData';
import * as XLSX from 'xlsx';

const ThreatAnalysis = () => {
  const [radarChartData, setRadarChartData] = useState(initialRadarData);
  const [bubbleChartData, setBubbleChartData] = useState(initialBubbleData);
  const [areaChartData, setAreaChartData] = useState(initialAreaData);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    setError(null);
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Assuming first sheet contains radar data, second bubble, third area
      try {
        const radarSheet = workbook.Sheets[workbook.SheetNames[0]];
        const bubbleSheet = workbook.Sheets[workbook.SheetNames[1]];
        const areaSheet = workbook.Sheets[workbook.SheetNames[2]];

        const radarJson = XLSX.utils.sheet_to_json(radarSheet);
        const bubbleJson = XLSX.utils.sheet_to_json(bubbleSheet);
        const areaJson = XLSX.utils.sheet_to_json(areaSheet);

        // Convert and set data - user may need to adjust keys to match expected format
        setRadarChartData(radarJson);
        setBubbleChartData(bubbleJson);
        setAreaChartData(areaJson);
      } catch (err) {
        setError('Error parsing Excel file. Please ensure it has three sheets with correct data.');
      }
    };
    reader.onerror = () => {
      setError('Failed to read file!');
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Threat Analysis</h2>
      <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="mb-4" />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-200 p-4 rounded-md text-gray-100">
          <h3 className="text-lg font-semibold mb-2">Threat Radar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Threat Level" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-dark-200 p-4 rounded-md text-gray-100">
          <h3 className="text-lg font-semibold mb-2">Attack Correlation</h3>
          <ResponsiveContainer width="100%" height={250}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" name="Attack Type" />
              <YAxis dataKey="count" name="Count" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter data={bubbleChartData} dataKey="value" fill="#82ca9d" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-dark-200 p-4 rounded-md text-gray-100">
          <h3 className="text-lg font-semibold mb-2">Incident Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={areaChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMitigated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorInvestigated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="attacks" stroke="#8884d8" fillOpacity={1} fill="url(#colorAttacks)" />
              <Area type="monotone" dataKey="mitigated" stroke="#82ca9d" fillOpacity={1} fill="url(#colorMitigated)" />
              <Area type="monotone" dataKey="investigated" stroke="#ffc658" fillOpacity={1} fill="url(#colorInvestigated)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ThreatAnalysis;
