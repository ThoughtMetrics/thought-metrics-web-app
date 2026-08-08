import React, { useEffect, useState } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ROUTES } from '@/routes/routeConfig';
import { loginFormConstant } from '@constants/page-constants/auth-constant';
import type {
  LoginFormData,
  LoginFormStore,
} from '@/core/types/login-form.type';
import { Logo } from '@/assets';
import { useSignInMutation } from '@/core/hooks/mutations/use-sign-in.mutation';
import { getSignInErrorDetails } from '@/core/utils/firebase-error-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider, useAuth } from '@/shared/providers/auth-provider';
import { useLanguage } from '@/core/hooks/use-language';
import { LanguageToggle } from '@/shared/ui/molecules/language-toggle';
import authService from '@/services/api/auth.service';
import type { UserProfile } from '@/core/types/user.type';

const { initialFormData, storeName, validationMessages, formResetDelay, ui } =
  loginFormConstant;

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

      submitForm: async (onSubmit) => {
        const { formData, validateForm } = get();
        if (!validateForm()) return;
        set({ isSubmitting: true, loginError: '' }, false, 'submitForm_start');
        try {
          await onSubmit(formData.thoughtMetricsId, formData.password);
          set({ isSubmitting: false, isSubmitted: true }, false, 'submitForm_success');
          setTimeout(() => { get().resetForm(); }, formResetDelay);
        } catch (error) {
          const errorTitle = getSignInErrorDetails(
            (error instanceof Error && error.message) as string
          )?.title;
          const errorMessage =
            error instanceof Error
              ? `Authentication: ${errorTitle}`
              : validationMessages.submitError;
          set({ isSubmitting: false, loginError: errorMessage }, false, 'submitForm_error');
        }
      },
    }),
    { name: storeName }
  )
);

const inputCls =
  'w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20';
const inputStyle = (err?: string) => ({
  background: 'var(--surface-container)',
  border: `1px solid ${err ? 'var(--error)' : 'color-mix(in srgb, var(--outline-variant) 30%, transparent)'}`,
  color: 'var(--on-surface)',
});

