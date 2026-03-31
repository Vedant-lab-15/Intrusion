import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '@/store/useAppStore'
import type { SecurityAlert } from '@/types'

// Reset store between tests
function resetStore() {
  useAppStore.setState({
    currentView: 'dashboard',
    liveAlerts: [],
    auditLog: [],
    settings: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      lockoutDuration: 5,
      alertThreshold: 'medium',
      autoBlockEnabled: true,
      auditLogging: true,
      notificationsEnabled: true,
      alertInterval: 15,
    },
  })
}

describe('useAppStore', () => {
  beforeEach(() => {
    resetStore()
    localStorage.clear()
  })

  describe('navigation', () => {
    it('defaults to dashboard view', () => {
      expect(useAppStore.getState().currentView).toBe('dashboard')
    })

    it('updates current view', () => {
      useAppStore.getState().setCurrentView('alerts')
      expect(useAppStore.getState().currentView).toBe('alerts')
    })
  })

  describe('live alerts', () => {
    const mockAlert: SecurityAlert = {
      id: 1,
      severity: 'high',
      type: 'failed-login',
      message: 'Test alert',
      source: '192.0.2.1',
      status: 'active',
      time: '12:00:00',
    }

    it('adds a live alert', () => {
      useAppStore.getState().addLiveAlert(mockAlert)
      expect(useAppStore.getState().liveAlerts).toHaveLength(1)
      expect(useAppStore.getState().liveAlerts[0]).toEqual(mockAlert)
    })

    it('prepends new alerts (most recent first)', () => {
      const alert2 = { ...mockAlert, id: 2, message: 'Second alert' }
      useAppStore.getState().addLiveAlert(mockAlert)
      useAppStore.getState().addLiveAlert(alert2)
      expect(useAppStore.getState().liveAlerts[0].id).toBe(2)
    })

    it('caps live alerts at 100', () => {
      for (let i = 0; i < 110; i++) {
        useAppStore.getState().addLiveAlert({ ...mockAlert, id: i })
      }
      expect(useAppStore.getState().liveAlerts).toHaveLength(100)
    })

    it('clears live alerts', () => {
      useAppStore.getState().addLiveAlert(mockAlert)
      useAppStore.getState().clearLiveAlerts()
      expect(useAppStore.getState().liveAlerts).toHaveLength(0)
    })
  })

  describe('settings', () => {
    it('updates a setting', () => {
      useAppStore.getState().updateSettings({ sessionTimeout: 60 })
      expect(useAppStore.getState().settings.sessionTimeout).toBe(60)
    })

    it('merges partial updates', () => {
      useAppStore.getState().updateSettings({ autoBlockEnabled: false })
      const { settings } = useAppStore.getState()
      expect(settings.autoBlockEnabled).toBe(false)
      expect(settings.auditLogging).toBe(true) // unchanged
    })

    it('resets settings to defaults', () => {
      useAppStore.getState().updateSettings({ sessionTimeout: 999 })
      useAppStore.getState().resetSettings()
      expect(useAppStore.getState().settings.sessionTimeout).toBe(30)
    })
  })

  describe('audit log', () => {
    it('adds an audit entry when logging is enabled', () => {
      useAppStore.getState().addAuditEntry('admin', 'login', 'User logged in')
      expect(useAppStore.getState().auditLog).toHaveLength(1)
      expect(useAppStore.getState().auditLog[0].action).toBe('login')
      expect(useAppStore.getState().auditLog[0].user).toBe('admin')
    })

    it('does not add entry when audit logging is disabled', () => {
      useAppStore.getState().updateSettings({ auditLogging: false })
      useAppStore.getState().addAuditEntry('admin', 'login', 'User logged in')
      expect(useAppStore.getState().auditLog).toHaveLength(0)
    })

    it('prepends entries (most recent first)', () => {
      useAppStore.getState().addAuditEntry('admin', 'login', 'First')
      useAppStore.getState().addAuditEntry('admin', 'logout', 'Second')
      expect(useAppStore.getState().auditLog[0].action).toBe('logout')
    })

    it('clears the audit log', () => {
      useAppStore.getState().addAuditEntry('admin', 'login', 'Test')
      useAppStore.getState().clearAuditLog()
      expect(useAppStore.getState().auditLog).toHaveLength(0)
    })
  })
})
