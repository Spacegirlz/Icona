import React from 'react';
import { CreditBalance } from './CreditBalance';
import { AuthButton } from './AuthButton';

interface HeaderProps {
  onReset: () => void;
  showReset: boolean;
  credits?: number;
  onCreditsUpdate?: () => void;
  user?: any;
  onAuthChange?: (user: any) => void;
}

/**
 * Premium header with glassmorphism effect, optimized for engagement
 * Inspired by Stripe, Linear, and Vercel design patterns
 */
export const Header: React.FC<HeaderProps> = ({ 
  onReset, 
  showReset, 
  credits = 0, 
  onCreditsUpdate, 
  user, 
  onAuthChange 
}) => {
  // Detect Stripe test mode
  const viteEnv = (import.meta as any)?.env;
  const isTestMode = String(viteEnv?.VITE_STRIPE_PUBLISHABLE_KEY || '').startsWith('pk_test_');

  return (
    <header className="sticky top-0 z-50 w-full bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50 shadow-lg transition-all duration-300">
      <nav className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left: Logo */}
          <div className="flex items-center gap-8">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group"
            >
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-teal-400 group-hover:from-rose-500 group-hover:via-purple-500 group-hover:to-teal-500 transition-all duration-300">
                  ICONA
                </span>
              </h1>
            </button>
            
            {/* Credits Display - Only show if user is logged in */}
            {user && (
              <div className="hidden md:block">
                <CreditBalance credits={credits} onCreditsUpdate={onCreditsUpdate} />
              </div>
            )}
          </div>

          {/* Right: Auth + Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile Credits - Show above auth button */}
            {user && (
              <div className="md:hidden">
                <CreditBalance credits={credits} onCreditsUpdate={onCreditsUpdate} />
              </div>
            )}
            
            <AuthButton 
              onAuthChange={onAuthChange}
              onCreditsChange={onCreditsUpdate}
            />
            
            {isTestMode && (
              <span
                title="Stripe is in Test mode"
                className="hidden md:inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
              >
                Test
              </span>
            )}
            
            {showReset && (
              <button
                onClick={onReset}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/60 border border-gray-700/50 rounded-lg hover:bg-gray-700/80 hover:text-white hover:border-gray-600 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden md:inline">Start Over</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};