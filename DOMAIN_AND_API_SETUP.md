# Domain & API Setup Guide 🚀

## Part 1: Connect Hostinger Domain to Vercel

### Step 1: Get Your Domain Information

1. Log in to your [Hostinger account](https://www.hostinger.com/)
2. Go to **Domains** → Select your domain
3. Note your domain name (e.g., `yourdomain.com` or `www.yourdomain.com`)

### Step 2: Configure DNS in Hostinger

You need to add DNS records to point your domain to Vercel.

#### Option A: Use Vercel's Nameservers (Recommended)

1. **In Vercel Dashboard:**
   - Go to your project: https://vercel.com/dashboard
   - Click **Settings** → **Domains**
   - Click **Add Domain**
   - Enter your domain (e.g., `yourdomain.com`)
   - Also add `www.yourdomain.com` if you want www
   - Vercel will show you nameservers (usually something like):
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ```

2. **In Hostinger:**
   - Go to **Domains** → Your domain
   - Click **DNS / Nameservers**
   - Change to **Custom Nameservers**
   - Enter the nameservers Vercel provided
   - Click **Save**

3. **Wait for DNS Propagation:**
   - Usually takes 1-24 hours
   - Can check status in Vercel dashboard

#### Option B: Use DNS Records (If you can't change nameservers)

1. **In Vercel Dashboard:**
   - Go to **Settings** → **Domains**
   - Click **Add Domain**
   - Enter your domain
   - Vercel will show you DNS records to add

2. **In Hostinger:**
   - Go to **Domains** → Your domain → **DNS Zone Editor**
   - Add these records:

   **For root domain (yourdomain.com):**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21 (Vercel's IP - check Vercel for current IP)
   TTL: 3600
   ```

   **For www subdomain:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

3. **Save and wait for propagation**

### Step 3: Verify Domain in Vercel

1. Go back to Vercel → **Settings** → **Domains**
2. You should see your domain listed
3. Status will show "Valid Configuration" when DNS is propagated
4. Vercel will automatically provision SSL certificate

---

## Part 2: Set Up Gemini API Key in Vercel

### Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click **Get API Key** (or use existing key)
4. Copy your API key (starts with something like `AIza...`)

### Step 2: Add API Key to Vercel

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Click on your project: `icona-eta` (or your project name)

2. **Navigate to Environment Variables:**
   - Click **Settings** (top menu)
   - Click **Environment Variables** (left sidebar)

3. **Add the Variable:**
   - Click **Add New**
   - **Key:** `GEMINI_API_KEY`
   - **Value:** Paste your Gemini API key (the one you copied)
   - **Environment:** Check all three:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
   - Click **Save**

4. **Redeploy Your App:**
   - Go to **Deployments** tab
   - Find your latest deployment
   - Click the **"..."** (three dots) menu
   - Click **Redeploy**
   - Confirm the redeploy

### Step 3: Verify API Key is Working

1. **Wait for redeploy to finish** (usually 1-2 minutes)
2. **Test the API:**
   - Visit your domain or Vercel URL
   - Open browser console (F12)
   - Try uploading an image
   - Check console for errors

3. **Check Vercel Logs:**
   - Go to **Deployments** → Latest deployment
   - Click on the deployment
   - Go to **Functions** tab
   - Click on any API function
   - Check **Logs** tab for any errors

---

## Troubleshooting

### Domain Issues

**Problem: Domain not resolving**
- Solution: Wait up to 24 hours for DNS propagation
- Check: Use [whatsmydns.net](https://www.whatsmydns.net/) to verify DNS propagation

**Problem: SSL certificate not working**
- Solution: Vercel auto-provisions SSL, wait a few minutes after domain is verified
- Check: Domain status in Vercel dashboard should show "Valid Configuration"

**Problem: www doesn't work**
- Solution: Add both `yourdomain.com` and `www.yourdomain.com` in Vercel domains
- Or set up redirect from www to non-www (or vice versa)

### API Key Issues

**Problem: API returns 500 error**
- Check: Is `GEMINI_API_KEY` set in Vercel?
- Check: Did you redeploy after adding the variable?
- Check: Vercel logs for specific error messages

**Problem: API returns 404**
- Check: Are API files in `/api/` directory?
- Check: Files should be named like `generate-image.ts` (not in subfolder)
- Check: Vercel build logs for errors

**Problem: "Server configuration error"**
- Cause: API key not found or invalid
- Solution: Double-check API key is correct and environment variable name matches exactly

---

## Quick Reference

### Vercel Dashboard Links:
- **Project Settings:** https://vercel.com/dashboard → Your Project → Settings
- **Environment Variables:** https://vercel.com/dashboard → Your Project → Settings → Environment Variables
- **Domains:** https://vercel.com/dashboard → Your Project → Settings → Domains
- **Deployments:** https://vercel.com/dashboard → Your Project → Deployments

### Hostinger Links:
- **Dashboard:** https://www.hostinger.com/cpanel
- **Domains:** https://www.hostinger.com/cpanel → Domains
- **DNS Settings:** https://www.hostinger.com/cpanel → Domains → Your Domain → DNS

### Google AI Studio:
- **Get API Key:** https://aistudio.google.com/apikey

---

## Step-by-Step Checklist

### Domain Setup:
- [ ] Logged into Hostinger
- [ ] Found DNS/Nameservers section
- [ ] Added domain in Vercel
- [ ] Updated nameservers OR added DNS records
- [ ] Waited for DNS propagation (check status)
- [ ] Domain shows "Valid Configuration" in Vercel
- [ ] SSL certificate is active (should be automatic)

### API Key Setup:
- [ ] Got Gemini API key from Google AI Studio
- [ ] Logged into Vercel dashboard
- [ ] Went to project Settings → Environment Variables
- [ ] Added `GEMINI_API_KEY` with correct value
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Saved the variable
- [ ] Redeployed the app
- [ ] Tested API endpoints work
- [ ] Checked Vercel logs for any errors

---

## Need Help?

If you encounter issues:
1. Check Vercel deployment logs for specific error messages
2. Verify DNS propagation at [whatsmydns.net](https://www.whatsmydns.net/)
3. Check Vercel function logs for API errors
4. Ensure API key is exactly `GEMINI_API_KEY` (case-sensitive)

**Once both are set up, your app will be fully functional!** 🎉

