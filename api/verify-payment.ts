/**
 * Vercel Serverless Function
 * Verifies Stripe checkout session and returns credits to add
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
    const { sessionId } = request.body;

    if (!sessionId) {
      return response.status(400).json({ error: 'Session ID required' });
    }

    // Retrieve checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      return response.status(400).json({ 
        error: 'Payment not completed',
        credits: 0 
      });
    }

    // Extract credits from metadata
    const credits = session.metadata?.credits 
      ? parseInt(session.metadata.credits, 10) 
      : 0;

    if (credits === 0) {
      return response.status(400).json({ 
        error: 'No credits found in session metadata',
        credits: 0 
      });
    }

    // Return credits to add (client will add to localStorage)
    // In production, you'd update a database here
    response.setHeader('Access-Control-Allow-Origin', '*');
    return response.status(200).json({
      success: true,
      credits,
      packageId: session.metadata?.packageId,
    });

  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return response.status(500).json({
      error: error.message || 'Failed to verify payment',
      credits: 0,
    });
  }
}

