# How to View Your Gemini API Costs 💰

## Method 1: Google Cloud Console (Most Accurate)

### Step 1: Access Google Cloud Console

1. **Go to:** https://console.cloud.google.com/
2. **Sign in** with the same Google account you used for Gemini API
3. **Select or create a project** (if you haven't already)

### Step 2: View Billing Dashboard

1. **Navigate to:** Billing → Dashboard
   - Or direct link: https://console.cloud.google.com/billing
2. **You'll see:**
   - Current month costs
   - Daily spending breakdown
   - Service breakdown (Gemini API costs)
   - Usage by API endpoint

### Step 3: View Detailed Usage Reports

1. **Go to:** Billing → Reports
2. **Filter by:**
   - Service: "Generative Language API" or "Gemini API"
   - Time period: This month, last month, etc.
3. **View:**
   - Cost per day
   - Cost per API call type
   - Token usage (input/output)

### Step 4: Set Up Budget Alerts (Recommended!)

1. **Go to:** Billing → Budgets & alerts
2. **Click:** "Create Budget"
3. **Configure:**
   - Budget amount: Set your monthly limit (e.g., $50)
   - Alert thresholds: 50%, 90%, 100%
   - Email notifications: Your email
4. **Save** - You'll get alerts before hitting your limit!

---

## Method 2: View Usage in Vercel Logs

### Step 1: Access Vercel Logs

1. **Go to:** https://vercel.com/dashboard
2. **Click:** Your project (`icona-eta`)
3. **Go to:** Deployments → Latest deployment
4. **Click:** Functions tab
5. **Click:** Any API function (e.g., `generate-image`)
6. **Click:** Logs tab

### Step 2: Look for Usage Logs

You'll see logs like:
```
[USAGE] Image Generation: {
  endpoint: '/api/generate-image',
  inputTokens: 5000,
  imageGenerated: true,
  estimatedCost: '$0.03',
  ip: 'xxx.xxx.xxx.xxx'
}
```

### Step 3: Calculate Total Usage

Count the `[USAGE]` log entries to see:
- How many image generations
- How many text generations
- Estimated costs per request

---

## Method 3: Google AI Studio Dashboard

1. **Go to:** https://aistudio.google.com/
2. **Click:** Your profile/account
3. **Look for:** Usage or Billing section
4. **View:** API usage statistics

---

## Cost Breakdown Guide (Official Pricing)

### Image Generation (`/api/generate-image`) - Gemini 2.5 Flash Image
- **Input:** $0.30 per 1M tokens (text + image)
- **Output:** $0.039 per image (up to 1024x1024px = 1290 tokens)
- **Total Cost:** ~$0.04-0.05 per image (most expensive operation)
- **Logged as:** `[USAGE] Image Generation`

### Prompt Generation (`/api/generate-prompt`) - Gemini 2.5 Flash
- **Input:** $0.30 per 1M tokens
- **Output:** $2.50 per 1M tokens (including thinking tokens)
- **Cost:** ~$0.001-0.003 per request
- **Input tokens:** ~500-2000 tokens
- **Output tokens:** ~1000-3000 tokens
- **Logged as:** `[USAGE] Prompt Generation`

### Caption Generation (`/api/generate-caption`) - Gemini 2.5 Flash
- **Input:** $0.30 per 1M tokens
- **Output:** $2.50 per 1M tokens
- **Cost:** ~$0.0002-0.0005 per request
- **Input tokens:** ~500-1000 tokens (image + prompt)
- **Output tokens:** ~50-200 tokens
- **Logged as:** `[USAGE] Caption Generation`

### Refinement Suggestions (`/api/refinement-suggestions`) - Gemini 2.5 Flash
- **Input:** $0.30 per 1M tokens
- **Output:** $2.50 per 1M tokens
- **Cost:** ~$0.0001-0.0003 per request
- **Input tokens:** ~200-500 tokens
- **Output tokens:** ~50-100 tokens
- **Logged as:** `[USAGE] Refinement Suggestions`

---

## Quick Cost Estimation (Updated with Official Pricing)

### Per User Session (Average):
- 1 image generation: **$0.04-0.05** (input + $0.039/image)
- 1 prompt generation: **$0.001-0.003** (text generation)
- 1 caption (optional): **$0.0002-0.0005**
- 1 refinement suggestions: **$0.0001-0.0003**
- **Total per session:** ~**$0.04-0.05** (dominated by image generation)

### Monthly Estimates:
- **100 users/day × 2 images = 200 images/day**
- **200 × $0.045 = $9/day**
- **Monthly:** ~**$270/month**

- **1000 users/day × 2 images = 2000 images/day**
- **2000 × $0.045 = $90/day**
- **Monthly:** ~**$2,700/month**

### Cost Breakdown Per Request:
- **Image Generation:** ~95% of total costs
- **Text Operations:** ~5% of total costs (prompt, caption, suggestions)

---

## Viewing Real-Time Usage

### In Vercel Logs (Real-time):
1. Go to: Deployments → Latest → Functions → Logs
2. Filter logs by: `[USAGE]`
3. See costs as they happen

### In Google Cloud Console:
1. Go to: Billing → Reports
2. View: Real-time or near-real-time usage
3. Usually updates within 1-2 hours

---

## Setting Up Cost Alerts

### Google Cloud Budget Alerts:

1. **Go to:** https://console.cloud.google.com/billing/budgets
2. **Create Budget:**
   - Name: "ICONA Gemini API Budget"
   - Amount: Set your limit (e.g., $50, $100, $500)
   - Alert at: 50%, 90%, 100%
3. **Email alerts** will notify you before hitting limits

### Recommended Budgets:
- **Development:** $10-20/month
- **Small launch:** $50-100/month
- **Growing:** $200-500/month

---

## Understanding Your Bill

### Monthly Bill Breakdown:
- **Image Generation:** 90% of costs (most expensive)
- **Text Generation:** 10% of costs (prompt, caption, suggestions)
- **Vercel Hosting:** Separate (usually free tier covers it)

### Cost Optimization Tips:
1. **Cache prompts** - Reuse generated prompts when possible
2. **Limit image generation** - Add rate limiting (already done!)
3. **Optimize image size** - Smaller images = lower costs
4. **Monitor usage** - Use logs to identify expensive operations

---

## Quick Reference Links

- **Google Cloud Console:** https://console.cloud.google.com/
- **Billing Dashboard:** https://console.cloud.google.com/billing
- **Usage Reports:** https://console.cloud.google.com/billing/reports
- **Budget Alerts:** https://console.cloud.google.com/billing/budgets
- **Vercel Logs:** https://vercel.com/dashboard → Your Project → Deployments → Functions → Logs
- **Google AI Studio:** https://aistudio.google.com/

---

## Next Steps

1. ✅ **Set up budget alerts** in Google Cloud Console
2. ✅ **Monitor Vercel logs** for usage patterns
3. ✅ **Check billing dashboard** weekly
4. ✅ **Review costs** monthly and adjust limits

**Your usage is now being logged! Check Vercel logs to see real-time costs.** 📊

