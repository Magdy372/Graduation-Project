import { useState } from "react";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
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
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [fileNames, setFileNames] = useState({
    license: "No file chosen",
    practice: "No file chosen",
    syndicate: "No file chosen",
    commercial: "No file chosen",
    tax: "No file chosen",
  });

  const [formErrors, setFormErrors] = useState({});
  const [emailError, setEmailError] = useState(""); // State for email validation

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

  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(`http://localhost:8084/users/check-email?email=${email}`);
      if (!response.ok) {
        throw new Error("Failed to check email availability");
      }
      
      const data = await response.json();
      console.log("Email check response:", data); // Debug response
  
      if (data.exists) {
        alert("This email is already registered. Please use a different email.");
      }
    } catch (error) {
      console.error("Error checking email:", error);
    }
  };
  
  // Attach to the email input field
 
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    if (emailError) return; // Prevent submission if email is invalid

    const password = e.target.pass.value;
    const confirmPassword = e.target.confirmPass.value;

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
    formData.append("title", e.target.title.value);
    formData.append("governorate", e.target.governate.value);
    formData.append("licenseFile", e.target.license.files[0]);
    formData.append("professionLicenseFile", e.target.practice.files[0]);
    formData.append("syndicateCardFile", e.target.syndicate.files[0]);
    formData.append("commercialRegisterFile", e.target.commercial.files[0]);
    formData.append("taxCardFile", e.target.tax.files[0]);

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
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/");
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFileNames((prev) => ({
      ...prev,
      [name]: files[0] ? files[0].name : "No file chosen",
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
                  className="bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none"
                />
                {formErrors.firstname && (
                  <span className="text-red-500 text-sm">{formErrors.firstname}</span>
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
                  <span className="text-red-500 text-sm">{formErrors.lastname}</span>
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
                 onBlur={(e) => checkEmailExists(e.target.value)}
                  className="bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none"
                />
                {formErrors.email && (
                  <span className="text-red-500 text-sm">{formErrors.email}</span>
                
                )}
                  {emailError && <p style={{ color: "red" }}>{emailError}</p>}
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
                  <span className="text-red-500 text-sm">{formErrors.phonenumber}</span>
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
                  <span className="text-red-500 text-sm">{formErrors.password}</span>
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
      className="bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none"
    >
      <option value="">المسمي الوظيفي</option>
      {/* Add your options here */}
      <option value="دكتور">دكتور</option>
      <option value="صيدلي">صيدلي</option>
    </select>
    {formErrors.title && (
      <span className="text-red-500 text-sm">{formErrors.title}</span>
    )}
  </div>

  <div className="flex-1">
    <label htmlFor="governorate" className="text-m font-medium text-blue mb-2 block">
      Governate
    </label>
    <select
      id="governorate"
      name="governate"
      className="bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none"
    >
      <option value="">اختر محافظة</option>
      <option value="الإسكندرية">الإسكندرية</option>
<option value="أسوان">أسوان</option>
<option value="أسيوط">أسيوط</option>
<option value="البحيرة">البحيرة</option>
<option value="بني سويف">بني سويف</option>
<option value="القاهرة">القاهرة</option>
<option value="الدقهلية">الدقهلية</option>
<option value="دمياط">دمياط</option>
<option value="الفيوم">الفيوم</option>
<option value="الجيزة">الجيزة</option>
<option value="الإسماعيلية">الإسماعيلية</option>
<option value="كفر الشيخ">كفر الشيخ</option>
<option value="الأقصر">الأقصر</option>
<option value="مطروح">مطروح</option>
<option value="المنيا">المنيا</option>
<option value="المنوفية">المنوفية</option>
<option value="الوادي الجديد">الوادي الجديد</option>
<option value="شمال سيناء">شمال سيناء</option>
<option value="بورسعيد">بورسعيد</option>
<option value="القليوبية">القليوبية</option>
<option value="قنا">قنا</option>
<option value="البحر الأحمر">البحر الأحمر</option>
<option value="الشرقية">الشرقية</option>
<option value="سوهاج">سوهاج</option>
<option value="جنوب سيناء">جنوب سيناء</option>
<option value="السويس">السويس</option>



    </select>
    {formErrors.governorate && (
      <span className="text-red-500 text-sm">{formErrors.governorate}</span>
    )}
  </div>
</div>



            {/* File Uploads */}
            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <label htmlFor="license" className="text-m font-medium text-blue mb-2 block">
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
                {formErrors.licenseFile && (
                  <span className="text-red-500 text-sm">{formErrors.licenseFile}</span>
                )}
              </div>

              <div className="flex-1">
                <label htmlFor="practice" className="text-m font-medium text-blue mb-2 block">
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
                {formErrors.professionLicenseFile && (
                  <span className="text-red-500 text-sm">{formErrors.professionLicenseFile}</span>
                )}
              </div>
            </div>

            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <label htmlFor="syndicate" className="text-m font-medium text-blue mb-2 block">
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
                {formErrors.syndicateCardFile && (
                  <span className="text-red-500 text-sm">{formErrors.syndicateCardFile}</span>
                )}
              </div>

              <div className="flex-1">
                <label htmlFor="commercial" className="text-m font-medium text-blue mb-2 block">
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
                {formErrors.commercialRegisterFile && (
                  <span className="text-red-500 text-sm">{formErrors.commercialRegisterFile}</span>
                )}
              </div>
            </div>

            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <label htmlFor="tax" className="text-m font-medium text-blue mb-2 block">
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
                {formErrors.taxCardFile && (
                  <span className="text-red-500 text-sm">{formErrors.taxCardFile}</span>
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