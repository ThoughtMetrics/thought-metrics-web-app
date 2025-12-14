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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthReady: false,
  userRole: null,
  isAdmin: false,
  isSuperAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

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

    // Set up async initialization
    const initAuth = async () => {
      try {
        // Listen to Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          setUser(firebaseUser);

          // Set or remove auth token in API service
          if (firebaseUser) {
            try {
              const token = await firebaseUser.getIdToken();
              ApiService.setAuthToken(token);

              // Get user role from Firebase custom claims
              const idTokenResult = await firebaseUser.getIdTokenResult();

              const role = idTokenResult.claims.role as UserRole | undefined;
              const computedIsAdmin = role === 'admin' || role === 'super-admin';
              const computedIsSuperAdmin = role === 'super-admin';


              setUserRole(role || 'respondent');
              setIsAdmin(computedIsAdmin);
              setIsSuperAdmin(computedIsSuperAdmin);
            } catch (error) {
              console.error('Failed to get auth token:', error);
              ApiService.removeAuthToken();
              setUserRole(null);
              setIsAdmin(false);
              setIsSuperAdmin(false);
            }
          } else {
            ApiService.removeAuthToken();
            setUserRole(null);
            setIsAdmin(false);
            setIsSuperAdmin(false);
          }

          // Mark auth as ready after first state change
          setIsAuthReady(true);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Failed to set up auth state listener:", error);
        setIsAuthReady(true);
        return () => {}; // Return empty cleanup function
      }
    };

    // Initialize and store cleanup function
    let unsubscribe: (() => void) | undefined;
    initAuth().then(cleanup => {
      unsubscribe = cleanup;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthReady, userRole, isAdmin, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
