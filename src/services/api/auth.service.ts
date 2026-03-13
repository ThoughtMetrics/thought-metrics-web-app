import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  fetchSignInMethodsForEmail,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { auth } from '@/core/configs/firebase-config';
import ApiService from '@/services/api/api.service';
import type { UserProfile, SignUpData } from '@/core/types/user.type';

class AuthService {
  private googleProvider: GoogleAuthProvider | null = null;
  private facebookProvider: FacebookAuthProvider | null = null;

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
   */
  async signInWithGoogle(): Promise<UserProfile> {
    try {
      const userCredential: UserCredential = await signInWithPopup(
        auth,
        this.getGoogleProvider()
      );

      // Sync to backend
      await this.syncUserToBackend(userCredential.user);

      // Fetch and return the full user profile from backend
      return await this.getUserProfile();
    } catch (error: any) {
      // Re-throw the error immediately for popup cancellations
      if (
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'auth/cancelled-popup-request'
      ) {
        throw error;
      }

      // Handle account exists with different credential
      if (error.code === 'auth/account-exists-with-different-credential') {
        const email = error.customData?.email;

        if (email) {
          // Get existing sign-in methods for this email
          const methods = await fetchSignInMethodsForEmail(auth, email);

          // Map provider IDs to user-friendly names
          const providerName = methods[0]?.includes('facebook')
            ? 'Facebook'
            : methods[0]?.includes('password')
              ? 'email and password'
              : methods[0] || 'another method';

          throw new Error(
            `An account already exists with ${email}. Please sign in with ${providerName} first.`
          );
        }
      }

      // For other errors, also throw immediately
      throw error;
    }
  }

  /**
   * Sign in with Facebook
   */
  async signInWithFacebook(): Promise<UserProfile> {
    try {
      const userCredential: UserCredential = await signInWithPopup(
        auth,
        this.getFacebookProvider()
      );

      // Sync to backend
      await this.syncUserToBackend(userCredential.user);

      // Fetch and return the full user profile from backend
      return await this.getUserProfile();
    } catch (error: any) {
      // Re-throw the error immediately for popup cancellations
      if (
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'auth/cancelled-popup-request'
      ) {
        throw error;
      }

      // Handle account exists with different credential
      if (error.code === 'auth/account-exists-with-different-credential') {
        const email = error.customData?.email;

        if (email) {
          // Get existing sign-in methods for this email
          const methods = await fetchSignInMethodsForEmail(auth, email);

          // Map provider IDs to user-friendly names
          const providerName = methods[0]?.includes('google')
            ? 'Google'
            : methods[0]?.includes('password')
              ? 'email and password'
              : methods[0] || 'another method';

          throw new Error(
            `An account already exists with ${email}. Please sign in with ${providerName} first.`
          );
        }
      }

      // For other errors, also throw immediately
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
   * Clear forcePasswordReset flag after in-app password change
   */
  async clearForcePasswordReset(): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken(true); // force-refresh to get updated claims
    ApiService.setAuthToken(token);
    await ApiService.post('/users/profile/clear-force-password-reset', {});
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
