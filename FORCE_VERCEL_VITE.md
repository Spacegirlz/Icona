# Force Vercel to Recognize Vite - Complete Fix

## The Real Problem

Vercel caches framework detection. Even after fixing `package.json` and `vercel.json`, you may need to:

1. **Clear Vercel's cached detection**
2. **Manually set framework in dashboard**
3. **Verify build output structure**

---

## Step-by-Step Fix

### Step 1: Verify Local Configuration

Your project should have:
- ✅ `vite.config.ts` exists
- ✅ `package.json` has `"build": "vite build"` (NOT `next build`)
- ✅ `package.json` does NOT have `"next"` in dependencies
- ✅ `vercel.json` has `"framework": "vite"` as FIRST property
- ✅ `vercel.json` has `"outputDirectory": "dist"`

### Step 2: Clear Vercel Project Settings

1. Go to: https://vercel.com/dashboard
2. Click your **ICONA** project
3. Go to **Settings** → **General**
4. Scroll to **"Build & Development Settings"**
5. Click **"Edit"** next to Framework Preset
6. **Manually select "Vite"** from dropdown
7. **Save**

### Step 3: Verify Build Settings

In the same section, verify:
- **Build Command:** `npm run build` (should run `vite build`)
- **Output Directory:** `dist` (NOT `.next`)
- **Install Command:** `npm install`

### Step 4: Delete and Reconnect (If Still Not Working)

If it STILL doesn't work:

1. **Note down your environment variables** (copy them somewhere)
2. **Delete the project in Vercel** (Settings → Delete Project)
3. **Reconnect the GitHub repo** (Add New Project → Import)
4. **Vercel will now detect Vite** (no `next` in package.json)
5. **Re-add all environment variables**

---

## Why This Happens

Vercel's framework detection:
1. **First deployment:** Scans `package.json` for framework signals
2. **Caches the result** in project settings
3. **Ignores `vercel.json`** if it conflicts with cached detection
4. **Requires manual override** if detection was wrong

Having `next` in `package.json` caused Vercel to:
- Cache "Next.js" as the framework
- Ignore `vercel.json` framework setting
- Use Next.js build process (wrong!)

---

## Verification Checklist

After fixing, check deployment logs:

1. Go to **Deployments** → Click latest deployment
2. Click **"Build Logs"**
3. Should see:
   ```
   Running "npm run build"
   > vite build
   ```
   NOT:
   ```
   > next build
   ```

4. Check **Output:**
   - Should build to `dist/` folder
   - Should have `dist/index.html`
   - Should NOT have `.next/` folder

---

## Quick Test

After fixing, trigger a new deployment:

```bash
git commit --allow-empty -m "Trigger Vercel rebuild"
git push origin main
```

Then check:
- Build logs show `vite build`
- Output is in `dist/`
- Framework shows as "Vite" in dashboard

---

## If Still Not Working

1. **Check for hidden Next.js files:**
   - `.next/` folder (shouldn't exist)
   - `next.config.js` (shouldn't exist)
   - `pages/` or `app/` directories (shouldn't exist)

2. **Verify package-lock.json:**
   - Run `npm install` locally
   - Commit updated `package-lock.json`
   - Push to trigger rebuild

3. **Contact Vercel Support:**
   - They can manually override framework detection
   - Provide them with your `vercel.json` and `package.json`

---

## Summary

**The fix:**
1. ✅ Removed `next` from `package.json` (done)
2. ✅ Set `"framework": "vite"` in `vercel.json` (done)
3. ⚠️ **Manually set in Vercel Dashboard** (YOU NEED TO DO THIS)
4. ⚠️ **Clear cache by reconnecting project** (if manual setting doesn't work)

**Vercel caches framework detection. You MUST manually override it in the dashboard!**

