import React, { useState, useEffect } from 'react';
import { ProgressService } from '../services/progressService';
import { motion } from 'framer-motion';
import { FaDownload, FaEye } from 'react-icons/fa';

const CertificatesList = ({ userId }) => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const data = await ProgressService.getUserCertificates(userId);
                setCertificates(data);
                setError(null);
            } catch (error) {
                console.error('Error fetching certificates:', error);
                setError('Failed to load certificates. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, [userId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-4 bg-red-100 rounded-lg">
                {error}
            </div>
        );
    }

    if (certificates.length === 0) {
        return (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No certificates earned yet.</p>
                <p className="text-sm text-gray-500 mt-2">
                    Complete courses to earn certificates!
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, index) => (
                <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                    <div className="border-b border-gray-200 pb-4 mb-4">
                        <h3 className="text-xl font-semibold text-blue">
                            {cert.courseName}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                            Completed on {new Date(cert.issueDate).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="space-y-2 text-gray-600">
                        <div className="flex justify-between items-center">
                            <span>Certificate Number:</span>
                            <span className="font-mono text-sm">{cert.certificateNumber}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Final Score:</span>
                            <span className="font-semibold text-red">
                                {cert.finalScore}%
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={() => window.open(`${cert.pdfUrl}`, '_blank')}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue text-white rounded-lg hover:bg-red transition-colors"
                        >
                            <FaEye />
                            View
                        </button>
                        <button
                            onClick={() => window.open(`${cert.pdfUrl}?download=true`, '_blank')}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <FaDownload />
                            Download
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default CertificatesList; 