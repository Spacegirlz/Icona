# Gemini API Pricing Reference 💰

## Official Pricing (as of 2024)

### Gemini 2.5 Flash Image (`gemini-2.5-flash-image`)
**Used for:** Image generation in ICONA

| Item | Free Tier | Paid Tier |
|------|-----------|-----------|
| **Input** | Not available | $0.30 per 1M tokens (text/image) |
| **Output** | Not available | **$0.039 per image** (up to 1024x1024px) |
| **Note:** | | Images consume ~1290 tokens = $0.039 |

**Cost per image generation:** ~$0.04-0.05
- Input: ~$0.001-0.002 (image + prompt tokens)
- Output: $0.039 (fixed per image)
- **Total:** ~$0.04-0.05 per image

---

### Gemini 2.5 Flash (`gemini-2.5-flash`)
**Used for:** Prompt generation, captions, refinement suggestions

| Item | Free Tier | Paid Tier |
|------|-----------|-----------|
| **Input** | Free of charge | $0.30 per 1M tokens |
| **Output** | Free of charge | $2.50 per 1M tokens (including thinking tokens) |

**Cost per text generation:** ~$0.0001-0.003
- Depends on input/output token count
- Much cheaper than image generation

---

## Cost Comparison

### Image Generation (Most Expensive)
- **$0.039 per image** (fixed)
- Plus input tokens (~$0.001-0.002)
- **Total: ~$0.04-0.05 per image**

### Text Generation (Cheap)
- Prompt generation: ~$0.001-0.003 per request
- Caption generation: ~$0.0002-0.0005 per request
- Refinement suggestions: ~$0.0001-0.0003 per request

---

## Monthly Cost Scenarios

### Scenario 1: Small Launch (100 users/day)
- **2 images per user = 200 images/day**
- **200 × $0.045 = $9/day**
- **Monthly: ~$270**

### Scenario 2: Growing (500 users/day)
- **2 images per user = 1,000 images/day**
- **1,000 × $0.045 = $45/day**
- **Monthly: ~$1,350**

### Scenario 3: Popular (1,000 users/day)
- **2 images per user = 2,000 images/day**
- **2,000 × $0.045 = $90/day**
- **Monthly: ~$2,700**

### Scenario 4: Viral (5,000 users/day)
- **2 images per user = 10,000 images/day**
- **10,000 × $0.045 = $450/day**
- **Monthly: ~$13,500**

---

## Cost Optimization Tips

1. **Image Generation is 95% of costs**
   - Focus optimization here
   - Consider caching similar prompts
   - Limit image generation per user

2. **Text operations are cheap**
   - Prompt generation: ~$0.001-0.003
   - Captions: ~$0.0002-0.0005
   - These are negligible compared to images

3. **Free Tier Available**
   - Gemini 2.5 Flash has free tier for text
   - But image generation requires paid tier
   - Good for testing text features

4. **Rate Limiting**
   - Already implemented (10 req/min)
   - Prevents abuse
   - Helps control costs

---

## Monitoring Your Costs

### Real-Time:
- Check Vercel logs for `[USAGE]` entries
- See cost per request immediately

### Daily:
- Google Cloud Console → Billing → Reports
- View daily spending breakdown

### Monthly:
- Google Cloud Console → Billing → Dashboard
- See full month costs
- Set up budget alerts

---

## Budget Recommendations

- **Development/Testing:** $10-20/month
- **Small Launch:** $50-100/month budget alert
- **Growing:** $200-500/month budget alert
- **Scale:** $1,000+/month budget alert

---

## Reference Links

- **Official Pricing:** https://ai.google.dev/pricing
- **Google Cloud Console:** https://console.cloud.google.com/billing
- **Budget Alerts:** https://console.cloud.google.com/billing/budgets

---

**Key Takeaway:** Image generation at $0.039/image is your main cost. Everything else is negligible in comparison.

