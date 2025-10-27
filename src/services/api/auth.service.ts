import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { auth } from '@/core/configs/firebase-config';
import ApiService from './api.service';
import type { UserProfile, SignUpData } from '@/core/types/user.type';

class AuthService {
  private googleProvider: GoogleAuthProvider | null = null;
  private facebookProvider: FacebookAuthProvider | null = null;

  // Lazy initialization for Google provider
  private getGoogleProvider(): GoogleAuthProvider {
    if (!this.googleProvider) {
      this.googleProvider = new GoogleAuthProvider();
    }
    return this.googleProvider;
  }

  // Lazy initialization for Facebook provider
  private getFacebookProvider(): FacebookAuthProvider {
    if (!this.facebookProvider) {
      this.facebookProvider = new FacebookAuthProvider();
    }
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
   * Sign up with email and password
   */
  async signUpWithEmail(data: SignUpData): Promise<UserProfile> {
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
