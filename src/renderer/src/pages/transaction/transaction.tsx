// src/pages/transaction/transaction.tsx

import { useBilliard } from "@/hooks/use-billiard"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatTime, formatToRupiah } from "@/lib/helpers"
import { SessionHistory, TransactionStatus } from "@/types/billiard"
import { useState } from "react"
import { BillingDetailModal } from "@/components/billing-detail-modal"
import { CheckCheckIcon } from "lucide-react"

export default function TransactionPage() {
  const [currentSession, setCurrentSession] = useState<SessionHistory | null>(null)

  const { sessionHistory, confirmPayment } = useBilliard()

  // Group sessions by date
  const groupedSessions = sessionHistory.reduce(
    (groups, session) => {
      const date = session.date
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(session)
      return groups
    },
    {} as Record<string, typeof sessionHistory>
  )

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedSessions).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  )

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Riwayat Transaksi</h1>
      </div>

      <div className='space-y-6'>
        {sortedDates.map((date) => {
          const sessions = groupedSessions[date]
          const dailyTotal = sessions.reduce((sum, session) => sum + session.cost, 0)

          return (
            <div key={date} className='bg-white rounded-lg shadow'>
              <div className='p-4 border-b bg-zinc-50'>
                <div className='flex justify-between items-center'>
                  <h2 className='text-lg font-semibold'>
                    {new Date(date).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h2>
                  <div className='text-lg'>
                    Total: <span className='font-bold'>{formatToRupiah(dailyTotal)}</span>
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Meja</TableHead>
                    <TableHead>Mulai</TableHead>
                    <TableHead>Selesai</TableHead>
                    <TableHead>Durasi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id} onClick={() => setCurrentSession(session)}>
                      <TableCell>{session.id}</TableCell>
                      <TableCell>Meja {session.tableId}</TableCell>
                      <TableCell>{formatTime(new Date(session.startTime))}</TableCell>
                      <TableCell>{formatTime(new Date(session.endTime))}</TableCell>
                      <TableCell>{session.duration} jam</TableCell>
                      <TableCell className='py-4'>
                        {session.status === TransactionStatus.PENDING ? (
                          <span className='px-2 py-1 bg-amber-50 text-amber-600 text-xs font-medium rounded-lg border border-amber-200 flex items-center gap-1 w-fit'>
                            <CheckCheckIcon className='w-3 h-3' />
                            Menunggu Pembayaran
                          </span>
                        ) : (
                          <span className='px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-lg border border-emerald-200 flex items-center gap-1 w-fit'>
                            <CheckCheckIcon className='w-3 h-3' />
                            Sudah Bayar
                          </span>
                        )}
                      </TableCell>
                      <TableCell className='text-right font-medium'>
                        {formatToRupiah(session.cost)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )
        })}
      </div>

      {currentSession && (
        <BillingDetailModal
          open={!!currentSession}
          onOpenChange={() => setCurrentSession(null)}
          session={currentSession}
          onConfirmPayment={confirmPayment}
        />
      )}
    </div>
  )
}
