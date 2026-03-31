import React, { useState, useEffect } from 'react';
import { areaChartData as defaultAreaChartData } from '../data/mockData';

// Sanitize a string: strip tags, limit length
function sanitizeText(value, maxLen = 32) {
  return String(value)
    .replace(/[<>"'`]/g, '')
    .trim()
    .slice(0, maxLen);
}

// Clamp numeric input to a safe range
function sanitizeNumber(value, min = 0, max = 99999) {
  const n = parseInt(value, 10);
  if (isNaN(n)) return 0;
  return Math.min(Math.max(n, min), max);
}

// Validate a single data point
function validateDataPoint(dp) {
  const errors = [];
  if (!dp.name) errors.push('Period name is required.');
  if (dp.attacks < 0) errors.push('Attacks must be ≥ 0.');
  if (dp.mitigated < 0) errors.push('Mitigated must be ≥ 0.');
  if (dp.investigated < 0) errors.push('Investigated must be ≥ 0.');
  if (dp.mitigated > dp.attacks) errors.push('Mitigated cannot exceed Attacks.');
  return errors;
}

const STORAGE_KEY = 'ids_area_data';
const MAX_DATA_POINTS = 50;

// Safe localStorage helpers
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    // Re-sanitize on load to guard against tampered storage
    return parsed.slice(0, MAX_DATA_POINTS).map((d) => ({
      name: sanitizeText(d.name ?? ''),
      attacks: sanitizeNumber(d.attacks),
      mitigated: sanitizeNumber(d.mitigated),
      investigated: sanitizeNumber(d.investigated),
    }));
  } catch {
    return null;
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage quota exceeded or unavailable — fail silently
  }
}

const DataManagement = () => {
  const [areaChartData, setAreaChartData] = useState(() => loadFromStorage() ?? defaultAreaChartData);
  const [newDataPoint, setNewDataPoint] = useState({ name: '', attacks: 0, mitigated: 0, investigated: 0 });
  const [validationErrors, setValidationErrors] = useState([]);

  // Persist to storage and notify other components whenever data changes
  useEffect(() => {
    saveToStorage(areaChartData);
    window.dispatchEvent(new CustomEvent('mockDataUpdated'));
  }, [areaChartData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDataPoint((prev) => ({
      ...prev,
      [name]: name === 'name' ? sanitizeText(value) : sanitizeNumber(value),
    }));
  };

  const addDataPoint = () => {
    if (areaChartData.length >= MAX_DATA_POINTS) {
      setValidationErrors([`Maximum of ${MAX_DATA_POINTS} data points allowed.`]);
      return;
    }
    const errors = validateDataPoint(newDataPoint);
    if (errors.length) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);
    setAreaChartData((prev) => [...prev, { ...newDataPoint }]);
    setNewDataPoint({ name: '', attacks: 0, mitigated: 0, investigated: 0 });
  };

  const updateDataPoint = (index, field, value) => {
    setAreaChartData((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field === 'name' ? sanitizeText(value) : sanitizeNumber(value),
      };
      return updated;
    });
  };

  const deleteDataPoint = (index) => {
    setAreaChartData((prev) => prev.filter((_, i) => i !== index));
  };

  const resetToDefaults = () => {
    if (window.confirm('Reset all data to defaults? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      setAreaChartData(defaultAreaChartData);
      setValidationErrors([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Data Management</h1>
        <button
          onClick={resetToDefaults}
          className="mt-2 md:mt-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
        >
          Reset to Defaults
        </button>
      </div>

      <div className="bg-dark-200 p-6 rounded-lg shadow-card-dark border border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4">Security Incident Trends Data</h2>

        {/* Validation errors */}
        {validationErrors.length > 0 && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-md" role="alert">
            {validationErrors.map((err, i) => (
              <p key={i} className="text-red-400 text-sm">{err}</p>
            ))}
          </div>
        )}

        {/* Add new data point form */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 bg-dark-100 p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Period</label>
            <input
              type="text"
              name="name"
              value={newDataPoint.name}
              onChange={handleInputChange}
              placeholder="e.g. Jul 2024"
              maxLength={32}
              className="w-full bg-dark-300 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Attacks</label>
            <input
              type="number"
              name="attacks"
              value={newDataPoint.attacks}
              onChange={handleInputChange}
              min={0}
              max={99999}
              className="w-full bg-dark-300 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Mitigated</label>
            <input
              type="number"
              name="mitigated"
              value={newDataPoint.mitigated}
              onChange={handleInputChange}
              min={0}
              max={99999}
              className="w-full bg-dark-300 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Investigated</label>
            <input
              type="number"
              name="investigated"
              value={newDataPoint.investigated}
              onChange={handleInputChange}
              min={0}
              max={99999}
              className="w-full bg-dark-300 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={addDataPoint}
              disabled={areaChartData.length >= MAX_DATA_POINTS}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md py-2 px-4"
            >
              Add Data Point
            </button>
          </div>
        </div>

        {/* Current data table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-dark-100 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Period</th>
                <th className="px-4 py-3 bg-dark-100 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Attacks</th>
                <th className="px-4 py-3 bg-dark-100 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Mitigated</th>
                <th className="px-4 py-3 bg-dark-100 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Investigated</th>
                <th className="px-4 py-3 bg-dark-100 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-dark-200 divide-y divide-gray-700">
              {areaChartData.map((dataPoint, index) => (
                <tr key={index} className="hover:bg-dark-100">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="text"
                      value={dataPoint.name}
                      maxLength={32}
                      onChange={(e) => updateDataPoint(index, 'name', e.target.value)}
                      className="bg-transparent border-b border-gray-700 px-2 py-1 text-white w-full focus:outline-none focus:border-primary-500"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="number"
                      value={dataPoint.attacks}
                      min={0}
                      max={99999}
                      onChange={(e) => updateDataPoint(index, 'attacks', e.target.value)}
                      className="bg-transparent border-b border-gray-700 px-2 py-1 text-white w-full focus:outline-none focus:border-primary-500"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="number"
                      value={dataPoint.mitigated}
                      min={0}
                      max={99999}
                      onChange={(e) => updateDataPoint(index, 'mitigated', e.target.value)}
                      className="bg-transparent border-b border-gray-700 px-2 py-1 text-white w-full focus:outline-none focus:border-primary-500"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="number"
                      value={dataPoint.investigated}
                      min={0}
                      max={99999}
                      onChange={(e) => updateDataPoint(index, 'investigated', e.target.value)}
                      className="bg-transparent border-b border-gray-700 px-2 py-1 text-white w-full focus:outline-none focus:border-primary-500"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <button
                      onClick={() => deleteDataPoint(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          {areaChartData.length}/{MAX_DATA_POINTS} data points. Changes persist in browser storage and update all charts in real-time.
        </p>
      </div>
    </div>
  );
};

export default DataManagement;
