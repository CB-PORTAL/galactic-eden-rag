// src/lib/compliance/index.ts

export interface ComplianceCheck {
    userCountry: string;
    isKYCVerified: boolean;
    hasPurchaseLimit: boolean;
    purchaseLimit: number;
  }
  
  export const RESTRICTED_COUNTRIES = [
    'US', // United States - due to SEC regulations
    // Add other restricted countries as needed
  ];
  
  export const checkCompliance = async (walletAddress: string): Promise<ComplianceCheck> => {
    return {
      userCountry: 'GB', // Example: Great Britain (not in RESTRICTED_COUNTRIES)
      isKYCVerified: true, // Simulate a KYC-verified user
      hasPurchaseLimit: true,
      purchaseLimit: 10000, // Example limit in SOL
    };
  };
  
  export const COMPLIANCE_REQUIREMENTS = {
    requireKYC: true,
    requireGeographicRestrictions: true,
    requirePurchaseLimits: true,
    requireVesting: true,
  };  