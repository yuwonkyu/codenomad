import { Toaster } from 'sonner';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body>
        {children}
        <Toaster position='top-right' richColors closeButton />
      </body>
    </html>
  );
}
