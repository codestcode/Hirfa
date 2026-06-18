import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Cairo, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const cairo = Cairo({ variable: '--font-cairo', subsets: ['arabic', 'latin'] })
const plusJakarta = Plus_Jakarta_Sans({ variable: '--font-plus-jakarta', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'حِرفة - Hirfa',
  description: 'حِرفي موثوق لكل بيت - Find trusted craftsmen for your home maintenance needs',
  generator: 'Hirfa',
  icons: {
    icon: [
      {
        url: 'public/hirfa_logo.svg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: 'public/hirfa_logo.svg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/hirfa_logo.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f9ff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1621' },
  ],
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html 
      lang="ar" 
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} ${plusJakarta.variable}`}
    >
      <body className="font-sans antialiased" style={{ backgroundColor: "rgb(0, 4, 25)", color: "rgba(179, 197, 255, 0.8)" }}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
