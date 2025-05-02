import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ApprovedDoctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminGovernorate, setAdminGovernorate] = useState("");  // محافظة الـ Admin

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const candidate = decodedToken.candidate;

      if (candidate === "الطب") {
        setIsAuthorized(true);
        setAdminGovernorate(decodedToken.governorate); // تخزين محافظة الـ Admin
        const controller = new AbortController();
        fetchDoctors(controller.signal);
        return () => controller.abort();
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Invalid token:", error);
      navigate("/login");
    }
  }, []);

  const fetchDoctors = async (signal) => {
    try {
      const response = await fetch("http://localhost:8089/users/approved/دكتور", { signal });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setDoctors(data);
      setFilteredDoctors(data.filter(doctor => doctor.governorate === adminGovernorate));  // تصفية الأطباء حسب المحافظة
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching doctors:", error);
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilteredDoctors(
      doctors.filter(
        (doctor) =>
          (doctor.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.email.toLowerCase().includes(searchQuery.toLowerCase())) && 
          doctor.governorate === adminGovernorate  // تصفية الأطباء حسب البحث والمحافظة
      )
    );
  }, [searchQuery, doctors, adminGovernorate]); // إضافة محافظة الـ Admin هنا

  const handleReload = () => {
    setLoading(true);
    setError(null);
    fetchDoctors(new AbortController().signal);
  };

  if (loading) return <p className="text-xl text-center w-full">Loading...</p>;

  if (!isAuthorized)
    return (
      <div className="text-center text-xl text-red-600 mt-8">
        غير مصرح لك بعرض قائمة الأطباء — هذا القسم مخصص للطب فقط
      </div>
    );

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
      <h1 className="text-3xl text-red font-bold text-right mb-8">
        قائمة الأطباء المعتمدين
      </h1>

      <div className="flex justify-end">
        <div className="mb-8 w-[375px]">
          <input
            type="text"
            placeholder="... بحث في الأطباء"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue text-right"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            // Ensure doctor.id is unique
            <motion.div
              key={doctor.id}
              className="border border-gray rounded-lg overflow-hidden shadow-md p-5 transition-transform transform hover:scale-105 bg-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mt-2 text-right">
                {doctor.firstname} <span className="text-red">: الاسم</span>
              </div>
              <div className="mt-2 text-right">
                {doctor.email} <span className="text-red">: الإيميل</span>
              </div>
              <div className="mt-2 text-right">
                {doctor.phonenumber} <span className="text-red">: رقم الهاتف</span>
              </div>
              <div className="mt-2 text-right">
                <span className="text-red"> المسمي الوظيفي : </span> {doctor.title}
              </div>
              <div className="mt-2 text-right">
                <span className="text-red"> محافظة : </span> {doctor.governorate}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-xl text-gray-600">لا يوجد أطباء معتمدين حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovedDoctors;
