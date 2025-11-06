# Stripe Integration Setup Guide 🔒

## Security: Secret Keys Stay Server-Side Only

### ✅ **CORRECT (Server-Side = Vercel Functions):**
- `sk_live_...` → Used ONLY in `/api/*.ts` files (Vercel serverless functions)
- `whsec_...` → Used ONLY in `/api/stripe-webhook.ts` (webhook verification)

### ✅ **CORRECT (Client-Side = React App):**
- `pk_live_...` → Used in React app (safe to expose in browser)

### ❌ **NEVER DO THIS:**
- Never put `sk_live_...` in React components
- Never put `sk_live_...` in client-side JavaScript
- Never commit `sk_live_...` to git

---

## Environment Variables Setup

### Vercel (Production):

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these:

```
STRIPE_SECRET_KEY=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
STRIPE_PUBLISHABLE_KEY=pk_live_51SQOte80NMSveITupc5l15wcO9b9kCpcrtsmKoe9BwXy7iqHUBYk6dPfuumk6aLI328AX5sKYwCt7AQLUfh4SmRI00Ld6DqVs9
STRIPE_WEBHOOK_SECRET=whsec_yzOeI5JCu3A309sl7AdE4uRiMmyYOqW7
```

**After adding, click "Redeploy" to apply changes.**

---

### Local Development (.env.local):

Create `.env.local` in project root:

```bash
# Stripe (use TEST keys for local dev)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (from test webhook)

# Vite environment variables (client-side)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=/api
```

**Note:** `.env.local` is in `.gitignore` - never commit secrets!

---

## Stripe Products Setup

### Create Products in Stripe Dashboard:

1. Go to: **Stripe Dashboard → Products → Create product**

2. Create 4 products:

**Starter Pack:**
- Name: "ICONA Starter Pack"
- Description: "5 image transformations"
- Price: $1.99 (one-time)
- Metadata: `credits: 5`

**Popular Pack:**
- Name: "ICONA Popular Pack"
- Description: "15 image transformations"
- Price: $4.99 (one-time)
- Metadata: `credits: 15`

**Pro Pack:**
- Name: "ICONA Pro Pack"
- Description: "40 image transformations"
- Price: $9.99 (one-time)
- Metadata: `credits: 40`

**Mega Pack:**
- Name: "ICONA Mega Pack"
- Description: "100 image transformations"
- Price: $19.99 (one-time)
- Metadata: `credits: 100`

3. **Copy the Price IDs** (price_xxx) and add to Vercel:

```
STRIPE_PRICE_STARTER=price_xxx
STRIPE_PRICE_POPULAR=price_xxx
STRIPE_PRICE_PRO=price_xxx
STRIPE_PRICE_MEGA=price_xxx
```

---

## Webhook Setup

### Already Done ✅:
- Webhook URL: `https://icona-eta.vercel.app/api/stripe-webhook`
- Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
- Webhook Secret: `whsec_yzOeI5JCu3A309sl7AdE4uRiMmyYOqW7`

### Test Webhook:
1. Go to: **Stripe Dashboard → Webhooks → Your webhook**
2. Click **"Send test event"**
3. Select `checkout.session.completed`
4. Check Vercel logs to see if webhook received

---

## Invoice Customization

### Customize "From" Details:

1. Go to: **Stripe Dashboard → Settings → Branding**
   - Upload logo
   - Set colors
   - Customize email theme

2. Go to: **Stripe Dashboard → Settings → Public details**
   - Business name: "ICONA"
   - Support email: your email
   - Support phone: (optional)
   - Website: https://icona-eta.vercel.app

3. Go to: **Stripe Dashboard → Settings → Invoicing**
   - Invoice template: Customize "From" address
   - Footer: Add terms/contact info
   - Default memo: "ICONA Image Transformations"

4. Go to: **Stripe Dashboard → Settings → Payment methods**
   - Statement descriptor: "ICONA" (12-22 characters)

---

## Testing

### Test Mode:
1. Use test keys (`sk_test_...`, `pk_test_...`)
2. Use test card: `4242 4242 4242 4242`
3. Any future expiry date, any CVC
4. Test webhook endpoint

### Production:
1. Use live keys (`sk_live_...`, `pk_live_...`)
2. Real payments
3. Production webhook endpoint

---

## Files Created:

✅ `/api/create-checkout-session.ts` - Server-side (uses `sk_live_...`)
✅ `/api/stripe-webhook.ts` - Server-side (uses `whsec_...`)
✅ `/services/stripeService.ts` - Client-side (uses `pk_live_...`)

---

## Next Steps:

1. ✅ Add environment variables to Vercel
2. ✅ Create products in Stripe Dashboard
3. ✅ Add price IDs to Vercel environment variables
4. ⏳ Create credit system UI components
5. ⏳ Integrate credit check before image generation
6. ⏳ Set up Supabase for user credits (optional, can use simple storage for now)

---

**Remember: Secret keys (`sk_live_...`) are ONLY in Vercel serverless functions, never in client code!** 🔒

