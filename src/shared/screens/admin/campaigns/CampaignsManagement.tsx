// src/shared/screens/admin/campaigns/CampaignsManagement.tsx

import React, { useState } from 'react';
import { Copy, Pencil, X } from 'lucide-react';
import { toast } from 'sonner';
import AdminRouteGuard from '@/shared/components/guards/AdminRouteGuard';
import AdminSidebar from '@/shared/components/admin/AdminSidebar';
import { LoaderUI } from '@/shared/ui/atoms/loader/LoaderUI';
import { useTrackingLinks, useTrackingLinkById } from '@/core/hooks/queries/analytics/index.queries';
import type { TrackingLink } from '@/services/api/tracking-link.service';

function formatDate(d?: string | null): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const CampaignDetailPanel: React.FC<{ link: TrackingLink }> = ({ link }) => {
  const visitors = link.stats?.uniqueVisitors ?? 0;
  const sessions = link.stats?.totalSessions ?? 0;
  const pageViews = link.stats?.pageViews ?? 0;
  const clicks = link.stats?.totalClicks ?? 0;
  const registrations = link.stats?.registrations ?? 0;
  const conversionPct = visitors > 0 ? ((registrations / visitors) * 100).toFixed(1) : '0.0';
  const conversionNum = parseFloat(conversionPct);
  const conversionColor =
    conversionNum >= 10 ? 'text-green-600' : conversionNum >= 5 ? 'text-amber-500' : 'text-gray-400';

  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text).then(() => toast.success('Copied!'));
  };

  const utmFields = [
    { label: 'UTM Source', value: link.utmSource },
    { label: 'UTM Medium', value: link.utmMedium },
    { label: 'UTM Campaign', value: link.utmCampaign },
    { label: 'UTM Term', value: link.utmTerm },
    { label: 'UTM Content', value: link.utmContent },
  ];

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          { label: 'Unique Visitors', value: visitors },
          { label: 'Sessions', value: sessions },
          { label: 'Page Views', value: pageViews },
          { label: 'Clicks', value: clicks },
          { label: 'Registrations', value: registrations },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className={`text-xl font-bold ${conversionColor}`}>{conversionPct}%</div>
          <div className="text-xs text-gray-500 mt-0.5">Conversion</div>
        </div>
      </div>

      {/* UTM & Link details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
        {utmFields.map((f) => (
          <div key={f.label} className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-500">{f.label}</span>
            <span className="font-medium text-gray-800">{f.value || '—'}</span>
          </div>
        ))}
        <div className="flex justify-between border-b border-gray-100 pb-2 items-center">
          <span className="text-gray-500">Short Code</span>
          <div className="flex items-center gap-1.5">
            <code className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">{link.shortCode}</code>
            <button onClick={() => copyToClipboard(link.shortCode)} className="text-gray-400 hover:text-gray-600">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-2 items-center">
          <span className="text-gray-500">Tracking URL</span>
          <div className="flex items-center gap-1.5 max-w-[240px]">
            <span className="text-gray-800 truncate text-xs">{link.fullTrackingUrl}</span>
            <button onClick={() => copyToClipboard(link.fullTrackingUrl)} className="flex-shrink-0 text-gray-400 hover:text-gray-600">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-2 items-center">
          <span className="text-gray-500">Destination URL</span>
          <div className="flex items-center gap-1.5 max-w-[240px]">
            <span className="text-gray-800 truncate text-xs">{link.destinationUrl}</span>
            <button onClick={() => copyToClipboard(link.destinationUrl)} className="flex-shrink-0 text-gray-400 hover:text-gray-600">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="text-gray-500">Allocated Survey</span>
          <span className="font-medium text-gray-800">{link.allocatedSurveyId || '—'}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="text-gray-500">Post-signup redirect</span>
          <span className="font-medium text-gray-800">{link.postSignupRedirect || '—'}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="text-gray-500">Redirect to signup</span>
          <span className="font-medium text-gray-800">{link.redirectToSignup ? 'Yes' : 'No'}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="text-gray-500">Status</span>
          <span className={`font-medium ${link.isActive ? 'text-green-600' : 'text-gray-400'}`}>
            {link.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="text-gray-500">Created</span>
          <span className="font-medium text-gray-800">{formatDate(link.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export const CampaignsManagementContent: React.FC<{ SidebarComponent?: React.ComponentType }> = ({ SidebarComponent = AdminSidebar }) => {
  const { data: linksResponse, isLoading: linksLoading } = useTrackingLinks();
  const links: TrackingLink[] = linksResponse?.data ?? [];

  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const { data: linkDetailResponse, isLoading: linkDetailLoading } = useTrackingLinkById(selectedLinkId ?? '');
  const linkDetail: TrackingLink | null = linkDetailResponse?.data ?? null;

  const copyLink = (url: string) => {
    void navigator.clipboard.writeText(url).then(() => toast.success('Link copied!'));
  };

  const formatNumber = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <div className="h-full flex bg-gray-50 text-text-dark">
      <SidebarComponent />

      <main className="h-full overflow-y-scroll flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Campaigns</h1>
              <p className="text-gray-600">Manage tracking links and campaign performance</p>
            </div>
            <a
              href="/admin/create-tracking-link"
              className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              + New Campaign
            </a>
          </div>

          {linksLoading && (
            <div className="flex justify-center py-20">
              <LoaderUI message="Loading campaigns…" />
            </div>
          )}

          {!linksLoading && links.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500 mb-3">No campaigns found.</p>
              <a
                href="/admin/create-tracking-link"
                className="text-primary font-medium hover:underline"
              >
                Create one now
              </a>
            </div>
          )}

          {!linksLoading && links.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Campaign Name</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">UTM Source</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Short Code</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-700">Visitors</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-700">Registrations</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-700">Conversion</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {links.map((link) => {
                      const visitors = link.stats?.uniqueVisitors ?? 0;
                      const registrations = link.stats?.registrations ?? 0;
                      const conversionPct =
                        visitors > 0
                          ? ((registrations / visitors) * 100).toFixed(1)
                          : '0.0';
                      const conversionNum = parseFloat(conversionPct);
                      const conversionColor =
                        conversionNum >= 10
                          ? 'text-green-600'
                          : conversionNum >= 5
                          ? 'text-amber-500'
                          : 'text-gray-500';

                      return (
                        <React.Fragment key={link.id}>
                          <tr
                            className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                              selectedLinkId === link.id ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => setSelectedLinkId(selectedLinkId === link.id ? null : link.id)}
                          >
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-900">{link.name}</div>
                              {link.utmCampaign && (
                                <div className="text-xs text-gray-400 mt-0.5">{link.utmCampaign}</div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {link.utmSource || '-'}
                            </td>
                            <td className="px-4 py-3">
                              <code className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono text-gray-700">
                                {link.shortCode}
                              </code>
                            </td>
                            <td className="px-4 py-3 text-right text-gray-600">
                              {formatNumber(visitors)}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-600">
                              {formatNumber(registrations)}
                            </td>
                            <td className={`px-4 py-3 text-right font-medium ${conversionColor}`}>
                              {conversionPct}%
                            </td>
                            <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => copyLink(link.fullTrackingUrl)}
                                  title="Copy link"
                                  className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <a
                                  href={`/admin/edit-tracking-link/${link.id}`}
                                  title="Edit campaign"
                                  className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                  <Pencil className="w-4 h-4" />
                                </a>
                              </div>
                            </td>
                          </tr>

                          {/* Inline detail panel */}
                          {selectedLinkId === link.id && (
                            <tr>
                              <td colSpan={7} className="px-0 py-0">
                                <div className="bg-white border-t border-b border-blue-100 px-6 py-6">
                                  <div className="flex items-center justify-between mb-5">
                                    <h2 className="font-semibold text-lg text-gray-900">
                                      {link.name} — Details
                                    </h2>
                                    <div className="flex gap-2">
                                      <a
                                        href={`/admin/edit-tracking-link/${link.id}`}
                                        className="px-3 py-1.5 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
                                      >
                                        Edit
                                      </a>
                                      <button
                                        onClick={() => copyLink(link.fullTrackingUrl)}
                                        className="px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                      >
                                        Copy Link
                                      </button>
                                      <button
                                        onClick={() => setSelectedLinkId(null)}
                                        className="p-1.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                  {linkDetailLoading ? (
                                    <LoaderUI message="Loading campaign details…" />
                                  ) : linkDetail ? (
                                    <CampaignDetailPanel link={linkDetail} />
                                  ) : null}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export const CampaignsManagement: React.FC = () => (
  <AdminRouteGuard>
    <CampaignsManagementContent />
  </AdminRouteGuard>
);

export default CampaignsManagement;
