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
import { LoaderOverlay } from '@ui/atoms/loader';
import { toast } from 'sonner';
import type { UpdateProfileData } from '@/core/types/user.type';
import { ROUTES } from '@/routes/routeConfig';

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
      };

      await updateProfileMutation.mutateAsync(updateData);

      // Redirect to survey page after successful update
      /* NOTE: Issues need to fix */
      window.location.href = ROUTES.SURVEY_PAGE;
    } catch (error) {
      console.error('Update profile error:', error);
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
              {ui.pageTitle || 'Manage Profile'}
            </h1>
            {/* <a
              href="#"
              className="text-black font-medium hover:font-semibold underline text-sm"
            >
              Add/Manage Children
            </a> */}
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
              {/* Gender */}
              <SelectAtom
                id="gender"
                name="gender"
                label={ui.fieldLabels.gender}
                value={formData.gender}
                onChange={handleInputChange}
                options={genders}
                error={errors.gender}
                placeholder="Select gender"
              />
              {/* Location Fields */}
              <TextInputAtom
                id="doorNumberOrStreetName"
                name="location.doorNumberOrStreetName"
                label={ui.fieldLabels.doorNumberOrStreetName}
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
                label={ui.fieldLabels.city}
                value={formData.location.city}
                onChange={(e) => updateField('location.city', e.target.value)}
                error={errors['location.city']}
                required
              />
              <TextInputAtom
                id="district"
                name="location.district"
                label={ui.fieldLabels.district}
                value={formData.location.district}
                onChange={(e) =>
                  updateField('location.district', e.target.value)
                }
                error={errors['location.district']}
              />
              <SelectAtom
                id="state"
                name="location.state"
                label={ui.fieldLabels.state}
                value={formData.location.state}
                onChange={(e) => updateField('location.state', e.target.value)}
                options={states}
                error={errors['location.state']}
                required
                placeholder="Select state"
              />
              <SelectAtom
                id="countryOrRegion"
                name="location.countryOrRegion"
                label={ui.fieldLabels.countryOrRegion}
                value={formData.location.countryOrRegion}
                onChange={(e) =>
                  updateField('location.countryOrRegion', e.target.value)
                }
                options={countries}
                error={errors['location.countryOrRegion']}
                required
                placeholder="Select country/region"
              />
              <TextInputAtom
                id="zipCode"
                name="location.zipCode"
                label={ui.fieldLabels.zipCode}
                value={formData.location.zipCode}
                onChange={(e) =>
                  updateField('location.zipCode', e.target.value)
                }
                error={errors['location.zipCode']}
                required
                placeholder="Enter ZIP/PIN code"
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
                {ui.fieldLabels.dateOfBirth}
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

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-primary w-auto hover:bg-secondary transition-all duration-300 ease-in-out rounded px-6 py-2 flex items-center gap-4"
              disabled={updateProfileMutation.isPending}
            >
              <label className="text-white text-nowrap font-medium cursor-pointer">
                {updateProfileMutation.isPending
                  ? ui.buttons?.saving || 'Saving...'
                  : ui.buttons?.save || 'Save Changes'}
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
