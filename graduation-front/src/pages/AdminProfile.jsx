import { useState } from 'react';
import { Pencil } from 'lucide-react';

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
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-7xl bg-white shadow-2xl rounded-2xl p-12">
        {/* Header Section */}
        <div className="relative flex items-center space-x-8 border-b pb-8 mb-10">
          <div className="relative w-40 h-40">
            <img
              src={image}
              alt="Avatar"
              className="w-full h-full rounded-xl object-cover border-4 border-blue-500"
            />
            {/* Edit Icon */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl opacity-0 hover:opacity-100 transition">
              <label
                htmlFor="file-input"
                className="cursor-pointer text-white flex items-center gap-2"
              >
                <Pencil size={24} /> Edit
              </label>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">John Doe</h1>
            <p className="text-gray-600 text-lg">
              ryan@rockettheme.com - <span className="text-blue-500">Administrator</span>
            </p>
            <p className="text-base text-gray-400 mt-1">Avatar by gravatar.com. Or upload your own...</p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="border-dashed border-4 border-gray-300 rounded-lg text-center p-12 mb-10 cursor-pointer hover:bg-gray-50 transition">
          <p className="text-gray-500 text-lg">
            Drop your files here or <span className="text-blue-500 underline">click in this area</span>
          </p>
        </div>

        {/* Account Form */}
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { id: 'username', label: 'Username', type: 'text', placeholder: 'ryan' },
              { id: 'email', label: 'Email', type: 'email', placeholder: 'ryan@example.com', required: true },
              { id: 'password', label: 'Password', type: 'password', placeholder: '********' },
              { id: 'full_name', label: 'Full Name', type: 'text', placeholder: 'John Doe', required: true },
              { id: 'title', label: 'Title', type: 'text', placeholder: 'Administrator' },
              { id: 'language', label: 'Language', type: 'select', options: ['English', 'Spanish', 'French'] }
            ].map(({ id, label, type, placeholder, required, options }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-lg font-medium text-gray-700">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                {type === 'select' ? (
                  <select
                    id={id}
                    className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
                  >
                    {options.map(option => <option key={option}>{option}</option>)}
                  </select>
                ) : (
                  <input
                    type={type}
                    id={id}
                    className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder={placeholder}
                    required={required}
                  />
                )}
              </div>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;