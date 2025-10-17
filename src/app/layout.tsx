import type { Metadata, Viewport } from 'next'
import './globals.css'
// ...existing code...

export const metadata: Metadata = {
  title: 'ChecKaro Home Inspection - Inspect Today, Secure Tomorrow',
  description:
    'Professional home inspection services for new homes, post-renovation, and rental properties. Certified professionals with detailed reports and affordable pricing.',
  keywords:
    'home inspection, property inspection, house inspection, rental inspection, renovation inspection',
  icons: {
    icon: [
      { url: '/favicon.ico' },        // primary (Google)
      { url: '/favicon-2025.ico' },   // bumped filename to break caches
      // Optional PNG sizes if you add them in /public
      // { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      // { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
  }
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
            // ...existing code...
            // ...existing code...
          </div>
        </body>
      </html>
  )
}
