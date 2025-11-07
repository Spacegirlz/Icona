# Fix: OAuth Redirect Loop on Preview Deployments

## Problem

When signing in with Google on a preview deployment:
- ✅ Goes to Google auth successfully
- ❌ Redirects back to sign-in page (loop)
- ❌ Doesn't complete login

## Root Cause

The preview URL (`https://icona-a70m7wbos-piet-maries-projects.vercel.app/`) is not in Supabase's allowed redirect URLs.

---

## Solution: Add Preview URL Pattern to Supabase

### Step 1: Go to Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/welezbiiqwhvsftiypni
2. Click **Authentication** in the left sidebar
3. Click **URL Configuration**

### Step 2: Check Redirect URLs

In the **Redirect URLs** section, make sure you have:

```
http://localhost:5173
http://localhost:5173/
https://useicona.com
https://useicona.com/
https://www.useicona.com
https://www.useicona.com/
https://*.vercel.app/*
```

**Important:** The wildcard `https://*.vercel.app/*` should cover ALL preview deployments, including:
- `https://icona-a70m7wbos-piet-maries-projects.vercel.app`
- `https://icona-git-branch-piet-maries-projects.vercel.app`
- Any other preview URL

### Step 3: If Wildcard Doesn't Work

If the wildcard `https://*.vercel.app/*` isn't working, add your specific preview URL:

```
https://icona-a70m7wbos-piet-maries-projects.vercel.app
https://icona-a70m7wbos-piet-maries-projects.vercel.app/
```

**Note:** Each preview deployment gets a unique URL, so you'd need to add each one manually. The wildcard should work, but if it doesn't, add the specific URL.

### Step 4: Save

Click **"Save"** at the bottom of the page.

---

## Verify It's Working

1. **Clear browser cache** (or use incognito mode)
2. **Visit your preview URL:** `https://icona-a70m7wbos-piet-maries-projects.vercel.app/`
3. **Click "Sign In" → "Continue with Google"**
4. **Complete Google auth**
5. **Should redirect back and complete login** ✅

---

## Why This Happens

- Supabase only allows redirects to URLs in the "Redirect URLs" list
- Preview deployments have unique URLs (e.g., `icona-{hash}-piet-maries-projects.vercel.app`)
- The wildcard `https://*.vercel.app/*` should match all preview URLs
- If it doesn't work, you need to add the specific preview URL

---

## Quick Checklist

- [ ] Go to Supabase Dashboard → Authentication → URL Configuration
- [ ] Check that `https://*.vercel.app/*` is in Redirect URLs
- [ ] If not, add it (or add your specific preview URL)
- [ ] Click "Save"
- [ ] Test sign-in on preview URL
- [ ] Should complete login successfully ✅

---

## Alternative: Use Production URL for Testing

If preview URLs keep causing issues:

1. **Temporarily test on production:** `https://www.useicona.com`
2. **Make sure production URL is in Supabase redirect URLs** (should already be there)
3. **Test sign-in** - should work
4. **Switch back to preview** after fixing redirect URLs

---

## Summary

**The issue:** Preview URL not in Supabase's allowed redirect URLs.

**The fix:** Add `https://*.vercel.app/*` to Supabase Redirect URLs (or add the specific preview URL).

**After fixing:** OAuth should complete successfully on preview deployments! 🎉

