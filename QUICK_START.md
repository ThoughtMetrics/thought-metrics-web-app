# 🚀 Quick Start Guide - Tracking Links & Analytics

## 📍 Where to Access Everything

### Admin Pages (Web App)

1. **Create Tracking Links**:
   - URL: `http://localhost:4200/admin/create-tracking-link`
   - What it does: Easy form to create tracking links for your campaigns

2. **Analytics Dashboard**:
   - URL: `http://localhost:4200/admin/analytics`
   - What it does: View all tracking data, conversions, and visitor statistics

### API Endpoints (Backend)

Base URL: `http://localhost:3000/api/v1`

- **Create Link**: `POST /analytics/links`
- **View All Links**: `GET /analytics/links`
- **View Overview**: `GET /analytics/overview`
- **View Visitors**: `GET /analytics/visitors`

---

## ⚡ Quick Setup (First Time)

### 1. Start API & Seed Onboarding Survey

```bash
# Terminal 1 - API
cd D:\Projects\thought_metrics\thought-metrics-web-api

# Seed the onboarding survey
npx ts-node src/scripts/seed-onboarding-survey.ts

# Start API
npm run dev
```

### 2. Start Web App

```bash
# Terminal 2 - Web App
cd C:\Projects\thought-metrics-web-app

# Install dependencies (if not done)
yarn install

# Start development server
yarn dev
```

### 3. Access Admin Panel

Open your browser:
- Web App: `http://localhost:4200`
- Create Link: `http://localhost:4200/admin/create-tracking-link`
- Analytics: `http://localhost:4200/admin/analytics`

---

## 🔗 How to Create Your First Campaign Link

### Option 1: Using Admin Panel (Easy!)

1. Go to `http://localhost:4200/admin/create-tracking-link`
2. Fill in the form:
   - **Campaign Name**: "Test Campaign"
   - **UTM Source**: "email"
   - **UTM Medium**: "newsletter"
   - **UTM Campaign**: "test_2024"
3. Click "Create Tracking Link"
4. **Copy the generated link** and share it!

### Option 2: Using API (Postman/cURL)

```bash
curl -X POST http://localhost:3000/api/v1/analytics/links \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Campaign",
    "destinationUrl": "http://localhost:4200/sign-up",
    "utmSource": "email",
    "utmMedium": "newsletter",
    "utmCampaign": "test_2024",
    "redirectToSignup": true,
    "postSignupRedirect": "/survey-campaign"
  }'
```

---

## 📊 How to View Analytics Data

### Option 1: Admin Dashboard (Visual)

1. Go to `http://localhost:4200/admin/analytics`
2. See:
   - 📈 Overview stats (visitors, sessions, page views, registrations)
   - 📋 All tracking links with performance metrics
   - 👥 Recent visitors list
3. Auto-refreshes every 30 seconds!

### Option 2: API Calls (For Integration)

```bash
# View overview stats
curl http://localhost:3000/api/v1/analytics/overview

# View all links with stats
curl http://localhost:3000/api/v1/analytics/links

# View visitors
curl http://localhost:3000/api/v1/analytics/visitors?limit=50

# View specific link details
curl http://localhost:3000/api/v1/analytics/links/<LINK_ID>
```

---

## 🧪 Testing the Complete Flow

### Step-by-Step Test

1. **Create a tracking link** via admin panel
2. **Copy the URL** (e.g., `http://localhost:4200/t/ABC12345`)
3. **Open in incognito window** (simulates new user)
4. Click the link → Should redirect to `/sign-up`
5. **Fill out signup form** and submit
6. After signup → Auto-redirects to `/survey-campaign`
7. **Complete the onboarding survey** (8 questions)
8. **Submit survey** → See success message
9. Click "Start Taking Surveys" → Go to `/survey-boards`

### Verify Data Was Tracked

Go to `http://localhost:4200/admin/analytics` and you should see:
- ✅ **1 unique visitor**
- ✅ **1 registration**
- ✅ **100% conversion rate**
- ✅ **Multiple page views** (signup → survey-campaign → survey-boards)
- ✅ **Survey completion tracked**

---

## 📍 What Gets Tracked Automatically

The system tracks everything:

