# Seed Script Fix - Delete and Recreate Behavior

## Issue
The `yarn seed:surveys` command was skipping all 20 surveys because they already existed in the database, instead of updating them with fresh translation data.

## Root Cause
I initially edited the wrong file! There are TWO seed scripts:
- `src/scripts/seed-surveys.ts` ← **Actually runs** (configured in package.json)
- `src/scripts/seed-surveys-new.ts` ← I edited this by mistake

## Fix Applied

**File:** `D:\Projects\thought_metrics\thought-metrics-web-api\src\scripts\seed-surveys.ts`

**Lines 328-340:**
```typescript
// BEFORE (skip behavior)
const existingTemplate = await SurveyTemplate.findOne({ surveyId });
if (existingTemplate) {
  logger.info(`${progress} ⏭️  ${surveyId} - already exists`);
  skipCount++;
  continue;
}

// AFTER (delete and recreate behavior)
const existingTemplate = await SurveyTemplate.findOne({ surveyId });
if (existingTemplate) {
  logger.info(`${progress} 🔄 Removing existing ${surveyId} for recreation...`);

  // Delete from MongoDB
  await SurveyTemplate.deleteOne({ surveyId });

  // Delete from MySQL
  await surveyRepo.delete({ surveyId });

  logger.info(`${progress} ✅ Deleted existing ${surveyId} from both databases`);
}
```

## Expected Output

When you run the seed command now, you should see:

```bash
yarn seed:surveys

[1/20] 🔄 Removing existing TM-T001 for recreation...
[1/20] ✅ Deleted existing TM-T001 from both databases
[1/20] ✅ TM-T001: Technology Adoption Survey
       Industry: TECHNOLOGY | ₹40 | 5 min | 🌐 EN+TA

[2/20] 🔄 Removing existing TM-F002 for recreation...
[2/20] ✅ Deleted existing TM-F002 from both databases
[2/20] ✅ TM-F002: FMCG Product Survey
       Industry: FMCG | ₹35 | 8 min | 🌐 EN+TA

...

📊 SEED SUMMARY
======================================================================
✅ Successfully seeded: 20
❌ Failed: 0
⏭️  Skipped: 0
```

## How to Test

1. **Run the seed command:**
   ```bash
   cd D:\Projects\thought_metrics\thought-metrics-web-api
   yarn seed:surveys
   ```

2. **Verify all 20 surveys are recreated:**
   - Look for "✅ Successfully seeded: 20"
   - Check "⏭️ Skipped: 0"

3. **Test API with Tamil translations:**
   ```bash
   curl "http://localhost:3000/api/v1/surveys?lang=ta"
   ```

4. **Test frontend:**
   - Navigate to `http://localhost:4200/survey-boards`
   - Click "தமிழ்" language toggle
   - All survey cards should show Tamil labels

## What Changed

1. ✅ Seed script now deletes existing surveys from **both** databases (MongoDB + MySQL)
2. ✅ All 20 surveys get recreated with fresh English + Tamil translations
3. ✅ No more "already exists" skipping
4. ✅ TypeScript compilation clean with no errors

## Files Modified

- `src/scripts/seed-surveys.ts` - Added delete-and-recreate logic

## Next Step

**Run the seed command now to populate all translations:**
```bash
cd D:\Projects\thought_metrics\thought-metrics-web-api
yarn seed:surveys
```
