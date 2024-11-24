// src/types/billiard.ts

export enum TableStatus {
  ACTIVE = "terpakai",
  IDLE = "tersedia",
}

export enum TransactionStatus {
  PAID = "Sudah Bayar",
  PENDING = "Belum Bayar",
}

export interface TableSession {
  id: number
  status: TableStatus
  startTime: string | null // ISO string
  endTime: string | null // ISO string
  duration: number // in seconds
  cost: number
}

export interface SessionHistory {
  id: string
  tableId: number
  startTime: string // ISO string
  endTime: string // ISO string
  duration: number // in seconds
  cost: number
  date: string // YYYY-MM-DD
  status: TransactionStatus
}

export interface DailyStats {
  totalRevenue: number
  totalSessions: number
  activeTableCount: number
}
