import React, { useEffect, useState } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ROUTES } from '@/routes/routeConfig';
import { TextInputAtom, CheckboxAtom } from '@/shared/ui/atoms/custom-input';
import { loginFormConstant } from '@constants/page-constants/auth-constant';
import type {
  LoginFormData,
  LoginFormStore,
} from '@/core/types/login-form.type';
import { ArrowRight, Logo, GoogleOutlineIcon } from '@/assets';
import { useSignInMutation } from '@/core/hooks/mutations/use-sign-in.mutation';
import { getSignInErrorDetails } from '@/core/utils/firebase-error-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider, useAuth } from '@/shared/providers/auth-provider';
import { useLanguage } from '@/core/hooks/use-language';
import { LanguageToggle } from '@/shared/ui/molecules/language-toggle';
import authService from '@/services/api/auth.service';

const { initialFormData, storeName, validationMessages, formResetDelay, ui } =
  loginFormConstant;

// Zustand store
const useLoginFormStore = create<LoginFormStore>()(
  devtools(
    (set, get) => ({
      formData: initialFormData as LoginFormData,
      isSubmitting: false,
      isSubmitted: false,
      errors: {},
      loginError: '',

      updateField: (field, value) =>
        set(
          (state) => ({
            formData: { ...state.formData, [field]: value },
            errors: { ...state.errors, [field]: undefined },
            loginError: '',
          }),
          false,
          `updateField_${field}`
        ),

      resetForm: () =>
        set(
          {
            formData: initialFormData as LoginFormData,
            isSubmitting: false,
            isSubmitted: false,
            errors: {},
            loginError: '',
          },
          false,
          'resetForm'
        ),

      validateForm: () => {
        const { formData } = get();
        const errors: Partial<LoginFormData> = {};

        if (!formData.thoughtMetricsId.trim())
          errors.thoughtMetricsId = validationMessages.thoughtMetricsId;
        if (!formData.password.trim())
          errors.password = validationMessages.password;

        set({ errors }, false, 'validateForm');
        return Object.keys(errors).length === 0;
      },

      submitForm: async (
        onSubmit: (email: string, password: string) => Promise<void>
      ) => {
        const { formData, validateForm } = get();

        if (!validateForm()) return;

        set({ isSubmitting: true, loginError: '' }, false, 'submitForm_start');

        try {
          await onSubmit(formData.thoughtMetricsId, formData.password);

          set(
            {
              isSubmitting: false,
              isSubmitted: true,
            },
            false,
            'submitForm_success'
          );

          setTimeout(() => {
            get().resetForm();
          }, formResetDelay);
        } catch (error) {
          const errorTitle = getSignInErrorDetails(
            (error instanceof Error && error.message) as string
          )?.title;
          const errorMessage =
            error instanceof Error
              ? `Authentication: ${errorTitle}`
              : validationMessages.submitError;
          set(
            {
              isSubmitting: false,
              loginError: errorMessage,
            },
            false,
            'submitForm_error'
          );
        }
      },
    }),
    {
      name: storeName,
    }
  )
);

