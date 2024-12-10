// src/components/wallet/WalletIntegration.tsx
'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo, useCallback } from 'react';

require('@solana/wallet-adapter-react-ui/styles.css');

const detectPhantom = () => {
  if (typeof window !== 'undefined' && 'solana' in window) {
    return true;
  }
  return false;
};

export function WalletIntegration({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const handleWalletNotFound = useCallback(() => {
    const message = `Phantom wallet is not installed. Would you like to install it now?`;
    if (window.confirm(message)) {
      window.open('https://phantom.app/', '_blank');
    }
  }, []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter({
        callback: detectPhantom() ? undefined : handleWalletNotFound
      }),
      new SolflareWalletAdapter()
    ],
    [handleWalletNotFound]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}