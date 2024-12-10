// src/components/presale/DisclaimerModal.tsx
'use client';

import { useState } from 'react';

export const DisclaimerModal = ({ onAccept }: { onAccept: () => void }) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="cyber-card max-w-lg w-full p-6">
        <h2 className="text-2xl font-bold mb-6 neon-text text-center">Important Notice</h2>
        <div className="space-y-4 text-gray-300">
          <p>By participating in the XYN Token presale, you acknowledge that:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>You are not a resident of a restricted jurisdiction</li>
            <li>You understand the risks involved in token purchases</li>
            <li>You will complete KYC verification if required</li>
            <li>You are purchasing tokens for their utility within the Galactic Eden ecosystem</li>
          </ul>
        </div>
        <div className="mt-6 flex items-center gap-2">
          <input
            type="checkbox"
            id="accept"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="w-4 h-4 rounded border-blue-500/20"
          />
          <label htmlFor="accept" className="text-gray-300">
            I have read and agree to the terms
          </label>
        </div>
        <button
          onClick={onAccept}
          disabled={!isChecked}
          className={`cyber-button primary w-full mt-6 ${!isChecked ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Continue to Presale
        </button>
      </div>
    </div>
  );
};

export default DisclaimerModal;