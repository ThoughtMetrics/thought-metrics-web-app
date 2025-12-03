import React, { useState } from 'react';
import {
  useCreateTrackingLink,
  useTrackingLinks,
} from '@/core/hooks/queries/analytics/index.queries';
import type { CreateTrackingLinkData } from '@/services/api/tracking-link.service';
import CustomButtonAtom from '@/shared/ui/atoms/custom-button';
import { TextInputAtom, SelectAtom } from '@/shared/ui/atoms/custom-input';

const TrackingLinkForm: React.FC = () => {
  const createMutation = useCreateTrackingLink();
  const { data: linksResponse, isLoading: linksLoading } = useTrackingLinks();

  const [formData, setFormData] = useState<CreateTrackingLinkData>({
    name: '',
    destinationUrl: '/survey_campaign',
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmTerm: '',
    utmContent: '',
    postSignupRedirect: '',
    redirectToSignup: false,
    allocatedSurveyId: '',
  });

  const [createdLink, setCreatedLink] = useState<{
    fullTrackingUrl: string;
    shortCode: string;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

    // Clean up empty strings
    const submitData: any = { ...formData };
    Object.keys(submitData).forEach((key) => {
      if (submitData[key] === '') {
        delete submitData[key];
      }
    });

    createMutation.mutate(submitData, {
      onSuccess: (response) => {
        if (response.data) {
          setCreatedLink({
            fullTrackingUrl: response.data.fullTrackingUrl,
            shortCode: response.data.shortCode,
          });
          // Reset form
          setFormData({
            name: '',
            destinationUrl: '/survey_campaign',
            utmSource: '',
            utmMedium: '',
            utmCampaign: '',
            utmTerm: '',
            utmContent: '',
            postSignupRedirect: '',
            redirectToSignup: false,
            allocatedSurveyId: '',
          });
        }
      },
    });
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const links = linksResponse?.data || [];

  return (
    <div className="h-full overflow-y-scroll bg-gray-50 py-12 px-4 text-text-dark">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Create Tracking Link
        </h1>

        {/* Link Creation Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
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
              value={formData.destinationUrl}
              onChange={handleInputChange}
              placeholder="/survey_campaign or / or /advocate-landing"
              helperText="Endpoint path where the link redirects to (e.g., /survey_campaign, /, /advocate-landing)"
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
                { value: '/survey-campaign', label: 'Onboarding Survey (/survey-campaign)' },
                { value: '/survey-boards', label: 'Survey Boards (/survey-boards)' },
                { value: '/dashboard', label: 'User Dashboard (/dashboard)' },
              ]}
              helperText="Where user goes after signup completion (only if redirected from destination page to signup). Leave as 'None' to use default behavior."
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">How Tracking Links Work:</h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li><strong>User clicks tracking link</strong> → Redirects to <strong>Destination URL</strong> with tracking params</li>
                <li><strong>Destination page</strong> (e.g., /survey_campaign) shows:
                  <ul className="ml-6 mt-1 list-disc list-inside">
                    <li>Not logged in → "Register Now" button → /sign-up</li>
                    <li>Logged in → "Take Survey" button → /surveys/[allocated_survey_id] or /survey-boards</li>
                  </ul>
                </li>
                <li><strong>After signup</strong> → Redirects to:
                  <ul className="ml-6 mt-1 list-disc list-inside">
                    <li>/surveys/[allocated_survey_id] if provided</li>
                    <li>Post-Signup Redirect path if specified</li>
                    <li>/survey-boards (default)</li>
                  </ul>
                </li>
              </ol>
            </div>

            <div className="flex gap-4">
              <CustomButtonAtom
                type="submit"
                label={createMutation.isPending ? 'Creating...' : 'Create Tracking Link'}
                className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                disabled={createMutation.isPending}
                loading={createMutation.isPending}
              />
              <button
                type="button"
                onClick={() => (window.location.href = '/admin/analytics')}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                View All Links
              </button>
            </div>
          </form>

          {/* Success Message */}
          {createdLink && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-green-800 font-semibold mb-2">
                ✅ Link Created Successfully!
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-green-700 font-medium">Tracking URL:</p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 px-3 py-2 bg-white border border-green-300 rounded text-sm text-green-900">
                      {createdLink.fullTrackingUrl}
                    </code>
                    <button
                      onClick={() => handleCopyLink(createdLink.fullTrackingUrl)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-green-700 font-medium">Short Code:</p>
                  <code className="block mt-1 px-3 py-2 bg-white border border-green-300 rounded text-sm text-green-900">
                    {createdLink.shortCode}
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Tracking Links */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Tracking Links
          </h2>
          <div className="space-y-4">
            {linksLoading ? (
              <p className="text-gray-500 text-center py-8">Loading links...</p>
            ) : links.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No links created yet</p>
            ) : (
              links.slice(0, 10).map((link) => (
                <div
                  key={link.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{link.name}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        link.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {link.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    {link.utmSource && (
                      <p>
                        <strong>Source:</strong> {link.utmSource}
                      </p>
                    )}
                    {link.utmMedium && (
                      <p>
                        <strong>Medium:</strong> {link.utmMedium}
                      </p>
                    )}
                    {link.utmCampaign && (
                      <p>
                        <strong>Campaign:</strong> {link.utmCampaign}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <code className="flex-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-800">
                      {link.fullTrackingUrl}
                    </code>
                    <button
                      onClick={() => handleCopyLink(link.fullTrackingUrl)}
                      className="px-3 py-1 bg-primary text-white rounded text-xs hover:bg-primary/90"
                    >
                      Copy
                    </button>
                  </div>
                  {link.stats && (
                    <div className="flex gap-4 text-xs text-gray-500 mt-2">
                      <span>👥 {link.stats.uniqueVisitors || 0} visitors</span>
                      <span>✅ {link.stats.registrations || 0} signups</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingLinkForm;
