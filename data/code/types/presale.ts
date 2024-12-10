// src/types/presale.ts

export interface PresaleStage {
    id: number
    allocation: number
    price: number
    cap: number
  }
  
  export interface TokenDetails {
    name: string
    symbol: string
    totalSupply: number
    network: string
    address: string
    decimals: number
    presalePrice: number
  }
  
  export interface PresaleConfig {
    current: number
    total: number
    stages: PresaleStage[]
  }
  
  export interface SiteConfig {
    name: string
    description: string
    tokenDetails: TokenDetails
    presale: PresaleConfig
  }