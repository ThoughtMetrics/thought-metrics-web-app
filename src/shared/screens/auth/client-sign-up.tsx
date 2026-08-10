import React, { useState } from 'react';
import { ROUTES } from '@/routes/routeConfig';
import { Logo } from '@/assets';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider } from '@/shared/providers/auth-provider';
import { useSignUpMutation } from '@/core/hooks/mutations/use-sign-up.mutation';
import { CheckboxAtom, TextInputAtom, PhoneInputAtom } from '@/shared/ui/atoms/custom-input';
import type { ClientSignUpData } from '@/core/types/client-signup.type';

const initialFormData: ClientSignUpData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  companyName: '',
  termsAccepted: false,
  privacyAccepted: false,
};

const ClientSignUpPage: React.FC = () => {
  const signUpMutation = useSignUpMutation();
  const [formData, setFormData] = useState<ClientSignUpData>(initialFormData);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!formData.firstName.trim()) next.firstName = 'First name is required';
    if (!formData.lastName.trim()) next.lastName = 'Last name is required';
    if (!formData.companyName.trim()) next.companyName = 'Company name is required';
    if (!formData.email.trim()) next.email = 'Business email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = 'Enter a valid email address';
    if (!formData.password.trim()) next.password = 'Password is required';
    else if (formData.password.length < 8) next.password = 'Password must be at least 8 characters';
    if (!confirmPassword.trim()) next.confirmPassword = 'Confirm your password';
    else if (confirmPassword !== formData.password) next.confirmPassword = 'Passwords do not match';
    if (!formData.termsAccepted) next.termsAccepted = 'You must accept the Terms & Conditions';
    if (!formData.privacyAccepted) next.privacyAccepted = 'You must accept the Privacy Policy';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError('');
    try {
      const profile = await signUpMutation.mutateAsync({
        type: 'client',
        data: {
          ...formData,
          phone: formData.phone ? `${countryCode}${formData.phone}` : undefined,
        },
      });
      if (profile) {
        setIsSubmitted(true);
        setTimeout(() => {
          window.location.href = ROUTES.CLIENT;
        }, 1200);
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Brand panel */}
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
            Launch Research<br />That Moves Your<br />
            <span style={{ color: '#adc7ff' }}>Business Forward.</span>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-sm">
            Create your company account to launch surveys, reach 5,00,000+ verified respondents, and turn insights into decisions.
          </p>
        </div>
        <div className="relative z-10 space-y-4">
          {[
            { icon: 'groups', color: 'primary', title: '5,00,000+ Respondents', sub: 'Verified across India' },
            { icon: 'bolt', color: 'secondary', title: '3-Day Turnaround', sub: 'From launch to insights' },
            { icon: 'shield', color: 'tertiary', title: 'Privacy Protected', sub: 'GDPR & DPDP compliant' },
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

      {/* Form panel */}
      <div className="flex flex-col" style={{ background: 'var(--surface-container-low)' }}>
        <div className="flex items-center justify-between px-8 py-4 border-b border-outline-variant/10">
          <a href={ROUTES.HOME} className="lg:hidden">
            <Logo className="w-8 h-8" />
          </a>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-sm text-on-surface-variant hidden sm:block">Already have an account?</span>
            <a href={`${ROUTES.LOGIN_IN}?userType=client`} className="btn-hdr-outline text-sm">Log In</a>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            {isSubmitted ? (
              <div className="text-center">
                <span className="material-symbols-outlined text-secondary text-5xl mb-4 block">check_circle</span>
                <h2 className="text-2xl font-bold text-on-surface mb-2">Account created!</h2>
                <p className="text-on-surface-variant">Taking you to your client dashboard…</p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-extrabold text-on-surface mb-2">Create Your Survey Account</h1>
                  <p className="text-on-surface-variant">Set up your company to start launching research.</p>
                </div>

                <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5" noValidate>
                  {submitError && (
                    <div
                      className="rounded-xl p-3 border flex items-center gap-2 text-sm"
                      style={{ background: 'color-mix(in srgb,var(--error) 10%,transparent)', borderColor: 'color-mix(in srgb,var(--error) 30%,transparent)', color: 'var(--error)' }}
                    >
                      <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
                      {submitError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <TextInputAtom
                      id="firstName"
                      name="firstName"
                      label="First name"
                      value={formData.firstName}
                      onChange={handleChange}
                      error={errors.firstName}
                      required
                    />
                    <TextInputAtom
                      id="lastName"
                      name="lastName"
                      label="Last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      error={errors.lastName}
                      required
                    />
                  </div>

                  <TextInputAtom
                    id="companyName"
                    name="companyName"
                    label="Company name"
                    value={formData.companyName}
                    onChange={handleChange}
                    error={errors.companyName}
                    required
                  />

                  <TextInputAtom
                    id="email"
                    name="email"
                    label="Business email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                  />

                  <PhoneInputAtom
                    id="phone"
                    name="phone"
                    label="Phone (optional)"
                    value={formData.phone ?? ''}
                    onChange={handleChange}
                    countryCode={countryCode}
                    onCountryCodeChange={(e) => setCountryCode(e.target.value)}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <TextInputAtom
                      id="password"
                      name="password"
                      label="Password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      error={errors.password}
                      required
                    />
                    <TextInputAtom
                      id="confirmPassword"
                      name="confirmPassword"
                      label="Confirm password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                      }}
                      error={errors.confirmPassword}
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <CheckboxAtom
                      id="termsAccepted"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      error={errors.termsAccepted}
                      customLabelComponent={
                        <div>
                          I agree to the{' '}
                          <a href={ROUTES.TERMS_AND_CONDITIONS} className="hover:text-primary underline">
                            Terms & Conditions
                          </a>
                        </div>
                      }
                    />
                    <CheckboxAtom
                      id="privacyAccepted"
                      name="privacyAccepted"
                      checked={formData.privacyAccepted}
                      onChange={handleChange}
                      error={errors.privacyAccepted}
                      customLabelComponent={
                        <div>
                          I agree to the{' '}
                          <a href={ROUTES.PRIVACY_POLICY} className="hover:text-primary underline">
                            Privacy Policy
                          </a>
                        </div>
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={signUpMutation.isPending}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {signUpMutation.isPending ? (
                      <><span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>Creating account…</>
                    ) : (
                      <>+ Create Survey Account<span className="material-symbols-outlined text-xl">arrow_forward</span></>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ClientSignUpWrapper: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ClientSignUpPage />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default ClientSignUpWrapper;
