import { useState, useEffect, useRef } from "react";

const QuizSecurity = ({ handleExamSubmit }) => {
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

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
        setWarningMessage("FINAL WARNING: Quiz is being canceled due to repeated security violations.");
        setShowWarning(true);

        setTimeout(() => {
          handleExamSubmit(true);
        }, 2000);
      }, 10000);
    }

    if (newWarningCount < 3) {
      setWarningMessage(`WARNING ${newWarningCount}/2: ${message} ${newWarningCount < 2 ? "One more violation and your quiz will be canceled." : ""}`);
    } else {
      setWarningMessage("FINAL WARNING: Quiz is being canceled due to repeated security violations.");
      setTimeout(() => {
        handleExamSubmit(true);
      }, 2000);
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
    const tabId = Date.now().toString();
    localStorage.setItem("currentQuizTab", tabId);

    const handleNewTabOrWindow = (e) => {
      // Detect if the 'currentQuizTab' key has changed, indicating that another tab or window has opened
      if (e.key === "currentQuizTab" && e.newValue !== tabId) {
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
      {showWarning && (
        <div className="security-warning">
          <div className="security-warning-header">
            <h4 className="security-warning-title">Security Warning</h4>
            <button className="security-warning-close" onClick={closeWarning}>X</button>
          </div>
          <p className="security-warning-message">{warningMessage}</p>
        </div>
      )}
    </div>
  );
};

export default QuizSecurity;