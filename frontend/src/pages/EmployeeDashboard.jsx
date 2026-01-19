import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import TrainingList from '../components/employee/TrainingList';
import MyEnrollments from '../components/employee/MyEnrollments';

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('trainings');

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('trainings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'trainings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Available Trainings
              </button>
              <button
                onClick={() => setActiveTab('enrollments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'enrollments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Enrollments
              </button>
            </nav>
          </div>
        </div>

        <div>
          {activeTab === 'trainings' && <TrainingList />}
          {activeTab === 'enrollments' && <MyEnrollments />}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
