import React, { useState, useEffect } from 'react';

interface WelcomeBannerProps {
  credits: number;
  onDismiss: () => void;
}

/**
 * Premium welcome banner shown to new users after signup
 * Highlights their free credit and guides next steps
 */
export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ credits, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Wait for animation
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in slide-in-from-top duration-300">
      <div className="bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-xl border border-purple-500/50 rounded-xl shadow-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Welcome to ICONA! 🎨</h3>
                <p className="text-sm text-purple-100">You're all set to start transforming</p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-white/10 rounded-lg border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-100 mb-1">Your free credit is ready</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">{credits}</span>
                    <span className="text-sm text-purple-200">free {credits === 1 ? 'credit' : 'credits'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-purple-200 mb-1">Worth</p>
                  <p className="text-lg font-semibold text-white">$0.20</p>
                </div>
              </div>
            </div>
            
            <p className="mt-4 text-sm text-purple-100">
              Upload a photo and choose your style to get started. Your first transformation is on us!
            </p>
          </div>
          
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white transition-colors p-1"
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

