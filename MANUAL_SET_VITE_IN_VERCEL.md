# How to Manually Set Vite in Vercel Dashboard - Step by Step

## Step-by-Step Instructions

### Step 1: Go to Vercel Dashboard

1. Open your browser
2. Go to: **https://vercel.com/dashboard**
3. Sign in if needed

### Step 2: Select Your Project

1. You'll see a list of your projects
2. Find and click on **"Icona"** (or your project name)
3. This opens your project dashboard

### Step 3: Go to Settings

1. Look at the **top navigation bar** in your project
2. You'll see tabs like: **Overview**, **Deployments**, **Analytics**, **Settings**
3. Click on **"Settings"** (it has a gear icon ⚙️)

### Step 4: Go to General Settings

1. In the **left sidebar** under Settings, you'll see:
   - General
   - Environment Variables
   - Git
   - Domains
   - etc.
2. Click on **"General"** (it's usually the first option)

### Step 5: Find Build & Development Settings

1. Scroll down the page
2. Look for a section called **"Build & Development Settings"**
3. You'll see:
   - **Framework Preset:** (currently showing "Next.js" or "Other")
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist` or `.next`
   - **Install Command:** `npm install`

### Step 6: Edit Framework Preset

1. Next to **"Framework Preset"**, you'll see an **"Edit"** button (or a pencil icon ✏️)
2. Click **"Edit"**

### Step 7: Select Vite

1. A dropdown menu will appear
2. Click on the dropdown
3. Scroll through the options and find **"Vite"**
4. Click on **"Vite"** to select it

### Step 8: Save

1. Click **"Save"** button (usually at the bottom of the settings section)
2. You might see a confirmation message

### Step 9: Verify Settings

After saving, verify these settings are correct:

- **Framework Preset:** `Vite` ✅
- **Build Command:** `npm run build` ✅
- **Output Directory:** `dist` ✅ (NOT `.next`)
- **Install Command:** `npm install` ✅

### Step 10: Redeploy

1. Go to the **"Deployments"** tab (top navigation)
2. Find your latest deployment
3. Click the **three dots** (`...`) next to it
4. Click **"Redeploy"**
5. Confirm the redeploy

---

## Visual Guide (What You'll See)

```
Vercel Dashboard
├── Projects List
│   └── [Click] Icona
│
└── Project Dashboard
    ├── Top Navigation
    │   ├── Overview
    │   ├── Deployments
    │   ├── Analytics
    │   └── [Click] Settings ⚙️
    │
    └── Settings Page
        ├── Left Sidebar
        │   └── [Click] General
        │
        └── Main Content
            └── Build & Development Settings
                ├── Framework Preset: [Edit] Next.js
                │   └── [Click Edit] → Select "Vite" → Save
                ├── Build Command: npm run build
                ├── Output Directory: dist
                └── Install Command: npm install
```

---

## Troubleshooting

### Can't Find "Settings" Tab?

- Make sure you're in the **project view** (not the main dashboard)
- Look for a gear icon ⚙️ in the top navigation
- It might be in a dropdown menu (three dots `...`)

### Can't Find "General" in Sidebar?

- Make sure you clicked on **"Settings"** first
- "General" should be the first item in the left sidebar
- If you don't see it, try refreshing the page

### Framework Preset is Grayed Out / Can't Edit?

- You might not have the right permissions
- Make sure you're the project owner or have admin access
- Try logging out and back in

### After Saving, It Still Shows "Next.js"?

1. **Hard refresh the page** (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
2. **Check again** - it might have saved but not updated the display
3. **Redeploy** - the framework setting takes effect on the next deployment

---

## Quick Checklist

- [ ] Go to vercel.com/dashboard
- [ ] Click on "Icona" project
- [ ] Click "Settings" tab
- [ ] Click "General" in sidebar
- [ ] Scroll to "Build & Development Settings"
- [ ] Click "Edit" next to Framework Preset
- [ ] Select "Vite" from dropdown
- [ ] Click "Save"
- [ ] Verify Framework Preset shows "Vite"
- [ ] Go to Deployments tab
- [ ] Redeploy latest deployment

---

## After Setting to Vite

Once you've set it to Vite and redeployed:

1. **Check the build logs:**
   - Go to Deployments → Click on the deployment
   - Click "Build Logs"
   - Should see: `> vite build` (NOT `> next build`)

2. **Verify output:**
   - Build should output to `dist/` folder
   - Should NOT create `.next/` folder

3. **Test the deployment:**
   - Visit your site
   - Should work correctly now

---

## Summary

**The key steps:**
1. Settings → General
2. Build & Development Settings
3. Edit Framework Preset
4. Select "Vite"
5. Save
6. Redeploy

That's it! This manually overrides Vercel's cached framework detection.

