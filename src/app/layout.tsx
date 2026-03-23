import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Host Playground',
  description: 'Interactive playground for testing the Polkadot Product SDK',
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
