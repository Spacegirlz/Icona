/**
 * Vercel Serverless Function
 * Handles Stripe webhook events
 * WEBHOOK SECRET is ONLY used here - never in client code
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

// Get Stripe secret key and webhook secret from environment (ONLY available server-side)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY environment variable not set');
}

if (!webhookSecret) {
  console.error('STRIPE_WEBHOOK_SECRET environment variable not set');
}

// Initialize Stripe with secret key (server-side only)
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
}) : null;

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  if (!stripe || !webhookSecret) {
    return response.status(500).json({ error: 'Stripe not configured' });
  }

  const sig = request.headers['stripe-signature'] as string;

  if (!sig) {
    return response.status(400).json({ error: 'Missing stripe-signature header' });
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature using webhook secret
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      webhookSecret
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return response.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log('[WEBHOOK] Checkout session completed:', {
          sessionId: session.id,
          customerEmail: session.customer_email,
          metadata: session.metadata,
        });

        // Extract credits from metadata
        const credits = session.metadata?.credits 
          ? parseInt(session.metadata.credits, 10) 
          : 0;

        const customerEmail = session.customer_email || session.customer_details?.email;

        // TODO: Add credits to user account in Supabase/database
        // For now, just log the event
        console.log('[WEBHOOK] Credits to add:', {
          email: customerEmail,
          credits,
          packageId: session.metadata?.packageId,
        });

        // In production, you would:
        // 1. Find or create user by email
        // 2. Add credits to their account
        // 3. Log the transaction

        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('[WEBHOOK] Payment succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('[WEBHOOK] Payment failed:', paymentIntent.id);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        console.log('[WEBHOOK] Charge refunded:', charge.id);
        
        // TODO: Deduct credits from user account
        break;
      }

      default:
        console.log(`[WEBHOOK] Unhandled event type: ${event.type}`);
    }

    // Return 200 to acknowledge receipt
    return response.status(200).json({ received: true });

  } catch (error: any) {
    console.error('Error handling webhook:', error);
    return response.status(500).json({ error: error.message });
  }
}

