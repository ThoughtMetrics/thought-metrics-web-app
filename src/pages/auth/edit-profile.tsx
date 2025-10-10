import React, { useState, useEffect } from 'react';
import { editProfileFormConstant } from './constant';
import {
  CheckboxAtom,
  CheckboxOutlineGroupAtom,
  PhoneInputAtom,
  SelectAtom,
  TextInputAtom,
} from '@/shared/ui/atoms/custom-input';
import { Link } from 'react-router-dom';
import { ArrowRed } from '@/assets';
import { useProfileQuery } from '@/core/hooks/queries/use-profile.query';
import { useUpdateProfileMutation } from '@/core/hooks/mutations/use-update-profile.mutation';
import { LoaderOverlay } from '@/shared/ui/atoms/loader';
import { toast } from 'sonner';

// Destructure constants
const {
  participationOptions,
  months,
  states,
  countryCodes,
  defaultCountryCode,
  validationMessages,
  emailRegex,
  ui,
} = editProfileFormConstant;

const emailRegexPattern = new RegExp(emailRegex);

// Generate days (1-31) and years (1900-current)
const days = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1).padStart(2, '0'),
  label: String(i + 1),
}));
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => ({
  value: String(currentYear - i),
  label: String(currentYear - i),
}));

const EditProfilePage: React.FC = () => {
  const { data: profile, isLoading: isLoadingProfile } = useProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    countryOrRegion: 'India',
    zipCode: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: {
      month: '',
      day: '',
      year: '',
    },
    participationPreferences: [] as string[],
    termsAccepted: false,
    privacyAccepted: false,
  });

  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form with existing profile data
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        firstName: profile.profile?.firstName || '',
        lastName: profile.profile?.lastName || '',
        address1: profile.respondentInfo?.address1 || '',
        address2: profile.respondentInfo?.address2 || '',
        email: profile.email || '',
        phone: profile.profile?.phone || '',
        city: profile.respondentInfo?.city || '',
        state: profile.respondentInfo?.state || '',
        countryOrRegion: profile.respondentInfo?.countryOrRegion || 'India',
        zipCode: profile.respondentInfo?.zipCode || '',
        dateOfBirth: {
          month: profile.respondentInfo?.dateOfBirth?.month || '',
          day: profile.respondentInfo?.dateOfBirth?.day || '',
          year: profile.respondentInfo?.dateOfBirth?.year || '',
        },
        participationPreferences:
          profile.respondentInfo?.participationPreferences || [],
        termsAccepted: true,
        privacyAccepted: true,
      }));
    }
  }, [profile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountryCode(e.target.value);
  };

  const handleParticipationChange = (selectedValues: string[]) => {
    setFormData((prev) => ({
      ...prev,
      participationPreferences: selectedValues,
    }));
  };

  const updateField = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = validationMessages.firstName;
    if (!formData.lastName.trim())
      newErrors.lastName = validationMessages.lastName;
    if (!formData.email.trim()) {
      newErrors.email = validationMessages.email.required;
    } else if (!emailRegexPattern.test(formData.email)) {
      newErrors.email = validationMessages.email.invalid;
    }
    if (!formData.address1.trim())
      newErrors.address1 = validationMessages.address1;
    if (!formData.city.trim()) newErrors.city = validationMessages.city;
    if (!formData.state.trim()) newErrors.state = validationMessages.state;
    if (!formData.countryOrRegion.trim())
      newErrors.countryOrRegion = validationMessages.countryOrRegion;
    if (!formData.zipCode.trim())
      newErrors.zipCode = validationMessages.zipCode;
    if (
      !formData.dateOfBirth.month ||
      !formData.dateOfBirth.day ||
      !formData.dateOfBirth.year
    ) {
      newErrors.dateOfBirth = validationMessages.dateOfBirth;
    }

    // Password validation only if password is provided
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        },
        respondentInfo: {
          address1: formData.address1,
          address2: formData.address2,
          city: formData.city,
          state: formData.state,
          countryOrRegion: formData.countryOrRegion,
          zipCode: formData.zipCode,
          dateOfBirth: formData.dateOfBirth,
          participationPreferences: formData.participationPreferences,
        },
      });

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
    }
  };

  if (isLoadingProfile) {
    return <LoaderOverlay isVisible={true} message="Loading your profile..." />;
  }

  return (
    <>
      <LoaderOverlay
        isVisible={updateProfileMutation.isPending}
        message="Updating your profile..."
      />
      <div className="common-component bg-white text-black">
        <div className="common-container px-6 py-8 md:px-24 md:py-12 justify-center flex-col !max-w-[var(--breakpoint-2xl)]">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-medium tracking-tighter text-gray-900 mb-2">
              Manage
            </h1>
            <Link
              to="#"
              className="text-black font-medium hover:font-semibold underline text-sm"
            >
              Add/Manage Children
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-xl font-medium tracking-tighter mb-4">
              {ui.notes.requiredFields}
            </p>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
              <TextInputAtom
                id="firstName"
                name="firstName"
                label={ui.fieldLabels.firstName}
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                required
              />
              <TextInputAtom
                id="lastName"
                name="lastName"
                label={ui.fieldLabels.lastName}
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                required
              />
              <TextInputAtom
                id="address1"
                name="address1"
                label={ui.fieldLabels.address1}
                value={formData.address1}
                onChange={handleInputChange}
                error={errors.address1}
                required
              />
              <TextInputAtom
                id="address2"
                name="address2"
                label={ui.fieldLabels.address2}
                value={formData.address2}
                onChange={handleInputChange}
              />
              <TextInputAtom
                id="email"
                name="email"
                label={ui.fieldLabels.email}
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
              />
              <PhoneInputAtom
                id="phone"
                name="phone"
                label={ui.fieldLabels.phone}
                value={formData.phone}
                onChange={handleInputChange}
                countryCode={countryCode}
                onCountryCodeChange={handleCountryCodeChange}
                countryCodes={countryCodes}
              />
              <TextInputAtom
                id="city"
                name="city"
                label={ui.fieldLabels.city}
                value={formData.city}
                onChange={handleInputChange}
                error={errors.city}
                required
              />
              <SelectAtom
                id="state"
                name="state"
                label={ui.fieldLabels.state}
                value={formData.state}
                onChange={handleInputChange}
                options={states}
                error={errors.state}
                required
                placeholder="Select state"
              />
              <TextInputAtom
                id="password"
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
              />
              <TextInputAtom
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
              />
              <TextInputAtom
                id="zipCode"
                name="zipCode"
                label={ui.fieldLabels.zipCode}
                value={formData.zipCode}
                onChange={handleInputChange}
                error={errors.zipCode}
                required
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                {ui.fieldLabels.dateOfBirth}*
              </label>
              <div className="grid grid-cols-3 gap-4 w-fit">
                <SelectAtom
                  id="month"
                  name="dateOfBirth.month"
                  label=""
                  value={formData.dateOfBirth.month}
                  onChange={(e) =>
                    updateField('dateOfBirth.month', e.target.value)
                  }
                  options={months}
                  placeholder="Month"
                />
                <SelectAtom
                  id="day"
                  name="dateOfBirth.day"
                  label=""
                  value={formData.dateOfBirth.day}
                  onChange={(e) =>
                    updateField('dateOfBirth.day', e.target.value)
                  }
                  options={days}
                  placeholder="Day"
                />
                <SelectAtom
                  id="year"
                  name="dateOfBirth.year"
                  label=""
                  value={formData.dateOfBirth.year}
                  onChange={(e) =>
                    updateField('dateOfBirth.year', e.target.value)
                  }
                  options={years}
                  placeholder="Year"
                />
              </div>
              {errors.dateOfBirth && (
                <p className="text-sm text-primary">{errors.dateOfBirth}</p>
              )}
            </div>

            {/* Participation Preferences */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {ui.preferences.title}
              </h2>
              <p className="text-gray-600 mb-6">{ui.preferences.description}</p>

              <CheckboxOutlineGroupAtom
                label=""
                options={participationOptions}
                selectedValues={formData.participationPreferences}
                onChange={handleParticipationChange}
                columns={1}
              />
            </div>

            {/* Terms and Privacy */}
            <div className="space-y-4">
              <CheckboxAtom
                id="termsAccepted"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                label="I have read and understand my responsibilities as a participant and I agree to the TERMS AND CONDITIONS"
              />

              <CheckboxAtom
                id="privacyAccepted"
                name="privacyAccepted"
                checked={formData.privacyAccepted}
                onChange={handleInputChange}
                label={`By clicking "Next", you are agreeing to Thought Metrics PRIVACY POLICY for receiving survey invitations for purposes of collection, compilation of demographic and attitudinal information and length of data retention. If you have provided your phone number to Thought Metrics, you agree to that Thought Metrics and its clients may call and send text messages for project-related purposes. You may revise your consent at any time.`}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-primary w-auto hover:bg-secondary transition-all duration-300 ease-in-out rounded px-6 py-2 flex items-center gap-4"
              disabled={updateProfileMutation.isPending}
            >
              <label className="text-white text-nowrap font-medium cursor-pointer">
                {updateProfileMutation.isPending ? ui.buttons.saving : 'Saved'}
              </label>
              <ArrowRed className="fill-current text-white" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfilePage;
