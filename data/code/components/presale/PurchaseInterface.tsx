// src/components/presale/PurchaseInterface.tsx
'use client';

import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export const PurchaseInterface: FC = () => {
  const { publicKey } = useWallet();
  const [xynAmount, setXynAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const XYN_PER_SOL = 1_000_000; // 1 SOL = 1M XYN
  const solAmount = parseFloat(xynAmount) / XYN_PER_SOL || 0;

  const handlePurchase = async () => {
    if (!publicKey) return;
    setLoading(true);
    
    try {
      // For testing - we'll replace this with actual contract call
      alert(`Test Purchase:
Amount: ${xynAmount} XYN
Cost: ${solAmount.toFixed(4)} SOL
From wallet: ${publicKey.toString()}
      `);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="purchase" className="cyber-card p-6 max-w-lg mx-auto mt-8">
      <h3 className="text-2xl font-bold mb-6 text-center">Purchase XYN Tokens</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm mb-2">Amount of XYN tokens</label>
          <input
            type="number"
            value={xynAmount}
            onChange={(e) => setXynAmount(e.target.value)}
            min={100000} // Minimum 0.1 SOL worth
            step={100000}
            className="w-full p-3 bg-black/20 border border-blue-500/30 rounded"
            placeholder="Enter XYN amount"
          />
          <p className="text-sm text-gray-400 mt-1">
            Cost: {solAmount.toFixed(4)} SOL
          </p>
        </div>

        <button
          onClick={handlePurchase}
          disabled={loading || !xynAmount}
          className="w-full cyber-button primary py-3"
        >
          {loading ? 'Processing...' : 'Purchase XYN Tokens'}
        </button>
      </div>
    </div>
  );
};