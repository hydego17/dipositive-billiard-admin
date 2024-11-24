// src/pages/dashboard/dashboard.tsx

import { useState } from "react"
import { Clock, DollarSign, Users } from "lucide-react"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { useBilliard } from "@/hooks/use-billiard"
import { SessionHistory } from "@/types/billiard"
import { formatToRupiah } from "@/lib/helpers"

import { BilliardTableCard } from "./billiard-table-card"
import { BillingDetailModal } from "../../components/billing-detail-modal"

export default function Dashboard() {
  const { tables, startSession, endSession, getDailyStats, confirmPayment } = useBilliard()

  const [showBillModal, setShowBillModal] = useState(false)
  const [currentBill, setCurrentBill] = useState<SessionHistory | null>(null)
  const dailyStats = getDailyStats()

  const handleEndSession = (tableId: number) => {
    const session = endSession(tableId)
    if (session) {
      setCurrentBill(session)
      setShowBillModal(true)
    }
  }

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <div className='mb-6'>
        <h1 className='text-2xl font-semibold text-zinc-900 mb-4'>Dashboard</h1>
        <Alert>
          <AlertTitle className='text-base font-semibold'>Statistik Bisnis</AlertTitle>
          <AlertDescription className='flex flex-wrap gap-6 mt-2'>
            <div className='flex items-center gap-2'>
              <Clock className='w-4 h-4 text-zinc-500' />
              <span className='text-sm'>
                Meja Aktif: <span className='font-semibold'>{dailyStats.activeTableCount}</span>
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <DollarSign className='w-4 h-4 text-zinc-500' />
              <span className='text-sm'>
                Pendapatan Hari Ini:{" "}
                <span className='font-semibold'>{formatToRupiah(dailyStats.totalRevenue)}</span>
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Users className='w-4 h-4 text-zinc-500' />
              <span className='text-sm'>
                Total Sesi: <span className='font-semibold'>{dailyStats.totalSessions}</span>
              </span>
            </div>
          </AlertDescription>
        </Alert>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {tables.map((table) => (
          <BilliardTableCard
            key={table.id}
            table={table}
            onStart={startSession}
            onEnd={handleEndSession}
          />
        ))}
      </div>

      {currentBill && (
        <BillingDetailModal
          open={showBillModal}
          onOpenChange={setShowBillModal}
          session={currentBill}
          onConfirmPayment={confirmPayment}
        />
      )}
    </div>
  )
}
