/**
 * Firebase Error Handler Utilities
 * Provides user-friendly error messages for Firebase service errors
 */

import {
  FirebaseAuthError,
  FirebaseFirestoreError,
  FirebaseStorageError,
  type ErrorDetails,
  type FirebaseAuthErrorCode,
  type FirebaseFirestoreErrorCode,
  type FirebaseStorageErrorCode,
} from '../types/firebase-error.type';

/**
 * Get user-friendly error details for Firebase Auth errors
 * Returns null for user-initiated cancellations
 */
export const getAuthErrorDetails = (errorCode: string): ErrorDetails | null => {
  switch (errorCode as FirebaseAuthErrorCode) {
    case FirebaseAuthError.USER_NOT_FOUND:
      return {
        title: 'User not found',
        description: 'No account found with this email. Please sign up first.',
      };
    case FirebaseAuthError.WRONG_PASSWORD:
      return {
        title: 'Invalid password',
        description: 'The password you entered is incorrect.',
      };
    case FirebaseAuthError.INVALID_EMAIL:
      return {
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
      };
    case FirebaseAuthError.USER_DISABLED:
      return {
        title: 'Account disabled',
        description: 'This account has been disabled. Please contact support.',
      };
    case FirebaseAuthError.INVALID_CREDENTIAL:
      return {
        title: 'Invalid credentials',
        description: 'The email or password you entered is incorrect.',
      };
    case FirebaseAuthError.TOO_MANY_REQUESTS:
      return {
        title: 'Too many attempts',
        description:
          'Too many failed login attempts. Please try again later or reset your password.',
      };
    case FirebaseAuthError.NETWORK_REQUEST_FAILED:
      return {
        title: 'Network error',
        description: 'Please check your internet connection and try again.',
      };
    case FirebaseAuthError.POPUP_CLOSED_BY_USER:
    case FirebaseAuthError.CANCELLED_POPUP_REQUEST:
      // Don't show toast for user-initiated cancellation
      return null;
    case FirebaseAuthError.EMAIL_ALREADY_IN_USE:
      return {
        title: 'Email already in use',
        description:
          'An account with this email already exists. Please sign in or use a different email.',
      };
    case FirebaseAuthError.WEAK_PASSWORD:
      return {
        title: 'Weak password',
        description:
          'Password should be at least 6 characters long with a mix of letters and numbers.',
      };
    case FirebaseAuthError.OPERATION_NOT_ALLOWED:
      return {
        title: 'Operation not allowed',
        description:
          'This sign-in method is not enabled. Please contact support.',
      };
    case FirebaseAuthError.ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL:
      return {
        title: 'Account exists',
        description:
          'An account already exists with the same email but different sign-in credentials.',
      };
    case FirebaseAuthError.INVALID_VERIFICATION_CODE:
      return {
        title: 'Invalid verification code',
        description: 'The verification code is invalid. Please try again.',
      };
    case FirebaseAuthError.INVALID_VERIFICATION_ID:
      return {
        title: 'Invalid verification ID',
        description: 'The verification ID is invalid. Please try again.',
      };
    case FirebaseAuthError.CODE_EXPIRED:
      return {
        title: 'Code expired',
        description:
          'The verification code has expired. Please request a new one.',
      };
    case FirebaseAuthError.EXPIRED_ACTION_CODE:
      return {
        title: 'Expired link',
        description: 'This link has expired. Please request a new one.',
      };
    case FirebaseAuthError.INVALID_ACTION_CODE:
      return {
        title: 'Invalid link',
        description: 'This link is invalid or has already been used.',
      };
    case FirebaseAuthError.REQUIRES_RECENT_LOGIN:
      return {
        title: 'Re-authentication required',
        description:
          'This operation is sensitive and requires recent authentication. Please sign in again.',
      };
    default:
      return {
        title: 'Authentication failed',
        description:
          'An error occurred during authentication. Please try again.',
      };
  }
};

/**
 * Get user-friendly error details for Firebase Firestore errors
 */
