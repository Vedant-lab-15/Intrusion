import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { SecurityAlert, AuditLogEntry, AuditAction, AppSettings } from '@/types'

// ─── Audit helpers ────────────────────────────────────────────────────────────

const AUDIT_KEY = 'ids_audit_log'
const MAX_AUDIT_ENTRIES = 500

function loadAuditLog(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(AUDIT_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.slice(0, MAX_AUDIT_ENTRIES) : []
  } catch {
    return []
  }
}

function saveAuditLog(entries: AuditLogEntry[]) {
  try {
    localStorage.setItem(AUDIT_KEY, JSON.stringify(entries.slice(0, MAX_AUDIT_ENTRIES)))
  } catch { /* quota exceeded */ }
}

// ─── Settings helpers ─────────────────────────────────────────────────────────

const SETTINGS_KEY = 'ids_settings'

const DEFAULT_SETTINGS: AppSettings = {
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  lockoutDuration: 5,
  alertThreshold: 'medium',
  autoBlockEnabled: true,
  auditLogging: true,
  notificationsEnabled: true,
  alertInterval: 15,
}

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface AppState {
  // Navigation
  currentView: string
  setCurrentView: (view: string) => void

  // Live alerts (real-time feed)
  liveAlerts: SecurityAlert[]
  addLiveAlert: (alert: SecurityAlert) => void
  clearLiveAlerts: () => void

  // Settings
  settings: AppSettings
  updateSettings: (patch: Partial<AppSettings>) => void
  resetSettings: () => void

  // Audit log
  auditLog: AuditLogEntry[]
  addAuditEntry: (username: string, action: AuditAction, detail: string) => void
  clearAuditLog: () => void
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // ── Navigation ──────────────────────────────────────────────────────────
      currentView: 'dashboard',
      setCurrentView: (view) => set({ currentView: view }, false, 'setCurrentView'),

      // ── Live alerts ─────────────────────────────────────────────────────────
      liveAlerts: [],
      addLiveAlert: (alert) =>
        set(
          (state) => ({ liveAlerts: [alert, ...state.liveAlerts].slice(0, 100) }),
          false,
          'addLiveAlert'
        ),
      clearLiveAlerts: () => set({ liveAlerts: [] }, false, 'clearLiveAlerts'),

      // ── Settings ────────────────────────────────────────────────────────────
      settings: loadSettings(),
      updateSettings: (patch) => {
        const updated = { ...get().settings, ...patch }
        try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated)) } catch { /* noop */ }
        set({ settings: updated }, false, 'updateSettings')
      },
      resetSettings: () => {
        localStorage.removeItem(SETTINGS_KEY)
        set({ settings: DEFAULT_SETTINGS }, false, 'resetSettings')
      },

      // ── Audit log ───────────────────────────────────────────────────────────
      auditLog: loadAuditLog(),
      addAuditEntry: (username, action, detail) => {
        const { settings, auditLog } = get()
        if (!settings.auditLogging) return
        const entry: AuditLogEntry = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          timestamp: new Date().toISOString(),
          user: username,
          action,
          detail,
          ipAddress: '—', // client-side; real IP comes from server
        }
        const updated = [entry, ...auditLog].slice(0, MAX_AUDIT_ENTRIES)
        saveAuditLog(updated)
        set({ auditLog: updated }, false, 'addAuditEntry')
      },
      clearAuditLog: () => {
        localStorage.removeItem(AUDIT_KEY)
        set({ auditLog: [] }, false, 'clearAuditLog')
      },
    }),
    { name: 'IDS-AppStore' }
  )
)
