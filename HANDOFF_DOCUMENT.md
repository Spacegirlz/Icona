# ICONA - Technical Handoff Document 🚀

**Created:** November 7, 2025  
**Last Updated:** December 2024  
**Status:** ✅ Production Ready  
**Next Focus:** Additional UI/UX Polish & Mobile Optimization

---

## 🎉 What We've Accomplished Together

This document summarizes all the technical setup completed for ICONA. Use this as a reference for future development work.

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Authentication & User Management](#authentication--user-management)
3. [Payment System](#payment-system)
4. [Email Service](#email-service)
5. [Database Schema](#database-schema)
6. [Environment Variables](#environment-variables)
7. [Deployment](#deployment)
8. [Current Features](#current-features)
9. [Technical Stack](#technical-stack)
10. [Next Steps](#next-steps)

---

## 🏗️ System Overview

### Architecture
- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Vercel Serverless Functions
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth + Google OAuth
- **Payments:** Stripe
- **Email:** Resend
- **Hosting:** Vercel
- **Domain:** useicona.com (pointing to Vercel)

### Current Status
- ✅ All core systems operational
- ✅ User authentication working
- ✅ Payment processing active
- ✅ Email service configured
- ✅ Database schema complete
- ✅ Security policies in place

---

## 🔐 Authentication & User Management

### Supabase Setup
- **Project URL:** `https://welezbiiqwhvsftiypni.supabase.co`
- **Project ID:** `welezbiiqwhvsftiypni`
- **Status:** ✅ Configured and operational

### Google OAuth
- **Client ID:** `1069128342557-7rbtiisjgcnc5idgs4qroocekta11qhr.apps.googleusercontent.com`
- **Client Secret:** `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`
- **Status:** ✅ Enabled in Supabase
- **Redirect URI:** `https://welezbiiqwhvsftiypni.supabase.co/auth/v1/callback`

### User Flow
1. User clicks "Sign in with Google"
2. Redirected to Google OAuth
3. After authentication, redirected back to app
4. User profile created in Supabase (if new user)
5. Welcome email sent automatically
6. User receives 1 free credit

### Authentication Methods
- **Google OAuth:** One-click sign in with Google account
- **Email/Password:** Traditional sign up and sign in
- **Password Reset:** Forgot password flow with email reset link

### Key Files
- `services/supabaseClient.ts` - Supabase client configuration (handles missing env vars gracefully)
- `services/authService.ts` - Authentication functions (Google OAuth, Email/Password, Password Reset)
- `components/AuthButton.tsx` - Sign in/out UI component (opens unified AuthModal)
- `components/AuthModal.tsx` - Unified authentication modal with backdrop overlay

---

## 💳 Payment System

### Stripe Configuration
- **Status:** ✅ Live and Test modes configured
- **Payment Flow:** Stripe Checkout → Webhook → Credits added

### Credit Packages
- **Starter:** 5 credits = $1.99
- **Popular:** 15 credits = $4.99 ⭐ (Most Popular)
- **Pro:** 40 credits = $9.99
- **Mega:** 100 credits = $19.99

### Payment Flow
1. User clicks "Buy Credits"
2. Selects package
3. Redirected to Stripe Checkout
4. Completes payment
5. Webhook adds credits to Supabase
6. Payment confirmation email sent
7. User redirected back to app

### Key Files
- `api/create-checkout-session.ts` - Creates Stripe checkout
- `api/stripe-webhook.ts` - Handles payment webhooks
- `api/verify-payment.ts` - Verifies payment sessions
- `components/CreditBalance.tsx` - Credit display and purchase UI

### Environment Variables (Vercel)
- `STRIPE_SECRET_KEY` - Server-side only (Production/Preview/Development)
- `STRIPE_WEBHOOK_SECRET` - Server-side only (Production/Preview/Development)
- `VITE_STRIPE_PUBLISHABLE_KEY` - Client-side (Production/Preview/Development)
- `STRIPE_PRICE_STARTER` - Price ID for Starter package
- `STRIPE_PRICE_POPULAR` - Price ID for Popular package
- `STRIPE_PRICE_PRO` - Price ID for Pro package
- `STRIPE_PRICE_MEGA` - Price ID for Mega package

---

## 📧 Email Service

### Resend Configuration
- **Status:** ✅ Domain verified and operational
- **From Email:** `support@useicona.com`
- **API Key:** `re_axySVCmN_FavhEAGAEWS8JKiitmJmJsQz`
- **Domain:** `useicona.com` (verified in Resend)

### DNS Records (Added in Vercel)
- ✅ `resend._domainkey` (TXT) - Domain verification
- ✅ `send` (MX) - Email sending
- ✅ `send` (TXT) - SPF record
- ✅ `_dmarc` (TXT) - DMARC policy

### Email Types
1. **Welcome Email** - Sent when new user signs up
   - Subject: "Welcome to ICONA! 🎨"
   - Includes info about free credit
   
2. **Payment Confirmation** - Sent after successful payment
   - Subject: "Payment Confirmed - Credits Added! ✅"
   - Shows amount paid and credits added

### Key Files
- `api/send-email.ts` - Resend email API endpoint
- `services/emailService.ts` - Email templates and sending logic

### Environment Variables (Vercel)
- `RESEND_API_KEY` - Server-side only (Production/Preview/Development)
- `RESEND_FROM_EMAIL` - Set to `support@useicona.com` (Production/Preview/Development)

---

## 🗄️ Database Schema

### Tables Created in Supabase

#### 1. `user_profiles`
- Stores user account information and credits
- Columns:
  - `id` (UUID, Primary Key, references auth.users)
  - `email` (TEXT, Unique, Not Null)
  - `credits` (INTEGER, Default: 0)
  - `free_credits_used` (INTEGER, Default: 0)
  - `last_free_credit_date` (TIMESTAMP)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

#### 2. `transactions`
- Tracks all credit purchases
- Columns:
  - `id` (UUID, Primary Key)
  - `user_id` (UUID, references user_profiles)
  - `stripe_payment_id` (TEXT, Unique)
  - `credits` (INTEGER, Not Null)
  - `amount_paid` (INTEGER, in cents)
  - `status` (TEXT, Default: 'pending')
  - `created_at` (TIMESTAMP)

#### 3. `usage_logs`
- Tracks credit usage for analytics
- Columns:
  - `id` (UUID, Primary Key)
  - `user_id` (UUID, references user_profiles)
  - `endpoint` (TEXT, Not Null)
  - `credits_used` (INTEGER, Default: 1)
  - `estimated_cost` (DECIMAL)
  - `created_at` (TIMESTAMP)

### Security (Row Level Security)
- ✅ RLS enabled on all tables
- ✅ Users can only view/edit their own data
- ✅ Policies configured for SELECT and UPDATE operations

---

## 🔑 Environment Variables

### Vercel Configuration

#### Production Environment:
```
VITE_SUPABASE_URL=https://welezbiiqwhvsftiypni.supabase.co
VITE_SUPABASE_ANON_KEY=(anon key from Supabase)
SUPABASE_SERVICE_ROLE_KEY=(service_role key from Supabase - SECRET!)
STRIPE_SECRET_KEY=(sk_live_... - SECRET!)
STRIPE_WEBHOOK_SECRET=(whsec_... - SECRET!)
VITE_STRIPE_PUBLISHABLE_KEY=(pk_live_...)
STRIPE_PRICE_STARTER=(price_xxx)
STRIPE_PRICE_POPULAR=(price_xxx)
STRIPE_PRICE_PRO=(price_xxx)
STRIPE_PRICE_MEGA=(price_xxx)
RESEND_API_KEY=(re_... - SECRET!)
RESEND_FROM_EMAIL=support@useicona.com
VITE_API_URL=/api
```

#### Preview/Development Environment:
```
(Same variables as Production, but can use test keys)
```

**Note:** All secret keys (service_role, Stripe secrets, Resend API key) are server-side only and never exposed to the client.

---

## 🚀 Deployment

### Vercel Setup
- **Project:** ICONA
- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Domain:** `useicona.com` and `www.useicona.com`
- **Status:** ✅ Deployed and live

### GitHub Integration
- **Repository:** Connected to Vercel
- **Auto-deploy:** Enabled
- **Branch:** `main` → Production

### DNS Configuration
- **Nameservers:** Vercel (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`)
- **Domain Registrar:** Hostinger
- **DNS Records:** Managed in Vercel

---

## ✨ Current Features

### User Features
- ✅ Sign in with Google OAuth
- ✅ Sign in/Sign up with Email & Password
- ✅ Password reset functionality
- ✅ Unified authentication modal with dark backdrop
- ✅ View credit balance
- ✅ Purchase credits (4 packages)
- ✅ Generate AI images (1 credit per generation)
- ✅ Refine images (1 credit per refinement)
- ✅ Credits persist across devices
- ✅ Payment history (in database)

### Admin/System Features
- ✅ Automatic welcome emails
- ✅ Payment confirmation emails
- ✅ Credit deduction on image generation
- ✅ Transaction logging
- ✅ Usage tracking
- ✅ Secure API key management

---

## 🛠️ Technical Stack

### Frontend
- **Framework:** React 19.2.0
- **Language:** TypeScript 5.8.2
- **Build Tool:** Vite 6.2.0
- **Styling:** Tailwind CSS 3.4.18
- **State Management:** React Hooks

### Backend
- **Platform:** Vercel Serverless Functions
- **Runtime:** Node.js
- **API:** RESTful endpoints

### Database
- **Provider:** Supabase (PostgreSQL)
- **ORM:** Supabase JS Client
- **Auth:** Supabase Auth

### Services
- **AI:** Google Gemini 2.5 Flash (Image & Text)
- **Payments:** Stripe
- **Email:** Resend
- **Hosting:** Vercel

### Key Dependencies
```json
{
  "@google/genai": "^1.29.0",
  "@supabase/supabase-js": "^2.x.x",
  "@vercel/node": "^5.5.4",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "stripe": "^19.3.0"
}
```

---

## 📁 Important Files & Directories

### API Endpoints (`/api/`)
- `create-checkout-session.ts` - Stripe checkout creation
- `stripe-webhook.ts` - Payment webhook handler
- `verify-payment.ts` - Payment verification
- `send-email.ts` - Email sending
- `generate-image.ts` - AI image generation
- `generate-caption.ts` - Image captioning
- `generate-prompt.ts` - Prompt generation
- `refinement-suggestions.ts` - Refinement suggestions

### Services (`/services/`)
- `supabaseClient.ts` - Supabase client & helpers
- `authService.ts` - Authentication functions
- `emailService.ts` - Email templates & sending
- `stripeService.ts` - Stripe client functions
- `geminiService.ts` - AI API calls

### Components (`/components/`)
- `AuthButton.tsx` - Sign in/out button (opens AuthModal)
- `AuthModal.tsx` - Unified authentication modal (Google OAuth + Email/Password)
- `CreditBalance.tsx` - Credit display & purchase modal
- `Header.tsx` - Main header with credits (glassmorphism design)
- `ErrorBoundary.tsx` - Error handling
- `ImageUploader.tsx` - Image upload
- `ResultDisplay.tsx` - Results display
- `PromptBuilder.tsx` - Prompt building UI
- `LandingPage.tsx` - Landing page (redesigned hero section)
- `WelcomeBanner.tsx` - Welcome banner for new users

### Utils (`/utils/`)
- `promptSanitizer.ts` - Input sanitization (security)
- `imageUtils.ts` - Image validation & conversion

---

## 🔒 Security Features

### Implemented
- ✅ API keys secured server-side only
- ✅ Row Level Security (RLS) on all database tables
- ✅ Input sanitization (prevents prompt injection)
- ✅ CORS headers configured
- ✅ Error boundaries for graceful error handling
- ✅ Memory leak prevention (blob URL cleanup)

### Best Practices
- Secret keys never exposed to client
- User data isolated via RLS policies
- Input validation on all user inputs
- Secure payment processing via Stripe

---

## 📊 Current State

### What's Working
- ✅ User authentication (Google OAuth)
- ✅ Credit system (database-backed)
- ✅ Payment processing (Stripe)
- ✅ Email sending (Resend)
- ✅ AI image generation
- ✅ Credit deduction
- ✅ Transaction logging

### Recent UI/UX Improvements (Latest Session)
- ✅ **Authentication Modal:** Unified modal with dark backdrop overlay
  - Separate backdrop layer covering entire screen (85% black opacity with blur)
  - Supports Google OAuth and Email/Password authentication
  - Sign in, Sign up, and Forgot password modes
  - Proper z-index layering (backdrop z-40, modal z-50)
  - Click outside to close functionality
  
- ✅ **Landing Page:** Redesigned hero section
  - Dynamic CTAs based on user authentication status
  - Value proposition badge ("Get 1 free transformation")
  - Trust indicators (instant results, secure & private, studio-quality)
  - Premium gradient styling

- ✅ **Header:** Glassmorphism design
  - Conditional credit display (only when logged in)
  - Premium styling with backdrop blur

- ✅ **Auth Service:** Enhanced authentication
  - Fixed Google OAuth redirect URL (works in dev and prod)
  - Added email/password sign up, sign in, and password reset
  - Graceful error handling

### What's Next (Design Focus)
- 🎨 Additional landing page sections
- 🎨 More UI/UX polish
- 🎨 Mobile optimization refinements
- 🎨 User onboarding flow improvements

---

## 🚧 Known Limitations

1. **Free Credit System:** Weekly free credit feature is coded but not fully implemented in UI
2. **Usage Logging:** Usage logs are tracked but not displayed to users yet
3. **Transaction History:** Stored in database but not shown in UI
4. **Email Templates:** Basic templates - can be customized/branded further

## 🎨 Recent UI/UX Changes (December 2024)

### Authentication Modal Improvements
**File:** `components/AuthModal.tsx`

**Changes:**
- Separated backdrop and modal into distinct layers for proper z-index management
- Backdrop: `fixed inset-0 z-40` with `rgba(0, 0, 0, 0.85)` and `backdrop-filter: blur(8px)`
- Modal: `fixed inset-0 z-50` with `pointer-events-none` on container, `pointer-events-auto` on modal content
- Ensures entire screen is darkened when modal opens, not just the top section
- Click outside backdrop closes modal, click inside modal content does not close

**Technical Details:**
- Uses React Fragment (`<>...</>`) to render both backdrop and modal
- Backdrop has `onClick={onClose}` to close modal
- Modal content has `onClick={(e) => e.stopPropagation()}` to prevent closing when clicking inside
- Modal positioned with `items-start justify-center pt-24 md:pt-32` for proper vertical placement

### Auth Service Enhancements
**File:** `services/authService.ts`

**Changes:**
- Fixed Google OAuth redirect URL to use `window.location.origin + window.location.pathname`
- Works correctly in both development (port 5173) and production
- Added `signUpWithEmail()`, `signInWithEmail()`, and `resetPassword()` functions
- All functions use `getSupabaseClient()` for error handling

### Supabase Client Resilience
**File:** `services/supabaseClient.ts`

**Changes:**
- Client initialization now handles missing environment variables gracefully
- `getSupabaseClient()` function throws clear error if client not configured
- Helper functions check for null client and log warnings instead of crashing
- Prevents white screen errors when Supabase env vars are missing

---

## 📝 Important Notes

### For Future Development

1. **API Keys:** All secret keys are in Vercel environment variables. Never commit them to Git.

2. **Database Changes:** If modifying schema, update RLS policies accordingly.

3. **Email Sending:** Uses Resend API. Free tier: 3,000 emails/month.

4. **Credit System:** Credits are stored in Supabase. LocalStorage is no longer used.

5. **Payment Testing:** Use Stripe test mode keys for development. Test card: `4242 4242 4242 4242`

6. **Domain Email:** `support@useicona.com` is verified in Resend. DNS records are in Vercel.

---

## 🎯 Next Steps (Design Phase)

### Immediate Focus
1. **Landing Page Design**
   - Improve visual appeal
   - Better call-to-action
   - Showcase features
   - Social proof

2. **UI/UX Improvements**
   - Component styling
   - User flow optimization
   - Mobile responsiveness
   - Loading states

3. **User Experience**
   - Onboarding flow
   - Credit balance visibility
   - Transaction history display
   - Usage analytics

---

## 📞 Support Resources

### Documentation
- Supabase: https://supabase.com/docs
- Stripe: https://stripe.com/docs
- Resend: https://resend.com/docs
- Vercel: https://vercel.com/docs

### Credentials Location
- **Saved in:** `CREDENTIALS.md` (local file, not in Git)
- **Vercel:** Environment Variables section
- **Supabase:** Settings → API
- **Stripe:** Dashboard → Developers → API keys
- **Resend:** Dashboard → API Keys

---

## 🎉 Summary

**You've built a complete, production-ready application with:**
- User authentication
- Secure payment processing
- Email notifications
- Database-backed credit system
- AI image generation
- Professional email domain

**Everything is connected, secured, and ready for users!**

---

**This handoff document is your technical reference. Use it to:**
- Understand the system architecture
- Find configuration details
- Reference file locations
- Plan future development

**For design work, start a new chat focused on UI/UX!** 🎨

---

*Built with ❤️ by you and Auto*

