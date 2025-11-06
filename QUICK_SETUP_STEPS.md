# Quick Setup Steps - Copy & Paste Guide 📋

## 🎯 Task 1: Connect Hostinger Domain

### In Vercel (5 minutes):

1. **Go to:** https://vercel.com/dashboard
2. **Click:** Your project (`icona-eta`)
3. **Click:** Settings → Domains
4. **Click:** "Add Domain"
5. **Enter:** Your domain (e.g., `yourdomain.com`)
6. **Also add:** `www.yourdomain.com` (if you want www)
7. **Copy the nameservers** Vercel shows you (or DNS records)

### In Hostinger (5 minutes):

**Option A - Nameservers (Easiest):**
1. **Go to:** https://www.hostinger.com/cpanel
2. **Click:** Domains → Your domain
3. **Click:** DNS / Nameservers
4. **Change to:** Custom Nameservers
5. **Paste:** The nameservers from Vercel
6. **Save**

**Option B - DNS Records (If nameservers not available):**
1. **Go to:** DNS Zone Editor
2. **Add A Record:**
   - Type: `A`
   - Name: `@`
   - Value: `76.76.21.21` (or IP Vercel shows)
3. **Add CNAME Record:**
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`

### Wait:
- DNS propagation: 1-24 hours
- Check status in Vercel dashboard

---

## 🔑 Task 2: Add Gemini API Key

### Get API Key (2 minutes):

1. **Go to:** https://aistudio.google.com/apikey
2. **Click:** "Get API Key" or "Create API Key"
3. **Copy** the key (starts with `AIza...`)

### Add to Vercel (3 minutes):

1. **Go to:** https://vercel.com/dashboard
2. **Click:** Your project → **Settings** → **Environment Variables**
3. **Click:** "Add New"
4. **Fill in:**
   - **Key:** `GEMINI_API_KEY`
   - **Value:** Paste your API key
   - **Environment:** ✅ Production ✅ Preview ✅ Development
5. **Click:** Save
6. **Redeploy:**
   - Go to **Deployments** tab
   - Click **"..."** on latest deployment
   - Click **Redeploy**

### Test (1 minute):

1. Visit your site
2. Try uploading an image
3. Check browser console (F12) for errors

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Domain shows "Valid Configuration" in Vercel
- [ ] Can access your site at your custom domain
- [ ] SSL certificate is active (https:// works)
- [ ] `GEMINI_API_KEY` is in Vercel environment variables
- [ ] App has been redeployed after adding API key
- [ ] Image generation works (test upload an image)

---

## 🆘 Quick Troubleshooting

**Domain not working?**
→ Wait longer for DNS (check at whatsmydns.net)

**API not working?**
→ Check API key is set and app is redeployed

**Need help?**
→ Check Vercel logs: Deployments → Latest → Functions → Logs

---

**Total Time: ~15 minutes** ⏱️

