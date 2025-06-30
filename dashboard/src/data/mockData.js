// Chart colors
export const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF4560', '#775DD0', '#3F51B5'
];

// Stats cards data
export const statsCardsData = [
  {
    title: 'Total Blocked Attempts',
    value: '1,284',
    change: '+24%',
    trend: 'up',
    icon: {
      path: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      bgColor: 'bg-alert-high',
    }
  },
  {
    title: 'Active Rules',
    value: '72',
    change: '+5',
    trend: 'up',
    icon: {
      path: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
      bgColor: 'bg-primary-500',
    }
  },
  {
    title: 'Suspicious IPs',
    value: '43',
    change: '-12%',
    trend: 'down',
    icon: {
      path: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636',
      bgColor: 'bg-alert-medium',
    }
  },
  {
    title: 'System Health',
    value: '98%',
    change: '+2%',
    trend: 'up',
    icon: {
      path: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      bgColor: 'bg-alert-low',
    }
  },
];

// Traffic data for line chart
export const lineChartData = [
  { name: '00:00', Failed: 65, Blocked: 28, Successful: 240 },
  { name: '04:00', Failed: 59, Blocked: 48, Successful: 198 },
  { name: '08:00', Failed: 80, Blocked: 40, Successful: 221 },
  { name: '12:00', Failed: 81, Blocked: 19, Successful: 374 },
  { name: '16:00', Failed: 56, Blocked: 96, Successful: 290 },
  { name: '20:00', Failed: 55, Blocked: 27, Successful: 223 },
  { name: '24:00', Failed: 40, Blocked: 39, Successful: 201 },
];

// Alert distribution data for pie chart
export const pieChartData = [
  { name: 'Failed Login', value: 350 },
  { name: 'Invalid Credentials', value: 220 },
  { name: 'Brute Force', value: 180 },
  { name: 'SQL Injection', value: 70 },
  { name: 'XSS Attempts', value: 40 },
];

// Attack sources data for bar chart
export const barChartData = [
  { country: 'USA', attacks: 320 },
  { country: 'China', attacks: 450 },
  { country: 'Russia', attacks: 280 },
  { country: 'India', attacks: 220 },
  { country: 'Brazil', attacks: 190 },
  { country: 'Germany', attacks: 150 },
  { country: 'UK', attacks: 130 },
];

// Threat radar data
export const radarChartData = [
  {
    subject: 'Brute Force',
    A: 80,
    fullMark: 100,
  },
  {
    subject: 'Phishing',
    A: 55,
    fullMark: 100,
  },
  {
    subject: 'Malware',
    A: 68,
    fullMark: 100,
  },
  {
    subject: 'SQLi',
    A: 40,
    fullMark: 100,
  },
  {
    subject: 'XSS',
    A: 35,
    fullMark: 100,
  },
  {
    subject: 'DoS',
    A: 60,
    fullMark: 100,
  },
];

// Authentication gauge data
export const gaugeChartData = [
  {
    name: 'Auth Score',
    value: 78,
  }
];

// Recent alerts data
export const recentAlertsData = [
  {
    id: 1,
    severity: 'high',
    message: 'Multiple failed login attempts detected',
    time: '2 minutes ago',
    source: '192.168.1.45',
    status: 'active',
  },
  {
    id: 2,
    severity: 'critical',
    message: 'Possible SQL injection attempt',
    time: '15 minutes ago',
    source: '45.232.121.56',
    status: 'active',
  },
  {
    id: 3,
    severity: 'medium',
    message: 'Unusual authentication pattern detected',
    time: '25 minutes ago',
    source: '10.0.0.32',
    status: 'resolved',
  },
  {
    id: 4,
    severity: 'low',
    message: 'Excessive file access attempts',
    time: '48 minutes ago',
    source: '192.168.1.76',
    status: 'resolved',
  },
  {
    id: 5,
    severity: 'high',
    message: 'Administrative privileges elevation attempt',
    time: '1 hour ago',
    source: '192.168.1.102',
    status: 'active',
  },
];

// Geographic attack data for map visualization
export const geoAttackData = [
  { country: 'United States', lat: 37.0902, lng: -95.7129, attacks: 320 },
  { country: 'China', lat: 35.8617, lng: 104.1954, attacks: 450 },
  { country: 'Russia', lat: 61.5240, lng: 105.3188, attacks: 280 },
  { country: 'India', lat: 20.5937, lng: 78.9629, attacks: 220 },
  { country: 'Brazil', lat: -14.2350, lng: -51.9253, attacks: 190 },
  { country: 'Germany', lat: 51.1657, lng: 10.4515, attacks: 150 },
  { country: 'United Kingdom', lat: 55.3781, lng: -3.4360, attacks: 130 },
];

// Threat detection rules
export const securityRules = [
  {
    id: 1,
    name: 'Failed Login Attempts',
    description: 'Detects multiple failed login attempts from same IP',
    status: 'active',
    severity: 'medium',
    lastTriggered: '2 hours ago',
    actionType: 'Block IP',
  },
  {
    id: 2,
    name: 'SQL Injection Detection',
    description: 'Identifies potential SQL injection patterns',
    status: 'active',
    severity: 'high',
    lastTriggered: 'Never',
    actionType: 'Block & Log',
  },
  {
    id: 3,
    name: 'Administrative Access',
    description: 'Monitors unauthorized admin access attempts',
    status: 'active',
    severity: 'critical',
    lastTriggered: '1 day ago',
    actionType: 'Alert & Block',
  },
  {
    id: 4,
    name: 'Unusual Activity Hours',
    description: 'Detects login activity during unusual hours',
    status: 'inactive',
    severity: 'low',
    lastTriggered: '5 days ago',
    actionType: 'Alert Only',
  },
  {
    id: 5,
    name: 'Network Scan Detection',
    description: 'Identifies port scanning activities',
    status: 'active',
    severity: 'medium',
    lastTriggered: '12 hours ago',
    actionType: 'Alert & Block',
  },
];

// Authentication metrics
export const authMetrics = {
  failedLogins: 284,
  successfulLogins: 1432,
  blockedAttempts: 142,
  averageLoginTime: '2.3s',
  mfaUsage: 62, // percentage
};

// System resource usage
export const resourceUsage = {
  cpu: 24, // percentage
  memory: 37, // percentage
  disk: 51, // percentage
  network: 18, // percentage
};

// Bubble chart data for attack correlation
export const bubbleChartData = [
  { name: 'Failed Login', value: 350, count: 25 },
  { name: 'Brute Force', value: 180, count: 15 },
  { name: 'SQL Injection', value: 70, count: 8 },
  { name: 'XSS Attempts', value: 40, count: 5 },
  { name: 'Admin Access', value: 65, count: 7 },
];

// TreeMap data for rule effectiveness
export const treeMapData = [
  {
    name: 'Login Rules',
    children: [
      { name: 'Failed Attempts', size: 1400 },
      { name: 'IP Restriction', size: 800 },
      { name: 'Time-based', size: 600 },
    ],
  },
  {
    name: 'Access Control',
    children: [
      { name: 'Permission Checks', size: 1200 },
      { name: 'Resource Limits', size: 750 },
      { name: 'API Rate Limits', size: 950 },
    ],
  },
  {
    name: 'Input Validation',
    children: [
      { name: 'SQL Injection', size: 1100 },
      { name: 'XSS Prevention', size: 850 },
      { name: 'Parameter Check', size: 700 },
    ],
  },
];