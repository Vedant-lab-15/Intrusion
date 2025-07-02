import React from 'react';
import { geoAttackData } from '../data/mockData';

const BlockedIPs = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Blocked IPs</h2>
      <table className="min-w-full bg-dark-200 text-gray-100 rounded-md overflow-hidden">
        <thead className="bg-dark-300">
          <tr>
            <th className="py-2 px-4 text-left">Country</th>
            <th className="py-2 px-4 text-left">Latitude</th>
            <th className="py-2 px-4 text-left">Longitude</th>
            <th className="py-2 px-4 text-left">Attack Count</th>
          </tr>
        </thead>
        <tbody>
          {geoAttackData.map((item, index) => (
            <tr key={index} className="border-b border-gray-700">
              <td className="py-2 px-4">{item.country}</td>
              <td className="py-2 px-4">{item.lat}</td>
              <td className="py-2 px-4">{item.lng}</td>
              <td className="py-2 px-4">{item.attacks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlockedIPs;
