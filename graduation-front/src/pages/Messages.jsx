import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../services/UserService';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await fetchWithAuth("http://localhost:8089/users/get-messages");
        
        // Check if the response contains an error
        if (response.error) {
          setError(response.error + (response.details ? `: ${response.details}` : ''));
          return;
        }
        
        setMessages(response);
        setError(null);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError(error.message || 'Failed to fetch messages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Messages</h2>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Messages</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Messages</h2>
      {messages.length === 0 ? (
        <div className="text-gray-500 text-center py-4">No messages found.</div>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className="bg-white p-4 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-300"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-grow">
                  <p className="text-gray-600">{message.message}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>From: {message.senderName}</p>
                    <p>Email: {message.senderEmail}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;
