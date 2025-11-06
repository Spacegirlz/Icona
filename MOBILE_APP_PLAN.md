# ICONA Mobile App Development Plan 📱

## Goal: Launch on App Store & Google Play

**Timeline:** 6-8 weeks  
**Focus:** LinkedIn Professional Headshots + Era Transformations  
**Future:** Meme Generation

---

## Phase 1: Mobile App Foundation (Week 1-2)

### Setup & Core Features

**Week 1: Project Setup**
- [ ] Initialize Expo project
- [ ] Install dependencies (NativeWind, Navigation, Camera)
- [ ] Port core components from web
- [ ] Set up navigation structure

**Week 2: Core Features**
- [ ] Camera integration (take photo)
- [ ] Photo picker (choose from gallery)
- [ ] Image upload flow
- [ ] Basic UI port from web

---

## Phase 2: Professional Features (Week 3-4)

### LinkedIn Professional Headshots (Priority)

**Week 3: Professional Archetypes**
- [ ] Professional archetype selection UI
- [ ] Executive Presence preset
- [ ] Creative Confidence preset
- [ ] Future Forward (Tech) preset
- [ ] Trusted Partner (Sales) preset
- [ ] Seasoned Expert (Advisor) preset

**Week 4: Professional Optimization**
- [ ] LinkedIn-optimized image output (1:1 square)
- [ ] Professional styling preview
- [ ] Share to LinkedIn integration
- [ ] Save to photo library

---

## Phase 3: Payments & Credits (Week 5-6)

**Week 5: Credit System**
- [ ] Credit balance display
- [ ] Credit packages UI
- [ ] Stripe integration (backend)
- [ ] Credit deduction logic

**Week 6: In-App Purchases**
- [ ] iOS in-app purchases
- [ ] Android in-app purchases
- [ ] Purchase flow
- [ ] Free trial system

---

## Phase 4: Era Transformations (Week 7)

**Week 7: Creative Features**
- [ ] Port era selection to mobile
- [ ] Quick Hits presets
- [ ] Adventure Builder flow
- [ ] Manual prompt mode

---

## Phase 5: Launch Preparation (Week 8)

**Week 8: Polish & Submit**
- [ ] App store assets (screenshots, descriptions)
- [ ] Testing on devices
- [ ] App store submission
- [ ] Marketing materials

---

## Technical Implementation

### Expo Project Structure:
```
mobile/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Home/Camera
│   │   ├── professional.tsx   # Professional Headshots
│   │   ├── creative.tsx        # Era Transformations
│   │   └── profile.tsx         # Credits/Account
│   └── _layout.tsx
├── components/
│   ├── CameraView.tsx
│   ├── ProfessionalPicker.tsx
│   ├── CreditBalance.tsx
│   └── ... (port from web)
├── services/
│   └── api.ts                 # API calls (reuse backend)
└── utils/
    └── ... (reuse from web)
```

### Key Features to Port:
1. **Professional Presets** - Your best differentiator
2. **Credit System** - Payment integration
3. **Image Generation** - Reuse backend API
4. **Share Functionality** - Native sharing

---

## LinkedIn Professional Focus

### App Store Positioning:
- **Title:** "ICONA - Professional LinkedIn Headshots"
- **Subtitle:** "AI-powered professional portraits"
- **Keywords:** LinkedIn, headshot, professional, portrait, AI

### Features to Highlight:
1. **Professional Archetypes** (unique!)
2. **LinkedIn-optimized** (square format)
3. **Instant results** (2 minutes vs 2 hours)
4. **Professional quality** ($0.25 vs $200 photographer)

---

## Meme Development (Future Phase)

### Meme Features to Add:
1. **Meme Templates:**
   - Before/After format
   - Comparison format
   - "Me vs Me" format

2. **Era + Meme:**
   - "Professional me vs Creative me"
   - "LinkedIn me vs Real me"
   - "Work me vs Weekend me"

3. **Social Sharing:**
   - Share to Instagram Stories
   - Share to TikTok
   - Share to Twitter

---

## Revenue Projections (Mobile)

### Conservative (First Month):
- **Downloads:** 1,000
- **Conversion:** 5% = 50 paying users
- **Average:** 2 headshots/user = 100 purchases
- **Revenue:** 100 × $0.33 = $33/month
- **Costs:** 100 × $0.045 = $4.50/month
- **Profit:** $28.50/month (86% margin)

### Moderate (Month 3):
- **Downloads:** 5,000
- **Conversion:** 8% = 400 paying users
- **Average:** 3 headshots/user = 1,200 purchases
- **Revenue:** 1,200 × $0.30 = $360/month
- **Costs:** 1,200 × $0.045 = $54/month
- **Profit:** $306/month (85% margin)

### Successful (Month 6):
- **Downloads:** 20,000
- **Conversion:** 10% = 2,000 paying users
- **Average:** 4 headshots/user = 8,000 purchases
- **Revenue:** 8,000 × $0.28 = $2,240/month
- **Costs:** 8,000 × $0.045 = $360/month
- **Profit:** $1,880/month (84% margin)

---

## App Store Optimization

### iOS App Store:
- **Category:** Photography
- **Keywords:** LinkedIn, headshot, professional, portrait, AI, photo
- **Screenshots:** Show before/after professional headshots
- **Description:** Focus on LinkedIn professional market

### Google Play:
- **Category:** Photography
- **Keywords:** Same as iOS
- **Screenshots:** Professional results
- **Description:** Professional headshots for LinkedIn

---

## Next Steps

1. **Set up Expo project** (this week)
2. **Port professional features** (priority)
3. **Add credit system**
4. **Test on devices**
5. **Submit to app stores**

**Ready to start? I can help set up the Expo project and begin porting features!** 🚀

