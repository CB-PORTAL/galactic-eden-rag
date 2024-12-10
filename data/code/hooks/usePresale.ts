import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { SITE_CONFIG, RPC_ENDPOINT } from '@/lib/config/index'
import type { PresaleStage } from '@/types/presale'

export function usePresale() {
  const { publicKey, connected } = useWallet()
  const [loading, setLoading] = useState(false)
  const [currentStage, setCurrentStage] = useState<PresaleStage>(
    SITE_CONFIG.presale.stages[SITE_CONFIG.presale.current - 1]
  )
  const [balance, setBalance] = useState<number | null>(null)

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey && connected) {
        try {
          setLoading(true)
          const connection = new Connection(RPC_ENDPOINT)
          const bal = await connection.getBalance(publicKey)
          setBalance(bal / LAMPORTS_PER_SOL)
        } catch (error) {
          console.error('Error fetching balance:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchBalance()
  }, [publicKey, connected])

  return {
    currentStage,
    balance,
    loading,
    connected,
    publicKey
  }
}