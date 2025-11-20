import React, { useState, useEffect } from 'react';
import { editProfileFormConstant } from '@constants/page-constants/auth-constant';
import {
  CheckboxOutlineGroupAtom,
  PhoneInputAtom,
  SelectAtom,
  TextInputAtom,
} from '@ui/atoms/custom-input';
import { ArrowRed } from '@/assets';
import { useProfileQuery } from '@hooks/queries/use-profile.query';
import { useUpdateProfileMutation } from '@hooks/mutations/use-update-profile.mutation';
import { toast } from 'sonner';
import type { UpdateProfileData } from '@/core/types/user.type';
import { ROUTES } from '@/routes/routeConfig';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider } from '@/shared/providers/auth-provider';
import { useLanguage } from '@/core/hooks/use-language';
import { LanguageToggle } from '@/shared/ui/molecules/language-toggle';

// Destructure constants
const {
  participationOptions,
  genders,
  months,
  states,
  countries,
  countryCodes,
  defaultCountryCode,
  validationMessages,
  emailRegex,
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
  const { translations } = useLanguage();

  // Translated participation options
  const translatedParticipationOptions = React.useMemo(() => {
    return participationOptions.map(option => ({
      ...option,
      label: translations.participationOptions[option.id as keyof typeof translations.participationOptions] || option.label,
    }));
  }, [translations]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    location: {
      doorNumberOrStreetName: '',
      city: '',
      district: '',
      state: '',
      countryOrRegion: 'India',
      zipCode: '',
    },
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
    paymentMethod: undefined as 'upi' | 'bank' | 'skip' | undefined,
    payment: {
      upiId: '',
      upiMobileNumber: '',
      upiFullName: '',
      bankAccountNumber: '',
      bankIfscCode: '',
      bankAccountHolderName: '',
    },
  });

  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form with existing profile data
  useEffect(() => {
    if (profile) {
      // Parse dateOfBirth from Date object to {month, day, year}
      let dobParts = { month: '', day: '', year: '' };
      if (profile.profile?.dateOfBirth) {
        const dob = new Date(profile.profile.dateOfBirth);
        dobParts = {
          month: String(dob.getMonth() + 1).padStart(2, '0'),
          day: String(dob.getDate()).padStart(2, '0'),
          year: String(dob.getFullYear()),
        };
      }

      // Determine payment method from existing data
      let paymentMethod: 'upi' | 'bank' | 'skip' | undefined = undefined;
      if (profile.paymentInfo?.upiId || profile.paymentInfo?.upiMobileNumber) {
        paymentMethod = 'upi';
      } else if (profile.paymentInfo?.bankAccountNumber) {
        paymentMethod = 'bank';
      }

      setFormData((prev) => ({
        ...prev,
        firstName: profile.profile?.firstName ?? '',
        lastName: profile.profile?.lastName ?? '',
        email: profile.email ?? '',
        phone: profile.profile?.phone ?? '',
        gender: profile.profile?.gender ?? '',
        location: {
          doorNumberOrStreetName:
            profile.profile?.location?.doorNumberOrStreetName ?? '',
          city: profile.profile?.location?.city ?? '',
          district: profile.profile?.location?.district ?? '',
          state: profile.profile?.location?.state ?? '',
          countryOrRegion:
            profile.profile?.location?.countryOrRegion ?? 'India',
          zipCode: profile.profile?.location?.zipCode ?? '',
        },
        dateOfBirth: dobParts,
        participationPreferences:
          profile.respondentInfo?.participationPreferences ?? [],
        termsAccepted: profile.respondentInfo?.termsAccepted ?? true,
        privacyAccepted: profile.respondentInfo?.privacyAccepted ?? true,
        paymentMethod,
        payment: {
          upiId: profile.paymentInfo?.upiId ?? '',
          upiMobileNumber: profile.paymentInfo?.upiMobileNumber ?? '',
          upiFullName: profile.paymentInfo?.upiFullName ?? '',
          bankAccountNumber: profile.paymentInfo?.bankAccountNumber ?? '',
          bankIfscCode: profile.paymentInfo?.bankIfscCode ?? '',
          bankAccountHolderName: profile.paymentInfo?.bankAccountHolderName ?? '',
        },
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
    if (!formData.location.doorNumberOrStreetName?.trim())
      newErrors['location.doorNumberOrStreetName'] =
        validationMessages.doorNumberOrStreetName;
    if (!formData.location.city?.trim())
      newErrors['location.city'] = validationMessages.city;
    if (!formData.location.state?.trim())
      newErrors['location.state'] = validationMessages.state;
    if (!formData.location.countryOrRegion?.trim())
      newErrors['location.countryOrRegion'] =
        validationMessages.countryOrRegion;
    if (!formData.location.zipCode?.trim())
      newErrors['location.zipCode'] = validationMessages.zipCode;
    if (!formData.gender?.trim()) newErrors.gender = validationMessages.gender;
    // if (
    //   !formData.dateOfBirth.month ||
    //   !formData.dateOfBirth.day ||
    //   !formData.dateOfBirth.year
    // ) {
    //   newErrors.dateOfBirth = validationMessages.dateOfBirth;
    // }

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
      // Convert dateOfBirth from {month, day, year} to Date object
      let dateOfBirth: Date | undefined;
      if (
        formData.dateOfBirth.month &&
        formData.dateOfBirth.day &&
        formData.dateOfBirth.year
      ) {
        dateOfBirth = new Date(
          parseInt(formData.dateOfBirth.year),
          parseInt(formData.dateOfBirth.month) - 1, // Month is 0-indexed
          parseInt(formData.dateOfBirth.day)
        );
      }

      const updateData: UpdateProfileData = {
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          gender: formData.gender,
          dateOfBirth,
          location: formData.location,
        },
        respondentInfo: {
          participationPreferences: formData.participationPreferences,
          termsAccepted: formData.termsAccepted,
          privacyAccepted: formData.privacyAccepted,
        },
        paymentInfo:
          formData.paymentMethod && formData.paymentMethod !== 'skip'
            ? formData.payment
            : undefined,
      };

      await updateProfileMutation.mutateAsync(updateData);

      // Redirect to survey page after successful update
      /* NOTE: Issues need to fix */
      window.location.href = ROUTES.SURVEY_BOARDS;
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  // ApiLoadingIndicator handles loading states automatically
  if (isLoadingProfile) {
    return null; // ApiLoadingIndicator will show loading overlay
  }

  return (
    <>
      <div className="common-component bg-white text-black h-full overflow-y-scroll overflow-x-hidden">
        <div className="common-container px-6 py-8 md:px-24 md:py-12 justify-center block! flex-col max-w-(--breakpoint-2xl)!">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-medium tracking-tighter text-gray-900">
                {translations.profile.editProfile}
              </h1>
              <LanguageToggle variant="inline" />
            </div>
            {/* <a
              href="#"
              className="text-black font-medium hover:font-semibold underline text-sm"
            >
              Add/Manage Children
            </a> */}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 pb-8">
            <p className="text-xl font-medium tracking-tighter mb-4">
              {translations.profile.requiredFields}
            </p>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
              <TextInputAtom
                id="firstName"
                name="firstName"
                label={translations.profile.firstName}
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                required
              />
              <TextInputAtom
                id="lastName"
                name="lastName"
                label={translations.profile.lastName}
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                required
              />
              <TextInputAtom
                id="email"
                name="email"
                label={translations.profile.email}
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
              />
              <PhoneInputAtom
                id="phone"
                name="phone"
                label={`${translations.profile.phone} (${translations.profile.optional})`}
                value={formData.phone}
                onChange={handleInputChange}
                countryCode={countryCode}
                onCountryCodeChange={handleCountryCodeChange}
                countryCodes={countryCodes}
              />
              {/* Gender */}
              <SelectAtom
                id="gender"
                name="gender"
                label={`${translations.profile.gender} (${translations.profile.optional})`}
                value={formData.gender}
                onChange={handleInputChange}
                options={genders}
                error={errors.gender}
                placeholder={translations.profile.selectGender}
              />
              {/* Location Fields */}
              <TextInputAtom
                id="doorNumberOrStreetName"
                name="location.doorNumberOrStreetName"
                label={translations.profile.doorNumberOrStreetName}
                value={formData.location.doorNumberOrStreetName}
                onChange={(e) =>
                  updateField('location.doorNumberOrStreetName', e.target.value)
                }
                error={errors['location.doorNumberOrStreetName']}
                required
              />
              <TextInputAtom
                id="city"
                name="location.city"
                label={translations.profile.city}
                value={formData.location.city}
                onChange={(e) => updateField('location.city', e.target.value)}
                error={errors['location.city']}
                required
              />
              <TextInputAtom
                id="district"
                name="location.district"
                label={`${translations.profile.district} (${translations.profile.optional})`}
                value={formData.location.district}
                onChange={(e) =>
                  updateField('location.district', e.target.value)
                }
                error={errors['location.district']}
              />
              <SelectAtom
                id="state"
                name="location.state"
                label={translations.profile.state}
                value={formData.location.state}
                onChange={(e) => updateField('location.state', e.target.value)}
                options={states}
                error={errors['location.state']}
                required
                placeholder={translations.profile.selectState}
              />
              <SelectAtom
                id="countryOrRegion"
                name="location.countryOrRegion"
                label={translations.profile.country}
                value={formData.location.countryOrRegion}
                onChange={(e) =>
                  updateField('location.countryOrRegion', e.target.value)
                }
                options={countries}
                error={errors['location.countryOrRegion']}
                required
                placeholder={translations.profile.selectCountry}
              />
              <TextInputAtom
                id="zipCode"
                name="location.zipCode"
                label={translations.profile.zipCode}
                value={formData.location.zipCode}
                onChange={(e) =>
                  updateField('location.zipCode', e.target.value)
                }
                error={errors['location.zipCode']}
                required
                placeholder={translations.profile.zipCode}
              />
              {/* Password Fields (Optional) */}
              {/* <TextInputAtom
                id="password"
                name="password"
                label="Password (Optional)"
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
              /> */}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                {`${translations.profile.dateOfBirth} (${translations.profile.optional})`}
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
                  placeholder={translations.profile.selectMonth}
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
                  placeholder={translations.profile.selectDay}
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
                  placeholder={translations.profile.selectYear}
                />
              </div>
              {errors.dateOfBirth && (
                <p className="text-sm text-primary">{errors.dateOfBirth}</p>
              )}
            </div>

            {/* Participation Preferences */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {translations.profile.participationPreferencesTitle}
              </h2>
              <p className="text-gray-600 mb-6">{translations.profile.participationPreferencesDescription}</p>

              <CheckboxOutlineGroupAtom
                label=""
                options={translatedParticipationOptions}
                selectedValues={formData.participationPreferences}
                onChange={handleParticipationChange}
                columns={1}
              />
            </div>

            {/* Payment Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {translations.auth.signup.payment.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {translations.auth.signup.payment.description}
              </p>

              <div className="space-y-4">
                <SelectAtom
                  id="paymentMethod"
                  name="paymentMethod"
                  label={translations.auth.signup.payment.methodLabel}
                  value={formData.paymentMethod ?? ''}
                  onChange={(e) =>
                    updateField(
                      'paymentMethod',
                      e.target.value as 'upi' | 'bank' | 'skip'
                    )
                  }
                  options={[
                    {
                      value: 'upi',
                      label: translations.auth.signup.payment.upiPayment,
                    },
                    {
                      value: 'bank',
                      label: translations.auth.signup.payment.bankTransfer,
                    },
                    {
                      value: 'skip',
                      label: translations.auth.signup.payment.skipForNow,
                    },
                  ]}
                  placeholder={translations.auth.signup.payment.methodLabel}
                />

                {/* UPI Payment Fields */}
                {formData.paymentMethod === 'upi' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <TextInputAtom
                      id="upiId"
                      name="payment.upiId"
                      label={translations.auth.signup.payment.upi.upiIdLabel}
                      value={formData.payment.upiId}
                      onChange={(e) =>
                        updateField('payment.upiId', e.target.value)
                      }
                      placeholder={
                        translations.auth.signup.payment.upi.upiIdPlaceholder
                      }
                    />
                    <TextInputAtom
                      id="upiMobileNumber"
                      name="payment.upiMobileNumber"
                      label={translations.auth.signup.payment.upi.mobileLabel}
                      value={formData.payment.upiMobileNumber}
                      onChange={(e) =>
                        updateField('payment.upiMobileNumber', e.target.value)
                      }
                      placeholder={
                        translations.auth.signup.payment.upi.mobilePlaceholder
                      }
                    />
                    <TextInputAtom
                      id="upiFullName"
                      name="payment.upiFullName"
                      label={translations.auth.signup.payment.upi.fullNameLabel}
                      value={formData.payment.upiFullName}
                      onChange={(e) =>
                        updateField('payment.upiFullName', e.target.value)
                      }
                      placeholder={
                        translations.auth.signup.payment.upi.fullNameLabel
                      }
                    />
                  </div>
                )}

                {/* Bank Transfer Fields */}
                {formData.paymentMethod === 'bank' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <TextInputAtom
                      id="bankAccountNumber"
                      name="payment.bankAccountNumber"
                      label={
                        translations.auth.signup.payment.bank.accountNumberLabel
                      }
                      value={formData.payment.bankAccountNumber}
                      onChange={(e) =>
                        updateField('payment.bankAccountNumber', e.target.value)
                      }
                      placeholder={
                        translations.auth.signup.payment.bank.accountNumberLabel
                      }
                    />
                    <TextInputAtom
                      id="bankIfscCode"
                      name="payment.bankIfscCode"
                      label={translations.auth.signup.payment.bank.ifscLabel}
                      value={formData.payment.bankIfscCode}
                      onChange={(e) =>
                        updateField('payment.bankIfscCode', e.target.value)
                      }
                      placeholder={
                        translations.auth.signup.payment.bank.ifscLabel
                      }
                    />
                    <TextInputAtom
                      id="bankAccountHolderName"
                      name="payment.bankAccountHolderName"
                      label={
                        translations.auth.signup.payment.bank.holderNameLabel
                      }
                      value={formData.payment.bankAccountHolderName}
                      onChange={(e) =>
                        updateField(
                          'payment.bankAccountHolderName',
                          e.target.value
                        )
                      }
                      placeholder={
                        translations.auth.signup.payment.bank.holderNameLabel
                      }
                    />
                  </div>
                )}

                {/* Skip Message */}
                {formData.paymentMethod === 'skip' && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">
                      {translations.auth.signup.payment.skipMessage}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-primary w-auto hover:bg-secondary transition-all duration-300 ease-in-out rounded px-6 py-2 flex items-center gap-4"
              disabled={updateProfileMutation.isPending}
            >
              <label className="text-white text-nowrap font-medium cursor-pointer">
                {updateProfileMutation.isPending
                  ? translations.profile.saving
                  : translations.profile.saveChanges}
              </label>
              <ArrowRed className="fill-current text-white" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

const EditProfileWrapper: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <EditProfilePage />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default EditProfileWrapper;
