# Stripe Integration Plan for ICONA 💳

## Credit System Implementation

### Step 1: Set Up Stripe Products

**In Stripe Dashboard:**
1. Go to: https://dashboard.stripe.com/products
2. Create products for each credit package:

```
Product 1: Starter Pack
- Name: "ICONA Starter Pack"
- Description: "5 image transformations"
- Price: $1.99 (one-time)
- Metadata: { credits: 5, type: 'credit_pack' }

Product 2: Popular Pack
- Name: "ICONA Popular Pack"
- Description: "15 image transformations"
- Price: $4.99 (one-time)
- Metadata: { credits: 15, type: 'credit_pack' }

Product 3: Pro Pack
- Name: "ICONA Pro Pack"
- Description: "40 image transformations"
- Price: $9.99 (one-time)
- Metadata: { credits: 40, type: 'credit_pack' }

Product 4: Mega Pack
- Name: "ICONA Mega Pack"
- Description: "100 image transformations"
- Price: $19.99 (one-time)
- Metadata: { credits: 100, type: 'credit_pack' }
```

---

## Step 2: Database Schema (Supabase)

### Users Table:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  credits INTEGER DEFAULT 0,
  free_credits_used INTEGER DEFAULT 0,
  last_free_credit_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Transactions Table:
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  stripe_payment_id TEXT UNIQUE,
  credits INTEGER,
  amount_paid INTEGER, -- in cents
  status TEXT, -- 'pending', 'completed', 'failed'
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Usage Log Table:
```sql
CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  endpoint TEXT,
  credits_used INTEGER DEFAULT 1,
  estimated_cost DECIMAL(10, 6),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Step 3: API Endpoints Needed

### Backend Functions (Vercel):

1. **`/api/create-checkout-session`**
   - Creates Stripe checkout session
   - Returns session URL

2. **`/api/stripe-webhook`**
   - Handles Stripe webhooks
   - Updates user credits on successful payment

3. **`/api/user-credits`**
   - Get user's current credit balance
   - Check if user has free credits available

4. **`/api/use-credit`**
   - Deducts credit before image generation
   - Returns success/failure

---

## Step 4: Frontend Components Needed

1. **CreditBalance Component**
   - Shows current credits
   - "Buy More" button

2. **PricingModal Component**
   - Displays credit packages
   - Stripe checkout integration

3. **FreeCreditBanner Component**
   - Shows free credit available
   - "Claim Free Credit" button

---

## Quick Implementation Checklist

- [ ] Set up Stripe account
- [ ] Create products in Stripe
- [ ] Set up Supabase tables
- [ ] Create checkout API endpoint
- [ ] Create webhook handler
- [ ] Add credit check before image generation
- [ ] Build pricing UI component
- [ ] Add credit balance display
- [ ] Implement free credit system
- [ ] Test payment flow

---

**Want me to help implement the Stripe integration?** I can create the API endpoints and frontend components.

