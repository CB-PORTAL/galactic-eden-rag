'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { WalletIntegration } from '@/components/wallet/WalletIntegration';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletIntegration>
          {children}
        </WalletIntegration>
      </body>
    </html>
  );
} 