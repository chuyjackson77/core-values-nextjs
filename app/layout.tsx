import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Core Values Discovery Assessment | You Do You',
  description: 'Discover your core values with our comprehensive assessment. Get personalized coaching insights and career guidance based on your unique value system.',
  keywords: ['core values', 'career coaching', 'personal development', 'values assessment', 'career guidance'],
  authors: [{ name: 'You Do You', url: 'https://youdoyou.boo' }],
  openGraph: {
    title: 'Core Values Discovery Assessment',
    description: 'Discover what truly matters to you and align your career with your values',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Core Values Discovery Assessment',
    description: 'Discover what truly matters to you and align your career with your values',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
