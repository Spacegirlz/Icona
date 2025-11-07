# Resend Quick Setup with piet@pietmarie.com ✅

## Step 1: Verify Email in Resend

1. Go to: https://resend.com/emails
2. Click **"Verify Email"** or **"Add Email"**
3. Enter: `piet@pietmarie.com`
4. Check your email inbox (piet@pietmarie.com)
5. Click the verification link in the email from Resend

---

## Step 2: Get Your Full API Key

1. Go to: https://resend.com/api-keys
2. Find your API key (or create a new one)
3. Click **"Show"** or **"Reveal"** to see the full key
4. Copy the **entire** key (should start with `re_` and be 32+ characters)
   - Example: `re_1234567890abcdefghijklmnopqrstuvwxyz`

**Important:** Your current key `.Ea_87x2mVj8ZzK` looks incomplete - get the full one!

---

## Step 3: Add to Vercel Environment Variables

1. Go to: https://vercel.com → Your ICONA project → Settings → Environment Variables

2. Add these variables for **Production**:

   **Variable 1:**
   - Name: `RESEND_API_KEY`
   - Value: (your full API key from Step 2 - starts with `re_`)
   - Environment: ✅ **Production** only

   **Variable 2:**
   - Name: `RESEND_FROM_EMAIL`
   - Value: `piet@pietmarie.com`
   - Environment: ✅ **Production** only

3. Add the same 2 variables for **Preview** and **Development**:
   - Same names and values
   - Check ✅ **Preview** and ✅ **Development**

---

## Step 4: Redeploy

1. Go to Vercel → Deployments
2. Click **"Redeploy"** on the latest deployment
3. Wait 2-3 minutes

---

## ✅ Done!

Your email service is now set up. Emails will be sent FROM `piet@pietmarie.com`.

**Later:** You can switch to `support@useicona.com` by:
1. Verifying the domain in Resend
2. Adding DNS records
3. Changing `RESEND_FROM_EMAIL` in Vercel

---

## Security Note

Your credentials are saved in `CREDENTIALS.md` which is protected from Git (in .gitignore). Keep this file secure!

