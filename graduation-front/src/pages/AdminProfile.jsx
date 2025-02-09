import { useState } from "react";
import { Pencil } from "lucide-react";
import profileImage from '../assets/images/profile-image.jpg';

const AdminProfile = () => {
  const [image, setImage] = useState("https://via.placeholder.com/160");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-7xl bg-white shadow-2xl rounded-2xl p-12 mx-auto mt-12" dir="rtl">
      {/* Header Section */}
      <div className="relative flex flex-row-reverse justify-between items-center border-b pb-8 mb-10">
  {/* Profile Image (Far Right) */}
  <div className="relative w-40 h-40">
    <img
      src={profileImage}
      alt="الصورة الرمزية"
      className="w-full h-full rounded-xl object-cover border-4 border-blue-500"
    />
  </div>

  {/* Text (Far Left) */}
  <div>
    <h1 className="text-4xl font-bold text-blue text-right">رنا محمد</h1>
    <p className="text-red text-lg text-right">
      admin@email.com - <span className="text-red">مسؤول</span>
    </p>
  </div>
</div>


      {/* Account Form */}
      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <label htmlFor="phone" className="text-2xl font-bold text-blue mb-6 block text-right">
              رقم الهاتف
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value="01004222194"
              className="mt-1 block w-full rounded-md bg-white text-lg text-red text-right"
              disabled
            />
          </div>
          <div>
            <label htmlFor="email" className="text-2xl font-bold text-blue mb-6 block text-right">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value="Admin@email.com"
              className="mt-1 block w-full rounded-md bg-white text-lg text-red text-right"
              disabled
            />
          </div>

          <div>
            <label htmlFor="title" className="text-2xl font-bold text-blue mb-6 block text-right">
              الوظيفة
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value="مسؤول"
              className="mt-1 block w-full rounded-md bg-white text-lg text-red text-right"
              disabled
            />
          </div>
        </div>
      </form>
      <br />
      <hr />
    </div>
  );
};

export default AdminProfile;
