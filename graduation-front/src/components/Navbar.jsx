import { IoMdMenu } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import logo from "../assets/logos/MOH Logo.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";

const NavbarMenu = [
  { id: 1, title: "Home", path: "/" },
  { id: 2, title: "Courses", path: "/Courses" },
  { id: 3, title: "About Us", path: "/about" },
  { id: 4, title: "Contact Us", path: "/contact" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(true); // Assume logged in for dropdown
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    // Simulate logout by clearing token
    setToken(false);
    localStorage.removeItem("access_token");  // Remove from localStorage if stored
    localStorage.removeItem("refresh_token");

    // Close the dropdown and sidebar
    setIsDropdownOpen(false);
    setIsSidebarOpen(false);

    // Redirect to the homepage or login page
    navigate("/login");
  };

  const UserMenu = () => (
    <div className="relative">
      {/* User Icon and Dropdown */}
      <div
        className="flex items-center gap-1 cursor-pointer"
        onClick={toggleDropdown}
      >
        <FaUserCircle className="text-3xl text-red hover:text-blue transition-all" />
        <RiArrowDropDownLine className="text-3xl text-red hover:text-blue transition-all" />
      </div>
      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-red text-white rounded-lg shadow-lg">
          <div className="flex flex-col gap-4 p-4">
            <p
              onClick={() => {
                navigate("/myProfile");
                setIsDropdownOpen(false);
              }}
              className="cursor-pointer"
            >
              My Profile
            </p>
            <p
              onClick={() => {
                navigate("/myCourses");
                setIsDropdownOpen(false);
              }}
              className="cursor-pointer"
            >
              My Courses
            </p>
            <p
              onClick={handleLogout}
              className="cursor-pointer"
            >
              Logout
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <nav className="bg-white relative z-50 shadow-lg">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="container py-4 flex justify-between items-center"
      >
        {/* Logo Section */}
        <div>
          <img
            onClick={() => navigate("/")}
            src={logo}
            alt="Logo"
            className="w-20 h-20 cursor-pointer"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          {NavbarMenu.map((menu) => (
            <a
              key={menu.id}
              href={menu.path}
              className="text-lg font-medium hover:text-red"
            >
              {menu.title}
            </a>
          ))}
          {token ? <UserMenu /> : (
            <button
              onClick={() => navigate("/register")}
              className="py-2 px-4 text-white bg-red hover:bg-blue rounded-md transition-all"
            >
              Register
            </button>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="lg:hidden">
          <button onClick={toggleSidebar}>
            {isSidebarOpen ? (
              <IoMdClose className="text-4xl text-red" />
            ) : (
              <IoMdMenu className="text-4xl text-red" />
            )}
          </button>
        </div>
      </motion.div>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="w-3/4 max-w-xs bg-white h-full shadow-lg flex flex-col items-center p-6 gap-6"
          >
            {/* Close Button */}
            <button
              onClick={toggleSidebar}
              className="self-end text-2xl text-red"
            >
              <IoMdClose />
            </button>
            {/* Logo Centered */}
            <img
              onClick={() => {
                navigate("/");
                toggleSidebar();
              }}
              src={logo}
              alt="Logo"
              className="w-24 h-24"
            />
            {/* Sidebar Menu */}
            {NavbarMenu.map((menu) => (
              <a
                key={menu.id}
                href={menu.path}
                className="text-lg font-medium hover:text-red"
                onClick={toggleSidebar}
              >
                {menu.title}
              </a>
            ))}

            {/* Conditional Menu Items */}
            {token ? (
              <>
                <p
                  onClick={() => {
                    navigate("/myProfile");
                    toggleSidebar();
                  }}
                  className="cursor-pointer text-lg font-medium hover:text-red"
                >
                  My Profile
                </p>
                <p
                  onClick={() => {
                    navigate("/myCourses");
                    toggleSidebar();
                  }}
                  className="cursor-pointer text-lg font-medium hover:text-red"
                >
                  My Courses
                </p>
              </>
            ) : null}

            {/* Register/Logout Button */}
            {!token ? (
              <button
                onClick={() => {
                  navigate("/register"); // Navigate to register page
                  toggleSidebar(); // Close the sidebar
                }}
                className="py-2 px-4 w-full text-white bg-red hover:bg-blue rounded-md transition-all"
              >
                Register
              </button>
            ) : (
              <button
                onClick={handleLogout} // Call the logout function
                className="py-2 px-4 w-full text-white bg-red hover:bg-blue rounded-md transition-all"
              >
                Logout
              </button>
            )}
          </motion.div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
