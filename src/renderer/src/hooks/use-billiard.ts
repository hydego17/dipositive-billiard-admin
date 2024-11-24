// src/hooks/use-billiard.ts

import { useState } from "react"
import dayjs from "dayjs"

import {
  TableSession,
  SessionHistory,
  DailyStats,
  TableStatus,
  TransactionStatus,
} from "@/types/billiard"
import { RATE_PER_HOUR, STORAGE_KEYS } from "@/config"

const INITIAL_TABLES: TableSession[] = [
  { id: 1, status: TableStatus.IDLE, startTime: null, endTime: null, duration: 0, cost: 0 },
  { id: 2, status: TableStatus.IDLE, startTime: null, endTime: null, duration: 0, cost: 0 },
  { id: 3, status: TableStatus.IDLE, startTime: null, endTime: null, duration: 0, cost: 0 },
  { id: 4, status: TableStatus.IDLE, startTime: null, endTime: null, duration: 0, cost: 0 },
  { id: 5, status: TableStatus.IDLE, startTime: null, endTime: null, duration: 0, cost: 0 },
  { id: 6, status: TableStatus.IDLE, startTime: null, endTime: null, duration: 0, cost: 0 },
]

export function useBilliard() {
  const [tables, setTables] = useState<TableSession[]>(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEYS.BILLIARD_DATA)
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        return parsedData.tables || INITIAL_TABLES
      }
    } catch (error) {
      console.error("Error loading tables from localStorage:", error)
    }
    return INITIAL_TABLES
  })

  const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEYS.BILLIARD_DATA)
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        return parsedData.sessionHistory || []
      }
    } catch (error) {
      console.error("Error loading session history from localStorage:", error)
    }
    return []
  })

  const calculateDurationAndCost = (startTime: string, endTime: string) => {
    const start = dayjs(startTime)
    const end = dayjs(endTime)

    // Calculate the duration in minutes
    const durationMinutes = end.diff(start, "minute")

    // Convert to hours and round up, with minimum 1 hour
    const durationHours = Math.max(1, Math.ceil(durationMinutes / 60))

    // Calculate cost based on rounded hours
    const cost = durationHours * RATE_PER_HOUR

    return {
      hours: durationHours,
      minutes: durationMinutes,
      cost: cost,
    }
  }

  const startSession = (tableId: number) => {
    const startTime = new Date().toISOString()

    const updatedTables = tables.map((table) => {
      if (table.id === tableId) {
        return {
          ...table,
          status: TableStatus.ACTIVE,
          startTime,
          endTime: null,
          duration: 0,
          cost: RATE_PER_HOUR,
        }
      }
      return table
    })

    setTables(updatedTables)
    saveToLocalStorage(updatedTables, sessionHistory)
  }

  const endSession = (tableId: number) => {
    const endTime = new Date().toISOString()

    const table = tables.find((t) => t.id === tableId)
    if (!table?.startTime) return null

    const { hours, cost } = calculateDurationAndCost(table.startTime, endTime)

    // Create new session
    const newSession: SessionHistory = {
      id: `${Date.now()}-${tableId}`,
      tableId,
      startTime: table.startTime,
      endTime,
      duration: hours,
      cost,
      date: new Date().toISOString().split("T")[0],
      status: TransactionStatus.PENDING,
    }

    // Update session history and tables
    const updatedHistory = [newSession, ...sessionHistory]

    const updatedTables = tables.map((table) => {
      if (table.id === tableId) {
        return {
          ...table,
          status: TableStatus.IDLE,
          startTime: null,
          endTime: null,
          duration: 0,
          cost: 0,
        }
      }
      return table
    })

    // Update state
    setSessionHistory(updatedHistory)
    setTables(updatedTables)

    // Save to localStorage
    saveToLocalStorage(updatedTables, updatedHistory)

    return newSession
  }

  const saveToLocalStorage = (currentTables: TableSession[], currentHistory: SessionHistory[]) => {
    localStorage.setItem(
      STORAGE_KEYS.BILLIARD_DATA,
      JSON.stringify({
        tables: currentTables,
        sessionHistory: currentHistory,
      })
    )
  }

  const getDailyStats = (): DailyStats => {
    const today = new Date().toISOString().split("T")[0]
    const todaySessions = sessionHistory.filter((session) => session.date === today)

    return {
      totalRevenue: todaySessions.reduce((sum, session) => sum + session.cost, 0),
      totalSessions: todaySessions.length,
      activeTableCount: tables.filter((t) => t.status === TableStatus.ACTIVE).length,
    }
  }

  const confirmPayment = (sessionId: string) => {
    const updatedSessionData = sessionHistory
    const updatedIdx = sessionHistory.findIndex((s) => s.id === sessionId)
    if (updatedIdx > -1) {
      updatedSessionData[updatedIdx]["status"] = TransactionStatus.PAID
      setSessionHistory(updatedSessionData)
      saveToLocalStorage(tables, updatedSessionData)
    }
  }

  return {
    tables,
    sessionHistory,
    startSession,
    endSession,
    getDailyStats,
    confirmPayment,
  }
}
