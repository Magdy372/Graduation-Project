import React, { useState, useEffect } from 'react';
import { getMessage } from './services/api';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    getMessage()
      .then((data) => setMessage(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div>
      <h1>Vite + React + Spring Boot</h1>
      <p>Backend Message: {message}</p>
    </div>
  );
}

export default App;
