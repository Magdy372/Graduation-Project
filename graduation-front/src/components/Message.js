import React, { useState, useEffect } from "react";

const Message = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8081/api/message") // API from Spring Boot
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch message");
        }
        return response.text();
      })
      .then((data) => setMessage(data))
      .catch((error) => console.error("Error fetching message:", error));
  }, []);

  return (
    <div>
      <h2>Message from Spring Boot:</h2>
      <p>{message || "Loading..."}</p>
    </div>
  );
};

export default Message;
