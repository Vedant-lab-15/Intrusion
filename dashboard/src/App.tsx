import React, { lazy, Suspense, useEffect, useCallback } from 'react'
import { useAuth } from './auth/AuthContext'
import { useAppStore } from './store/useAppStore'
import { useRealtimeAlerts } from './hooks/useRealtimeAlerts'
import LoginPage from './auth/LoginPage'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import AlertNotification from './components/AlertNotification'
import type { SecurityAlert } from './types'

// ─── Code-split routes ────────────────────────────────────────────────────────
const Dashboard = lazy(() => import('./components/Dashboard'))
const DataManagement = lazy(() => import('./components/DataManagement'))
const SecurityAlerts = lazy(() => import('./components/SecurityAlerts'))
const SecurityRules = lazy(() => import('./components/SecurityRules'))
const LoginAttempts = lazy(() => import('./components/LoginAttempts'))
const BlockedIPs = lazy(() => import('./components/BlockedIPs'))
const ThreatAnalysis = lazy(() => import('./components/ThreatAnalysis'))
const SystemHealth = lazy(() => import('./components/SystemHealth'))
const Settings = lazy(() => import('./components/Settings'))
const AuditLog = lazy(() => import('./components/AuditLog'))

// ─── Demo alert pool (used when Supabase is not configured) ───────────────────
const ALERT_POOL: Omit<SecurityAlert, 'id' | 'timestamp' | 'time'>[] = [
  { type: 'failed-login', severity: 'high', message: 'Multiple failed login attempts detected', source: '203.0.113.42', status: 'active' },
  { type: 'blocked-user', severity: 'medium', message: 'User account temporarily blocked after threshold exceeded', source: '198.51.100.17', status: 'active' },
  { type: 'excessive-attempts', severity: 'critical', message: 'Brute-force pattern detected — IP auto-blocked', source: '192.0.2.88', status: 'active' },
  { type: 'failed-login', severity: 'low', message: 'Single failed login attempt from known network', source: '10.0.0.55', status: 'active' },
  { type: 'excessive-attempts', severity: 'high', message: 'Credential stuffing attempt detected', source: '203.0.113.99', status: 'active' },
]

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
    </div>
  )
}

function AppShell() {
  const { session, refreshSession } = useAuth()
  const { currentView, setCurrentView, settings, addLiveAlert } = useAppStore()
  const [showAlert, setShowAlert] = React.useState(false)
  const [alertData, setAlertData] = React.useState<SecurityAlert | null>(null)
  const [alertIndex, setAlertIndex] = React.useState(0)

  // Subscribe to Supabase Realtime (no-op when not configured)
  useRealtimeAlerts()

  // Refresh session on user activity
  const handleActivity = useCallback(() => refreshSession(), [refreshSession])
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'] as const
    events.forEach((e) => window.addEventListener(e, handleActivity, { passive: true }))
    return () => events.forEach((e) => window.removeEventListener(e, handleActivity))
  }, [handleActivity])

  // Demo alert cycle (only when notifications are enabled)
  useEffect(() => {
    if (!settings.notificationsEnabled) return
    const interval = setInterval(() => {
      const base = ALERT_POOL[alertIndex % ALERT_POOL.length]
      const alert: SecurityAlert = {
        ...base,
        id: Date.now(),
        timestamp: new Date(),
        time: new Date().toLocaleTimeString(),
      }
      addLiveAlert(alert)
      setAlertData(alert)
      setShowAlert(true)
      setAlertIndex((i) => i + 1)
      setTimeout(() => setShowAlert(false), 5000)
    }, settings.alertInterval * 1000)
    return () => clearInterval(interval)
  }, [alertIndex, settings.notificationsEnabled, settings.alertInterval, addLiveAlert])

  if (!session) return <LoginPage />

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />
      case 'data': return <DataManagement />
      case 'alerts': return <SecurityAlerts />
      case 'rules': return <SecurityRules />
      case 'login-attempts': return <LoginAttempts />
      case 'blocked-ips': return <BlockedIPs />
      case 'threats': return <ThreatAnalysis />
      case 'system': return <SystemHealth />
      case 'settings': return <Settings />
      case 'audit': return <AuditLog />
      default: return <Dashboard />
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-dark-100 text-gray-100">
      <Header onViewChange={setCurrentView} />
      <div className="flex flex-1">
        <Sidebar onViewChange={setCurrentView} activeView={currentView} />
        <main className="flex-1 p-6 overflow-auto">
          <ErrorBoundary key={currentView}>
            <Suspense fallback={<PageLoader />}>
              {renderContent()}
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
      {showAlert && alertData && (
        <AlertNotification alert={alertData} onClose={() => setShowAlert(false)} />
      )}
    </div>
  )
}

export default function App() {
  return <AppShell />
}
