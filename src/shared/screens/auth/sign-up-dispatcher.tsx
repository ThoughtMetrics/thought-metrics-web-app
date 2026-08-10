import React from 'react';
import RespondentSignUpWrapper from '@/shared/screens/auth/respondent-sign-up';
import ClientSignUpWrapper from '@/shared/screens/auth/client-sign-up';

// Safe to read window.location synchronously here — this only ever renders
// inside a client:only="react" island (see sign-up.astro), so there's no
// server-rendered markup to hydrate-mismatch against.
const SignUpDispatcher: React.FC = () => {
  const userType =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('userType')
      : null;

  return userType === 'client' ? <ClientSignUpWrapper /> : <RespondentSignUpWrapper />;
};

export default SignUpDispatcher;
