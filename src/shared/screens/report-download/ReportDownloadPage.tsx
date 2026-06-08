import type React from 'react';
import { useEffect, useState } from 'react';
import { reportDownloadConstant } from '@/core/constants/page-constants/report-download-constant';

import { ROUTES } from '@/routes/routeConfig';
import {
  CheckboxAtom,
  PhoneInputAtom,
  SelectAtom,
  TextInputAtom,
} from '@/shared/ui/atoms/custom-input';
import { useDownloadReportFormStore } from '@/core/stores/download-report.store';
import { useDownloadReportFormValidation } from '@/core/hooks/validation/use-download-report-form-validation';
import { useSubmitDownloadReport } from '@/core/hooks/queries/download-report/index.queries';

const { countries, countryCodes, defaultCountryCode, ui } = reportDownloadConstant;

const ReportDownloadPage: React.FC = () => {
  const { formData, updateField, resetForm } = useDownloadReportFormStore();
  const { errors, validate, clearError, clearAllErrors } = useDownloadReportFormValidation();
  const submitMutation = useSubmitDownloadReport();
  const [countryCode, setCountryCode] = useState(defaultCountryCode);

  useEffect(() => {
    if (submitMutation.isSuccess) {
      const timer = setTimeout(() => {
        resetForm();
        clearAllErrors();
        submitMutation.reset();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitMutation.isSuccess, resetForm, clearAllErrors, submitMutation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    updateField(name as keyof typeof formData, type === 'checkbox' ? (e.target as HTMLInputElement).checked : value);
    clearError(name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToValidate = { ...formData, countryCode, phone: countryCode + formData.phone };
    if (!validate(dataToValidate)) return;
    const submitData: Record<string, unknown> = { ...formData, countryCode, phone: countryCode + formData.phone };
    Object.keys(submitData).forEach((k) => { if (submitData[k] === '') delete submitData[k]; });
    submitMutation.mutate(submitData as unknown as typeof formData);
  };

  if (submitMutation.isSuccess) {
    return (
      <section className="tm-section flex items-center justify-center min-h-[60vh]">
        <div
          className="max-w-md w-full text-center rounded-2xl p-10 border border-outline-variant/10"
          style={{ background: 'var(--surface-container-low)' }}
        >
          <span className="material-symbols-outlined text-secondary text-5xl mb-4 block">check_circle</span>
          <h2 className="text-2xl font-bold text-on-surface mb-2">{ui.successMessage.title}</h2>
          <p className="text-on-surface-variant mb-6">{ui.successMessage.description}</p>
          <a href={ROUTES.HOME} className="btn-primary inline-flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">home</span>Back to Home
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="tm-section relative overflow-hidden">
      <div className="tm-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">

          {/* ── Left: Report preview (sticky on desktop) ── */}
          <div className="lg:sticky lg:top-28">
            <nav className="flex items-center gap-2 mb-6 text-xs text-on-surface-variant" aria-label="Breadcrumb">
              <a href="/" className="hover:text-on-surface transition-colors">Home</a>
              <span className="opacity-40">/</span>
              <span className="text-primary font-medium">Report Download</span>
            </nav>
            <span className="chip mb-6 inline-flex">FREE REPORT</span>
            <h1 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight text-on-surface">
              India Consumer Insights<br />
              <span className="text-primary italic">Report 2025.</span>
            </h1>
            <p className="text-on-surface-variant mb-8 leading-relaxed">
              {ui.loginPrompt}{' '}
              <a href={ROUTES.LOGIN_IN} className="text-primary hover:underline">{ui.loginLink}</a>
            </p>

            {/* Report preview card */}
            <div className="relative rounded-2xl overflow-hidden border border-outline-variant/20 shadow-2xl mb-6">
              <div
                className="p-8 min-h-[200px] flex flex-col justify-between relative"
                style={{ background: 'linear-gradient(135deg, color-mix(in srgb,var(--primary) 30%,transparent), color-mix(in srgb,var(--secondary) 20%,transparent))' }}
              >
                <div className="absolute inset-0" style={{ backdropFilter: 'blur(4px)', background: 'color-mix(in srgb,var(--surface-container-low) 60%,transparent)' }} />
                <div className="relative z-10">
                  <div className="text-xl font-extrabold text-on-surface mb-2">India Consumer Insights Report 2025</div>
                  <div className="text-sm text-on-surface-variant mb-6">Trends, Behaviors &amp; Market Opportunities</div>
                </div>
                <div className="relative z-10 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-3xl">lock</span>
                  <div>
                    <div className="text-sm font-bold text-on-surface">Full report locked</div>
                    <div className="text-xs text-on-surface-variant">Complete the form to access</div>
                  </div>
                </div>
              </div>
            </div>

            {/* What's inside */}
            <div className="space-y-3">
              <div className="text-sm font-semibold text-on-surface mb-2">What's Inside</div>
              {[
                { color: 'primary', text: 'Consumer sentiment & confidence trends' },
                { color: 'secondary', text: 'Category purchase intent across 8 sectors' },
                { color: 'tertiary', text: 'Digital vs offline shopping behavior shifts' },
                { color: 'primary', text: 'Brand trust & loyalty benchmarks' },
                { color: 'secondary', text: 'Tier 1 vs Tier 2/3 city behavior comparison' },
              ].map(({ color, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <span className={`material-symbols-outlined text-${color} text-base`}>check_circle</span>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Download form ── */}
          <div
            className="rounded-[2rem] border border-outline-variant/10 p-8 shadow-2xl"
            style={{ background: 'var(--surface-container-low)' }}
          >
            <h2 className="text-xl font-bold text-on-surface mb-6">Access the Full Report</h2>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInputAtom id="firstName" name="firstName" label={ui.fieldLabels.firstName} value={formData.firstName} onChange={handleInputChange} error={errors.firstName} required />
                <TextInputAtom id="lastName" name="lastName" label={ui.fieldLabels.lastName} value={formData.lastName} onChange={handleInputChange} error={errors.lastName} required />
              </div>
              <TextInputAtom id="businessEmail" name="businessEmail" label={ui.fieldLabels.businessEmail} type="email" value={formData.businessEmail} onChange={handleInputChange} error={errors.businessEmail} required />
              <PhoneInputAtom id="phone" name="phone" label={ui.fieldLabels.phone} value={formData.phone} onChange={handleInputChange} countryCode={countryCode} onCountryCodeChange={(e) => setCountryCode(e.target.value)} countryCodes={countryCodes} error={errors.phone} />
              <TextInputAtom id="company" name="company" label={ui.fieldLabels.company} value={formData.company} onChange={handleInputChange} error={errors.company} required />
              <TextInputAtom id="jobTitle" name="jobTitle" label={ui.fieldLabels.jobTitle} value={formData.jobTitle} onChange={handleInputChange} error={errors.jobTitle} />
              <SelectAtom id="countryOrRegion" name="countryOrRegion" label={ui.fieldLabels.countryOrRegion} value={formData.countryOrRegion} onChange={handleInputChange} options={countries} error={errors.countryOrRegion} required />

              <div className="rounded-xl p-4 border border-outline-variant/10 space-y-3" style={{ background: 'var(--surface-container)' }}>
                <CheckboxAtom id="subscribeNewsletter" name="subscribeNewsletter" checked={formData.subscribeNewsletter} onChange={handleInputChange} label={ui.checkboxLabels.subscribeNewsletter} />
                <CheckboxAtom id="dataUsageConsent" name="dataUsageConsent" checked={formData.dataUsageConsent} onChange={handleInputChange} label={ui.checkboxLabels.dataUsageConsent} required error={errors.dataUsageConsent} />
              </div>

              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? (
                  <><span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>{ui.buttons.downloading}</>
                ) : (
                  <><span className="material-symbols-outlined text-xl">download</span>{ui.buttons.download}</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Ambient orb */}
      <div
        className="absolute top-0 right-0 pointer-events-none rounded-full"
        style={{ zIndex: -1, width: 400, height: 400, background: 'var(--primary)', opacity: 0.05, filter: 'blur(120px)' }}
        aria-hidden="true"
      />
    </section>
  );
};

export default ReportDownloadPage;
