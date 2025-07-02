import React, { useState, useEffect } from 'react';
import { areaChartData as defaultAreaChartData } from '../data/mockData';

const DataManagement = () => {
  const [areaChartData, setAreaChartData] = useState(defaultAreaChartData);
  const [newDataPoint, setNewDataPoint] = useState({
    name: "",
    attacks: 0,
    mitigated: 0,
    investigated: 0
  });

  // Initialize from localStorage if exists
  useEffect(() => {
    const storedData = localStorage.getItem('areaData');
    if (storedData) {
      setAreaChartData(JSON.parse(storedData));
    }
  }, []);

  // Update global data store and dispatch event when data changes
  useEffect(() => {
    // Create or update global data store
    if (!window.mockDataStore) {
      window.mockDataStore = {};
    }
    window.mockDataStore.areaChartData = areaChartData;
    
    // Save to localStorage as a backup
    localStorage.setItem('areaData', JSON.stringify(areaChartData));
    
    // Dispatch custom event to notify components of data change
    const event = new CustomEvent('mockDataUpdated');
    window.dispatchEvent(event);
  }, [areaChartData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDataPoint({
      ...newDataPoint,
      [name]: name === 'name' ? value : parseInt(value, 10) || 0
    });
  };

  const addDataPoint = () => {
    if (!newDataPoint.name) {
      alert('Please enter a name for the data point');
      return;
    }

    const updatedData = [...areaChartData, { ...newDataPoint }];
    setAreaChartData(updatedData);
    
    // Reset form
    setNewDataPoint({
      name: "",
      attacks: 0,
      mitigated: 0,
      investigated: 0
    });
  };

  const updateDataPoint = (index, field, value) => {
    const newData = [...areaChartData];
    newData[index] = { 
      ...newData[index], 
      [field]: field === 'name' ? value : parseInt(value, 10) || 0 
    };
    setAreaChartData(newData);
  };

  const deleteDataPoint = (index) => {
    const newData = areaChartData.filter((_, i) => i !== index);
    setAreaChartData(newData);
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset to default data?')) {
      setAreaChartData(defaultAreaChartData);
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
        
        {/* Add new data point form */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 bg-dark-100 p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Period</label>
            <input
              type="text"
              name="name"
              value={newDataPoint.name}
              onChange={handleInputChange}
              placeholder="e.g. Jun 2023"
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
              className="w-full bg-dark-300 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={addDataPoint}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-md py-2 px-4"
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
                      onChange={(e) => updateDataPoint(index, 'name', e.target.value)}
                      className="bg-transparent border-b border-gray-700 px-2 py-1 text-white w-full focus:outline-none focus:border-primary-500"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="number"
                      value={dataPoint.attacks}
                      onChange={(e) => updateDataPoint(index, 'attacks', e.target.value)}
                      className="bg-transparent border-b border-gray-700 px-2 py-1 text-white w-full focus:outline-none focus:border-primary-500"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="number"
                      value={dataPoint.mitigated}
                      onChange={(e) => updateDataPoint(index, 'mitigated', e.target.value)}
                      className="bg-transparent border-b border-gray-700 px-2 py-1 text-white w-full focus:outline-none focus:border-primary-500"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="number"
                      value={dataPoint.investigated}
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

        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700 rounded-md">
          <h3 className="text-blue-400 font-medium mb-2">How to use the Data Management panel</h3>
          <ul className="text-gray-300 text-sm list-disc pl-5 space-y-1">
            <li>Add new data points using the form at the top</li>
            <li>Edit existing data points directly in the table</li>
            <li>Delete individual data points with the Delete button</li>
            <li>Reset to default data with the "Reset to Defaults" button</li>
            <li>Changes are applied in real-time to all charts</li>
            <li>Your changes are saved to the browser's storage and will persist between sessions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;