import { useState } from "react"
import { CheckCheckIcon, HandCoinsIcon } from "lucide-react"

import { RATE_PER_HOUR } from "@/config"
import { formatTime, formatToRupiah } from "@/lib/helpers"
import { SessionHistory, TransactionStatus } from "@/types/billiard"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface BillingModalProps {
  open: boolean
  onOpenChange(open: boolean): void
  session: SessionHistory
  onConfirmPayment(sessionId: string): void
}

export function BillingDetailModal({
  open,
  onOpenChange,
  session,
  onConfirmPayment,
}: BillingModalProps) {
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false)

  const confirmSessionPayment = () => {
    onConfirmPayment(session.id)
    setShowPaymentConfirm(false)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='max-w-md' onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className='text-xl font-semibold'>Detail Tagihan</DialogTitle>
            <div className='text-muted-foreground'>ID: {session.id}</div>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='flex justify-between text-sm'>
              <span className='text-zinc-600'>Nomor Meja:</span>
              <span className='font-medium'>{session.tableId}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-zinc-600'>Waktu Mulai:</span>
              <span className='font-medium'>{formatTime(new Date(session.startTime))}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-zinc-600'>Waktu Selesai:</span>
              <span className='font-medium'>{formatTime(new Date(session.endTime))}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-zinc-600'>Durasi:</span>
              <span className='font-medium'>{session.duration} jam</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-zinc-600'>Tarif per Jam:</span>
              <span className='font-medium'>{formatToRupiah(RATE_PER_HOUR)}</span>
            </div>
            <div className='h-px bg-zinc-200 my-4' />
            <div className='flex justify-between text-lg font-semibold'>
              <span>Total:</span>
              <span>{formatToRupiah(session.cost)}</span>
            </div>

            {session.status === TransactionStatus.PENDING ? (
              <div className='pt-4 flex flex-col gap-3'>
                {session.status === TransactionStatus.PENDING && (
                  <Button
                    className='w-full bg-emerald-600 hover:bg-emerald-700'
                    onClick={() => setShowPaymentConfirm(true)}
                  >
                    <HandCoinsIcon className='w-4 h-4' />
                    Konfirmasi Pembayaran
                  </Button>
                )}

                <Button variant='outline' className='w-full' onClick={() => onOpenChange(false)}>
                  Tutup
                </Button>
              </div>
            ) : (
              <div className='pt-4 flex flex-col gap-3'>
                <Button variant='default' className='w-full' onClick={() => onOpenChange(false)}>
                  Tutup
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showPaymentConfirm} onOpenChange={setShowPaymentConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Pembayaran</AlertDialogTitle>
            <AlertDialogDescription className='py-2'>
              Pastikan nominal yang diterima sudah sesuai dengan total billing:{" "}
              {formatToRupiah(session.cost)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className='bg-emerald-600 hover:bg-emerald-700'
              onClick={confirmSessionPayment}
            >
              <CheckCheckIcon className='w-4 h-4' />
              Konfirmasi Pembayaran
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
