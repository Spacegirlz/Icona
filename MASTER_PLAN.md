# ICONA - Master Launch Plan 🚀

**Goal:** Fix critical issues and launch ASAP on Vercel  
**Available Resources:** Vercel, Supabase, Stripe  
**Timeline:** 3-5 days for critical fixes

---

## 📋 Executive Summary

Fix all critical security and stability issues to enable production launch. This plan prioritizes:
1. **Security** (API key exposure, prompt injection)
2. **Stability** (memory leaks, error boundaries)
3. **Infrastructure** (Backend API, rate limiting)
4. **Production Readiness** (Error handling, monitoring)

---

## 🎯 Phase 1: Critical Security Fixes (Day 1-2)

### ✅ Task 1.1: Create Backend API (Vercel Serverless Functions)

**Priority:** CRITICAL  
**Time:** 2-3 hours

**Action Items:**
- [ ] Create `/api` directory structure
- [ ] Create `/api/generate-image` endpoint
- [ ] Create `/api/generate-caption` endpoint
- [ ] Create `/api/refinement-suggestions` endpoint
- [ ] Move Gemini API calls to backend
- [ ] Add environment variable for API key (server-side only)

**Files to Create:**
```
api/
  generate-image/
    route.ts
  generate-caption/
    route.ts
  refinement-suggestions/
    route.ts
  lib/
    gemini-client.ts
    rate-limiter.ts
    validation.ts
```

---

### ✅ Task 1.2: Fix API Key Exposure

**Priority:** CRITICAL  
**Time:** 1 hour

**Current Issue:**
- API key in `geminiService.ts` exposed to client
- Vite config exposes env vars to client bundle

**Fix:**
- Remove API key from client code
- Update `geminiService.ts` to call backend API
- Keep API key only in Vercel environment variables

**Files to Modify:**
- `services/geminiService.ts` - Change to fetch backend API
- `vite.config.ts` - Remove API key from client bundle

---

### ✅ Task 1.3: Implement Prompt Sanitization

**Priority:** HIGH  
**Time:** 2-3 hours

**Current Issue:**
- User inputs directly interpolated into prompts
- Vulnerable to prompt injection attacks

**Fix:**
- Create `utils/promptSanitizer.ts`
- Sanitize all user inputs before API calls
- Implement prompt templates with placeholders
- Add input length limits

**Files to Create:**
- `utils/promptSanitizer.ts`

**Files to Modify:**
- `App.tsx` - Sanitize `refinementPrompt`, `manualEraText`, `additionalDetails`
- `services/geminiService.ts` - Sanitize prompts before sending

**Implementation:**
```typescript
// utils/promptSanitizer.ts
export function sanitizePrompt(input: string): string {
  return input
    .replace(/[^\w\s.,!?\-'"]/g, '') // Remove special chars
    .substring(0, 1000) // Limit length
    .trim();
}
```

---

### ✅ Task 1.4: Add Input Validation

**Priority:** HIGH  
**Time:** 1-2 hours

**Current Issue:**
- No file size/type validation
- No dimension checks

**Fix:**
- Add file validation in `ImageUploader.tsx`
- Validate file size (max 10MB)
- Validate file type (PNG, JPEG, WEBP)
- Validate dimensions (optional, but recommended)

**Files to Modify:**
- `components/ImageUploader.tsx`
- `utils/imageUtils.ts` - Add validation functions

---

## 🛡️ Phase 2: Stability & Error Handling (Day 2-3)

### ✅ Task 2.1: Fix Memory Leaks

**Priority:** HIGH  
**Time:** 1 hour

**Current Issue:**
- `URL.createObjectURL()` never revoked
- Memory leaks from blob URLs

**Fix:**
- Add cleanup in `useEffect` hooks
- Revoke blob URLs when component unmounts
- Clean up on image upload change

**Files to Modify:**
- `App.tsx` - Add cleanup for `originalImageUrl`
- `components/ResultDisplay.tsx` - Clean up `editedImageUrl`

