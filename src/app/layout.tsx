import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Suspense } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Instaleague | Football Tournament Management Platform',
  description:
    'The premier grassroots football platform for team registration, automated fixture scheduling, live points tables, and match statistics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950">
        <StoreProvider>
          <Suspense fallback={<div className="h-16 border-b border-zinc-800 bg-zinc-950" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">
            <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-xs text-zinc-500">Loading...</div>}>
              {children}
            </Suspense>
          </main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
