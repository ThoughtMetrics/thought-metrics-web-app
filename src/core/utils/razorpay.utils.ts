/**
 * Razorpay Payment Integration
 *
 * PURPOSE: Secure payment processing for Indian market
 *
 * WHAT RAZORPAY PROVIDES:
 * - Payment Gateway (Credit/Debit Cards, UPI, Netbanking, Wallets)
 * - Payment Links (Send payment links via SMS/Email/WhatsApp)
 * - Subscriptions (Recurring payments)
 * - Smart Collect (Virtual accounts for automatic reconciliation)
 * - Route (Split payments across multiple accounts)
 *
 * HOW IT WORKS:
 * 1. User clicks "Pay Now" button
 * 2. Razorpay Checkout modal opens
 * 3. User selects payment method and completes payment
 * 4. Razorpay processes payment securely
 * 5. Webhook notifies your backend of success/failure
 * 6. You verify payment signature and fulfill order
 *
 * SETUP:
 * 1. Sign up at https://dashboard.razorpay.com
 * 2. Complete KYC verification
 * 3. Get API Keys (Key ID & Key Secret)
 * 4. Add to .env:
 *    - PUBLIC_RAZORPAY_KEY_ID (for frontend)
 *    - RAZORPAY_KEY_SECRET (for backend - keep secret!)
 * 5. Set up webhook URL in Razorpay dashboard
 * 6. Configure payment methods (UPI, Cards, etc.)
 *
 * SECURITY:
 * - NEVER expose Key Secret in frontend
 * - Always verify payment signature on backend
 * - Use HTTPS for webhook endpoint
 * - Implement rate limiting
 *
 * BEST PRACTICES:
 * - Show clear pricing before checkout
 * - Enable appropriate payment methods for your audience
 * - Handle payment failures gracefully
 * - Send email receipts after successful payment
 * - Implement retry logic for failed webhooks
 */

// ============================================
// 1. RAZORPAY TYPES
// ============================================

export interface RazorpayOptions {
  key: string; // Razorpay Key ID (starts with 'rzp_test_' or 'rzp_live_')
  amount: number; // Amount in smallest currency unit (paise for INR)
  currency: string; // INR, USD, etc.
  name: string; // Your business name
  description?: string; // Purchase description
  image?: string; // Your logo URL
  order_id?: string; // Order ID from backend
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>; // Custom notes
  theme?: {
    color?: string; // Brand color (hex)
  };
  handler: (response: RazorpayResponse) => void; // Success callback
  modal?: {
    ondismiss?: () => void; // User closed modal
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string; // Payment ID
  razorpay_order_id?: string; // Order ID (if created)
  razorpay_signature?: string; // Payment signature (verify on backend)
}

export interface RazorpayInstance {
  open(): void;
  on(event: string, handler: Function): void;
}

// Declare Razorpay on window object
declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

// ============================================
// 2. LOAD RAZORPAY SCRIPT
// ============================================

let razorpayLoaded = false;
let razorpayPromise: Promise<boolean> | null = null;

/**
 * Loads Razorpay checkout script dynamically
 * @returns Promise that resolves when script is loaded
 */
export function loadRazorpayScript(): Promise<boolean> {
  // Return existing promise if already loading
  if (razorpayPromise) {
    return razorpayPromise;
  }

  // Return true if already loaded
  if (razorpayLoaded || window.Razorpay) {
    razorpayLoaded = true;
    return Promise.resolve(true);
  }

  // Load script
  razorpayPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => {
      razorpayLoaded = true;
      resolve(true);
    };

    script.onerror = () => {
      razorpayPromise = null; // Allow retry
      reject(new Error('Failed to load Razorpay SDK'));
    };

    document.body.appendChild(script);
  });

  return razorpayPromise;
}

// ============================================
// 3. INITIALIZE RAZORPAY CHECKOUT
// ============================================