const LoginPage: React.FC = () => {
  const signInMutation = useSignInMutation();
  const { user } = useAuth();
  const [isNavigating, setIsNavigating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isAuthenticated = !!user;
  const { translations } = useLanguage();

  const { formData, isSubmitting, isSubmitted, errors, loginError, updateField, submitForm } =
    useLoginFormStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const linkId = params.get('tm_link_id');
    const allocatedSurvey = params.get('allocated_survey');
    const redirectAfter = params.get('redirect_after');
    if (linkId) localStorage.setItem('tm_link_id', linkId);
    if (allocatedSurvey) localStorage.setItem('tm_allocated_survey', allocatedSurvey);
    if (redirectAfter) localStorage.setItem('tm_redirect_after_signup', redirectAfter);
  }, []);

  const signUpHref = (() => {
    const userType =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('userType')
        : null;
    return userType ? `${ROUTES.SIGN_UP}?userType=${userType}` : ROUTES.SIGN_UP;
  })();

  // Rejects a candidate redirect target that doesn't belong to the given
  // role — e.g. a stale `?redirect=/admin/...` left over from a route
  // guard bouncing a DIFFERENT account, now being honored for whoever just
  // logged in. /admin* requires an admin/super-admin/field-incharge role,
  // /client* requires client; anything else (survey-campaign links,
  // profile edit, etc.) isn't role-gated and is always allowed through.
  const isRedirectAllowedForRole = (path: string, role: string | null | undefined): boolean => {
    const clean = path.split('?')[0].split('#')[0];
    if (clean.startsWith('/admin')) {
      return role === 'admin' || role === 'super-admin' || role === 'field-incharge';
    }
    if (clean.startsWith('/client')) {
      return role === 'client';
    }
    return true;
  };

  // The role's own landing page — used both as the default (no explicit
  // redirect) and as the fallback when an explicit redirect target doesn't
  // belong to this role.
  const roleDefaultUrl = (role?: string | null): string => {
    if (role === 'admin' || role === 'super-admin' || role === 'field-incharge') return ROUTES.ADMIN;
    if (role === 'client') return ROUTES.CLIENT;
    return ROUTES.SURVEY_BOARDS;
  };

  const getRedirectUrl = (role?: string | null) => {
    const allocatedSurveyId = localStorage.getItem('tm_allocated_survey');
    if (allocatedSurveyId) {
      localStorage.removeItem('tm_allocated_survey');
      return `/survey-campaign/${allocatedSurveyId}`;
    }
    const redirectAfter = localStorage.getItem('tm_redirect_after_signup');
    if (redirectAfter) {
      localStorage.removeItem('tm_redirect_after_signup');
      if (isRedirectAllowedForRole(redirectAfter, role)) return redirectAfter;
      return roleDefaultUrl(role);
    }
    const params = new URLSearchParams(window.location.search);
    const redirectParam = params.get('redirect');
    if (redirectParam && isRedirectAllowedForRole(redirectParam, role)) return redirectParam;
    return roleDefaultUrl(role);
  };

  // Single source of truth for post-auth routing, driven directly off
  // profile.role (Mongo-side, already present on any UserProfile we have in
  // hand) rather than re-deriving it from a fresh Firebase custom-claims
  // token fetch. isPasswordSignIn is passed in explicitly by each caller
  // (true only from the email/password form) instead of introspected from
  // a token result, since that's already known at the call site.
  const redirectByRole = (profile: UserProfile | null | undefined, isPasswordSignIn: boolean) => {
    if (profile?.metadata?.forcePasswordReset && isPasswordSignIn) {
      window.location.href = ROUTES.FORCE_CHANGE_PASSWORD;
      return;
    }
    window.location.href = getRedirectUrl(profile?.role);
  };

  // Fallback path for the two cases where we don't already have a profile
  // in hand from a mutation's return value: (a) the user lands on /login
  // while already authenticated, or (b) an OAuth *redirect* flow (production
  // Google/Facebook sign-in) completes on a fresh page load, where
  // signInMutation never resolves with a value to begin with. Needs its own
  // profile fetch + a token-result check (to tell password vs OAuth
  // sign-in-provider apart) since neither is available here otherwise.
  useEffect(() => {
    if (user) {
      void (async () => {
        try {
          const [profile, tokenResult] = await Promise.all([
            authService.getUserProfile(),
            user.getIdTokenResult(),
          ]);
          redirectByRole(profile, tokenResult.signInProvider === 'password');
        } catch (error) {
          console.error('[AuthPage] Failed to resolve profile/role after auth state change — falling back to default redirect:', error);
          window.location.href = getRedirectUrl();
        }
      })();
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      updateField(name as keyof LoginFormData, e.target.checked);
    } else {
      updateField(name as keyof LoginFormData, value);
    }
  };

  const handleFirebaseSignIn = async (email: string, password: string) => {
    // signInWithEmail already fetches the full profile internally as part
    // of completing sign-in — reuse it directly instead of making a second,
    // redundant /users/profile/get call (and depending on the `user` effect
    // above, which only fires once Firebase's onAuthStateChanged listener
    // catches up) to decide where to redirect.
    const profile = await signInMutation.mutateAsync({ type: 'email', email, password });
    redirectByRole(profile ?? null, true);
  };

  const handleGoogleSignIn = async () => {
    setIsNavigating(true);
    try {
      const profile = await signInMutation.mutateAsync({ type: 'google' });
      if (profile) {
        // Popup flow (localhost): profile is already in hand, redirect now.
        redirectByRole(profile, false);
      }
      // Redirect flow (production): mutateAsync resolves with no value —
      // the browser is navigating to Google's OAuth page regardless, and
      // completion is handled by the `user` effect above once the app
      // reloads after the redirect back.
    } catch (error) {
      console.error('Google sign-in failed:', error);
      setIsNavigating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitForm(handleFirebaseSignIn);
  };

  if (isAuthenticated) return null;

  return (
    <>
      {/* Loading Overlay */}
      {isNavigating && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.7)' }}
        >
          <div
            className="rounded-2xl p-8 max-w-sm mx-4 text-center"
            style={{ background: 'var(--surface-container-low)' }}
          >
            <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-on-surface mb-1">
              {translations.auth.login.redirecting ?? 'Signing you in…'}
            </h2>
            <p className="text-sm text-on-surface-variant">
              {translations.auth.login.pleaseWait ?? 'Please wait while we redirect you'}
            </p>
          </div>
        </div>
      )}

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

        {/* ── Brand panel (left, desktop only) ── */}
        <div
          className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#001a41 0%,#002e68 50%,#004493 100%)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 30% 50%,rgba(173,199,255,.15) 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(143,216,255,.1) 0%,transparent 50%)',
            }}
          />
          <div className="relative z-10">
            <a href={ROUTES.HOME} className="flex items-center gap-3 mb-12">
              <Logo className="w-9 h-9" />
              <span className="text-xl font-bold text-white">ThoughtMetrics</span>
            </a>
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
              India's Most<br />Transparent Research<br />
              <span style={{ color: '#adc7ff' }}>Network.</span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed max-w-sm">
              Join 50,000+ panel members. Earn rewards by sharing your opinions on products, services, and market trends.
            </p>
          </div>
          <div className="relative z-10 space-y-4">
            {[
              { icon: 'groups',   color: 'primary',   title: '50,000+ Panel Members', sub: 'Verified across India' },
              { icon: 'payments', color: 'secondary',  title: 'Real Rewards',          sub: 'Cash, vouchers & gift cards' },
              { icon: 'shield',   color: 'tertiary',   title: 'Privacy Protected',     sub: 'GDPR & DPDP compliant' },
            ].map(({ icon, color, title, sub }) => (
              <div key={title} className="flex items-center gap-4 rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className={`w-10 h-10 rounded-xl bg-${color}/20 flex items-center justify-center`}>
                  <span className={`material-symbols-outlined text-${color} text-xl`}>{icon}</span>
                </div>
                <div>
                  <div className="text-white font-semibold">{title}</div>
                  <div className="text-white/60 text-sm">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Form panel (right) ── */}
        <div
          className="flex flex-col"
          style={{ background: 'var(--surface-container-low)' }}
        >
          {/* Mini header */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-outline-variant/10">
            <a href={ROUTES.HOME} className="lg:hidden">
              <Logo className="w-8 h-8" />
            </a>
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-sm text-on-surface-variant hidden sm:block">Don't have an account?</span>
              <a href={signUpHref} className="btn-hdr-outline text-sm">Sign Up</a>
              <LanguageToggle variant="compact" />
            </div>
          </div>

          {/* Form body */}
          <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
            <div className="w-full max-w-md">

              {isSubmitted ? (
                <div className="text-center">
                  <span className="material-symbols-outlined text-secondary text-5xl mb-4 block">check_circle</span>
                  <h2 className="text-2xl font-bold text-on-surface mb-2">
                    {translations.auth.login.welcomeBack}
                  </h2>
                  <p className="text-on-surface-variant">{translations.auth.login.successMessage}</p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-on-surface mb-2">
                      {translations.auth.login.pageTitle ?? 'Welcome Back'}
                    </h1>
                    <p className="text-on-surface-variant">Log in to access your surveys and rewards.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                    {/* Login error */}
                    {loginError && (
                      <div
                        className="rounded-xl p-3 border flex items-center gap-2 text-sm"
                        style={{ background: 'color-mix(in srgb,var(--error) 10%,transparent)', borderColor: 'color-mix(in srgb,var(--error) 30%,transparent)', color: 'var(--error)' }}
                      >
                        <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
                        {loginError}
                      </div>
                    )}

                    {/* Email / ID */}
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                        {translations.auth.login.thoughtMetricsId}
                      </label>
                      <input
                        name="thoughtMetricsId"
                        type="email"
                        value={formData.thoughtMetricsId}
                        onChange={handleInputChange}
                        autoComplete="email"
                        required
                        className={inputCls}
                        style={inputStyle(errors.thoughtMetricsId as string | undefined)}
                        placeholder="you@email.com"
                      />
                      {errors.thoughtMetricsId && (
                        <p className="text-xs mt-1" style={{ color: 'var(--error)' }}>{errors.thoughtMetricsId as string}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-semibold text-on-surface-variant">
                          {translations.auth.login.password}
                        </label>
                        <a href={signUpHref} className="text-xs text-primary hover:underline">
                          {ui.links.resetPassword}
                        </a>
                      </div>
                      <div className="relative">
                        <input
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleInputChange}
                          autoComplete="current-password"
                          required
                          className={`${inputCls} pr-11`}
                          style={inputStyle(errors.password as string | undefined)}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                          aria-label="Toggle password visibility"
                        >
                          <span className="material-symbols-outlined text-xl">
                            {showPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-xs mt-1" style={{ color: 'var(--error)' }}>{errors.password as string}</p>
                      )}
                    </div>

                    {/* Remember me */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded flex-shrink-0"
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      <span className="text-sm text-on-surface-variant">{translations.auth.login.rememberMe}</span>
                    </label>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting || signInMutation.isPending}
                      className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting || signInMutation.isPending ? (
                        <><span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>{translations.auth.login.signingIn}</>
                      ) : (
                        <>{translations.auth.login.continueButton ?? 'Sign In'}<span className="material-symbols-outlined text-xl">arrow_forward</span></>
                      )}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--outline)' }}>
                      <div className="flex-1 h-px" style={{ background: 'var(--outline-variant)' }} />
                      or
                      <div className="flex-1 h-px" style={{ background: 'var(--outline-variant)' }} />
                    </div>

                    {/* Google */}
                    <button
                      type="button"
                      onClick={() => void handleGoogleSignIn()}
                      className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium text-on-surface transition-colors"
                      style={{
                        background: 'var(--surface-container)',
                        border: '1px solid color-mix(in srgb, var(--outline-variant) 50%, transparent)',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-container-high)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-container)'; }}
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      {translations.auth.signup.continueWithGoogle}
                    </button>

                    <p className="text-center text-sm text-on-surface-variant">
                      Don't have an account?{' '}
                      <a href={signUpHref} className="text-primary font-semibold hover:underline">
                        {translations.auth.login.createAccount ?? 'Sign up'}
                      </a>
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

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