| Event | When | Data Captured |
|-------|------|---------------|
| **Link Click** | User clicks tracking link | Link ID, timestamp, referrer |
| **Page View** | User views any page | URL, time on page, scroll depth |
| **Signup Start** | User starts filling form | Form ID, field interactions |
| **User Registered** | Signup complete | User ID, email, link source |
| **Survey Viewed** | Survey page loads | Survey ID, question views |
| **Survey Submitted** | Survey completed | Answers, completion time |
| **Navigation** | User navigates site | Full journey path |

---

## 🎯 Campaign Examples

### Email Newsletter
```
Campaign Name: "Monthly Newsletter - January"
UTM Source: email
UTM Medium: newsletter
UTM Campaign: january_2024
```

### Facebook Ad
```
Campaign Name: "Facebook Brand Awareness"
UTM Source: facebook
UTM Medium: paid_social
UTM Campaign: brand_awareness_q1
UTM Content: video_ad_1
```

### Instagram Influencer
```
Campaign Name: "Instagram @influencer"
UTM Source: instagram
UTM Medium: influencer
UTM Campaign: influencer_collab_jan
```

### WhatsApp Referral
```
Campaign Name: "WhatsApp Referral Program"
UTM Source: whatsapp
UTM Medium: referral
UTM Campaign: referral_2024
```

---

## 🔍 Troubleshooting

### "Cannot connect to API"
- Check API is running: `http://localhost:3000/api/health`
- Verify API port in `.env`: `VITE_BASE_URL=http://localhost:3000`

### "Survey not loading"
- Run seed script: `npx ts-node src/scripts/seed-onboarding-survey.ts`
- Check survey exists: `GET http://localhost:3000/api/v1/surveys/TM-ONBOARD-001`

### "Tracking not working"
- Check `public/js/tracker.js` is loaded
- Open browser console, type: `window.ThoughtMetrics`
- Should show tracking object with methods

### "Admin pages not found"
- Check routes are added to Astro
- Pages exist at:
  - `src/pages/admin/create-tracking-link.astro`
  - `src/pages/admin/analytics.astro`

---

## 📁 Important Files

### API
- Onboarding survey seed: `src/scripts/seed-onboarding-survey.ts`
- Survey routes: `src/routes/v1/surveys.route.ts`
- Analytics routes: `src/routes/v1/analytics.route.ts`

### Web App
- Survey form: `src/shared/screens/survey-campaign/onboarding-survey-form.tsx`
- Survey page: `src/shared/screens/survey-campaign/survey-campaign.tsx`
- Admin pages: `src/pages/admin/*.astro`
- Tracker script: `public/js/tracker.js`
- Routes config: `src/routes/routeConfig.ts`

### Documentation
- Full deployment guide: `ONBOARDING_SURVEY_DEPLOYMENT.md`
- Tracking links guide: `TRACKING_LINKS_GUIDE.md`
- This quick start: `QUICK_START.md`

---

## 🎓 Key Metrics to Watch

1. **Conversion Rate**: (Registrations ÷ Unique Visitors) × 100
   - Target: > 10%
   - Good: 15-25%
   - Excellent: > 25%

2. **Survey Completion Rate**: (Survey Completions ÷ Registrations) × 100
   - Target: > 80%

3. **Time to Signup**: How long from click to registration
   - Target: < 5 minutes

4. **Drop-off Points**: Where users abandon the flow
   - Check page views to find bottlenecks

---

## 💡 Pro Tips

1. **Use descriptive campaign names** - You'll thank yourself later
2. **Keep UTM parameters consistent** - Use lowercase, underscores
3. **Test links in incognito** - Simulates new user experience
4. **Monitor conversion rates** - Optimize underperforming campaigns
5. **A/B test content** - Use `utm_content` for variants
6. **Set link expiration** - For time-limited campaigns
7. **Export data regularly** - Build reports from analytics API

---

## 🆘 Need Help?

- Check browser console for errors
- View API logs for backend issues
- Read full guides:
  - `ONBOARDING_SURVEY_DEPLOYMENT.md`
  - `TRACKING_LINKS_GUIDE.md`
- Test tracker: `localStorage` should have `tm_*` keys

---

## 🚀 Next Steps

After testing locally:

1. ✅ Create real campaigns with production URLs
2. ✅ Monitor conversion rates in admin dashboard
3. ✅ Export survey responses for analysis
4. ✅ Build custom reports from analytics API
5. ✅ Set up alerts for low conversion rates
6. ✅ A/B test different landing pages
7. ✅ Integrate with email marketing tools

---

**You're all set!** 🎉

Start creating tracking links and watch your campaigns come to life!
