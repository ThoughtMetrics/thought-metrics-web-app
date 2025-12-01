# OAuth Redirect Flow Setup Guide

This document provides comprehensive instructions for implementing Firebase OAuth redirect flow in production. The redirect flow is currently **disabled** in favor of popup flow for R&D purposes, but this guide preserves all knowledge for future production implementation.

## Table of Contents

- [Why Redirect Flow?](#why-redirect-flow)
- [Popup vs Redirect Comparison](#popup-vs-redirect-comparison)
- [Cross-Origin Storage Issue](#cross-origin-storage-issue)
- [Prerequisites](#prerequisites)
- [GCP OAuth Configuration](#gcp-oauth-configuration)
- [Firebase Configuration](#firebase-configuration)
- [Implementation Guide](#implementation-guide)
- [Diagnostic Logging](#diagnostic-logging)
- [Production Deployment Checklist](#production-deployment-checklist)
- [Troubleshooting](#troubleshooting)
- [Code References](#code-references)

---

## Why Redirect Flow?

The redirect flow is recommended for production environments because:

1. **Better Mobile Support**: Works reliably on all mobile browsers, including those that block popups
2. **Better User Experience**: No popup blockers to deal with
3. **More Secure**: Reduces cross-site scripting risks by keeping the OAuth flow within the same browsing context
4. **Firebase Recommended**: Official Firebase documentation recommends redirect flow for production apps

However, redirect flow has a critical limitation on localhost due to browser security restrictions.

---

## Popup vs Redirect Comparison

### Popup Flow (Currently Active)

**Pros:**
- Works perfectly on localhost
- Immediate feedback (no page navigation)
- Simpler to implement and debug
- User stays on the same page

**Cons:**
- Can be blocked by popup blockers
- May not work on some mobile browsers
- Less secure (potential for clickjacking)

**Implementation:**
```typescript
async signInWithGoogle(): Promise<UserProfile> {
  await ensureAuthPersistence();
  const provider = this.getGoogleProvider();
  const result = await signInWithPopup(auth, provider);
  await this.syncUserToBackend(result.user);
  return await this.getUserProfile();
}
```

### Redirect Flow (For Production)

**Pros:**
- Works on all browsers and devices
- No popup blockers
- More secure
- Firebase recommended approach

**Cons:**
- Doesn't work properly on localhost (cross-origin issue)
- Requires page navigation
- More complex to implement and debug
- Need to handle redirect result on app initialization

**Implementation:**
```typescript
// Initiate redirect
async signInWithGoogle(): Promise<void> {
  await ensureAuthPersistence();
  const provider = this.getGoogleProvider();
  sessionStorage.setItem('auth_redirect_pending', 'true');
  await signInWithRedirect(auth, provider);
}

// Handle redirect result (call on app initialization)
async handleRedirectResult(): Promise<UserProfile | null> {
  await ensureAuthPersistence();
  const result = await getRedirectResult(auth);
  if (result) {
    await this.syncUserToBackend(result.user);
    return await this.getUserProfile();
  }
  return null;
}
```

---

## Cross-Origin Storage Issue

### The Problem

When using redirect flow on localhost, you encounter a **cross-origin storage restriction**:

1. **Redirect Initiation**: User initiates OAuth on `localhost:4200`
2. **OAuth Processing**: Firebase redirects to `thought-metrics.firebaseapp.com/__/auth/handler` to process OAuth
3. **Auth State Storage**: Firebase stores auth state in IndexedDB under `thought-metrics.firebaseapp.com` origin
4. **Redirect Back**: Firebase redirects back to `localhost:4200`
5. **Storage Access Blocked**: Browser security prevents `localhost:4200` from reading IndexedDB of `thought-metrics.firebaseapp.com`
6. **Result**: `getRedirectResult()` returns NULL even though OAuth succeeded

### Why This Happens

Browser security policy prevents accessing storage (cookies, localStorage, IndexedDB) across different origins. The origins `localhost:4200` and `thought-metrics.firebaseapp.com` are considered different, so the auth state cannot be shared.

### Diagnostic Evidence

When this issue occurs, you'll see logs like:
```
[AuthService] Redirect pending flag: true
[AuthService] Time since redirect initiated: 5310 ms
[AuthService] AuthDomain being used: thought-metrics.firebaseapp.com
[AuthService] getRedirectResult() returned: NULL
[AuthService] Current hostname: localhost
[AuthService] ⚠️ CROSS-ORIGIN ISSUE DETECTED
```

### The Solution

Use **dynamic authDomain** configuration that matches the current hostname:

- **Production** (`www.thoughtmetrics.com`): authDomain = `www.thoughtmetrics.com`
- **Localhost**: Use popup flow instead (redirect won't work)

---

## Prerequisites

Before implementing redirect flow, ensure you have:

1. **Production Domain**: A production domain where Firebase Hosting is configured (e.g., `www.thoughtmetrics.com`)
2. **Firebase Project**: Firebase project with Authentication enabled
3. **GCP Project**: Google Cloud Platform project with OAuth consent screen configured
4. **Domain Verification**: Production domain verified in Firebase Hosting and GCP

---

## GCP OAuth Configuration

### Step 1: Create OAuth 2.0 Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services > Credentials**
3. Click **Create Credentials > OAuth 2.0 Client ID**
4. Select **Web application** as application type
5. Configure as follows:

### Step 2: Configure Authorized Origins

Add these origins:
```
http://localhost:4200
https://www.thoughtmetrics.com
https://thoughtmetrics.com
https://thought-metrics.firebaseapp.com
```

### Step 3: Configure Authorized Redirect URIs

**Critical**: These must be exact matches. Add:

```
http://localhost:4200/__/auth/handler
https://www.thoughtmetrics.com/__/auth/handler
https://thoughtmetrics.com/__/auth/handler
https://thought-metrics.firebaseapp.com/__/auth/handler
```

**Important Notes:**
- The `/__/auth/handler` path is Firebase's OAuth handler endpoint
- This endpoint only exists on domains where Firebase Hosting is configured
- Do NOT add trailing slashes
- Ensure domain naming is consistent (hyphens vs no hyphens)

### Step 4: Copy Client ID and Secret

1. Copy the **Client ID**
2. Copy the **Client Secret**
3. Add these to Firebase Console:
   - Go to Firebase Console > Authentication > Sign-in method
   - Click Google provider
   - Paste Client ID and Secret
   - Save

---

## Firebase Configuration

### Step 1: Configure Authorized Domains

Go to Firebase Console > Authentication > Settings > Authorized domains

Add these domains:
```
localhost
www.thoughtmetrics.com
thoughtmetrics.com
thought-metrics.firebaseapp.com
thought-metrics.web.app
```

### Step 2: Enable Google Sign-In

1. Go to **Authentication > Sign-in method**
2. Enable **Google** provider
3. Add your GCP OAuth Client ID and Secret
4. Save changes

### Step 3: Configure Firebase Hosting

Ensure your production domain is connected to Firebase Hosting:

```bash
firebase hosting:channel:deploy production
```

This ensures the `/__/auth/handler` endpoint exists on your domain.

---

## Implementation Guide

### Step 1: Update Environment Variables

Add to `.env`:
```env
PUBLIC_FIREBASE_AUTH_DOMAIN=thought-metrics.firebaseapp.com
```

### Step 2: Implement Dynamic authDomain

Update `src/core/configs/api-config.ts`:

```typescript
const getFirebaseAuthDomain = (): string => {
  if (typeof window === 'undefined') {
    return getPublicEnv('PUBLIC_FIREBASE_AUTH_DOMAIN') || 'thought-metrics.firebaseapp.com';
  }

  const hostname = window.location.hostname;
  console.log('[API Config] Determining authDomain for hostname:', hostname);

  // For production domains with Firebase Hosting configured
  if (hostname === 'www.thoughtmetrics.com' || hostname === 'thoughtmetrics.com') {
    console.log('[API Config] Using production authDomain: www.thoughtmetrics.com');
    return 'www.thoughtmetrics.com';
  }

  // For Azure staging
  if (hostname.includes('azurewebsites.net')) {
    console.log('[API Config] Using Azure authDomain:', hostname);
    return hostname;
  }

  // For localhost: Use Firebase default domain
  // WARNING: This will cause cross-origin storage issues with redirect flow!
  console.log('[API Config] Using Firebase default authDomain (localhost - expect cross-origin issues)');
  return getPublicEnv('PUBLIC_FIREBASE_AUTH_DOMAIN') || 'thought-metrics.firebaseapp.com';
};

export const firebaseConfig = {
  apiKey: getPublicEnv('PUBLIC_FIREBASE_API_KEY'),
  authDomain: getFirebaseAuthDomain(),
  projectId: getPublicEnv('PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getPublicEnv('PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getPublicEnv('PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getPublicEnv('PUBLIC_FIREBASE_APP_ID'),
  measurementId: getPublicEnv('PUBLIC_FIREBASE_MEASUREMENT_ID'),
};
```

### Step 3: Update Auth Service

Update `src/services/api/auth.service.ts`:

```typescript
import {
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth';

class AuthService {
  private redirectResultPromise: Promise<UserProfile | null> | null = null;

  /**
   * Sign in with Google using redirect
   */
  async signInWithGoogle(): Promise<void> {
    console.log('[AuthService] 🔐 Starting Google sign-in with redirect...');
    console.log('[AuthService] Current hostname:', window.location.hostname);

    await ensureAuthPersistence();
    const provider = this.getGoogleProvider();

    // Store flag to track redirect
    sessionStorage.setItem('auth_redirect_pending', 'true');
    sessionStorage.setItem('auth_redirect_timestamp', Date.now().toString());

    console.log('[AuthService] Calling signInWithRedirect...');
    await signInWithRedirect(auth, provider);
  }

  /**
   * Handle redirect result after OAuth provider redirects back
   */
  async handleRedirectResult(): Promise<UserProfile | null> {
    // Singleton pattern to prevent duplicate calls
    if (this.redirectResultPromise) {
      return this.redirectResultPromise;
    }

    this.redirectResultPromise = this.processRedirectResult();
    return this.redirectResultPromise;
  }

  private async processRedirectResult(): Promise<UserProfile | null> {
    try {
      console.log('[AuthService] 🔄 Processing redirect result...');

      const pendingRedirect = sessionStorage.getItem('auth_redirect_pending');
      await ensureAuthPersistence();

      console.log('[AuthService] AuthDomain being used:', auth.config.authDomain);
      const result = await getRedirectResult(auth);
      console.log('[AuthService] getRedirectResult() returned:', result ? 'USER DATA' : 'NULL');

      if (pendingRedirect) {
        sessionStorage.removeItem('auth_redirect_pending');
        sessionStorage.removeItem('auth_redirect_timestamp');
      }

      if (!result) {
        if (pendingRedirect) {
          console.error('[AuthService] ⚠️ CROSS-ORIGIN ISSUE DETECTED');
          console.error('[AuthService] Current hostname:', window.location.hostname);
          console.error('[AuthService] AuthDomain:', auth.config.authDomain);
        }
        return null;
      }

      console.log('[AuthService] ✅ Redirect successful:', result.user.email);
      await this.syncUserToBackend(result.user);
      return await this.getUserProfile();
    } catch (error) {
      console.error('[AuthService] ❌ Redirect error:', error);
      throw error;
    }
  }
}
```

### Step 4: Create AuthRedirectHandler Component

Create `src/shared/components/AuthRedirectHandler.tsx`:

```typescript
import { useEffect } from 'react';
import authService from '@/services/api/auth.service';
import { toast } from 'sonner';
import { ROUTES } from '@/routes/routeConfig';

const AuthRedirectHandler: React.FC = () => {
  useEffect(() => {
    const handleRedirect = async () => {
      console.log('[AuthRedirectHandler] Checking for redirect result...');

      try {
        const result = await authService.handleRedirectResult();

        if (result) {
          console.log('[AuthRedirectHandler] ✅ User authenticated:', result.email);

          toast.success('Sign in successful!', {
            description: `Welcome back, ${result.profile?.displayName}!`,
          });

          // Redirect to dashboard
          setTimeout(() => {
            window.location.href = ROUTES.SURVEY_BOARDS;
          }, 800);
        }
      } catch (error: any) {
        console.error('[AuthRedirectHandler] ❌ Error:', error);
        toast.error('Sign in failed', {
          description: error.message,
        });
      }
    };

    handleRedirect();
  }, []);

  return null;
};

export default AuthRedirectHandler;
```

### Step 5: Add to Login/Signup Pages

Update `src/pages/login.astro` and `src/pages/sign-up.astro`:

```astro
---
import Layout from '@/layouts/Layout.astro';
import LoginWrapper from '@/shared/screens/auth/AuthPage';
import AuthRedirectHandler from '@/shared/components/AuthRedirectHandler';
---

<Layout>
  <AuthRedirectHandler client:only="react" />
  <LoginWrapper client:only="react" />
</Layout>
```

---

## Diagnostic Logging

The implementation includes comprehensive logging to track the OAuth flow:

### During Sign-In Initiation

```typescript
console.log('[AuthService] 🔐 Starting Google sign-in with redirect...');
console.log('[AuthService] Current URL:', window.location.href);
console.log('[AuthService] Current hostname:', window.location.hostname);
console.log('[AuthService] Calling signInWithRedirect...');
console.log('[AuthService] Session flag set: auth_redirect_pending=true');
```

### During Redirect Result Processing

```typescript
console.log('[AuthService] 🔄 Processing redirect result...');
console.log('[AuthService] Current hostname:', window.location.hostname);
console.log('[AuthService] Redirect pending flag:', pendingRedirect);
console.log('[AuthService] Time since redirect initiated:', elapsed, 'ms');
console.log('[AuthService] AuthDomain being used:', auth.config.authDomain);
console.log('[AuthService] getRedirectResult() returned:', result ? 'USER DATA' : 'NULL');
```

### Cross-Origin Issue Detection

```typescript
if (!result && pendingRedirect) {
  console.error('[AuthService] ⚠️ CROSS-ORIGIN ISSUE DETECTED:');
  console.error('[AuthService] OAuth redirect was initiated but getRedirectResult() returned NULL.');
  console.error('[AuthService] This happens when authDomain differs from the current hostname.');
  console.error('[AuthService] Current hostname:', window.location.hostname);
  console.error('[AuthService] AuthDomain used:', auth.config.authDomain);
  console.error('[AuthService] Solution: Deploy to production where authDomain matches hostname.');
}
```

---

## Production Deployment Checklist

Before deploying redirect flow to production:

- [ ] **Firebase Hosting**: Ensure production domain is connected to Firebase Hosting
- [ ] **OAuth URIs**: Verify all redirect URIs in GCP match exactly (including `/__/auth/handler`)
- [ ] **Authorized Domains**: Ensure production domain is added to Firebase authorized domains
- [ ] **authDomain Logic**: Verify dynamic authDomain returns production domain when `hostname === 'www.thoughtmetrics.com'`
- [ ] **Environment Variables**: Set `PUBLIC_FIREBASE_AUTH_DOMAIN` in production environment
- [ ] **Test Flow**: Test complete OAuth flow on production domain
- [ ] **Verify Storage**: Confirm auth state persists after redirect
- [ ] **Error Handling**: Test error scenarios (user cancels, network failure, etc.)
- [ ] **Mobile Testing**: Test on actual mobile devices
- [ ] **Popup Blockers**: Ensure redirect flow works with strict browser settings

---

## Troubleshooting

### Issue: `getRedirectResult()` Returns NULL

**Symptoms:**
- OAuth completes successfully (user sees Google consent screen)
- User redirected back to app
- `getRedirectResult()` returns NULL
- No user created in Firebase Authentication console

**Possible Causes:**

1. **Cross-Origin Storage (Most Common on Localhost)**
   - **Check**: Does `auth.config.authDomain` match `window.location.hostname`?
   - **Solution**: Deploy to production OR use popup flow for localhost

2. **Missing Persistence**
   - **Check**: Is `ensureAuthPersistence()` called BEFORE `signInWithRedirect()`?
   - **Solution**: Ensure persistence is set before initiating redirect

3. **Multiple Calls to `getRedirectResult()`**
   - **Check**: Is `getRedirectResult()` called multiple times (React Strict Mode)?
   - **Solution**: Use singleton pattern (see implementation above)

4. **Incorrect authDomain**
   - **Check**: Is authDomain a valid Firebase Hosting domain?
   - **Solution**: Ensure authDomain has Firebase Hosting configured

5. **Missing `/__/auth/handler` Endpoint**
   - **Check**: Does authDomain have Firebase Hosting?
   - **Solution**: Configure Firebase Hosting on the domain

### Issue: Redirect URI Mismatch

**Symptoms:**
- Error: "redirect_uri_mismatch"
- OAuth consent screen doesn't appear

**Solution:**
1. Check GCP Console > Credentials > OAuth 2.0 Client IDs
2. Ensure redirect URI matches exactly: `https://www.thoughtmetrics.com/__/auth/handler`
3. No trailing slashes, correct protocol (https), correct path

### Issue: User Not Created in Firebase

**Symptoms:**
- OAuth completes
- getRedirectResult() returns user data
- User doesn't appear in Firebase Authentication console

**Solution:**
1. Check if you're using Firebase Emulator (users won't appear in console)
2. Verify Firebase project ID matches your GCP OAuth client
3. Check Firebase Authentication is enabled

### Issue: Works in Popup but Not Redirect

**Expected Behavior:**
- Popup works on localhost
- Redirect doesn't work on localhost (cross-origin)
- Redirect works on production (same origin)

**Solution:**
- Use popup for localhost development
- Use redirect for production deployment

---

## Code References

### Key Files

1. **`src/services/api/auth.service.ts`**: Main authentication service with redirect logic
2. **`src/core/configs/api-config.ts`**: Dynamic authDomain configuration
3. **`src/core/configs/firebase-config.ts`**: Firebase initialization with persistence
4. **`src/shared/components/AuthRedirectHandler.tsx`**: Redirect result handler component
5. **`src/shared/providers/auth-provider.tsx`**: Auth context provider
6. **`src/pages/login.astro`**: Login page with AuthRedirectHandler
7. **`src/pages/sign-up.astro`**: Sign-up page with AuthRedirectHandler

### Key Functions

- **`signInWithGoogle()`**: Initiates redirect flow
- **`handleRedirectResult()`**: Processes redirect result (call on app init)
- **`processRedirectResult()`**: Internal method with detailed logging
- **`ensureAuthPersistence()`**: Sets Firebase auth persistence
- **`getFirebaseAuthDomain()`**: Returns dynamic authDomain based on hostname

### SessionStorage Flags

- **`auth_redirect_pending`**: Set to 'true' when redirect initiated
- **`auth_redirect_timestamp`**: Timestamp when redirect initiated (for diagnostic timing)

---

## Migration Path: Popup → Redirect

When ready to migrate from popup to redirect flow:

1. **Update Imports** in `auth.service.ts`:
   ```typescript
   // Remove
   import { signInWithPopup } from 'firebase/auth';

   // Add
   import { signInWithRedirect, getRedirectResult } from 'firebase/auth';
   ```

2. **Update `signInWithGoogle()`**:
   - Change from `signInWithPopup` to `signInWithRedirect`
   - Add sessionStorage flags for tracking
   - Remove direct sync (will happen in redirect handler)

3. **Add `handleRedirectResult()` Method**:
   - Implement singleton pattern to prevent duplicate calls
   - Add comprehensive logging
   - Handle cross-origin detection

4. **Create AuthRedirectHandler Component**:
   - Call `handleRedirectResult()` on mount
   - Handle success/error cases
   - Show user feedback

5. **Add to Login/Signup Pages**:
   - Import and render `<AuthRedirectHandler client:only="react" />`

6. **Test Thoroughly**:
   - Test on production domain first
   - Verify complete OAuth flow
   - Check mobile browsers
   - Test error scenarios

---

## Summary

**Current State**: Using popup flow for all environments (easier R&D and debugging)

**Production Recommendation**: Migrate to redirect flow for better mobile support and security

**Key Takeaway**: Redirect flow requires authDomain to match the current hostname. This works on production but not localhost due to browser cross-origin security restrictions.

**For Future Implementation**: Follow this guide to implement redirect flow when ready for production deployment.

---

## Additional Resources

- [Firebase Auth Redirect Flow Documentation](https://firebase.google.com/docs/auth/web/redirect-best-practices)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Last Updated**: December 2025
**Version**: 1.0
**Maintained By**: Thought Metrics Engineering Team
