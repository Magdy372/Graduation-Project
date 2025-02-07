import { IoCloseCircleOutline } from "react-icons/io5";
import { BsFillCheckCircleFill, BsFillXCircleFill } from "react-icons/bs";

const ModalCongrat = ({ score, onClose, onTryAgain }) => {
  const isPassed = score >= 50;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/3 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-700"
        >
          <IoCloseCircleOutline />
        </button>
        
        <div className={`text-4xl mb-4 ${isPassed ? 'text-green-500' : 'text-Red-500'}`}>
          {isPassed ? <BsFillCheckCircleFill /> : <BsFillXCircleFill />}
        </div>

        <h1 className="text-2xl font-semibold mb-4">
          {isPassed ? 'HURRAYYY!!' : 'OOPS! TRY AGAIN'}
        </h1>

        <div className="space-y-4 mb-6">
          <p className="text-gray-700">
            {isPassed 
              ? 'You have completed the course successfully!'
              : 'You need to score at least 50% to pass.'}
          </p>
          <p className={`font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
            Your Score: {score}%
          </p>
        </div>

        <div className="flex justify-center gap-4">
          {!isPassed && (
            <button
              onClick={onTryAgain}
              className="mt-4 p-3 bg-blue text-white w-full rounded-md hover:bg-red"
            >
              Try Again
            </button>
          )}
          <button
            onClick={onClose}
            className="mt-4 p-3 bg-blue text-white w-full rounded-md hover:bg-red"
          >
            {isPassed ? 'Close' : 'Return to Course'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCongrat;