/**
 * Firebase Error Types and Enums
 * Centralized type definitions for Firebase service error codes
 */

// ==================== Firebase Auth ====================

/**
 * Firebase Authentication Error Codes
 */
export const FirebaseAuthError = {
  USER_NOT_FOUND: 'auth/user-not-found',
  WRONG_PASSWORD: 'auth/wrong-password',
  INVALID_EMAIL: 'auth/invalid-email',
  USER_DISABLED: 'auth/user-disabled',
  INVALID_CREDENTIAL: 'auth/invalid-credential',
  TOO_MANY_REQUESTS: 'auth/too-many-requests',
  NETWORK_REQUEST_FAILED: 'auth/network-request-failed',
  POPUP_CLOSED_BY_USER: 'auth/popup-closed-by-user',
  CANCELLED_POPUP_REQUEST: 'auth/cancelled-popup-request',
  EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
  WEAK_PASSWORD: 'auth/weak-password',
  OPERATION_NOT_ALLOWED: 'auth/operation-not-allowed',
  ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL: 'auth/account-exists-with-different-credential',
  INVALID_VERIFICATION_CODE: 'auth/invalid-verification-code',
  INVALID_VERIFICATION_ID: 'auth/invalid-verification-id',
  MISSING_VERIFICATION_CODE: 'auth/missing-verification-code',
  MISSING_VERIFICATION_ID: 'auth/missing-verification-id',
  CODE_EXPIRED: 'auth/code-expired',
  EXPIRED_ACTION_CODE: 'auth/expired-action-code',
  INVALID_ACTION_CODE: 'auth/invalid-action-code',
  REQUIRES_RECENT_LOGIN: 'auth/requires-recent-login',
} as const;

export type FirebaseAuthErrorCode =
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/invalid-credential'
  | 'auth/too-many-requests'
  | 'auth/network-request-failed'
  | 'auth/popup-closed-by-user'
  | 'auth/cancelled-popup-request'
  | 'auth/email-already-in-use'
  | 'auth/weak-password'
  | 'auth/operation-not-allowed'
  | 'auth/account-exists-with-different-credential'
  | 'auth/invalid-verification-code'
  | 'auth/invalid-verification-id'
  | 'auth/missing-verification-code'
  | 'auth/missing-verification-id'
  | 'auth/code-expired'
  | 'auth/expired-action-code'
  | 'auth/invalid-action-code'
  | 'auth/requires-recent-login';

// ==================== Firebase Firestore ====================

/**
 * Firebase Firestore Error Codes
 */
export const FirebaseFirestoreError = {
  PERMISSION_DENIED: 'permission-denied',
  UNAVAILABLE: 'unavailable',
  NOT_FOUND: 'not-found',
  ALREADY_EXISTS: 'already-exists',
  RESOURCE_EXHAUSTED: 'resource-exhausted',
  FAILED_PRECONDITION: 'failed-precondition',
  ABORTED: 'aborted',
  OUT_OF_RANGE: 'out-of-range',
  UNIMPLEMENTED: 'unimplemented',
  INTERNAL: 'internal',
  DATA_LOSS: 'data-loss',
  UNAUTHENTICATED: 'unauthenticated',
  DEADLINE_EXCEEDED: 'deadline-exceeded',
  CANCELLED: 'cancelled',
} as const;

export type FirebaseFirestoreErrorCode =
  | 'permission-denied'
  | 'unavailable'
  | 'not-found'
  | 'already-exists'
  | 'resource-exhausted'
  | 'failed-precondition'
  | 'aborted'
  | 'out-of-range'
  | 'unimplemented'
  | 'internal'
  | 'data-loss'
  | 'unauthenticated'
  | 'deadline-exceeded'
  | 'cancelled';

// ==================== Firebase Storage ====================

/**
 * Firebase Storage Error Codes
 */
export const FirebaseStorageError = {
  UNKNOWN: 'storage/unknown',
  OBJECT_NOT_FOUND: 'storage/object-not-found',
  BUCKET_NOT_FOUND: 'storage/bucket-not-found',
  PROJECT_NOT_FOUND: 'storage/project-not-found',
  QUOTA_EXCEEDED: 'storage/quota-exceeded',
  UNAUTHENTICATED: 'storage/unauthenticated',
  UNAUTHORIZED: 'storage/unauthorized',
  RETRY_LIMIT_EXCEEDED: 'storage/retry-limit-exceeded',
  INVALID_CHECKSUM: 'storage/invalid-checksum',
  CANCELED: 'storage/canceled',
  INVALID_EVENT_NAME: 'storage/invalid-event-name',
  INVALID_URL: 'storage/invalid-url',
  INVALID_ARGUMENT: 'storage/invalid-argument',
  NO_DEFAULT_BUCKET: 'storage/no-default-bucket',
  CANNOT_SLICE_BLOB: 'storage/cannot-slice-blob',
  SERVER_FILE_WRONG_SIZE: 'storage/server-file-wrong-size',
} as const;

export type FirebaseStorageErrorCode =
  | 'storage/unknown'
  | 'storage/object-not-found'
  | 'storage/bucket-not-found'
  | 'storage/project-not-found'
  | 'storage/quota-exceeded'
  | 'storage/unauthenticated'
  | 'storage/unauthorized'
  | 'storage/retry-limit-exceeded'
  | 'storage/invalid-checksum'
  | 'storage/canceled'
  | 'storage/invalid-event-name'
  | 'storage/invalid-url'
  | 'storage/invalid-argument'
  | 'storage/no-default-bucket'
  | 'storage/cannot-slice-blob'
  | 'storage/server-file-wrong-size';

// ==================== Error Details Interface ====================

/**
 * Structured error details for user-friendly error messages
 */
export interface ErrorDetails {
  title: string;
  description: string;
}

// ==================== Utility Types ====================

/**
 * Union type for all Firebase error codes
 */
export type FirebaseErrorCode =
  | FirebaseAuthErrorCode
  | FirebaseFirestoreErrorCode
  | FirebaseStorageErrorCode;
