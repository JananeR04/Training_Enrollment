const TrainingCard = ({ training, onEnroll, isEnrolled }) => {
  const { id, title, description, seatLimit, enrolledCount, availableSeats, isFull, trainer } = training;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {isFull ? (
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">FULL</span>
        ) : (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">AVAILABLE</span>
        )}
      </div>
      
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Trainer:</span>
          <span className="font-medium text-gray-700">{trainer?.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total Seats:</span>
          <span className="font-medium text-gray-700">{seatLimit}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Enrolled:</span>
          <span className="font-medium text-gray-700">{enrolledCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Available:</span>
          <span className={`font-medium ${availableSeats > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {availableSeats}
          </span>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className={`h-2 rounded-full ${isFull ? 'bg-red-500' : 'bg-blue-500'}`}
          style={{ width: `${(enrolledCount / seatLimit) * 100}%` }}
        ></div>
      </div>

      {isEnrolled ? (
        <button
          disabled
          className="w-full bg-gray-400 text-white py-2 px-4 rounded-md cursor-not-allowed"
        >
          Already Enrolled
        </button>
      ) : (
        <button
          onClick={() => onEnroll(id)}
          disabled={isFull}
          className={`w-full py-2 px-4 rounded-md transition ${
            isFull
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isFull ? 'Training Full' : 'Enroll Now'}
        </button>
      )}
    </div>
  );
};

export default TrainingCard;