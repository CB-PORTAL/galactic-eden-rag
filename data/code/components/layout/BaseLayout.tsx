import React from 'react'
import { SITE_CONFIG } from '@/lib/config/index'
import { ConnectButton } from '@/components/wallet/ConnectButton'
import TokenNavMenu from '@/components/nav/TokenNavMenu'

interface BaseLayoutProps {
  children: React.ReactNode
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <header className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <TokenNavMenu />
            <ConnectButton />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-gray-400">
            © 2024 Galactic Eden. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
} 