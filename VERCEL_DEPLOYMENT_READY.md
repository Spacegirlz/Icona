# Vercel Deployment - Ready to Deploy! ✅

## Configuration Status

### ✅ Vercel Configuration (`vercel.json`)
- Framework: **Vite** (explicitly set)
- Build Command: `npm run build`
- Output Directory: `dist`
- SPA Routing: Configured (all routes → index.html)
- API Routes: Auto-detected from `/api` folder

### ✅ Project Structure
- Vite config: `vite.config.ts` ✅
- Package.json: Has build scripts ✅
- API functions: In `/api` folder (Vercel auto-detects) ✅
- TypeScript: Configured ✅

---

## What Vercel Will Do Automatically

1. **Detect Vite Project** ✅
   - Framework: `vite` (explicitly set in vercel.json)
   - Build command: `npm run build`
   - Output: `dist` folder

2. **Deploy API Routes** ✅
   - All files in `/api` folder become serverless functions
   - No additional configuration needed

3. **Handle SPA Routing** ✅
   - All routes redirect to `index.html` (configured in vercel.json)

---

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Add email/password auth and premium UI improvements"
git push origin main
```

### 2. Connect to Vercel (if not already)
1. Go to: https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect:
   - **Framework Preset:** Vite ✅
   - **Build Command:** `npm run build` ✅
   - **Output Directory:** `dist` ✅
   - **Install Command:** `npm install` ✅

### 3. Set Environment Variables in Vercel
Go to: Project Settings → Environment Variables

**Add these variables:**

```
VITE_SUPABASE_URL=https://welezbiiqwhvsftiypni.supabase.co
VITE_SUPABASE_ANON_KEY=(your anon key)
SUPABASE_SERVICE_ROLE_KEY=(your service role key - SECRET!)
STRIPE_SECRET_KEY=(your Stripe secret key - SECRET!)
STRIPE_WEBHOOK_SECRET=(your webhook secret - SECRET!)
VITE_STRIPE_PUBLISHABLE_KEY=(your publishable key)
STRIPE_PRICE_STARTER=(price ID)
STRIPE_PRICE_POPULAR=(price ID)
STRIPE_PRICE_PRO=(price ID)
STRIPE_PRICE_MEGA=(price ID)
RESEND_API_KEY=(your Resend API key - SECRET!)
RESEND_FROM_EMAIL=support@useicona.com
VITE_API_URL=/api
```

**Important:** 
- Set these for **Production**, **Preview**, and **Development** environments
- Secret keys (service_role, Stripe secrets, Resend) are server-side only

### 4. Deploy
- Vercel will automatically deploy when you push to `main`
- Or click "Deploy" in Vercel dashboard

---

## What Gets Deployed

### Frontend (Vite Build)
- React app → `dist/index.html` + assets
- All components, services, utilities
- Client-side code only

### Backend (Serverless Functions)
- `/api/*.ts` files → Vercel serverless functions
- All API endpoints:
  - `create-checkout-session.ts`
  - `stripe-webhook.ts`
  - `verify-payment.ts`
  - `send-email.ts`
  - `add-credits.ts`
  - `generate-image.ts`
  - `generate-caption.ts`
  - `generate-prompt.ts`
  - `refinement-suggestions.ts`
  - `usage-tracking.ts`

---

## Post-Deployment Checklist

### ✅ Verify
1. **Homepage loads** → Check https://useicona.com
2. **Auth works** → Test Google OAuth and Email signup
3. **API endpoints** → Test `/api/verify-payment` (should return JSON)
4. **Stripe webhook** → Configure webhook URL in Stripe dashboard
5. **Email sending** → Test signup (should receive welcome email)

### 🔧 Stripe Webhook Configuration
1. Go to: Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://useicona.com/api/stripe-webhook`
3. Select events: `checkout.session.completed`
4. Copy webhook secret → Add to Vercel env vars as `STRIPE_WEBHOOK_SECRET`

---

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify all dependencies in `package.json`
- Ensure TypeScript compiles without errors

### API Routes Not Working
- Check function logs in Vercel dashboard
- Verify environment variables are set
- Check CORS headers in `vercel.json`

### SPA Routing Issues
- Verify rewrite rule in `vercel.json` (should redirect all to index.html)
- Check that `dist/index.html` exists after build

---

## Current Configuration Summary

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**✅ Ready to deploy!**

