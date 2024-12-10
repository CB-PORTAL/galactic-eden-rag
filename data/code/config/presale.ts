// src/config/presale.ts
export const PRESALE_CONFIG = {
    // Dates for the presale
    START_DATE: new Date('2024-02-01T00:00:00Z'),
    END_DATE: new Date('2024-03-01T00:00:00Z'),
    
    // Purchase limits
    MIN_PURCHASE: 100, // Minimum XYN tokens
    MAX_PURCHASE: 1000000, // Maximum XYN tokens
    PRICE_PER_TOKEN: 0.00001, // in SOL
    
    // Replace these with your actual addresses
    PRESALE_WALLET: 'YOUR_PRESALE_WALLET_ADDRESS',
    TOKEN_MINT_ADDRESS: 'YOUR_XYN_TOKEN_MINT_ADDRESS',
    
    // Presale stages configuration
    STAGES: [
      {
        id: 1,
        price: 0.00001,
        allocation: 250_000_000,
        cap: 1_000_000
      },
      // Add more stages as needed
    ]
  }; 