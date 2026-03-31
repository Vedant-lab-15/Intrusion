import React, { useState } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  AreaChart, Area,
} from 'recharts';
import { radarChartData as initialRadarData, bubbleChartData as initialBubbleData, areaChartData as initialAreaData } from '../data/mockData';
import * as XLSX from 'xlsx';

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_EXTENSIONS = ['.xlsx', '.xls', '.csv'];
const MAX_ROWS = 500;

function sanitizeSheetData(json) {
  if (!Array.isArray(json)) return [];
  return json.slice(0, MAX_ROWS).map((row) => {
    const clean = {};
    for (const key of Object.keys(row)) {
      const safeKey = String(key).replace(/[<>"'`]/g, '').slice(0, 64);
      const val = row[key];
      clean[safeKey] = typeof val === 'number' ? val : String(val).replace(/[<>"'`]/g, '').slice(0, 128);
    }
    return clean;
  });
}

const ThreatAnalysis = () => {
  const [radarChartData, setRadarChartData] = useState(initialRadarData);
  const [bubbleChartData, setBubbleChartData] = useState(initialBubbleData);
  const [areaChartData, setAreaChartData] = useState(initialAreaData);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(null);

  const handleFileUpload = (e) => {
    setError(null);
    const file = e.target.files[0];
    if (!file) return;

    // Validate file extension
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError(`Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
      e.target.value = '';
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File too large. Maximum size is ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB.`);
      e.target.value = '';
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        // Disable formula execution to prevent formula injection
        const workbook = XLSX.read(data, { type: 'array', cellFormula: false, cellHTML: false });

        if (workbook.SheetNames.length < 3) {
          setError('File must contain at least 3 sheets: Radar, Bubble, Area.');
          return;
        }

        const radarJson = sanitizeSheetData(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]));
        const bubbleJson = sanitizeSheetData(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[1]]));
        const areaJson = sanitizeSheetData(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[2]]));

        if (!radarJson.length || !bubbleJson.length || !areaJson.length) {
          setError('One or more sheets appear to be empty.');
          return;
        }

        setRadarChartData(radarJson);
        setBubbleChartData(bubbleJson);
        setAreaChartData(areaJson);
      } catch {
        setError('Error parsing file. Ensure it has three sheets with correct data.');
      }
    };
    reader.onerror = () => {
      setError('Failed to read file.');
    };
    reader.readAsArrayBuffer(file);
    // Clear input so the same file can be re-uploaded after reset
    e.target.value = '';
  };

  const resetData = () => {
    setRadarChartData(initialRadarData);
    setBubbleChartData(initialBubbleData);
    setAreaChartData(initialAreaData);
    setFileName(null);
    setError(null);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-semibold">Threat Analysis</h2>
        {fileName && (
          <button onClick={resetData} className="mt-2 md:mt-0 text-sm text-gray-400 hover:text-white underline">
            Reset to defaults
          </button>
        )}
      </div>

      {/* File upload with validation */}
      <div className="mb-6 bg-dark-200 p-4 rounded-lg border border-gray-700">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Import threat data (.xlsx, .xls, .csv — max 2 MB, 3 sheets required)
        </label>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
          className="block text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-600 file:text-white hover:file:bg-primary-700 cursor-pointer"
        />
        {fileName && !error && (
          <p className="mt-2 text-xs text-green-400">Loaded: {fileName}</p>
        )}
        {error && (
          <p className="mt-2 text-xs text-red-400" role="alert">{error}</p>
        )}
      </div>

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
