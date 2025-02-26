import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import { ThemeProvider } from '@/components/theme-provider'
import { NextAuthProvider } from '@/components/NextAuthProvider'
import { GradientBackground } from "@/components/ui/gradient-background"
import { MousePointerBackground } from "@/components/ui/mouse-pointer-background"
import { MainWrapper } from '@/components/MainWrapper'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: 'Korax',
    template: '%s | Korax'
  },
  description: 'Korax platform',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
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
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" />
      </head>
      <body suppressHydrationWarning className={`${inter.className} antialiased h-full bg-black`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
          forcedTheme="dark"
        >
          <MousePointerBackground />
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
