# Fix: Supabase Configuration Error

## Problem
You're seeing the error: **"Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables."**

This means the Supabase environment variables are missing in your Vercel deployment.

---

## Solution: Add Environment Variables to Vercel

### Step 1: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: **welezbiiqwhvsftiypni**
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL**: `https://welezbiiqwhvsftiypni.supabase.co`
   - **anon/public key**: (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### Step 2: Add to Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your **ICONA** project
3. Go to **Settings** → **Environment Variables**
4. Add these two variables:

#### Variable 1:
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `https://welezbiiqwhvsftiypni.supabase.co`
- **Environment:** Check **Production**, **Preview**, and **Development** ✅

#### Variable 2:
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Value:** (paste your anon key from Supabase)
- **Environment:** Check **Production**, **Preview**, and **Development** ✅

### Step 3: Redeploy

After adding the variables:
1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete (~2-3 minutes)

---

## Quick Check: Verify Variables Are Set

After redeploying, the error should disappear. If it doesn't:

1. **Check Vercel Environment Variables:**
   - Settings → Environment Variables
   - Make sure both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are there
   - Make sure they're enabled for **Production** environment

2. **Check Variable Names:**
   - Must start with `VITE_` (this is required for Vite to expose them to the client)
   - No typos: `VITE_SUPABASE_URL` (not `VITE_SUPABASE_UR` or `VITE_SUPABASE_URLS`)

3. **Check Deployment:**
   - Make sure you redeployed AFTER adding the variables
   - Old deployments won't have the new variables

---

## All Required Environment Variables

While you're at it, make sure you have ALL these variables set in Vercel:

### Client-Side (must start with `VITE_`):
- ✅ `VITE_SUPABASE_URL`
- ✅ `VITE_SUPABASE_ANON_KEY`
- ✅ `VITE_STRIPE_PUBLISHABLE_KEY`
- ✅ `VITE_API_URL` (set to `/api`)

### Server-Side (no `VITE_` prefix):
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `STRIPE_SECRET_KEY`
- ✅ `STRIPE_WEBHOOK_SECRET`
- ✅ `STRIPE_PRICE_STARTER`
- ✅ `STRIPE_PRICE_POPULAR`
- ✅ `STRIPE_PRICE_PRO`
- ✅ `STRIPE_PRICE_MEGA`
- ✅ `RESEND_API_KEY`
- ✅ `RESEND_FROM_EMAIL`

---

## Testing Locally

If you want to test locally, create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://welezbiiqwhvsftiypni.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key_here
VITE_API_URL=/api
```

**Note:** Never commit `.env` files to Git! They're already in `.gitignore`.

---

## Still Having Issues?

If the error persists after adding variables and redeploying:

1. **Clear browser cache** and hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
2. **Check browser console** (F12) for any other errors
3. **Verify Supabase project is active** in Supabase dashboard
4. **Check Vercel deployment logs** for build errors

---

## Summary

The fix is simple:
1. ✅ Add `VITE_SUPABASE_URL` to Vercel
2. ✅ Add `VITE_SUPABASE_ANON_KEY` to Vercel  
3. ✅ Enable both for Production environment
4. ✅ Redeploy your app

That's it! 🎉

