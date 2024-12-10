'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { SITE_CONFIG } from '@/lib/config/index';
import PresaleInfo from '@/components/presale/PresaleInfo';
import { PresaleContainer } from '@/components/presale';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import { useEffect, useState } from 'react';
import { PresaleInterface } from '@/components/presale/PresaleInterface';

export default function Home() { 
  const { connected } = useWallet();
  const [timeLeft, setTimeLeft] = useState({
    days: 0, 
    hours: 0,
    minutes: 0, 
    seconds: 0
  }); 

  // Countdown timer to create urgency
  useEffect(() => {
    const endDate = new Date('2024-12-31T23:59:59').getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate - now;
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);  
 
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern">
        <div className="cyber-lines" />
      </div>
       
      {/* Header */}
      <header className="w-full fixed top-0 z-50 flex justify-between items-center px-6 py-4 bg-black/50 backdrop-blur-sm border-b border-blue-500/20">
        <div className="flex items-center">
          <div className="relative w-10 h-10">
            <img src="/images/xyn-logo.png" alt="Galactic Eden" className="w-full h-full object-contain" />
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold neon-text">Galactic Eden</h1>
            <p className="text-sm text-blue-400">A Metaverse Nexus</p>
          </div>
        </div>
        <ConnectButton />
      </header>

      {/* Hero Section */}
      <main className="relative z-10 pt-24">
        <section className="text-center px-4 py-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Welcome to the</span>
            <span className="text-blue-500 neon-text block mt-2">XYN Token Presale</span>
          </h2>
          
          {/* Presale Timer */}
          <div className="max-w-4xl mx-auto mb-12">
            <h3 className="text-2xl text-blue-400 mb-4">Presale Ends In:</h3>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(timeLeft).map(([key, value]) => (
                <div key={key} className="cyber-card p-4">
                  <div className="text-3xl font-bold text-white">{value}</div>
                  <div className="text-sm text-blue-400">{key}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex justify-between mb-2">
              <span className="text-blue-400">Progress</span>
              <span className="text-blue-400">25%</span>
            </div>
            <div className="h-4 bg-black/40 rounded-full overflow-hidden border border-blue-500/30">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                style={{ width: '25%' }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span>0 XYN</span>
              <span>1,000,000,000 XYN</span>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 mb-16">
            <div className="cyber-card p-6 hover:-translate-y-1 transition-transform">
              <h3 className="text-xl font-bold text-blue-400 mb-3">Tokenomics</h3>
              <p>Total Supply: 10B XYN</p>
              <p>Presale Rate: 1M XYN per SOL</p>
            </div>
            <div className="cyber-card p-6 hover:-translate-y-1 transition-transform">
              <h3 className="text-xl font-bold text-blue-400 mb-3">Limits</h3>
              <p>Min Purchase: 0.1 SOL</p>
              <p>Max Purchase: 10 SOL</p>
            </div>
            <div className="cyber-card p-6 hover:-translate-y-1 transition-transform">
              <h3 className="text-xl font-bold text-blue-400 mb-3">Distribution</h3>
              <p>Instant Token Delivery</p>
              <p>Fair Launch Protocol</p>
            </div>
          </div>

{/* Purchase Section */}
<div className="max-w-2xl mx-auto mb-12">  {/* Added container with margin */}
  {connected ? (
    <div className="cyber-card p-8">
      <h3 className="text-2xl font-bold mb-6 text-center neon-text">Buy XYN Tokens</h3>
      <div className="space-y-6">  {/* Increased spacing between elements */}
        <div>
          <label className="block mb-2 text-blue-400">Amount of XYN tokens</label>
          <input
            type="number"
            min="100000"
            step="100000"
            className="w-full p-4 bg-black/20 border border-blue-500/30 rounded text-lg"
            placeholder="Enter amount (min 100,000 XYN)"
          />
          <p className="mt-2 text-sm text-gray-400">Minimum purchase: 100,000 XYN</p>
        </div>
        <button className="cyber-button primary w-full py-4 text-lg font-bold">
          Buy XYN Tokens
        </button>
      </div>
    </div>
  ) : (
    <div className="cyber-card p-8">
      <h3 className="text-2xl font-bold mb-4 text-center">Ready to Join?</h3>
      <p className="mb-6 text-gray-300 text-center">
        Connect your wallet to participate in the XYN token presale
      </p>
      <div className="flex justify-center">  {/* Center the button */}
        <ConnectButton />
      </div>
    </div>
  )}
</div>
        </section>

        {/* How to Participate */}
        <section className="py-16 bg-black/30">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How to Participate</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Connect Wallet</h3>
                <p className="text-gray-300">Click 'Select Wallet' and choose your Solana wallet</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Enter Amount</h3>
                <p className="text-gray-300">Choose how many XYN tokens you want to purchase</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Confirm Purchase</h3>
                <p className="text-gray-300">Approve the transaction in your wallet</p>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <div className="container mx-auto px-4 py-16">
          <PresaleInfo />
        </div>
      </main>
    </div>
  );
}