import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, checkAuthStatus } = useAuth();
  useEffect(() => {
    const handleAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        console.log(token);
        if (token) {
          localStorage.setItem('token', token);
          await checkAuthStatus();
          navigate('/profile');
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth error:', error);
        navigate('/login');
      }
    };

    handleAuth();
  }, [navigate, checkAuthStatus]);

  return <div>Authenticating...</div>;
};

export default AuthSuccess;