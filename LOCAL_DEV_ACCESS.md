# Local Development - Authentication Bypass

## Changes Made ✅

Modified authentication guards to **bypass all authentication checks** when running on localhost.

### Files Updated:

1. **`AdminRouteGuard.tsx`** - Admin/Super Admin protected routes
2. **`UserRouteGuard.tsx`** - User protected routes

### Detection Logic:

```typescript
const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
   window.location.hostname === '127.0.0.1' ||
   window.location.hostname.includes('192.168.'));
```

## What This Enables

### ✅ Access Without Login (Local Only)

You can now access ALL protected pages locally without authentication:

**Admin Pages:**
- `/admin/analytics` - Analytics dashboard
- `/admin/users` - User management
- `/admin/create-tracking-link` - Create tracking links
- `/admin/edit-tracking-link/[id]` - Edit tracking links
- Any other admin-protected routes

**User Pages:**
- `/dashboard` - User dashboard
- `/profile` - User profile
- `/survey-boards` - Survey boards
- Any other user-protected routes

### 🔒 Production Security Maintained

- Localhost detection only: `localhost`, `127.0.0.1`, `192.168.x.x`
- Production domain (`thoughtmetrics.com`) still requires authentication
- No security risk in production environment

## Testing

### Local Development (Bypass Enabled):

```bash
# Start dev server
yarn dev

# Access admin pages directly without login:
http://localhost:4200/admin/analytics ✅
http://localhost:4200/admin/users ✅
http://localhost:4200/admin/create-tracking-link ✅

# Access user pages directly:
http://localhost:4200/dashboard ✅
http://localhost:4200/profile ✅
```

### Production (Auth Required):

```bash
# Production URLs still require login:
https://www.thoughtmetrics.com/admin/analytics ❌ → Redirects to /login
https://www.thoughtmetrics.com/dashboard ❌ → Redirects to /login
```

## How It Works

### Before (Auth Required Everywhere):

```
User visits page
  ↓
Guard checks if authenticated
  ↓
Not authenticated → Redirect to /login
Authenticated → Show page
```

### After (Bypass on Localhost):

```
User visits page
  ↓
Is localhost?
  YES → Skip all checks, show page immediately ✅
  NO → Check authentication as usual
```

## Console Logs

You'll see these debug messages in console:

**Local Development:**
```
[AdminRouteGuard] Local development detected - bypassing auth checks
[UserRouteGuard] Local development detected - bypassing auth checks
```

**Production:**
```
[AdminRouteGuard] Auth state: { isAuthReady: true, hasUser: false, ... }
[AdminRouteGuard] User not authenticated, redirecting to login
```

## Benefits

✅ **Faster Development** - No need to login repeatedly
✅ **Test All Features** - Access admin pages without admin account
✅ **Easier Debugging** - No auth interruptions while testing
✅ **Production Safe** - Auth still enforced on live site

## Rollback (If Needed)

To re-enable auth checks in local development, remove these lines from both guard files:

```typescript
// Remove these lines:
if (isLocalhost) {
  console.debug('[Guard] Local development detected - bypassing auth checks');
  setIsChecking(false);
  return;
}
```

---

**Status:** ✅ Active
**Applies To:** Localhost only (`localhost`, `127.0.0.1`, `192.168.x.x`)
**Production:** No changes - authentication still required
