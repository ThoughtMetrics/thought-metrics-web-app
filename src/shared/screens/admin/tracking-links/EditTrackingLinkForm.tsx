import React, { useState, useEffect } from 'react';
import {
  useTrackingLinkById,
  useUpdateTrackingLink,
} from '@/core/hooks/queries/analytics/index.queries';
import type { CreateTrackingLinkData } from '@/services/api/tracking-link.service';
import CustomButtonAtom from '@/shared/ui/atoms/custom-button';
import { TextInputAtom, SelectAtom } from '@/shared/ui/atoms/custom-input';
import { Loader2, ArrowLeft } from 'lucide-react';
import AdminSidebar from '@/shared/components/admin/AdminSidebar';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider } from '@/shared/providers/auth-provider';

const EditTrackingLinkFormContent: React.FC = () => {
  // Get tracking link ID from URL
  const getLinkIdFromUrl = () => {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1]; // Last part of URL is the ID
  };

  const [linkId] = useState<string>(getLinkIdFromUrl());
  const updateMutation = useUpdateTrackingLink();
  const { data: linkResponse, isLoading } = useTrackingLinkById(linkId || '');

  const [formData, setFormData] = useState<CreateTrackingLinkData>({
    name: '',
    destinationUrl: '',
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmTerm: '',
    utmContent: '',
    postSignupRedirect: '/survey-campaign',
    redirectToSignup: true,
    allocatedSurveyId: '',
  });

  // Populate form when data loads
  useEffect(() => {
    if (linkResponse?.data) {
      const link = linkResponse.data;
      setFormData({
        name: link.name || '',
        destinationUrl: link.destinationUrl || '',
        utmSource: link.utmSource || '',
        utmMedium: link.utmMedium || '',
        utmCampaign: link.utmCampaign || '',
        utmTerm: link.utmTerm || '',
        utmContent: link.utmContent || '',
        // Use exact values from backend, don't override with defaults
        postSignupRedirect: link.postSignupRedirect ?? '',
        redirectToSignup: link.redirectToSignup ?? false,
        allocatedSurveyId: link.allocatedSurveyId || '',
      });
    }
  }, [linkResponse]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!linkId) return;

    // Clean up empty strings
    const submitData: any = { ...formData };
    Object.keys(submitData).forEach((key) => {
      if (submitData[key] === '') {
        delete submitData[key];
      }
    });

    updateMutation.mutate(
      { id: linkId, data: submitData },
      {
        onSuccess: () => {
          // Redirect back to analytics page using Astro navigation
          window.location.href = '/admin/analytics';
        },
      }
    );
  };

  const handleBack = () => {
    window.location.href = '/admin/analytics';
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading tracking link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!linkResponse?.data) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Tracking link not found</p>
            <button
              onClick={handleBack}
              className="text-primary hover:underline"
            >
              Back to Analytics
            </button>
          </div>
        </div>
      </div>
    );
  }

  const link = linkResponse.data;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-y-scroll py-12 px-4 text-text-dark">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Analytics
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Tracking Link
            </h1>
            <p className="text-gray-600 mt-2">
              Short Code:{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">
                {link.shortCode}
              </code>
            </p>
          </div>

          {/* Edit Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <TextInputAtom
                id="name"
                name="name"
                label="Campaign Name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Email Campaign - January 2024"
                helperText="Internal name to identify this campaign"
                required
              />

              <TextInputAtom
                id="destinationUrl"
                name="destinationUrl"
                label="Destination URL"
                type="url"
                value={formData.destinationUrl}
                onChange={handleInputChange}
                helperText="Where the link redirects to"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInputAtom
                  id="utmSource"
                  name="utmSource"
                  label="UTM Source"
                  value={formData.utmSource || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., email, facebook, instagram"
                  helperText="Traffic source: email, social, search"
                />

                <TextInputAtom
                  id="utmMedium"
                  name="utmMedium"
                  label="UTM Medium"
                  value={formData.utmMedium || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., newsletter, paid_social, cpc"
                  helperText="Marketing medium"
                />
              </div>

              <TextInputAtom
                id="utmCampaign"
                name="utmCampaign"
                label="UTM Campaign"
                value={formData.utmCampaign || ''}
                onChange={handleInputChange}
                placeholder="e.g., summer_2024, product_launch"
                helperText="Campaign identifier"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInputAtom
                  id="utmTerm"
                  name="utmTerm"
                  label="UTM Term"
                  value={formData.utmTerm || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., survey panel, earn money"
                  helperText="Paid keywords (optional)"
                />

                <TextInputAtom
                  id="utmContent"
                  name="utmContent"
                  label="UTM Content"
                  value={formData.utmContent || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., banner_a, text_link_1"
                  helperText="Content variant (for A/B testing)"
                />
              </div>

              <TextInputAtom
                id="allocatedSurveyId"
                name="allocatedSurveyId"
                label="Allocated Survey ID (Optional)"
                value={formData.allocatedSurveyId || ''}
                onChange={handleInputChange}
                placeholder="e.g., TM-AM001, TM-LF002"
                helperText="If specified, user will be redirected to this specific survey after signup. Leave empty to redirect to survey-boards."
              />

              <SelectAtom
                id="postSignupRedirect"
                name="postSignupRedirect"
                label="Post-Signup Redirect (Optional)"
                value={formData.postSignupRedirect || ''}
                onChange={handleInputChange}
                options={[
                  { value: '', label: 'None (uses default)' },
                  {
                    value: '/survey-campaign',
                    label: 'Onboarding Survey (/survey-campaign)',
                  },
                  {
                    value: '/survey-boards',
                    label: 'Survey Boards (/survey-boards)',
                  },
                  { value: '/dashboard', label: 'User Dashboard (/dashboard)' },
                ]}
                helperText="Where user goes after signup completion (only if redirected from destination page to signup). Leave as 'None' to use default behavior."
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">
                  How Tracking Links Work:
                </h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>
                    <strong>User clicks tracking link</strong> → Redirects to{' '}
                    <strong>Destination URL</strong> with tracking params
                  </li>
                  <li>
                    <strong>Destination page</strong> (e.g., /survey_campaign)
                    shows:
                    <ul className="ml-6 mt-1 list-disc list-inside">
                      <li>Not logged in → "Register Now" button → /sign-up</li>
                      <li>
                        Logged in → "Take Survey" button →
                        /survey-campaign/[allocated_survey_id] or /survey-boards
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>After signup</strong> → Redirects to:
                    <ul className="ml-6 mt-1 list-disc list-inside">
                      <li>/survey-campaign/[allocated_survey_id] if provided</li>
                      <li>Post-Signup Redirect path if specified</li>
                      <li>/survey-boards (default)</li>
                    </ul>
                  </li>
                </ol>
              </div>

              <div className="flex gap-4 pt-4">
                <CustomButtonAtom
                  type="submit"
                  label={
                    updateMutation.isPending
                      ? 'Updating...'
                      : 'Update Tracking Link'
                  }
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  disabled={updateMutation.isPending}
                  loading={updateMutation.isPending}
                />
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Link Stats */}
            {link.stats && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Link Statistics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Unique Visitors</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {link.stats.uniqueVisitors || 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Registrations</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {link.stats.registrations || 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Page Views</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {link.stats.pageViews || 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(link.stats.uniqueVisitors ?? 0) > 0
                        ? (
                            ((link.stats.registrations ?? 0) /
                              (link.stats.uniqueVisitors ?? 0)) *
                            100
                          ).toFixed(1)
                        : '0.0'}
                      %
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrapper component with providers (similar to EditProfileWrapper)
const EditTrackingLinkFormWrapper: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <EditTrackingLinkFormContent />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default EditTrackingLinkFormWrapper;
