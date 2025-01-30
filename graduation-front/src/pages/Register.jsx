import { useState } from "react";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal"; // Import the Modal component
import Navbar from "../components/Navbar";

// Define motion variants
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

const Register = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [showModal, setShowModal] = useState(false); 
  const [fileNames, setFileNames] = useState({
    license: "No file chosen",
    practice: "No file chosen",
    syndicate: "No file chosen",
    commercial: "No file chosen",
    tax: "No file chosen",
  });
  const [errors, setErrors] = useState({}); // State to hold error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const password = e.target.pass.value;
    const confirmPassword = e.target.confirmPass.value;
  
    // Check if password and confirm password match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    const formData = new FormData();
    formData.append("firstname", e.target.firstName.value);
    formData.append("lastname", e.target.lastName.value);
    formData.append("phonenumber", e.target.phone.value);
    formData.append("email", e.target.email.value);
    formData.append('password', password);
    
    // Append the file fields to the FormData, but don't upload yet
    formData.append("licenseFile", e.target.license.files[0]);
    formData.append("professionLicenseFile", e.target.practice.files[0]);
    formData.append("syndicateCardFile", e.target.syndicate.files[0]);
    formData.append("commercialRegisterFile", e.target.commercial.files[0]);
    formData.append("taxCardFile", e.target.tax.files[0]);
  
    try {
      // First, submit the user data without the files
      const response = await fetch("http://localhost:8084/users/with-documents", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        setShowModal(true); // Show the modal on successful submission
  
        // Now upload the files if submission is successful
        const fileFormData = new FormData();
        fileFormData.append("licenseFile", e.target.license.files[0]);
        fileFormData.append("professionLicenseFile", e.target.practice.files[0]);
        fileFormData.append("syndicateCardFile", e.target.syndicate.files[0]);
        fileFormData.append("commercialRegisterFile", e.target.commercial.files[0]);
        fileFormData.append("taxCardFile", e.target.tax.files[0]);
  
        // Here you can call an endpoint to upload the PDF files after the form submission is successful
        const fileResponse = await fetch("http://localhost:8084/upload-pdfs", {
          method: "POST",
          body: fileFormData,
        });
  
        if (!fileResponse.ok) {
          const errorData = await fileResponse.json();
          console.error("Error uploading files:", errorData);
          alert("File upload failed!");
        }
      } else {
        const errorData = await response.json();
        console.error("Error details:", errorData);
  
        // Map errors to the state for displaying
        const mappedErrors = {};
        errorData.forEach((error) => {
          mappedErrors[error.field] = error.defaultMessage; // Store error messages by field name
        });
        setErrors(mappedErrors); // Set error messages in state
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  
  const handleCloseModal = () => {
    setShowModal(false); // Close the modal manually
    navigate("/"); // Redirect after the modal shows
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
                <label htmlFor="firstName" className="text-m font-medium text-blue mb-2 block">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className={`bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none ${errors.firstName ? 'border-red-600' : ''}`}
                />
                {errors.firstName && <span className="text-red-600 text-sm">{errors.firstName}</span>}
              </div>

              {/* Last Name */}
              <div className="flex-1">
                <label htmlFor="lastName" className="text-m font-medium text-blue mb-2 block">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className={`bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none ${errors.lastName ? 'border-red-600' : ''}`}
                />
                {errors.lastName && <span className="text-red-600 text-sm">{errors.lastName}</span>}
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
                  id="phone"
                  name="phone"
                  type="text"
                  className={`bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none ${errors.phone ? 'border-red-600' : ''}`}
                />
                {errors.phone && <span className="text-red-600 text-sm">{errors.phone}</span>}
              </div>
            </div>

            {/* Password and Confirm Password */}
            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <label htmlFor="pass" className="text-m font-medium text-blue mb-2 block">
                  Password
                </label>
                <input
                  id="pass"
                  name="pass"
                  type="password"
                  className={`bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none ${errors.pass ? 'border-red-600' : ''}`}
                />
                {errors.pass && <span className="text-red-600 text-sm">{errors.pass}</span>}
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
  
