import React from 'react'
import Sidebar from '../../components/layout/Sidebar'
import Header from '../../components/layout/Header'
import MonitorMode from '../../components/layout/MonitorMode'
import LeaderChangeCelebration from '../../components/layout/LeaderChangeCelebration'
import AutoRefresh from '../../components/layout/AutoRefresh'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen">
        <Header />
        <main className="p-6">{children}</main>
      </div>
      <MonitorMode />
      <LeaderChangeCelebration />
      <AutoRefresh />
    </div>
  )
}
