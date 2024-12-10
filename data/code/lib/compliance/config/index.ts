// src/lib/config/index.ts

export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
export const RPC_ENDPOINT = 'https://api.devnet.solana.com';

export const SITE_CONFIG = {
  name: 'XYN Token Presale',
  description: 'Official presale for the Galactic Eden XYN Token',
  tokenDetails: {
    name: 'Xyn',
    symbol: 'XYN',
    totalSupply: 10_000_000_000,
    network: 'Solana',
    address: '72nqcXcqFwcgyYfgrDxpwm1NxGkKpQ2YH8ZgeaVLJGxv',
    decimals: 9,
    presalePrice: 0.00001, // in SOL
  },
  presale: {
    current: 1,
    total: 4,
    stages: [
      { 
        id: 1, 
        allocation: 250_000_000, 
        price: 0,
        cap: 1_000_000
      },
      { 
        id: 2, 
        allocation: 250_000_000, 
        price: 0,
        cap: 2_000_000
      },
      { 
        id: 3, 
        allocation: 250_000_000, 
        price: 0,
        cap: 3_000_000
      },
      { 
        id: 4, 
        allocation: 250_000_000, 
        price: 0,
        cap: 3_000_000
      }
    ]
  }
} as const;

export default SITE_CONFIG;