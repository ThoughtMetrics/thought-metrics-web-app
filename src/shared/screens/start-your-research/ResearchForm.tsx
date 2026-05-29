import type { ResearchFormData } from '@/core/types/start-research-item.type';
import { startYourResearchConstants } from '@/core/constants/page-constants/start-your-research-constant';

import { ROUTES } from '@/routes/routeConfig';
import React, { useEffect, useState } from 'react';
import { useResearchFormStore } from '@/core/stores/research.store';
import { useResearchFormValidation } from '@/core/hooks/validation/use-research-form-validation';
import { useSubmitResearch } from '@/core/hooks/queries/research/index.queries';

const {
  countries,
  countryCodes,
  helpOptions,
  researchTypes,
  defaultCountryCode,
  ui,
} = startYourResearchConstants;

const inputCls =
  'w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20';
const labelCls = 'block text-xs font-semibold text-on-surface-variant mb-1.5 tracking-[0.01em]';
const errorCls = 'text-xs mt-1';

const sectionBadges = [
  { num: '1', bg: 'bg-primary/20',          text: 'text-primary' },
  { num: '2', bg: 'bg-secondary/20',        text: 'text-secondary' },
  { num: '3', bg: 'bg-tertiary/20',         text: 'text-tertiary' },
  { num: '4', bg: 'bg-primary-container/20',text: 'text-primary-container' },
] as const;

const inputStyle = (err?: string) => ({
  background: 'var(--surface-container)',
  border: `1px solid ${err ? 'var(--error)' : 'color-mix(in srgb, var(--outline-variant) 30%, transparent)'}`,
  color: 'var(--on-surface)',
});

