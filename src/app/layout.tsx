import type { Metadata, Viewport } from 'next'
import './globals.css'
// ...existing code...

export const metadata: Metadata = {
  title: 'ChecKaro Home Inspection - Inspect Today, Secure Tomorrow',
  description:
    'Professional home inspection services for new homes, post-renovation, and rental properties. Certified professionals with detailed reports and affordable pricing.',
  keywords:
    'home inspection, property inspection, house inspection, rental inspection, renovation inspection',
  openGraph: {
    title: 'ChecKaro Home Inspection - Inspect Today, Secure Tomorrow',
    description: 'Professional home inspection services in Hyderabad. Detect issues early, save money, live stress-free.',
    url: 'https://checkaro.in',
    siteName: 'ChecKaro',
    images: [
      {
        url: '/CheckKaro_Logo.png',
        width: 1200,
        height: 630,
        alt: 'ChecKaro Home Inspection Logo',
        type: 'image/png',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChecKaro Home Inspection',
    description: 'Professional home inspection services in Hyderabad',
    images: ['/CheckKaro_Logo.png'],
  },
  icons: {
    icon: [
      { url: '/CheckKaro_Logo.png', sizes: 'any', type: 'image/png' },
      { url: '/Checkaro Logo.svg', type: 'image/svg+xml' },
      { url: '/CheckKaro_Logo.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/CheckKaro_Logo.png',
    apple: '/CheckKaro_Logo.png',
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
