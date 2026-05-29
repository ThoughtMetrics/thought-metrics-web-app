import React, { useEffect, useState } from 'react';
import {
  TextInputAtom,
  TextareaAtom,
  PhoneInputAtom,
} from '@/shared/ui/atoms/custom-input';
import { landing } from '@/core/constants/page-constants/landing-constant';
import { usePartnershipFormStore } from '@/core/stores/partnership.store';
import { usePartnershipFormValidation } from '@/core/hooks/validation/use-partnership-form-validation';
import { useSubmitPartnership } from '@/core/hooks/queries/partnership/index.queries';

const { countryCodes, defaultCountryCode, ui } = landing.advocate.formsSection.inputForm;

const sectionTitleCls = 'text-xs font-bold tracking-[2px] uppercase text-on-surface-variant mb-4 pb-2 border-b border-outline-variant/30';

const PartnershipForm: React.FC = () => {
  const { formData, updateField, resetForm } = usePartnershipFormStore();
  const { errors, validate, clearError, clearAllErrors } = usePartnershipFormValidation();
  const submitMutation = useSubmitPartnership();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateField(name as keyof typeof formData, value);
    clearError(name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(formData)) return;
    const submitData: Record<string, unknown> = { ...formData, countryCode, phone: countryCode + formData.phone };
    Object.keys(submitData).forEach((k) => { if (submitData[k] === '') delete submitData[k]; });
    submitMutation.mutate(submitData as unknown as typeof formData);
  };

  if (submitMutation.isSuccess) {
    return (
      <div
        className="rounded-3xl p-10 border border-primary/20 flex flex-col items-center gap-4 text-center"
        style={{ background: 'color-mix(in srgb,var(--primary) 8%,transparent)' }}
      >
        <span className="material-symbols-outlined text-primary text-5xl">check_circle</span>
        <div className="font-bold text-on-surface text-xl mb-1">{ui.successMessage.title}</div>
        <div className="text-sm text-on-surface-variant">{ui.successMessage.description}</div>
      </div>
    );
  }

  return (
    <div
      className="rounded-3xl p-8 border border-outline-variant/10"
      style={{ background: 'var(--surface-container-low)' }}
    >
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>

        {/* Personal Information */}
        <div>
          <div className={sectionTitleCls}>Personal Information</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInputAtom id="firstName" name="firstName" label={ui.fieldLabels.firstName} value={formData.firstName} onChange={handleInputChange} error={errors.firstName} required />
            <TextInputAtom id="lastName" name="lastName" label={ui.fieldLabels.lastName} value={formData.lastName} onChange={handleInputChange} error={errors.lastName} required />
            <TextInputAtom id="email" name="email" label={ui.fieldLabels.email} type="email" value={formData.email} onChange={handleInputChange} error={errors.email} required />
            <PhoneInputAtom id="phone" name="phone" label={ui.fieldLabels.phone} value={formData.phone} onChange={handleInputChange} countryCode={countryCode} onCountryCodeChange={(e) => setCountryCode(e.target.value)} countryCodes={countryCodes} error={errors.phone} required />
          </div>
        </div>

        {/* Social Media Presence */}
        <div>
          <div className={sectionTitleCls}>Social Media Presence</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInputAtom id="instagramHandle" name="instagramHandle" label={ui.fieldLabels.instagramHandle} value={formData.instagramHandle} onChange={handleInputChange} error={errors.instagramHandle} />
            <TextInputAtom id="instagramFollowers" name="instagramFollowers" label={ui.fieldLabels.instagramFollowers} value={formData.instagramFollowers} onChange={handleInputChange} error={errors.instagramFollowers} />
            <TextInputAtom id="xHandle" name="xHandle" label={ui.fieldLabels.xHandle} value={formData.xHandle} onChange={handleInputChange} error={errors.xHandle} />
            <TextInputAtom id="xFollowers" name="xFollowers" label={ui.fieldLabels.xFollowers} value={formData.xFollowers} onChange={handleInputChange} error={errors.xFollowers} />
            <TextInputAtom id="linkedinUrl" name="linkedinUrl" label={ui.fieldLabels.linkedinUrl} value={formData.linkedinUrl} onChange={handleInputChange} error={errors.linkedinUrl} />
            <TextInputAtom id="linkedinConnections" name="linkedinConnections" label={ui.fieldLabels.linkedinConnections} value={formData.linkedinConnections} onChange={handleInputChange} error={errors.linkedinConnections} />
            <TextInputAtom id="youtubeChannel" name="youtubeChannel" label={ui.fieldLabels.youtubeChannel} value={formData.youtubeChannel} onChange={handleInputChange} error={errors.youtubeChannel} />
            <TextInputAtom id="youtubeFollowers" name="youtubeFollowers" label={ui.fieldLabels.youtubeFollowers} value={formData.youtubeFollowers} onChange={handleInputChange} error={errors.youtubeFollowers} />
          </div>
        </div>

        {/* Partnership Details */}
        <div>
          <div className={sectionTitleCls}>Partnership Details</div>
          <div className="space-y-4">
            <TextareaAtom id="supportGroups" name="supportGroups" label={ui.fieldLabels.supportGroups} value={formData.supportGroups} onChange={handleInputChange} error={errors.supportGroups} rows={3} />
            <TextareaAtom id="audienceDescription" name="audienceDescription" label={ui.fieldLabels.audienceDescription} value={formData.audienceDescription} onChange={handleInputChange} error={errors.audienceDescription} rows={3} />
            <TextareaAtom id="partnershipReason" name="partnershipReason" label={ui.fieldLabels.partnershipReason} value={formData.partnershipReason} onChange={handleInputChange} error={errors.partnershipReason} rows={3} />
          </div>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">{ui.privacyNote}</p>

        <button
          type="submit"
          className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={submitMutation.isPending}
        >
          {submitMutation.isPending ? (
            <><span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>{ui.buttons.submitting}</>
          ) : (
            <>{ui.buttons.submit}<span className="material-symbols-outlined text-xl">arrow_forward</span></>
          )}
        </button>
      </form>
    </div>
  );
};

export default PartnershipForm;
