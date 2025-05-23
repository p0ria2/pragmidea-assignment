import { TopNavbar } from '@/_components';
import GlobalProviders from '@/_providers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pragma Flights',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <GlobalProviders>
          <TopNavbar />
          {children}
        </GlobalProviders>
        <Toaster richColors />
      </body>
    </html>
  );
}

