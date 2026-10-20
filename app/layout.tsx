import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = { title: 'Exel Contracts', description: 'A focused CRM for better customer relationships', generator: 'v0.app' }
export const viewport: Viewport = { colorScheme: 'light', themeColor: '#f7f8f6' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="bg-[#f7f8f6]" suppressHydrationWarning><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
