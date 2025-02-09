import { IoCloseCircleOutline } from "react-icons/io5"; // Close icon
import { BsFillCheckCircleFill } from "react-icons/bs"; // Checkmark icon

const Modal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/3 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl text-red"
        >
          <IoCloseCircleOutline />
        </button>
        <div className="text-4xl text-red flex ">
          <BsFillCheckCircleFill />
          <p className="text-lg text-gray-700">
          Thank you for submitting your form, you will be verified soon.
        </p>
        </div>
        
      </div>
    </div>
  );
};

export default Modal;
