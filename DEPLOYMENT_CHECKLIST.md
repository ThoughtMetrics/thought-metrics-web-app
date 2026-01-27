# Deployment Checklist - Favicon & WWW Redirect Fix

**Before proceeding:** All code changes are complete and built. You just need to configure GoDaddy and deploy.

---

## Step 1: Enable Path Forwarding in GoDaddy

### Instructions

1. **Log in to GoDaddy** → My Products → Domains
2. **Find** `thoughtmetrics.com`
3. **Click** "DNS" or "Manage" → Look for "Forwarding" settings
4. **Edit** the existing forward rule to `www.thoughtmetrics.com`

### Required Settings

| Setting | Value |
|---------|-------|
| **Source** | `thoughtmetrics.com` (or `@`) |
| **Destination** | `https://www.thoughtmetrics.com` |
| **Redirect type** | 301 (Permanent) |
| **Forward path** | ✅ **ENABLED** ← **CRITICAL** |

### What "Forward path" Does

Without it:
```
❌ https://thoughtmetrics.com/industries/retail → https://www.thoughtmetrics.com/
   (loses the path, goes to homepage)
```

With it enabled:
```
✅ https://thoughtmetrics.com/industries/retail → https://www.thoughtmetrics.com/industries/retail
   (preserves the path)
```

### GoDaddy Interface Variations

The setting might be labeled as:
- "Forward path" (checkbox)
- "Forward with path" (toggle)
- "Forward subdirectories" (option)
- "Include request URI" (advanced)

**Enable whichever option preserves the URL path.**

### Save & Wait

- Click **Save**
- Wait **5-10 minutes** for DNS propagation
- Proceed to Step 2

---

## Step 2: Deploy the Application

### Option A: Docker Deployment (Recommended)

```bash
# Build Docker image
yarn docker:build

# Run container
yarn docker:run

# Or push to your container registry
docker tag thought-metrics-web-app:latest your-registry/thought-metrics-web-app:latest
docker push your-registry/thought-metrics-web-app:latest
```

### Option B: Deploy dist/ folder

If using Azure App Service, Netlify, Vercel, or similar:

1. The `dist/` folder is already built (from `yarn build`)
2. Deploy the entire `dist/` folder to your hosting
3. Ensure `public/` folder assets are included:
   - `favicon.ico`
   - `favicon-48.png`
   - `favicon.svg`
   - `apple-touch-icon.png`
   - `manifest.json`

### Important Files to Verify

After deployment, ensure these files exist on the server:

```
/dist/server/entry.mjs          ← Astro SSR server (includes middleware)
/dist/client/_astro/            ← Static assets
/public/favicon.ico             ← NEW
/public/favicon-48.png          ← NEW
/public/favicon.svg             ← Existing
/public/apple-touch-icon.png    ← NEW
/public/manifest.json           ← Updated
```

---

## Step 3: Verify Deployment

### Quick Manual Test

Open these URLs in your browser (incognito mode):

1. **Non-www redirect:**
   - Go to: `https://thoughtmetrics.com/industries/retail`
   - Should redirect to: `https://www.thoughtmetrics.com/industries/retail`
   - **Check URL bar** → Should show `www.thoughtmetrics.com`

2. **Favicon visible:**
   - Visit: `https://www.thoughtmetrics.com/`
   - **Check browser tab** → Should show favicon icon

3. **Favicon files accessible:**
   - Visit: `https://www.thoughtmetrics.com/favicon.ico`
   - Should download/display a small icon file (not 404)

### Automated Verification Script

Run the verification script from your local machine:

```bash
# Make executable (Linux/Mac)
chmod +x verify-deployment.sh

# Run tests
./verify-deployment.sh
```

**Or on Windows (Git Bash):**
```bash
bash verify-deployment.sh
```

### Expected Output

