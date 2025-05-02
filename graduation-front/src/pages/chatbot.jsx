import React, { useState, useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setMessages([{ sender: "bot", text: "Hi there! I'm here to help you 😊" }]);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { sender: "user", text: userInput };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:8084/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();
      const botMessage = { sender: "bot", text: data.response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    }

    setUserInput("");
    setIsTyping(false);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-red text-white w-24 h-24 flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-10"
      >
        <MessageCircle size={40} />
      </button>

      {isOpen && (
        <div className="fixed bottom-32 right-4 w-96 h-[450px] bg-white rounded-lg shadow-lg border border-red p-6 flex flex-col space-y-4">
          <div className="flex-1 overflow-y-auto space-y-4" ref={chatContainerRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`relative p-3 max-w-xs w-fit text-lg shadow-lg ${
                  msg.sender === "user"
                    ? "bg-blue text-white rounded-2xl text-left ml-auto"
                    : "bg-gray-200 text-gray-900 rounded-2xl text-left mr-auto"
                }`}
                style={{ borderRadius: "20px 20px 20px 5px", padding: "12px 18px" }}
              >
                {msg.text}
              </div>
            ))}

            {isTyping && (
              <div className="p-4 rounded-lg max-w-xs w-fit bg-gray-200 text-gray-900 mr-auto text-left shadow-sm">
                <span>Bot is typing...</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue transition-all duration-200 text-black"
            />
            <button
              onClick={sendMessage}
              className="bg-blue text-white px-6 py-3 rounded-lg hover:bg-blue transition-all duration-200"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
