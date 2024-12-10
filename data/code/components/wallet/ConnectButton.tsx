import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

// Interface for Phantom Window
interface PhantomWindow extends Window {
  solana?: {
    isPhantom?: boolean;
    connect: () => Promise<{ publicKey: string }>;
    request: (params: { method: string }) => Promise<void>;
  }
}

export const ConnectButton: React.FC = () => {
  const { connected, connecting } = useWallet();
  const [buttonState, setButtonState] = useState<'initial' | 'connecting' | 'connected'>('initial');
  const [showModal, setShowModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Check if Phantom is installed
  const isPhantomInstalled = () => {
    return typeof window !== 'undefined' && window?.solana?.isPhantom;
  };

  // Handle button click to initiate wallet connection
  const handleClick = () => {
    if (!connected) {
      setButtonState('connecting');
      setShowModal(true);
      setShowOptions(false);
    }
  };

  // Handle Phantom button click
  const handlePhantomClick = () => {
    setShowOptions(!showOptions);
  };

  // Handle Already Installed click
  const handleAlreadyInstalled = async () => {
    const phantomWindow = window as PhantomWindow;
    
    if (phantomWindow.solana?.isPhantom) {
      try {
        // This explicitly tells Phantom to open
        await phantomWindow.solana.request({ method: "connect" });
        setButtonState('connected');
        setShowModal(false);
        setShowOptions(false);
      } catch (error) {
        console.error('Failed to open Phantom:', error);
        setButtonState('initial');
      }
    } else {
      alert('Phantom is not installed. Redirecting to download page...');
      window.open('https://phantom.app/download', '_blank');
      localStorage.setItem('returnToPresale', window.location.href);
    }
  };

  // Handle Install Phantom click
  const handlePhantomAction = async () => {
    if (isPhantomInstalled()) {
      try {
        // Use explicit request method
        const phantomWindow = window as PhantomWindow;
        await phantomWindow.solana?.request({ method: "connect" });
        setButtonState('connected');
        setShowModal(false);
        setShowOptions(false);
      } catch (error) {
        console.error('Connection failed:', error);
        setButtonState('initial');
      }
    } else {
      window.open('https://phantom.app/download', '_blank');
      localStorage.setItem('returnToPresale', window.location.href);
    }
  };

  // Check connection status
  useEffect(() => {
    if (connected) {
      setButtonState('connected');
      setShowModal(false);
    } else if (connecting) {
      setButtonState('connecting');
    }
  }, [connected, connecting]);

  // Check for return from installation
  useEffect(() => {
    const returnUrl = localStorage.getItem('returnToPresale');
    if (returnUrl && isPhantomInstalled()) {
      localStorage.removeItem('returnToPresale');
      handlePhantomAction();
    }
  }, []);

  // Set the button style based on the current button state
  const getButtonStyle = () => {
    switch (buttonState) {
      case 'initial':
        return {
          background: 'linear-gradient(90deg, #1A73E8, #63A4FF)',
          color: '#FFFFFF',
          boxShadow: '0px 0px 25px 10px rgba(26, 115, 232, 0.9)',
          border: '2px solid #63A4FF',
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '1.1rem',
          letterSpacing: '0.1rem',
          transition: 'background 0.5s ease-in-out, box-shadow 0.5s ease-in-out, border 0.5s ease-in-out',
        };
      case 'connecting':
        return {
          background: 'linear-gradient(90deg, #FFCC00, #FFA500)',
          color: '#000000',
          animation: 'pulse 1.5s infinite',
          boxShadow: '0px 0px 25px 10px rgba(255, 165, 0, 0.9)',
          border: '2px solid #FFA500',
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '1.1rem',
          letterSpacing: '0.1rem',
        };
      case 'connected':
        return {
          background: 'linear-gradient(90deg, #00C853, #00E676)',
          color: '#FFFFFF',
          animation: 'glow 2s infinite',
          boxShadow: '0px 0px 25px 10px rgba(0, 200, 83, 0.9)',
          border: '2px solid #00E676',
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '1.1rem',
          letterSpacing: '0.1rem',
          transition: 'background 0.5s ease-in-out, box-shadow 0.5s ease-in-out, border 0.5s ease-in-out',
        };
      default:
        return {};
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        style={getButtonStyle()}
        className={`cyber-button cyber-glow ${buttonState}`}
        disabled={connecting}
      >
        {buttonState === 'connecting' ? 'CONNECTING...' :
         buttonState === 'connected' ? 'CONNECTED' :
         'SELECT WALLET'}
      </button>

      {showModal && !connected && (
        <div className="wallet-adapter-modal-overlay">
          <div className="wallet-adapter-modal-wrapper">
            <div className="bg-[#0a0d1f] border border-blue-500/30 rounded-lg p-6 w-full">
              <div className="flex flex-col space-y-2">
                {/* Phantom Wallet Button */}
                <button
                  onClick={handlePhantomClick}
                  className="w-full p-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg flex items-center transition-colors"
                >
                  <img
                    src="/phantom.svg"
                    alt="Phantom"
                    className="h-8 w-8 mr-4"
                    onError={(e) => {
                      console.error('Image failed to load:', e);
                    }}
                  />
                  <span className="text-xl font-semibold text-white tracking-wide">PHANTOM</span>
                </button>

                {/* Dropdown Install/Connect Options */}
                {showOptions && (
                  <div className="flex flex-col space-y-2 bg-[#0b1122] p-3 rounded-lg border border-blue-500/30 z-50 mt-2">
                    <button
                      onClick={handlePhantomAction}
                      className="w-full p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-md transition-colors text-left"
                    >
                      <span className="text-lg font-semibold text-white tracking-wide">INSTALL PHANTOM</span>
                    </button>

                    <button
                      onClick={handleAlreadyInstalled}
                      className="w-full p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-md transition-colors text-left"
                    >
                      <span className="text-lg font-semibold text-white tracking-wide">ALREADY INSTALLED</span>
                    </button>
                  </div>
                )}

                {/* Solflare Wallet Button */}
                <button
                  disabled
                  className="w-full p-4 bg-gray-800/50 border border-gray-600/30 rounded-lg flex items-center opacity-50 cursor-not-allowed"
                >
                  <img
                    src="/solflare.svg"
                    alt="Solflare"
                    className="h-8 w-8 mr-4"
                    onError={(e) => {
                      console.error('Image failed to load:', e);
                    }}
                  />
                  <span className="text-xl font-medium text-gray-400">SOLFLARE (COMING SOON)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};