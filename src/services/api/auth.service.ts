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

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: string;
  location?: {
    doorNumberOrStreetName?: string;
    city?: string;
    zipCode?: string;
    district?: string;
    state?: string;
    countryOrRegion?: string;
  };
  participationPreferences?: string[];
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

export interface CompleteProfileData {
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  respondentInfo?: {
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    countryOrRegion?: string;
    zipCode?: string;
    dateOfBirth?: {
      month: string;
      day: string;
      year: string;
    };
    participationPreferences?: string[];
  };
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  providerId: string;
}

export interface UserProfile {
  _id: string;
  firebaseUid: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    displayName?: string;
    avatar?: string;
    phone?: string;
    dateOfBirth?: Date;
    gender?: string;
    location?: {
      doorNumberOrStreetName?: string;
      city?: string;
      zipCode?: string;
      district?: string;
      state?: string;
      countryOrRegion?: string;
    };
  };
  respondentInfo?: {
    participationPreferences?: string[];
  };
  settings?: {
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
      researchInvites?: boolean;
      newsletters?: boolean;
    };
    privacy?: {
      profileVisibility?: 'public' | 'private' | 'clients-only';
      showEmail?: boolean;
      showPhone?: boolean;
      dataSharing?: boolean;
    };
    preferences?: {
      language?: string;
      theme?: 'light' | 'dark' | 'auto';
      currency?: string;
      dateFormat?: string;
    };
  };
  providerId: string;
  createdAt: string;
  updatedAt: string;
}

class AuthService {
  private readonly googleProvider: GoogleAuthProvider;
  private readonly facebookProvider: FacebookAuthProvider;

  constructor() {
    this.googleProvider = new GoogleAuthProvider();
    this.facebookProvider = new FacebookAuthProvider();
  }

  /**
   * Convert Firebase User to AuthUser
   */
  private mapFirebaseUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      providerId: user.providerData[0]?.providerId || 'password',
    };
  }

  /**
   * Send user data to backend API using /users/profile/sync
   * This endpoint creates or updates user profile in MongoDB
   */
  private async syncUserToBackend(
    user: AuthUser,
    additionalData?: Partial<SignUpData>,
    completeProfileData?: CompleteProfileData
  ) {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (token) {
        ApiService.setAuthToken(token);
      }

      // Build sync data according to backend profileSyncSchema
      const syncData: any = {
        firebaseUid: user.uid,
        providerId: user.providerId,
        email: user.email,
      };

      // Add complete profile data if provided
      if (completeProfileData) {
        syncData.profile = completeProfileData.profile;
        syncData.respondentInfo = completeProfileData.respondentInfo;
      } else if (additionalData) {
        // Map SignUpData to backend structure
        syncData.profile = {
          firstName: additionalData.firstName,
          lastName: additionalData.lastName,
          phone: additionalData.phone,
          gender: additionalData.gender,
          dateOfBirth: additionalData.dateOfBirth,
          location: additionalData.location,
        };

        // Only add respondentInfo if there are participation preferences
        if (additionalData.participationPreferences && additionalData.participationPreferences.length > 0) {
          syncData.respondentInfo = {
            participationPreferences: additionalData.participationPreferences,
          };
        }
      } else {
        // For OAuth sign-in without additional data, extract names from displayName
        const displayName = user.displayName || '';
        const nameParts = displayName.split(' ');

        syncData.profile = {
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
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

    const authUser = this.mapFirebaseUser(userCredential.user);

    // Sync to backend with full signup data
    await this.syncUserToBackend(authUser, data);

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

    const authUser = this.mapFirebaseUser(userCredential.user);

    // Update token in API service
    const token = await userCredential.user.getIdToken();
    ApiService.setAuthToken(token);

    // Sync with backend (will create if not exists, or update if exists)
    await this.syncUserToBackend(authUser);

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
        this.googleProvider
      );

      const authUser = this.mapFirebaseUser(userCredential.user);

      // Sync to backend
      await this.syncUserToBackend(authUser);

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
        this.facebookProvider
      );

      const authUser = this.mapFirebaseUser(userCredential.user);

      // Sync to backend
      await this.syncUserToBackend(authUser);

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

    const response = await ApiService.get('/users/profile');
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
}

export default new AuthService();
