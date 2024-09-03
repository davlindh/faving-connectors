import React from 'react';
import AuthForm from '@/components/auth/AuthForm';

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <AuthForm mode="login" />
    </div>
  );
};

export default LoginPage;