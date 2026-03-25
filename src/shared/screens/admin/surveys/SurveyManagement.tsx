// src/shared/screens/admin/surveys/SurveyManagement.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Copy, Pencil, X } from 'lucide-react';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';
import { toast } from 'sonner';
import AdminRouteGuard from '@/shared/components/guards/AdminRouteGuard';
import AdminSidebar from '@/shared/components/admin/AdminSidebar';
import { useAuth } from '@/shared/providers/auth-provider';
import { LoaderUI } from '@/shared/ui/atoms/loader/LoaderUI';
import { useAdminSurveysQuery } from '@/core/hooks/queries/survey-templates/index.queries';
import { useUpdateSurveyInstance, useDeleteSurveyInstance } from '@/core/hooks/mutations/survey-template.mutations';
import type { ISurvey } from '@/core/types/survey.type';
import EditSurveyModal from './components/EditSurveyModal';
import {
  SurveyAnalyticsDetailPanel,
  SurveyDownloadModal,
} from '@/shared/screens/admin/survey-analytics-dashboard';
import { useTrackingLinks, useTrackingLinkById } from '@/core/hooks/queries/analytics/index.queries';
import type { TrackingLink } from '@/services/api/tracking-link.service';

type HubTab = 'campaigns' | 'templates';
type StatusTab = 'all' | 'published' | 'draft' | 'archived';

const STATUS_BADGE: Record<string, string> = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-amber-100 text-amber-700',
  expired: 'bg-red-100 text-red-700',
  archived: 'bg-gray-100 text-gray-600',
};

const LAYOUT_BADGE: Record<string, string> = {
  paginated: 'bg-gray-100 text-gray-600',
  list: 'bg-blue-50 text-blue-600',
};

