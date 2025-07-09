import type { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'GlobalNomad',
  description: '코드노마드 팀프로젝트',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body className='min-h-screen flex flex-col'>
        <main className='flex-1'>{children}</main>
      </body>
    </html>
  );
}
