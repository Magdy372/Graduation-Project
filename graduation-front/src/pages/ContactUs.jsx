import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
import { jwtDecode } from "jwt-decode";

export const FadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 50 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, duration: 0.5, delay } 
  },
});

const ContactUs = () => {
    const [contactData, setContactData] = useState({
      email: '',
      phone: '',
      name: '',
      mess: ''
    });
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
  
    // Retrieve token and decode userId
    useEffect(() => {
      const storedToken = localStorage.getItem('access_token');
  
      if (storedToken) {
        try {
          const decodedToken = jwtDecode(storedToken);
          setUserId(decodedToken.userId);
          setToken(storedToken);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      } else {
        console.log("No token found - user is not logged in");
      }
    }, []);
  
    const handleChange = (e) => {
      setContactData({
        ...contactData,
        [e.target.name]: e.target.value,
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      if (!contactData.mess) {
        alert("Message is required!");
        return;
      }
    
      if (!token) {
        alert("You are not logged in!");
        return;
      }
    
      setLoading(true);
    
      try {
        const formData = new FormData();
        formData.append('mess', contactData.mess);
        formData.append('userId', userId); // Only send userId and message
    
        const response = await fetch('http://localhost:8084/users/save-contact', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
    
        if (response.ok) {
          alert('Message sent successfully!');
          setContactData({ mess: '' }); // Clear only the message field
        } else {
          alert('Error in sending message');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error in sending message');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <>
        <Navbar />
        <div className="container p-6 w-[70%] mx-auto">
          <motion.div
            className="bg-red text-white p-10 rounded-t-lg w-[70%] mx-auto"
            variants={FadeUp(0.1)}
            initial="initial"
            animate="animate"
          >
            <motion.h1 className="text-3xl font-bold mb-4 text-center" variants={FadeUp(0.2)}>
              Contact Us
            </motion.h1>
          </motion.div>
  
          <form className="bg-white shadow-xl rounded-b-lg p-6 w-[70%] mx-auto" onSubmit={handleSubmit}>
            <div className="mt-2">
              <label htmlFor="mess" className="text-lg font-medium text-blue block mb-2">
                Message 
              </label>
              <textarea
                id="mess"
                name="mess"
                className="bg-gray-100 text-red text-m border-b-2 rounded-2xl p-3 w-full focus:bg-gray-200 focus:outline-none"
                rows="4"
                placeholder="Type message here..."
                value={contactData.mess}
                onChange={handleChange}
              />
              <span className='text-red text-sm mb-6'>* Note: Leave the message in Arabic</span>
            </div>
  
            <button
              className="mt-3 w-full text-lg bg-red text-white text-center py-3 px-5 rounded-md hover:bg-blue duration-150"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
        <Footer />
      </>
    );
  };
  
export default ContactUs;
