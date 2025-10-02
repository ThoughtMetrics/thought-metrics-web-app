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
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
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
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  providerId: string;
}

class AuthService {
  private googleProvider: GoogleAuthProvider;
  private facebookProvider: FacebookAuthProvider;

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
   * Send user data to backend API
   */
  private async syncUserToBackend(user: AuthUser, additionalData?: Partial<SignUpData>) {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (token) {
        ApiService.setAuthToken(token);
      }

      await ApiService.post('/users/sync', {
        firebaseUid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        providerId: user.providerId,
        ...additionalData,
      });
    } catch (error) {
      console.error('Failed to sync user to backend:', error);
      // Don't throw - Firebase auth succeeded, backend sync is secondary
    }
  }

  /**
   * Sign up with email and password
   */
  async signUpWithEmail(data: SignUpData): Promise<AuthUser> {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const authUser = this.mapFirebaseUser(userCredential.user);

    // Sync to backend with additional data
    await this.syncUserToBackend(authUser, {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
    });

    return authUser;
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const authUser = this.mapFirebaseUser(userCredential.user);

    // Update token in API service
    const token = await userCredential.user.getIdToken();
    ApiService.setAuthToken(token);

    return authUser;
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<AuthUser> {
    const userCredential: UserCredential = await signInWithPopup(
      auth,
      this.googleProvider
    );

    const authUser = this.mapFirebaseUser(userCredential.user);

    // Sync to backend
    await this.syncUserToBackend(authUser);

    return authUser;
  }

  /**
   * Sign in with Facebook
   */
  async signInWithFacebook(): Promise<AuthUser> {
    const userCredential: UserCredential = await signInWithPopup(
      auth,
      this.facebookProvider
    );

    const authUser = this.mapFirebaseUser(userCredential.user);

    // Sync to backend
    await this.syncUserToBackend(authUser);

    return authUser;
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
}

export default new AuthService();