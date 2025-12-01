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
import { auth, ensureAuthPersistence } from '@/core/configs/firebase-config';
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
   * Sign in with Google using popup
   */
  async signInWithGoogle(): Promise<UserProfile> {
    console.log('[AuthService] 🔐 Starting Google sign-in with popup...');

    // CRITICAL: Set persistence BEFORE auth
    await ensureAuthPersistence();

    const provider = this.getGoogleProvider();

    console.log('[AuthService] Opening popup for Google sign-in...');
    const result = await signInWithPopup(auth, provider);

    console.log('[AuthService] ✅ Popup sign-in successful:', {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
    });

    // Sync user to backend
    console.log('[AuthService] Syncing user to backend...');
    await this.syncUserToBackend(result.user);
    console.log('[AuthService] ✅ User synced to backend');

    // Fetch and return the full user profile from backend
    return await this.getUserProfile();
  }

  /**
   * Sign in with Facebook using popup
   */
  async signInWithFacebook(): Promise<UserProfile> {
    console.log('[AuthService] 🔐 Starting Facebook sign-in with popup...');

    // CRITICAL: Set persistence BEFORE auth
    await ensureAuthPersistence();

    const provider = this.getFacebookProvider();

    console.log('[AuthService] Opening popup for Facebook sign-in...');
    const result = await signInWithPopup(auth, provider);

    console.log('[AuthService] ✅ Popup sign-in successful:', {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
    });

    // Sync user to backend
    console.log('[AuthService] Syncing user to backend...');
    await this.syncUserToBackend(result.user);
    console.log('[AuthService] ✅ User synced to backend');

    // Fetch and return the full user profile from backend
    return await this.getUserProfile();
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
