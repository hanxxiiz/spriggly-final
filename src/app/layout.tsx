import { Inter } from 'next/font/google';
import SessionProvider from '@/components/SessionProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Spriggly',
  description: 'From goals to growth—one Sprig at a time.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
