import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useCallback } from 'react';

export const useWalletConnection = () => {
  const { connected, connecting, publicKey, connect, disconnect } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConnect = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await connect();
    } catch (err) {
      setError('Failed to connect wallet. Please try again.');
      console.error('Wallet connection error:', err);
    } finally {
      setLoading(false);
    }
  }, [connect]);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
    } catch (err) {
      console.error('Wallet disconnect error:', err);
    }
  }, [disconnect]);

  return {
    connected,
    connecting: connecting || loading,
    publicKey,
    error,
    connect: handleConnect,
    disconnect: handleDisconnect,
    walletAddress: publicKey?.toBase58()
  };
};