import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { jwtDecode } from "jwt-decode";
import ProctoringDisclaimer from "../components/ProctoringDisclaimer";

const QuizSecurity = forwardRef(({ handleExamSubmit, onProctoringError, onTabWarning }, ref) => {
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const proctoringIntervalRef = useRef(null);
  const [proctoringActive, setProctoringActive] = useState(false);
  const [isProctoringReady, setIsProctoringReady] = useState(false);
  const [isProctoringError, setIsProctoringError] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // Function to get user ID from auth token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.userId;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Function to start proctoring
  const startProctoring = async () => {
    try {
      console.log("Starting proctoring...");
      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error('User ID not found in token');
      }

      const response = await fetch('http://localhost:5000/start_proctoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId })
      });

      if (!response.ok) {
        throw new Error('Failed to start proctoring');
      }

      const data = await response.json();
      setProctoringActive(true);
      setIsProctoringReady(true);
      setIsProctoringError(false);
      if (onProctoringError) onProctoringError(false);

      // Start periodic status checks
      proctoringIntervalRef.current = setInterval(async () => {
        try {
          const statusResponse = await fetch('http://localhost:5000/get_status');
          if (!statusResponse.ok) {
            throw new Error('Failed to get proctoring status');
          }
          
          const statusData = await statusResponse.json();
          if (statusData.status !== 'active' || statusData.camera_status !== 'open') {
            handleSecurityViolation('Proctoring system error detected. Please ensure your camera is working properly.');
          }
        } catch (error) {
          console.error('Error checking proctoring status:', error);
        }
      }, 5000); // Check every 5 seconds

      return true;
    } catch (error) {
      console.error('Error starting proctoring:', error);
      setIsProctoringError(true);
      if (onProctoringError) onProctoringError(true);
      return false;
    }
  };

  // Function to stop proctoring
  const stopProctoring = async () => {
    try {
      if (!proctoringActive) return;

      // Stop the proctoring session
      const stopResponse = await fetch('http://localhost:5000/stop_proctoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!stopResponse.ok) {
        throw new Error('Failed to stop proctoring');
      }

      setProctoringActive(false);
      setIsProctoringReady(false);

      // Clear the status check interval
      if (proctoringIntervalRef.current) {
        clearInterval(proctoringIntervalRef.current);
        proctoringIntervalRef.current = null;
      }
    } catch (error) {
      console.error('Error stopping proctoring:', error);
    }
  };

  // Override the handleExamSubmit to stop proctoring before submitting
  const handleSubmit = async (isViolation = false) => {
    try {
      if (proctoringActive) {
        // Clear intervals
        if (proctoringIntervalRef.current) {
          clearInterval(proctoringIntervalRef.current);
          proctoringIntervalRef.current = null;
        }

        setProctoringActive(false);
        setIsProctoringReady(false);
      }

      // Call the original handleExamSubmit
      handleExamSubmit(isViolation);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      // Still proceed with exam submission even if there's an error
      handleExamSubmit(isViolation);
    }
  };

  // Expose handleSubmit through ref
  useImperativeHandle(ref, () => ({
    handleSubmit
  }));

  useEffect(() => {
    // Start proctoring immediately when component mounts
    startProctoring();
  }, []);

  const handleSecurityViolation = (message, isTabSwitch = false) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    const newWarningCount = warningCount + 1;
    setWarningCount(newWarningCount);

    if (isTabSwitch) {
      setTimeRemaining(10);
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      timeoutRef.current = setTimeout(() => {
        setWarningCount(3);
        if (onTabWarning) {
          onTabWarning("FINAL WARNING: Multiple security violations detected. Your exam will continue, but violations will be recorded.");
        }
      }, 10000);
    }

    if (newWarningCount < 3) {
      const warningMsg = `WARNING ${newWarningCount}/2: ${message} ${newWarningCount < 2 ? "One more violation and you will receive a final warning." : ""}`;
      if (onTabWarning) {
        onTabWarning(warningMsg);
      }
    } else {
      if (onTabWarning) {
        onTabWarning("FINAL WARNING: Multiple security violations detected. Your exam will continue, but violations will be recorded.");
      }
    }
  };

  const closeWarning = () => {
    setShowWarning(false);
  };

  useEffect(() => {
    let lastFocusTime = Date.now();
    let isCurrentlyHidden = false;

    const handleVisibilityChange = () => {
      if (document.hidden && !isCurrentlyHidden) {
        isCurrentlyHidden = true;
        setIsHidden(true);
        setTabSwitchCount(prev => prev + 1);
        alert("WARNING: You have switched tabs or minimized the window. Please return to your exam immediately!");
        if (onTabWarning) {
          onTabWarning("Please return to your exam tab and focus on your exam.");
        }
      } else if (!document.hidden && isCurrentlyHidden) {
        isCurrentlyHidden = false;
        setIsHidden(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    };

    const handleWindowFocus = () => {
      const currentTime = Date.now();
      if (currentTime - lastFocusTime > 1000 && isCurrentlyHidden) { // Only show if was actually hidden
        alert("WARNING: You have switched back to the exam tab. Please stay focused on your exam!");
        if (onTabWarning) {
          onTabWarning("Please stay focused on your exam.");
        }
      }
      lastFocusTime = currentTime;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [onTabWarning]);

  useEffect(() => {
    // Set up initial tab tracking
    const currentTabId = Date.now().toString();
    localStorage.setItem("currentQuizTab", currentTabId);

    const handleNewTabOrWindow = (e) => {
      if (e.key === "currentQuizTab") {
        const storedTabId = localStorage.getItem("currentQuizTab");
        if (storedTabId !== currentTabId) {
          handleSecurityViolation("Please close other windows/tabs and focus on your exam.", true);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleSecurityViolation("Please return to your exam tab and focus on your exam.", true);
      }
    };

    const handleWindowFocus = () => {
      const storedTabId = localStorage.getItem("currentQuizTab");
      if (storedTabId !== currentTabId) {
        handleSecurityViolation("Please close other windows/tabs and focus on your exam.", true);
      }
    };

    window.addEventListener("storage", handleNewTabOrWindow);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleWindowFocus);
    
    return () => {
      window.removeEventListener("storage", handleNewTabOrWindow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);
      localStorage.removeItem("currentQuizTab");
    };
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
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

  // Handle disclaimer acceptance
  const handleDisclaimerAccept = () => {
    setShowDisclaimer(false);
    startProctoring();
  };

  useEffect(() => {
    if (!showDisclaimer) {
      // Start proctoring when disclaimer is accepted
      startProctoring();
    }
  }, [showDisclaimer]);

  return (
    <div>
      {showDisclaimer ? (
        <ProctoringDisclaimer onAccept={handleDisclaimerAccept} />
      ) : (
        <>
         
          {showWarning && (
            <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-4 text-center z-50">
              <p>{warningMessage}</p>
              <button
                onClick={closeWarning}
                className="mt-2 px-4 py-2 bg-white text-red-500 rounded hover:bg-red-100"
              >
                Dismiss
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
});

QuizSecurity.displayName = 'QuizSecurity';

export default QuizSecurity;
