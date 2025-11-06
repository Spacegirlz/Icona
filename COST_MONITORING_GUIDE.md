# Cost Monitoring Guide for ICONA 💰

## Gemini API Pricing Overview

### Current Pricing (as of 2024):
- **Image Generation (gemini-2.5-flash-image):** ~$0.01-0.05 per image
- **Text Generation (gemini-2.5-flash):** ~$0.0001-0.001 per 1K tokens
- **Input tokens:** ~$0.075 per 1M tokens
- **Output tokens:** ~$0.30 per 1M tokens

### Your Usage Types:
1. **Image Generation** - Most expensive (main feature)
2. **Prompt Generation** - Text generation (low cost)
3. **Caption Generation** - Text generation (low cost)
4. **Refinement Suggestions** - Text generation (low cost)

---

## Method 1: Google Cloud Console (Recommended)

### Step 1: Access Google Cloud Console

1. **Go to:** https://console.cloud.google.com/
2. **Sign in** with the same Google account used for Gemini API
3. **Select your project** (or create one if needed)

### Step 2: View Billing

1. **Go to:** Billing → Dashboard
2. **View:**
   - Current month costs
   - Daily spending
   - Service breakdown (Gemini API costs)
   - Usage by API endpoint

### Step 3: Set Up Budget Alerts

1. **Go to:** Billing → Budgets & alerts
2. **Click:** "Create Budget"
3. **Set:**
   - Budget amount (e.g., $50/month)
   - Alert thresholds (e.g., 50%, 90%, 100%)
   - Email notifications

### Step 4: View Detailed Usage

1. **Go to:** APIs & Services → Dashboard
2. **Find:** "Generative Language API" or "Gemini API"
3. **View:**
   - Request count
   - Error rate
   - Latency

**Or use BigQuery:**
1. **Go to:** Billing → Reports
2. **Export to BigQuery** (if enabled)
3. **Query** for detailed usage data

---

## Method 2: Add Usage Logging to Your App

Let's add logging to track usage in your API endpoints:

### Implementation Options:

#### Option A: Log to Console (Simple)
- Already logging errors
- Can enhance to log all requests
- Check Vercel logs

#### Option B: Log to Supabase (Recommended)
- Store usage data in database
- Track per-user/IP
- Build dashboard
- Set up alerts

#### Option C: Use Vercel Analytics
- Basic request tracking
- Limited API-specific metrics

---

## Method 3: Add Usage Tracking to API Routes

I'll help you add usage tracking to your API endpoints to monitor:
- Number of requests
- Image generation calls
- Text generation calls
- Estimated costs

---

## Quick Cost Estimation

### Per Image Generation:
- **Input:** ~1000-2000 tokens (image + prompt)
- **Output:** 1 image (~$0.01-0.05)
- **Total:** ~$0.01-0.05 per image

### Per Caption Generation:
- **Input:** ~500 tokens (image + prompt)
- **Output:** ~100 tokens
- **Total:** ~$0.0001 per caption

### Monthly Estimate (1000 users, 2 images each):
- **Image Generation:** 2000 images × $0.03 = **$60**
- **Captions:** 2000 × $0.0001 = **$0.20**
- **Prompt Generation:** 2000 × $0.001 = **$2**
- **Total:** ~**$62/month**

---

## Setting Up Usage Tracking

Would you like me to:
1. **Add usage logging** to your API routes?
2. **Set up Supabase** for tracking usage?
3. **Create a simple dashboard** to view usage?

Let me know which approach you prefer!

