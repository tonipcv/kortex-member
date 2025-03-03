import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import { ThemeProvider } from '@/components/theme-provider'
import { NextAuthProvider } from '@/components/NextAuthProvider'
import { GradientBackground } from "@/components/ui/gradient-background"
import { MainWrapper } from '@/components/MainWrapper'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Financy AI',
  description: 'Gestão financeira inteligente para suas finanças pessoais',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.svg', type: 'image/svg+xml' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'KORAX',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#000000',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://korax.com',
    title: 'KORAX | Transform Your Influence',
    description: 'Transform your audience into high-value digital assets and recurring revenue streams with our white-label software solutions.',
    siteName: 'KORAX',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KORAX - Transform Your Influence'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KORAX | Transform Your Influence',
    description: 'Transform your audience into high-value digital assets and recurring revenue streams.',
    images: ['/og-image.png'],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="dark h-full">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="text-size-adjust" content="none" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
      </head>
      <body suppressHydrationWarning className={`${inter.className} antialiased h-full bg-blue-950`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
          forcedTheme="dark"
        >
          {/* Simplified Blue Background */}
          <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-blue-900 to-black" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-soft-light" />
          </div>

          <NextAuthProvider>
            <div className="min-h-[100dvh] h-full">
              <Navigation />
              <MainWrapper>
                {children}
              </MainWrapper>
            </div>
          </NextAuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
