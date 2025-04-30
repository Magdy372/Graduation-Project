import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProctoringDisclaimer = ({ onAccept }) => {
  const navigate = useNavigate();

  const handleAccept = () => {
    onAccept(); // Start the exam
  };

  const handleDecline = () => {
    navigate('/courses'); // Navigate back
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-red-600">Exam Security Check</h1>
        
        <div className="mb-6 space-y-4">
          <p className="font-semibold">Before starting your exam, please ensure:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your camera is working properly</li>
            <li>Your face is clearly visible</li>
            <li>You are in a well-lit environment</li>
            <li>You have no prohibited items nearby</li>
          </ul>
          
          <p className="text-sm text-gray-600 mt-4">
            The system will automatically monitor your exam session for security purposes.
            Any violations will be recorded and may be reviewed by your instructor.
          </p>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleDecline}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleAccept}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Start Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProctoringDisclaimer;