const LoginPage: React.FC = () => {
  const signInMutation = useSignInMutation();
  const { user } = useAuth();
  const [isNavigating, setIsNavigating] = useState(false);

  // Derive isAuthenticated from user object
  const isAuthenticated = !!user;

  // Translation hook
  const { translations } = useLanguage();

  const {
    formData,
    isSubmitting,
    isSubmitted,
    errors,
    loginError,
    updateField,
    submitForm,
  } = useLoginFormStore();

  // Extract and store tracking parameters from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const linkId = params.get('tm_link_id');
    const allocatedSurvey = params.get('allocated_survey');
    const redirectAfter = params.get('redirect_after');

    // Store tracking parameters in localStorage for persistence
    if (linkId) {
      localStorage.setItem('tm_link_id', linkId);
    }
    if (allocatedSurvey) {
      localStorage.setItem('tm_allocated_survey', allocatedSurvey);
    }
    if (redirectAfter) {
      localStorage.setItem('tm_redirect_after_signup', redirectAfter);
    }
  }, []);

  // Get redirect URL based on tracking parameters
  const getRedirectUrl = () => {
    const allocatedSurveyId = localStorage.getItem('tm_allocated_survey');
    if (allocatedSurveyId) {
      localStorage.removeItem('tm_allocated_survey');
      return `/survey-campaign/${allocatedSurveyId}`;
    }

    const redirectAfter = localStorage.getItem('tm_redirect_after_signup');
    if (redirectAfter) {
      localStorage.removeItem('tm_redirect_after_signup');
      return redirectAfter;
    }

    // Honour ?redirect= param set by UserRouteGuard / AdminRouteGuard
    const params = new URLSearchParams(window.location.search);
    const redirectParam = params.get('redirect');
    if (redirectParam) {
      return redirectParam;
    }

    return ROUTES.SURVEY_BOARDS;
  };

  // Redirect authenticated users — check forcePasswordReset + signInProvider before normal redirect
  useEffect(() => {
    if (user) {
      void (async () => {
        try {
          const [profile, tokenResult] = await Promise.all([
            authService.getUserProfile(),
            user.getIdTokenResult(),
          ]);
          // Only intercept for email/password logins — Google users skip the reset screen
          if (
            profile?.metadata?.forcePasswordReset &&
            tokenResult.signInProvider === 'password'
          ) {
            window.location.href = ROUTES.FORCE_CHANGE_PASSWORD;
            return;
          }
        } catch {
          // If checks fail, proceed with normal redirect
        }
        window.location.href = getRedirectUrl();
      })();
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target;
      updateField(name as keyof LoginFormData, checked);
    } else {
      updateField(name as keyof LoginFormData, value);
    }
  };

  const handleFirebaseSignIn = async (email: string, password: string) => {
    await signInMutation.mutateAsync({
      type: 'email',
      email,
      password,
    });
    // Redirect is handled by the useEffect watching `user`
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInMutation.mutateAsync({ type: 'google' });

      // If popup returned a result (localhost), show loading overlay
      // Redirect is handled by the useEffect watching `user`
      if (result) {
        setIsNavigating(true);
      }
      // If redirect (production), page will redirect automatically
    } catch (error) {
      console.error('Google sign-in failed:', error);
      setIsNavigating(false);
    }
  };

  /* const handleFacebookSignIn = async () => {
    setSocialAuthLoading('facebook');
    try {
      const result = await signInMutation.mutateAsync({ type: 'facebook' });
      if (result) {
        window.location.href = ROUTES.SURVEY_BOARDS;
      }
    } catch (error) {
      let errorCode = '';
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        typeof (error as { code?: unknown }).code === 'string'
      ) {
        errorCode = (error as { code: string }).code;
      }
      console.error('Facebook sign-in failed:', error);
      // Check if it's a user cancellation
      if (
        errorCode === 'auth/popup-closed-by-user' ||
        errorCode === 'auth/cancelled-popup-request'
      ) {
        // Immediately re-enable button on cancellation
        setSocialAuthLoading(null);
      } else {
        setSocialAuthLoading(null);
      }
    } finally {
      // Ensure loading state is cleared
      setSocialAuthLoading(null);
    }
  }; */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitForm(handleFirebaseSignIn);
  };

  if (isAuthenticated) {
    return null;
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md text-center bg-white rounded-lg shadow-lg p-8">
          <div className="mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">
            {translations.auth.login.welcomeBack}
          </h2>
          <p className="text-black">{translations.auth.login.successMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {translations.auth.login.redirecting || 'Signing you in...'}
            </h2>
            <p className="text-gray-600">
              {translations.auth.login.pleaseWait ||
                'Please wait while we redirect you'}
            </p>
          </div>
        </div>
      )}

      {/* ApiLoadingIndicator handles loading states automatically */}
      <div className="common-component w-full relative bg-white text-black z-1 overflow-scroll flex-col items-center justify-start! hide-scrollbar">
        <header className="common-container bg-white max-w-(--breakpoint-2xl)! h-14">
          <nav className="px-6 py-3 xxl:px-0 flex items-center justify-between w-full">
            <a href={ROUTES.HOME}>
              <div className="w-45 pt-1">
                <Logo className="w-full h-full" />
              </div>
            </a>
            <LanguageToggle variant="compact" />
          </nav>
        </header>
        <div className="relative md:h-[calc(100vh-3.5rem)] w-full">
          <div className="lg:block md:absolute right-0 w-full md:w-[50%] h-8 md:h-full bg-[url('images/login_background_image.png')] bg-cover bg-center bg-no-repeat -z-1 text-black" />
          <div className="common-container h-full grid! grid-cols-1 md:grid-cols-[50%_50%] inset-ring-custom-grey-1 inset-ring-1">
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg px-8 py-10 wide:py-28 flex flex-col items-center justify-center">
              <div className="mb-8 w-full max-w-[380px]">
                <h1 className="text-2xl font-medium text-black">
                  {translations.auth.login.pageTitle}
                </h1>
              </div>

              {/* Social Login Buttons */}
              <div className="mb-6 space-y-3 w-full max-w-[380px]">
                <button
                  type="button"
                  onClick={() => void handleGoogleSignIn()}
                  className="relative w-full flex items-center pl-4 pr-12 py-2 bg-[#DB4437] text-white rounded hover:bg-red-700 transition-colors"
                >
                  <GoogleOutlineIcon className="w-5 h-5 mr-8" />
                  <div className="left-13 absolute w-px h-full bg-white"></div>
                  {translations.auth.signup.continueWithGoogle}
                </button>
                {/* <button
                  type="button"
                  onClick={() => void handleFacebookSignIn()}
                  disabled={socialAuthLoading !== null}
                  className="relative w-full flex items-center pl-4 pr-12 py-2 bg-[#1877F2] text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FacebookOutlineIcon className="w-5 h-5 mr-8" />
                  <div className="left-13 absolute w-px h-full bg-white"></div>
                  {socialAuthLoading === 'facebook'
                    ? 'Signing in...'
                    : 'Sign in with Facebook'}
                </button> */}
              </div>

              <div className="w-full max-w-[380px] flex items-center mb-6">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6 border-y border-y-custom-grey py-4 max-w-[380px] shrink-0 w-full"
              >
                {/* Login Error Message */}
                {loginError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-800">{loginError}</p>
                  </div>
                )}

                {/* Thought Metrics ID */}
                <TextInputAtom
                  id="thoughtMetricsId"
                  name="thoughtMetricsId"
                  label={translations.auth.login.thoughtMetricsId}
                  value={formData.thoughtMetricsId}
                  onChange={handleInputChange}
                  error={errors.thoughtMetricsId}
                  required
                />

                {/* Password */}
                <TextInputAtom
                  id="password"
                  name="password"
                  label={translations.auth.login.password}
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  required
                />

                {/* Continue Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || signInMutation.isPending}
                  className="w-full bg-primary text-white text-nowrap hover:bg-secondary hover:text-white transition-all duration-300 ease-in-out font-medium px-6 py-2 flex items-center justify-between gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <label className="text-lg">
                    {isSubmitting || signInMutation.isPending
                      ? translations.auth.login.signingIn
                      : translations.auth.login.continueButton}
                  </label>
                  <ArrowRight className="w-8 r-8 fill-current text-white" />
                </button>

                {/* Remember Me Checkbox */}
                <div className="pt-2">
                  <CheckboxAtom
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    label={translations.auth.login.rememberMe}
                    className="font-medium *:text-base"
                  />
                </div>
              </form>

              {/* Account Links */}
              <div className="space-y-4 max-w-[380px] shrink-0 w-full">
                <div className="text-black my-4 font-medium">
                  {translations.auth.login.noAccount}
                </div>

                <a
                  href={ROUTES.SIGN_UP}
                  className="w-full inline-flex items-center justify-between px-4 py-2 border border-primary shadow-sm bg-transparent font-medium text-primary hover:bg-primary-50 transition-colors rounded-none"
                >
                  <label>{translations.auth.login.createAccount}</label>
                  <ArrowRight className="w-8 r-8 fill-current text-primary" />
                </a>
                <p className="text-xs text-custom-grey-3 mt-2 max-w-[380px]">
                  This takes a moment longer than Google sign-in — we&apos;re collecting optional details to tailor surveys to your profile. You can delete this info anytime.
                </p>
              </div>
              <div className="flex items-center max-w-[380px] shrink-0 w-full mt-5">
                <a
                  href={ROUTES.SIGN_UP}
                  //NOTE: Uncomment the line below to enable the reset password link
                  // href={ROUTES.RESET_PASSWORD}
                  className="border-t border-t-custom-grey w-full pt-3"
                >
                  <span className="text-blue-600 hover:text-blue-800 text-sm hover:underline w-full">
                    {ui.links.resetPassword}
                  </span>
                  <span className="font-medium">{' to reset password.'}</span>
                </a>
              </div>

              {/* Demo Credentials Helper
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-xs text-blue-800">
                <strong>Demo:</strong> Use ID "demo" and password "password" to
                test login
              </p>
            </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * LoginWrapper - Separate Astro Island with its own providers
 *
 * IMPORTANT: Has its own AuthProvider because it's rendered as client:only="react"
 * in login.astro, making it a separate island that cannot share context.
 */
const LoginWrapper: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default LoginWrapper;
