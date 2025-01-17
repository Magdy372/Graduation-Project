import { useState } from "react";
import Footer from "../Footer/Footer";
import RegisterNav from "../Navbar/RegisterNav";
const Register = () => {
    const [fileNames, setFileNames] = useState({
      license: "  No file chosen",
      practice: "  No file chosen",
      syndicate: "  No file chosen",
      commercial: "  No file chosen",
      tax: "  No file chosen",
    });
  
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
        <RegisterNav/>
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="w-full max-w-3xl bg-light rounded-xl shadow-md py-12 px-12">
            <h2 className="text-[30px] font-bold text-red mb-6 text-center">
              Register
            </h2>
            <form className="flex flex-col">
              {/* Other Form Inputs */}
              <div className="flex space-x-4 mb-4">
                {/* First Name */}
                <div className="flex-1">
                  <label
                    htmlFor="firstName"
                    className="text-m font-medium text-blue mb-2 block"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    className="bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none"
                  />
                </div>
  
                {/* Last Name */}
                <div className="flex-1">
                  <label
                    htmlFor="lastName"
                    className="text-m font-medium text-blue mb-2 block"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label htmlFor="email" className="text-m font-medium text-blue mb-2 block">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                className="bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none"
              />
            </div>

            <div className="flex-1">
              <label htmlFor="phone" className="text-m font-medium text-blue mb-2 block">
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                className="bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none"
              />
              </div>
              </div>
              <div className="flex space-x-4 mb-4">
              <div className="flex-1">
             <label htmlFor="pass" className="text-m font-medium text-blue mb-2 block">
                Password
              </label>
              <input
                id="pass"
                name="pass"
                type="password"
                className="bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none"
              />
              </div>
              <div className="flex-1">
             <label htmlFor="confirmPass" className="text-m font-medium text-blue mb-2 block">
                Confirm Password
              </label>
              <input
                id="confirmPass"
                name="confirmPass"
                type="text"
                className="bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none"
              />
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
                <button className="text-l bg-red text-white text-center py-3 px-5 rounded-md cursor-pointer hover:bg-blue transition duration-300 w-full">Submit</button>
            </form>
          </div>
        </div>
        <br/>
        <Footer/>

      </div>
    );
  };
  
  export default Register;
  