export const getFirestoreErrorDetails = (errorCode: string): ErrorDetails => {
  switch (errorCode as FirebaseFirestoreErrorCode) {
    case FirebaseFirestoreError.PERMISSION_DENIED:
      return {
        title: 'Permission denied',
        description: 'You do not have permission to perform this action.',
      };
    case FirebaseFirestoreError.UNAVAILABLE:
      return {
        title: 'Service unavailable',
        description:
          'The service is temporarily unavailable. Please try again later.',
      };
    case FirebaseFirestoreError.NOT_FOUND:
      return {
        title: 'Not found',
        description: 'The requested document was not found.',
      };
    case FirebaseFirestoreError.ALREADY_EXISTS:
      return {
        title: 'Already exists',
        description: 'A document with this ID already exists.',
      };
    case FirebaseFirestoreError.RESOURCE_EXHAUSTED:
      return {
        title: 'Resource exhausted',
        description: 'You have exceeded your quota. Please try again later.',
      };
    case FirebaseFirestoreError.FAILED_PRECONDITION:
      return {
        title: 'Operation failed',
        description:
          'The operation failed due to a precondition not being met.',
      };
    case FirebaseFirestoreError.ABORTED:
      return {
        title: 'Operation aborted',
        description:
          'The operation was aborted due to a conflict. Please try again.',
      };
    case FirebaseFirestoreError.OUT_OF_RANGE:
      return {
        title: 'Invalid range',
        description: 'The specified range is invalid.',
      };
    case FirebaseFirestoreError.UNIMPLEMENTED:
      return {
        title: 'Not implemented',
        description: 'This operation is not implemented or supported.',
      };
    case FirebaseFirestoreError.INTERNAL:
      return {
        title: 'Internal error',
        description: 'An internal error occurred. Please try again later.',
      };
    case FirebaseFirestoreError.DATA_LOSS:
      return {
        title: 'Data loss',
        description: 'Unrecoverable data loss or corruption occurred.',
      };
    case FirebaseFirestoreError.UNAUTHENTICATED:
      return {
        title: 'Not authenticated',
        description: 'You must be signed in to perform this action.',
      };
    case FirebaseFirestoreError.DEADLINE_EXCEEDED:
      return {
        title: 'Timeout',
        description: 'The operation took too long. Please try again.',
      };
    case FirebaseFirestoreError.CANCELLED:
      return {
        title: 'Operation cancelled',
        description: 'The operation was cancelled.',
      };
    default:
      return {
        title: 'Database error',
        description:
          'An error occurred while accessing the database. Please try again.',
      };
  }
};

/**
 * Get user-friendly error details for Firebase Storage errors
 */
export const getStorageErrorDetails = (errorCode: string): ErrorDetails => {
  switch (errorCode as FirebaseStorageErrorCode) {
    case FirebaseStorageError.UNKNOWN:
      return {
        title: 'Unknown error',
        description: 'An unknown error occurred. Please try again.',
      };
    case FirebaseStorageError.OBJECT_NOT_FOUND:
      return {
        title: 'File not found',
        description: 'The requested file does not exist.',
      };
    case FirebaseStorageError.BUCKET_NOT_FOUND:
      return {
        title: 'Bucket not found',
        description: 'The storage bucket does not exist.',
      };
    case FirebaseStorageError.PROJECT_NOT_FOUND:
      return {
        title: 'Project not found',
        description: 'The project does not exist.',
      };
    case FirebaseStorageError.QUOTA_EXCEEDED:
      return {
        title: 'Quota exceeded',
        description:
          'Storage quota has been exceeded. Please free up space or upgrade.',
      };
    case FirebaseStorageError.UNAUTHENTICATED:
      return {
        title: 'Not authenticated',
        description: 'You must be signed in to access storage.',
      };
    case FirebaseStorageError.UNAUTHORIZED:
      return {
        title: 'Unauthorized',
        description: 'You do not have permission to access this file.',
      };
    case FirebaseStorageError.RETRY_LIMIT_EXCEEDED:
      return {
        title: 'Upload failed',
        description:
          'The upload failed after multiple attempts. Please try again.',
      };
    case FirebaseStorageError.INVALID_CHECKSUM:
      return {
        title: 'Invalid file',
        description: 'The file was corrupted during upload. Please try again.',
      };
    case FirebaseStorageError.CANCELED:
      return {
        title: 'Upload cancelled',
        description: 'The upload was cancelled.',
      };
    case FirebaseStorageError.INVALID_EVENT_NAME:
      return {
        title: 'Invalid event',
        description: 'An invalid event name was specified.',
      };
    case FirebaseStorageError.INVALID_URL:
      return {
        title: 'Invalid URL',
        description: 'The storage URL is invalid.',
      };
    case FirebaseStorageError.INVALID_ARGUMENT:
      return {
        title: 'Invalid argument',
        description: 'An invalid argument was provided.',
      };
    case FirebaseStorageError.NO_DEFAULT_BUCKET:
      return {
        title: 'No default bucket',
        description: 'No default storage bucket is configured.',
      };
    case FirebaseStorageError.CANNOT_SLICE_BLOB:
      return {
        title: 'Upload error',
        description: 'The file could not be processed. Please try again.',
      };
    case FirebaseStorageError.SERVER_FILE_WRONG_SIZE:
      return {
        title: 'Upload error',
        description:
          'The file size does not match. Please try uploading again.',
      };
    default:
      return {
        title: 'Storage error',
        description:
          'An error occurred while accessing storage. Please try again.',
      };
  }
};

/**
 * Generic Firebase error handler that routes to the appropriate service handler
 */
export const getFirebaseErrorDetails = (
  errorCode: string
): ErrorDetails | null => {
  if (errorCode.startsWith('auth/')) {
    return getAuthErrorDetails(errorCode);
  } else if (errorCode.startsWith('storage/')) {
    return getStorageErrorDetails(errorCode);
  } else {
    return getFirestoreErrorDetails(errorCode);
  }
};

// Backwards compatibility alias for existing code
export const getSignInErrorDetails = getAuthErrorDetails;
