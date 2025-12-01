# Onboarding Survey Deployment Guide

## Overview
This guide walks you through deploying the complete onboarding survey system with tracking links.

## What Was Implemented

### API Side
1. **Onboarding Survey Seed Script** (`D:\Projects\thought_metrics\thought-metrics-web-api\src\scripts\seed-onboarding-survey.ts`)
   - Creates a dedicated onboarding survey (ID: `TM-ONBOARD-001`)
   - 8 questions covering: age, employment, income, product interests, brand loyalty, shopping habits, social media, and devices
   - Bilingual support (English + Tamil)
   - No payment (free onboarding survey)

2. **Analytics System** (Already exists from COMPLETE_GUIDE.md)
   - Tracking links
   - Analytics events
   - Visitor tracking
   - Link registrations

### Web App Side
1. **Onboarding Survey Form Component** (`src/shared/screens/survey-campaign/onboarding-survey-form.tsx`)
   - Progressive question-by-question UI
   - Progress bar and navigation
   - Single and multiple choice support
   - Validation and error handling
   - Submission to API

2. **Updated Survey Campaign Page** (`src/shared/screens/survey-campaign/survey-campaign.tsx`)
   - Fetches onboarding survey automatically
   - Shows survey form instead of static welcome page
   - Success screen after completion
   - Redirects to survey boards

3. **Tracking Integration** (Already done in COMPLETE_GUIDE.md)
   - Tracker script (`public/js/tracker.js`)
   - Signup integration
   - Post-signup redirect handling

## Deployment Steps

### Step 1: Deploy API Changes

#### 1.1. Run Database Migration (if not already done)
```bash
cd D:\Projects\thought_metrics\thought-metrics-web-api

# Run analytics tables migration
npx ts-node src/scripts/migrate.ts
```

#### 1.2. Seed Onboarding Survey
```bash
cd D:\Projects\thought_metrics\thought-metrics-web-api

# Create the onboarding survey
npx ts-node src/scripts/seed-onboarding-survey.ts
```

Expected output:
```
🚀 Starting onboarding survey seed process...
📡 Connecting to databases...
✅ Connected to MongoDB
✅ Connected to MySQL

✅ Survey ID: TM-ONBOARD-001
✅ Template ID (MongoDB): <mongo-id>
✅ Survey ID (MySQL): <mysql-id>
✅ Total Questions: 8
🌐 Languages: English + Tamil
⏱️  Duration: X.XXs
🎉 Onboarding survey created successfully!
```

#### 1.3. Verify API Endpoints
Test the endpoints:
```bash
# Get onboarding survey
curl http://localhost:3000/api/v1/surveys/TM-ONBOARD-001

# Get survey template
curl http://localhost:3000/api/v1/survey-templates/<template-id>
```

### Step 2: Deploy Web App Changes

#### 2.1. Install Dependencies (if needed)
```bash
cd C:\Projects\thought-metrics-web-app

yarn install
```

#### 2.2. Build Application
```bash
yarn build
```

#### 2.3. Test Locally
```bash
# Development mode
yarn dev

# Or preview production build
yarn preview
```

### Step 3: Test Complete Flow

#### 3.1. Create a Test Tracking Link

Using the API (or admin panel), create a tracking link:

```bash
POST http://localhost:3000/api/v1/analytics/links

{
  "name": "Test Onboarding Campaign",
  "destinationUrl": "http://localhost:4200/sign-up",
  "utmSource": "test",
  "utmMedium": "email",
  "utmCampaign": "onboarding_test",
  "redirectToSignup": true,
  "postSignupRedirect": "/survey-campaign"
}
```

Response will include:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "shortCode": "ABC12345",
    "trackingUrl": "/t/ABC12345",
    "fullTrackingUrl": "http://localhost:4200/t/ABC12345"
  }
}
```

#### 3.2. Test User Journey

1. **Click Tracking Link**: Visit `http://localhost:4200/t/ABC12345`
   - Should redirect to `/sign-up` with `tm_link_id` parameter

2. **Complete Signup**: Fill out and submit signup form
   - After successful signup, should automatically redirect to `/survey-campaign`

3. **Complete Onboarding Survey**: Answer all 8 questions
   - Progress bar should update
   - Navigation should work (Previous/Next)
   - Validation should work

4. **Submit Survey**: Click "Submit Survey" on last question
   - Should show success screen
   - "Start Taking Surveys" button should redirect to `/survey-boards`

5. **Verify Data in Database**:
   ```bash
   # Check MongoDB for survey response
   db.surveyresponses.find({ surveyId: "TM-ONBOARD-001" })

   # Check MySQL analytics
   SELECT * FROM analytics_events WHERE utm_campaign = 'onboarding_test';
   SELECT * FROM link_registrations;
   SELECT * FROM visitors;
   ```

