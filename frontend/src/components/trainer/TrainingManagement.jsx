import { useState, useEffect } from 'react';
import { trainingService } from '../../services/trainingService';
import CreateTraining from './CreateTraining';
import EnrollmentList from './EnrollmentList';
import LoadingSpinner from '../common/LoadingSpinner';

const TrainingManagement = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [expandedTraining, setExpandedTraining] = useState(null);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const data = await trainingService.getMyTrainings();
      setTrainings(data.trainings);
    } catch (err) {
      setError('Failed to load trainings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTraining = async (trainingData) => {
    try {
      setError('');
      setSuccessMessage('');
      
      await trainingService.createTraining(trainingData);
      setSuccessMessage('Training created successfully!');
      
      await fetchTrainings();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create training');
    }
  };

  const handleDeleteTraining = async (trainingId) => {
    if (!window.confirm('Are you sure you want to delete this training?')) {
      return;
    }

    try {
      setError('');
      setSuccessMessage('');
      
      await trainingService.deleteTraining(trainingId);
      setSuccessMessage('Training deleted successfully');
      
      await fetchTrainings();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete training');
    }
  };

  const toggleExpand = (trainingId) => {
    setExpandedTraining(expandedTraining === trainingId ? null : trainingId);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Trainings</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <CreateTraining onTrainingCreated={handleCreateTraining} />

      {trainings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">You haven't created any trainings yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {trainings.map((training) => (
            <div key={training.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {training.title}
                    </h3>
                    {training.isFull && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                        FULL
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{training.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Total Seats:</span>
                      <p className="font-medium text-gray-800">{training.seatLimit}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Enrolled:</span>
                      <p className="font-medium text-gray-800">{training.enrolledCount}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Available:</span>
                      <p className={`font-medium ${training.availableSeats > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {training.availableSeats}
                      </p>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div
                      className={`h-2 rounded-full ${training.isFull ? 'bg-red-500' : 'bg-blue-500'}`}
                      style={{ width: `${(training.enrolledCount / training.seatLimit) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="ml-4 flex space-x-2">
                  <button
                    onClick={() => toggleExpand(training.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition text-sm"
                  >
                    {expandedTraining === training.id ? 'Hide' : 'View'} Students
                  </button>
                  <button
                    onClick={() => handleDeleteTraining(training.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {expandedTraining === training.id && (
                <EnrollmentList 
                  enrollments={training.enrollments} 
                  trainingTitle={training.title}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainingManagement;