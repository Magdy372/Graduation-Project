import { useEffect, useState } from 'react';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch messages from the backend when the component mounts
  useEffect(() => {
    // Fetch the messages from the backend
    fetch("http://localhost:8089/users/get-messages")
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        return response.json();
      })
      .then((data) => {
        setMessages(data);  // Assume the response is an array of messages
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);  // Handle the error
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Messages</h2>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Messages</h2>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Messages</h2>
      <div className="space-y-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-300"
          >
            {/* Render the message content */}
            <p>{message.mess}</p> {/* assuming 'mess' is a field in the response */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
