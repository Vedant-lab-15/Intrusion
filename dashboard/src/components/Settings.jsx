import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

const DEFAULT_SETTINGS = {
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  lockoutDuration: 5,
  alertThreshold: 'medium',
  autoBlockEnabled: true,
  auditLogging: true,
  notificationsEnabled: true,
  alertInterval: 15,
};

function loadSettings() {
  try {
    const raw = localStorage.getItem('ids_settings');
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default function Settings() {
  const { session } = useAuth();
  const [settings, setSettings] = useState(loadSettings);
  const [saved, setSaved] = useState(false);

  const isAdmin = session?.role === 'admin';

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    try {
      localStorage.setItem('ids_settings', JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // Storage unavailable
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all settings to defaults?')) {
      localStorage.removeItem('ids_settings');
      setSettings(DEFAULT_SETTINGS);
      setSaved(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        {!isAdmin && (
          <span className="text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-3 py-1 rounded-full">
            Read-only — Admin access required to save changes
          </span>
        )}
      </div>

      {/* Session Security */}
      <section className="bg-dark-200 p-6 rounded-lg border border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4">Session Security</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              min={5}
              max={480}
              value={settings.sessionTimeout}
              onChange={(e) => handleChange('sessionTimeout', Math.min(480, Math.max(5, parseInt(e.target.value) || 30)))}
              disabled={!isAdmin}
              className="w-40 bg-dark-300 border border-gray-600 rounded-md px-3 py-2 text-white disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">Range: 5–480 minutes</p>
          </div>
        </div>
      </section>

      {/* Authentication Policy */}
      <section className="bg-dark-200 p-6 rounded-lg border border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4">Authentication Policy</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Max Login Attempts Before Lockout
            </label>
            <input
              type="number"
              min={3}
              max={20}
              value={settings.maxLoginAttempts}
              onChange={(e) => handleChange('maxLoginAttempts', Math.min(20, Math.max(3, parseInt(e.target.value) || 5)))}
              disabled={!isAdmin}
              className="w-40 bg-dark-300 border border-gray-600 rounded-md px-3 py-2 text-white disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Lockout Duration (minutes)
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={settings.lockoutDuration}
              onChange={(e) => handleChange('lockoutDuration', Math.min(60, Math.max(1, parseInt(e.target.value) || 5)))}
              disabled={!isAdmin}
              className="w-40 bg-dark-300 border border-gray-600 rounded-md px-3 py-2 text-white disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Auto-block Suspicious IPs</p>
              <p className="text-xs text-gray-500">Automatically block IPs exceeding the attempt threshold</p>
            </div>
            <button
              role="switch"
              aria-checked={settings.autoBlockEnabled}
              onClick={() => isAdmin && handleChange('autoBlockEnabled', !settings.autoBlockEnabled)}
              disabled={!isAdmin}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
                settings.autoBlockEnabled ? 'bg-primary-600' : 'bg-gray-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.autoBlockEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </section>

      {/* Alert Configuration */}
      <section className="bg-dark-200 p-6 rounded-lg border border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4">Alert Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Minimum Alert Severity to Display
            </label>
            <select
              value={settings.alertThreshold}
              onChange={(e) => handleChange('alertThreshold', e.target.value)}
              disabled={!isAdmin}
              className="w-48 bg-dark-300 border border-gray-600 rounded-md px-3 py-2 text-white disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="low">Low and above</option>
              <option value="medium">Medium and above</option>
              <option value="high">High and above</option>
              <option value="critical">Critical only</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Real-time Notifications</p>
              <p className="text-xs text-gray-500">Show toast notifications for incoming alerts</p>
            </div>
            <button
              role="switch"
              aria-checked={settings.notificationsEnabled}
              onClick={() => isAdmin && handleChange('notificationsEnabled', !settings.notificationsEnabled)}
              disabled={!isAdmin}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
                settings.notificationsEnabled ? 'bg-primary-600' : 'bg-gray-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </section>

      {/* Audit & Logging */}
      <section className="bg-dark-200 p-6 rounded-lg border border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4">Audit & Logging</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-300">Audit Logging</p>
            <p className="text-xs text-gray-500">Log all user actions and configuration changes</p>
          </div>
          <button
            role="switch"
            aria-checked={settings.auditLogging}
            onClick={() => isAdmin && handleChange('auditLogging', !settings.auditLogging)}
            disabled={!isAdmin}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
              settings.auditLogging ? 'bg-primary-600' : 'bg-gray-600'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.auditLogging ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </section>

      {/* Actions */}
      {isAdmin && (
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            Save Settings
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-dark-200 hover:bg-dark-100 border border-gray-600 text-gray-300 rounded-md text-sm font-medium transition-colors"
          >
            Reset to Defaults
          </button>
          {saved && (
            <span className="text-sm text-green-400">Settings saved.</span>
          )}
        </div>
      )}
    </div>
  );
}