const PUBLIC_SITE_URL =
  typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.host}`
    : '';

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

const SurveyManagementContent: React.FC = () => {
  const { isFieldIncharge, isAdmin } = useAuth();
  const updateSurvey = useUpdateSurveyInstance();
  const deleteSurvey = useDeleteSurveyInstance();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState<ISurvey | null>(null);
  const { data: linksResponse, isLoading: linksLoading } = useTrackingLinks();
  const links: TrackingLink[] = linksResponse?.data ?? [];

  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const { data: linkDetailResponse, isLoading: linkDetailLoading } = useTrackingLinkById(selectedLinkId ?? '');
  const linkDetail: TrackingLink | null = linkDetailResponse?.data ?? null;

  // Hub
  const [activeHubTab, setActiveHubTab] = useState<HubTab>(isFieldIncharge ? 'templates' : 'campaigns');

  // Templates tab pagination + filters
  const [statusTab, setStatusTab] = useState<StatusTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [surveyPage, setSurveyPage] = useState(1);
  const [surveyLimit, setSurveyLimit] = useState(10);
  const [selectedSurvey, setSelectedSurvey] = useState<ISurvey | null>(null);
  const [pdfTrigger, setPdfTrigger] = useState(0);
  const [downloadSurvey, setDownloadSurvey] = useState<ISurvey | null>(null);
  const [editingSurvey, setEditingSurvey] = useState<ISurvey | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search input → reset to page 1 when search changes
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setSurveyPage(1);
    }, 400);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  const surveyQueryParams = {
    ...(isFieldIncharge ? { type: 'agent' } : {}),
    ...(statusTab !== 'all' ? { status: statusTab } : {}),
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    page: surveyPage,
    limit: surveyLimit,
  };

  const { data, isLoading, isError } = useAdminSurveysQuery(surveyQueryParams);

  const allSurveys: ISurvey[] = data?.data ?? [];
  const surveyTotal: number = (data as any)?.total ?? 0;
  const surveyTotalPages = Math.max(1, Math.ceil(surveyTotal / surveyLimit));

  const filteredSurveys = allSurveys;

  // Close kebab menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openMenuId && menuRef.current[openMenuId]) {
        if (!menuRef.current[openMenuId]?.contains(e.target as Node)) {
          setOpenMenuId(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  const handleArchive = async (survey: ISurvey) => {
    if (!window.confirm(`Archive survey "${survey.label}"?`)) return;
    await updateSurvey.mutateAsync({ id: survey.surveyId!, data: { status: 'archived' } });
  };

  const handleUnarchive = async (survey: ISurvey) => {
    if (!window.confirm(`Unarchive survey "${survey.label}"? It will be restored as a draft.`)) return;
    await updateSurvey.mutateAsync({ id: survey.surveyId!, data: { status: 'draft' } });
  };

  const handleCopyLink = (survey: ISurvey) => {
    const link = `${PUBLIC_SITE_URL}/survey-boards/${survey.surveyId}`;
    void navigator.clipboard.writeText(link).then(() => toast.success('Link copied!'));
  };

  const handleDelete = (survey: ISurvey) => {
    setSurveyToDelete(survey);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!surveyToDelete || !surveyToDelete.surveyId) return;
    await deleteSurvey.mutateAsync(surveyToDelete.surveyId);
    setShowDeleteConfirm(false);
    setSurveyToDelete(null);
  };

  const handleDuplicate = (survey: ISurvey) => {
    if (!survey.templateMongoId) {
      toast.error('No template found to duplicate.');
      return;
    }
    window.location.href = `/admin/survey-builder/${survey.templateMongoId}`;
  };

  const copyLink = (url: string) => {
    void navigator.clipboard.writeText(url).then(() => toast.success('Link copied!'));
  };

  const formatNumber = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  const statusTabs: { label: string; value: StatusTab }[] = [
    { label: 'All', value: 'all' },
    { label: 'Published', value: 'published' },
    { label: 'Draft', value: 'draft' },
    { label: 'Archived', value: 'archived' },
  ];

  const hubTabs: { label: string; value: HubTab }[] = [
    { label: 'Campaigns', value: 'campaigns' },
    { label: 'Surveys', value: 'templates' },
  ];

  return (
    <div className="h-full flex bg-gray-50 text-text-dark">
      <AdminSidebar />

      <main className="h-full overflow-y-scroll flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Surveys</h1>
              <p className="text-gray-600">Manage campaigns and templates</p>
            </div>
            {!isFieldIncharge && activeHubTab === 'campaigns' && (
              <a
                href="/admin/create-tracking-link"
                className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                + New Campaign
              </a>
            )}
            {activeHubTab === 'templates' && (
              <a
                href="/admin/survey-builder/new"
                className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                + New Survey
              </a>
            )}
          </div>

          {/* Hub tabs */}
          {!isFieldIncharge && (
            <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 border border-gray-200 w-fit">
              {hubTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveHubTab(tab.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeHubTab === tab.value
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* ── Campaigns tab — Tracking Links ─────────────────────────────── */}
          {activeHubTab === 'campaigns' && (
            <>
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
            </>
          )}

          {/* ── Templates tab — SQL Survey Instances ───────────────────────── */}
          {activeHubTab === 'templates' && (
            <>
              {/* Search + status filter row */}
              <div className="flex flex-wrap gap-3 mb-4 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or ID…"
                    className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary w-64"
                  />
                </div>
                <div className="flex gap-1 bg-white rounded-lg p-1 border border-gray-200">
                  {statusTabs.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => { setStatusTab(tab.value); setSurveyPage(1); }}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        statusTab === tab.value
                          ? 'bg-primary text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Loading / error / empty */}
              {isLoading && (
                <div className="flex justify-center py-20">
                  <LoaderUI message="Loading surveys…" />
                </div>
              )}
              {isError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
                  Failed to load surveys. Please refresh.
                </div>
              )}
              {!isLoading && !isError && filteredSurveys.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <p className="text-gray-500">No surveys found.</p>
                </div>
              )}

              {/* Rich table */}
              {!isLoading && !isError && filteredSurveys.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Survey ID</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Label</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Type</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Responses</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Total</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Today</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Start</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">End</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Layout</th>
                          <th className="text-center px-4 py-3 font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSurveys.map((s) => (
                          <React.Fragment key={s.id}>
                            <tr
                              className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                                selectedSurvey?.id === s.id ? 'bg-blue-50' : ''
                              }`}
                              onClick={() =>
                                setSelectedSurvey(selectedSurvey?.id === s.id ? null : s)
                              }
                            >
                              <td className="px-4 py-3 font-mono text-xs text-gray-500 max-w-[120px] truncate">
                                {s.surveyId ?? s.id}
                              </td>
                              <td className="px-4 py-3 font-medium text-gray-900 max-w-[180px]">
                                {s.label}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                    STATUS_BADGE[(s.status as string)] ?? STATUS_BADGE.archived
                                  }`}
                                >
                                  {s.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                                  {s.type ?? 'respondent'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {s.currentResponses}
                                {s.maxResponses ? ` / ${s.maxResponses}` : ''}
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {s.totalSubmissions != null ? s.totalSubmissions : '—'}
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {s.todaySubmissions != null ? s.todaySubmissions : '—'}
                              </td>
                              <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                                {formatDate(s.startDate)}
                              </td>
                              <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                                {s.expireDate ? formatDate(s.expireDate) : 'No limit'}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                    LAYOUT_BADGE[s.formLayout ?? 'paginated'] ?? LAYOUT_BADGE.paginated
                                  }`}
                                >
                                  {s.formLayout ?? 'paginated'}
                                </span>
                              </td>
                              <td
                                className="px-4 py-3 text-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div
                                  className="relative inline-block"
                                  ref={(el) => { menuRef.current[s.id] = el; }}
                                >
                                  <button
                                    onClick={() =>
                                      setOpenMenuId(openMenuId === s.id ? null : s.id)
                                    }
                                    className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                  {openMenuId === s.id && (
                                    <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                                      <button
                                        onClick={() => {
                                          setSelectedSurvey(selectedSurvey?.id === s.id ? null : s);
                                          setOpenMenuId(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                      >
                                        View Details
                                      </button>
                                      <button
                                        onClick={() => {
                                          setDownloadSurvey(s);
                                          setOpenMenuId(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                      >
                                        Downloads
                                      </button>
                                      {isAdmin && (
                                        <>
                                          <button
                                            onClick={() => {
                                              setOpenMenuId(null);
                                              if (s.templateMongoId) {
                                                window.location.href = `/admin/survey-builder/${s.templateMongoId}`;
                                              } else {
                                                setEditingSurvey(s);
                                              }
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                          >
                                            Edit
                                          </button>
                                          <button
                                            onClick={() => {
                                              handleDuplicate(s);
                                              setOpenMenuId(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                          >
                                            Duplicate
                                          </button>
                                        </>
                                      )}
                                      <div className="border-t border-gray-100 my-1" />
                                      <button
                                        onClick={() => {
                                          handleCopyLink(s);
                                          setOpenMenuId(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                      >
                                        Copy Link
                                      </button>
                                      {isAdmin && (
                                        <>
                                          <button
                                            onClick={() => {
                                              void handleArchive(s);
                                              setOpenMenuId(null);
                                            }}
                                            disabled={(s.status as string) === 'archived'}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                          >
                                            Archive
                                          </button>
                                          <button
                                            onClick={() => {
                                              void handleUnarchive(s);
                                              setOpenMenuId(null);
                                            }}
                                            disabled={(s.status as string) !== 'archived'}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                          >
                                            Unarchive
                                          </button>
                                          <div className="border-t border-gray-100 my-1" />
                                          <button
                                            onClick={() => {
                                              handleDelete(s);
                                              setOpenMenuId(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                          >
                                            Delete
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>

                            {/* Inline analytics detail panel */}
                            {selectedSurvey?.id === s.id && (
                              <tr>
                                <td colSpan={11} className="px-0 py-0">
                                  <div className="bg-white border-t border-b border-blue-100 px-6 py-6">
                                    <div className="flex items-center justify-between mb-5">
                                      <h2 className="font-semibold text-lg text-gray-900">
                                        {s.label} — Analytics
                                      </h2>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => setPdfTrigger((t) => t + 1)}
                                          title="Download PDF Report"
                                          className="p-1.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                          <FaFilePdf className="w-5 h-5 text-red-600" />
                                        </button>
                                        <button
                                          onClick={() => setDownloadSurvey(s)}
                                          title="Download XLSX"
                                          className="p-1.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                          <FaFileExcel className="w-5 h-5 text-green-600" />
                                        </button>
                                        <button
                                          onClick={() => setSelectedSurvey(null)}
                                          className="p-1.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                    <SurveyAnalyticsDetailPanel
                                      survey={s}
                                      onDownload={() => setDownloadSurvey(s)}
                                      pdfDownloadTrigger={pdfTrigger}
                                    />
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {surveyTotal > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <span>
                          {(surveyPage - 1) * surveyLimit + 1}–{Math.min(surveyPage * surveyLimit, surveyTotal)} of {surveyTotal}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-500">Rows:</span>
                          <select
                            value={surveyLimit}
                            onChange={(e) => {
                              setSurveyLimit(Number(e.target.value));
                              setSurveyPage(1);
                            }}
                            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            {[10, 25, 50, 100].map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSurveyPage((p) => Math.max(1, p - 1))}
                          disabled={surveyPage === 1}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setSurveyPage((p) => Math.min(surveyTotalPages, p + 1))}
                          disabled={surveyPage === surveyTotalPages}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {editingSurvey && (
        <EditSurveyModal survey={editingSurvey} onClose={() => setEditingSurvey(null)} />
      )}

      {downloadSurvey && (
        <SurveyDownloadModal
          survey={downloadSurvey}
          isOpen={true}
          onClose={() => setDownloadSurvey(null)}
        />
      )}

      {showDeleteConfirm && surveyToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Delete Survey</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-medium">{surveyToDelete.label}</span>? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
              <button onClick={() => void handleDeleteConfirm()} disabled={deleteSurvey.isPending} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm disabled:opacity-50">
                {deleteSurvey.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const SurveyManagement: React.FC = () => (
  <AdminRouteGuard>
    <SurveyManagementContent />
  </AdminRouteGuard>
);

export default SurveyManagement;
