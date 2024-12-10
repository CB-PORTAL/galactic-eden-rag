// src/components/presale/PresaleInterface.tsx
'use client';

import { FC, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

const XYN_PER_SOL = 1_000_000; // 1 SOL = 1M XYN

export const PresaleInterface: FC = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [xynAmount, setXynAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  // Get wallet SOL balance
  useEffect(() => {
    const getBalance = async () => {
      if (publicKey) {
        const bal = await connection.getBalance(publicKey);
        setBalance(bal / LAMPORTS_PER_SOL);
      }
    };
    getBalance();
  }, [publicKey, connection]);

  const solCost = parseFloat(xynAmount) / XYN_PER_SOL || 0;

  const handlePurchase = async () => {
    if (!publicKey || !xynAmount) return;
    
    setLoading(true);
    setPurchaseStatus('processing');
    
    try {
      // In real implementation, this would call the smart contract
      // For now, we'll simulate the transaction
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate blockchain delay
      
      // Simulate the transaction details that would come from the smart contract
      const transactionDetails = {
        xynAmount: parseInt(xynAmount),
        solCost,
        wallet: publicKey.toString(),
        estimatedTime: '< 1 minute'
      };

      setPurchaseStatus('success');
      
      // Show success message with transaction details
      alert(`Transaction Submitted Successfully!
      
Purchasing: ${transactionDetails.xynAmount.toLocaleString()} XYN
Cost: ${transactionDetails.solCost} SOL
Wallet: ${transactionDetails.wallet.slice(0, 4)}...${transactionDetails.wallet.slice(-4)}
Estimated completion time: ${transactionDetails.estimatedTime}

Please check your wallet for the tokens.`);

    } catch (error) {
      console.error('Purchase failed:', error);
      setPurchaseStatus('error');
      alert('Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cyber-card p-6 max-w-lg mx-auto mt-8">
      <h3 className="text-2xl font-bold mb-6 text-center">Purchase XYN Tokens</h3>
      
      <div className="space-y-6">
        {/* Balance Display */}
        {balance !== null && (
          <div className="text-sm text-gray-400">
            Wallet Balance: {balance.toFixed(4)} SOL
          </div>
        )}

        {/* Purchase Input */}
        <div>
          <label className="block text-sm mb-2">Amount of XYN tokens</label>
          <input
            type="number"
            value={xynAmount}
            onChange={(e) => setXynAmount(e.target.value)}
            min={100000} // Minimum 0.1 SOL worth
            step={100000}
            className="w-full p-3 bg-black/20 border border-blue-500/30 rounded"
            placeholder="Enter amount (min 100,000 XYN)"
          />
          <div className="flex justify-between mt-1">
            <p className="text-sm text-gray-400">
              Cost: {solCost.toFixed(4)} SOL
            </p>
            {balance !== null && solCost > balance && (
              <p className="text-sm text-red-400">
                Insufficient balance
              </p>
            )}
          </div>
        </div>

        {/* Purchase Button */}
        <button
          onClick={handlePurchase}
          disabled={loading || !publicKey || !xynAmount || (balance !== null && solCost > balance)}
          className={`w-full cyber-button primary py-3 ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? 'Processing...' : 'Purchase XYN Tokens'}
        </button>

        {/* Status Messages */}
        {purchaseStatus === 'processing' && (
          <p className="text-sm text-center text-blue-400">
            Transaction in progress...
          </p>
        )}
        {purchaseStatus === 'success' && (
          <p className="text-sm text-center text-green-400">
            Transaction submitted successfully!
          </p>
        )}
        {purchaseStatus === 'error' && (
          <p className="text-sm text-center text-red-400">
            Transaction failed. Please try again.
          </p>
        )}
      </div>
    </div>
  );
};