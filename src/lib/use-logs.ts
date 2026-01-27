'use client'

import { useCallback, useState } from 'react'
import type { LogEntry, LogStatus } from './types'

const MAX_LOGS = 100

export function useLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([])

  const log = useCallback(
    (action: string, status: LogStatus, message: string, details?: string) => {
      const entry: LogEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        timestamp: new Date(),
        action,
        status,
        message,
        details,
      }

      console.log(`[${action}]`, status, message, details || '')

      setLogs((prev) => [entry, ...prev.slice(0, MAX_LOGS - 1)])

      return entry.id
    },
    []
  )

  const updateLog = useCallback(
    (id: string, status: LogStatus, message: string, details?: string) => {
      setLogs((prev) =>
        prev.map((entry) =>
          entry.id === id ? { ...entry, status, message, details } : entry
        )
      )
    },
    []
  )

  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  const exportLogs = useCallback(() => {
    const data = logs.map((entry) => ({
      timestamp: entry.timestamp.toISOString(),
      action: entry.action,
      status: entry.status,
      message: entry.message,
      details: entry.details,
    }))

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sdk-test-logs-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [logs])

  return {
    logs,
    log,
    updateLog,
    clearLogs,
    exportLogs,
  }
}
