import React from 'react';
import AuthForm from '@/components/auth/AuthForm';

const SignUpPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <AuthForm mode="signup" />
    </div>
  );
};

export default SignUpPage;