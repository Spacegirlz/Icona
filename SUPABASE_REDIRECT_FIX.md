# Fix: Google OAuth Redirect to Wrong Port

## Problem
Google OAuth is redirecting to `localhost:3000` instead of `localhost:5173` (Vite's default port).

## Root Cause
The redirect URL in **Supabase Dashboard** is configured to port 3000, but your Vite dev server runs on port 5173.

---

## Solution: Update Supabase Redirect URLs

### Step 1: Go to Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/welezbiiqwhvsftiypni
2. Click **Authentication** in the left sidebar
3. Click **URL Configuration**

### Step 2: Set Site URL
In the **Site URL** field (at the top), set:
```
https://useicona.com
```

This is your production domain - the default redirect URL.

### Step 3: Update Redirect URLs
In the **Redirect URLs** section, you need to add/update these URLs:

**Remove any `localhost:3000` entries** (if they exist)

**Add these URLs** (one per line):
```
http://localhost:5173
http://localhost:5173/
https://useicona.com
https://useicona.com/
https://www.useicona.com
https://www.useicona.com/
https://*.vercel.app/*
```

### Step 4: Save
Click **"Save"** at the bottom of the page.

---

## Why This Happens

- **Vite dev server** runs on port **5173** (not 3000)
- **Next.js** runs on port **3000** (but you're using Vite)
- Supabase needs to know which URLs are allowed for redirects
- If `localhost:3000` is in the list, it will redirect there even though your app is on 5173

---

## After Fixing

1. **Restart your dev server** (if running):
   ```bash
   npm run dev
   ```

2. **Test Google sign-in**:
   - Click "Sign In" → "Continue with Google"
   - Should redirect back to `http://localhost:5173` (not 3000)

3. **In production**, it will redirect to `https://useicona.com`

---

## Quick Checklist

- ✅ Site URL: `https://useicona.com`
- ✅ Redirect URLs include: `http://localhost:5173` and `http://localhost:5173/`
- ✅ Redirect URLs include: `https://useicona.com` and `https://useicona.com/`
- ✅ Redirect URLs include: `https://www.useicona.com` and `https://www.useicona.com/`
- ✅ Redirect URLs include: `https://*.vercel.app/*` (for preview deployments)
- ✅ **Removed** any `localhost:3000` entries
- ✅ Clicked "Save"

---

## Your Code is Already Correct! ✅

The code in `authService.ts` already uses:
```typescript
const redirectTo = `${window.location.origin}${window.location.pathname}`;
```

This automatically uses:
- `http://localhost:5173` in development
- `https://useicona.com` in production

**The issue is just the Supabase configuration**, not your code!

---

## Summary

1. Go to Supabase → Authentication → URL Configuration
2. Set Site URL to: `https://useicona.com`
3. Add `http://localhost:5173` to Redirect URLs
4. Remove `localhost:3000` if it exists
5. Save changes
6. Test again

That's it! 🎉

