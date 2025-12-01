# Admin Routes Protection Guide

This document explains how admin routes are protected in the Thought Metrics web application.

## Overview

Admin routes (`/admin` and `/admin/*`) are now protected and only accessible to users with the `admin` or `super-admin` role. The protection is implemented using Firebase custom claims and client-side route guards.

## How It Works

### 1. **Firebase Custom Claims**

User roles are stored in Firebase custom claims and set via the backend:
- When a user's role is updated in MongoDB, their Firebase custom claims are also updated
- The custom claim `role` contains the user's role: `super-admin`, `admin`, `employee`, `client`, `respondent`, or `partner`

### 2. **Auth Provider**

The `AuthProvider` component (`src/shared/providers/auth-provider.tsx`) now includes:
- `userRole`: The user's role from Firebase custom claims
- `isAdmin`: Boolean flag indicating if the user is an admin or super-admin
- `isSuperAdmin`: Boolean flag indicating if the user is a super-admin

Example usage:
```tsx
import { useAuth } from '@/shared/providers/auth-provider';

function MyComponent() {
  const { user, userRole, isAdmin, isSuperAdmin } = useAuth();

  if (isAdmin) {
    // Show admin features
  }
}
```

### 3. **AdminRouteGuard Component**

The `AdminRouteGuard` component (`src/shared/components/guards/AdminRouteGuard.tsx`) protects routes:
- Checks if the user is authenticated
- Verifies the user has admin or super-admin role
- Redirects unauthorized users to `/unauthorized`
- Redirects unauthenticated users to `/login`

Usage in Astro pages:
```astro
---
import Layout from '@/layouts/Layout.astro';
import AdminRouteGuard from '@/shared/components/guards/AdminRouteGuard';
---

<Layout>
  <AdminRouteGuard client:only="react">
    <!-- Protected admin content here -->
  </AdminRouteGuard>
</Layout>
```

For super-admin only routes:
```astro
<AdminRouteGuard client:only="react" requireSuperAdmin={true}>
  <!-- Super admin only content -->
</AdminRouteGuard>
```

### 4. **Protected Routes**

Currently protected admin routes:
- `/admin/analytics` - Analytics dashboard (admin/super-admin only)
- `/admin/create-tracking-link` - Create tracking links (admin/super-admin only)

## Setting User Roles

### Backend Scripts

Use the following backend scripts to manage user roles:

#### Make a specific user super admin:
```bash
# From backend directory
npx tsx src/scripts/make-super-admin.ts
```

#### Set any user's role:
```bash
# From backend directory
FIREBASE_UID=<firebase-uid> ROLE=<role> npx tsx src/scripts/set-user-role.ts

# Example: Make user an admin
FIREBASE_UID=abc123xyz ROLE=admin npx tsx src/scripts/set-user-role.ts
```

#### Verify user role:
```bash
# From backend directory
npx tsx src/scripts/verify-super-admin.ts
```

Valid roles:
- `super-admin` - Full access to everything
- `admin` - Admin access to analytics and management features
- `employee` - Employee access
- `client` - Client access
- `respondent` - Standard user (default)
- `partner` - Partner access

### Important Notes

⚠️ **Users must sign out and sign back in** after their role is changed for the Firebase custom claims to take effect!

## Frontend Utilities

### Auth Utilities

Helper functions are available in `src/core/utils/auth-utils.ts`:

```typescript
import { isAdminRole, isSuperAdminRole, getUserRoleFromToken } from '@/core/utils/auth-utils';

// Check if a role is admin
const isAdmin = isAdminRole(userRole); // true for 'admin' or 'super-admin'

// Check if a role is super admin
const isSuperAdmin = isSuperAdminRole(userRole); // true for 'super-admin' only

// Get user role from Firebase token
const role = await getUserRoleFromToken(firebaseUser);
```

## API Authentication

Admin pages automatically include Firebase authentication tokens in API requests. The `getAuthHeaders()` function in each admin page handles this:

