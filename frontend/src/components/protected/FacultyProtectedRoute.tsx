import { jwtDecode } from 'jwt-decode';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface FacultyProtectedRouteProps {
  children: ReactNode;
}

const FacultyProtectedRoute: React.FC<FacultyProtectedRouteProps> = ({ children }) => {

  const token: string | null = localStorage.getItem('token')

  if (!token) {
    return <Navigate to='/auth/login' />;
  } else {
    try {
      const decryptedData: { role: string, exp:number } = jwtDecode(token);

      
      if (Math.floor(Date.now() / 1000) < decryptedData.exp) {

        if (decryptedData.role === 'Faculty') {
          return <>{children}</>;
        }

     }

      
    } catch (error) {
      console.error('Error decoding token:', error);
    }

    return <Navigate to='/auth/login' />;
  }
};

export default FacultyProtectedRoute;