```
===== 1. WWW Redirect Tests =====
Testing: Root domain redirect... ✓ PASS (301 → https://www.thoughtmetrics.com/)
Testing: Path redirect (research-methods)... ✓ PASS (301 → https://www.thoughtmetrics.com/research-methods/quantitative-research)
Testing: Path redirect (industries)... ✓ PASS (301 → https://www.thoughtmetrics.com/industries/retail)

===== 2. Favicon Accessibility Tests =====
Testing: favicon.ico (www)... ✓ PASS (200 OK)
Testing: favicon-48.png (www)... ✓ PASS (200 OK)
Testing: favicon.svg (www)... ✓ PASS (200 OK)
Testing: apple-touch-icon.png (www)... ✓ PASS (200 OK)

===== Test Summary =====
Passed: 15
Failed: 0
✓ All tests passed! Deployment successful.
```

---

## Step 4: Monitor Google Search Console

### What to Do

1. **Log in to Google Search Console**
2. **Do NOT resubmit URLs** (unnecessary)
3. **Wait 3-7 days** for Google to recrawl
4. **Check Coverage report** for recrawl activity

### What to Expect

| Timeline | What Happens |
|----------|--------------|
| **Immediate** | Favicon accessible on all pages |
| **3-7 days** | Google recrawls and detects consistent signals |
| **7-14 days** | **Favicon appears in Google SERP** |

### Verification in Search Console

After 7-14 days:
1. Go to **Search Console** → **Coverage**
2. Check any indexed URL → Click "View crawled page"
3. **Screenshot tab** → Should show favicon

---

## Troubleshooting

### Issue: Non-www paths still return 405

**Cause:** GoDaddy "Forward path" not enabled

**Fix:**
1. Double-check GoDaddy settings
2. Ensure "Forward path" checkbox is **checked**
3. Wait 10 minutes for DNS propagation
4. Clear browser cache and retry

### Issue: Favicon files return 404

**Cause:** Files not deployed to production

**Fix:**
1. Verify `public/` folder was included in deployment
2. Check server file system for `/public/favicon-48.png`
3. Re-deploy if files are missing

### Issue: Favicon shows in tab but not in Google SERP

**Cause:** Google hasn't recrawled yet

**Fix:**
1. **Wait 7-14 days** (this is normal)
2. Ensure all other checks pass (redirects, canonical tags)
3. Do NOT repeatedly resubmit URLs (counterproductive)

### Issue: Redirect works but middleware not executing

**Cause:** GoDaddy redirect is handling everything (which is fine)

**Fix:**
- No fix needed! GoDaddy redirect is working correctly
- Middleware is a backup that only runs if GoDaddy fails
- Both existing = **redundancy** (good thing)

---

## Post-Deployment Actions

### ✅ Immediate (Today)

- [ ] Enable "Forward path" in GoDaddy
- [ ] Deploy application to production
- [ ] Run `verify-deployment.sh` script
- [ ] Verify all tests pass

### ✅ Within 1 Week

- [ ] Check favicon visible in browser tabs
- [ ] Verify non-www URLs redirect properly
- [ ] Monitor Google Search Console for recrawl activity

### ✅ Within 2 Weeks

- [ ] Check if favicon appears in Google SERP
- [ ] Search for `site:thoughtmetrics.com` and verify branding
- [ ] Mark this ticket as resolved

---

## Success Criteria

All of these must be true:

1. ✅ `https://thoughtmetrics.com/any/path` → 301 → `https://www.thoughtmetrics.com/any/path`
2. ✅ All favicon files accessible at `/favicon.ico`, `/favicon-48.png`, `/favicon.svg`
3. ✅ Canonical tags point to `https://www.thoughtmetrics.com`
4. ✅ Favicon visible in browser tabs
5. ✅ Favicon appears in Google SERP (within 7-14 days)

---

## Questions or Issues?

If verification fails:
1. Share the output of `verify-deployment.sh`
2. Provide screenshot of GoDaddy forwarding settings
3. Confirm deployment method used

**Current Status:** Ready for deployment ✅
