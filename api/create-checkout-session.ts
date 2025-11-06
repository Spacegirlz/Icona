/**
 * Vercel Serverless Function
 * Creates Stripe Checkout Session for credit purchases
 * SECRET KEY (sk_live_...) is ONLY used here - never in client code
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

// Get Stripe secret key from environment (ONLY available server-side)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY environment variable not set');
}

// Initialize Stripe with secret key (server-side only)
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
}) : null;

// Credit packages configuration
const CREDIT_PACKAGES = {
  starter: { credits: 5, priceId: process.env.STRIPE_PRICE_STARTER || '' },
  popular: { credits: 15, priceId: process.env.STRIPE_PRICE_POPULAR || '' },
  pro: { credits: 40, priceId: process.env.STRIPE_PRICE_PRO || '' },
  mega: { credits: 100, priceId: process.env.STRIPE_PRICE_MEGA || '' },
} as const;

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // CORS headers
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  if (!stripe) {
    return response.status(500).json({ error: 'Stripe not configured' });
  }

  try {
    const { packageId, userEmail } = request.body;

    if (!packageId || !CREDIT_PACKAGES[packageId as keyof typeof CREDIT_PACKAGES]) {
      return response.status(400).json({ error: 'Invalid package ID' });
    }

    const packageConfig = CREDIT_PACKAGES[packageId as keyof typeof CREDIT_PACKAGES];
    
    if (!packageConfig.priceId) {
      return response.status(500).json({ error: 'Price ID not configured for this package' });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: packageConfig.priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.origin || 'https://icona-eta.vercel.app'}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.origin || 'https://icona-eta.vercel.app'}/?canceled=true`,
      customer_email: userEmail || undefined,
      metadata: {
        packageId,
        credits: packageConfig.credits.toString(),
      },
    });

    // Return session URL to client
    response.setHeader('Access-Control-Allow-Origin', '*');
    return response.status(200).json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return response.status(500).json({
      error: error.message || 'Failed to create checkout session',
    });
  }
}

