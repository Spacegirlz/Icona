import React, { useState } from 'react';
import { createCheckoutSession } from '../services/stripeService';

interface CreditBalanceProps {
  credits: number;
  onCreditsUpdate?: () => void;
}

/**
 * Simple credit balance display with "Buy Credits" button
 * Shows current credits and opens pricing modal
 */
export const CreditBalance: React.FC<CreditBalanceProps> = ({ credits, onCreditsUpdate }) => {
  const [showPricing, setShowPricing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyCredits = async (packageId: 'starter' | 'popular' | 'pro' | 'mega') => {
    setIsLoading(true);
    try {
      const { url } = await createCheckoutSession(packageId);
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg">
          <span className="text-sm text-gray-400">Credits:</span>
          <span className="text-lg font-bold text-purple-400">{credits}</span>
        </div>
        <button
          onClick={() => setShowPricing(true)}
          className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
        >
          Buy Credits
        </button>
      </div>

      {showPricing && (
        <PricingModal
          onClose={() => setShowPricing(false)}
          onSelectPackage={handleBuyCredits}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

interface PricingModalProps {
  onClose: () => void;
  onSelectPackage: (packageId: 'starter' | 'popular' | 'pro' | 'mega') => void;
  isLoading: boolean;
}

/**
 * Pricing modal showing credit packages
 */
const PricingModal: React.FC<PricingModalProps> = ({ onClose, onSelectPackage, isLoading }) => {
  const packages = [
    { id: 'starter' as const, name: 'Starter Pack', credits: 5, price: 1.99, popular: false },
    { id: 'popular' as const, name: 'Popular Pack', credits: 15, price: 4.99, popular: true },
    { id: 'pro' as const, name: 'Pro Pack', credits: 40, price: 9.99, popular: false },
    { id: 'mega' as const, name: 'Mega Pack', credits: 100, price: 19.99, popular: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Buy Credits
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <p className="text-gray-400 mb-8 text-center">
          Choose a credit package to transform your photos
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative p-6 rounded-xl border-2 transition-all ${
                pkg.popular
                  ? 'border-purple-500 bg-purple-900/20'
                  : 'border-gray-700 bg-gray-800/50'
              } hover:border-purple-500 hover:bg-gray-800/80`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xs font-bold text-white">
                  MOST POPULAR
                </div>
              )}
              
              <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-purple-400">${pkg.price}</span>
                <span className="text-gray-400 ml-2">for {pkg.credits} credits</span>
              </div>
              <div className="text-sm text-gray-400 mb-4">
                ${(pkg.price / pkg.credits).toFixed(2)} per image
              </div>
              
              <button
                onClick={() => onSelectPackage(pkg.id)}
                disabled={isLoading}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  pkg.popular
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? 'Loading...' : `Buy ${pkg.credits} Credits`}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Credits never expire. Secure payment via Stripe.</p>
        </div>
      </div>
    </div>
  );
};

