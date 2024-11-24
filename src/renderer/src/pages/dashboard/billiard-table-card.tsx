// src/pages/dashboard/billiard-table-card.tsx

import { useState, useEffect } from "react"
import dayjs from "dayjs"
import { CirclePlayIcon, CircleXIcon } from "lucide-react"

import { RATE_PER_HOUR } from "@/config"
import { TableSession, TableStatus } from "@/types/billiard"
import { formatTime, formatToRupiah } from "@/lib/helpers"
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface BilliardTableCardProps {
  table: TableSession
  onStart: (tableId: number) => void
  onEnd: (tableId: number) => void
}

export function BilliardTableCard({ table, onStart, onEnd }: BilliardTableCardProps) {
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [showStartConfirm, setShowStartConfirm] = useState(false)

  const [duration, setDuration] = useState<string>("00:00:00")

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (table.status === TableStatus.ACTIVE && table.startTime) {
      // Initial calculation
      const calculateDuration = () => {
        const startDate = new Date(table.startTime!)
        const now = new Date()
        return dayjs.duration(now.getTime() - startDate.getTime()).format("HH:mm:ss")
      }

      // Initial duration set
      setDuration(calculateDuration())

      // Update duration every second
      intervalId = setInterval(() => {
        setDuration(calculateDuration())
      }, 1000)
    } else {
      setDuration("00:00:00")
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [table.status, table.startTime])

  const handleEndSession = () => {
    setShowEndConfirm(true)
  }

  const confirmEndSession = () => {
    onEnd(table.id)
    setShowEndConfirm(false)
  }

  const handleStartSession = () => {
    setShowStartConfirm(true)
  }

  const confirmStartSession = () => {
    onStart(table.id)
    setShowStartConfirm(false)
  }

  const getCurrentCost = () => {
    if (table.status === TableStatus.IDLE) return "-"

    const [hours] = duration.split(":")
    const currentHours = parseInt(hours) === 0 ? 1 : parseInt(hours)
    return formatToRupiah(currentHours * RATE_PER_HOUR)
  }

  return (
    <>
      <Card className='shadow-sm'>
        <CardHeader className='pb-2'>
          <CardTitle className='flex justify-between items-center'>
            <span className='text-lg'>Meja {table.id}</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                table.status === "tersedia"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              {table.status}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            <div className='grid grid-cols-2 gap-2 text-sm text-zinc-600'>
              <div>
                <p className='font-medium'>Waktu Mulai</p>
                <p>{table.startTime ? formatTime(new Date(table.startTime)) : "-"}</p>
              </div>
              <div>
                <p className='font-medium'>Durasi</p>
                <p>{duration}</p>
              </div>
            </div>
            <div>
              <p className='font-medium text-sm text-zinc-600'>Biaya</p>
              <p className='text-lg font-semibold'>{getCurrentCost()}</p>
            </div>
            {table.status === "tersedia" ? (
              <Button
                className='w-full bg-emerald-500 hover:bg-emerald-600'
                onClick={handleStartSession}
              >
                Mulai Sesi
              </Button>
            ) : (
              <Button className='w-full bg-rose-500 hover:bg-rose-600' onClick={handleEndSession}>
                Akhiri Sesi
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showEndConfirm} onOpenChange={setShowEndConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi</AlertDialogTitle>
            <AlertDialogDescription className='py-2'>
              <p>Akhiri sesi untuk Meja {table.id}?</p>
              <p className='mt-1'>Durasi saat ini: {duration}</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className='bg-rose-600 hover:bg-rose-700'
              onClick={confirmEndSession}
            >
              <CircleXIcon className='w-4 h-4' />
              Akhiri Sesi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showStartConfirm} onOpenChange={setShowStartConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi</AlertDialogTitle>
            <AlertDialogDescription className='py-2'>
              <p>Mulai sesi untuk Meja {table.id}?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className='bg-emerald-600 hover:bg-emerald-700'
              onClick={confirmStartSession}
            >
              <CirclePlayIcon className='w-4 h-4' />
              Mulai Sesi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
