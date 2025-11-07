/**
 * Vercel Serverless Function
 * Sends emails via Resend
 * RESEND_API_KEY is ONLY used here - never in client code
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'support@useicona.com';

if (!resendApiKey) {
  console.error('RESEND_API_KEY environment variable not set');
}

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

  if (!resendApiKey) {
    return response.status(500).json({ error: 'Resend not configured' });
  }

  try {
    const { to, subject, html, text } = request.body;

    if (!to || !subject || !html) {
      return response.status(400).json({ error: 'Missing required fields: to, subject, html' });
    }

    // Call Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML if no text provided
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      console.error('Resend API error:', errorData);
      return response.status(resendResponse.status).json({
        error: errorData.message || 'Failed to send email',
      });
    }

    const data = await resendResponse.json();

    response.setHeader('Access-Control-Allow-Origin', '*');
    return response.status(200).json({ success: true, id: data.id });

  } catch (error: any) {
    console.error('Error sending email:', error);
    return response.status(500).json({
      error: error.message || 'Failed to send email',
    });
  }
}