---

### ✅ Task 2.2: Add React Error Boundaries

**Priority:** HIGH  
**Time:** 1-2 hours

**Current Issue:**
- No error boundaries
- One component crash = entire app crash

**Fix:**
- Create `components/ErrorBoundary.tsx`
- Wrap main app sections
- Add fallback UI with error messages

**Files to Create:**
- `components/ErrorBoundary.tsx`

**Files to Modify:**
- `App.tsx` - Wrap sections in ErrorBoundary
- `index.tsx` - Add top-level ErrorBoundary

---

### ✅ Task 2.3: Improve Error Handling

**Priority:** MEDIUM  
**Time:** 2-3 hours

**Current Issue:**
- Inconsistent error messages
- Some errors only logged to console

**Fix:**
- Create centralized error handling service
- Add user-friendly error messages
- Implement error logging (to Supabase or external service)
- Add retry logic for transient failures

**Files to Create:**
- `services/errorHandler.ts`
- `utils/errorMessages.ts`

---

## 🏗️ Phase 3: Infrastructure Setup (Day 3-4)

### ✅ Task 3.1: Set Up Supabase

**Priority:** MEDIUM  
**Time:** 2-3 hours

**Purpose:**
- Rate limiting per user/IP
- User session management (optional)
- Error logging
- Analytics (optional)

**Action Items:**
- [ ] Create Supabase project
- [ ] Create rate limiting table
- [ ] Create error logs table
- [ ] Set up Supabase client
- [ ] Implement rate limiting middleware

**Files to Create:**
- `lib/supabase.ts`
- `lib/rateLimiter.ts`
- `api/middleware/rate-limit.ts`

