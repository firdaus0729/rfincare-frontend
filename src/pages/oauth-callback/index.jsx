import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiClient, setAccessToken } from '../../lib/apiClient';
import { OAUTH_RETURN_PATH_KEY } from '../../services/authService';

const OAUTH_ERROR_MESSAGES = {
  invalid_state: 'Sign-in was interrupted. Please try again.',
  not_configured: 'This sign-in provider is not configured on the server yet.',
  no_user_id: 'Could not read your account from the provider. Try another sign-in method.',
};

const OAuthCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Signing you in...');

  useEffect(() => {
    const finish = async () => {
      const error = params.get('error');
      let returnPath = '/customer-dashboard';
      try {
        returnPath = sessionStorage.getItem(OAUTH_RETURN_PATH_KEY) || returnPath;
        sessionStorage.removeItem(OAUTH_RETURN_PATH_KEY);
      } catch {
        /* ignore */
      }

      if (error) {
        navigate('/customer-login', {
          replace: true,
          state: { error: OAUTH_ERROR_MESSAGES[error] || `Sign-in failed (${error})` },
        });
        return;
      }

      const token = params.get('accessToken');
      if (!token) {
        navigate('/customer-login', { replace: true, state: { error: 'Sign-in did not complete.' } });
        return;
      }

      setAccessToken(token);
      try {
        const meRes = await apiClient.get('/auth/me');
        const role = meRes?.data?.profile?.role || meRes?.data?.user?.role;
        if (role && role !== 'customer') {
          setMessage('Redirecting to your dashboard...');
          const roleRoutes = {
            admin: '/admin-dashboard',
            super_admin: '/admin-dashboard',
            employee: '/employee-portal',
            agent: '/agent-dashboard',
          };
          navigate(roleRoutes[role] || returnPath, { replace: true });
          return;
        }
        navigate(returnPath, { replace: true });
      } catch {
        navigate(returnPath, { replace: true });
      }
    };

    finish();
  }, [params, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};

export default OAuthCallback;
