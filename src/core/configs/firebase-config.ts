import { getAnalytics, type Analytics } from 'firebase/analytics';
import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  type Auth,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { getAPIConfig } from '@configs/api-config';

// Singleton instances
let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let _firebaseAnalytics: Analytics | null = null; // Initialized for side effects

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Lazy initialization - only runs on client-side
const initializeFirebase = (): FirebaseApp | null => {
  // Guard: Only initialize on client-side
  if (!isBrowser) {
    console.warn('Firebase initialization skipped: not in browser environment');
    return null;
  }

  // Return existing instance if already initialized
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    // Get runtime config and initialize Firebase
    const API_CONFIG = getAPIConfig();

    // Validate that we have a real API key (not placeholder)
    if (
      !API_CONFIG.firebaseConfig.apiKey ||
      API_CONFIG.firebaseConfig.apiKey === 'build-placeholder-key' ||
      API_CONFIG.firebaseConfig.apiKey === ''
    ) {
      console.warn(
        'Firebase initialization skipped: missing or invalid API key'
      );
      return null;
    }

    firebaseApp = initializeApp(API_CONFIG.firebaseConfig);

    _firebaseAnalytics = getAnalytics(firebaseApp);

    return firebaseApp;
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return null;
  }
};

// Track if persistence has been initialized
let persistenceInitialized = false;
let persistencePromise: Promise<void> | null = null;

// Lazy getter for Firebase Auth
const getFirebaseAuth = (): Auth | null => {
  if (!isBrowser) {
    return null;
  }

  if (!firebaseAuth) {
    const app = initializeFirebase();
    if (!app) {
      return null;
    }
    firebaseAuth = getAuth(app);
  }
  return firebaseAuth;
};

// Helper to wait for persistence to actually be written to storage
const waitForPersistenceWrite = async (): Promise<void> => {
  return new Promise((resolve) => {
    // Give IndexedDB time to write the persistence setting
    // This is critical for redirect flow to work
    setTimeout(() => {
      resolve();
    }, 100); // 100ms delay for IndexedDB write
  });
};

// Initialize auth persistence - MUST be called before getRedirectResult()
export const ensureAuthPersistence = async (): Promise<void> => {
  if (persistenceInitialized) {
    console.debug('[Firebase] ✅ Persistence already initialized');
    return;
  }

  if (persistencePromise) {
    console.debug(
      '[Firebase] ⏳ Persistence already being initialized, waiting...'
    );
    return persistencePromise;
  }

  const auth = getFirebaseAuth();
  if (!auth) {
    console.debug(
      '[Firebase] ⚠️ Cannot set auth persistence - auth not initialized'
    );
    return;
  }
  console.debug('[Firebase] 🔄 Initializing auth persistence...');

  persistencePromise = Promise.resolve()
    .then(() => {
      if (auth) {
        console.debug(
          '[Firebase] Setting persistence to browserLocalPersistence...'
        );
        return setPersistence(auth, browserLocalPersistence);
      }
    })
    .then(async () => {
      console.debug('[Firebase] Waiting for persistence write to complete...');
      // CRITICAL: Wait for persistence to actually be written to storage
      await waitForPersistenceWrite();
      persistenceInitialized = true;
      console.debug('[Firebase] ✅ Auth persistence initialized');
    })
    .catch((error) => {
      console.error('[Firebase] ❌ Failed to set auth persistence:', error);
      throw error;
    });

  return persistencePromise;
};

// Create a safe Proxy that returns null for SSR
const createSafeProxy = <T extends object>(getter: () => T | null): T => {
  return new Proxy({} as T, {
    get: (_, prop) => {
      if (!isBrowser) {
        // Return safe defaults during SSR
        if (typeof prop === 'string' && prop === 'currentUser') {
          return null;
        }
        return undefined;
      }
      const instance = getter();
      if (!instance) {
        return undefined;
      }
      const value = instance[prop as keyof T];
      return typeof value === 'function' ? value.bind(instance) : value;
    },
  });
};

// Export lazy getters instead of direct instances
export const getFirebaseApp = initializeFirebase;
export const auth = createSafeProxy<Auth>(getFirebaseAuth);

// Default export for compatibility
export default createSafeProxy<FirebaseApp>(initializeFirebase);
