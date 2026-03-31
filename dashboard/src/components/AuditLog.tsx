import { useState, useMemo } from 'react'
import { useAppStore } from '@/store/useAppStore'
import type { AuditAction } from '@/types'

const ACTION_LABELS: Record<AuditAction, string> = {
  login: 'Login',
  logout: 'Logout',
  settings_change: 'Settings Changed',
  data_add: 'Data Added',
  data_delete: 'Data Deleted',
  data_reset: 'Data Reset',
  file_import: 'File Imported',
  rule_toggle: 'Rule Toggled',
}

const ACTION_COLORS: Record<AuditAction, string> = {
  login: 'text-green-400',
  logout: 'text-gray-400',
  settings_change: 'text-yellow-400',
  data_add: 'text-blue-400',
  data_delete: 'text-red-400',
  data_reset: 'text-orange-400',
  file_import: 'text-purple-400',
  rule_toggle: 'text-cyan-400',
}

export default function AuditLog() {
  const { auditLog, clearAuditLog } = useAppStore()
  const [filterAction, setFilterAction] = useState<AuditAction | 'all'>('all')
  const [filterUser, setFilterUser] = useState('')
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 20

  const filtered = useMemo(() => {
    return auditLog.filter((entry) => {
      if (filterAction !== 'all' && entry.action !== filterAction) return false
      if (filterUser && !entry.user.toLowerCase().includes(filterUser.toLowerCase())) return false
      return true
    })
  }, [auditLog, filterAction, filterUser])

  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  const handleClear = () => {
    if (window.confirm('Clear all audit log entries? This cannot be undone.')) {
      clearAuditLog()
      setPage(0)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Audit Log</h1>
        <button
          onClick={handleClear}
          className="mt-2 md:mt-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
        >
          Clear Log
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-dark-200 p-4 rounded-lg border border-gray-700">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Filter by Action</label>
          <select
            value={filterAction}
            onChange={(e) => { setFilterAction(e.target.value as AuditAction | 'all'); setPage(0) }}
            className="bg-dark-300 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="all">All Actions</option>
            {Object.entries(ACTION_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Filter by User</label>
          <input
            type="text"
            value={filterUser}
            onChange={(e) => { setFilterUser(e.target.value); setPage(0) }}
            placeholder="Username..."
            className="bg-dark-300 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div className="flex items-end">
          <span className="text-xs text-gray-500">{filtered.length} entries</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-dark-200 rounded-lg border border-gray-700 overflow-hidden">
        {paginated.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">No audit entries yet. Actions like login, settings changes, and data modifications will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-dark-100 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Timestamp</th>
                  <th className="px-4 py-3 bg-dark-100 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 bg-dark-100 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                  <th className="px-4 py-3 bg-dark-100 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {paginated.map((entry) => (
                  <tr key={entry.id} className="hover:bg-dark-100">
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-400 font-mono">
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{entry.user}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-sm font-medium ${ACTION_COLORS[entry.action] ?? 'text-gray-400'}`}>
                        {ACTION_LABELS[entry.action] ?? entry.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate">{entry.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 bg-dark-200 border border-gray-700 rounded text-sm text-gray-300 disabled:opacity-40 hover:bg-dark-100"
          >
            Previous
          </button>
          <span className="text-sm text-gray-400">Page {page + 1} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1 bg-dark-200 border border-gray-700 rounded text-sm text-gray-300 disabled:opacity-40 hover:bg-dark-100"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
