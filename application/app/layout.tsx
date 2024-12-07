import './globals.css'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { TokenProvider } from '@/components/providers/token-provider'
import { getSession } from 'next-auth/react'
import Providers from '@/components/providers/provider'
import { Toaster } from '@/components/ui/toaster'
import SubProviders from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JustSwipe - Crypto Trading Made Simple",
  description: "Swipe right on your next crypto investment",
  metadataBase: new URL("https://justswipe.example.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session;
  getSession()
    .then((data) => {
      session = data;
    })
    .catch((err) => console.log(err));
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Providers session={session?session:null}>
            <TokenProvider>
              <SubProviders>{children}</SubProviders>
                            <Toaster />
            </TokenProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
