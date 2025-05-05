import React from 'react';
import { FaCertificate } from 'react-icons/fa';
import { motion } from 'framer-motion';

const CertificateModal = ({
  isOpen,
  onClose,
  status,
  certificateData,
  finalScore,
  error,
  onRetry,
  onRequest
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>

        <div className="text-center">
          {status === 'loading' ? (
            <div className="py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Processing your request...</p>
            </div>
          ) : status === 'success' ? (
            <div className="py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCertificate className="text-green-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-yellow-600 mb-2">
                Certificate Request Submitted!
              </h3>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg text-left">
                <p className="text-gray-700">
                  Your certificate request has been received and is under review.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Please check your email or profile page for updates regarding the certificate status.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Close
              </button>
            </div>
          ) : status === 'exists' ? (
            <div className="py-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCertificate className="text-blue text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-blue mb-2">
                Certificate Already Exists
              </h3>
              {certificateData && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg text-left">
                  <p className="text-gray-700">Certificate Number: {certificateData.certificateNumber}</p>
                  <p className="text-gray-700">Issue Date: {new Date(certificateData.issueDate).toLocaleDateString()}</p>
                </div>
              )}
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-blue text-white rounded-md hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          ) : status === 'error' ? (
            <div className="py-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCertificate className="text-red-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-red-600 mb-4">
                Unable to Generate Certificate
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={onRetry}
                  className="px-6 py-2 bg-red text-white rounded-md hover:bg-red-600"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="py-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCertificate className="text-blue text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-blue mb-4">
                Request Course Certificate
              </h3>
              <p className="text-gray-600 mb-6">
                Would you like to generate your course completion certificate?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={onRequest}
                  className="px-6 py-2 bg-blue text-white rounded-md hover:bg-blue-600"
                >
                  Generate Certificate
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CertificateModal; 