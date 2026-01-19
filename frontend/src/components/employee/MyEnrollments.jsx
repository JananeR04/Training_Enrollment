import { useState, useEffect } from 'react';
import { enrollmentService } from '../../services/enrollmentService';
import LoadingSpinner from '../common/LoadingSpinner';

const MyEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const data = await enrollmentService.getMyEnrollments();
      setEnrollments(data.enrollments);
    } catch (err) {
      setError('Failed to load enrollments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEnrollment = async (enrollmentId) => {
    if (!window.confirm('Are you sure you want to cancel this enrollment?')) {
      return;
    }

    try {
      setError('');
      setSuccessMessage('');
      
      await enrollmentService.cancelEnrollment(enrollmentId);
      setSuccessMessage('Enrollment cancelled successfully');
      
      await fetchEnrollments();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel enrollment');
    }
};if (loading) return <LoadingSpinner />;return (
<div>
<h2 className="text-2xl font-bold text-gray-800 mb-6">My Enrollments</h2>  {error && (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  )}  {successMessage && (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      {successMessage}
    </div>
  )}  {enrollments.length === 0 ? (
    <div className="text-center py-12 bg-white rounded-lg shadow">
      <p className="text-gray-500">You haven't enrolled in any trainings yet</p>
    </div>
  ) : (
    <div className="space-y-4">
      {enrollments.map((enrollment) => (
        <div key={enrollment.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {enrollment.training.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {enrollment.training.description}
              </p>              <div className="space-y-1 text-sm">
                <div className="flex items-center text-gray-600">
                  <span className="font-medium mr-2">Trainer:</span>
                  {enrollment.training.trainer.name}
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="font-medium mr-2">Enrolled on:</span>
                  {new Date(enrollment.enrolledAt).toLocaleDateString()}
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="font-medium mr-2">Seats:</span>
                  {enrollment.training.enrolledCount} / {enrollment.training.seatLimit}
                </div>
              </div>
            </div>            <button
              onClick={() => handleCancelEnrollment(enrollment.id)}
              className="ml-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
);
};export default MyEnrollments;