/**
 * Initializes Razorpay checkout with options
 * @param options - Razorpay options
 * @returns Razorpay instance
 *
 * @example
 * const rzp = await initializeRazorpay({
 *   key: 'rzp_test_xxxxx',
 *   amount: 50000, // ₹500.00 (in paise)
 *   currency: 'INR',
 *   name: 'Thought Metrics',
 *   description: 'Premium Subscription',
 *   image: 'https://yoursite.com/logo.png',
 *   prefill: {
 *     name: 'John Doe',
 *     email: 'john@example.com',
 *     contact: '9999999999'
 *   },
 *   theme: {
 *     color: '#e8505e'
 *   },
 *   handler: (response) => {
 *     console.log('Payment Success:', response);
 *     // Verify payment on backend
 *   }
 * });
 * rzp.open();
 */
export async function initializeRazorpay(
  options: RazorpayOptions
): Promise<RazorpayInstance> {
  // Load Razorpay script if not loaded
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    throw new Error('Razorpay SDK not available');
  }

  // Validate required options
  if (!options.key) {
    throw new Error('Razorpay key is required');
  }
  if (!options.amount || options.amount <= 0) {
    throw new Error('Valid amount is required');
  }
  if (!options.handler) {
    throw new Error('Payment handler is required');
  }

  // Create Razorpay instance
  const rzp = new window.Razorpay(options);
  return rzp;
}

// ============================================
// 4. HELPER FUNCTIONS
// ============================================

/**
 * Converts rupees to paise (Razorpay uses smallest currency unit)
 * @param rupees - Amount in rupees
 * @returns Amount in paise
 */
export function convertToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Converts paise to rupees
 * @param paise - Amount in paise
 * @returns Amount in rupees
 */
export function convertToRupees(paise: number): number {
  return paise / 100;
}

/**
 * Formats amount for display
 * @param amount - Amount in rupees
 * @param currency - Currency code (default: INR)
 * @returns Formatted string (e.g., "₹500.00")
 */
export function formatAmount(
  amount: number,
  currency: string = 'INR'
): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Gets Razorpay Key ID from environment
 * @returns Razorpay Key ID or empty string
 */
export function getRazorpayKeyId(): string {
  if (typeof window !== 'undefined' && window.__APP_CONFIG__) {
    return window.__APP_CONFIG__.PUBLIC_RAZORPAY_KEY_ID || '';
  }
  return import.meta.env.PUBLIC_RAZORPAY_KEY_ID || '';
}

// ============================================
// 5. REACT HOOK (OPTIONAL)
// ============================================

/**
 * Custom React hook for Razorpay integration
 * Usage in React components
 *
 * @example
 * const { openCheckout, isLoading } = useRazorpay();
 *
 * const handlePayment = async () => {
 *   try {
 *     await openCheckout({
 *       amount: convertToPaise(500),
 *       currency: 'INR',
 *       name: 'Your Product',
 *       description: 'Product Description',
 *       onSuccess: (response) => {
 *         console.log('Payment successful:', response);
 *       },
 *       onFailure: (error) => {
 *         console.error('Payment failed:', error);
 *       }
 *     });
 *   } catch (error) {
 *     console.error('Checkout error:', error);
 *   }
 * };
 */
export interface UseRazorpayOptions {
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess: (response: RazorpayResponse) => void;
  onFailure?: (error: any) => void;
  notes?: Record<string, string>;
}

export function useRazorpayCheckout() {
  const [isLoading, setIsLoading] = React.useState(false);

  const openCheckout = async (options: UseRazorpayOptions) => {
    setIsLoading(true);

    try {
      const keyId = getRazorpayKeyId();
      if (!keyId) {
        throw new Error('Razorpay Key ID not configured');
      }

      const rzp = await initializeRazorpay({
        key: keyId,
        amount: options.amount,
        currency: options.currency,
        name: options.name,
        description: options.description,
        image: options.image,
        prefill: options.prefill,
        notes: options.notes,
        theme: {
          color: '#e8505e', // Your brand color
        },
        handler: (response) => {
          options.onSuccess(response);
          setIsLoading(false);
        },
        modal: {
          ondismiss: () => {
            if (options.onFailure) {
              options.onFailure(new Error('Payment cancelled by user'));
            }
            setIsLoading(false);
          },
        },
      });

      rzp.open();
    } catch (error) {
      if (options.onFailure) {
        options.onFailure(error);
      }
      setIsLoading(false);
      throw error;
    }
  };

  return { openCheckout, isLoading };
}

// Note: Import React for the hook
import React from 'react';
