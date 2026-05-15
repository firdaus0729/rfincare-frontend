import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setAccessToken } from '../../lib/apiClient';

const OAuthCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const error = params.get('error');
    const token = params.get('accessToken');
    if (error) {
      navigate('/customer-login', { state: { error } });
      return;
    }
    if (token) {
      setAccessToken(token);
      navigate('/customer-dashboard', { replace: true });
      return;
    }
    navigate('/customer-login');
  }, [params, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Signing you in...</p>
    </div>
  );
};

export default OAuthCallback;
