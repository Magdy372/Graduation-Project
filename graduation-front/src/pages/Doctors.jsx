import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ViewUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hiddenUsers, setHiddenUsers] = useState({}); // Track hidden users

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const controller = new AbortController();
      fetchUsers(controller.signal);
      return () => controller.abort();
    } catch (error) {
      console.error("Invalid token:", error);
      navigate("/login");
    }
  }, []);

  const fetchUsers = async (signal) => {
    try {
      const response = await fetch("http://localhost:8089/users/view-all", { signal });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      const updatedUsers = data.map((user) => {
        const storedApproval = localStorage.getItem(`approved_${user.id}`);
        return { ...user, approved: storedApproval === "true" };
      });

      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching users:", error);
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (user) =>
          user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !hiddenUsers[user.id] // Hide users marked as hidden
      )
    );
  }, [searchQuery, users, hiddenUsers]);

  const handleAccept = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8089/users/${userId}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      localStorage.setItem(`approved_${userId}`, "true");

      setHiddenUsers((prev) => ({ ...prev, [userId]: true })); // Hide user instantly
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleReload = () => {
    setLoading(true);
    setError(null);
    fetchUsers(new AbortController().signal);
  };

  const fileLabels = {
    professionLicenseFilePath: "رخصة المهنة",
    licenseFilePath: "رخصة",
    syndicateCardFilePath: "بطاقة النقابة",
    commercialRegisterFilePath: "السجل التجاري",
    taxCardFilePath: "بطاقة الضرائب",
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
      <h1 className="text-3xl text-red font-bold text-right mb-8">قائمة الدكاترة</h1>

      <div className="flex justify-end">
        <div className="mb-8 w-[375px]">
          <input
            type="text"
            placeholder="... بحث في الدكاترة"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue text-right"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              className="border border-gray rounded-lg overflow-hidden shadow-md p-5 transition-transform transform hover:scale-105 bg-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mt-2 text-right">
                {user.firstname} <span className="text-red">: الاسم</span>
              </div>
              <div className="mt-2 text-right">
                {user.email} <span className="text-red">: الإيميل</span>
              </div>
              <div className="mt-2 text-right">
                {user.phonenumber} <span className="text-red">: رقم الهاتف</span>
              </div>
              <div className="mt-2 text-right">
                <span className="text-red"> المسمي الوظيفي : </span> {user.title}
              </div>
              <div className="mt-2 text-right">
                <span className="text-red"> محافظة : </span> {user.governorate}
              </div>

              <hr className="my-4 border-t-2 border-gray-300" />

              {[
                "professionLicenseFilePath",
                "licenseFilePath",
                "syndicateCardFilePath",
                "commercialRegisterFilePath",
                "taxCardFilePath",
              ].map(
                (field) =>
                  user[field] && (
                    <div key={field} className="mt-2 text-right">
                      <a
                        href={`http://localhost:8089/uploads/${user[field].split("\\").pop()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red hover:underline"
                      >
                        {fileLabels[field]}
                      </a>
                    </div>
                  )
              )}

              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => handleAccept(user.id)}
                  className="w-full px-4 py-2 text-white rounded-lg transition bg-blue hover:bg-red"
                >
                  قبول
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-xl text-center w-full">لا يوجد دكاترة</p>
        )}
      </div>
    </div>
  );
};

export default ViewUsers;
