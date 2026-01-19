import { useState, useEffect } from 'react';
import { trainingService } from '../../services/trainingService';
import { enrollmentService } from '../../services/enrollmentService';
import TrainingCard from './TrainingCard';
import LoadingSpinner from '../common/LoadingSpinner';

const TrainingList = () => {
  const [trainings, setTrainings] = useState([]);
  const [enrolledTrainingIds, setEnrolledTrainingIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [trainingsData, enrollmentsData] = await Promise.all([
        trainingService.getAllTrainings(),
        enrollmentService.getMyEnrollments()
      ]);

      setTrainings(trainingsData.trainings);
      
      const enrolledIds = new Set(
        enrollmentsData.enrollments.map(e => e.training.id)
      );
      setEnrolledTrainingIds(enrolledIds);
    } catch (err) {
      setError('Failed to load trainings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (trainingId) => {
    try {
      setError('');
      setSuccessMessage('');
      
      await enrollmentService.enrollInTraining(trainingId);
      setSuccessMessage('Enrolled successfully!');
      
      // Refresh data
      await fetchData();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Trainings</h2>
      
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

      {trainings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No trainings available at the moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainings.map((training) => (
            <TrainingCard
              key={training.id}
              training={training}
              onEnroll={handleEnroll}
              isEnrolled={enrolledTrainingIds.has(training.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainingList;