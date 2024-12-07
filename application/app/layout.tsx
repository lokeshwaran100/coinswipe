import './globals.css'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { WalletProvider } from '@/components/providers/wallet-provider'
import { TokenProvider } from '@/components/providers/token-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JustSwipe - Crypto Trading Made Simple',
  description: 'Swipe right on your next crypto investment',
  metadataBase: new URL('https://justswipe.example.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <WalletProvider>
            <TokenProvider>
              {children}
            </TokenProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}