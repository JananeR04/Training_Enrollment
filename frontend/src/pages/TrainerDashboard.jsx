import Navbar from '../components/common/Navbar';
import TrainingManagement from '../components/trainer/TrainingManagement';

const TrainerDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TrainingManagement />
      </div>
    </div>
  );
};

export default TrainerDashboard;