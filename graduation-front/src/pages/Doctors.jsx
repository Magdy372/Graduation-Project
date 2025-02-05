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

  // Function to fetch users with abort support
  const fetchUsers = async (signal) => {
    try {
      const response = await fetch("http://localhost:8089/users/view-all", { signal });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      // If the fetch was aborted, don't update state
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("Error fetching users:", error);
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    fetchUsers(signal);

    // Cleanup: abort fetch if the component unmounts
    return () => controller.abort();
  }, []);

  // Handle search filtering
  useEffect(() => {
    const filtered = users.filter((user) =>
      user.firstname.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  // Reload function for retrying fetch
  const handleReload = () => {
    setLoading(true);
    setError(null);
    // Create a new AbortController for the new fetch
    const controller = new AbortController();
    fetchUsers(controller.signal);
  };

  if (loading) {
    return <p className="text-xl text-center w-full">Loading...</p>;
  }

  if (error) {
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
  }

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
                className="border border-gray-300 rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform transform hover:scale-105 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="p-5">
                  <h2 className="text-xl font-semibold">{user.firstname}</h2>
                  <p className="text-gray-600">{user.email}</p>
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
