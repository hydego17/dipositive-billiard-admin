// src/renderer/src/components/layout/root-layout.tsx
import { Link, Outlet, useLocation } from "react-router-dom"
import { LayoutDashboard, CircleDollarSign } from "lucide-react"

export function RootLayout() {
  const location = useLocation()

  return (
    <div className='min-h-screen bg-zinc-50'>
      {/* Sidebar */}
      <nav className='fixed left-0 top-0 w-64 h-full bg-gradient-to-b from-zinc-800 to-zinc-900 text-white p-4'>
        <div className='mb-8 px-2'>
          <h1 className='text-xl font-bold'>DiPositive Billiard</h1>
        </div>

        <div className='space-y-1'>
          <Link
            to='/dashboard'
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              location.pathname === "/dashboard"
                ? "bg-zinc-700/50 text-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <LayoutDashboard size={20} />
            <span className='font-medium'>Dashboard</span>
          </Link>
          <Link
            to='/transaction'
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              location.pathname === "/transaction"
                ? "bg-zinc-700/50 text-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <CircleDollarSign size={20} />
            <span className='font-medium'>Transaksi</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className='pl-64'>
        <header className='bg-white border-b h-16 fixed top-0 right-0 left-64 z-10'>
          <div className='h-full flex items-center px-6'>
            <h2 className='text-lg font-medium text-zinc-800'>Billiard Admin</h2>
          </div>
        </header>

        <main className='pt-16 min-h-screen'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
