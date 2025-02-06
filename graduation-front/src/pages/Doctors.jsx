import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import jwtDecode from "jwt-decode";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const ViewUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login"); // Redirect to login if no token
      return;
    }

    try {
      // Fetch users
      const controller = new AbortController();
      fetchUsers(controller.signal);
      return () => controller.abort();
    } catch (error) {
      console.error("Invalid token:", error);
      navigate("/login"); // Redirect if the token is invalid
    }
  }, []);

  const fetchUsers = async (signal) => {
    try {
      const response = await fetch("http://localhost:8089/users/view-all", { signal });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      // Retrieve approval status from localStorage and update users state
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
    // Filter users based on search query
    setFilteredUsers(
      users.filter((user) =>
        user.firstname.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, users]);

  const handleAccept = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8089/users/${userId}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      // Update the users list and persist approval state in localStorage
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.id === userId) {
            localStorage.setItem(`approved_${userId}`, "true"); // Store approval status
            return { ...user, approved: true };
          }
          return user;
        })
      );
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
    taxCardFilePath: "بطاقة الضرائب"
  };
 

  if (loading) return <p className="text-xl text-center w-full">Loading...</p>;
  if (error)
    return (
      <div className="text-xl text-center w-full">
        <p>Error: {error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleReload}
        >
          Retry
        </button>
      </div>
    );

    return (
      <>
        <Navbar />
        <div className="container mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold text-center mb-8">Users</h1>
    
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
    
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  className="border border-gray-300 rounded-lg overflow-hidden shadow-md p-5 transition-transform transform hover:scale-105"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-xl font-semibold">{user.firstname}</h2>
    
                  {/* Display user information */}
                  <div className="mt-2">
                    <strong>الاسم:</strong> {user.firstname}
                  </div>
                  <div className="mt-2">
                    <strong>الإيميل:</strong> {user.email}
                  </div>
                  <div className="mt-2">
                    <strong>رقم الهاتف:</strong> {user.phonenumber}
                  </div>
                  <div className="mt-2">
                    <strong>المسمى الوظيفي:</strong> {user.title}
                  </div>

                  <div className="mt-2">
                    <strong>محافظة</strong>:{user.governorate}
                  </div>
    
                  {/* Links to Files with Arabic names */}
                  {["professionLicenseFilePath", "licenseFilePath", "syndicateCardFilePath", "commercialRegisterFilePath", "taxCardFilePath"].map(
          (field) =>
            user[field] && (
              <div key={field} className="mt-2">
                <a
                  href={`http://localhost:8089/uploads/${user[field].split("\\").pop()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  <strong>عرض {fileLabels[field]}</strong>
                </a>
              </div>
                      )
                  )}
    
                  <div className="mt-4 flex gap-4">
                    <button
                      onClick={() => handleAccept(user.id)}
                      className={`px-4 py-2 text-white rounded-lg transition ${
                        user.approved
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                      disabled={user.approved}
                    >
                      {user.approved ? "تم ✅" : "قبول"}
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-xl text-center w-full">No users found</p>
            )}
          </div>
        </div>
      </>
    );
  };
    export default ViewUsers;
    