# Set Up support@useicona.com - Step by Step Guide 📧

## Overview

We're going to verify your domain `useicona.com` in Resend, which will allow you to send emails FROM `support@useicona.com` (even though the email doesn't exist in Hostinger).

---

## Step 1: Add Domain to Resend

1. Go to: https://resend.com/domains
2. Click **"Add Domain"** button (top right)
3. Enter your domain: `useicona.com`
   - **Don't** include `www.` or `http://` - just `useicona.com`
4. Click **"Add"** or **"Continue"**

---

## Step 2: Get DNS Records from Resend

After adding the domain, Resend will show you DNS records to add. You'll see something like:

**Example (your actual values will be different):**
- **Type:** `TXT`
- **Name:** `@` or `useicona.com`
- **Value:** `v=spf1 include:resend.com ~all`

- **Type:** `TXT`
- **Name:** `_resend`
- **Value:** `resend-domain-verification=abc123...`

- **Type:** `CNAME`
- **Name:** `resend._domainkey`
- **Value:** `resend._domainkey.resend.com`

**Important:** Copy ALL the DNS records Resend shows you. You'll need to add each one.

---

## Step 3: Add DNS Records to Vercel

1. Go to: https://vercel.com
2. Click on your **ICONA** project
3. Go to **Settings** → **Domains**
4. Find `useicona.com` in the list
5. Click on it (or click **"DNS"** or **"Configure DNS"**)

**If DNS is managed in Vercel:**
- You'll see a section for DNS records
- Click **"Add Record"** for each record from Resend
- Add them one by one:
  - Select the **Type** (TXT, CNAME, etc.)
  - Enter the **Name** (exactly as Resend shows)
  - Enter the **Value** (exactly as Resend shows)
  - Click **"Save"**

**If DNS is managed elsewhere (like your domain registrar):**
- You'll need to add the records there instead
- Look for "DNS Management" or "DNS Records" in your registrar's dashboard

---

## Step 4: Wait for Verification

1. After adding all DNS records, go back to: https://resend.com/domains
2. You should see `useicona.com` with status "Pending" or "Verifying"
3. Wait 5-10 minutes (DNS can take time to propagate)
4. Refresh the page - it should change to **"Verified"** ✅

**Note:** If it's still pending after 15 minutes, double-check that you added all the records correctly.

---

## Step 5: Update Vercel Environment Variables

Once the domain is verified:

1. Go to: https://vercel.com → Your ICONA project → Settings → Environment Variables
2. Find `RESEND_FROM_EMAIL`
3. Click the **"⋯"** (three dots) → **"Edit"**
4. Change the value from `piet@pietmarie.com` to `support@useicona.com`
5. Click **"Save"**
6. Do this for **Production**, **Preview**, and **Development** environments

---

## Step 6: Redeploy

1. Go to Vercel → Deployments
2. Click **"Redeploy"** on the latest deployment
3. Wait 2-3 minutes

---

## ✅ Done!

Now emails will be sent FROM `support@useicona.com` - professional and branded!

---

## Troubleshooting

**Domain not verifying?**
- Double-check all DNS records are added correctly
- Make sure the **Name** and **Value** match exactly (no extra spaces)
- Wait 15-20 minutes for DNS propagation
- Check Resend dashboard for any error messages

**Can't find DNS settings in Vercel?**
- Your DNS might be managed at your domain registrar
- Check where you bought the domain (GoDaddy, Namecheap, etc.)
- Add DNS records there instead

**Need help?** Let me know where you're stuck!

