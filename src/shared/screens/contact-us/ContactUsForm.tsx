import React, { useEffect } from 'react';

import { ROUTES } from '@/routes/routeConfig';
import { contactUsConstants } from '@/core/constants/page-constants/contact-us-constant';
import { useContactFormStore } from '@/core/stores/contact-us.store';
import { useContactFormValidation } from '@/core/hooks/validation/use-contact-us-form-validation';
import { useSubmitContactForm } from '@/core/hooks/queries/contact-us/index.queries';

const { countryCodes, defaultCountryCode, ui } = contactUsConstants;

const inputCls =
  'w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20';

const ContactUs: React.FC = () => {
  const { formData, updateField, resetForm } = useContactFormStore();
  const { errors, validate, clearError, clearAllErrors } = useContactFormValidation();
  const submitMutation = useSubmitContactForm();
  const [countryCode, setCountryCode] = React.useState(defaultCountryCode);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    updateField(name as keyof typeof formData, finalValue);
    clearError(name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(formData)) return;
    submitMutation.mutate({ ...formData, phone: countryCode + formData.phone });
  };

  return (
    <section className="tm-section relative">
      <div className="tm-container">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

          {/* ── Left info panel ── */}
          <div className="lg:col-span-2">
            <nav className="flex items-center gap-2 mb-6 text-xs text-on-surface-variant" aria-label="Breadcrumb">
              <a href="/" className="hover:text-on-surface transition-colors">Home</a>
              <span className="opacity-40">/</span>
              <span className="text-primary font-medium">Contact Us</span>
            </nav>
            <span className="chip mb-6 inline-flex">GET IN TOUCH</span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-[1.08] text-on-surface">
              Get the Conversation<br />
              <span className="text-primary italic">Started Today.</span>
            </h1>
            <p className="text-on-surface-variant mb-8 leading-relaxed text-base">
              {ui.description}
            </p>

            <div className="space-y-5 mb-8">
              {[
                { icon: 'mail', color: 'primary', title: 'Email Us', detail: 'hello@thoughtmetrics.com', href: 'mailto:hello@thoughtmetrics.com' },
                { icon: 'work', color: 'secondary', title: 'Careers', detail: 'careers@thoughtmetrics.com', href: 'mailto:careers@thoughtmetrics.com' },
                { icon: 'location_on', color: 'tertiary', title: 'Headquarters', detail: 'Mumbai, India', href: null },
              ].map(({ icon, color, title, detail, href }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-${color}/10 flex items-center justify-center flex-shrink-0`}>
                    <span className={`material-symbols-outlined text-${color} text-xl`}>{icon}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-on-surface mb-0.5">{title}</div>
                    {href ? (
                      <a href={href} className={`text-sm text-${color} hover:underline`}>{detail}</a>
                    ) : (
                      <div className="text-sm text-on-surface-variant">{detail}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="rounded-2xl p-5 border border-outline-variant/10 text-sm text-on-surface-variant leading-relaxed"
              style={{ background: 'var(--surface-container)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-base">info</span>
                <span className="font-semibold text-on-surface text-sm">Reference Number</span>
              </div>
              {ui.referenceNumberNote}
            </div>
          </div>

          {/* ── Right form card ── */}
          <div className="lg:col-span-3">
            <div
              className="rounded-[2rem] border border-outline-variant/10 p-8 shadow-2xl"
              style={{ background: 'var(--surface-container-low)' }}
            >
              <h2 className="text-xl font-bold text-on-surface mb-6">Send Us a Message</h2>

              {submitMutation.isSuccess ? (
                <div
                  className="rounded-xl p-6 border border-primary/20 flex items-center gap-4"
                  style={{ background: 'var(--surface-container)' }}
                >
                  <span className="material-symbols-outlined text-secondary text-3xl flex-shrink-0">check_circle</span>
                  <div>
                    <div className="font-semibold text-on-surface mb-1">{ui.successMessage.title}</div>
                    <div className="text-sm text-on-surface-variant">{ui.successMessage.description}</div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                  {/* Name row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(['firstName', 'lastName'] as const).map((field) => (
                      <div key={field}>
                        <label
                          htmlFor={field}
                          className="block text-xs font-semibold text-on-surface-variant mb-1.5 tracking-[0.01em]"
                        >
                          {ui.fieldLabels[field]} <span style={{ color: 'var(--error)' }}>*</span>
                        </label>
                        <input
                          id={field}
                          name={field}
                          type="text"
                          value={formData[field]}
                          onChange={handleInputChange}
                          required
                          className={inputCls}
                          style={{
                            background: 'var(--surface-container)',
                            border: `1px solid ${errors[field] ? 'var(--error)' : 'color-mix(in srgb, var(--outline-variant) 30%, transparent)'}`,
                            color: 'var(--on-surface)',
                          }}
                        />
                        {errors[field] && <p className="text-xs mt-1" style={{ color: 'var(--error)' }}>{errors[field]}</p>}
                      </div>
                    ))}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-on-surface-variant mb-1.5 tracking-[0.01em]">
                      {ui.fieldLabels.email} <span style={{ color: 'var(--error)' }}>*</span>
                    </label>
                    <input
                      id="email" name="email" type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={inputCls}
                      style={{
                        background: 'var(--surface-container)',
                        border: `1px solid ${errors.email ? 'var(--error)' : 'color-mix(in srgb, var(--outline-variant) 30%, transparent)'}`,
                        color: 'var(--on-surface)',
                      }}
                    />
                    {errors.email && <p className="text-xs mt-1" style={{ color: 'var(--error)' }}>{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-on-surface-variant mb-1.5 tracking-[0.01em]">
                      {ui.fieldLabels.phone}
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="rounded-xl px-3 py-3 text-sm outline-none"
                        style={{
                          background: 'var(--surface-container)',
                          border: '1px solid color-mix(in srgb, var(--outline-variant) 30%, transparent)',
                          color: 'var(--on-surface)',
                          maxWidth: '7rem',
                        }}
                      >
                        {countryCodes.map((c) => (
                          <option key={c.code} value={c.code}>{c.code}</option>
                        ))}
                      </select>
                      <input
                        id="phone" name="phone" type="tel" inputMode="numeric"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`${inputCls} flex-1`}
                        style={{
                          background: 'var(--surface-container)',
                          border: '1px solid color-mix(in srgb, var(--outline-variant) 30%, transparent)',
                          color: 'var(--on-surface)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Reference Number */}
                  <div>
                    <label htmlFor="caseStudyRefNumber" className="block text-xs font-semibold text-on-surface-variant mb-1.5 tracking-[0.01em]">
                      {ui.fieldLabels.caseStudyRefNumber}
                    </label>
                    <input
                      id="caseStudyRefNumber" name="caseStudyRefNumber" type="text"
                      value={formData.caseStudyRefNumber}
                      onChange={handleInputChange}
                      className={inputCls}
                      style={{
                        background: 'var(--surface-container)',
                        border: '1px solid color-mix(in srgb, var(--outline-variant) 30%, transparent)',
                        color: 'var(--on-surface)',
                      }}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-xs font-semibold text-on-surface-variant mb-1.5 tracking-[0.01em]">
                      {ui.fieldLabels.subject} <span style={{ color: 'var(--error)' }}>*</span>
                    </label>
                    <input
                      id="subject" name="subject" type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className={inputCls}
                      style={{
                        background: 'var(--surface-container)',
                        border: `1px solid ${errors.subject ? 'var(--error)' : 'color-mix(in srgb, var(--outline-variant) 30%, transparent)'}`,
                        color: 'var(--on-surface)',
                      }}
                    />
                    {errors.subject && <p className="text-xs mt-1" style={{ color: 'var(--error)' }}>{errors.subject}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold text-on-surface-variant mb-1.5 tracking-[0.01em]">
                      {ui.fieldLabels.message} <span style={{ color: 'var(--error)' }}>*</span>
                    </label>
                    <textarea
                      id="message" name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required rows={4}
                      className={`${inputCls} resize-vertical`}
                      style={{
                        background: 'var(--surface-container)',
                        border: `1px solid ${errors.message ? 'var(--error)' : 'color-mix(in srgb, var(--outline-variant) 30%, transparent)'}`,
                        color: 'var(--on-surface)',
                      }}
                    />
                    {errors.message && <p className="text-xs mt-1" style={{ color: 'var(--error)' }}>{errors.message}</p>}
                  </div>

                  {/* Consent block */}
                  <div
                    className="rounded-xl p-5 border border-outline-variant/10 space-y-4"
                    style={{ background: 'var(--surface-container)' }}
                  >
                    <div className="text-sm font-semibold text-on-surface">{ui.consentSection.title}</div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{ui.consentSection.description}</p>
                    {(
                      [
                        { id: 'consentCommunication', label: ui.checkboxLabels.consentCommunication, required: true },
                        { id: 'consentMarketing',     label: ui.checkboxLabels.consentMarketing,     required: false },
                        { id: 'consentSubscribe',     label: ui.checkboxLabels.consentSubscribe,     required: false },
                      ] as const
                    ).map(({ id, label, required }) => (
                      <label key={id} className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox" id={id} name={id}
                          checked={formData[id] as boolean}
                          onChange={handleInputChange}
                          required={required}
                          className="mt-0.5 h-4 w-4 flex-shrink-0 rounded"
                          style={{ accentColor: 'var(--primary)' }}
                        />
                        <span className="text-sm text-on-surface-variant leading-relaxed">
                          {required && <span style={{ color: 'var(--error)' }}>* </span>}
                          {label}
                        </span>
                      </label>
                    ))}
                    {errors.consentCommunication && (
                      <p className="text-xs" style={{ color: 'var(--error)' }}>{errors.consentCommunication}</p>
                    )}
                    <p className="text-xs text-on-surface-variant">
                      You may{' '}
                      <a href={ROUTES.UNSUBSCRIBE} className="underline text-primary">{ui.buttons.unsubscribe}</a>
                      {' '}from these communications anytime. For more information check our{' '}
                      <a href={ROUTES.PRIVACY_POLICY} className="underline text-primary">{ui.buttons.privacyPolicy}</a>.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3.5"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? (
                      <><span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>{ui.buttons.submitting}</>
                    ) : (
                      <>{ui.buttons.submit}<span className="material-symbols-outlined text-xl">send</span></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ambient orb */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }} aria-hidden="true">
        <div className="absolute top-0 right-0 rounded-full" style={{ width: 400, height: 400, background: 'var(--primary)', opacity: 0.06, filter: 'blur(120px)' }} />
      </div>
    </section>
  );
};

export default ContactUs;
