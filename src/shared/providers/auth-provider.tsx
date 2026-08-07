import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/core/configs/firebase-config';
import ApiService from '@/services/api/api.service';
import type { UserRole } from '@/core/types/user.type';

interface AuthContextType {
  user: User | null;
  isAuthReady: boolean;
  /**
   * True once the role/custom-claims fetch for the current user has
   * finished (success or failure) — separate from isAuthReady, since that
   * fetch is async and must not block user/isAuthReady from resolving
   * quickly. Anything that gates access on isAdmin/isSuperAdmin/isClient/
   * isFieldIncharge (route guards especially) must wait on isRoleReady too,
   * not just isAuthReady — otherwise it evaluates those flags' not-yet-
   * fetched default (false) values and incorrectly concludes "unauthorized".
   */
  isRoleReady: boolean;
  userRole: UserRole | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isFieldIncharge: boolean;
  isClient: boolean;
  userZone: string | null;
  companyId: string | null;
  /** Permission tier within the company (role=client only) — see company-role.util.ts on the backend for enforcement. */
  companyRole: 'owner' | 'contributor' | 'member' | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthReady: false,
  isRoleReady: false,
  userRole: null,
  isAdmin: false,
  isSuperAdmin: false,
  isFieldIncharge: false,
  isClient: false,
  userZone: null,
  companyId: null,
  companyRole: null,
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
  const [isRoleReady, setIsRoleReady] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isFieldIncharge, setIsFieldIncharge] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [userZone, setUserZone] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [companyRole, setCompanyRole] = useState<'owner' | 'contributor' | 'member' | null>(null);

  useEffect(() => {
    // Only set up auth listener on client-side
    if (typeof window === "undefined") {
      setIsAuthReady(true);
      setIsRoleReady(true);
      return;
    }

    // Check if auth is available (will be null during SSR or if Firebase failed to init)
    if (!auth) {
      console.warn("Firebase auth not available");
      setIsAuthReady(true);
      setIsRoleReady(true);
      return;
    }

    let identityResolved = false;
    // Guards against fetching the same user's claims twice (once from the
    // synchronous initial-user check below, once from onAuthStateChanged's
    // first callback firing with that same user moments later).
    let roleFetchedForUid: string | null = null;

    const applyRoleClaims = async (firebaseUser: User) => {
      if (roleFetchedForUid === firebaseUser.uid) return;
      roleFetchedForUid = firebaseUser.uid;
      setIsRoleReady(false);

      try {
        const token = await firebaseUser.getIdToken();
        ApiService.setAuthToken(token);

        // Get user role from Firebase custom claims
        const idTokenResult = await firebaseUser.getIdTokenResult();

        const role = idTokenResult.claims.role as UserRole | undefined;
        const zone = idTokenResult.claims.zone as string | undefined;
        const claimCompanyId = idTokenResult.claims.companyId as string | undefined;
        const claimCompanyRole = idTokenResult.claims.companyRole as 'owner' | 'contributor' | 'member' | undefined;

        setUserRole(role || 'respondent');
        setIsAdmin(role === 'admin' || role === 'super-admin');
        setIsSuperAdmin(role === 'super-admin');
        setIsFieldIncharge(role === 'field-incharge');
        setIsClient(role === 'client');
        setUserZone(zone || null);
        setCompanyId(claimCompanyId || null);
        setCompanyRole(claimCompanyRole || null);
      } catch (error) {
        console.error('Failed to get auth token/claims:', error);
        ApiService.removeAuthToken();
        setUserRole(null);
        setIsAdmin(false);
        setIsSuperAdmin(false);
        setIsFieldIncharge(false);
        setIsClient(false);
        setUserZone(null);
        setCompanyId(null);
        setCompanyRole(null);
      } finally {
        setIsRoleReady(true);
      }
    };

    // Applies the resolved identity (user/isAuthReady) — synchronous, so a
    // slow or hanging role/claims fetch can never itself block these from
    // resolving. The role/claims fetch (isRoleReady + the role-derived
    // flags) updates independently, whenever applyRoleClaims finishes.
    const applyAuthUser = (firebaseUser: User | null) => {
      identityResolved = true;
      setUser(firebaseUser);
      setIsAuthReady(true);

      if (firebaseUser) {
        void applyRoleClaims(firebaseUser);
      } else {
        roleFetchedForUid = null;
        ApiService.removeAuthToken();
        setUserRole(null);
        setIsAdmin(false);
        setIsSuperAdmin(false);
        setIsFieldIncharge(false);
        setIsClient(false);
        setUserZone(null);
        setCompanyId(null);
        setCompanyRole(null);
        setIsRoleReady(true);
      }
    };

    // Kick off the role fetch immediately for a session already known at
    // mount time (picked up by the lazy useState initializers above) —
    // user/isAuthReady are already correct in that case, but the role/
    // claims fetch doesn't happen automatically just because the user
    // object was already known; it has to be started explicitly here.
    const initialUser = getInitialUser();
    if (initialUser) {
      identityResolved = true;
      void applyRoleClaims(initialUser);
    }

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

    // Fallback in case onAuthStateChanged's first callback never fires at
    // all — observed specifically on pages built from multiple
    // independently-hydrated Astro islands (client:only), where more than
    // one AuthProvider instance ends up registering its own listener
    // against the same underlying (module-singleton) Firebase Auth
    // instance: one instance's listener reliably resolves, a sibling
    // instance's can silently never be invoked. Re-reads the same
    // auth.currentUser data a short beat later rather than waiting forever.
    const fallbackTimer = window.setTimeout(() => {
      if (!identityResolved) {
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
    <AuthContext.Provider value={{ user, isAuthReady, isRoleReady, userRole, isAdmin, isSuperAdmin, isFieldIncharge, isClient, userZone, companyId, companyRole }}>
      {children}
    </AuthContext.Provider>
  );
};
