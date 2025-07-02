import React from 'react';
import AreaChartComponent from './charts/AreaChart';
import BarChartComponent from './charts/BarChart';
import PieChartComponent from './charts/PieChart';
import LineChartComponent from './charts/LineChart';
import RadarChartComponent from './charts/RadarChart';
import GaugeChart from './charts/GaugeChart';
import BubbleChart from './charts/BubbleChart';
import TreeMapChart from './charts/TreeMap';
import StatsCard from './StatsCard';
import { 
  statsCardsData, 
  lineChartData, 
  pieChartData, 
  barChartData, 
  radarChartData,
  gaugeChartData, 
  recentAlertsData, 
  bubbleChartData, 
  treeMapData 
} from '../data/mockData';

const Dashboard = ({ currentView = 'dashboard', alerts = [] }) => {
  // Combine mock alerts with any real-time alerts passed in
  const allAlerts = [...alerts, ...recentAlertsData].slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Security Overview</h1>
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
          </span>
          <span className="text-sm text-gray-300">Live Monitoring Active</span>
          <span className="text-xs text-gray-500 ml-2">Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCardsData.map((stat, index) => (
          <StatsCard 
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
          />
        ))}
      </div>
      
      {/* Recent Alerts */}
      <div className="bg-dark-200 p-6 rounded-lg shadow-card-dark border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Security Alerts</h2>
          <a href="#" className="text-primary-500 hover:text-primary-400 text-sm">View All</a>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-dark-100 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Severity</th>
                <th className="px-4 py-3 bg-dark-100 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Alert</th>
                <th className="px-4 py-3 bg-dark-100 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Source</th>
                <th className="px-4 py-3 bg-dark-100 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 bg-dark-100 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-dark-200 divide-y divide-gray-700">
              {allAlerts.map((alert, idx) => (
                <tr key={alert.id || idx} className="hover:bg-dark-100">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      alert.severity === 'critical' ? 'bg-alert-high/20 text-alert-high' : 
                      alert.severity === 'high' ? 'bg-alert-high/10 text-alert-high' : 
                      alert.severity === 'medium' ? 'bg-alert-medium/20 text-alert-medium' : 
                      'bg-alert-low/20 text-alert-low'
                    }`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{alert.message}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{alert.source}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{alert.time}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      alert.status === 'active' ? 'bg-blue-100/10 text-blue-400' : 'bg-gray-100/10 text-gray-400'
                    }`}>
                      {alert.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Charts - First Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-200 p-6 rounded-lg shadow-card-dark border border-gray-700">
          <h2 className="text-lg font-medium text-white mb-4">Network Traffic</h2>
          <div className="h-80">
            <LineChartComponent data={lineChartData} />
          </div>
        </div>
        <div className="bg-dark-200 p-6 rounded-lg shadow-card-dark border border-gray-700">
          <h2 className="text-lg font-medium text-white mb-4">Top Attack Sources</h2>
          <div className="h-80">
            <BarChartComponent data={barChartData} />
          </div>
        </div>
      </div>
      
      {/* Charts - Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-dark-200 p-6 rounded-lg shadow-card-dark border border-gray-700">
          <h2 className="text-lg font-medium text-white mb-4">Alert Distribution</h2>
          <div className="h-64">
            <PieChartComponent data={pieChartData} />
          </div>
        </div>
        <div className="bg-dark-200 p-6 rounded-lg shadow-card-dark border border-gray-700">
          <h2 className="text-lg font-medium text-white mb-4">Threat Categories</h2>
          <div className="h-64">
            <RadarChartComponent data={radarChartData} />
          </div>
        </div>
        <div className="bg-dark-200 p-6 rounded-lg shadow-card-dark border border-gray-700">
          <h2 className="text-lg font-medium text-white mb-4">Authentication Score</h2>
          <div className="h-64">
            <GaugeChart value={gaugeChartData[0].value} min={0} max={100} title="Security Score" />
          </div>
        </div>
      </div>
      
      {/* Charts - Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-200 p-6 rounded-lg shadow-card-dark border border-gray-700">
          <h2 className="text-lg font-medium text-white mb-4">Security Incident Trends</h2>
          <div className="h-80">
            <AreaChartComponent />
          </div>
        </div>
        <div className="bg-dark-200 p-6 rounded-lg shadow-card-dark border border-gray-700">
          <h2 className="text-lg font-medium text-white mb-4">Rule Effectiveness</h2>
          <div className="h-80">
            <TreeMapChart data={treeMapData} />
          </div>
        </div>
      </div>
      
      {/* Fourth Row */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-dark-200 p-6 rounded-lg shadow-card-dark border border-gray-700">
          <h2 className="text-lg font-medium text-white mb-4">Attack Correlation</h2>
          <div className="h-80">
            <BubbleChart data={bubbleChartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;