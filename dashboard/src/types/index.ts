// ─── Auth ────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'analyst';

export interface UserSession {
  username: string;
  displayName: string;
  role: UserRole;
  expiresAt: number;
}

// ─── Alerts ──────────────────────────────────────────────────────────────────

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'active' | 'resolved';
export type AlertType = 'failed-login' | 'blocked-user' | 'excessive-attempts' | 'sql-injection' | 'xss-attempt';

export interface SecurityAlert {
  id: number;
  severity: AlertSeverity;
  type: AlertType;
  message: string;
  source: string;
  status: AlertStatus;
  time: string;
  timestamp?: Date;
}

// ─── Security Rules ──────────────────────────────────────────────────────────

export type RuleStatus = 'active' | 'inactive';

export interface SecurityRule {
  id: number;
  name: string;
  description: string;
  status: RuleStatus;
  severity: AlertSeverity;
  lastTriggered: string;
  actionType: string;
}

// ─── Charts ──────────────────────────────────────────────────────────────────

export interface LineChartPoint {
  name: string;
  Failed: number;
  Blocked: number;
  Successful: number;
}

export interface AreaChartPoint {
  name: string;
  attacks: number;
  mitigated: number;
  investigated: number;
}

export interface BarChartPoint {
  country: string;
  attacks: number;
}

export interface PieChartPoint {
  name: string;
  value: number;
}

export interface RadarChartPoint {
  subject: string;
  A: number;
  fullMark: number;
}

export interface BubbleChartPoint {
  name: string;
  value: number;
  count: number;
}

export interface GeoAttackPoint {
  country: string;
  lat: number;
  lng: number;
  attacks: number;
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export interface StatsCardData {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: {
    path: string;
    bgColor: string;
  };
}

export interface AuthMetrics {
  failedLogins: number;
  successfulLogins: number;
  blockedAttempts: number;
  averageLoginTime: string;
  mfaUsage: number;
}

export interface ResourceUsage {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

// ─── Audit Log ───────────────────────────────────────────────────────────────

export type AuditAction =
  | 'login'
  | 'logout'
  | 'settings_change'
  | 'data_add'
  | 'data_delete'
  | 'data_reset'
  | 'file_import'
  | 'rule_toggle';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: AuditAction;
  detail: string;
  ipAddress: string;
}

// ─── Settings ────────────────────────────────────────────────────────────────

export interface AppSettings {
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  alertThreshold: AlertSeverity;
  autoBlockEnabled: boolean;
  auditLogging: boolean;
  notificationsEnabled: boolean;
  alertInterval: number;
}
