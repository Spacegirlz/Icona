# ICONA - Quick Start Guide 🚀

## Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

**Important:** The API key is now only used server-side (in Vercel serverless functions). It will NOT be exposed to the client.

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

---

## What's Changed (Critical Fixes)

### ✅ Security Fixes
- **API Key Moved to Backend**: API key is now secure in Vercel serverless functions
- **Prompt Sanitization**: All user inputs are sanitized to prevent prompt injection
- **Input Validation**: File uploads are validated

### ✅ Stability Fixes
- **Memory Leaks Fixed**: Blob URLs are properly cleaned up
- **Error Boundaries**: App won't crash if a component errors
- **Better Error Handling**: User-friendly error messages

### ✅ New Backend API
- `/api/generate-image` - Image generation endpoint
- `/api/generate-caption` - Caption generation endpoint
- `/api/generate-prompt` - Prompt generation endpoint
- `/api/refinement-suggestions` - Refinement suggestions endpoint

---

## Testing Locally

### Important: API Routes Testing

The API routes (`/api/*`) are Vercel serverless functions. They work differently in local development:

**Option 1: Use Vercel CLI (Recommended)**
```bash
npm install -g vercel
vercel dev
```
This will properly run the serverless functions locally.

**Option 2: Mock Backend (For Frontend Testing)**
For now, you can test the frontend. The API calls will fail until deployed to Vercel, but you can see the UI working.

---

## Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Add critical security fixes and backend API"
git push
```

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your GitHub repository
3. Set environment variables:
   - `GEMINI_API_KEY` = your Gemini API key
4. Deploy!

### 3. Verify Deployment

- Check that API endpoints are working: `https://your-app.vercel.app/api/generate-image`
- Test image generation in the app
- Check Vercel logs for any errors

---

## Troubleshooting

### API Calls Failing Locally
- **Issue**: API routes return 404 locally
- **Solution**: Use `vercel dev` instead of `npm run dev`, or deploy to Vercel for testing

### API Key Not Working
- **Issue**: "Server configuration error"
- **Solution**: Make sure `GEMINI_API_KEY` is set in Vercel environment variables (not `.env.local` for production)

### CORS Errors
- **Issue**: CORS errors in browser console
- **Solution**: API routes include CORS headers. If issues persist, check Vercel configuration.

---

## Next Steps

1. ✅ Test locally with `vercel dev`
2. ✅ Deploy to Vercel
3. ✅ Set up Supabase for rate limiting (optional)
4. ✅ Add error logging to Supabase (optional)
5. ✅ Configure Stripe for payments (if needed)

---

**Need Help?** Check `MASTER_PLAN.md` for detailed implementation guide.

