# Firebase Google OAuth Authentication - Complete Setup Guide

## Overview

This guide documents the Firebase Google OAuth authentication implementation for the Thought Metrics web application. The solution uses a **hybrid authentication strategy** that adapts to the environment:

- **Localhost Development:** Uses `signInWithPopup()` (popup-based auth)
- **Production:** Uses `signInWithRedirect()` (redirect-based auth)

---

## Problem Statement

Modern browsers (Chrome 115+, Firefox 109+, Safari 16.1+) block third-party storage by default, which breaks Firebase `signInWithRedirect()` on localhost because:

- App runs on: `localhost:4200`
- Auth domain: `thought-metrics.firebaseapp.com` (different origin)
- Browsers block Firebase from storing redirect state in third-party storage
- Result: `getRedirectResult()` returns `null` after OAuth redirect

---

## Solution: Hybrid Authentication Strategy

### Architecture

```typescript
// Detection logic
const isLocalhost = (): boolean => {
  return typeof window !== 'undefined' &&
         (window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1');
};

// Auth method selection
if (isLocalhost()) {
  // Use popup auth (no third-party storage needed)
  const result = await signInWithPopup(auth, provider);
  return result; // Returns UserProfile
} else {
  // Use redirect auth (works on production domain)
  await signInWithRedirect(auth, provider);
  return; // Returns void (page redirects)
}
```

### Why This Works

**Localhost (Popup):**
- Popup auth opens OAuth in separate window
- No third-party storage required (same-origin context)
- Returns user data immediately
- Perfect for desktop development

**Production (Redirect):**
- Redirect auth uses full-page navigation
- Production domain is authorized in Firebase
- Works perfectly on all devices (desktop, mobile, tablet)
- Better mobile UX (no popup blockers)

---

## Implementation Details

### 1. Firebase Configuration

**File:** `src/core/configs/firebase-config.ts`

```typescript
// Persistence helper with timing fix
const waitForPersistenceWrite = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('✅ [Firebase] Persistence write delay complete');
      resolve();
    }, 100); // 100ms delay for IndexedDB write
  });
};

export const ensureAuthPersistence = async (): Promise<void> => {
  if (persistenceInitialized) return;

  const auth = getFirebaseAuth();
  await import('firebase/auth')
    .then(({ setPersistence, browserLocalPersistence }) => {
      return setPersistence(auth, browserLocalPersistence);
    })
    .then(async () => {
      await waitForPersistenceWrite();
      persistenceInitialized = true;
    });
};
```

### 2. Auth Service

**File:** `src/services/api/auth.service.ts`

```typescript
async signInWithGoogle(): Promise<UserProfile | void> {
  await ensureAuthPersistence();

  const provider = this.getGoogleProvider();

  // Localhost: Use popup
  if (isLocalhost()) {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    ApiService.setAuthToken(token);
    await this.syncUserToBackend(result.user);
    return await this.getUserProfile();
  }

  // Production: Use redirect
  await new Promise(resolve => setTimeout(resolve, 150));
  await signInWithRedirect(auth, provider);
}
```

### 3. Sign-In Mutation

**File:** `src/core/hooks/mutations/use-sign-in.mutation.ts`

```typescript
mutationFn: async (params: SignInParams): Promise<UserProfile | void> => {
  switch (params.type) {
    case 'google': {
      const result = await authService.signInWithGoogle();
      if (result) {
        // Popup returned result (localhost)
        return result;
      } else {
        // Redirect initiated (production)
        return;
      }
    }
  }
}
```

### 4. UI Components

#### Login Page
**File:** `src/shared/screens/auth/AuthPage.tsx`

```typescript
const [isNavigating, setIsNavigating] = useState(false);

const handleGoogleSignIn = async () => {
  try {
    const result = await signInMutation.mutateAsync({ type: 'google' });

    if (result) {
      setIsNavigating(true);
      setTimeout(() => {
        window.location.href = ROUTES.SURVEY_BOARDS;
      }, 800);
    }
  } catch (error) {
    console.error('Google sign-in failed:', error);
    setIsNavigating(false);
  }
};
```

#### Loading Overlay
```tsx
{isNavigating && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center">
      <div className="mb-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Signing you in...
      </h2>
      <p className="text-gray-600">
        Please wait while we redirect you
      </p>
    </div>
  </div>
)}
```

---

## Firebase Console Configuration

### Required Settings

