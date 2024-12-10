// src/components/presale/index.tsx
'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PresaleInterface } from './PresaleInterface';
import DisclaimerModal from './DisclaimerModal';
import { checkCompliance, ComplianceCheck, RESTRICTED_COUNTRIES } from '@/lib/compliance';
import { useWalletConnection } from '@/hooks/useWalletConnection';

// Add the WalletButton component here
const WalletButton = () => {
  const { connected, connecting, connect, disconnect, error } = useWalletConnection();

  return (
    <div className="relative">
      <button
        onClick={connected ? disconnect : connect}
        disabled={connecting}
        className="cyber-button primary"
      >
        {connecting ? (
          <span className="cyber-pulse">Connecting...</span>
        ) : connected ? (
          "Disconnect"
        ) : (
          "Connect Wallet"
        )}
      </button>
      {error && (
        <div className="absolute top-full mt-2 right-0 cyber-card p-2 text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

// Export PresaleContainer as a named export
export const PresaleContainer = () => {
  const { publicKey } = useWallet();
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isCompliant, setIsCompliant] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserCompliance = async () => {
      if (publicKey) {
        setLoading(true);
        try {
          const complianceResult: ComplianceCheck = await checkCompliance(publicKey.toBase58());

          // Determine compliance based on the complianceResult
          const isCompliant =
            complianceResult.isKYCVerified &&
            !RESTRICTED_COUNTRIES.includes(complianceResult.userCountry);

          setIsCompliant(isCompliant);
        } catch (err) {
          console.error('Compliance check failed:', err);
          setIsCompliant(false);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkUserCompliance();
  }, [publicKey]);

  if (!hasAcceptedTerms) {
    return <DisclaimerModal onAccept={() => setHasAcceptedTerms(true)} />;
  }

  return (
    <div className="space-y-8">
      {loading ? (
        <div className="text-center">
          <p className="text-gray-400">Checking compliance...</p>
        </div>
      ) : isCompliant ? (
        <PresaleInterface />
      ) : (
        <div className="cyber-card p-6 text-center">
          <p className="text-red-400">KYC verification required</p>
          <button className="cyber-button primary mt-4">Complete KYC</button>
        </div>
      )}
    </div>
  );
}; 