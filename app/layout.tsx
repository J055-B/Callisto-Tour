import '../styles/globals.css'
import React from 'react'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'
import MonitorMode from '../components/layout/MonitorMode'

export const metadata = {
  title: 'Tour de Callisto'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-page text-primaryText">
        <div className="flex">
          <Sidebar />
          <div className="flex-1 min-h-screen">
            <Header />
            <main className="p-6">{children}</main>
          </div>
        </div>
        <MonitorMode />
      </body>
    </html>
  )
}
