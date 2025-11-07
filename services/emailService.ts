/**
 * Email Service (Resend)
 * Handles sending transactional emails
 */

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Email templates
export const emailTemplates = {
  welcome: (userEmail: string) => ({
    to: userEmail,
    subject: 'Welcome to ICONA! 🎨',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #9333ea;">Welcome to ICONA!</h1>
        <p>Hi there!</p>
        <p>Thanks for signing up. You've received <strong>1 free credit</strong> to get started!</p>
        <p>Transform your photos into stunning AI-generated portraits. Ready to create something amazing?</p>
        <a href="https://icona-eta.vercel.app" style="display: inline-block; padding: 12px 24px; background: #9333ea; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
          Start Creating
        </a>
      </div>
    `,
    text: 'Welcome to ICONA! You\'ve received 1 free credit to get started. Visit https://icona-eta.vercel.app to begin.',
  }),

  paymentConfirmation: (userEmail: string, credits: number, amount: number) => ({
    to: userEmail,
    subject: 'Payment Confirmed - Credits Added! ✅',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #9333ea;">Payment Confirmed!</h1>
        <p>Hi there!</p>
        <p>Your payment of <strong>$${(amount / 100).toFixed(2)}</strong> was successful.</p>
        <p><strong>${credits} credits</strong> have been added to your account.</p>
        <a href="https://icona-eta.vercel.app" style="display: inline-block; padding: 12px 24px; background: #9333ea; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
          Use Your Credits
        </a>
      </div>
    `,
    text: `Payment confirmed! ${credits} credits added to your account. Visit https://icona-eta.vercel.app to use them.`,
  }),
};

