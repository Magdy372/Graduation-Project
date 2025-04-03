import { useState, useEffect, useRef } from "react";

/**
 * Enhanced quiz security component that:
 * - Prevents tab switching with 10-second return timer
 * - Auto-submits if user doesn't return within timeout
 * - Detects multiple tabs
 * - Selectively blocks right-click (only blocks inspect element)
 * - Controls which text can be copied
 * - Shows custom warning popups with countdown timer
 * 
 * @param {Function} handleExamSubmit - Function to submit the exam
 * @returns {JSX.Element} Security component that shows custom warnings with timer
 */
const QuizSecurity = ({ handleExamSubmit }) => {
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  // Function to handle security violations with custom popup and countdown
  const handleSecurityViolation = (message, isTabSwitch = false) => {
    // Clear any existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const newWarningCount = warningCount + 1;
    setWarningCount(newWarningCount);

    // Reset timer for tab switches
    if (isTabSwitch) {
      setTimeRemaining(10);

      // Start countdown interval
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Set timeout for auto-submission if user doesn't return in time
      timeoutRef.current = setTimeout(() => {
        // Show final warning after timeout
        setWarningCount(3); // Set to max warnings
        setWarningMessage("FINAL WARNING: Quiz is being canceled due to repeated security violations.");
        setShowWarning(true);

        // Submit the exam after showing the warning
        setTimeout(() => {
          handleExamSubmit(true);  // This will auto-submit the exam
        }, 2000);
      }, 10000);  // Timeout for 10 seconds
    }

    // Set warning message and show popup
    if (newWarningCount < 3) {
      setWarningMessage(`WARNING ${newWarningCount}/2: ${message} ${newWarningCount < 2 ? "One more violation and your quiz will be canceled." : ""}`);
    } else {
      setWarningMessage("FINAL WARNING: Quiz is being canceled due to repeated security violations.");

      // Give a moment for the user to see the final warning
      setTimeout(() => {
        handleExamSubmit(true);  // This will auto-submit the exam
      }, 2000);
    }

    setShowWarning(true);
  };

  // Close the warning popup
  const closeWarning = () => {
    setShowWarning(false);
  };

  // Function to detect browser dev tools
  const devToolsDetector = () => {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;

    if (widthThreshold || heightThreshold) {
      handleSecurityViolation("Developer tools detected!");
    }
  };

  // Detect tab switching, minimizing or document visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Only count as violation when tab becomes hidden, not when returning
      if (document.hidden && !isHidden) {
        setIsHidden(true);
        setTabSwitchCount((prev) => prev + 1);
        handleSecurityViolation(`You switched tabs or minimized the window! Return within ${timeRemaining} seconds or your quiz will be submitted.`, true);
      } else if (!document.hidden && isHidden) {
        // Reset hidden state when returning to tab
        setIsHidden(false);

        // Clear the timeout and interval when user returns
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        // Reset the timer if user returns before timeout
        setTimeRemaining(10);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Also detect when window loses focus
    const handleBlur = () => {
      if (!isHidden) {
        setIsHidden(true);
        handleSecurityViolation(`You switched focus away from the quiz! Return within ${timeRemaining} seconds or your quiz will be submitted.`, true);
      }
    };

    const handleFocus = () => {
      if (isHidden) {
        setIsHidden(false);

        // Clear the timeout and interval when user returns
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        // Reset the timer if user returns before timeout
        setTimeRemaining(10);
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    // Check every second if dev tools are open
    const devToolsInterval = setInterval(devToolsDetector, 1000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      clearInterval(devToolsInterval);
    };
  }, [tabSwitchCount, warningCount, isHidden, timeRemaining]);

  // Detect multiple tabs for the same quiz
  useEffect(() => {
    const tabId = Date.now().toString();
    localStorage.setItem("currentQuizTab", tabId);

    const handleNewTab = (e) => {
      if (e.key === "currentQuizTab" && e.newValue !== tabId) {
        handleSecurityViolation("Multiple quiz tabs detected!");
      }
    };

    window.addEventListener("storage", handleNewTab);

    return () => {
      window.removeEventListener("storage", handleNewTab);
      localStorage.removeItem("currentQuizTab");
    };
  }, []);

  // Handle right-click selectively, disable copy-paste, printing, and developer tools
  useEffect(() => {
    // Customize context menu instead of disabling completely
    const handleContextMenu = (e) => {
      // Only track right-clicks, don't prevent default behavior
      // This allows normal right-click menu but we'll monitor for dev tools
    };

    // Selectively control copy/paste
    const handleCopyPaste = (e) => {
      // Allow copying text from elements with class 'copyable'
      if (e.target.closest('.copyable')) {
        // Let the copy action proceed
        return true;
      }

      // Block copy/paste in protected areas
      if (e.target.closest('.quiz-content') && 
        e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
        e.preventDefault();
        handleSecurityViolation("Copy and paste are disabled for quiz content!");
        return false;
      }
    };

    // Disable print, save, view source, and developer tools
    const disableKeys = (e) => {
      // Ctrl+P (Print), Ctrl+S (Save), Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === 'p' || e.key === 's' || e.key === 'u')) {
        e.preventDefault();
        handleSecurityViolation("This action is disabled during the quiz!");
        return false;
      }

      // F12 key (Developer Tools)
      if (e.key === 'F12') {
        e.preventDefault();
        handleSecurityViolation("Developer tools are disabled during the quiz!");
        return false;
      }

      // Alt+Tab - note: can't fully prevent this at browser level
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        handleSecurityViolation("Switching applications is disabled during the quiz!");
        return false;
      }

      // Ctrl+Shift+I, Ctrl+Shift+J (Developer Tools)
      if (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'j' || e.key === 'c')) {
        e.preventDefault();
        handleSecurityViolation("Developer tools are disabled during the quiz!");
        return false;
      }
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleCopyPaste);
    document.addEventListener("keydown", disableKeys);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleCopyPaste);
      document.removeEventListener("keydown", disableKeys);
    };
  }, []);

  // CSS to disable text selection and drag in quiz content areas
  // but allow it in copyable elements
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .quiz-content * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }

      .quiz-content img, .quiz-content * {
        -webkit-user-drag: none !important;
        -moz-user-drag: none !important;
        -ms-user-drag: none !important;
        user-drag: none !important;
      }

      .copyable {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
        cursor: text;
      }

      .security-warning {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #fff1f0;
        border: 1px solid #ff4d4f;
        border-radius: 4px;
        padding: 16px 24px;
        box-shadow: 0 3px 6px rgba(0,0,0,0.15);
        z-index: 1000;
        max-width: 400px;
        width: 100%;
      }

      .security-warning-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .security-warning-title {
        font-size: 16px;
        font-weight: bold;
        color: #ff4d4f;
      }

      .security-warning-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #ff4d4f;
      }

      .security-warning-message {
        font-size: 14px;
        color: #333;
      }

      .security-timer {
        margin-top: 10px;
        font-size: 14px;
        color: #ff4d4f;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div>
      {showWarning && (
        <div className="security-warning">
          <div className="security-warning-header">
            <h4 className="security-warning-title">Security Warning</h4>
            <button className="security-warning-close" onClick={closeWarning}>X</button>
          </div>
          <p className="security-warning-message">{warningMessage}</p>
          <div className="security-timer">Time remaining: {timeRemaining} seconds</div>
        </div>
      )}
    </div>
  );
};

export default QuizSecurity;
