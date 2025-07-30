import { Toaster } from 'sonner';
import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WAZY | 체험 예약 플랫폼',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
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
      <body className='pt-40 md:pt-80'>
        {children}
        <Toaster position='top-right' richColors closeButton />
      </body>
    </html>
  );
}
