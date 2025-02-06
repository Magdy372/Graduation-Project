import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { motion } from "framer-motion";
import { fetchWithAuth }from '../services/UserService.js';
import { jwtDecode } from "jwt-decode";
import profileImage from '../assets/images/profile-image.jpg';


// Your fade animation for smooth transitions
export const FadeUp = (delay) => {
  return {
    initial: {
      opacity: 0,
      y: 50,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        duration: 0.5,
        delay: delay,
        ease: "easeInOut",
      },
    },
  };
};

const MyProfile = () => {
  const [userData, setUserData] = useState(null);  // State to store user data
  const [isLoading, setIsLoading] = useState(true); // State for loading spinner or UI state
  const [error, setError] = useState(""); // State for handling errors

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Retrieve the token from localStorage (or sessionStorage or any other storage)
        const token = localStorage.getItem('access_token');  // Ensure this matches your actual token key

        if (!token) {
          setError("No token found. Please log in.");
          return;
        }

        // Decode the token to extract the userId
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        // Fetch user data using the extracted userId
        const response = await fetchWithAuth(`http://localhost:8089/users/${userId}`, token);  // The endpoint that gives user info based on the userId

        if (response) {
          setUserData(response);  // Set user data when successfully fetched
        }
      } catch (err) {
        setError("Failed to load user data.");
        console.error("Error fetching user data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // If loading or there's an error, show loading or error message
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
        className="bg-white min-h-screen"
      >
        <div className="w-full max-w-7xl bg-white shadow-2xl rounded-2xl p-12 mx-auto mt-12">
          {/* Header Section */}
          <div className="relative flex items-center space-x-8 border-b pb-8 mb-10">
            <div className="relative w-40 h-40">
              {/* Display Profile Image */}
              <img
                src={userData.profileImage || profileImage} 
                alt="Avatar"
                className="w-full h-full rounded-xl object-cover border-4 border-blue-500"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-blue">
                {userData.firstname} {userData.lastname}
              </h1>
              <p className="text-red text-lg">
                {userData.email} - <span className="text-blue-500">{userData.profession || "Profession not set"}</span>
              </p>
            </div>
          </div>

          {/* Account Form */}
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-blue">
                  Phone Number 
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={userData.phonenumber || ""}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email || ""}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  disabled
                />
              </div>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-blue">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={"Sbak"|| ""}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  disabled
                />
              </div>
            </div>
          </form>

          {/* Display uploaded file paths */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-blue">Uploaded Documents</h3>
            <ul>
              <li><strong>License File:</strong> {userData.licenseFilePath}</li>
              <li><strong>Profession License:</strong> {userData.professionLicenseFilePath}</li>
              <li><strong>Syndicate Card:</strong> {userData.syndicateCardFilePath}</li>
              <li><strong>Commercial Register:</strong> {userData.commercialRegisterFilePath}</li>
              <li><strong>Tax Card:</strong> {userData.taxCardFilePath}</li>
            </ul>
          </div>
        </div>
        <br />
        <Footer />
      </motion.div>
    </>
  );
};

export default MyProfile;  