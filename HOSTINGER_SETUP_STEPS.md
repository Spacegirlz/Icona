# Hostinger Domain Setup for useicona.com 🚀

## Step-by-Step Instructions

### Step 1: Get DNS Information from Vercel

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Click on your project (`icona-eta` or your project name)
   - Click **Settings** → **Domains**

2. **Add Your Domain:**
   - Click **"Add Domain"** button
   - Enter: `useicona.com`
   - Click **"Add"**
   - Also add: `www.useicona.com` (click Add again if needed)

3. **Choose Your Method:**
   
   **Option A: Use Vercel Nameservers (EASIEST - Recommended)**
   - Vercel will show you nameservers like:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ```
   - **Copy these nameservers** - you'll need them in Hostinger

   **Option B: Use DNS Records (If nameservers don't work)**
   - Vercel will show you DNS records to add
   - You'll need to add these in Hostinger's DNS Zone Editor

---

### Step 2: Update DNS in Hostinger

#### **Method A: Change Nameservers (EASIEST)**

1. **In Hostinger Dashboard:**
   - You're already on the Domain Overview page ✓
   - In the **Left Sidebar**, click **"DNS / Nameservers"**

2. **Change Nameservers:**
   - You'll see current nameservers: `ns1.dns-parking.com` and `ns2.dns-parking.com`
   - Click **"Edit"** or change to **"Custom Nameservers"**
   - Delete the current nameservers
   - Add the Vercel nameservers:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ```
   - Click **"Save"** or **"Update"**

3. **Wait for DNS Propagation:**
   - Usually takes 1-24 hours
   - Check status back in Vercel dashboard

#### **Method B: Add DNS Records (If you can't change nameservers)**

1. **In Hostinger:**
   - Click **"DNS / Nameservers"** in left sidebar
   - Look for **"DNS Zone Editor"** or **"Manage DNS Records"**
   - You'll see current DNS records

2. **Add A Record for Root Domain:**
   - **Type:** `A`
   - **Name/Host:** `@` (or leave blank)
   - **Value/IP:** `76.76.21.21` (Vercel's IP - check Vercel for current)
   - **TTL:** `3600` (or leave default)
   - Click **"Add Record"**

3. **Add CNAME Record for www:**
   - **Type:** `CNAME`
   - **Name/Host:** `www`
   - **Value:** `cname.vercel-dns.com`
   - **TTL:** `3600` (or leave default)
   - Click **"Add Record"**

---

### Step 3: Verify in Vercel

1. **Go back to Vercel:**
   - Go to **Settings** → **Domains**
   - You should see `useicona.com` listed
   - Status will show:
     - ⏳ "Pending" (waiting for DNS)
     - ✅ "Valid Configuration" (when DNS is propagated)

2. **Wait for DNS Propagation:**
   - Can take 1-24 hours (usually 1-4 hours)
   - You can check DNS propagation at: https://www.whatsmydns.net/
   - Enter: `useicona.com` and check A record

3. **SSL Certificate:**
   - Vercel automatically provisions SSL certificate
   - Once DNS is valid, SSL will be active
   - Your site will be available at: `https://useicona.com`

---

## Current Status Check

Based on your Hostinger dashboard:

✅ **Domain:** `useicona.com` is active  
✅ **Expiration:** 2026-11-05 (plenty of time)  
✅ **Auto-renewal:** Enabled (good!)  
⚠️ **Current Nameservers:** `ns1.dns-parking.com` and `ns2.dns-parking.com` (need to change)

---

## What to Do Right Now

### Quick Action Steps:

1. **First, in Vercel:**
   - Add `useicona.com` domain
   - Copy the nameservers or DNS records Vercel shows

2. **Then, in Hostinger:**
   - Click **"DNS / Nameservers"** in left sidebar
   - Change nameservers to Vercel's (easier) OR add DNS records
   - Save changes

3. **Wait:**
   - Check back in Vercel dashboard in a few hours
   - Status should change from "Pending" to "Valid Configuration"

---

## Troubleshooting

### If nameservers don't update:
- Wait up to 24 hours for DNS propagation
- Check nameservers are saved correctly in Hostinger
- Verify in Vercel that domain is added

### If DNS records method:
- Make sure you add both A record (@) and CNAME (www)
- Check that IP address is correct (Vercel may update this)
- Wait for DNS propagation

### Check DNS Status:
- Visit: https://www.whatsmydns.net/#A/useicona.com
- Should show Vercel's IP when propagated

---

## After DNS is Configured

Once Vercel shows "Valid Configuration":

1. ✅ Your site will be live at: `https://useicona.com`
2. ✅ SSL certificate will be active automatically
3. ✅ Both `useicona.com` and `www.useicona.com` will work
4. ✅ API endpoints will work at: `https://useicona.com/api/*`

---

**Need help?** Let me know what step you're on and I can guide you through it!

