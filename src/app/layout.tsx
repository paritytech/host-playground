import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TrUAPI Playground',
  description: 'Interactive playground for testing the TrUAPI API',
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
