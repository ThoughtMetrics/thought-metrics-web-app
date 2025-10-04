import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ROUTES } from '@/routes/routeConfig';
import { TextInputAtom, CheckboxAtom } from '@/shared/ui/atoms/custom-input';
import { loginFormConstant } from './constant';
import type {
  LoginFormData,
  LoginFormStore,
} from '@/core/types/login-form.type';
import {
  ArrowRight,
  Logo,
  FacebookOutlineIcon,
  GoogleOutlineIcon,
} from '@/assets';
import { useSignInMutation } from '@/core/hooks/mutations/use-sign-in.mutation';
import { auth } from '@/core/configs/firebase-config';

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
          const errorMessage =
            error instanceof Error
              ? error.message
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

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const signInMutation = useSignInMutation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const {
    formData,
    isSubmitting,
    isSubmitted,
    errors,
    loginError,
    updateField,
    submitForm,
  } = useLoginFormStore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        void navigate(ROUTES.SURVEY_PAGE);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

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
    const result = await signInMutation.mutateAsync({
      type: 'email',
      email,
      password,
    });

    if (result) {
      setTimeout(() => {
        void navigate(ROUTES.SURVEY_PAGE);
      }, 1500);
    }
  };

  const handleGoogleSignIn = () => {
    void signInMutation
      .mutateAsync({ type: 'google' })
      .then((result) => {
        if (result) {
          void navigate(ROUTES.SURVEY_PAGE);
        }
      })
      .catch((error) => {
        console.error('Google sign-in failed:', error);
      });
  };

  const handleFacebookSignIn = () => {
    void signInMutation
      .mutateAsync({ type: 'facebook' })
      .then((result) => {
        if (result) {
          void navigate(ROUTES.SURVEY_PAGE);
        }
      })
      .catch((error) => {
        console.error('Facebook sign-in failed:', error);
      });
  };

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
            {ui.successMessage.title}
          </h2>
          <p className="text-black">{ui.successMessage.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="common-component w-full relative bg-white text-black z-1 overflow-scroll flex-col items-center !justify-start hide-scrollbar">
      <header className="common-container bg-white !max-w-[var(--breakpoint-2xl)] h-[3.5rem]">
        <nav className="px-6 py-3 xxl:px-0 flex items-center justify-between w-full">
          <Link viewTransition={true} to={ROUTES.HOME}>
            <div className="w-45 pt-1">
              <Logo className="w-full h-full" />
            </div>
          </Link>
        </nav>
      </header>
      <div className="relative md:h-[calc(100vh-3.5rem)] w-full">
        <div className="lg:block md:absolute right-0 w-[full%] md:w-[50%] h-full bg-[url('/images/login_background_image.png')] bg-cover bg-center bg-no-repeat -z-1 text-black px-6 py-10 md:px-18 md:py-16" />
        <div className="common-container h-full !grid grid-cols-1 md:grid-cols-[50%_50%] inset-ring-custom-grey-1 inset-ring-1">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg px-8 py-10 wide:py-28 flex flex-col items-center justify-center">
            <div className="mb-8 w-full max-w-[380px]">
              <h1 className="text-2xl font-medium text-black">
                {ui.pageTitle}
              </h1>
            </div>

            {/* Social Login Buttons */}
            <div className="mb-6 space-y-3 w-full max-w-[380px]">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={signInMutation.isPending}
                className="relative w-full flex items-center pl-4 pr-12 py-2 bg-[#DB4437] text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <GoogleOutlineIcon className="w-5 h-5 mr-8" />
                <div className="left-13 absolute w-0.25 h-full bg-white"></div>
                Sign in with Google
              </button>
              <button
                type="button"
                onClick={handleFacebookSignIn}
                disabled={signInMutation.isPending}
                className="relative w-full flex items-center pl-4 pr-12 py-2 bg-[#1877F2] text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FacebookOutlineIcon className="w-5 h-5 mr-8" />
                <div className="left-13 absolute w-0.25 h-full bg-white"></div>
                Sign in with Facebook
              </button>
            </div>

            <div className="w-full max-w-[380px] flex items-center mb-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 border-y-1 border-y-custom-grey py-4 max-w-[380px] shrink-0 w-full"
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
                label={ui.fieldLabels.thoughtMetricsId}
                value={formData.thoughtMetricsId}
                onChange={handleInputChange}
                error={errors.thoughtMetricsId}
                required
              />

              {/* Password */}
              <TextInputAtom
                id="password"
                name="password"
                label={ui.fieldLabels.password}
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
                    ? ui.buttons.continuing
                    : ui.buttons.continue}
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
                  label={ui.checkboxLabels.rememberMe}
                  className="font-medium [&>*]:text-base"
                />
              </div>
            </form>

            {/* Account Links */}
            <div className="space-y-4 max-w-[380px] shrink-0 w-full">
              <div className="text-black my-4 font-medium">
                {ui.links.noAccount}
              </div>

              <Link
                to={ROUTES.SIGN_UP}
                className="w-full inline-flex items-center justify-between px-4 py-2 border border-primary shadow-sm bg-transparent font-medium text-primary hover:bg-primary-50 transition-colors rounded-none"
              >
                <label>{ui.buttons.createAccount}</label>
                <ArrowRight className="w-8 r-8 fill-current text-primary" />
              </Link>
            </div>
            <div className="flex items-center max-w-[380px] shrink-0 w-full mt-5">
              <Link
                to={ROUTES.SIGN_UP}
                //NOTE: Uncomment the line below to enable the reset password link
                // to={ROUTES.RESET_PASSWORD}
                className="border-t-1 border-t-custom-grey w-full pt-3"
              >
                <span className="text-blue-600 hover:text-blue-800 text-sm hover:underline w-full">
                  {ui.links.resetPassword}
                </span>
                <span className="font-medium">{' to reset password.'}</span>
              </Link>
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
  );
};
export default AuthPage;
