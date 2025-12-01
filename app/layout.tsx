import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'AdForge - AI TikTok UGC Generator',
  description: 'Create viral TikTok UGC videos with AI. Perfect for creators, brands, and agencies.',
  keywords: ['TikTok', 'UGC', 'AI', 'video generator', 'marketing', 'content creation'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
