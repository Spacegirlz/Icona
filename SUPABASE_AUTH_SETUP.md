# Supabase + Google Auth + SendGrid Setup Guide 🔐

## For Non-Technical Users - Step by Step

Hi! This guide will walk you through setting up user accounts and login. Don't worry - I'll explain everything in simple terms.

---

## What We're Setting Up

1. **Supabase** = Your database (where user accounts and credits are stored)
2. **Google Login** = Users can sign in with their Google account
3. **SendGrid** = Sends emails to users (welcome emails, payment confirmations)

---

## PART 1: Set Up Supabase Database

### Step 1.1: You Already Did This! ✅

You already created your Supabase project:
- **Your Supabase URL:** `https://welezbiiqwhvsftiypni.supabase.co`
- **Your Anon Key:** (you have this - it's the public one)

Great job! Now we need to create the tables (think of them as spreadsheets) to store user information.

---

### Step 1.2: Create the User Profiles Table

**What this does:** Creates a place to store each user's email and credit balance.

**How to do it:**

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/welezbiiqwhvsftiypni
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New Query"** button (top right)
4. Copy and paste this EXACT code:

```sql
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  credits INTEGER DEFAULT 0,
  free_credits_used INTEGER DEFAULT 0,
  last_free_credit_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

5. Click the **"Run"** button (or press Ctrl+Enter / Cmd+Enter)
6. You should see: ✅ "Success. No rows returned"

**If you see an error:** Make sure you copied the code exactly, including all the semicolons (;)

---

### Step 1.3: Create the Transactions Table

**What this does:** Keeps track of when users buy credits (for your records).

**How to do it:**

1. Still in SQL Editor, click **"New Query"** again (or clear the previous one)
2. Copy and paste this EXACT code:

```sql
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  stripe_payment_id TEXT UNIQUE,
  credits INTEGER NOT NULL,
  amount_paid INTEGER,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

3. Click **"Run"**
4. You should see: ✅ "Success. No rows returned"

---

### Step 1.4: Create the Usage Logs Table

**What this does:** Tracks how users spend their credits (for analytics).

**How to do it:**

1. Click **"New Query"** again
2. Copy and paste this EXACT code:

```sql
CREATE TABLE public.usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  credits_used INTEGER DEFAULT 1,
  estimated_cost DECIMAL(10, 6),
  created_at TIMESTAMP DEFAULT NOW()
);
```

3. Click **"Run"**
4. You should see: ✅ "Success. No rows returned"

---

### Step 1.5: Turn On Security (Row Level Security)

**What this does:** Makes sure users can only see their own data (privacy protection).

**How to do it:**

1. Click **"New Query"** again
2. Copy and paste this EXACT code:

```sql
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;
```

3. Click **"Run"**
4. You should see: ✅ "Success. No rows returned"

---

### Step 1.6: Set Up Security Rules (Policies)

**What this does:** Creates rules that say "users can only see their own stuff"

**How to do it:**

1. Click **"New Query"** again
2. Copy and paste this EXACT code (all 4 policies together):

```sql
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own usage logs" ON public.usage_logs
  FOR SELECT USING (auth.uid() = user_id);
```

3. Click **"Run"**
4. You should see: ✅ "Success. No rows returned"

**🎉 Congratulations! Your database is set up!**

---

### Step 1.7: Get Your Service Role Key (Secret Key)

**What this is:** A secret key that only your server can use (never show this to users).

**How to do it:**

1. In Supabase Dashboard, click **"Settings"** (gear icon in left sidebar)
2. Click **"API"** in the settings menu
3. Scroll down to find **"service_role"** key
4. Click the **eye icon** to reveal it (or click "Reveal")
5. **Copy this key** - you'll need it for Vercel (keep it secret!)

**Important:** This is different from the "anon" key. The service_role key has admin powers, so keep it secret!

---

## PART 2: Set Up Google Login

### Step 2.1: Create Google OAuth Credentials

**What this does:** Lets users sign in with their Google account.

**How to do it:**

1. Go to: https://console.cloud.google.com
2. Sign in with your Google account
3. Click the project dropdown at the top (or create a new project)
   - If creating new: Click "New Project" → Name it "ICONA" → Click "Create"
4. Once in your project, click **"APIs & Services"** in the left menu
5. Click **"Credentials"** in the submenu
6. Click **"+ CREATE CREDENTIALS"** button at the top
7. Select **"OAuth client ID"**
8. If asked, configure the OAuth consent screen first:
   - User Type: **External** → Click "Create"
   - App name: **ICONA**
   - User support email: **Your email**
   - Developer contact: **Your email**
   - Click "Save and Continue" through the rest (you can skip optional steps)
9. Back at Credentials, click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
10. Fill in:
    - **Application type:** Web application
    - **Name:** ICONA
    - **Authorized JavaScript origins:** Click "ADD URI" and add these one by one:
      - `http://localhost:5173`
      - `https://icona-eta.vercel.app`
      - `https://www.useicona.com` (if you have a custom domain)
    - **Authorized redirect URIs:** Click "ADD URI" and add:
      - `https://welezbiiqwhvsftiypni.supabase.co/auth/v1/callback`
      - (Use YOUR Supabase URL - replace `welezbiiqwhvsftiypni` with your project ID if different)
11. Click **"Create"**
12. **Copy these two things:**
    - **Client ID:** (looks like: `123456789-abc.apps.googleusercontent.com`)
    - **Client Secret:** (click "Show" to reveal it)

**Save these somewhere safe - you'll need them next!**

---

### Step 2.2: Add Google Login to Supabase

**What this does:** Connects Google to your Supabase project so users can sign in.

**How to do it:**

1. Go back to your Supabase Dashboard: https://supabase.com/dashboard/project/welezbiiqwhvsftiypni
2. Click **"Authentication"** in the left sidebar
3. Click **"Providers"** in the submenu
4. Find **"Google"** in the list
5. Toggle it **ON** (switch to enabled)
6. Fill in:
   - **Client ID (for OAuth):** Paste your Google Client ID
   - **Client Secret (for OAuth):** Paste your Google Client Secret
7. Click **"Save"**

**🎉 Google login is now set up!**

---

## PART 3: Set Up SendGrid (Email Service)

### Step 3.1: Create SendGrid Account

**What this does:** Lets you send emails to users (welcome emails, payment confirmations).

**How to do it:**

1. Go to: https://sendgrid.com
2. Click **"Start for free"** or **"Sign Up"**
3. Fill in your details:
   - Email address
   - Password
   - Company name: **ICONA**
4. Verify your email (check your inbox)
5. Complete the setup wizard (you can skip optional steps)

**Free tier:** 100 emails per day (perfect for starting out!)

---

### Step 3.2: Create SendGrid API Key

**What this is:** A secret key that lets your app send emails.

**How to do it:**

1. In SendGrid Dashboard, click **"Settings"** (gear icon)
2. Click **"API Keys"** in the menu
3. Click **"Create API Key"** button
4. Fill in:
   - **API Key Name:** ICONA Production
   - **API Key Permissions:** Select **"Full Access"** (or "Mail Send" if you want to be more restrictive)
5. Click **"Create & View"**
6. **Copy the API key immediately** - it starts with `SG.` and you can only see it once!
   - Example: `SG.abc123xyz...`
   - **Save this somewhere safe!**

**⚠️ Important:** If you lose this key, you'll need to create a new one.

---

### Step 3.3: Verify Your Sender Email

**What this does:** Tells SendGrid which email address to send FROM.

**How to do it:**

1. In SendGrid Dashboard, click **"Settings"** → **"Sender Authentication"**
2. Click **"Verify a Single Sender"**
3. Fill in:
   - **From Email Address:** Your business email (e.g., `hello@useicona.com`)
   - **From Name:** ICONA
   - **Reply To:** Same as From Email
   - **Company Address:** Your business address
   - **Website URL:** `https://icona-eta.vercel.app`
4. Click **"Create"**
5. Check your email inbox for a verification email from SendGrid
6. Click the verification link in the email

**🎉 SendGrid is now set up!**

---

## PART 4: Add Everything to Vercel

**What this does:** Connects all the services to your live website.

**How to do it:**

1. Go to: https://vercel.com
2. Sign in and go to your **ICONA** project
3. Click **"Settings"** in the top menu
4. Click **"Environment Variables"** in the left sidebar

### Add These Variables (Production):

Click **"Add New"** for each one:

1. **Variable Name:** `VITE_SUPABASE_URL`
   - **Value:** `https://welezbiiqwhvsftiypni.supabase.co`
   - **Environment:** Check ✅ **Production** only

2. **Variable Name:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** (Your anon/public key from Supabase)
   - **Environment:** Check ✅ **Production** only

3. **Variable Name:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** (Your service_role key from Supabase - the SECRET one)
   - **Environment:** Check ✅ **Production** only
   - **⚠️ Important:** This is secret - never share it!

4. **Variable Name:** `SENDGRID_API_KEY`
   - **Value:** (Your SendGrid API key - starts with `SG.`)
   - **Environment:** Check ✅ **Production** only
   - **⚠️ Important:** This is secret - never share it!

5. **Variable Name:** `SENDGRID_FROM_EMAIL`
   - **Value:** (The email you verified in SendGrid, e.g., `hello@useicona.com`)
   - **Environment:** Check ✅ **Production** only

### Add Same Variables for Preview/Development:

Repeat the same 5 variables above, but this time:
- Check ✅ **Preview** and ✅ **Development** instead of Production
- Use the same values (or you can use test keys if you want)

---

## PART 5: Redeploy Your Site

**What this does:** Makes all the new settings go live.

**How to do it:**

1. Still in Vercel, go to **"Deployments"** tab
2. Find your latest deployment
3. Click the **"⋯"** (three dots) menu
4. Click **"Redeploy"**
5. Wait 2-3 minutes for it to finish

**🎉 You're done!**

---

## Testing Checklist

Once everything is deployed, test it:

- [ ] Visit your site: https://icona-eta.vercel.app
- [ ] Click "Sign in with Google" button
- [ ] Complete Google sign-in
- [ ] Check if you see your credit balance (should show 1 free credit)
- [ ] Try uploading an image and generating (should deduct 1 credit)
- [ ] Check if credits update correctly

---

## Need Help?

**Common Issues:**

1. **"Supabase credentials not configured"**
   - Check that you added all 3 Supabase variables to Vercel
   - Make sure you redeployed after adding them

2. **"Google sign-in not working"**
   - Check that you added the correct redirect URI in Google Cloud Console
   - Make sure Google provider is enabled in Supabase

3. **"Can't send emails"**
   - Check that SendGrid API key is correct in Vercel
   - Make sure you verified your sender email in SendGrid

---

**You've got this! Take it one step at a time. 🚀**
