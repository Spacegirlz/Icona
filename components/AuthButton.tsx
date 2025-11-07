import React, { useState, useEffect } from 'react';
import { getCurrentUser, getUserProfile } from '../services/supabaseClient';
import { signInWithGoogle, signOut } from '../services/authService';
import { AuthModal } from './AuthModal';

interface AuthButtonProps {
  onAuthChange?: (user: any) => void;
  onCreditsChange?: (credits: number) => void;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ onAuthChange, onCreditsChange }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.warn('Auth check timed out, setting loading to false');
      setLoading(false);
    }, 5000); // 5 second timeout

    // Check for existing session
    checkUser();

    // Listen for auth changes
    let subscription: any;
    (async () => {
      const { getSupabaseClient } = await import('../services/supabaseClient');
      try {
        const supabase = getSupabaseClient();
        const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            await handleUserLogin(session.user);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            onAuthChange?.(null);
            onCreditsChange?.(0);
          }
        }
      );
      subscription = data.subscription;
      } catch (error) {
        console.warn('Supabase not configured. Auth state changes will not work.');
        setLoading(false); // Stop loading if Supabase isn't configured
      }
    })();

    return () => {
      clearTimeout(timeoutId);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        await handleUserLogin(currentUser);
      } else {
        setUser(null);
        onAuthChange?.(null);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      // Even on error, stop loading so user can still interact
    } finally {
      setLoading(false);
    }
  };

  const handleUserLogin = async (authUser: any) => {
    try {
      // Initialize profile if needed
      const { initializeUserProfile } = await import('../services/authService');
      const profile = await initializeUserProfile(authUser.id, authUser.email || '');

      setUser({
        ...authUser,
        profile,
      });

      onAuthChange?.(authUser);
      onCreditsChange?.(profile?.credits || 0);
    } catch (error) {
      console.error('Error handling user login:', error);
    }
  };

  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
      // User will be redirected, so we don't need to update state here
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Failed to sign in. Please try again.');
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      onAuthChange?.(null);
      onCreditsChange?.(0);
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-2 text-sm text-gray-400">
        Loading...
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/60 border border-gray-700/50 rounded-lg">
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Profile"
              className="w-7 h-7 rounded-full ring-2 ring-purple-500/20"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <span className="text-sm font-medium text-gray-200 hidden sm:inline max-w-[120px] truncate">
            {user.email?.split('@')[0] || 'User'}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="px-3 py-1.5 text-sm font-medium text-gray-300 bg-gray-800/60 border border-gray-700/50 rounded-lg hover:bg-gray-700/80 hover:text-white hover:border-gray-600 transition-all duration-200"
        >
          <span className="hidden sm:inline">Sign Out</span>
          <span className="sm:hidden">Out</span>
        </button>
      </div>
    );
  }

  const handleAuthSuccess = async () => {
    // Refresh user state after successful auth
    await checkUser();
  };

  return (
    <>
      <button
        onClick={() => setShowAuthModal(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 active:scale-95"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="hidden sm:inline">Sign In</span>
        <span className="sm:hidden">Sign In</span>
      </button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