## Complete User Flow Diagram

```
┌─────────────────────┐
│  User clicks link   │
│  /t/ABC12345        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Redirected to      │
│  /sign-up?          │
│  tm_link_id=xxx&    │
│  redirect_after=... │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  User completes     │
│  signup form        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  onRegistered()     │
│  called by tracker  │
│  - Tracks event     │
│  - Gets redirect    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Redirected to      │
│  /survey-campaign   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Onboarding survey  │
│  loaded & displayed │
│  (8 questions)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  User answers       │
│  questions          │
│  (progress tracked) │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Survey submitted   │
│  to API             │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Success screen     │
│  shown              │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  User clicks        │
│  "Start Taking      │
│  Surveys"           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Redirected to      │
│  /survey-boards     │
└─────────────────────┘
```

## Survey Questions Reference

The onboarding survey collects:

1. **Age Range** (Single Choice)
   - 18-24, 25-34, 35-44, 45-54, 55-64, 65+

2. **Employment Status** (Single Choice)
   - Full-time, Part-time, Self-employed, Student, Homemaker, Retired, Unemployed

3. **Monthly Household Income** (Single Choice)
   - Various ranges from Below ₹25K to Above ₹5L
   - Option to prefer not to say

4. **Product Categories of Interest** (Multiple Choice)
   - Technology, Personal Care, Food & Beverages, Fashion, Healthcare, Automotive, Home & Furniture, Finance, Entertainment, Travel

5. **Brand Loyalty** (Single Choice)
   - Very loyal, Somewhat loyal, Not loyal, Price-driven

6. **Online Shopping Frequency** (Single Choice)
   - Daily, Several times a week, Once a week, etc.

7. **Social Media Platforms** (Multiple Choice)
   - Facebook, Instagram, Twitter/X, LinkedIn, YouTube, WhatsApp, Snapchat, TikTok, Pinterest, Reddit

8. **Device Ownership** (Multiple Choice)
   - Smartphones (Android/iPhone), Tablet, Laptop, Desktop, Smart TV, Smartwatch, Gaming Console

## Analytics Tracked

The system tracks:
- **Page views**: When users view survey-campaign page
- **User registration**: When signup completes
- **Survey completion**: When onboarding survey submitted
- **UTM parameters**: Source, medium, campaign, etc.
- **Visitor journey**: Full timeline of user interactions
- **Link performance**: Clicks, conversions, registrations per link

## Admin Features

### View Analytics Dashboard
```bash
GET /api/v1/analytics/overview?linkId=<link-id>
GET /api/v1/analytics/links
GET /api/v1/analytics/visitors
```

### View Survey Responses
```bash
GET /api/v1/surveys/TM-ONBOARD-001/responses
```

## Troubleshooting

### Survey Not Loading
- Check API is running: `http://localhost:3000`
- Verify onboarding survey exists: `GET /api/v1/surveys/TM-ONBOARD-001`
- Check browser console for errors

### Redirect Not Working
- Verify tracker.js is loaded: Check browser console
- Check localStorage for `tm_redirect_after_signup`
- Verify tracking link has correct `postSignupRedirect` value

### Survey Submission Failing
- Check user is authenticated
- Verify all required questions are answered
- Check API endpoint: `POST /api/v1/surveys/responses`
- Look for validation errors in browser console

## Production Deployment

### Environment Variables Required

**API (.env)**:
```env
PUBLIC_SITE_URL=https://www.thoughtmetrics.com
```

**Web App (.env)**:
```env
VITE_BASE_URL=https://api.thoughtmetrics.com
```

### Docker Deployment

Both API and Web App have been optimized with multi-stage Docker builds. See main Dockerfile for details.

```bash
# Build API
cd thought-metrics-web-api
docker build -t thought-metrics-api .

# Build Web App
cd thought-metrics-web-app
docker build -t thought-metrics-web .
```

## Security Notes

1. **Authentication**: Survey submission requires authenticated user
2. **Validation**: All answers validated on backend
3. **Rate Limiting**: Consider adding rate limits to prevent abuse
4. **CORS**: Ensure proper CORS configuration for cross-origin requests

## Support

For issues:
1. Check application logs
2. Verify database connections
3. Test API endpoints manually
4. Check browser console for frontend errors

## Next Steps

After successful deployment:
1. Create tracking links for different campaigns
2. Monitor analytics dashboard
3. Export survey responses for analysis
4. Customize survey questions as needed (modify seed script and re-run)
5. Add more survey types for different user segments
