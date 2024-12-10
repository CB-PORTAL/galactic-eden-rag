// src/lib/config/tokenDistribution.ts

export const TOKEN_DISTRIBUTION = {
    TOTAL_SUPPLY: 10_000_000_000,
    VAULTS: {
      COMMUNITY_ECOSYSTEM: {
        percentage: 17.5,
        amount: 1_750_000_000,
        address: '9Vg6Ft4BpExFbrriebVPGWQoyJkzsaJ6g8fDYxMEf9v4'
      },
      LIQUIDITY_PROVISION: {
        percentage: 40,
        amount: 4_000_000_000,
        address: '8sFbcm4Ecac4pyVe9W7BqcSwF8pAbanJxA1XYsDtBiAf'
      },
      PROJECT_DEVELOPMENT: {
        percentage: 10,
        amount: 1_000_000_000,
        address: 'BBUzv5jXK9uVT27mCwDbcaZPHuVguGxxqXkJab4Zye3t'
      },
      TEAM_ADVISORS: {
        percentage: 10,
        amount: 1_000_000_000,
        address: '6iXGwvWuT3YRa5VenpB5GraD8aevsygtmhgXqjNA64iE'
      },
      MARKETING_PARTNERSHIPS: {
        percentage: 15,
        amount: 1_500_000_000,
        address: '2H19vBYNm8euZuKuSvkc3zo7RTKYw7UsbNV6BdzPvzUx'
      },
      TREASURY_RESERVE: {
        percentage: 5,
        amount: 500_000_000,
        address: '49ikD1PNbGXsoY2iPTDHRuyZrit4HQnPGkoPpFnLvaNG'
      }
    }
  };