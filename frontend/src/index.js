/**
 * Security Utility for Fair Competition App
 * Implements low-level browser lockdowns and hardware detection.
 */

export const SecurityUtils = {
  
  // 1. Force Fullscreen Mode
  requestFullscreen: async () => {
    const elem = document.documentElement;
    try {
      if (elem.requestFullscreen) await elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) await elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) await elem.msRequestFullscreen();
    } catch (err) {
      console.error("Fullscreen blocked by browser settings", err);
    }
  },

  // 2. Prevent Common Cheating Hotkeys
  disableDevTools: (e) => {
    if (
      e.keyCode === 123 || // F12
      (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || // Ctrl+Shift+I/J
      (e.ctrlKey && e.keyCode === 85) // Ctrl+U (View Source)
    ) {
      e.preventDefault();
      return false;
    }
  },

  // 3. Multi-Monitor Detection
  // Modern browsers allow us to check if the user has more than one screen active.
  checkMultiScreen: () => {
    if (window.screen && window.screen.isExtended) {
      return window.screen.isExtended; // Returns true if dual monitors are detected
    }
    // Fallback: Check if window width is suspiciously large
    return window.screen.width > 2560; 
  },

  // 4. Lockdown Event Listeners
  initLockdown: (onViolation) => {
    // Disable Right Click
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Disable Copy, Cut, Paste
    document.addEventListener('copy', (e) => e.preventDefault());
    document.addEventListener('cut', (e) => e.preventDefault());
    document.addEventListener('paste', (e) => e.preventDefault());

    // Detect Printing (Ctrl+P)
    window.onbeforeprint = () => {
      onViolation("PRINT_ATTEMPT");
    };

    // Detect Screenshot / Window Blur
    window.addEventListener('blur', () => {
      onViolation("WINDOW_BLUR");
    });
  }
};

/**
 * AI Pattern Detection (Heuristic)
 * Checks if the speed of typing is "too perfect" (potential bot/script)
 */
export class TypingMonitor {
  constructor(threshold = 50) {
    this.lastTime = Date.now();
    this.intervals = [];
    this.threshold = threshold; // ms
  }

  recordKeystroke() {
    const now = Date.now();
    const diff = now - this.lastTime;
    this.intervals.push(diff);
    this.lastTime = now;

    // If typing speed is perfectly consistent, it might be a script
    if (this.intervals.length > 10) {
      const variance = this.calculateVariance(this.intervals.slice(-10));
      if (variance < 5) return "SUSPICIOUS_TYPING_BOT";
    }
    return "OK";
  }

  calculateVariance(arr) {
    const mean = arr.reduce((a, b) => a + b) / arr.length;
    return arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
  }
}