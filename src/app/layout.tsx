import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ChecKaro Home Inspection - Inspect Today, Secure Tomorrow',
  description:
    'Professional home inspection services for new homes, post-renovation, and rental properties. Certified professionals with detailed reports and affordable pricing.',
  keywords:
    'home inspection, property inspection, house inspection, rental inspection, renovation inspection',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Prevent horizontal scroll
    <html lang="en" className="overflow-x-hidden">
      <body className="font-sans">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
