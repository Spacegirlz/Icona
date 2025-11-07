# Local Development Setup - localhost:5173 ✅

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create `.env` File

Create a `.env` file in the root directory with these variables:

```env
# Supabase (Required for authentication)
VITE_SUPABASE_URL=https://welezbiiqwhvsftiypni.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Stripe (Required for payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key_here

# API
VITE_API_URL=/api
```

**Where to get the keys:**
- **Supabase URL & Anon Key:** https://supabase.com/dashboard/project/welezbiiqwhvsftiypni → Settings → API
- **Stripe Publishable Key:** https://dashboard.stripe.com/test/apikeys (use test keys for local dev)

### 3. Start Development Server
```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

---

## Port Configuration

✅ **Vite is configured to use port 5173** (see `vite.config.ts`)

The dev server will:
- Start on `http://localhost:5173`
- Be accessible on your local network at `http://0.0.0.0:5173`
- Automatically reload when you make changes

---

## Supabase Redirect URLs

For Google OAuth to work locally, make sure Supabase has `localhost:5173` in the redirect URLs:

1. Go to: https://supabase.com/dashboard/project/welezbiiqwhvsftiypni
2. Click **Authentication** → **URL Configuration**
3. In **Redirect URLs**, make sure you have:
   ```
   http://localhost:5173
   http://localhost:5173/
   ```
4. **Site URL** should be: `https://useicona.com` (production domain)

---

## Testing Locally

### Authentication
- ✅ Sign in with Google → Should redirect back to `localhost:5173`
- ✅ Sign in with Email/Password → Should work
- ✅ Sign up → Should create account and send welcome email

### Payments
- ⚠️ **Note:** Stripe checkout will redirect to production domain after payment
- Use Stripe test mode keys for local testing
- Test card: `4242 4242 4242 4242`

### API Routes
- ⚠️ **Note:** `/api/*` routes are Vercel serverless functions
- They won't work locally unless you use `vercel dev`
- For full local testing, install Vercel CLI:
  ```bash
  npm install -g vercel
  vercel dev
  ```

---

## Troubleshooting

### Port 5173 Already in Use
If port 5173 is taken, Vite will automatically try the next available port (5174, 5175, etc.)

To force port 5173, kill the process using it:
```bash
# Mac/Linux
lsof -ti:5173 | xargs kill -9

# Or change port in vite.config.ts
```

### Supabase Not Working
1. Check `.env` file has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. Check browser console for errors
3. Verify Supabase redirect URLs include `http://localhost:5173`

### CORS Errors
- API routes won't work locally (they're Vercel serverless functions)
- This is expected - they'll work in production

---

## Environment Variables Reference

### Client-Side (must start with `VITE_`)
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (test or live)
- `VITE_API_URL` - API base URL (usually `/api`)

### Server-Side (not needed locally, only in Vercel)
- `SUPABASE_SERVICE_ROLE_KEY` - Only used in serverless functions
- `STRIPE_SECRET_KEY` - Only used in serverless functions
- `STRIPE_WEBHOOK_SECRET` - Only used in serverless functions
- `RESEND_API_KEY` - Only used in serverless functions

---

## File Structure

```
Icona/
├── .env                 # Local environment variables (create this)
├── .gitignore          # .env is ignored (never commit secrets!)
├── vite.config.ts      # Vite config (port 5173)
├── package.json        # Dependencies and scripts
└── ...
```

---

## Summary

✅ **Port 5173 is configured** in `vite.config.ts`  
✅ **Redirect URLs** use `window.location.origin` (works automatically)  
✅ **Create `.env` file** with Supabase and Stripe keys  
✅ **Run `npm run dev`** to start local server  

**Your app will be at: http://localhost:5173** 🚀

