import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  fetchSignInMethodsForEmail,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { auth, ensureAuthPersistence } from '@/core/configs/firebase-config';
import ApiService from '@/services/api/api.service';
import type { UserProfile, SignUpData } from '@/core/types/user.type';

class AuthService {
  private googleProvider: GoogleAuthProvider | null = null;
  private facebookProvider: FacebookAuthProvider | null = null;
  private redirectResultPromise: Promise<UserProfile | null> | null = null;

  // Lazy initialization for Google provider
  private getGoogleProvider(): GoogleAuthProvider {
    this.googleProvider ??= new GoogleAuthProvider();
    return this.googleProvider;
  }

  // Lazy initialization for Facebook provider
  private getFacebookProvider(): FacebookAuthProvider {
    this.facebookProvider ??= new FacebookAuthProvider();
    return this.facebookProvider;
  }

  /**
   * Send user data to backend API using /users/profile/sync
   * This endpoint creates or updates user profile in MongoDB
   */
  private async syncUserToBackend(user: User, additionalData?: SignUpData) {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (token) {
        ApiService.setAuthToken(token);
      }

      // Build sync data according to backend profileSyncSchema
      const syncData: UserProfile = {
        firebaseUid: user.uid,
        providerId: user.providerId,
        email: user.email,
      } as UserProfile;

      syncData.respondentInfo = {
        participationPreferences: additionalData?.participationPreferences,
        termsAccepted: additionalData?.termsAccepted ?? true,
        privacyAccepted: additionalData?.privacyAccepted ?? true,
      };

      if (additionalData) {
        // Map SignUpData to backend structure
        syncData.profile = {
          firstName: additionalData.firstName,
          lastName: additionalData.lastName,
          phone: additionalData.phone,
          gender: additionalData.gender,
          dateOfBirth: additionalData.dateOfBirth,
          location: additionalData.location,
        };

        // Map payment info to backend structure based on payment method
        if (
          additionalData.paymentMethod &&
          additionalData.paymentMethod !== 'skip' &&
          additionalData.payment
        ) {
          if (additionalData.paymentMethod === 'upi') {
            syncData.paymentInfo = {
              upiId: additionalData.payment.upiId || undefined,
              upiMobileNumber:
                additionalData.payment.upiMobileNumber || undefined,
              upiFullName: additionalData.payment.upiFullName || undefined,
              // Clear bank fields when using UPI
              bankAccountNumber: undefined,
              bankIfscCode: undefined,
              bankAccountHolderName: undefined,
            };
          } else if (additionalData.paymentMethod === 'bank') {
            syncData.paymentInfo = {
              // Clear UPI fields when using bank
              upiId: undefined,
              upiMobileNumber: undefined,
              upiFullName: undefined,
              bankAccountNumber:
                additionalData.payment.bankAccountNumber || undefined,
              bankIfscCode: additionalData.payment.bankIfscCode || undefined,
              bankAccountHolderName:
                additionalData.payment.bankAccountHolderName || undefined,
            };
          }
        }
      } else {
        syncData.profile = {
          displayName: user.displayName ?? undefined,
          avatar: user.photoURL ?? undefined,
        };
      }

      await ApiService.post('/users/profile/sync', syncData);
    } catch (error) {
      console.error('Failed to sync user to backend:', error);
      // Don't throw - Firebase auth succeeded, backend sync is secondary
    }
  }

  /**
   * Check if a user already exists with the given email
   * @param email - Email address to check
   * @returns Promise<boolean> - true if user exists, false otherwise
   */
  async checkUserExists(email: string): Promise<boolean> {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      return signInMethods.length > 0;
    } catch (error: any) {
      // If error code is invalid-email, the email format is wrong
      if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email format');
      }
      // For other errors, assume user doesn't exist
      return false;
    }
  }

  /**
   * Sign up with email and password
   */
  async signUpWithEmail(data: SignUpData): Promise<UserProfile> {
    // Check if user already exists
    const userExists = await this.checkUserExists(data.email);
    if (userExists) {
      throw new Error(
        'User already exists with this email. Please sign in instead.'
      );
    }

    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // Sync to backend with full signup data
    await this.syncUserToBackend(userCredential.user, data);

    // Fetch and return the full user profile from backend
    return await this.getUserProfile();
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, password: string): Promise<UserProfile> {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update token in API service
    const token = await userCredential.user.getIdToken();
    ApiService.setAuthToken(token);

    // Sync with backend (will create if not exists, or update if exists)
    await this.syncUserToBackend(userCredential.user);

    // Fetch and return the full user profile from backend
    return await this.getUserProfile();
  }

  /**
   * Sign in with Google
   * Uses redirect for both localhost and production
   */
  async signInWithGoogle(): Promise<UserProfile | void> {
    console.log('[AuthService] 🔐 Starting Google sign-in with redirect...');
    console.log('[AuthService] Current URL:', window.location.href);
    console.log('[AuthService] Current hostname:', window.location.hostname);

    // CRITICAL: Set persistence BEFORE auth
    await ensureAuthPersistence();

    const provider = this.getGoogleProvider();

    // Store a flag in sessionStorage to track that we initiated OAuth
    // This helps us handle the redirect result properly
    sessionStorage.setItem('auth_redirect_pending', 'true');
    sessionStorage.setItem('auth_redirect_timestamp', Date.now().toString());

    console.log('[AuthService] Calling signInWithRedirect...');
    console.log('[AuthService] Session flag set: auth_redirect_pending=true');

    // Use redirect for all environments (localhost and production)
    await new Promise(resolve => setTimeout(resolve, 150));
    await signInWithRedirect(auth, provider);

    console.log('[AuthService] Redirect initiated (this line may not execute)');
  }

  /**
   * Sign in with Facebook
   * Uses redirect for both localhost and production
   */
  async signInWithFacebook(): Promise<UserProfile | void> {
    // CRITICAL: Set persistence BEFORE auth
    await ensureAuthPersistence();

    const provider = this.getFacebookProvider();

    // Use redirect for all environments (localhost and production)
    await new Promise(resolve => setTimeout(resolve, 150));
    await signInWithRedirect(auth, provider);
  }

  /**
   * Handle redirect result after OAuth provider redirects back
   * Call this on app initialization to check for pending redirect results
   * @returns UserProfile if sign-in was successful, null if no redirect result
   *
   * IMPORTANT: This method uses a singleton promise to ensure getRedirectResult()
   * is only called once, even if this method is called multiple times (React Strict Mode)
   */
  async handleRedirectResult(): Promise<UserProfile | null> {
    // If we already have a promise in flight, return it (prevents duplicate calls)
    if (this.redirectResultPromise) {
      return this.redirectResultPromise;
    }

    // Create and cache the promise
    this.redirectResultPromise = this.processRedirectResult();

    return this.redirectResultPromise;
  }

  /**
   * Internal method that actually processes the redirect result
   * Should only be called once via handleRedirectResult()
   */
  private async processRedirectResult(): Promise<UserProfile | null> {
    try {
      console.log('[AuthService] 🔄 Processing redirect result...');
      console.log('[AuthService] Current hostname:', window.location.hostname);
      console.log('[AuthService] Current URL:', window.location.href);

      // Check for pending redirect flag
      const pendingRedirect = sessionStorage.getItem('auth_redirect_pending');
      const redirectTimestamp = sessionStorage.getItem('auth_redirect_timestamp');
      console.log('[AuthService] Redirect pending flag:', pendingRedirect);
      if (redirectTimestamp) {
        const elapsed = Date.now() - parseInt(redirectTimestamp);
        console.log('[AuthService] Time since redirect initiated:', elapsed, 'ms');
      }

      // CRITICAL: Ensure persistence is set BEFORE calling getRedirectResult()
      console.log('[AuthService] Setting persistence...');
      await ensureAuthPersistence();
      console.log('[AuthService] ✅ Persistence set');

      console.log('[AuthService] Calling getRedirectResult()...');
      console.log('[AuthService] AuthDomain being used:', auth.config.authDomain);
      const result = await getRedirectResult(auth);
      console.log('[AuthService] getRedirectResult() returned:', result ? 'USER DATA' : 'NULL');

      // Clear the redirect flags
      if (pendingRedirect) {
        sessionStorage.removeItem('auth_redirect_pending');
        sessionStorage.removeItem('auth_redirect_timestamp');
      }

      // No redirect result means user didn't just complete OAuth flow
      if (!result) {
        console.log('[AuthService] ℹ️ No redirect result found');

        // Provide diagnostic info if we expected a result
        if (pendingRedirect) {
          console.error('[AuthService] ⚠️ CROSS-ORIGIN ISSUE DETECTED:');
          console.error('[AuthService] OAuth redirect was initiated but getRedirectResult() returned NULL.');
          console.error('[AuthService] This happens when authDomain differs from the current hostname.');
          console.error('[AuthService] Current hostname:', window.location.hostname);
          console.error('[AuthService] AuthDomain used:', auth.config.authDomain);
          console.error('[AuthService] Solution: Deploy to production (www.thoughtmetrics.com) where authDomain matches hostname.');
        }

        return null;
      }

      console.log('[AuthService] ✅ Redirect result found:', {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
      });

      // Sync user to backend
      console.log('[AuthService] Syncing user to backend...');
      await this.syncUserToBackend(result.user);
      console.log('[AuthService] ✅ User synced to backend');

      // Fetch and return the full user profile from backend
      try {
        console.log('[AuthService] Fetching user profile from backend...');
        const profile = await this.getUserProfile();
        console.log('[AuthService] ✅ Profile fetched successfully:', {
          email: profile.email,
          firebaseUid: profile.firebaseUid,
        });
        return profile;
      } catch (profileError) {
        console.error('[AuthService] ⚠️ Failed to fetch profile from backend:', profileError);
        // Return a basic profile from Firebase user data
        const basicProfile = {
          firebaseUid: result.user.uid,
          email: result.user.email,
          profile: {
            displayName: result.user.displayName ?? undefined,
            avatar: result.user.photoURL ?? undefined,
          },
        } as UserProfile;
        console.log('[AuthService] Returning basic profile:', basicProfile);
        return basicProfile;
      }
    } catch (error: any) {
      console.error('[AuthService] ❌ Error in processRedirectResult:', error);
      console.error('[AuthService] Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      // Handle account exists with different credential
      if (error.code === 'auth/account-exists-with-different-credential') {
        const email = error.customData?.email;

        if (email) {
          // Get existing sign-in methods for this email
          const methods = await fetchSignInMethodsForEmail(auth, email);

          // Map provider IDs to user-friendly names
          const providerName = methods[0]?.includes('google')
            ? 'Google'
            : methods[0]?.includes('facebook')
              ? 'Facebook'
              : methods[0]?.includes('password')
                ? 'email and password'
                : methods[0] || 'another method';

          throw new Error(
            `An account already exists with ${email}. Please sign in with ${providerName} first.`
          );
        }
      }

      // For other errors, throw immediately
      throw error;
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    await signOut(auth);
    ApiService.removeAuthToken();
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Get current auth token
   */
  async getCurrentToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  }

  /**
   * Get user profile from backend
   * Uses /users/profile endpoint which gets user by Firebase UID from token
   */
  async getUserProfile(): Promise<UserProfile> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('No authenticated user');

    const token = await user.getIdToken();
    ApiService.setAuthToken(token);

    const response = await ApiService.get('/users/profile/get');
    return response.data as UserProfile;
  }

  /**
   * Get user by MongoDB _id
   * Uses /users/:id endpoint
   */
  async getUserById(userId: string): Promise<UserProfile> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('No authenticated user');

    const token = await user.getIdToken();
    ApiService.setAuthToken(token);

    const response = await ApiService.get(`/users/${userId}`);
    return response.data as UserProfile;
  }

  /**
   * Unsubscribe user account
   * Sends unsubscribe request with optional reasons
   */
  async unsubscribeAccount(reasons?: string[]): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('No authenticated user');

    const token = await user.getIdToken();
    ApiService.setAuthToken(token);

    // Send unsubscribe request with reasons in body
    await ApiService.post('/users/profile/unsubscribe', {
      action: 'unsubscribe',
      reasons: reasons || [],
    });
  }
}

export default new AuthService();
