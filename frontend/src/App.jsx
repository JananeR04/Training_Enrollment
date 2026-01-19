import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import TrainerDashboard from './pages/TrainerDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {user?.role === 'EMPLOYEE' ? <EmployeeDashboard /> : <TrainerDashboard />}
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute requiredRole="EMPLOYEE">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/trainer/dashboard"
          element={
            <ProtectedRoute requiredRole="TRAINER">
              <TrainerDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;