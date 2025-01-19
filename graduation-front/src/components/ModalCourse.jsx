import { IoCloseCircleOutline } from "react-icons/io5"; // Close icon
import { BsFillCheckCircleFill } from "react-icons/bs"; // Checkmark icon


const ModalCourse = ({ onClose }) => {
   return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-1/3 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-xl text-gray-500"
          >
            <IoCloseCircleOutline />
          </button>
          <div className="text-4xl text-green-500 mb-4">
            <BsFillCheckCircleFill />
          </div>
          <h1 className="text-lg text-gray-700">
            Enrollment Successful 
          </h1>
          <p>Go to your courses page to start watching your courses!</p>
        </div>
      </div>
    );
}

export default ModalCourse