**Database Schema:**
```sql
-- Rate limiting table
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- IP or user ID
  endpoint TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  window_start TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Error logs table
CREATE TABLE error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type TEXT,
  message TEXT,
  stack TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### ✅ Task 3.2: Configure Vercel Deployment

**Priority:** MEDIUM  
**Time:** 1-2 hours

**Action Items:**
- [ ] Create `vercel.json` configuration
- [ ] Set up environment variables in Vercel dashboard
- [ ] Configure API routes
- [ ] Set up build settings
- [ ] Test deployment

**Files to Create:**
- `vercel.json`

**Environment Variables (Vercel Dashboard):**
```
GEMINI_API_KEY=your_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
NODE_ENV=production
```

---

### ✅ Task 3.3: Add Rate Limiting

**Priority:** HIGH  
**Time:** 2-3 hours

**Implementation:**
- Server-side rate limiting in API routes
- Use Supabase for distributed rate limiting
- Limit: 10 requests per minute per IP
- Return 429 status with retry-after header

**Files to Create:**
- `api/lib/rateLimiter.ts`
- `api/middleware/rate-limit.ts`

---

## 📊 Phase 4: Monitoring & Logging (Day 4-5)

### ✅ Task 4.1: Add Error Logging

**Priority:** MEDIUM  
**Time:** 1-2 hours

**Implementation:**
- Log errors to Supabase
- Add error tracking (optional: Sentry)
- Create error dashboard (optional)

**Files to Create:**
- `lib/logger.ts`

---

### ✅ Task 4.2: Add Request Logging

**Priority:** LOW  
**Time:** 1 hour

**Implementation:**
- Log API requests (anonymized)
- Track usage patterns
- Monitor API costs

---

## 🎨 Phase 5: UX Improvements (Day 5)

### ✅ Task 5.1: Improve Loading States

**Priority:** LOW  
**Time:** 1 hour

**Current Issue:**
- Generic loading spinner
- No progress indication

**Fix:**
- Add progress indicators
- Show estimated time
- Better loading messages

---

### ✅ Task 5.2: Add Input Validation Feedback

**Priority:** LOW  
**Time:** 1 hour

**Fix:**
- Show file size before upload
- Validate dimensions
- Show error messages inline

---

## 📦 Deployment Checklist

### Pre-Deployment:
- [ ] All critical fixes implemented
- [ ] Environment variables configured
- [ ] Rate limiting tested
- [ ] Error boundaries tested
- [ ] Memory leaks fixed
- [ ] Input validation working
- [ ] API key removed from client
- [ ] Prompt sanitization tested

### Deployment:
- [ ] Push to GitHub
- [ ] Connect to Vercel
- [ ] Set environment variables
- [ ] Deploy to production
- [ ] Test production build
- [ ] Monitor for errors

### Post-Deployment:
- [ ] Verify API endpoints work
- [ ] Test rate limiting
- [ ] Monitor error logs
- [ ] Check API usage/costs
- [ ] Set up alerts (optional)

---

## 🗂️ File Structure After Implementation

```
Icona/
├── api/                          # NEW: Vercel serverless functions
│   ├── generate-image/
│   │   └── route.ts
│   ├── generate-caption/
│   │   └── route.ts
│   ├── refinement-suggestions/
│   │   └── route.ts
│   └── lib/
│       ├── gemini-client.ts
│       ├── rate-limiter.ts
│       └── validation.ts
├── components/
│   ├── ErrorBoundary.tsx         # NEW
│   └── ... (existing)
├── lib/                          # NEW: Shared utilities
│   ├── supabase.ts
│   ├── logger.ts
│   └── rateLimiter.ts
├── utils/
│   ├── promptSanitizer.ts        # NEW
│   ├── imageUtils.ts             # MODIFIED
│   └── errorMessages.ts          # NEW
├── services/
│   ├── geminiService.ts          # MODIFIED (calls backend)
│   └── errorHandler.ts          # NEW
├── vercel.json                   # NEW
├── .env.local                    # MODIFIED (remove API key)
└── ... (existing files)
```

---

## ⏱️ Timeline Summary

| Phase | Tasks | Time | Priority |
|-------|-------|------|----------|
| **Phase 1** | Security Fixes | Day 1-2 | CRITICAL |
| **Phase 2** | Stability | Day 2-3 | HIGH |
| **Phase 3** | Infrastructure | Day 3-4 | MEDIUM |
| **Phase 4** | Monitoring | Day 4-5 | MEDIUM |
| **Phase 5** | UX Polish | Day 5 | LOW |

**Total Estimated Time:** 3-5 days (working 6-8 hours/day)

---

## 🚀 Quick Start Execution Order

1. **Start Local Server** (5 min)
   ```bash
   npm run dev
   ```

2. **Create Backend API** (2-3 hours)
   - Create `/api` directory
   - Move Gemini calls to serverless functions

3. **Fix Security Issues** (3-4 hours)
   - Remove API key from client
   - Add prompt sanitization
   - Add input validation

4. **Fix Stability** (2-3 hours)
   - Fix memory leaks
   - Add error boundaries

5. **Set Up Infrastructure** (3-4 hours)
   - Configure Supabase
   - Add rate limiting
   - Set up Vercel

6. **Deploy** (1 hour)
   - Push to GitHub
   - Deploy to Vercel
   - Test production

---

## 📝 Notes

- **API Key Security:** Never commit API keys to git. Use Vercel environment variables.
- **Rate Limiting:** Start conservative (10 req/min), adjust based on usage.
- **Error Handling:** Log all errors but don't expose sensitive info to users.
- **Testing:** Test each fix individually before moving to next.
- **Monitoring:** Set up error alerts in Vercel/Supabase dashboard.

---

## 🎯 Success Criteria

- ✅ API key not exposed in client bundle
- ✅ All prompts sanitized before API calls
- ✅ No memory leaks (verified with DevTools)
- ✅ Error boundaries catch all crashes
- ✅ Rate limiting prevents abuse
- ✅ Input validation prevents invalid files
- ✅ App deployed and running on Vercel
- ✅ Error logging working
- ✅ No console errors in production

---

**Ready to execute? Let's start with Phase 1! 🚀**

