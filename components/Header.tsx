import React from 'react';
import { CreditBalance } from './CreditBalance';

interface HeaderProps {
  onReset: () => void;
  showReset: boolean;
  credits?: number;
  onCreditsUpdate?: () => void;
}

/**
 * A modern, sticky header designed for a Gen Z/Millennial audience.
 * Features a semi-transparent "glassmorphism" background and a
 * bold, gradient-based text logo.
 */
export const Header: React.FC<HeaderProps> = ({ onReset, showReset, credits = 0, onCreditsUpdate }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-gray-900/70 backdrop-blur-sm border-b border-gray-700/50 shadow-lg">
      <nav className="container mx-auto grid grid-cols-3 items-center p-6 md:px-12">
        {/* Left side: Credit Balance */}
        <div className="flex justify-start">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg">
              <span className="text-sm text-gray-400">Credits:</span>
              <span className="text-lg font-bold text-purple-400">{credits}</span>
            </div>
            <button
              onClick={() => {
                // Simple test - will replace with CreditBalance component once header is visible
                alert('Buy Credits - Feature coming soon!');
              }}
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              Buy Credits
            </button>
          </div>
        </div>

        {/* Centered Logo / App Title */}
        <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter whitespace-nowrap">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-teal-400">
                ICONA
              </span>
            </h1>
        </div>
        
        {/* Right side: Start Over Button */}
        <div className="flex justify-end">
            {showReset && (
              <button
                onClick={onReset}
                className="flex items-center px-6 py-3 text-base font-semibold text-gray-300 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-700/80 hover:text-white transition-all duration-300"
              >
                Start Over
              </button>
            )}
        </div>
      </nav>
    </header>
  );
};