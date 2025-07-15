'use client';

import './globals.css';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideLayout = pathname === '/login' || pathname === '/signup';
  const isHome = pathname === '/';

  return (
    <html lang='ko'>
      <body className={clsx('min-h-screen flex flex-col', isHome && 'bg-gradient-main')}>
        {!hideLayout && <Header />}
        <main className='flex-1'>{children}</main>
        {!hideLayout && <Footer />}
      </body>
    </html>
  );
}
