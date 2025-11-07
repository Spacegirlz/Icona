# How to Switch Between Test and Live Mode 🔄

## Overview

Your app automatically detects whether you're using **Stripe test keys** or **live keys** and shows a test mode indicator when appropriate.

---

## Quick Switch Guide

### Switch to Test Mode

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project (`icona-eta` or your project name)

2. **Go to Settings → Environment Variables**
   - Click on your project
   - Click **Settings** in the top nav
   - Click **Environment Variables** in the sidebar

3. **Update Stripe Keys**
   - Find `VITE_STRIPE_PUBLISHABLE_KEY`
   - **Change the value** from `pk_live_...` to `pk_test_...`
   - Find `STRIPE_SECRET_KEY`
   - **Change the value** from `sk_live_...` to `sk_test_...`
   - Find `STRIPE_WEBHOOK_SECRET`
   - **Change the value** to your **test webhook secret** (starts with `whsec_...`)

4. **Update Price IDs** (if different for test mode)
   - `STRIPE_PRICE_STARTER` - Test price ID
   - `STRIPE_PRICE_POPULAR` - Test price ID
   - `STRIPE_PRICE_PRO` - Test price ID
   - `STRIPE_PRICE_MEGA` - Test price ID

5. **Set Scope**
   - Make sure all test keys are set to **"All Environments"** or **"Preview, Development"**
   - **Do NOT** set test keys to "Production" only

6. **Redeploy**
   - Go to **Deployments** tab
   - Click **"Redeploy"** on the latest deployment
   - Or push a new commit to trigger a deployment

---

### Switch Back to Live Mode

1. **Go to Vercel Dashboard → Settings → Environment Variables**

2. **Update Stripe Keys**
   - `VITE_STRIPE_PUBLISHABLE_KEY` → Change to `pk_live_...`
   - `STRIPE_SECRET_KEY` → Change to `sk_live_...`
   - `STRIPE_WEBHOOK_SECRET` → Change to your **live webhook secret**

3. **Update Price IDs** (if different)
   - Update all `STRIPE_PRICE_*` variables to live price IDs

4. **Set Scope**
   - Live keys should be set to **"Production"** only
   - Test keys should be set to **"Preview, Development"** only

5. **Redeploy**

---

## Getting Your Test Keys from Stripe

### 1. Go to Stripe Dashboard
- Visit: https://dashboard.stripe.com
- Make sure you're in **Test mode** (toggle in top right)

### 2. Get Test Keys
- Click **Developers** → **API keys**
- You'll see:
  - **Publishable key:** `pk_test_...` (use for `VITE_STRIPE_PUBLISHABLE_KEY`)
  - **Secret key:** `sk_test_...` (use for `STRIPE_SECRET_KEY`)

### 3. Get Test Price IDs
- Click **Products** in the sidebar
- Click on each product (Starter, Popular, Pro, Mega)
- Copy the **Price ID** (starts with `price_...`)
- Use these for `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_POPULAR`, etc.

### 4. Get Test Webhook Secret
- Click **Developers** → **Webhooks**
- Find your webhook endpoint (or create one)
- Click on it
- Under **Signing secret**, click **Reveal**
- Copy the secret (starts with `whsec_...`)
- Use this for `STRIPE_WEBHOOK_SECRET`

---

## Testing Test Mode

### 1. Verify Test Mode Indicator
After switching to test keys and redeploying:
- ✅ **Landing page** should show yellow "Test Mode" badge at the top
- ✅ **Header** should show small "Test" badge (desktop only)

### 2. Test a Payment
1. Go to your app
2. Sign in (or sign up)
3. Click **"Buy Credits"**
4. Select a package
5. Use Stripe's **test card numbers**:
   - **Success:** `4242 4242 4242 4242`
   - **Decline:** `4000 0000 0000 0002`
   - **3D Secure:** `4000 0025 0000 3155`
   - **Any future expiry date** (e.g., 12/34)
   - **Any 3-digit CVC** (e.g., 123)
   - **Any ZIP code** (e.g., 12345)

### 3. Verify Test Payment
- Payment should complete successfully
- Credits should be added to your account
- You should receive a payment confirmation email
- Check Stripe Dashboard → **Payments** (make sure you're in Test mode)

---

## Environment-Specific Setup (Recommended)

### Best Practice: Use Different Keys for Different Environments

**Production Environment:**
- `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_live_...` (Production only)
- `STRIPE_SECRET_KEY` = `sk_live_...` (Production only)
- `STRIPE_WEBHOOK_SECRET` = Live webhook secret (Production only)
- `STRIPE_PRICE_*` = Live price IDs (Production only)

**Preview/Development Environments:**
- `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_test_...` (Preview, Development)
- `STRIPE_SECRET_KEY` = `sk_test_...` (Preview, Development)
- `STRIPE_WEBHOOK_SECRET` = Test webhook secret (Preview, Development)
- `STRIPE_PRICE_*` = Test price IDs (Preview, Development)

This way:
- ✅ Production always uses live keys
- ✅ Preview deployments automatically use test keys
- ✅ Local development uses test keys
- ✅ No manual switching needed!

---

## Quick Checklist

### Switching to Test Mode:
- [ ] Get test keys from Stripe Dashboard (Test mode)
- [ ] Update `VITE_STRIPE_PUBLISHABLE_KEY` in Vercel
- [ ] Update `STRIPE_SECRET_KEY` in Vercel
- [ ] Update `STRIPE_WEBHOOK_SECRET` in Vercel
- [ ] Update all `STRIPE_PRICE_*` variables
- [ ] Set scope to "Preview, Development" (or "All Environments")
- [ ] Redeploy
- [ ] Verify test mode badge appears on landing page
- [ ] Test a payment with test card `4242 4242 4242 4242`

### Switching to Live Mode:
- [ ] Get live keys from Stripe Dashboard (Live mode)
- [ ] Update `VITE_STRIPE_PUBLISHABLE_KEY` in Vercel
- [ ] Update `STRIPE_SECRET_KEY` in Vercel
- [ ] Update `STRIPE_WEBHOOK_SECRET` in Vercel
- [ ] Update all `STRIPE_PRICE_*` variables
- [ ] Set scope to "Production" only
- [ ] Redeploy
- [ ] Verify test mode badge disappears
- [ ] Test a payment with a real card (small amount!)

---

## Troubleshooting

**Test mode badge not showing?**
- Check that `VITE_STRIPE_PUBLISHABLE_KEY` starts with `pk_test_`
- Make sure you've redeployed after changing the variable
- Clear browser cache and hard refresh (Cmd+Shift+R)

**Payment not working in test mode?**
- Verify you're using test card numbers
- Check Stripe Dashboard is in Test mode
- Verify webhook secret matches your test webhook
- Check Vercel function logs for errors

**Can't switch back to live?**
- Make sure you have live keys from Stripe Dashboard (Live mode)
- Verify price IDs are correct for live mode
- Check that webhook secret matches your live webhook

---

## Current Status

To check what mode you're currently in:
1. Visit your app
2. Look for the yellow "Test Mode" badge on the landing page
3. If it's there → Test mode
4. If it's not there → Live mode (or keys not set)

---

**Need help?** Check your Vercel environment variables and make sure the keys match what's in your Stripe Dashboard!

