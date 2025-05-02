import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    position: 'موظف',
    candidate: '',
    governorate: '',
  });

  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const token = localStorage.getItem('access_token'); // Retrieve the token from local storage
  
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the JWT token
        console.log(decodedToken); // Log the decoded token for debugging
        const position = decodedToken.position;
  
        // Check if the user has the 'Manager' position
        if (position !== 'مدير') {
          setErrorMessage('أنت غير مصرح لك بالوصول إلى هذه الصفحة');
        }
      } catch (error) {
        setErrorMessage('حدث خطأ في التحقق من صلاحياتك');
        navigate('/'); // Redirect if token decoding fails
      }
    }
  }, [navigate]);
  
  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8089/api/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('تم تسجيل المدير بنجاح');
        navigate('/layout');
      } else {
        setMessage('حدث خطأ أثناء التسجيل');
      }
    } catch (error) {
      setMessage('حدث خطأ أثناء التسجيل');
    }
  };

  const governorates = [
    'القاهرة', 'الجيزة', 'الإسكندرية', 'المنصورة', 'الشرقية', 'الدقهلية',
    'البحيرة', 'الفيوم', 'كفر الشيخ', 'المنوفية', 'الغربية', 'القليوبية',
    'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان',
    'السويس', 'الإسماعيلية', 'بورسعيد', 'دمياط', 'الوادي الجديد', 'مطروح',
    'شمال سيناء', 'جنوب سيناء', 'البحر الأحمر'
  ];

  return (
    <div style={styles.container}>
      {errorMessage ? (
        <p style={styles.errorMessage}>{errorMessage}</p>
      ) : (
        <>
          <h2 style={styles.title}>تسجيل مدير جديد</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label>الاسم الأول</label>
              <input 
                type="text" 
                name="firstname" 
                value={formData.firstname} 
                onChange={handleChange} 
                required 
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label>الاسم الأخير</label>
              <input 
                type="text" 
                name="lastname" 
                value={formData.lastname} 
                onChange={handleChange} 
                required 
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label>البريد الإلكتروني</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label>كلمة المرور</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label>النقابة</label>
              <select 
                name="candidate" 
                value={formData.candidate} 
                onChange={handleChange} 
                required
                style={styles.select}
              >
                <option value="">اختر النقابة</option>
                <option value="الطب">الطب</option>
                <option value="الصيدلة">الصيدلة</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label>المحافظة</label>
              <select 
                name="governorate" 
                value={formData.governorate} 
                onChange={handleChange} 
                required
                style={styles.select}
              >
                <option value="">اختر المحافظة</option>
                {governorates.map((gov, idx) => (
                  <option key={idx} value={gov}>{gov}</option>
                ))}
              </select>
            </div>

            <input type="hidden" name="position" value="موظف" />

            <button type="submit" style={styles.button}>تسجيل</button>
            {message && <p style={styles.message}>{message}</p>}
          </form>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    margin: 'auto',
    padding: '2rem',
    border: '1px solid #ddd',
    borderRadius: '10px',
    direction: 'rtl',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#2980b9',
    fontSize: '2rem',
    fontWeight: '700',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    width: '100%',
    padding: '1rem',
    fontSize: '1.2rem',
    borderRadius: '5px',
    border: '1px solid #ddd',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  select: {
    width: '100%',
    padding: '1rem',
    fontSize: '1.2rem',
    borderRadius: '5px',
    border: '1px solid #ddd',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  button: {
    width: '100%',
    padding: '1.5rem',
    backgroundColor: '#2980b9',
    color: 'white',
    border: 'none',
    fontSize: '1.5rem',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  message: {
    marginTop: '1rem',
    color: 'green',
    textAlign: 'center',
    fontSize: '1.2rem',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    fontSize: '1.5rem',
    marginTop: '2rem',
  },
};

export default AdminRegister;
