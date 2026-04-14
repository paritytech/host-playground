import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Host API Playground',
  description: 'Interactive playground for testing the Host API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
