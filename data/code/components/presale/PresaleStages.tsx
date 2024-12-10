import React from 'react'
import { SITE_CONFIG } from '@/lib/config/index'

export default function PresaleStages() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-white text-center mb-12">Presale Stages</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {SITE_CONFIG.presale.stages.map((stage) => (
          <div
            key={stage.id}
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20"
          >
            <div className="text-sm text-blue-400 mb-2">Stage {stage.id}</div>
            <div className="text-2xl font-bold text-white mb-4">
              {stage.allocation.toLocaleString()} XYN
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Price</span>
              <span className="text-white">{stage.price} USDC</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}