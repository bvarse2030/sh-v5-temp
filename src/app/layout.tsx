import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/redux/provider';
import { ToastContainer } from 'react-toastify';
import NextAuthProvider from './auth/components/SessionProvider';
import MainFooter from '@/components/common/footer/MainFooter';
import NavLayoutTemplate from '@/components/global/nav/Template-Nav/NavLayoutTemplate';
import { ThemeProvider } from '@/lib/theme-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '_common_1_Name',
  description: '_common_2_Description',
  manifest: '/manifest.json',
  icons: {
    apple: '/icons/icon-192x192.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <NextAuthProvider>
            <ReduxProvider>
              <NavLayoutTemplate />
              {children}
              <MainFooter />
            </ReduxProvider>
          </NextAuthProvider>
        </ThemeProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
