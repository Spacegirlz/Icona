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

        // Add credits to user account in Supabase
        if (customerEmail && credits > 0) {
          try {
            const { createClient } = require('@supabase/supabase-js');
            const supabaseUrl = process.env.SUPABASE_URL || '';
            const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

            if (supabaseUrl && supabaseServiceKey) {
              const supabase = createClient(supabaseUrl, supabaseServiceKey);

              // Find user by email
              const { data: profile, error: findError } = await supabase
                .from('user_profiles')
                .select('id, credits')
                .eq('email', customerEmail)
                .single();

              if (profile && !findError) {
                // Update credits
                const newCredits = (profile.credits || 0) + credits;
                await supabase
                  .from('user_profiles')
                  .update({ 
                    credits: newCredits,
                    updated_at: new Date().toISOString(),
                  })
                  .eq('id', profile.id);

                // Log transaction
                await supabase
                  .from('transactions')
                  .insert({
                    user_id: profile.id,
                    stripe_payment_id: session.payment_intent as string,
                    credits,
                    amount_paid: session.amount_total || 0,
                    status: 'completed',
                  });

                console.log('[WEBHOOK] Credits added successfully:', {
                  userId: profile.id,
                  email: customerEmail,
                  credits,
                  newTotal: newCredits,
                });

                // Send payment confirmation email
                try {
                  const amountPaid = session.amount_total || 0;
                  const amountFormatted = `$${(amountPaid / 100).toFixed(2)}`;
                  
                  // Get the app URL - use production domain in production
                  const baseUrl = process.env.VERCEL_ENV === 'production' 
                    ? 'https://www.useicona.com'
                    : process.env.VERCEL_URL 
                    ? `https://${process.env.VERCEL_URL}`
                    : 'https://www.useicona.com';
                  
                  // Call email API endpoint
                  const emailResponse = await fetch(`${baseUrl}/api/send-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      to: customerEmail,
                      subject: 'Payment Confirmed - Credits Added! ✅',
                      html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                          <h1 style="color: #9333ea;">Payment Confirmed!</h1>
                          <p>Hi there!</p>
                          <p>Your payment of <strong>${amountFormatted}</strong> was successful.</p>
                          <p><strong>${credits} credits</strong> have been added to your account.</p>
                          <a href="${baseUrl}" style="display: inline-block; padding: 12px 24px; background: #9333ea; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
                            Use Your Credits
                          </a>
                        </div>
                      `,
                      text: `Payment confirmed! ${credits} credits added to your account. Visit ${baseUrl} to use them.`,
                    }),
                  });
                  
                  if (emailResponse.ok) {
                    console.log('[WEBHOOK] Payment confirmation email sent');
                  } else {
                    console.error('[WEBHOOK] Failed to send payment confirmation email:', await emailResponse.text());
                  }
                } catch (emailError) {
                  console.error('[WEBHOOK] Error sending payment confirmation email:', emailError);
                  // Don't fail the webhook if email fails
                }
              } else {
                console.warn('[WEBHOOK] User not found for email:', customerEmail);
              }
            }
          } catch (error: any) {
            console.error('[WEBHOOK] Error adding credits to user:', error);
          }
        }

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

