import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import { motion } from "framer-motion";
import { registerUser, uploadFiles } from "../services/UserService"; // Import the services

const Register = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [fileNames, setFileNames] = useState({
    license: "No file chosen",
    practice: "No file chosen",
    syndicate: "No file chosen",
    commercial: "No file chosen",
    tax: "No file chosen",
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const password = e.target.pass.value;
    const confirmPassword = e.target.confirmPass.value;

    // Password validation
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const formData = new FormData();
    formData.append("firstname", e.target.firstName.value);
    formData.append("lastname", e.target.lastName.value);
    formData.append("phonenumber", e.target.phone.value);
    formData.append("email", e.target.email.value);
    formData.append("password", password);

    // Append the file fields to the FormData
    formData.append("licenseFile", e.target.license.files[0]);
    formData.append("professionLicenseFile", e.target.practice.files[0]);
    formData.append("syndicateCardFile", e.target.syndicate.files[0]);
    formData.append("commercialRegisterFile", e.target.commercial.files[0]);
    formData.append("taxCardFile", e.target.tax.files[0]);

    try {
      const userResponse = await registerUser(formData);
      if (userResponse.success) {
        setShowModal(true);

        const fileResponse = await uploadFiles(formData);
        if (fileResponse.success) {
          console.log("Files uploaded successfully");
        } else {
          console.error("File upload failed");
        }
      } else {
        setErrors(userResponse.errors || {});
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/");
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFileNames((prevFileNames) => ({
      ...prevFileNames,
      [name]: file ? file.name : "No file chosen",
    }));
  };

  return (
    <div>
      <Navbar />
      <br />
      <div className="flex flex-col items-center justify-center h-screen">
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
          className="w-full max-w-3xl bg-light rounded-xl shadow-md py-12 px-12"
        >
          <h2 className="text-[30px] font-bold text-red mb-6 text-center">Register</h2>
          <form className="flex flex-col" onSubmit={handleSubmit} encType="multipart/form-data">
            {/* First Name */}
            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <label htmlFor="firstname" className="text-m font-medium text-blue mb-2 block">
                  First Name
                </label>
                <input
                  id="firstname"
                  name="firstName"
                  type="text"
                  className={`bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none ${errors.firstName ? 'border-red-600' : ''}`}
                />
                {errors.firstname && <span className="text-red-600 text-sm">{errors.firstname}</span>}
              </div>

              {/* Last Name */}
              <div className="flex-1">
                <label htmlFor="lastname" className="text-m font-medium text-blue mb-2 block">
                  Last Name
                </label>
                <input
                  id="lastname"
                  name="lastName"
                  type="text"
                  className={`bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none ${errors.lastName ? 'border-red-600' : ''}`}
                />
                {errors.lastname && <span className="text-red-600 text-sm">{errors.lastname}</span>}
              </div>
            </div>

            {/* Email and Phone */}
            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <label htmlFor="email" className="text-m font-medium text-blue mb-2 block">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none ${errors.email ? 'border-red-600' : ''}`}
                />
                {errors.email && <span className="text-red-600 text-sm">{errors.email}</span>}
              </div>

              <div className="flex-1">
                <label htmlFor="phone" className="text-m font-medium text-blue mb-2 block">
                  Phone number
                </label>
                <input
                  id="phonenumber"
                  name="phone"
                  type="text"
                  className={`bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none ${errors.phone ? 'border-red-600' : ''}`}
                />
                {errors.phonenumber && <span className="text-red-600 text-sm">{errors.phonenumber}</span>}
              </div>
            </div>

            {/* Password and Confirm Password */}
            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <label htmlFor="pass" className="text-m font-medium text-blue mb-2 block">
                  Password
                </label>
                <input
                  id="password"
                  name="pass"
                  type="password"
                  className={`bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none ${errors.pass ? 'border-red-600' : ''}`}
                />
                {errors.password && <span className="text-red-600 text-sm">{errors.password}</span>}
              </div>
              <div className="flex-1">
                <label htmlFor="confirmPass" className="text-m font-medium text-blue mb-2 block">
                  Confirm Password
                </label>
                <input
                  id="confirmPass"
                  name="confirmPass"
                  type="password"
                  className={`bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none ${errors.confirmPass ? 'border-red-600' : ''}`}
                />
                {errors.confirmPass && <span className="text-red-600 text-sm">{errors.confirmPass}</span>}
              </div>
            </div>

        

  
              {/* File Uploads: Grouping two uploads per line */}
              <div className="flex space-x-4 mb-4">
                {/* Place License Upload */}
                <div className="flex-1">
                  <label
                    htmlFor="license"
                    className="text-m font-medium text-blue mb-2 block"
                  >
                    Place License
                  </label>
                  <input
                    id="license"
                    name="license"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="license"
                    className="text-sm bg-red text-white text-center py-2 px-5 rounded-md cursor-pointer hover:bg-blue transition duration-300 w-full"
                  >
                    Upload File
                  </label>
                  <span className="text-sm text-gray-500 mt-2">{fileNames.license}</span>
                </div>
  
                {/* Profession Practice License Upload */}
                <div className="flex-1">
                  <label
                    htmlFor="practice"
                    className="text-m font-medium text-blue mb-2 block"
                  >
                    Profession practice license
                  </label>
                  <input
                    id="practice"
                    name="practice"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="practice"
                    className="text-sm bg-red text-white text-center py-2 px-5 rounded-md cursor-pointer hover:bg-blue transition duration-300 w-full"
                  >
                    Upload File
                  </label>
                  <span className="text-gray-500 mt-2">{fileNames.practice}</span>
                </div>
              </div>
  
              <div className="flex space-x-4 mb-4">
                {/* Syndicate Card Upload */}
                <div className="flex-1">
                  <label
                    htmlFor="syndicate"
                    className="text-m font-medium text-blue mb-2 block"
                  >
                    Syndicate card
                  </label>
                  <input
                    id="syndicate"
                    name="syndicate"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="syndicate"
                    className="text-sm bg-red text-white text-center py-2 px-5 rounded-md cursor-pointer hover:bg-blue transition duration-300 w-full"
                  >
                    Upload File
                  </label>
                  <span className="text-gray-500 mt-2">{fileNames.syndicate}</span>
                </div>
  
                {/* Commercial Register Upload */}
                <div className="flex-1">
                  <label
                    htmlFor="commercial"
                    className="text-m font-medium text-blue mb-2 block"
                  >
                    Commercial register
                  </label>
                  <input
                    id="commercial"
                    name="commercial"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="commercial"
                    className="text-sm bg-red text-white text-center py-2 px-5 rounded-md cursor-pointer hover:bg-blue transition duration-300 w-full"
                  >
                    Upload File
                  </label>
                  <span className="text-gray-500 mt-2">{fileNames.commercial}</span>
                </div>
              </div>
  
              <div className="flex space-x-4 mb-4">
                {/* Tax Card Upload */}
                <div className="flex-1">
                  <label
                    htmlFor="tax"
                    className="text-m font-medium text-blue mb-2 block"
                  >
                    Tax card
                  </label>
                  <input
                    id="tax"
                    name="tax"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="tax"
                    className="text-sm bg-red text-white text-center py-2 px-5 rounded-md cursor-pointer hover:bg-blue transition duration-300 w-full"
                  >
                    Upload File
                  </label>
                  <span className="text-gray-500 mt-2">{fileNames.tax}</span>
                </div>
              </div>
                <br/>
            <button
              className="text-l bg-red text-white text-center py-3 px-5 rounded-md cursor-pointer hover:bg-blue transition duration-300 w-full"
              type="submit"
            >
              Submit
            </button>
            </form>
          </motion.div>
        </div>
        <br/>
        {showModal && <Modal onClose={handleCloseModal} />}

        <Footer/>

      </div>
    );
  };
  
  export default Register;
  
