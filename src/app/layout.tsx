import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        />
        <link rel='icon' href='/favicon.ico' />
        <title>WAZY | 체험 예약 플랫폼</title>
      </head>
      <body className='pt-40 md:pt-80'>{children}</body>
    </html>
  );
}
