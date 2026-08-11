import '../styles/globals.css'
import React from 'react'
import MusicPlayer from '../components/layout/MusicPlayer'
import SiteContentProvider from '../components/layout/SiteContentProvider'
import { getSiteContent } from '../lib/site-content'

export const metadata = {
  title: 'Tour de Callisto'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getSiteContent()
  return (
    <html lang="en">
      <body className="min-h-screen bg-page text-primaryText">
        <SiteContentProvider initialContent={content}>
          {children}
          <MusicPlayer />
        </SiteContentProvider>
      </body>
    </html>
  )
}