```javascript
// Automatically adds Authorization header with Firebase token
const headers = await getAuthHeaders();
const response = await fetch(`${API_BASE}/analytics/overview`, {
  headers,
  credentials: 'include',
});
```

## Backend Authorization

The backend uses middleware to verify admin access:

```typescript
// In src/routes/v1/analytics.route.ts
router.get("/overview",
  authenticate,  // Verify Firebase token
  authorize(UserRoleE.SUPER_ADMIN, UserRoleE.ADMIN),  // Verify role
  AnalyticsController.getOverview
);
```

The `authenticate` middleware:
1. Verifies the Firebase token
2. Extracts the role from custom claims
3. Falls back to database lookup if claims are not set
4. Attaches `req.role` for use by `authorize` middleware

## Error Handling

### Unauthorized Access (403)
- User is authenticated but lacks required permissions
- Redirected to `/unauthorized`
- Shows "Access Denied" message with option to return home

### Unauthenticated (401)
- User is not logged in
- Redirected to `/login?redirect=<current-path>`
- After login, user is redirected back to the requested page

## Testing

### Test Admin Access

1. **Sign out** from the application
2. **Sign in** with an admin or super-admin account
3. Navigate to `/admin/analytics` or `/admin/create-tracking-link`
4. You should see the admin dashboard

### Test Unauthorized Access

1. **Sign in** with a non-admin account (respondent role)
2. Try to access `/admin/analytics`
3. You should be redirected to `/unauthorized`

### Test Unauthenticated Access

1. **Sign out** from the application
2. Try to access `/admin/analytics` directly
3. You should be redirected to `/login`

## Adding New Admin Routes

To add a new admin route:

1. Create the Astro page in `src/pages/admin/`
2. Wrap the content with `AdminRouteGuard`:

```astro
---
import Layout from '@/layouts/Layout.astro';
import AdminRouteGuard from '@/shared/components/guards/AdminRouteGuard';

const seoContent = {
  title: 'New Admin Page | Admin | Thought Metrics',
  description: 'Description',
};
---

<Layout title={seoContent.title} description={seoContent.description}>
  <AdminRouteGuard client:only="react">
    <!-- Your admin content here -->
  </AdminRouteGuard>
</Layout>
```

3. If making API calls, use the `getAuthHeaders()` function:

```javascript
<script>
  async function getAuthHeaders() {
    const { auth } = await import('@/core/configs/firebase-config');
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const token = await user.getIdToken();
    return {
      'Authorization': `Bearer firebase:${token}`,
      'Content-Type': 'application/json'
    };
  }

  async function loadData() {
    const headers = await getAuthHeaders();
    const response = await fetch('/api/endpoint', { headers });
    // ...
  }
</script>
```

## Security Best Practices

1. ✅ Always use `AdminRouteGuard` for admin pages
2. ✅ Always verify roles on the backend with `authorize` middleware
3. ✅ Never trust client-side role checks alone
4. ✅ Use Firebase custom claims for consistent role management
5. ✅ Require users to re-login after role changes
6. ✅ Log all admin actions for audit trails

## Troubleshooting

### Admin can't access admin routes

1. Check if the user's role is set correctly in MongoDB:
   ```bash
   npx tsx src/scripts/verify-super-admin.ts
   ```

2. Check if Firebase custom claims are set:
   ```javascript
   // In browser console after login
   const idTokenResult = await auth.currentUser.getIdTokenResult();
   console.log(idTokenResult.claims.role);
   ```

3. Make sure the user has signed out and signed back in after role change

### Getting "Access Denied" but user is admin

1. Check the browser console for errors
2. Verify the Firebase token is being sent correctly
3. Check backend logs for authorization errors
4. Ensure the user has signed out and signed back in

### API calls returning 401 or 403

1. Check that `getAuthHeaders()` is being called
2. Verify the Authorization header is included in requests
3. Check that the backend route has proper middleware:
   ```typescript
   authenticate, authorize(UserRoleE.ADMIN, UserRoleE.SUPER_ADMIN)
   ```

## Support

For questions or issues with admin routes, contact the development team or check the backend API documentation.
