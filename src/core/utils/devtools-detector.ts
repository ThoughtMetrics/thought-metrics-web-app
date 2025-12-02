/**
 * DevTools Detector Utility
 * Detects when browser DevTools are opened
 * Note: This is not foolproof and can be bypassed, but works for basic detection
 */

export class DevToolsDetector {
  private isOpen = false;
  private callbacks: ((isOpen: boolean) => void)[] = [];
  private checkInterval: number | null = null;
  private threshold = 160;

  constructor() {
    this.detect = this.detect.bind(this);
  }

  /**
   * Start detecting DevTools
   */
  start(callback?: (isOpen: boolean) => void): void {
    if (callback) {
      this.callbacks.push(callback);
    }

    // Method 1: Check window size difference (works when DevTools is docked)
    this.checkInterval = window.setInterval(() => {
      const widthThreshold =
        window.outerWidth - window.innerWidth > this.threshold;
      const heightThreshold =
        window.outerHeight - window.innerHeight > this.threshold;

      if (
        !(heightThreshold && widthThreshold) &&
        (window.Firebug?.chrome?.isInitialized ||
          widthThreshold ||
          heightThreshold)
      ) {
        if (!this.isOpen) {
          this.isOpen = true;
          this.notifyCallbacks(true);
        }
      } else {
        if (this.isOpen) {
          this.isOpen = false;
          this.notifyCallbacks(false);
        }
      }
    }, 500);

    // Method 2: Console debugging trick
    this.setupConsoleDetection();

    // Method 3: debugger statement detection
    this.setupDebuggerDetection();
  }

  /**
   * Stop detecting DevTools
   */
  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Setup console-based detection
   */
  private setupConsoleDetection(): void {
    const element = new Image();
    Object.defineProperty(element, 'id', {
      get: () => {
        if (!this.isOpen) {
          this.isOpen = true;
          this.notifyCallbacks(true);
        }
      },
    });

    // This will trigger when console is open and logs the element
    setInterval(() => {
      console.clear();
      console.debug('%c', element);
    }, 1000);
  }

  /**
   * Setup debugger statement detection
   */
  private setupDebuggerDetection(): void {
    const check = () => {
      const start = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      const end = performance.now();

      // If debugger paused, the time difference will be large
      if (end - start > 100) {
        if (!this.isOpen) {
          this.isOpen = true;
          this.notifyCallbacks(true);
        }
      }
    };

    // Check periodically
    setInterval(check, 1000);
  }

  /**
   * Detect current state
   */
  detect(): boolean {
    return this.isOpen;
  }

  /**
   * Notify all callbacks
   */
  private notifyCallbacks(isOpen: boolean): void {
    this.callbacks.forEach((callback) => callback(isOpen));
  }

  /**
   * Remove a callback
   */
  removeCallback(callback: (isOpen: boolean) => void): void {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback);
  }
}

// Singleton instance
export const devToolsDetector = new DevToolsDetector();
