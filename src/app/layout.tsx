'use client';

import './globals.css';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideLayout = pathname === '/login' || pathname === '/signup';

  return (
    <html lang='ko'>
      <body className='min-h-screen flex flex-col'>
        {!hideLayout && <Header />}
        <main className='flex-1'>{children}</main>
        {!hideLayout && <Footer />}
      </body>
    </html>
  );
}
