import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/core/configs/firebase-config';
import ApiService from '@/services/api/api.service';

interface AuthContextType {
  user: User | null;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthReady: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

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

    try {
      // Listen to Firebase auth state changes
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setUser(firebaseUser);

        // Set or remove auth token in API service
        if (firebaseUser) {
          try {
            const token = await firebaseUser.getIdToken();
            ApiService.setAuthToken(token);
          } catch (error) {
            console.error('Failed to get auth token:', error);
            ApiService.removeAuthToken();
          }
        } else {
          ApiService.removeAuthToken();
        }

        // Mark auth as ready after first state change
        setIsAuthReady(true);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Failed to set up auth state listener:", error);
      setIsAuthReady(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
};
