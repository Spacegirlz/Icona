import React, { useState, useEffect } from 'react';
import { signUpWithEmail, signInWithEmail, resetPassword, signInWithGoogle } from '../services/authService';
import { getSupabaseClient } from '../services/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [supabaseConfigured, setSupabaseConfigured] = useState<boolean>(true);

  // Check if Supabase is configured when modal opens
  useEffect(() => {
    if (isOpen) {
      try {
        getSupabaseClient();
        setSupabaseConfigured(true);
        setError(null);
      } catch (err) {
        setSupabaseConfigured(false);
        setError('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    if (!supabaseConfigured) {
      setError('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
      return;
    }
    setGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      // User will be redirected, so we don't need to close modal here
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign in with Google. Please try again.';
      if (errorMessage.includes('Supabase is not configured')) {
        setError('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
      } else {
        setError(errorMessage);
      }
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseConfigured) {
      setError('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password);
        setMessage('Check your email to confirm your account!');
        setTimeout(() => {
          onClose();
          onSuccess();
        }, 2000);
      } else if (mode === 'signin') {
        await signInWithEmail(email, password);
        onSuccess();
        onClose();
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setMessage('Password reset email sent! Check your inbox.');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Something went wrong. Please try again.';
      if (errorMessage.includes('Supabase is not configured')) {
        setError('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError(null);
    setMessage(null);
  };

  return (
    <>
      {/* Backdrop - covers entire screen */}
      <div 
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      />
      
      {/* Modal - positioned on top of backdrop */}
      <div 
        className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-24 md:pt-32 pointer-events-none"
      >
        <div 
          className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[calc(100vh-8rem)] overflow-y-auto relative pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            {mode === 'signup' ? 'Create Account' : mode === 'forgot' ? 'Reset Password' : 'Sign In'}
          </h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
              setMode('signin');
            }}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {message && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading || !supabaseConfigured}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg border border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {googleLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900 text-gray-400">or</span>
            </div>
          </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    resetForm();
                  }}
                  className="mt-2 text-sm text-purple-400 hover:text-purple-300"
                >
                  Forgot password?
                </button>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !supabaseConfigured}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {mode === 'signup' ? 'Creating account...' : mode === 'forgot' ? 'Sending...' : 'Signing in...'}
              </span>
            ) : (
              mode === 'signup' ? 'Create Account' : mode === 'forgot' ? 'Send Reset Email' : 'Sign In'
            )}
          </button>


          <div className="text-center text-sm text-gray-400">
            {mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    resetForm();
                  }}
                  className="text-purple-400 hover:text-purple-300 font-medium"
                >
                  Sign in
                </button>
              </>
            ) : mode === 'forgot' ? (
              <>
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    resetForm();
                  }}
                  className="text-purple-400 hover:text-purple-300 font-medium"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    resetForm();
                  }}
                  className="text-purple-400 hover:text-purple-300 font-medium"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </form>
        </div>
        </div>
      </div>
    </>
  );
};

