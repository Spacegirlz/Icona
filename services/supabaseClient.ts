import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Debug logging (only in development or if explicitly enabled)
if (import.meta.env.DEV || import.meta.env.VITE_DEBUG) {
  console.log('🔍 Supabase Config Check:', {
    hasUrl: !!supabaseUrl,
    urlLength: supabaseUrl.length,
    hasKey: !!supabaseAnonKey,
    keyLength: supabaseAnonKey.length,
    urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
    keyPreview: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING',
  });
}

// Create Supabase client only if credentials are available
let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
  }
} else {
  console.warn('⚠️ Supabase credentials not configured. Authentication will not work.');
  console.warn('Missing:', {
    url: !supabaseUrl ? 'VITE_SUPABASE_URL' : null,
    key: !supabaseAnonKey ? 'VITE_SUPABASE_ANON_KEY' : null,
  });
  console.warn('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
}

// Export a safe client that throws helpful errors if not configured
export const getSupabaseClient = (): SupabaseClient => {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file'
    );
  }
  return supabase;
};

// Export the client (will be null if not configured)
export { supabase };

// Helper to get current user
export const getCurrentUser = async () => {
  if (!supabase) {
    console.warn('Supabase not configured. Cannot get current user.');
    return null;
  }
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  return user;
};

// Helper to get user profile with credits
export const getUserProfile = async (userId: string) => {
  if (!supabase) {
    console.warn('Supabase not configured. Cannot get user profile.');
    return null;
  }
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  return data;
};

// Helper to update user credits
export const updateUserCredits = async (userId: string, credits: number) => {
  if (!supabase) {
    console.warn('Supabase not configured. Cannot update credits.');
    return null;
  }
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ credits, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating credits:', error);
    return null;
  }
  return data;
};

// Helper to deduct credits
export const deductCredits = async (userId: string, amount: number): Promise<boolean> => {
  if (!supabase) {
    console.warn('Supabase not configured. Cannot deduct credits.');
    return false;
  }
  const profile = await getUserProfile(userId);
  if (!profile) return false;

  const currentCredits = profile.credits || 0;
  if (currentCredits < amount) return false;

  const newCredits = currentCredits - amount;
  const updated = await updateUserCredits(userId, newCredits);
  return updated !== null;
};

// Helper to add credits
export const addCredits = async (userId: string, amount: number): Promise<boolean> => {
  if (!supabase) {
    console.warn('Supabase not configured. Cannot add credits.');
    return false;
  }
  const profile = await getUserProfile(userId);
  if (!profile) return false;

  const currentCredits = profile.credits || 0;
  const newCredits = currentCredits + amount;
  const updated = await updateUserCredits(userId, newCredits);
  return updated !== null;
};

