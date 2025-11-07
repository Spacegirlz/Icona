# How to Get Your Keys from Vercel for Local Development

## Quick Steps

### 1. Get Supabase Anon Key from Vercel

1. Go to: https://vercel.com/dashboard
2. Select your **ICONA** project
3. Go to **Settings** → **Environment Variables**
4. Find `VITE_SUPABASE_ANON_KEY`
5. Click the **eye icon** to reveal the value
6. Copy it

### 2. Get Stripe Publishable Key from Vercel

1. In the same **Environment Variables** page
2. Find `VITE_STRIPE_PUBLISHABLE_KEY`
3. Click the **eye icon** to reveal the value
4. Copy it (use the **test** key for local dev - starts with `pk_test_`)

### 3. Update Your .env File

Open `/Users/pietmarie/Icona/.env` and replace:
- `YOUR_SUPABASE_ANON_KEY_HERE` with the key from Vercel
- `YOUR_STRIPE_PUBLISHABLE_KEY_HERE` with the Stripe test key from Vercel

### 4. Restart Dev Server

After updating `.env`:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## Alternative: Get Keys Directly from Dashboards

### Supabase Anon Key
1. Go to: https://supabase.com/dashboard/project/welezbiiqwhvsftiypni
2. Click **Settings** → **API**
3. Copy the **"anon public"** key

### Stripe Test Key
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy the **"Publishable key"** (starts with `pk_test_`)

---

## After Adding Keys

Your `.env` file should look like:
```env
VITE_SUPABASE_URL=https://welezbiiqwhvsftiypni.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (your actual key)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... (your actual test key)
VITE_API_URL=/api
```

Then restart your dev server and it should work! 🚀

