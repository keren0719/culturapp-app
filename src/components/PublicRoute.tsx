import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/explore" replace />; // o a tu dashboard principal
  }

  return <>{children}</>;
};

export default PublicRoute;
