import { getSupabaseClient, getCurrentUser, getUserProfile } from './supabaseClient';

// Sign in with Google OAuth
export const signInWithGoogle = async () => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });

  if (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }

  return data;
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
    },
  });

  if (error) {
    console.error('Error signing up with email:', error);
    throw error;
  }

  return data;
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error signing in with email:', error);
    throw error;
  }

  return data;
};

// Reset password (send reset email)
export const resetPassword = async (email: string) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    console.error('Error resetting password:', error);
    throw error;
  }

  return data;
};

// Sign out
export const signOut = async () => {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Get current session
export const getSession = async () => {
  const supabase = getSupabaseClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return session;
};

// Initialize user profile (called after first login)
export const initializeUserProfile = async (userId: string, email: string) => {
  // Check if profile already exists
  const existing = await getUserProfile(userId);
  if (existing) {
    return existing;
  }

  // Create new profile with 1 free credit
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      id: userId,
      email,
      credits: 1, // Start with 1 free credit
      free_credits_used: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }

  // Send welcome email to new user (don't wait for it - fire and forget)
  if (data && email) {
    try {
      const { sendEmail, emailTemplates } = await import('./emailService');
      const welcomeEmail = emailTemplates.welcome(email);
      sendEmail(welcomeEmail).catch((err) => {
        console.error('Failed to send welcome email:', err);
        // Don't throw - email failure shouldn't break signup
      });
    } catch (err) {
      console.error('Error sending welcome email:', err);
      // Don't throw - email failure shouldn't break signup
    }
  }

  return data;
};

// Check if user has free credit available (1 per week)
export const checkFreeCreditEligibility = async (userId: string): Promise<boolean> => {
  const profile = await getUserProfile(userId);
  if (!profile) return false;

  const lastFreeCreditDate = profile.last_free_credit_date;
  if (!lastFreeCreditDate) return true; // Never used free credit

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const lastDate = new Date(lastFreeCreditDate);
  return lastDate < oneWeekAgo;
};

// Grant weekly free credit
export const grantWeeklyFreeCredit = async (userId: string): Promise<boolean> => {
  const eligible = await checkFreeCreditEligibility(userId);
  if (!eligible) return false;

  const profile = await getUserProfile(userId);
  if (!profile) return false;

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      credits: (profile.credits || 0) + 1,
      free_credits_used: (profile.free_credits_used || 0) + 1,
      last_free_credit_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error granting free credit:', error);
    return false;
  }

  return true;
};

