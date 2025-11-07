/**
 * Vercel Serverless Function
 * Adds credits to a user's account in Supabase
 * Uses service_role key for admin access
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase credentials not configured');
}

// Create Supabase client with service_role key (admin access)
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // CORS headers
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabase) {
    return response.status(500).json({ error: 'Supabase not configured' });
  }

  try {
    const { userId, credits, transactionId, stripePaymentId } = request.body;

    if (!userId || !credits || credits <= 0) {
      return response.status(400).json({ error: 'Invalid request: userId and credits required' });
    }

    // Get current user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return response.status(404).json({ error: 'User profile not found' });
    }

    // Update credits
    const newCredits = (profile.credits || 0) + credits;
    const { data: updatedProfile, error: updateError } = await supabase
      .from('user_profiles')
      .update({ 
        credits: newCredits,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating credits:', updateError);
      return response.status(500).json({ error: 'Failed to update credits' });
    }

    // Log transaction if provided
    if (transactionId || stripePaymentId) {
      await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          stripe_payment_id: stripePaymentId || null,
          credits,
          status: 'completed',
        });
    }

    response.setHeader('Access-Control-Allow-Origin', '*');
    return response.status(200).json({
      success: true,
      credits: newCredits,
      added: credits,
    });

  } catch (error: any) {
    console.error('Error adding credits:', error);
    return response.status(500).json({
      error: error.message || 'Failed to add credits',
    });
  }
}

