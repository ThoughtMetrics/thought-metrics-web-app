/**
 * User Type Definitions
 * Based on backend API user model structure
 */

export type UserRole =
  | 'super-admin'
  | 'admin'
  | 'employee'
  | 'client'
  | 'respondent'
  | 'partner'
  | 'field-agent'
  | 'field-incharge';

/** @deprecated Legacy city-based zonal values. Use ZonalInfo instead. */
export type UserZonal =
  | 'chennai'
  | 'bangalore'
  | 'hyderabad'
  | 'mumbai'
  | 'delhi'
  | 'kolkata'
  | 'pune'
  | 'ahmedabad';

import type { ZonalInfo } from './zone.type';
export type { ZonalInfo };

// Location Interface - Aligned with backend ILocation
export interface Location {
  doorNumberOrStreetName?: string;
  city?: string;
  zipCode?: string;
  district?: string;
  state?: string;
  countryOrRegion?: string;
}

// Payment Interface - Aligned with backend IPayment
export interface Payment {
  upiId?: string;
  upiFullName?: string;
  upiMobileNumber?: string;

  bankAccountNumber?: string;
  bankIfscCode?: string;
  bankAccountHolderName?: string;
}

// Settings Interface - Aligned with backend ISettings
export interface UserSettings {
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
}

// Respondent Info Interface - Aligned with backend IRespondentInfo
export interface RespondentInfo {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  participationPreferences?: string[];
}

// Profile Interface - Aligned with backend IProfile
export interface UserProfileData {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: Date; // ISO date string
  location?: Location;
  username?: string;
}

// Complete User Profile from Backend - Aligned with backend User model
export interface UserProfile {
  _id: string;
  firebaseUid: string;
  email?: string;
  profile: UserProfileData;
  respondentInfo?: RespondentInfo;
  paymentInfo: Payment;
  settings?: UserSettings;
  metadata?: {
    forcePasswordReset?: boolean;
    isActive?: boolean;
    isEmailVerified?: boolean;
    [key: string]: any;
  };
  providerId: string;
  role?:
    | 'super-admin'
    | 'admin'
    | 'employee'
    | 'client'
    | 'respondent'
    | 'partner'
    | 'field-agent'
    | 'field-incharge';
  zonal?: string;
  zonalInfo?: ZonalInfo[];
  createdAt: string;
  updatedAt: string;
}

// Sign Up Data Interface - For registration
export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: string;
  location?: Location;
  participationPreferences?: string[];
  termsAccepted: boolean;
  privacyAccepted: boolean;
  paymentMethod: 'upi' | 'bank' | 'skip' | undefined;
  payment?: Payment;
}

// Update Profile Data Interface - For profile updates (PATCH /users/profile)
export interface UpdateProfileData {
  profile?: Partial<UserProfileData>;
  respondentInfo: Partial<RespondentInfo>;
  settings?: Partial<UserSettings>;
  paymentInfo?: Partial<Payment>;
}
