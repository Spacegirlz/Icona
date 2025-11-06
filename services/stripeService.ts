/**
 * Client-side Stripe service
 * ONLY uses publishable key (pk_live_...) - safe for browser
 * Secret key (sk_live_...) is NEVER used here
 */

// Get publishable key from environment (safe to expose in browser)
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

/**
 * Create a checkout session (calls server-side API)
 * Client never touches secret key
 */
export const createCheckoutSession = async (
  packageId: 'starter' | 'popular' | 'pro' | 'mega',
  userEmail?: string
): Promise<{ sessionId: string; url: string }> => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
    
    const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        packageId,
        userEmail,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error creating checkout session:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(errorMessage);
  }
};

/**
 * Get Stripe publishable key (for future use with Stripe.js if needed)
 */
export const getPublishableKey = (): string => {
  return STRIPE_PUBLISHABLE_KEY;
};

