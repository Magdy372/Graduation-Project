import { useState, useEffect } from "react";

const QuizSecurity = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const handleSecurityViolation = (message) => {
    setWarningMessage(message);
    setShowWarning(true);
  };

  const closeWarning = () => {
    setShowWarning(false);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isHidden) {
        setIsHidden(true);
        handleSecurityViolation("Please don’t switch tabs.");
      } else if (!document.hidden && isHidden) {
        setIsHidden(false);
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
  }, [isHidden]);

  useEffect(() => {
    const tabId = Date.now().toString(); // unique ID per tab
    localStorage.setItem("currentQuizTab", tabId);

    const handleNewTabOrWindow = (e) => {
      if (e.key === "currentQuizTab" && e.newValue !== tabId) {
        handleSecurityViolation("Multiple quiz windows detected. Please close the other tab.");
      }
    };

    window.addEventListener("storage", handleNewTabOrWindow);

    return () => {
      window.removeEventListener("storage", handleNewTabOrWindow);
      localStorage.removeItem("currentQuizTab");
    };
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
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
