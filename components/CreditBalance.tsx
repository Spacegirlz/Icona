import React, { useState, useEffect } from 'react';
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
      <div className="flex items-center gap-2">
        {/* Premium credit display */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg backdrop-blur-sm">
          <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.849V7.907c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium text-gray-300">
            <span className="text-purple-400 font-bold">{credits}</span>
            <span className="text-gray-500 ml-1">credits</span>
          </span>
        </div>
        
        <button
          onClick={() => setShowPricing(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="hidden sm:inline">Buy</span>
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

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto pointer-events-none"
        style={{ paddingTop: '80px', paddingBottom: '40px' }}
      >
        {/* Modal Content */}
        <div 
          className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[calc(100vh-120px)] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Buy Credits
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Credits never expire • Secure payment via Stripe
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {packages.map((pkg) => {
              const pricePerImage = (pkg.price / pkg.credits).toFixed(2);
              return (
                <div
                  key={pkg.id}
                  className={`group relative p-6 rounded-xl border-2 transition-all duration-200 ${
                    pkg.popular
                      ? 'border-purple-500/50 bg-gradient-to-br from-purple-900/20 to-pink-900/20 shadow-lg shadow-purple-500/10'
                      : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50'
                  } hover:scale-[1.02] hover:shadow-xl`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xs font-bold text-white shadow-lg">
                      ⭐ MOST POPULAR
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        ${pkg.price}
                      </span>
                      <span className="text-gray-400 text-sm">for {pkg.credits} credits</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Just</span>
                      <span className="font-semibold text-purple-400">${(pkg.price / pkg.credits).toFixed(2)}</span>
                      <span className="text-gray-500">per image</span>
                      {parseFloat(pricePerImage) <= 0.20 && (
                        <span className="ml-2 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-medium rounded">
                          Best Value
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4 pt-4 border-t border-gray-700/50">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Instant delivery</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Never expire</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onSelectPackage(pkg.id)}
                    disabled={isLoading}
                    className={`w-full py-3.5 rounded-lg font-semibold transition-all duration-200 ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:shadow-lg hover:shadow-purple-500/25'
                        : 'bg-gray-700 text-white hover:bg-gray-600 hover:shadow-lg'
                    } disabled:opacity-50 disabled:cursor-not-allowed active:scale-95`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      `Get ${pkg.credits} Credits`
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Trust indicators */}
          <div className="mt-8 pt-6 border-t border-gray-800 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure payment</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>Powered by Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No subscription</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

