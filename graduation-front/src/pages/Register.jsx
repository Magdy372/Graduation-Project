import { useState, useCallback, useEffect } from "react";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
import { validateRegisterEmail } from "../utils/validationUtils";
import debounce from 'lodash/debounce';
import { validateFile } from '../utils/fileValidation';
import { jwtDecode } from "jwt-decode";

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
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [fileNames, setFileNames] = useState({
    license: " No file chosen",
    practice: " No file chosen",
    syndicate: " No file chosen",
    commercial: " No file chosen",
    tax: " No file chosen",
  });

  const [formErrors, setFormErrors] = useState({});
  const [emailError, setEmailError] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const accessToken = localStorage.getItem("access_token");
    
    if (isAuthenticated && accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        if (decodedToken.roles.includes("Admin")) {
          window.location.replace("/layout/ViewCourses");
        } else {
          window.location.replace("/");
        }
      } catch (error) {
        // If token is invalid, clear the authentication state
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("isAuthenticated");
      }
    }
  }, []);

  // Debounced email validation function
  const debouncedEmailCheck = useCallback(
    debounce(async (email) => {
      if (!email) {
        setEmailError("Email is required");
        return;
      }

      setIsCheckingEmail(true);
      const result = await validateRegisterEmail(email);
      setEmailError(result.message);
      setIsCheckingEmail(false);
    }, 500),
    []
  );

  const handleEmailChange = (e) => {
    const email = e.target.value;
    debouncedEmailCheck(email);
  };

  const getFriendlyErrorMessage = (field, defaultMessage) => {
    if (defaultMessage.includes("Failed to convert property value")) {
      const fieldMap = {
        licenseFile: "Place license file is required.",
        professionLicenseFile: "Profession license file is required.",
        syndicateCardFile: "Syndicate card file is required.",
        commercialRegisterFile: "Commercial register file is required.",
        taxCardFile: "Tax card file is required.",
      };
      return fieldMap[field] || defaultMessage;
    }
    return defaultMessage;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
  
    const password = e.target.pass.value;
    const confirmPassword = e.target.confirmPass.value;
  
    if (password !== confirmPassword) {
      setFormErrors({ confirmPass: "Passwords do not match" });
      return;
    }
  
    const files = {
      license: e.target.license.files[0],
      practice: e.target.practice.files[0],
      syndicate: e.target.syndicate.files[0],
      commercial: e.target.commercial.files[0],
      tax: e.target.tax.files[0],
    };
  
    const formData = new FormData();
    formData.append("firstname", e.target.firstName.value);
    formData.append("lastname", e.target.lastName.value);
    formData.append("phonenumber", e.target.phone.value);
    formData.append("email", e.target.email.value);
    formData.append("password", password);
    formData.append("title", e.target.title.value);
    formData.append("governorate", e.target.governate.value);
    formData.append("licenseFile", files.license);
    formData.append("professionLicenseFile", files.practice);
    formData.append("syndicateCardFile", files.syndicate);
    formData.append("commercialRegisterFile", files.commercial);
    formData.append("taxCardFile", files.tax);
  
    try {
      const response = await fetch("http://localhost:8084/users/with-documents", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        const errors = {};
        errorResponse.forEach((error) => {
          errors[error.field] = getFriendlyErrorMessage(error.field, error.defaultMessage);
        });
        setFormErrors(errors);
        return;
      }
  
      setShowModal(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormErrors({
        submit: "An error occurred while submitting the form. Please try again.",
      });
    }
  };
  

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/login");
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    // Validate file if one is selected
    if (file) {
      const { isValid, error } = validateFile(file, name);
      if (!isValid) {
        // Map the input field names to the backend field names
        const fieldNameMap = {
          license: "licenseFile",
          practice: "professionLicenseFile",
          syndicate: "syndicateCardFile",
          commercial: "commercialRegisterFile",
          tax: "taxCardFile"
        };
        
        setFormErrors(prev => ({
          ...prev,
          [fieldNameMap[name]]: error
        }));
        e.target.value = ''; // Clear the invalid file
        setFileNames(prev => ({
          ...prev,
          [name]: "No file chosen"
        }));
        return;
      } else {
        // Clear any previous errors for this field
        setFormErrors(prev => {
          const newErrors = { ...prev };
          const fieldNameMap = {
            license: "licenseFile",
            practice: "professionLicenseFile",
            syndicate: "syndicateCardFile",
            commercial: "commercialRegisterFile",
            tax: "taxCardFile"
          };
          delete newErrors[fieldNameMap[name]];
          return newErrors;
        });
      }
    }

    setFileNames(prev => ({
      ...prev,
      [name]: file ? file.name : "No file chosen"
    }));
  };

  return (
    <div>
      <Navbar />
      <br />
      <div className="flex flex-col items-center justify-center h-auto">
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
                  className="bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none"
                />
                {formErrors.firstname && (
                  <span className="text-red text-sm">{formErrors.firstname}</span>
                )}
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
                  className="bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none"
                />
                {formErrors.lastname && (
                  <span className="text-red text-sm">{formErrors.lastname}</span>
                )}
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
                  onChange={handleEmailChange}
                  className={`bg-white-300 text-red border-b-2 ${
                    emailError ? 'border-red-500' : 'border-gray-300'
                  } rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none`}
                  disabled={isCheckingEmail}
                />
                {isCheckingEmail && (
                  <span className="text-sm text-gray-500">Checking email availability...</span>
                )}
                {emailError && (
                  <span className="text-sm text-red">{emailError}</span>
                )}
                {formErrors.email && (
                  <span className="text-sm text-red">{formErrors.email}</span>
                )}
              </div>

              <div className="flex-1">
                <label htmlFor="phone" className="text-m font-medium text-blue mb-2 block">
                  Phone number
                </label>
                <input
                  id="phonenumber"
                  name="phone"
                  type="text"
                  className="bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none"
                />
                {formErrors.phonenumber && (
                  <span className="text-red text-sm">{formErrors.phonenumber}</span>
                )}
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
                  className="bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none"
                />
                {formErrors.password && (
                  <span className="text-red text-sm">{formErrors.password}</span>
                )}
              </div>
              <div className="flex-1">
                <label htmlFor="confirmPass" className="text-m font-medium text-blue mb-2 block">
                  Confirm Password
                </label>
                <input
                  id="confirmPass"
                  name="confirmPass"
                  type="password"
                  className="bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none"
                />
                {formErrors.confirmPass && (
                  <span className="text-red text-sm">{formErrors.confirmPass}</span>
                )}
              </div>
            </div>

            {/* title and governate */}
            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <label htmlFor="title" className="text-m font-medium text-blue mb-2 block">
                  Title
                </label>
                <select
                  id="title"
                  name="title"
                  type="text"
                  className="bg-white-300 text-gray-400 border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none"
                >
                  <option className="text-gray-400" value="">Your title</option>
                  {/* Add your options here */}
                  <option className="text-gray-400" value="دكتور">Doctor</option>
                  <option className="text-gray-400" value="صيدلي">Pharmacist</option>
                </select>
                {formErrors.title && (
                  <span className="text-red text-sm">{formErrors.title}</span>
                )}
              </div>

              <div className="flex-1">
                <label htmlFor="governorate" className="text-m font-medium text-blue mb-2 block">
                  Governorate
                </label>
                <select
                  id="governorate"
                  name="governate"
                  className="bg-white-300 text-gray-400 border-b-2 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none"
                >
                  <option value="">Choose Governorate</option>
                  <option value="الإسكندرية">Alexandria</option>
                  <option value="أسوان">Aswan</option>
                  <option value="أسيوط">Asyot</option>
                  <option value="البحيرة">Al-Behera</option>
                  <option value="بني سويف">Bani-Suef</option>
                  <option value="القاهرة">Cairo</option>
                  <option value="الدقهلية">Al-Dakahlia</option>
                  <option value="دمياط">Demietta</option>
                  <option value="الفيوم">Al-Fayoum</option>
                  <option value="الجيزة">Al-Giza</option>
                  <option value="الإسماعيلية">Al-Ismalia</option>
                  <option value="كفر الشيخ">Kafr-Al-Sheikh</option>
                  <option value="الأقصر">Luxor</option>
                  <option value="مطروح">Matrouh</option>
                  <option value="المنيا">AlMenia</option>
                  <option value="المنوفية">AlMonofya</option>
                  <option value="الوادي الجديد">New Village</option>
                  <option value="شمال سيناء">North Sinai</option>
                  <option value="بورسعيد">Port Saied</option>
                  <option value="القليوبية">AlQalyoubia</option>
                  <option value="قنا">Qena</option>
                  <option value="البحر الأحمر">Red Sea</option>
                  <option value="الشرقية">AlSharkia</option>
                  <option value="سوهاج">Sohag</option>
                  <option value="جنوب سيناء">South Sinai</option>
                  <option value="السويس">AlSuez</option>
                </select>
                {formErrors.governorate && (
                  <span className="text-red text-sm">{formErrors.governorate}</span>
                )}
              </div>
            </div>

            {/* File Uploads */}
            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <label htmlFor="license" className="text-m font-medium text-blue mb-2 block">
                  Place License
                </label>
                <div className="flex items-center">
                  <input
                    type="file"
                    id="license"
                    name="license"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="license"
                    className="bg-red text-white px-4 py-2 rounded cursor-pointer hover:bg-red-600"
                  >
                    Choose File
                  </label>
                  <span className="ml-3">{fileNames.license}</span>
                </div>
                {formErrors.licenseFile && (
                  <span className="text-red text-sm mt-1 block">{formErrors.licenseFile}</span>
                )}
              </div>

              <div className="flex-1">
                <label htmlFor="practice" className="text-m font-medium text-blue mb-2 block">
                  Profession practice license
                </label>
                <div className="flex items-center">
                  <input
                    type="file"
                    id="practice"
                    name="practice"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="practice"
                    className="bg-red text-white px-4 py-2 rounded cursor-pointer hover:bg-red-600"
                  >
                    Choose File
                  </label>
                  <span className="ml-3">{fileNames.practice}</span>
                </div>
                {formErrors.professionLicenseFile && (
                  <span className="text-red text-sm mt-1 block">{formErrors.professionLicenseFile}</span>
                )}
              </div>
            </div>

            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <label htmlFor="syndicate" className="text-m font-medium text-blue mb-2 block">
                  Syndicate card
                </label>
                <div className="flex items-center">
                  <input
                    type="file"
                    id="syndicate"
                    name="syndicate"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="syndicate"
                    className="bg-red text-white px-4 py-2 rounded cursor-pointer hover:bg-red-600"
                  >
                    Choose File
                  </label>
                  <span className="ml-3">{fileNames.syndicate}</span>
                </div>
                {formErrors.syndicateCardFile && (
                  <span className="text-red text-sm mt-1 block">{formErrors.syndicateCardFile}</span>
                )}
              </div>

              <div className="flex-1">
                <label htmlFor="commercial" className="text-m font-medium text-blue mb-2 block">
                  Commercial register
                </label>
                <div className="flex items-center">
                  <input
                    type="file"
                    id="commercial"
                    name="commercial"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="commercial"
                    className="bg-red text-white px-4 py-2 rounded cursor-pointer hover:bg-red-600"
                  >
                    Choose File
                  </label>
                  <span className="ml-3">{fileNames.commercial}</span>
                </div>
                {formErrors.commercialRegisterFile && (
                  <span className="text-red text-sm mt-1 block">{formErrors.commercialRegisterFile}</span>
                )}
              </div>
            </div>

            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <label htmlFor="tax" className="text-m font-medium text-blue mb-2 block">
                  Tax card
                </label>
                <div className="flex items-center">
                  <input
                    type="file"
                    id="tax"
                    name="tax"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="tax"
                    className="bg-red text-white px-4 py-2 rounded cursor-pointer hover:bg-red-600"
                  >
                    Choose File
                  </label>
                  <span className="ml-3">{fileNames.tax}</span>
                </div>
                {formErrors.taxCardFile && (
                  <span className="text-red text-sm mt-1 block">{formErrors.taxCardFile}</span>
                )}
              </div>
            </div>

            <br />
            <button
              className="text-l bg-red text-white text-center py-3 px-5 rounded-md cursor-pointer hover:bg-blue transition duration-300 w-full"
              type="submit"
            >
              Submit
            </button>
          </form>
        </motion.div>
      </div>
      <br />
      {showModal && <Modal onClose={handleCloseModal} />}
      <Footer />
    </div>
  );
};

export default Register;
