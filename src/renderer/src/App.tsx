import { Navigate, RouterProvider, createHashRouter } from "react-router-dom"

import { DayJsProvider } from "@/lib/dayjs"
import { RootLayout } from "@/components/layout/root-layout"

import DashboardPage from "@/pages/dashboard/dashboard"
import TransactionPage from "@/pages/transaction/transaction"

const router = createHashRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to='/dashboard' replace />,
      },
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/transaction",
        element: <TransactionPage />,
      },
    ],
  },
])

function App() {
  return (
    <DayJsProvider>
      <RouterProvider router={router} />
    </DayJsProvider>
  )
}

export default App
