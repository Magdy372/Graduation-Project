import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { jwtDecode } from "jwt-decode";
import ProctoringDisclaimer from "../components/ProctoringDisclaimer";

const QuizSecurity = forwardRef(({ handleExamSubmit }, ref) => {
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
  const [violations, setViolations] = useState([]);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [isProctoringError, setIsProctoringError] = useState(false);

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
      return false;
    }
  };

  // Function to stop proctoring and get violations
  const stopProctoring = async () => {
    try {
      if (!proctoringActive) return [];

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

      // Get final violations
      const violationsResponse = await fetch('http://localhost:5000/get_violations');
      if (!violationsResponse.ok) {
        throw new Error('Failed to get violations');
      }

      const data = await violationsResponse.json();
      setProctoringActive(false);
      setIsProctoringReady(false);

      // Clear the status check interval
      if (proctoringIntervalRef.current) {
        clearInterval(proctoringIntervalRef.current);
        proctoringIntervalRef.current = null;
      }

      return data.violations || [];
    } catch (error) {
      console.error('Error stopping proctoring:', error);
      return [];
    }
  };

  // Override the handleExamSubmit to stop proctoring before submitting
  const handleSubmit = async (isViolation = false) => {
    try {
      if (proctoringActive) {
        // Get final violations before stopping
        const violationsResponse = await fetch('http://localhost:5000/get_violations');
        if (violationsResponse.ok) {
          const data = await violationsResponse.json();
          if (data.violations && data.violations.length > 0) {
            isViolation = true;
            setViolations(prevViolations => [...prevViolations, ...data.violations]);
          }
        }

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

  // Handle disclaimer acceptance
  const handleDisclaimerAccept = () => {
    setShowDisclaimer(false);
    startProctoring();
  };

  useEffect(() => {
    if (!showDisclaimer) {
      // Check for violations periodically
      const violationCheckInterval = setInterval(async () => {
        if (proctoringActive) {
          try {
            const response = await fetch('http://localhost:5000/get_violations');
            if (!response.ok) {
              throw new Error('Failed to get violations');
            }
            
            const data = await response.json();
            if (data.violations && data.violations.length > 0) {
              setViolations(prevViolations => [...prevViolations, ...data.violations]);
              handleSecurityViolation(`Security violation detected: ${data.violations[0].type}`);
            }
          } catch (error) {
            console.error('Error checking violations:', error);
          }
        }
      }, 30000); // Check every 30 seconds

      return () => {
        if (violationCheckInterval) {
          clearInterval(violationCheckInterval);
        }
      };
    }
  }, [showDisclaimer, proctoringActive]);

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
        setWarningMessage("FINAL WARNING: Multiple security violations detected. Your exam will continue, but violations will be recorded.");
        setShowWarning(true);
      }, 10000);
    }

    if (newWarningCount < 3) {
      setWarningMessage(`WARNING ${newWarningCount}/2: ${message} ${newWarningCount < 2 ? "One more violation and you will receive a final warning." : ""}`);
    } else {
      setWarningMessage("FINAL WARNING: Multiple security violations detected. Your exam will continue, but violations will be recorded.");
    }

    setShowWarning(true);
  };

  const closeWarning = () => {
    setShowWarning(false);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isHidden) {
        setIsHidden(true);
        setTabSwitchCount((prev) => prev + 1);
        handleSecurityViolation(`You switched tabs or minimized the window! Return within ${timeRemaining} seconds or your quiz will be submitted.`, true);
      } else if (!document.hidden && isHidden) {
        setIsHidden(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, [tabSwitchCount, warningCount, isHidden, timeRemaining]);

  useEffect(() => {
    const handleNewTabOrWindow = (e) => {
      if (e.key === "currentQuizTab" && e.newValue !== localStorage.getItem("currentQuizTab")) {
        handleSecurityViolation("Multiple quiz sessions detected! Please close other windows/tabs.");
      }
    };

    window.addEventListener("storage", handleNewTabOrWindow);
    return () => {
      window.removeEventListener("storage", handleNewTabOrWindow);
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

  return (
    <div>
      {showDisclaimer ? (
        <ProctoringDisclaimer onAccept={handleDisclaimerAccept} />
      ) : (
        <>
          {!isProctoringReady && (
            <div className="fixed top-0 left-0 right-0 bg-yellow-100 p-4 text-center z-50">
              <p className="text-yellow-800 font-medium">
                This exam is proctored. The system is initializing your camera. Please wait while we set up the security measures.
                You will be able to start the exam once the camera is ready.
              </p>
            </div>
          )}
          {isProctoringError && (
            <div className="fixed top-0 left-0 right-0 bg-red-100 p-4 text-center z-50">
              <p className="text-red-800 font-medium">
                There was an error initializing the proctoring system. Your exam will continue, but violations may not be properly recorded.
              </p>
            </div>
          )}
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
          {violations.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-yellow-100 p-4 text-center z-50">
              <p className="text-yellow-800 font-medium">
                {violations.length} security violation(s) detected during this exam.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
});

QuizSecurity.displayName = 'QuizSecurity';

export default QuizSecurity;
