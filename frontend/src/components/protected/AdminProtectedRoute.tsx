import { jwtDecode } from 'jwt-decode';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface AdminProtectedRouteProps {
  children: ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {

  const token: string | null = localStorage.getItem('token')

  if (!token) {
    return <Navigate to='/auth/login' />;
  } else {
    try {
      const decryptedData: { role: string } = jwtDecode(token);

      if (decryptedData.role === 'Admin') {
        return <>{children}</>;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }

    return <Navigate to='/auth/login' />;
  }
};

export default AdminProtectedRoute;
