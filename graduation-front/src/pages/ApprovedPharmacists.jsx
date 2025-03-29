import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ApprovedPharmacists = () => {
  const navigate = useNavigate();
  const [pharmacists, setPharmacists] = useState([]);
  const [filteredPharmacists, setFilteredPharmacists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const controller = new AbortController();
      fetchPharmacists(controller.signal);
      return () => controller.abort();
    } catch (error) {
      console.error("Invalid token:", error);
      navigate("/login");
    }
  }, []);

  const fetchPharmacists = async (signal) => {
    try {
      const response = await fetch("http://localhost:8089/users/approved/صيدلي", { signal });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setPharmacists(data);
      setFilteredPharmacists(data);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching pharmacists:", error);
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilteredPharmacists(
      pharmacists.filter(
        (pharmacist) =>
          pharmacist.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pharmacist.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, pharmacists]);

  const handleReload = () => {
    setLoading(true);
    setError(null);
    fetchPharmacists(new AbortController().signal);
  };

  if (loading) return <p className="text-xl text-center w-full">Loading...</p>;
  if (error)
    return (
      <div className="text-xl text-center w-full">
        <p>Error: {error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue"
          onClick={handleReload}
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="container mx-auto px-6 bg-white">
      <h1 className="text-3xl text-red font-bold text-right mb-8">قائمة الصيادلة المعتمدين</h1>

      <div className="flex justify-end">
        <div className="mb-8 w-[375px]">
          <input
            type="text"
            placeholder="... بحث في الصيادلة"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue text-right"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPharmacists.length > 0 ? (
          filteredPharmacists.map((pharmacist) => (
            <motion.div
              key={pharmacist.id}
              className="border border-gray rounded-lg overflow-hidden shadow-md p-5 transition-transform transform hover:scale-105 bg-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mt-2 text-right">
                {pharmacist.firstname} <span className="text-red">: الاسم</span>
              </div>
              <div className="mt-2 text-right">
                {pharmacist.email} <span className="text-red">: الإيميل</span>
              </div>
              <div className="mt-2 text-right">
                {pharmacist.phonenumber} <span className="text-red">: رقم الهاتف</span>
              </div>
              <div className="mt-2 text-right">
                <span className="text-red"> المسمي الوظيفي : </span> {pharmacist.title}
              </div>
              <div className="mt-2 text-right">
                <span className="text-red"> محافظة : </span> {pharmacist.governorate}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-xl text-gray-600">لا يوجد صيادلة معتمدين حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovedPharmacists; 