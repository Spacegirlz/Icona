# How Test Mode Works - Automatic Switching Explained ✅

## The Good News: It's Already Set Up! 🎉

You **don't need to change anything in Vercel** - it's already configured to automatically use the right keys!

---

## How It Works

### 1. **Vercel Environment Variables (Already Set Up)**

You have **two sets of keys** with different scopes:

**Production Environment:**
- `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_live_...` (Production only)
- `STRIPE_SECRET_KEY` = `sk_live_...` (Production only)
- `STRIPE_WEBHOOK_SECRET` = Live webhook (Production only)

**Preview/Development Environment:**
- `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_test_...` (Preview, Development)
- `STRIPE_SECRET_KEY` = `sk_test_...` (Preview, Development)
- `STRIPE_WEBHOOK_SECRET` = Test webhook (Preview, Development)

### 2. **Automatic Behavior**

- ✅ **Production deployment** (`www.useicona.com`) → **Automatically uses live keys**
- ✅ **Preview deployments** (pull requests, branches) → **Automatically uses test keys**
- ✅ **Local development** (`localhost:5173`) → **Uses test keys** (if set in `.env`)

**You don't need to manually switch anything in Vercel!**

---

## What You DO Need to Do in Stripe Dashboard

### To See Test Payments:
1. Go to: https://dashboard.stripe.com
2. **Toggle to "Test mode"** (switch in top right)
3. Go to **Payments** → You'll see all test payments here

### To See Live Payments:
1. Go to: https://dashboard.stripe.com
2. **Toggle to "Live mode"** (switch in top right)
3. Go to **Payments** → You'll see all live payments here

**Important:** The Stripe Dashboard toggle is just for **viewing** payments. It doesn't affect which keys your app uses - that's automatic based on Vercel environment!

---

## Testing Scenarios

### Scenario 1: Test on Production Domain (Temporary)

If you want to test on `www.useicona.com` using test keys:

1. **Temporarily change Vercel variables:**
   - Go to Vercel → Settings → Environment Variables
   - Change `VITE_STRIPE_PUBLISHABLE_KEY` to `pk_test_...` (set to "Production")
   - Change `STRIPE_SECRET_KEY` to `sk_test_...` (set to "Production")
   - Redeploy

2. **Test the payment:**
   - Visit `www.useicona.com`
   - You should see "Test Mode" badge
   - Make a test payment with card `4242 4242 4242 4242`

3. **View in Stripe:**
   - Go to Stripe Dashboard
   - **Toggle to "Test mode"** (top right)
   - Go to Payments → See your test payment

4. **Switch back to live:**
   - Change keys back to `pk_live_...` and `sk_live_...`
   - Redeploy

### Scenario 2: Test on Preview Deployment (Recommended)

1. **Create a preview deployment:**
   - Push to a branch or create a pull request
   - Vercel automatically creates a preview URL

2. **Test the payment:**
   - Visit the preview URL (e.g., `icona-git-branch.vercel.app`)
   - It **automatically uses test keys** (because preview = Preview environment)
   - You should see "Test Mode" badge
   - Make a test payment

3. **View in Stripe:**
   - Go to Stripe Dashboard
   - **Toggle to "Test mode"**
   - Go to Payments → See your test payment

**No manual switching needed!** Preview deployments automatically use test keys.

---

## Quick Reference

| Environment | URL | Keys Used | Stripe Dashboard Mode |
|------------|-----|-----------|---------------------|
| **Production** | `www.useicona.com` | Live keys (`pk_live_...`) | **Live mode** |
| **Preview** | `icona-*.vercel.app` | Test keys (`pk_test_...`) | **Test mode** |
| **Local Dev** | `localhost:5173` | Test keys (from `.env`) | **Test mode** |

---

## Current Setup Status

✅ **Already configured correctly:**
- Production uses live keys automatically
- Preview uses test keys automatically
- Test mode badge shows automatically when using test keys

✅ **What you need to do:**
- **Nothing in Vercel** - it's automatic!
- **Just toggle Stripe Dashboard** to Test/Live mode to view the corresponding payments

---

## Summary

**Question:** Do I need to change something in Stripe to test?

**Answer:** 
- ❌ **No changes needed in Vercel** - it's automatic!
- ✅ **Yes, toggle Stripe Dashboard** to "Test mode" to **view** test payments
- ✅ **The app automatically uses test keys** on preview deployments
- ✅ **The app automatically uses live keys** on production

**The keys switch automatically based on environment. You just need to toggle Stripe Dashboard to see the right payments!**

---

## Testing Checklist

To test in test mode:

1. ✅ **Create a preview deployment** (or temporarily change production keys)
2. ✅ **Visit the preview URL** (or production if you changed keys)
3. ✅ **Verify "Test Mode" badge appears** on landing page
4. ✅ **Make a test payment** with card `4242 4242 4242 4242`
5. ✅ **Go to Stripe Dashboard**
6. ✅ **Toggle to "Test mode"** (top right)
7. ✅ **View your test payment** in Payments

That's it! 🎉

