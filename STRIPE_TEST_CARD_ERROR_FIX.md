# Fix: "Your card was declined. Your request was in live mode, but used a known test card"

## The Problem

You're seeing this error because:
- ✅ Your **Stripe Dashboard** is in **Test mode** (correct for testing)
- ❌ But your **production app** (`www.useicona.com`) is using **live keys**
- ❌ You're trying to use a **test card** (`4242 4242 4242 4242`) with **live keys**

**Test cards only work with test keys!**

---

## Solution Options

### Option 1: Test on Preview Deployment (Recommended) ✅

Preview deployments automatically use test keys:

1. **Create a preview deployment:**
   - Push to a branch or create a pull request
   - Vercel automatically creates a preview URL (e.g., `icona-git-branch.vercel.app`)

2. **Test on preview URL:**
   - Visit the preview URL
   - You should see "Test Mode" badge
   - Use test card `4242 4242 4242 4242`
   - Payment will work!

3. **View in Stripe:**
   - Go to Stripe Dashboard
   - Toggle to **"Test mode"** (top right)
   - Go to Payments → See your test payment

**No changes needed in Vercel!** Preview deployments automatically use test keys.

---

### Option 2: Temporarily Switch Production to Test Keys

If you need to test on `www.useicona.com`:

1. **Go to Vercel Dashboard:**
   - Settings → Environment Variables

2. **Temporarily change Production keys:**
   - `VITE_STRIPE_PUBLISHABLE_KEY` → Change to `pk_test_...` (set scope to "Production")
   - `STRIPE_SECRET_KEY` → Change to `sk_test_...` (set scope to "Production")
   - `STRIPE_WEBHOOK_SECRET` → Change to test webhook secret (set scope to "Production")

3. **Redeploy:**
   - Go to Deployments → Click "Redeploy"

4. **Test:**
   - Visit `www.useicona.com`
   - Should see "Test Mode" badge
   - Use test card `4242 4242 4242 4242`
   - Payment will work!

5. **Switch back to live keys:**
   - Change keys back to `pk_live_...` and `sk_live_...`
   - Redeploy

**⚠️ Warning:** Don't leave production on test keys! Switch back immediately after testing.

---

### Option 3: Use a Real Card (Small Amount) on Production

If you want to test on production with live keys:

1. **Use a real credit card** (not a test card)
2. **Test with a small amount** (e.g., $1.99 Starter Pack)
3. **Verify payment works**
4. **Refund if needed** (in Stripe Dashboard → Payments → Refund)

**⚠️ Warning:** This will charge your real card! Only do this if you're okay with a small charge.

---

## Quick Reference

| Environment | URL | Keys | Test Card Works? |
|------------|-----|------|-----------------|
| **Production** | `www.useicona.com` | Live keys (`pk_live_...`) | ❌ No - use real card |
| **Preview** | `icona-*.vercel.app` | Test keys (`pk_test_...`) | ✅ Yes - use `4242 4242 4242 4242` |
| **Local Dev** | `localhost:5173` | Test keys (from `.env`) | ✅ Yes - use `4242 4242 4242 4242` |

---

## Recommended Workflow

**For Testing:**
1. ✅ Use **preview deployments** (automatic test keys)
2. ✅ Use test card `4242 4242 4242 4242`
3. ✅ View in Stripe Dashboard (Test mode)

**For Production:**
1. ✅ Use **production deployment** (automatic live keys)
2. ✅ Use **real credit cards** only
3. ✅ View in Stripe Dashboard (Live mode)

---

## Summary

**The error happens because:**
- Production = Live keys
- Test cards only work with test keys
- Solution: Test on preview deployment (uses test keys automatically) OR temporarily switch production to test keys

**Best practice:** Always test on preview deployments, never on production!

