import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { motion } from "framer-motion";
import { fetchWithAuth }from '../services/UserService.js';
import { jwtDecode } from "jwt-decode";
import profileImage from '../assets/images/profile-image.jpg';
import { FaMedal, FaCrown, FaStar } from 'react-icons/fa';
import { FaCheckCircle, FaBullseye } from 'react-icons/fa';




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
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);  // State to store user data
  const [isLoading, setIsLoading] = useState(true); // State for loading spinner or UI state
  const [error, setError] = useState(""); // State for handling errors
  const [badgesCount, setBadgesCount] = useState(0); // Add badges state


  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Retrieve the token from localStorage (or sessionStorage or any other storage)
        const token = localStorage.getItem('access_token');  // Ensure this matches your actual token key

        if (!token) {
          navigate("/login"); // Redirect to login if no token
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

  useEffect(() => {
    const savedBadges = localStorage.getItem('badgesCount');
    setBadgesCount(savedBadges ? parseInt(savedBadges, 10) : 0);
  }, []);

  // If loading or there's an error, show loading or error message
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  // Add this helper function above the component
  const getTierDetails = (badgesCount) => {
    if (badgesCount >= 10) {
      return {
        tier: 'Platinum',
        color: 'from-purple-600 to-indigo-600',
        icon: <FaCrown className="text-6xl text-purple-600"/>,
        nextMilestone: 15,
        gradient: 'bg-gradient-to-br from-purple-600 to-indigo-600',
        textColor: 'text-purple-600'
      };
    }
    if (badgesCount >= 5) {
      return {
        tier: 'Gold',
        color: 'from-yellow-400 to-amber-500',
        icon: <FaMedal className="text-6xl text-yellow-500"/>,
        nextMilestone: 10,
        gradient: 'bg-gradient-to-br from-yellow-400 to-amber-500',
        textColor: 'text-yellow-500'
      };
    }
    if (badgesCount >= 3) {
      return {
        tier: 'Silver',
        color: 'from-gray-300 to-gray-400',
        icon: <FaMedal className="text-6xl text-gray-400"/>,
        nextMilestone: 5,
        gradient: 'bg-gradient-to-br from-gray-300 to-gray-400',
        textColor: 'text-gray-500'
      };
    }
    if (badgesCount >= 1) {
      return {
        tier: 'Bronze',
        color: 'from-amber-600 to-amber-800',
        icon: <FaMedal className="text-6xl text-amber-700"/>,
        nextMilestone: 3,
        gradient: 'bg-gradient-to-br from-amber-600 to-amber-800',
        textColor: 'text-amber-700'
      };
    }
    return {
      tier: 'Rookie',
      color: 'from-gray-500 to-gray-700',
      icon: <FaStar className="text-6xl text-gray-500"/>,
      nextMilestone: 1,
      gradient: 'bg-gradient-to-br from-gray-500 to-gray-700',
      textColor: 'text-gray-600'
    };
  };
  
  // Add this color mapping object before the return statement
  const tierColors = {
    Bronze: {
      achieved: 'bg-amber-600 text-white border-amber-700',
      upcoming: 'bg-amber-100 text-amber-700 border-gray-200'
    },
    Silver: {
      achieved: 'bg-gray-300 text-gray-800 border-gray-400',
      upcoming: 'bg-gray-100 text-gray-600 border-gray-200'
    },
    Gold: {
      achieved: 'bg-amber-400 text-gray-900 border-amber-500',
      upcoming: 'bg-amber-100 text-amber-600 border-gray-200'
    },
    Platinum: {
      achieved: 'bg-purple-500 text-white border-purple-600',
      upcoming: 'bg-purple-100 text-purple-600 border-gray-200'
    }
  };

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
                 // value={"Sbak"|| ""}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  disabled
                />
              </div>
            </div>
          </form>

          {/* Display uploaded file paths */}
        {/* Display uploaded file paths as downloadable links */}
<div className="mt-6">
  <h3 className="text-lg font-medium text-blue">Uploaded Documents</h3>
  <ul>
    {userData.licenseFilePath && (
      <li>
        <strong>License File:</strong> 
        <a 
          href={`http://localhost:8089/uploads/${userData.licenseFilePath}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-red-500 underline"
        >
          Open
        </a>
      </li>
    )}
    {userData.professionLicenseFilePath && (
      <li>
        <strong>Profession License:</strong> 
        <a 
          href={`http://localhost:8089/uploads/${userData.professionLicenseFilePath}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-red-500 underline"
        >
          Open
        </a>
      </li>
    )}
    {userData.syndicateCardFilePath && (
      <li>
        <strong>Syndicate Card:</strong> 
        <a 
          href={`http://localhost:8089/uploads/${userData.syndicateCardFilePath}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-red-500 underline"
        >
          Open
        </a>
      </li>
    )}
    {userData.commercialRegisterFilePath && (
      <li>
        <strong>Commercial Register:</strong> 
        <a 
          href={`http://localhost:8089/uploads/${userData.commercialRegisterFilePath}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-red-500 underline"
        >
          Open
        </a>
      </li>
    )}
    {userData.taxCardFilePath && (
      <li>
        <strong>Tax Card:</strong> 
        <a 
          href={`http://localhost:8089/uploads/${userData.taxCardFilePath}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-red-500 underline"
        >
          Open
        </a>
      </li>
    )}
  </ul>
</div>
{/* Enhanced Badges Section */}

<div className="mt-8">
  <h3 className="text-2xl font-bold text-blue mb-6">Learning Achievements</h3>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Main Badge Card */}
    <motion.div 
      className={`p-6 rounded-xl shadow-lg ${getTierDetails(badgesCount).gradient} text-white`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-6">
        <div className="relative">
          {getTierDetails(badgesCount).icon}
          <div className="absolute -top-2 -right-2 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md">
            {badgesCount}
          </div>
        </div>
        <div>
          <h4 className="text-xl font-bold mb-2">{getTierDetails(badgesCount).tier} Tier</h4>
          <p className="opacity-90">
            {badgesCount === 0 ? "Complete your first course to earn a badge!" :
            `Earned ${badgesCount} badge${badgesCount > 1 ? 's' : ''}! ${badgesCount >= 10 ? '🏆 Ultimate Achiever!' : 
            badgesCount >= 5 ? '🔥 Amazing Progress!' : badgesCount >= 3 ? '🚀 Keep it up!' : '👍 Great Start!'}`}
          </p>
          {badgesCount > 0 && (
            <div className="mt-3 text-sm">
              Next Tier: {getTierDetails(badgesCount).nextMilestone} badges
            </div>
          )}
        </div>
      </div>
    </motion.div>

    {/* Progress Visualization */}
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h5 className="text-lg font-semibold text-blue mb-4">Tier Progress</h5>
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle 
              className="text-gray-200"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <circle 
              className={getTierDetails(badgesCount).color}
              strokeWidth="8"
              strokeDasharray={`${(badgesCount / getTierDetails(badgesCount).nextMilestone) * 251} 251`}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <span className={`text-xl font-bold ${getTierDetails(badgesCount).color.replace('from-', 'text-').split(' ')[0]}`}>
              {Math.min(badgesCount, getTierDetails(badgesCount).nextMilestone)}
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600">
            Progress to {getTierDetails(badgesCount).tier} Tier
          </p>
          <div className="mt-2 bg-gray-100 rounded-full h-2 w-32">
            <div 
              className={`${getTierDetails(badgesCount).gradient} h-2 rounded-full`} 
              style={{ width: `${Math.min((badgesCount / getTierDetails(badgesCount).nextMilestone) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="mt-3 text-sm text-gray-500">
            Tiers: 
            <span className="mx-1 text-bronze">●</span>
            <span className="mx-1 text-silver">●</span>
            <span className="mx-1 text-gold">●</span>
            <span className="mx-1 text-platinum">●</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Milestones */}
  <div className="mt-6">
    <h5 className="text-lg font-semibold text-blue mb-4">Tier Milestones</h5>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { count: 1, tier: 'Bronze', color: 'amber-700' },
        { count: 3, tier: 'Silver', color: 'gray-300' },
        { count: 5, tier: 'Gold', color: 'yellow-500' },
        { count: 10, tier: 'Platinum', color: 'purple-500' },
      ].map((milestone) => (
        <div 
          key={milestone.tier}
          className={`p-3 rounded-lg text-center border-2 ${
            badgesCount >= milestone.count 
              ? `border-${milestone.color} bg-${milestone.color}/10`
              : 'border-gray-200'
          }`}
        >
          <span className={`text-sm font-semibold ${
            badgesCount >= milestone.count ? `text-${milestone.color}` : 'text-gray-500'
          }`}>
            {milestone.tier}
          </span>
          <div className="mt-1 text-2xl">
            {badgesCount >= milestone.count ? '✅' : '🎯'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {milestone.count}+ badges
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
        </div>
        <br />
        <Footer />
      </motion.div>
    </>
  );
};

export default MyProfile;  