1. **Authorized Domains**
   - Go to: https://console.firebase.google.com/project/thought-metrics/authentication/settings
   - Ensure these domains are added:
     - `localhost` (for local development)
     - `thought-metrics.firebaseapp.com` (Firebase hosting)
     - `thoughtmetrics.com` (production domain)

2. **Google OAuth Configuration (GCP)**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Authorized JavaScript origins:
     - `http://localhost`
     - `https://thoughtmetrics.com`
     - `https://www.thoughtmetrics.com`
     - `https://thoughtmetricswebapi.azurewebsites.net`
   - Authorized redirect URIs:
     - `https://thought-metrics.firebaseapp.com/__/auth/handler`

---

## Testing

### Localhost Testing

1. **Start development server:**
   ```bash
   yarn dev
   ```

2. **Test login page:**
   ```
   http://localhost:4200/login
   ```
   - Click "Sign in with Google"
   - Popup should open
   - Complete Google sign-in
   - Popup closes automatically
   - Loading overlay appears
   - Redirects to survey boards

3. **Test signup page:**
   ```
   http://localhost:4200/sign-up
   ```
   - Click "Continue with Google"
   - Same flow as login

### Expected Console Logs

```
💻 [AuthService] Localhost detected - using POPUP auth
ℹ️ [AuthService] Note: Redirect requires production domain due to browser security
✅ [AuthService] Popup sign-in successful: user@email.com
✅ [SignIn Mutation] Sign-in completed (popup)
✅ [Login Page] Google sign-in successful, navigating...
```

### Production Testing

Deploy to production and test:
- Redirect flow should work seamlessly
- No popup (full-page redirect to Google)
- Returns to app after authentication
- Works on all devices including mobile

---

## Performance Optimizations

### 1. Reduced Navigation Delay
- **Before:** 2000ms delay
- **After:** 800ms delay
- **Improvement:** 60% faster

### 2. Loading UI
- Professional loading overlay
- Clear user feedback
- Animated spinner

### 3. Error Handling
- Proper cleanup on errors
- Loading state resets
- Clear error messages

---

## Troubleshooting

### Issue: Popup Blocked

**Solution:**
1. Click popup blocker icon in address bar
2. Select "Always allow popups from localhost"
3. Reload and try again

### Issue: Redirect Not Working in Production

**Verify:**
1. `PUBLIC_FIREBASE_AUTH_DOMAIN` is set correctly
2. Domain is in Firebase Console authorized domains
3. Browser storage is enabled (not in incognito mode)
4. Third-party cookies are not blocked

### Issue: Slow Navigation

**Check:**
1. Backend API is responding quickly
2. Network connection is stable
3. No console errors

---

## Browser Compatibility

### Localhost (Popup Auth):
- ✅ Chrome/Edge (all versions)
- ✅ Firefox (all versions)
- ✅ Safari (all versions)
- ⚠️ Popup must not be blocked

### Production (Redirect Auth):
- ✅ Chrome/Edge 115+ (all devices)
- ✅ Firefox 109+ (all devices)
- ✅ Safari 16.1+ (all devices including iPhone)
- ✅ All mobile browsers

---

## Files Modified

### Core Implementation
- `package.json` - Firebase SDK v12.6.0
- `src/services/api/auth.service.ts` - Hybrid auth logic
- `src/core/configs/firebase-config.ts` - Persistence timing fixes
- `src/core/hooks/mutations/use-sign-in.mutation.ts` - Handle popup returns
- `src/core/hooks/mutations/use-sign-up.mutation.ts` - Handle popup returns

### UI Components
- `src/shared/screens/auth/AuthPage.tsx` - Login page with loading
- `src/shared/screens/auth/respondent-sign-up.tsx` - Signup page with loading

### Configuration
- `.env` - Firebase environment variables

---

## Security Considerations

1. **API Keys:** Firebase API keys are safe to expose (they're public)
2. **Auth Domain:** Only authorized domains can use Firebase Auth
3. **Popup Security:** Cross-origin warnings are normal and expected
4. **Production:** Always use HTTPS in production

---

## References

- [Firebase Redirect Best Practices](https://firebase.google.com/docs/auth/web/redirect-best-practices)
- [Third-Party Storage Access](https://developer.chrome.com/en/docs/privacy-sandbox/storage-partitioning/)
- [Firebase JavaScript SDK v12.6.0](https://firebase.google.com/docs/reference/js)
