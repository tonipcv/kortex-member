import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payments',
  description: 'Manage your payments'
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function PaymentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {children}
    </div>
  )
} 