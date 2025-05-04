import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const CertificateList = () => {
  const [certificates, setCertificates] = useState([]);
  const [violations, setViolations] = useState(null);
  const [showViolationsModal, setShowViolationsModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch pending certificates
  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:8087/api/certificates/pending")
      .then(response => {
        setCertificates(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching certificates:", error);
        setLoading(false);
      });
  }, []);

  const handleViewViolations = (certificateId, courseId, userId) => {
    setLoading(true);
    axios.get(`http://localhost:8087/api/quizzes/course/${courseId}/user/${userId}/attempts-with-violations`)
      .then(response => {
        setViolations(response.data);
        setShowViolationsModal(true);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching violations:", error);
        setLoading(false);
      });
  };

  const handleAcceptCertificate = (certificateId) => {
    axios.put(`http://localhost:8087/api/certificates/${certificateId}/status?newStatus=ACCEPTED`)
      .then(() => {
        setCertificates(certificates.filter(cert => cert.id !== certificateId));
      })
      .catch(error => console.error("Error accepting certificate:", error));
  };

  const handleRejectCertificate = (certificateId) => {
    axios.put(`http://localhost:8087/api/certificates/${certificateId}/status?newStatus=REJECTED`)
      .then(() => {
        setCertificates(certificates.filter(cert => cert.id !== certificateId));
      })
      .catch(error => console.error("Error rejecting certificate:", error));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-right">الشهادات المعلقة</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      ) : certificates.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الشهادة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الدرجة النهائية</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {certificates.map((certificate) => (
                  <tr key={certificate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{certificate.certificateNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(certificate.issueDate).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{certificate.finalScore}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        certificate.status === 'PENDING' ? 'bg-yellow-200 text-yellow-800 border border-yellow-400' :
                        certificate.status === 'ACCEPTED' ? 'bg-green-200 text-green-800 border border-green-400' :
                        'bg-red-200 border border-red-400'
                      }`}>
                        {certificate.status === 'PENDING' ? 'قيد الانتظار' :
                         certificate.status === 'ACCEPTED' ? 'تم القبول' :
                         <span className="text-red-600">رفض</span>}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 space-x-reverse">
                      <button
                        onClick={() => handleViewViolations(certificate.id, certificate.courseId, certificate.userId)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                      >
                        عرض الانتهاكات
                      </button>
                      <button
                        onClick={() => handleAcceptCertificate(certificate.id)}
                        className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors"
                      >
                        <CheckCircle className="inline-block w-4 h-4 mr-1" />
                        قبول
                      </button>
                      <button
                        onClick={() => handleRejectCertificate(certificate.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                      >
                        <XCircle className="inline-block w-4 h-4 mr-1" />
                        رفض
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد شهادات معلقة</h3>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showViolationsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">عرض الانتهاكات</h3>
                  <button
                    onClick={() => setShowViolationsModal(false)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {violations && violations.map((attempt, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">محاولة الاختبار: {attempt.quizId}</h4>
                      <p className="text-sm text-gray-600 mb-2">الدرجة: {attempt.score}</p>
                      
                      <div className="mt-3">
                        <h5 className="font-medium text-gray-900 mb-2">الانتهاكات:</h5>
                        <div className="space-y-2">
                          {attempt.violations.map((violation, vIndex) => (
                            <div key={vIndex} className="bg-white rounded-md p-3 border border-gray-200">
                              <p className="text-sm font-medium text-red-600">نوع الانتهاك: {violation.violation}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {(() => {
                                  const start = new Date(violation.startTime);
                                  const end = new Date(violation.endTime);
                                  const diffMs = end - start;
                                  const diffSec = Math.floor(diffMs / 1000);
                                  const diffMin = Math.floor(diffSec / 60);
                                  const seconds = diffSec % 60;
                                  return (
                                    <p className="text-sm text-gray-600 mt-1">
                                      المدة: {diffMin > 0 ? `${diffMin} دقيقة` : ""} {seconds > 0 ? `${seconds} ثانية` : ""}
                                    </p>
                                  );
                                })()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CertificateList;
