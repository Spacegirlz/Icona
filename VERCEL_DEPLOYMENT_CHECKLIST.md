# Vercel Deployment Checklist ✅

**Your App URL:** https://icona-eta.vercel.app/

## Current Status Check

### ✅ What Should Be Working:
- Frontend UI is deployed
- Components are loading
- Styles (Tailwind) should be working

### ⚠️ What Needs Configuration:

1. **Environment Variables** (CRITICAL)
   - `GEMINI_API_KEY` must be set in Vercel dashboard
   - Without this, API routes will fail

2. **API Routes** 
   - `/api/generate-image` - Image generation
   - `/api/generate-caption` - Caption generation  
   - `/api/generate-prompt` - Prompt generation
   - `/api/refinement-suggestions` - Refinement suggestions

---

## Step-by-Step: Configure Vercel

### Step 1: Set Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `icona-eta`
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
Name: GEMINI_API_KEY
Value: your_actual_gemini_api_key_here
Environment: Production, Preview, Development
```

5. Click **Save**
6. **Redeploy** your app (go to Deployments → Click "..." → Redeploy)

### Step 2: Test API Endpoints

After setting environment variables, test your API:

```bash
# Test image generation endpoint
curl -X POST https://icona-eta.vercel.app/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{"base64ImageData":"test","mimeType":"image/jpeg","prompt":"test"}'
```

### Step 3: Verify Frontend

1. Open: https://icona-eta.vercel.app/
2. Check browser console (F12) for errors
3. Try uploading an image
4. Check if API calls are working

---

## Common Issues & Fixes

### Issue: API Routes Return 404

**Cause:** Vercel might not recognize the API routes  
**Fix:** 
- Ensure API files are in `/api/` directory
- Files should be named: `generate-image.ts` (not in subfolder)
- Check Vercel build logs

### Issue: API Routes Return 500 Error

**Cause:** `GEMINI_API_KEY` not set  
**Fix:** Set environment variable in Vercel dashboard and redeploy

### Issue: Styles Not Loading

**Cause:** Tailwind CSS not building properly  
**Fix:** 
- Check build logs in Vercel
- Ensure `postcss.config.js` and `tailwind.config.js` are in root
- Verify `src/index.css` is imported in `index.tsx`

### Issue: CORS Errors

**Cause:** API routes not configured for CORS  
**Fix:** Already handled in API files with OPTIONS handler

---

## Testing Your Deployment

### 1. Test Frontend
- ✅ Visit https://icona-eta.vercel.app/
- ✅ Check if UI loads
- ✅ Check browser console for errors

### 2. Test API (After setting GEMINI_API_KEY)

**Test Image Generation:**
```javascript
// In browser console on your deployed site
fetch('/api/generate-image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    base64ImageData: 'test',
    mimeType: 'image/jpeg',
    prompt: 'test prompt'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

**Expected Response (if API key is set):**
- Either success with image data
- Or error message (but not 500 server error)

**Expected Response (if API key NOT set):**
- `{ error: 'Server configuration error' }`

---

## Quick Fixes

### If API Routes Don't Work:

1. **Check File Structure:**
   ```
   api/
     generate-image.ts
     generate-caption.ts
     generate-prompt.ts
     refinement-suggestions.ts
   ```

2. **Check Vercel Build Logs:**
   - Go to Deployments → Click latest deployment
   - Check "Build Logs" tab
   - Look for TypeScript errors or build failures

3. **Redeploy:**
   - Push any changes to GitHub (if connected)
   - Or trigger manual redeploy in Vercel

---

## Next Steps After Deployment Works

1. ✅ Test all features in production
2. ✅ Monitor Vercel logs for errors
3. ✅ Set up error tracking (optional - Supabase)
4. ✅ Configure rate limiting (optional - Supabase)
5. ✅ Add custom domain (optional)

---

## Environment Variables Summary

### Required:
- `GEMINI_API_KEY` - Your Gemini API key (from Google AI Studio)

### Optional (for future features):
- `SUPABASE_URL` - For rate limiting/logging
- `SUPABASE_ANON_KEY` - For Supabase client
- `VITE_API_URL` - Override API base URL (defaults to `/api`)

---

## Verify Everything Works

✅ **Checklist:**
- [ ] Frontend loads at https://icona-eta.vercel.app/
- [ ] No console errors (except expected API errors until key is set)
- [ ] `GEMINI_API_KEY` is set in Vercel
- [ ] App has been redeployed after setting env vars
- [ ] API endpoints respond (not 404)
- [ ] Image generation works end-to-end

---

**Need Help?** Check Vercel deployment logs for specific error messages.