const ResearchForm: React.FC = () => {
  const { formData, updateField, resetForm } = useResearchFormStore();
  const { errors, validate, clearError, clearAllErrors } = useResearchFormValidation();
  const submitMutation = useSubmitResearch();
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      updateField(name as keyof ResearchFormData, (e.target as HTMLInputElement).checked);
    } else {
      updateField(name as keyof ResearchFormData, value);
    }
    clearError(name);
  };

  const toggleCheckGroup = (field: 'helpOptions' | 'researchType', id: string) => {
    const current = formData[field] as string[];
    const next = current.includes(id) ? current.filter((v) => v !== id) : [...current, id];
    updateField(field, next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(formData)) return;
    const submitData: Record<string, unknown> = { ...formData, countryCode, phone: countryCode + formData.phone };
    Object.keys(submitData).forEach((k) => { if (submitData[k] === '') delete submitData[k]; });
    submitMutation.mutate(submitData as unknown as ResearchFormData);
  };

  return (
    <section className="tm-section relative" style={{ background: 'var(--surface)' }}>
      <div className="tm-container max-w-3xl mx-auto">

        {/* Hero text */}
        <div className="text-center mb-10">
          <nav className="flex items-center gap-2 mb-6 text-xs text-on-surface-variant justify-center" aria-label="Breadcrumb">
            <a href="/" className="hover:text-on-surface transition-colors">Home</a>
            <span className="opacity-40">/</span>
            <span className="text-primary font-medium">Start Your Research</span>
          </nav>
          <span className="chip mb-4 inline-flex">REQUEST A BID</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-[1.08] text-on-surface">
            Tell Us About Your{' '}
            <span className="text-primary italic">Research Project.</span>
          </h1>
          <p className="text-on-surface-variant max-w-xl mx-auto text-base">
            Fill in the details below and our team will get back to you within one business day with a proposal tailored to your needs.
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-[2rem] border border-outline-variant/10 p-8 shadow-2xl"
          style={{ background: 'var(--surface-container-low)' }}
        >
          {submitMutation.isSuccess ? (
            <div
              className="rounded-xl p-8 border border-primary/20 flex flex-col items-center gap-4 text-center"
              style={{ background: 'var(--surface-container)' }}
            >
              <span className="material-symbols-outlined text-secondary text-5xl">check_circle</span>
              <div>
                <div className="font-bold text-on-surface text-xl mb-2">{ui.successMessage.title}</div>
                <div className="text-on-surface-variant">{ui.successMessage.description}</div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8" noValidate>

              {/* Section 1: Contact Details */}
              <div>
                <div className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full ${sectionBadges[0].bg} flex items-center justify-center ${sectionBadges[0].text} text-xs font-bold`}>1</span>
                  Contact Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(['firstName', 'lastName'] as const).map((f) => (
                    <div key={f}>
                      <label className={labelCls}>{ui.fieldLabels[f]} <span style={{ color: 'var(--error)' }}>*</span></label>
                      <input name={f} type="text" value={formData[f]} onChange={handleInputChange} required className={inputCls} style={inputStyle(errors[f])} />
                      {errors[f] && <p className={errorCls} style={{ color: 'var(--error)' }}>{errors[f]}</p>}
                    </div>
                  ))}
                  <div>
                    <label className={labelCls}>{ui.fieldLabels.businessEmail} <span style={{ color: 'var(--error)' }}>*</span></label>
                    <input name="businessEmail" type="email" value={formData.businessEmail} onChange={handleInputChange} required className={inputCls} style={inputStyle(errors.businessEmail)} />
                    {errors.businessEmail && <p className={errorCls} style={{ color: 'var(--error)' }}>{errors.businessEmail}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>{ui.fieldLabels.phone}</label>
                    <div className="flex gap-2">
                      <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="rounded-xl px-3 py-3 text-sm outline-none" style={{ ...inputStyle(), maxWidth: '6.5rem' }}>
                        {countryCodes.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}
                      </select>
                      <input name="phone" type="tel" inputMode="numeric" value={formData.phone} onChange={handleInputChange} className={`${inputCls} flex-1`} style={inputStyle()} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>{ui.fieldLabels.company} <span style={{ color: 'var(--error)' }}>*</span></label>
                    <input name="company" type="text" value={formData.company} onChange={handleInputChange} required className={inputCls} style={inputStyle(errors.company)} />
                    {errors.company && <p className={errorCls} style={{ color: 'var(--error)' }}>{errors.company}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>{ui.fieldLabels.jobTitle} <span style={{ color: 'var(--error)' }}>*</span></label>
                    <input name="jobTitle" type="text" value={formData.jobTitle} onChange={handleInputChange} required className={inputCls} style={inputStyle(errors.jobTitle)} />
                    {errors.jobTitle && <p className={errorCls} style={{ color: 'var(--error)' }}>{errors.jobTitle}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>{ui.fieldLabels.countryOrRegion} <span style={{ color: 'var(--error)' }}>*</span></label>
                    <select name="countryOrRegion" value={formData.countryOrRegion} onChange={handleInputChange} required className={inputCls} style={inputStyle(errors.countryOrRegion)}>
                      <option value="">Select country</option>
                      {countries.map((c) => <option key={c.name ?? c.code} value={c.name ?? c.code}>{c.name ?? c.code}</option>)}
                    </select>
                    {errors.countryOrRegion && <p className={errorCls} style={{ color: 'var(--error)' }}>{errors.countryOrRegion}</p>}
                  </div>
                </div>
              </div>

              {/* Section 2: Research Details */}
              <div>
                <div className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full ${sectionBadges[1].bg} flex items-center justify-center ${sectionBadges[1].text} text-xs font-bold`}>2</span>
                  Research Details
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>{ui.fieldLabels.researchTopic}</label>
                    <input name="researchTopic" type="text" value={formData.researchTopic} onChange={handleInputChange} className={inputCls} style={inputStyle()} placeholder="e.g. Brand awareness study, New product concept test…" />
                  </div>
                  <div>
                    <label className={labelCls}>{ui.fieldLabels.projectDetails}</label>
                    <textarea name="projectDetails" value={formData.projectDetails} onChange={handleInputChange} rows={4} className={`${inputCls} resize-vertical`} style={inputStyle(errors.projectDetails)} placeholder="Tell us about your objectives, target audience, timeline, and any relevant details…" />
                    {errors.projectDetails && <p className={errorCls} style={{ color: 'var(--error)' }}>{errors.projectDetails}</p>}
                  </div>
                </div>
              </div>

              {/* Section 3: Help Options */}
              <div>
                <div className="text-sm font-bold text-on-surface mb-1 flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full ${sectionBadges[2].bg} flex items-center justify-center ${sectionBadges[2].text} text-xs font-bold`}>3</span>
                  {ui.fieldLabels.helpOptions}
                </div>
                <p className="text-xs text-on-surface-variant mb-4 ml-8">Select all that apply</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {helpOptions.map((opt) => {
                    const checked = (formData.helpOptions as string[]).includes(opt.id);
                    return (
                      <label
                        key={opt.id}
                        className="flex items-start gap-2.5 p-2.5 px-3.5 rounded-xl cursor-pointer transition-all"
                        style={{
                          background: checked ? 'color-mix(in srgb, var(--primary) 8%, transparent)' : 'var(--surface-container)',
                          border: `1px solid ${checked ? 'var(--primary)' : 'color-mix(in srgb, var(--outline-variant) 30%, transparent)'}`,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCheckGroup('helpOptions', opt.id)}
                          className="mt-0.5 h-4 w-4 flex-shrink-0 rounded"
                          style={{ accentColor: 'var(--primary)' }}
                        />
                        <span className="text-sm text-on-surface-variant leading-snug select-none" style={checked ? { color: 'var(--on-surface)' } : {}}>
                          {opt.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Research Type */}
              <div>
                <div className="text-sm font-bold text-on-surface mb-1 flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full ${sectionBadges[3].bg} flex items-center justify-center ${sectionBadges[3].text} text-xs font-bold`}>4</span>
                  {ui.fieldLabels.researchType}
                </div>
                <p className="text-xs text-on-surface-variant mb-4 ml-8">Select all that apply</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {researchTypes.map((opt) => {
                    const checked = (formData.researchType as string[]).includes(opt.id);
                    return (
                      <label
                        key={opt.id}
                        className="flex items-start gap-2.5 p-2.5 px-3.5 rounded-xl cursor-pointer transition-all"
                        style={{
                          background: checked ? 'color-mix(in srgb, var(--primary) 8%, transparent)' : 'var(--surface-container)',
                          border: `1px solid ${checked ? 'var(--primary)' : 'color-mix(in srgb, var(--outline-variant) 30%, transparent)'}`,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCheckGroup('researchType', opt.id)}
                          className="mt-0.5 h-4 w-4 flex-shrink-0 rounded"
                          style={{ accentColor: 'var(--primary)' }}
                        />
                        <span className="text-sm text-on-surface-variant leading-snug select-none" style={checked ? { color: 'var(--on-surface)' } : {}}>
                          {opt.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Consent */}
              <div
                className="rounded-xl p-5 border border-outline-variant/10 space-y-3"
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
                      type="checkbox" name={id}
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
                  <p className={errorCls} style={{ color: 'var(--error)' }}>{errors.consentCommunication}</p>
                )}
                <p className="text-xs text-on-surface-variant">
                  You may{' '}
                  <a href={ROUTES.UNSUBSCRIBE} className="underline text-primary">{ui.buttons.unsubscribe}</a>
                  {' '}from these communications anytime. See our{' '}
                  <a href={ROUTES.PRIVACY_POLICY} className="underline text-primary">{ui.buttons.privacyPolicy}</a>.
                </p>
              </div>

              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4"
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? (
                  <><span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>{ui.buttons.submitting}</>
                ) : (
                  <>{ui.buttons.submit}<span className="material-symbols-outlined text-xl">arrow_forward</span></>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Ambient orb */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }} aria-hidden="true">
        <div className="absolute top-0 right-0 rounded-full" style={{ width: 400, height: 400, background: 'var(--primary)', opacity: 0.05, filter: 'blur(120px)' }} />
      </div>
    </section>
  );
};

export default ResearchForm;
