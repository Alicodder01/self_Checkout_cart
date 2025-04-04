import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider'; // ✅ Make sure this path is correct

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;
