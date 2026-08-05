import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/core/configs/firebase-config';
import ApiService from '@/services/api/api.service';
import type { UserRole } from '@/core/types/user.type';

interface AuthContextType {
  user: User | null;
  isAuthReady: boolean;
  userRole: UserRole | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isFieldIncharge: boolean;
  isClient: boolean;
  userZone: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthReady: false,
  userRole: null,
  isAdmin: false,
  isSuperAdmin: false,
  isFieldIncharge: false,
  isClient: false,
  userZone: null,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

// Firebase restores a persisted session into auth.currentUser synchronously
// as soon as the SDK has initialized — which, on a page built from multiple
// independently-hydrated Astro islands (client:only), may already have
// happened via an earlier-mounted sibling island's own AuthProvider by the
// time a later instance's very first render runs. Reading it here, as a
// lazy useState initializer, means an already-resolved session shows up
// immediately on first paint instead of only ever being discovered later,
// asynchronously, inside this instance's own onAuthStateChanged callback —
// which has been observed, on this exact class of page, to sometimes just
// never fire for a given listener (no thrown error, it's simply never
// invoked), leaving isAuthReady stuck false and the page blocked forever
// behind UserRouteGuard's loading state.
const getInitialUser = (): User | null => {
  if (typeof window === 'undefined' || !auth) return null;
  return auth.currentUser ?? null;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(() => !!getInitialUser());
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isFieldIncharge, setIsFieldIncharge] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [userZone, setUserZone] = useState<string | null>(null);

  useEffect(() => {
    // Only set up auth listener on client-side
    if (typeof window === "undefined") {
      setIsAuthReady(true);
      return;
    }

    // Check if auth is available (will be null during SSR or if Firebase failed to init)
    if (!auth) {
      console.warn("Firebase auth not available");
      setIsAuthReady(true);
      return;
    }

    // Guards against the fallback timeout (below) and a late-arriving
    // onAuthStateChanged callback both trying to apply state after one of
    // them has already resolved this effect run. Starts pre-resolved when
    // the lazy useState initializer above already found a current user, so
    // the listener below only needs to react to FUTURE changes (sign-out,
    // token refresh) rather than re-applying the same initial state.
    let resolved = !!getInitialUser();

    // Applies the user/role/claims state. Synchronous for the part
    // UserRouteGuard (and everything else) actually gates on — `user` and
    // `isAuthReady` — so a slow or hanging token/claims fetch below can
    // never itself block those from resolving; the claims fetch updates
    // the finer-grained role flags independently, whenever it finishes.
    const applyAuthUser = (firebaseUser: User | null) => {
      if (resolved) return;
      resolved = true;

      setUser(firebaseUser);
      setIsAuthReady(true);

      if (firebaseUser) {
        void (async () => {
          try {
            const token = await firebaseUser.getIdToken();
            ApiService.setAuthToken(token);

            // Get user role from Firebase custom claims
            const idTokenResult = await firebaseUser.getIdTokenResult();

            const role = idTokenResult.claims.role as UserRole | undefined;
            const zone = idTokenResult.claims.zone as string | undefined;
            const computedIsAdmin = role === 'admin' || role === 'super-admin';
            const computedIsSuperAdmin = role === 'super-admin';
            const computedIsFieldIncharge = role === 'field-incharge';
            const computedIsClient = role === 'client';

            setUserRole(role || 'respondent');
            setIsAdmin(computedIsAdmin);
            setIsSuperAdmin(computedIsSuperAdmin);
            setIsFieldIncharge(computedIsFieldIncharge);
            setIsClient(computedIsClient);
            setUserZone(zone || null);
          } catch (error) {
            console.error('Failed to get auth token:', error);
            ApiService.removeAuthToken();
            setUserRole(null);
            setIsAdmin(false);
            setIsSuperAdmin(false);
            setIsFieldIncharge(false);
            setIsClient(false);
            setUserZone(null);
          }
        })();
      } else {
        ApiService.removeAuthToken();
        setUserRole(null);
        setIsAdmin(false);
        setIsSuperAdmin(false);
        setIsFieldIncharge(false);
        setUserZone(null);
      }
    };

    let unsubscribe: (() => void) | undefined;
    try {
      // Listen to Firebase auth state changes (sign-in, sign-out, token
      // refresh) going forward, regardless of whether the initial state
      // was already picked up synchronously above.
      unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        applyAuthUser(firebaseUser);
      });
    } catch (error) {
      console.error("Failed to set up auth state listener:", error);
      applyAuthUser(null);
    }

    // Fallback in case BOTH the synchronous initial check above (still null
    // at mount time) AND onAuthStateChanged's first callback fail to
    // resolve anything — same auth.currentUser data, just read again a
    // short beat later rather than left waiting forever.
    const fallbackTimer = window.setTimeout(() => {
      if (!resolved) {
        console.warn(
          '[AuthProvider] onAuthStateChanged did not fire within 3s — falling back to auth.currentUser'
        );
        applyAuthUser(auth.currentUser ?? null);
      }
    }, 3000);

    return () => {
      window.clearTimeout(fallbackTimer);
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthReady, userRole, isAdmin, isSuperAdmin, isFieldIncharge, isClient, userZone }}>
      {children}
    </AuthContext.Provider>
  );
};
