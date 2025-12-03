# Allocated Survey ID Integration Summary

## Overview
This document summarizes the integration of `allocatedSurveyId` field across the backend and frontend systems to support directing users to specific surveys after campaign sign-up.

## Changes Made

### Backend Changes

#### 1. Database Migration
**File:** `D:\Projects\thought_metrics\thought-metrics-web-api\src\migrations\1735600000000-AddAllocatedSurveyIdToTrackingLinks.ts`

Created migration to add `allocated_survey_id` column to `tracking_links` table:
- Column type: `varchar(50)`
- Nullable: `true`
- Comment: "Optional specific survey ID to redirect user to after signup"

**To run migration:**
```bash
cd D:\Projects\thought_metrics\thought-metrics-web-api
npm run migration:run
```

#### 2. Entity Update
**File:** `D:\Projects\thought_metrics\thought-metrics-web-api\src\models\mysql\tracking-link.entity.ts`

Added field to TrackingLink entity:
```typescript
@Column({ name: "allocated_survey_id", type: "varchar", length: 50, nullable: true })
allocatedSurveyId?: string;
```

#### 3. Service Update
**File:** `D:\Projects\thought_metrics\thought-metrics-web-api\src\services\analytics.service.ts`

Updated `createTrackingLink` method:
- Added `allocatedSurveyId?: string` to method parameters
- Included `allocatedSurveyId` when creating tracking link entity

#### 4. Controller Updates
**File:** `D:\Projects\thought_metrics\thought-metrics-web-api\src\controllers\analytics.controller.ts`

**a) createTrackingLink method:**
- Extracts `allocatedSurveyId` from request body
- Passes it to the service method

**b) handleRedirect method:**
- Adds `allocated_survey` query parameter to redirect URL when `allocatedSurveyId` is present
- Format: `?allocated_survey={surveyId}`

### Frontend Changes

The frontend was already properly configured to handle `allocatedSurveyId`:

#### 1. Service Interface
**File:** `C:\Projects\thought-metrics-web-app\src\services\api\tracking-link.service.ts`

Already includes:
- `allocatedSurveyId?: string` in `CreateTrackingLinkData` interface
- `allocatedSurveyId?: string` in `TrackingLink` interface
- Proper handling in `createTrackingLink` method (lines 90-92)

#### 2. Form Component
**File:** `C:\Projects\thought-metrics-web-app\src\shared\screens\admin\tracking-links\TrackingLinkForm.tsx`

Already includes:
- Form field for allocatedSurveyId (lines 171-178)
- State management for the field
- Proper submission handling

#### 3. Campaign Landing Page
**File:** `C:\Projects\thought-metrics-web-app\src\shared\screens\survey-campaign\SurveyCampaignPage.tsx`

Already configured to:
- Read `allocated_survey` from URL parameters
- Store in localStorage as `tm_allocated_survey`
- Display appropriate UI based on allocated survey presence

#### 4. Tracking Script
**File:** `C:\Projects\thought-metrics-web-app\public\js\tracker.js`

Already configured to:
- Check for `tm_allocated_survey` in localStorage
- Redirect to `/surveys/{surveyId}` if present
- Clean up localStorage after redirect

## Integration Flow

### Complete User Journey with Allocated Survey

```
1. Admin creates tracking link with allocatedSurveyId="TM-AM001"
   ↓
2. User clicks: http://localhost:3000/t/{shortCode}
   ↓
3. Backend redirects to:
   http://localhost:4200/survey-campaign?tm_link_id=xxx&allocated_survey=TM-AM001
   ↓
4. Survey Campaign Page:
   - Stores tm_allocated_survey="TM-AM001" in localStorage
   - Shows "Register Now" (if not logged in)
   ↓
5. User completes signup
   ↓
6. tracker.js onUserRegistered():
   - Reads tm_allocated_survey from localStorage
   - Redirects to: /surveys/TM-AM001
   - Cleans up localStorage
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN CREATES LINK                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
        Frontend Form (allocatedSurveyId: "TM-AM001")
                              ↓
        POST /api/v1/analytics/links
                              ↓
        Backend Controller extracts allocatedSurveyId
                              ↓
        Backend Service saves to database
                              ↓
        tracking_links.allocated_survey_id = "TM-AM001"

┌─────────────────────────────────────────────────────────────┐
│                    USER CLICKS LINK                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
        GET /t/{shortCode}
                              ↓
        Backend Controller.handleRedirect()
                              ↓
        Reads link.allocatedSurveyId from database
                              ↓
        Adds ?allocated_survey=TM-AM001 to redirect URL
                              ↓
        302 Redirect to survey-campaign page
                              ↓
        Frontend reads allocated_survey param
                              ↓
        Stores in localStorage: tm_allocated_survey
                              ↓
        User signs up
                              ↓
        tracker.js redirects to /surveys/TM-AM001
```

