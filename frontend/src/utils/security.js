/**
 * Security Utilities for Fair Competition App
 *
 * Implements comprehensive anti-cheating measures and browser lockdowns.
 * Provides hardware detection, behavior monitoring, and violation reporting.
 *
 * Security Features:
 * - Fullscreen enforcement
 * - Developer tools prevention
 * - Multi-monitor detection
 * - Copy/paste blocking
 * - Screenshot detection
 * - Typing pattern analysis
 *
 * Performance Considerations:
 * - Minimal performance impact on legitimate users
 * - Event listeners optimized for efficiency
 * - Hardware checks cached where possible
 *
 * Legal Notes:
 * - These measures are for educational integrity
 * - User consent should be obtained before activation
 * - Comply with accessibility requirements
 */

export const SecurityUtils = {

  /**
   * Force Fullscreen Mode
   *
   * Attempts to put the browser in fullscreen mode to prevent external distractions.
   * Handles different browser implementations for maximum compatibility.
   *
   * Security Benefit: Reduces ability to access external resources during exams
   */
  requestFullscreen: async () => {
    const elem = document.documentElement;
    try {
      if (elem.requestFullscreen) await elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) await elem.webkitRequestFullscreen(); // Safari
      else if (elem.msRequestFullscreen) await elem.msRequestFullscreen(); // IE/Edge
    } catch (err) {
      console.error("Fullscreen blocked by browser settings", err);
      // Could trigger violation callback here
    }
  },

  /**
   * Prevent Common Cheating Hotkeys
   *
   * Blocks keyboard shortcuts commonly used for cheating:
   * - F12 (DevTools)
   * - Ctrl+Shift+I/J (DevTools)
   * - Ctrl+U (View Source)
   *
   * @param {KeyboardEvent} e - Keyboard event to check
   * @returns {boolean} - False if shortcut is blocked
   */
  disableDevTools: (e) => {
    if (
      e.keyCode === 123 || // F12 - Developer Tools
      (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || // Ctrl+Shift+I/J
      (e.ctrlKey && e.keyCode === 85) // Ctrl+U - View Source
    ) {
      e.preventDefault();
      return false;
    }
  },

  /**
   * Multi-Monitor Detection
   *
   * Detects if the user has multiple monitors active.
   * Modern browsers support screen.isExtended property.
   *
   * Security Benefit: Prevents displaying answers on second monitor
   *
   * @returns {boolean} - True if multiple screens detected
   */
  checkMultiScreen: () => {
    if (window.screen && window.screen.isExtended) {
      return window.screen.isExtended;
    }
    // Fallback: Check if window width is suspiciously large
    // Note: This is not foolproof and may have false positives
    return window.screen.width > 2560;
  },

  /**
   * Initialize Security Lockdown
   *
   * Sets up comprehensive event listeners to prevent cheating attempts.
   * Should be called when exam begins and cleaned up when exam ends.
   *
   * @param {Function} onViolation - Callback function for security violations
   */
  initLockdown: (onViolation) => {
    // Disable Right Click Context Menu
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Disable Copy, Cut, Paste operations
    document.addEventListener('copy', (e) => e.preventDefault());
    document.addEventListener('cut', (e) => e.preventDefault());
    document.addEventListener('paste', (e) => e.preventDefault());

    // Detect Print Attempts (Ctrl+P)
    window.onbeforeprint = () => {
      onViolation("PRINT_ATTEMPT");
    };

    // Detect Window Blur (potential screenshot or alt-tab)
    window.addEventListener('blur', () => {
      onViolation("WINDOW_BLUR");
    });

    // Additional security measures could be added here:
    // - Window resize detection
    // - Mouse leaving window detection
    // - Clipboard monitoring
  }
};

/**
 * AI Pattern Detection - Typing Monitor
 *
 * Analyzes typing patterns to detect potential automated scripts or bots.
 * Monitors keystroke timing for suspiciously perfect consistency.
 *
 * Algorithm: Calculates variance in typing intervals to detect robotic patterns
 */
export class TypingMonitor {
  constructor(threshold = 50) {
    this.lastTime = Date.now();
    this.intervals = [];
    this.threshold = threshold; // Minimum variance threshold (ms)
  }

  /**
   * Record a keystroke and analyze typing pattern
   *
   * @returns {string} - "SUSPICIOUS_TYPING_BOT" if pattern detected, "OK" otherwise
   */
  recordKeystroke() {
    const now = Date.now();
    const diff = now - this.lastTime;
    this.intervals.push(diff);
    this.lastTime = now;

    // Analyze last 10 keystrokes for consistency
    if (this.intervals.length > 10) {
      const variance = this.calculateVariance(this.intervals.slice(-10));
      if (variance < 5) { // Very low variance indicates robotic typing
        return "SUSPICIOUS_TYPING_BOT";
      }
    }
    return "OK";
  }

  /**
   * Calculate statistical variance of an array
   *
   * @param {number[]} arr - Array of numbers
   * @returns {number} - Variance value
   */
  calculateVariance(arr) {
    const mean = arr.reduce((a, b) => a + b) / arr.length;
    return arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
  }
}