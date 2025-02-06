import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const ViewUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from API
  const fetchUsers = async (signal) => {
    try {
      const response = await fetch("http://localhost:8089/users/view-all", { signal });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
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
    const controller = new AbortController();
    fetchUsers(controller.signal);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.firstname.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, users]);

  // Function to approve a user
  const handleAccept = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8089/users/${userId}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      // Update UI to reflect approval
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, approved: true } : user
        )
      );
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  // Reload function to retry fetch
  const handleReload = () => {
    setLoading(true);
    setError(null);
    fetchUsers(new AbortController().signal);
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

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Users Grid */}
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
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-600">{user.phonenumber}</p>

                {/* User Documents */}
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
                          View {field.replace("FilePath", "")}
                        </a>
                      </div>
                    )
                )}

                {/* Accept Button */}
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => handleAccept(user.id)}
                    className={`px-4 py-2 text-white rounded-lg transition ${
                      user.approved ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                    }`}
                    disabled={user.approved}
                  >
                    {user.approved ? "Approved ✅" : "Accept"}
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