## Verification Checklist

### Backend Verification
- [x] Migration file created
- [ ] Migration executed successfully
- [x] Entity updated with allocatedSurveyId field
- [x] Service accepts and saves allocatedSurveyId
- [x] Controller extracts allocatedSurveyId from request
- [x] Redirect handler includes allocated_survey in URL

### Frontend Verification
- [x] Service interface includes allocatedSurveyId
- [x] Form has input field for allocatedSurveyId
- [x] Campaign page reads allocated_survey param
- [x] tracker.js handles allocated survey redirect

### Integration Testing
- [ ] Create tracking link with allocatedSurveyId via admin panel
- [ ] Verify database has allocated_survey_id populated
- [ ] Click tracking link in incognito window
- [ ] Verify redirect URL contains allocated_survey param
- [ ] Complete signup flow
- [ ] Verify redirect to /surveys/{surveyId}

## Files Modified

### Backend
1. `src/migrations/1735600000000-AddAllocatedSurveyIdToTrackingLinks.ts` (NEW)
2. `src/models/mysql/tracking-link.entity.ts` (MODIFIED)
3. `src/services/analytics.service.ts` (MODIFIED)
4. `src/controllers/analytics.controller.ts` (MODIFIED)

### Frontend
No changes required - already properly configured.

### Documentation
1. `CAMPAIGN_TRACKING_COMPLETE_GUIDE.md` (already documented)
2. `ALLOCATED_SURVEY_ID_INTEGRATION_SUMMARY.md` (NEW)

## Next Steps

1. **Run Migration:**
   ```bash
   cd D:\Projects\thought_metrics\thought-metrics-web-api
   npm run migration:run
   ```

2. **Verify Database:**
   ```sql
   DESCRIBE tracking_links;
   -- Should show allocated_survey_id column
   ```

3. **Test Create Link:**
   - Navigate to: http://localhost:4200/admin/create-tracking-link
   - Fill in all fields including "Allocated Survey ID"
   - Create link and verify success

4. **Test Redirect Flow:**
   - Copy tracking link
   - Open incognito window
   - Click link
   - Verify URL has `allocated_survey` param

5. **Test Complete Flow:**
   - Complete signup in incognito window
   - Verify redirect to `/surveys/{surveyId}`

## Troubleshooting

### Migration fails
**Solution:** Check if column already exists:
```sql
SELECT COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'tracking_links'
AND COLUMN_NAME = 'allocated_survey_id';
```

### Allocated survey not in redirect URL
**Check:**
- Database has allocated_survey_id populated
- Backend controller includes the code (line 123-125)
- Backend is restarted after code changes

### User redirects to survey-boards instead of specific survey
**Check:**
- URL contains `allocated_survey` parameter
- localStorage has `tm_allocated_survey` key
- tracker.js is loaded properly
- Console for any JavaScript errors

## References

- Campaign Tracking Guide: `CAMPAIGN_TRACKING_COMPLETE_GUIDE.md`
- Backend Entity: `src/models/mysql/tracking-link.entity.ts`
- Frontend Service: `src/services/api/tracking-link.service.ts`
- Tracking Script: `public/js/tracker.js`

## Status

- **Backend Code:** ✅ Complete
- **Frontend Code:** ✅ Already complete
- **Migration:** ⏳ Pending execution
- **Testing:** ⏳ Pending

---

**Last Updated:** 2024-12-03
**Integration Status:** Ready for migration execution and testing
