/**
 * Global type declarations
 */

declare global {
  interface Window {
    Firebug?: {
      chrome?: {
        isInitialized?: boolean;
      };
    };
  }
}

export {};
