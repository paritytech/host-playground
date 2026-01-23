import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Polkadot SDK Test',
  description: 'Test application for the Polkadot Product SDK',
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
