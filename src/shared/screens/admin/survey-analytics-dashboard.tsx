import React, { useEffect, useState, useMemo, useRef, lazy, Suspense } from 'react';
import { Loader2, RefreshCw, TrendingUp, Users, MapPin, Calendar, Search, MoreVertical } from 'lucide-react';
import { useAuth } from '@/shared/providers/auth-provider';
import AdminSidebar from '@/shared/components/admin/AdminSidebar';
import AdminRouteGuard from '@/shared/components/guards/AdminRouteGuard';
import surveyService from '@services/survey/survey.service';
import type { ISurvey } from '@/core/types/survey.type';
import { INDUSTRY_FILTERS } from '@/core/constants/survey.constants';

const SurveyLocationMap = lazy(() => import('./SurveyLocationMap'));
const SurveyQuestionCharts = lazy(() => import('./SurveyQuestionCharts'));
import type { QuestionChartData } from './survey-analytics.type';

interface SurveyWithAnalytics extends ISurvey {
  totalSubmissions: number;
  todaySubmissions: number;
}

interface ZonalStat {
  zone: string;
  count: number;
}

interface DistrictStat {
  district: string;
  count: number;
}

interface DailyStat {
  date: string;
  count: number;
}

interface UserStat {
  userId: string;
  displayName?: string;
  total: number;
  zone: string;
  todayCount: number;
}

const SurveyAnalyticsDashboardContent: React.FC = () => {
  const { user, isAuthReady, isFieldIncharge } = useAuth();
  const [surveys, setSurveys] = useState<SurveyWithAnalytics[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null);
  const [zonalStats, setZonalStats] = useState<ZonalStat[]>([]);
  const [districtStats, setDistrictStats] = useState<DistrictStat[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [topUsers, setTopUsers] = useState<UserStat[]>([]);
  const [locationPoints, setLocationPoints] = useState<Array<{ latitude: number; longitude: number; count: number }>>([]);
  const [questionCharts, setQuestionCharts] = useState<QuestionChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'respondent' | 'agent'>('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 10;
  // Three-dot action menu
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const actionMenuRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  // Download modal
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadSurvey, setDownloadSurvey] = useState<SurveyWithAnalytics | null>(null);
  const [timePeriod, setTimePeriod] = useState<'1day' | '3days' | '1week' | '1month' | 'custom'>('1week');
  const [customFromDate, setCustomFromDate] = useState('');
  const [customToDate, setCustomToDate] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [responsesPage, setResponsesPage] = useState(0);
  const [responsesSearch, setResponsesSearch] = useState('');
  const [selectedContributor, setSelectedContributor] = useState<UserStat | null>(null);
  const [contributorModalData, setContributorModalData] = useState<{ response: any; questions: any[] } | null>(null);
  const [isLoadingContributorModal, setIsLoadingContributorModal] = useState(false);

  // Filter surveys client-side for instant feedback
  const filteredSurveys = useMemo(() => {
    return surveys.filter((survey) => {
      const matchesSearch = !searchQuery ||
        (survey.label || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (survey.surveyId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (survey.industry || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || survey.type === typeFilter;
      const surveyIndustry = survey.industry || survey.metadata?.industry || '';
      const matchesIndustry =
        industryFilter === 'all' ||
        !surveyIndustry ||  // surveys with no industry set match any filter
        surveyIndustry === industryFilter ||
        surveyIndustry === 'All Industries'; // surveys tagged "All Industries" are cross-industry
      return matchesSearch && matchesType && matchesIndustry;
    });
  }, [surveys, searchQuery, typeFilter, industryFilter]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, typeFilter, industryFilter]);

  const totalPages = Math.ceil(filteredSurveys.length / limit);

  const paginatedSurveys = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredSurveys.slice(start, start + limit);
  }, [filteredSurveys, page, limit]);

  const selectedSurveyObj = useMemo(
    () => surveys.find((s) => s.surveyId === selectedSurvey) ?? null,
    [surveys, selectedSurvey]
  );
  const isRespondentSurvey = !selectedSurveyObj || selectedSurveyObj.type !== 'agent';

  // Load all surveys regardless of type — admin should see every published survey
  const loadSurveys = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const result = await surveyService.listPublicSurveys({ status: 'published', limit: 500 });

      const allSurveys = Array.isArray(result.data) ? result.data.filter((s) => s && s.id) : [];
      setSurveys(allSurveys as SurveyWithAnalytics[]);
      setIsLoading(false);
    } catch (err) {
      console.error('[Survey Analytics] Load error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load surveys');
      setSurveys([]);
      setIsLoading(false);
    }
  };

  // Load detailed analytics for selected survey
  const loadSurveyDetails = async (surveyId: string) => {
    try {
      setIsLoadingDetails(true);
      setSelectedSurvey(surveyId);
      setError(null);

      // Clear previous data while loading
      setZonalStats([]);
      setDistrictStats([]);
      setDailyStats([]);
      setTopUsers([]);
      setLocationPoints([]);
      setQuestionCharts([]);

      // Validate surveyId
      if (!surveyId) {
        setError('Invalid survey ID');
        setIsLoadingDetails(false);
        return;
      }

      // Load analytics data in parallel
      const [zonalRes, districtRes, dailyRes, usersRes, locRes, chartsRes] = await Promise.all([
        surveyService.getZonalBreakdown(surveyId),
        surveyService.getDistrictBreakdown(surveyId),
        surveyService.getDailyBreakdown(surveyId, 14), // Last 14 days
        surveyService.getTopUsers(surveyId, 1000),
        surveyService.getLocationBreakdown(surveyId),
        surveyService.getQuestionAnalytics(surveyId),
      ]);

      // Validate and set zonal stats
      if (zonalRes.success && zonalRes.data && Array.isArray(zonalRes.data)) {
        const validZonalStats = zonalRes.data.filter(s => s && s.zone && typeof s.count === 'number');
        setZonalStats(validZonalStats);
      } else {
        setZonalStats([]);
      }

      // Validate and set district stats
      if (districtRes.success && districtRes.data && Array.isArray(districtRes.data)) {
        const validDistrictStats = districtRes.data.filter(s => s && s.district && typeof s.count === 'number');
        setDistrictStats(validDistrictStats);
      } else {
        setDistrictStats([]);
      }

      // Validate and set daily stats
      if (dailyRes.success && dailyRes.data && Array.isArray(dailyRes.data)) {
        const validDailyStats = dailyRes.data.filter(s => s && s.date && typeof s.count === 'number');
        setDailyStats(validDailyStats);
      } else {
        setDailyStats([]);
      }

      // Validate and set top users
      if (usersRes.success && usersRes.data && Array.isArray(usersRes.data)) {
        const validUsers = usersRes.data.filter(u => u && u.userId && typeof u.total === 'number');
        setTopUsers(validUsers);
      } else {
        setTopUsers([]);
      }

      // Validate and set location points
      if (locRes.success && Array.isArray(locRes.data)) {
        setLocationPoints(locRes.data);
      } else {
        setLocationPoints([]);
      }

      // Validate and set question charts
      if (chartsRes.success && Array.isArray(chartsRes.data)) {
        setQuestionCharts(chartsRes.data);
      } else {
        setQuestionCharts([]);
      }

      setIsLoadingDetails(false);
    } catch (err) {
      console.error('[Survey Analytics] Details load error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load survey details');
      // Clear data on error
      setZonalStats([]);
      setDistrictStats([]);
      setDailyStats([]);
      setTopUsers([]);
      setLocationPoints([]);
      setQuestionCharts([]);
      setIsLoadingDetails(false);
    }
  };

  // Load surveys when auth is ready
  useEffect(() => {
    if (!isAuthReady || !user) return;
    loadSurveys();
  }, [isAuthReady, user]);

  // Reset contributor/responses state when selected survey changes
  useEffect(() => {
    setResponsesPage(0);
    setResponsesSearch('');
    setSelectedContributor(null);
    setContributorModalData(null);
  }, [selectedSurvey]);

  // Close three-dot menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openActionMenuId && actionMenuRef.current[openActionMenuId]) {
        if (!actionMenuRef.current[openActionMenuId]?.contains(e.target as Node)) {
          setOpenActionMenuId(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openActionMenuId]);

  // Compute date range from time period selection
  const getDateRange = () => {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    switch (timePeriod) {
      case '1day': {
        const start = new Date(now); start.setDate(start.getDate() - 1); start.setHours(0, 0, 0, 0);
        return { startDate: start.toISOString(), endDate: end.toISOString() };
      }
      case '3days': {
        const start = new Date(now); start.setDate(start.getDate() - 3); start.setHours(0, 0, 0, 0);
        return { startDate: start.toISOString(), endDate: end.toISOString() };
      }
      case '1week': {
        const start = new Date(now); start.setDate(start.getDate() - 7); start.setHours(0, 0, 0, 0);
        return { startDate: start.toISOString(), endDate: end.toISOString() };
      }
      case '1month': {
        const start = new Date(now); start.setMonth(start.getMonth() - 1); start.setHours(0, 0, 0, 0);
        return { startDate: start.toISOString(), endDate: end.toISOString() };
      }
      case 'custom': {
        const start = new Date(customFromDate); start.setHours(0, 0, 0, 0);
        const endCustom = new Date(customToDate); endCustom.setHours(23, 59, 59, 999);
        return { startDate: start.toISOString(), endDate: endCustom.toISOString() };
      }
      default:
        return { startDate: undefined, endDate: undefined };
    }
  };

  const formatAnswerForCSV = (answer: any, questionType: string, options?: Array<{value: string; label: string}>): string => {
    if (answer === null || answer === undefined || answer === '') return '';
    // Helper: resolve a single raw value to its human-readable label (avoids Excel date misinterpretation)
    const resolveLabel = (raw: string): string => {
      if (options?.length) {
        const match = options.find((o) => o.value === raw);
        if (match) return match.label;
      }
      return raw;
    };
    switch (questionType) {
      case 'mcq-single':
        return resolveLabel(typeof answer === 'object' ? JSON.stringify(answer) : String(answer));
      case 'mcq-multiple':
        return Array.isArray(answer) ? answer.map((v) => resolveLabel(String(v))).join('; ') : String(answer);
      case 'double-slider':
        return answer && typeof answer === 'object' ? `${answer.min} - ${answer.max}` : String(answer);
      case 'ranking':
        return Array.isArray(answer) ? answer.join(' > ') : String(answer);
      case 'max-diff':
        if (answer && typeof answer === 'object') {
          const best = Object.entries(answer).filter(([, v]) => v === 'best').map(([k]) => k).join('; ');
          const worst = Object.entries(answer).filter(([, v]) => v === 'worst').map(([k]) => k).join('; ');
          return `Best: ${best} | Worst: ${worst}`;
        }
        return String(answer);
      case 'multi-slider':
      case 'matrix':
      case 'constant-sum':
        if (answer && typeof answer === 'object') {
          return Object.entries(answer).map(([k, v]) => `${k}: ${v}`).join('; ');
        }
        return String(answer);
      case 'file':
        // Stored in MongoDB as { url, fileName, fileSize, mimeType } — export just the URL
        if (answer && typeof answer === 'object') return answer.url || '';
        return typeof answer === 'string' ? answer : '';
      case 'currency':
        return answer !== null && answer !== undefined ? `₹${answer}` : '';
      default:
        return typeof answer === 'object' ? JSON.stringify(answer) : String(answer);
    }
  };

  // Converts camelCase/PascalCase keys to readable "Title Case" column labels
  // e.g. "respondentPic" → "Respondent Pic", "conversationAudio" → "Conversation Audio"
  const fieldKeyToLabel = (key: string): string =>
    key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim();

  // Format a raw response-level or respondent-level value for CSV
  // File objects stored in MongoDB come back as { url, fileName, fileSize, mimeType }
  const formatRawFieldForCSV = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object' && !Array.isArray(value) && value.url) return value.url;
    if (Array.isArray(value)) return value.join('; ');
    return String(value);
  };

  const escapeCSVField = (value: string): string => {
    const str = String(value ?? '');
    // Always wrap in double quotes (RFC 4180) so Excel treats the value as-is.
    // Inside the quotes, escape existing double-quotes by doubling them.
    return `"${str.replace(/"/g, '""')}"`;
  };

  // Format phone numbers so Excel never interprets them as numbers (scientific notation).
  // Prefixing with a tab character inside the quoted cell forces Excel to treat it as text.
  const formatPhone = (phone: string | undefined): string => {
    if (!phone) return '';
    return `\t${phone}`;
  };

  const handleDownloadCSV = async () => {
    if (!downloadSurvey?.surveyId) return;
    try {
      setIsDownloading(true);
      const { startDate, endDate } = getDateRange();

      // Fetch template (for question labels) and responses in parallel.
      // allSettled ensures a missing template never blocks the download.
      const [detailsResult, responsesResult] = await Promise.allSettled([
        surveyService.getSurveyDetails(downloadSurvey.surveyId),
        surveyService.getSurveyResponses(downloadSurvey.surveyId, { startDate, endDate, limit: 10000 }),
      ]);

      if (responsesResult.status === 'rejected') {
        alert('Failed to fetch responses. Please try again.');
        return;
      }

      const responses: any[] = Array.isArray(responsesResult.value.data) ? responsesResult.value.data : [];

      if (responses.length === 0) {
        alert('No responses found for the selected time period.');
        return;
      }

      // Use question definitions from template when available (gives us human-readable
      // labels and allowComment flags); otherwise fall back to questionIds from response data.
      let questions: any[] =
        detailsResult.status === 'fulfilled'
          ? detailsResult.value.data?.template?.questions || []
          : [];

      if (questions.length === 0) {
        const questionIdSet = new Set<string>();
        responses.forEach((r: any) => {
          (r.answers || []).forEach((a: any) => { if (a.questionId) questionIdSet.add(a.questionId); });
        });
        questions = Array.from(questionIdSet).map((id) => ({ id, text: id }));
      }

      // Sort questions by their defined order when available
      questions = [...questions].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      // ── Capture fields from template settings ─────────────────────────────────
      // captureFields is configured per-survey in MongoDB (template.settings.captureFields).
      // Each entry declares a field key, a readable label, the data type, and where the
      // value lives on the response document (root / respondent / captureData).
      // This replaces hardcoded field names in the mobile app — the app reads this config
      // and shows the matching capture UI; the CSV export uses the same config for columns.
      //
      // Fallback: if the template has no captureFields, scan response objects at runtime
      // to stay backward-compatible with surveys whose templates predate this config.
      const templateCaptureFields: any[] =
        detailsResult.status === 'fulfilled'
          ? detailsResult.value.data?.template?.settings?.captureFields || []
          : [];

      // Helper: resolve a capture field value from the response using its storePath
      const resolveCaptureValue = (response: any, field: any): string => {
        const path = field.storePath || 'root';
        let raw: any;
        if (path === 'respondent') raw = response.respondent?.[field.key];
        else if (path === 'captureData') raw = response.captureData?.[field.key];
        else raw = response[field.key];
        return formatRawFieldForCSV(raw);
      };

      // Fallback: discover extra fields at runtime when captureFields is absent
      let fallbackCaptureFields: Array<{ key: string; label: string; storePath: 'respondent' | 'root' }> = [];
      if (templateCaptureFields.length === 0) {
        const STANDARD_RESPONDENT_KEYS = new Set(['name', 'email', 'phone', 'userId']);
        const STANDARD_RESPONSE_KEYS = new Set([
          '_id', 'surveyId', 'surveyTemplateId', 'respondent', 'answers', 'status', 'submittedAt', 'captureData',
        ]);
        const seenKeys = new Set<string>();

        responses.forEach((response: any) => {
          if (response.respondent && typeof response.respondent === 'object') {
            Object.keys(response.respondent).forEach((key) => {
              const uid = `respondent::${key}`;
              if (!STANDARD_RESPONDENT_KEYS.has(key) && !seenKeys.has(uid)) {
                seenKeys.add(uid);
                fallbackCaptureFields.push({ key, label: fieldKeyToLabel(key), storePath: 'respondent' });
              }
            });
          }
          Object.keys(response).forEach((key) => {
            const uid = `root::${key}`;
            if (!STANDARD_RESPONSE_KEYS.has(key) && !seenKeys.has(uid)) {
              seenKeys.add(uid);
              fallbackCaptureFields.push({ key, label: fieldKeyToLabel(key), storePath: 'root' });
            }
          });
        });
      }

      // Use template-configured fields when present, runtime-discovered fields otherwise
      const captureFields = templateCaptureFields.length > 0 ? templateCaptureFields : fallbackCaptureFields;
      // ─────────────────────────────────────────────────────────────────────────

      // Build headers: fixed respondent info → capture fields → question columns (+ comments)
      const headers = [
        'Submitted At', 'Status',
        'Respondent Name', 'Respondent Email', 'Respondent Phone', 'User ID',
        'Zone', 'District', 'AC Name', 'Latitude', 'Longitude',
        ...captureFields.map((f: any) => f.label),
        ...questions.flatMap((q: any) => [
          `${q.id}: ${q.text}`,
          ...(q.allowComment ? [`${q.id}: ${q.text} (Comment)`] : []),
        ]),
      ];

      const rows = responses.map((response: any) => {
        const answerMap = new Map<string, any>();
        (response.answers || []).forEach((a: any) => answerMap.set(a.questionId, a));

        return [
          new Date(response.submittedAt).toLocaleString(),
          response.status || '',
          response.respondent?.name || '',
          response.respondent?.email || '',
          formatPhone(response.respondent?.phone),
          response.respondent?.userId || '',
          response.submitterZone ?? '',
          response.submitterDistrict ?? '',
          response.submitterAc ?? '',
          response.location?.latitude ?? '',
          response.location?.longitude ?? '',
          // Capture fields — resolved via storePath from template config (or fallback discovery)
          ...captureFields.map((f: any) => resolveCaptureValue(response, f)),
          // Question answers (file type extracts URL; other types formatted as before)
          ...questions.flatMap((q: any) => {
            const entry = answerMap.get(q.id);
            return [
              entry ? formatAnswerForCSV(entry.answer, entry.questionType || q.questionType, q.config?.options) : '',
              ...(q.allowComment ? [entry?.comment || ''] : []),
            ];
          }),
        ].map(escapeCSVField).join(',');
      });

      const csv = [headers.map(escapeCSVField).join(','), ...rows].join('\n');
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${downloadSurvey.surveyId}_${timePeriod}_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      setShowDownloadModal(false);
    } catch (err) {
      console.error('[Download CSV] Error:', err);
      alert('Failed to download responses. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Format helpers
  const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatZone = (zone: string) => {
    return zone.charAt(0).toUpperCase() + zone.slice(1).toLowerCase();
  };

  const openContributorModal = async (contributor: UserStat) => {
    setSelectedContributor(contributor);
    setIsLoadingContributorModal(true);
    setContributorModalData(null);
    try {
      const [detailsRes, responsesRes] = await Promise.all([
        surveyService.getSurveyDetails(selectedSurvey!),
        surveyService.getSurveyResponses(selectedSurvey!, { limit: 1000 }),
      ]);
      const questions = (detailsRes.data?.template?.questions ?? [])
        .slice()
        .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
      const responses: any[] = Array.isArray(responsesRes.data) ? responsesRes.data : [];
      const match = responses.find((r) => r.respondent?.userId === contributor.userId) ?? null;
      setContributorModalData({ response: match, questions });
    } catch (err) {
      console.error('[ContributorModal] Error:', err);
      setContributorModalData({ response: null, questions: [] });
    } finally {
      setIsLoadingContributorModal(false);
    }
  };

  const getZoneColor = (zone: string, index: number) => {
    const zoneColors: Record<string, string> = {
      'North': 'bg-blue-500',
      'South': 'bg-green-500',
      'East': 'bg-purple-500',
      'West': 'bg-orange-500',
      'Central': 'bg-teal-500',
    };
    if (zoneColors[zone]) return zoneColors[zone];
    // Fallback for any other values
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-teal-500', 'bg-pink-500', 'bg-indigo-500', 'bg-red-500'];
    return colors[index % colors.length];
  };

  const getDistrictColor = (index: number) => {
    const colors = [
      'bg-sky-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500',
      'bg-rose-500', 'bg-cyan-500', 'bg-lime-500', 'bg-fuchsia-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <>
      <div className="h-full flex bg-gray-50 text-text-dark">
        <AdminSidebar />

        <main className="h-full overflow-y-scroll flex-1 p-8">
          <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Survey Analytics</h1>
            <p className="text-gray-600 mt-1">Track submissions across all surveys</p>
          </div>
          <button
            onClick={loadSurveys}
            className="flex items-center gap-2 px-4 py-2 text-primary hover:text-primary/80 font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Surveys List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      All Surveys ({filteredSurveys.length})
                      {totalPages > 1 && (
                        <span className="ml-2 text-sm font-normal text-gray-500">
                          — page {page} of {totalPages}
                        </span>
                      )}
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search surveys..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary w-full sm:w-56"
                        />
                      </div>
                      {/* Type Filter */}
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as 'all' | 'respondent' | 'agent')}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
                      >
                        <option value="all">All Types</option>
                        <option value="respondent">Respondent</option>
                        <option value="agent">Agent</option>
                      </select>
                      {/* Industry Filter */}
                      <select
                        value={industryFilter}
                        onChange={(e) => setIndustryFilter(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
                      >
                        {INDUSTRY_FILTERS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Survey Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Type
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Total
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Today
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredSurveys.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                            {searchQuery || typeFilter !== 'all' || industryFilter !== 'all'
                              ? 'No surveys match your filters'
                              : 'No surveys found'}
                          </td>
                        </tr>
                      ) : (
                        paginatedSurveys.map((survey) => (
                          <tr
                            key={survey.id}
                            className={`hover:bg-gray-50 cursor-pointer ${
                              selectedSurvey === survey.surveyId ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => survey.surveyId && loadSurveyDetails(survey.surveyId)}
                          >
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {survey.label || 'Untitled Survey'}
                              </div>
                              <div className="text-xs text-gray-500">{survey.surveyId || 'N/A'}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  survey.type === 'agent'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {survey.type === 'agent' ? 'Agent' : 'Respondent'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="text-sm font-semibold text-gray-900">
                                {formatNumber(survey.totalSubmissions ?? 0)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="text-sm font-semibold text-orange-600">
                                {formatNumber(survey.todaySubmissions ?? 0)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                              <div
                                className="relative inline-block"
                                ref={(el) => { actionMenuRef.current[survey.id] = el; }}
                              >
                                <button
                                  onClick={() => setOpenActionMenuId(openActionMenuId === survey.id ? null : survey.id)}
                                  disabled={!survey.surveyId}
                                  className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                {openActionMenuId === survey.id && (
                                  <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    <button
                                      onClick={() => {
                                        setOpenActionMenuId(null);
                                        if (survey.surveyId) loadSurveyDetails(survey.surveyId);
                                      }}
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                                    >
                                      View Details
                                    </button>
                                    <button
                                      onClick={() => {
                                        setOpenActionMenuId(null);
                                        setDownloadSurvey(survey);
                                        setTimePeriod('1week');
                                        setCustomFromDate('');
                                        setCustomToDate('');
                                        setShowDownloadModal(true);
                                      }}
                                      disabled={!survey.surveyId}
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      Download
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, filteredSurveys.length)} of {filteredSurveys.length}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Analytics Details */}
            <div className="lg:col-span-1">
              {selectedSurvey ? (
                isLoadingDetails ? (
                  <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center h-64">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : isRespondentSurvey ? (
                    /* Responses panel for respondent surveys (paginated + searchable) */
                    (() => {
                      const RESPONSES_PAGE_SIZE = 10;
                      const q = responsesSearch.trim().toLowerCase();
                      const filteredUsers = q
                        ? topUsers.filter((u) =>
                            (u?.displayName || '').toLowerCase().includes(q) ||
                            (u?.userId || '').toLowerCase().includes(q)
                          )
                        : topUsers;
                      const totalResponsePages = Math.max(1, Math.ceil(filteredUsers.length / RESPONSES_PAGE_SIZE));
                      const clampedPage = Math.min(responsesPage, totalResponsePages - 1);
                      const pageStart = clampedPage * RESPONSES_PAGE_SIZE;
                      const pageEnd = Math.min(pageStart + RESPONSES_PAGE_SIZE, filteredUsers.length);
                      const pageItems = filteredUsers.slice(pageStart, pageEnd);
                      return (
                        <div className="bg-white rounded-lg shadow p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <Users className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold text-gray-900">Responses</h3>
                          </div>
                          {topUsers.length === 0 ? (
                            <div className="text-center py-8">
                              <p className="text-sm text-gray-500">No responses yet</p>
                              <p className="text-xs text-gray-400 mt-1">Responses will appear after submissions are made</p>
                            </div>
                          ) : (
                            <>
                              {/* Search input */}
                              <div className="relative mb-3">
                                <input
                                  type="text"
                                  value={responsesSearch}
                                  onChange={(e) => {
                                    setResponsesSearch(e.target.value);
                                    setResponsesPage(0);
                                  }}
                                  placeholder="Search responses…"
                                  className="w-full pl-8 pr-8 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-gray-400"
                                />
                                <svg className="absolute left-2.5 top-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                                </svg>
                                {responsesSearch && (
                                  <button
                                    onClick={() => { setResponsesSearch(''); setResponsesPage(0); }}
                                    className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                              {filteredUsers.length === 0 ? (
                                <div className="text-center py-6">
                                  <p className="text-sm text-gray-500">No matching responses</p>
                                </div>
                              ) : (
                                <>
                                  <div className="space-y-1">
                                    {pageItems.map((user, localIndex) => {
                                      const globalIndex = pageStart + localIndex;
                                      return (
                                        <div
                                          key={user?.userId || globalIndex}
                                          className="flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                          onClick={() => user && openContributorModal(user)}
                                        >
                                          <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                                              #{globalIndex + 1}
                                            </div>
                                            <div className="text-sm font-medium text-gray-900 truncate max-w-[140px]">
                                              {user?.displayName || (user?.userId ? `${user.userId.slice(0, 8)}...` : 'Unknown')}
                                            </div>
                                          </div>
                                          <span className="text-xs text-primary font-semibold flex-shrink-0">View →</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  {totalResponsePages > 1 && (
                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                                      <button
                                        onClick={() => setResponsesPage((p) => Math.max(0, p - 1))}
                                        disabled={clampedPage === 0}
                                        className="flex items-center gap-1 text-xs text-primary disabled:text-gray-300 hover:underline disabled:no-underline"
                                      >
                                        ‹ Prev
                                      </button>
                                      <span className="text-xs text-gray-500">
                                        Page {clampedPage + 1} of {totalResponsePages} · {filteredUsers.length} total
                                      </span>
                                      <button
                                        onClick={() => setResponsesPage((p) => Math.min(totalResponsePages - 1, p + 1))}
                                        disabled={clampedPage >= totalResponsePages - 1}
                                        className="flex items-center gap-1 text-xs text-primary disabled:text-gray-300 hover:underline disabled:no-underline"
                                      >
                                        Next ›
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    /* Full analytics for agent surveys */
                    <div className="space-y-6">
                      {/* Question Response Charts */}
                      <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold text-gray-900">Response Analysis</h3>
                        </div>
                        <Suspense fallback={<div className="h-48 animate-pulse bg-gray-50 rounded-lg" />}>
                          <SurveyQuestionCharts questions={questionCharts} isLoading={false} />
                        </Suspense>
                      </div>

                      {/* Location Map */}
                      <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <MapPin className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold text-gray-900">Response Locations</h3>
                          <span className="text-xs text-gray-400 ml-1">({locationPoints.reduce((s, p) => s + p.count, 0)} with GPS)</span>
                        </div>
                        <Suspense fallback={<div className="h-48 bg-gray-50 rounded-lg border border-gray-200 animate-pulse" />}>
                          <SurveyLocationMap points={locationPoints} />
                        </Suspense>
                      </div>

                      {/* Zonal Breakdown */}
                      <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <MapPin className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold text-gray-900">By Zone</h3>
                        </div>
                        {zonalStats.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-sm text-gray-500">No zonal data available</p>
                            <p className="text-xs text-gray-400 mt-1">Data will appear after submissions are made</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {zonalStats.map((stat, index) => {
                              const maxCount = Math.max(...zonalStats.map((s) => s?.count || 0), 1);
                              const percentage = ((stat?.count || 0) / maxCount) * 100;
                              return (
                                <div key={stat.zone || index}>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">
                                      {formatZone(stat?.zone || 'Unknown')}
                                    </span>
                                    <span className="text-gray-900 font-semibold">
                                      {formatNumber(stat?.count || 0)}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${getZoneColor(stat?.zone || '', index)}`}
                                      style={{ width: `${Math.max(percentage, 0)}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* District Breakdown */}
                      <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <MapPin className="w-5 h-5 text-green-600" />
                          <h3 className="text-lg font-semibold text-gray-900">By District</h3>
                        </div>
                        {districtStats.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-sm text-gray-500">No district data available</p>
                            <p className="text-xs text-gray-400 mt-1">Data will appear after submissions are made</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {districtStats.slice(0, 10).map((stat, index) => {
                              const maxCount = Math.max(...districtStats.map((s) => s?.count || 0), 1);
                              const percentage = ((stat?.count || 0) / maxCount) * 100;
                              return (
                                <div key={stat.district || index}>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">
                                      {stat?.district || 'Unknown'}
                                      </span>
                                      <span className="text-gray-900 font-semibold">
                                        {formatNumber(stat?.count || 0)}
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div
                                        className={`h-2 rounded-full ${getDistrictColor(index)}`}
                                        style={{ width: `${Math.max(percentage, 0)}%` }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                              {districtStats.length > 10 && (
                                <p className="text-xs text-gray-400 text-center">
                                  +{districtStats.length - 10} more districts
                                </p>
                              )}
                            </div>
                        )}
                      </div>

                      {/* Daily Trend */}
                      <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Calendar className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold text-gray-900">Last 14 Days</h3>
                        </div>
                        {dailyStats.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-sm text-gray-500">No daily data available</p>
                            <p className="text-xs text-gray-400 mt-1">Submission history will appear here</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {dailyStats.slice(0, 7).map((stat, idx) => (
                              <div
                                key={stat?.date || idx}
                                className="flex justify-between items-center text-sm"
                              >
                                <span className="text-gray-600">
                                  {stat?.date ? formatDate(stat.date) : 'Unknown'}
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {formatNumber(stat?.count ?? 0)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Top Contributors */}
                      <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Users className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold text-gray-900">Top Contributors</h3>
                        </div>
                        {topUsers.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-sm text-gray-500">No contributor data available</p>
                            <p className="text-xs text-gray-400 mt-1">Top contributors will appear here</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {topUsers.map((user, index) => (
                              <div
                                key={user?.userId || index}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                    #{index + 1}
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {user?.displayName || (user?.userId ? `${user.userId.slice(0, 8)}...` : 'Unknown')}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {formatZone(user?.zone || 'Unknown')}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-semibold text-gray-900">
                                    {formatNumber(user?.total ?? 0)}
                                  </div>
                                  <div className="text-xs text-orange-600">
                                    +{user?.todayCount ?? 0} today
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
              ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a survey to view detailed analytics</p>
                </div>
              )}
            </div>
          </div>
        )}
          </div>
        </main>
      </div>

      {/* Contributor Answers Modal */}
      {selectedContributor !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 truncate pr-4">
                {selectedContributor.displayName || (selectedContributor.userId ? `${selectedContributor.userId.slice(0, 8)}...` : 'Contributor')}
              </h2>
              <button
                onClick={() => { setSelectedContributor(null); setContributorModalData(null); }}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none flex-shrink-0"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              {isLoadingContributorModal ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : contributorModalData?.response == null ? (
                <p className="text-gray-500 text-sm text-center py-8">No response found for this contributor.</p>
              ) : (
                <>
                  {/* Respondent info card */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5 text-sm space-y-1">
                    {contributorModalData.response.respondent?.name && (
                      <div className="flex gap-3"><span className="text-gray-500 w-20 flex-shrink-0">Name</span><span className="text-gray-900">{contributorModalData.response.respondent.name}</span></div>
                    )}
                    {contributorModalData.response.respondent?.phone && (
                      <div className="flex gap-3"><span className="text-gray-500 w-20 flex-shrink-0">Phone</span><span className="text-gray-900">{contributorModalData.response.respondent.phone}</span></div>
                    )}
                    {contributorModalData.response.respondent?.email && (
                      <div className="flex gap-3"><span className="text-gray-500 w-20 flex-shrink-0">Email</span><span className="text-gray-900">{contributorModalData.response.respondent.email}</span></div>
                    )}
                    {contributorModalData.response.submittedAt && (
                      <div className="flex gap-3"><span className="text-gray-500 w-20 flex-shrink-0">Submitted</span><span className="text-gray-900">{new Date(contributorModalData.response.submittedAt).toLocaleString()}</span></div>
                    )}
                  </div>
                  {/* Q&A list */}
                  <div className="space-y-4">
                    {contributorModalData.questions.map((q: any) => {
                      const answerMap = new Map<string, any>();
                      (contributorModalData.response.answers || []).forEach((a: any) => answerMap.set(a.questionId, a));
                      const entry = answerMap.get(q.id);
                      const answerText = entry
                        ? formatAnswerForCSV(entry.answer, entry.questionType || q.questionType, q.config?.options)
                        : '—';
                      return (
                        <div key={q.id}>
                          <p className="text-xs font-semibold text-gray-500 mb-1">{q.text}</p>
                          <p className="text-sm text-gray-900">{answerText || '—'}</p>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Download Modal */}
      {showDownloadModal && downloadSurvey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Download Responses</h2>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              <span className="font-medium">{downloadSurvey.label}</span>
              {downloadSurvey.surveyId && (
                <span className="ml-2 text-black">({downloadSurvey.surveyId})</span>
              )}
            </p>
            <div className="mb-4 text-black">
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value as typeof timePeriod)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
              >
                <option value="1day">Last 1 Day</option>
                <option value="3days">Last 3 Days</option>
                <option value="1week">Last 1 Week</option>
                <option value="1month">Last 1 Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            {timePeriod === 'custom' && (
              <div className="grid grid-cols-2 gap-4 mb-4 text-black">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input
                    type="date"
                    value={customFromDate}
                    onChange={(e) => setCustomFromDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input
                    type="date"
                    value={customToDate}
                    onChange={(e) => setCustomToDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadCSV}
                disabled={isDownloading || (timePeriod === 'custom' && (!customFromDate || !customToDate))}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  'Download as CSV'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Outer wrapper with AdminRouteGuard so useAuth() in content gets real context
export const SurveyAnalyticsDashboard: React.FC = () => {
  return (
    <AdminRouteGuard>
      <SurveyAnalyticsDashboardContent />
    </AdminRouteGuard>
  );
};

export default SurveyAnalyticsDashboard;

// ─── Extracted panel + modal for embedding in the Surveys hub ────────────────

/* ─── Shared mini pager used inside detail panel sections ─────────────────── */
const MiniPager: React.FC<{
  page: number; total: number; count: number;
  onPrev: () => void; onNext: () => void;
}> = ({ page, total, count, onPrev, onNext }) => {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
      <button onClick={onPrev} disabled={page === 0}
        className="text-[10px] text-primary disabled:text-gray-300 hover:underline disabled:no-underline">‹ Prev</button>
      <span className="text-[10px] text-gray-400">{page + 1}/{total} · {count} total</span>
      <button onClick={onNext} disabled={page >= total - 1}
        className="text-[10px] text-primary disabled:text-gray-300 hover:underline disabled:no-underline">Next ›</button>
    </div>
  );
};

export interface SurveyAnalyticsDetailPanelProps {
  survey: ISurvey;
  onDownload: () => void;
}

export const SurveyAnalyticsDetailPanel: React.FC<SurveyAnalyticsDetailPanelProps> = ({ survey, onDownload }) => {
  const { isFieldIncharge } = useAuth();
  const [zonalStats, setZonalStats] = useState<ZonalStat[]>([]);
  const [districtStats, setDistrictStats] = useState<DistrictStat[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [topUsers, setTopUsers] = useState<UserStat[]>([]);
  const [locationPoints, setLocationPoints] = useState<Array<{ latitude: number; longitude: number; count: number }>>([]);
  const [questionCharts, setQuestionCharts] = useState<QuestionChartData[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [responsesPage, setResponsesPage] = useState(0);
  const [responsesSearch, setResponsesSearch] = useState('');
  const [selectedContributor, setSelectedContributor] = useState<UserStat | null>(null);
  const [contributorModalData, setContributorModalData] = useState<{ response: any; questions: any[] } | null>(null);
  const [isLoadingContributorModal, setIsLoadingContributorModal] = useState(false);
  const [districtPage, setDistrictPage] = useState(0);
  const [dailyPage, setDailyPage] = useState(0);
  const [contributorsPage, setContributorsPage] = useState(0);

  const isRespondentSurvey = survey.type !== 'agent';

  const formatAnswerForDisplay = (answer: any, questionType: string, options?: Array<{ value: string; label: string }>): string => {
    if (answer === null || answer === undefined || answer === '') return '—';
    const resolveLabel = (raw: string): string => {
      if (options?.length) {
        const match = options.find((o) => o.value === raw);
        if (match) return match.label;
      }
      return raw;
    };
    switch (questionType) {
      case 'mcq-single': return resolveLabel(typeof answer === 'object' ? JSON.stringify(answer) : String(answer));
      case 'mcq-multiple': return Array.isArray(answer) ? answer.map((v) => resolveLabel(String(v))).join('; ') : String(answer);
      case 'double-slider': return answer && typeof answer === 'object' ? `${answer.min} - ${answer.max}` : String(answer);
      case 'ranking': return Array.isArray(answer) ? answer.join(' > ') : String(answer);
      case 'max-diff':
        if (answer && typeof answer === 'object') {
          const best = Object.entries(answer).filter(([, v]) => v === 'best').map(([k]) => k).join('; ');
          const worst = Object.entries(answer).filter(([, v]) => v === 'worst').map(([k]) => k).join('; ');
          return `Best: ${best} | Worst: ${worst}`;
        }
        return String(answer);
      case 'multi-slider': case 'matrix': case 'constant-sum':
        return answer && typeof answer === 'object' ? Object.entries(answer).map(([k, v]) => `${k}: ${v}`).join('; ') : String(answer);
      case 'file': return (answer && typeof answer === 'object') ? (answer.url || '') : (typeof answer === 'string' ? answer : '');
      case 'currency': return answer !== null && answer !== undefined ? `₹${answer}` : '';
      default: return typeof answer === 'object' ? JSON.stringify(answer) : String(answer);
    }
  };

  const panelFormatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);
  const panelFormatDate = (dateStr: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(dateStr));
  const panelFormatZone = (zone: string) => zone.charAt(0).toUpperCase() + zone.slice(1).toLowerCase();

  const panelGetZoneColor = (zone: string, index: number) => {
    const zoneColors: Record<string, string> = { 'North': 'bg-blue-500', 'South': 'bg-green-500', 'East': 'bg-purple-500', 'West': 'bg-orange-500', 'Central': 'bg-teal-500' };
    if (zoneColors[zone]) return zoneColors[zone];
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-teal-500', 'bg-pink-500', 'bg-indigo-500', 'bg-red-500'];
    return colors[index % colors.length];
  };

  const panelGetDistrictColor = (index: number) => {
    const colors = ['bg-sky-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-lime-500', 'bg-fuchsia-500'];
    return colors[index % colors.length];
  };

  const openContributor = async (contributor: UserStat) => {
    if (!survey.surveyId) return;
    setSelectedContributor(contributor);
    setIsLoadingContributorModal(true);
    setContributorModalData(null);
    try {
      const [detailsRes, responsesRes] = await Promise.all([
        surveyService.getSurveyDetails(survey.surveyId),
        surveyService.getSurveyResponses(survey.surveyId, { limit: 1000 }),
      ]);
      const questions = (detailsRes.data?.template?.questions ?? []).slice().sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
      const responses: any[] = Array.isArray(responsesRes.data) ? responsesRes.data : [];
      const match = responses.find((r) => r.respondent?.userId === contributor.userId) ?? null;
      setContributorModalData({ response: match, questions });
    } catch {
      setContributorModalData({ response: null, questions: [] });
    } finally {
      setIsLoadingContributorModal(false);
    }
  };

  useEffect(() => {
    setResponsesPage(0);
    setResponsesSearch('');
    setSelectedContributor(null);
    setContributorModalData(null);
    setDistrictPage(0);
    setDailyPage(0);
    setContributorsPage(0);
    setZonalStats([]);
    setDistrictStats([]);
    setDailyStats([]);
    setTopUsers([]);
    setLocationPoints([]);
    setQuestionCharts([]);

    if (!survey.surveyId) return;
    setIsLoadingDetails(true);

    Promise.all([
      surveyService.getZonalBreakdown(survey.surveyId),
      surveyService.getDistrictBreakdown(survey.surveyId),
      surveyService.getDailyBreakdown(survey.surveyId, 14),
      surveyService.getTopUsers(survey.surveyId, 1000),
      surveyService.getLocationBreakdown(survey.surveyId),
      surveyService.getQuestionAnalytics(survey.surveyId),
    ]).then(([zonalRes, districtRes, dailyRes, usersRes, locRes, chartsRes]) => {
      if (zonalRes.success && Array.isArray(zonalRes.data)) setZonalStats(zonalRes.data.filter((s: ZonalStat) => s && s.zone && typeof s.count === 'number'));
      if (districtRes.success && Array.isArray(districtRes.data)) setDistrictStats(districtRes.data.filter((s: DistrictStat) => s && s.district && typeof s.count === 'number'));
      if (dailyRes.success && Array.isArray(dailyRes.data)) setDailyStats(dailyRes.data.filter((s: DailyStat) => s && s.date && typeof s.count === 'number'));
      if (usersRes.success && Array.isArray(usersRes.data)) setTopUsers(usersRes.data.filter((u: UserStat) => u && u.userId && typeof u.total === 'number'));
      if (locRes.success && Array.isArray(locRes.data)) setLocationPoints(locRes.data);
      if (chartsRes.success && Array.isArray(chartsRes.data)) setQuestionCharts(chartsRes.data);
      setIsLoadingDetails(false);
    }).catch(() => {
      setQuestionCharts([]);
      setIsLoadingDetails(false);
    });
  }, [survey.surveyId]);

  if (isLoadingDetails) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {isRespondentSurvey ? (
        /* Respondent survey — charts + map + response list */
        (() => {
          const RESPONSES_PAGE_SIZE = 5;
          const q = responsesSearch.trim().toLowerCase();
          const filteredUsers = q
            ? topUsers.filter((u) => (u?.displayName || '').toLowerCase().includes(q) || (u?.userId || '').toLowerCase().includes(q))
            : topUsers;
          const totalResponsePages = Math.max(1, Math.ceil(filteredUsers.length / RESPONSES_PAGE_SIZE));
          const clampedPage = Math.min(responsesPage, totalResponsePages - 1);
          const pageStart = clampedPage * RESPONSES_PAGE_SIZE;
          const pageItems = filteredUsers.slice(pageStart, pageStart + RESPONSES_PAGE_SIZE);

          return (
            <div>
              <div className="flex justify-end mb-4">
                <button onClick={onDownload} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors">
                  Download CSV
                </button>
              </div>

              <div className="flex gap-5 items-start">
                {/* LEFT — Question charts */}
                <div className="flex-[3] min-w-0">
                  <Suspense fallback={<div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-48 animate-pulse bg-gray-50 rounded-xl border border-gray-200" />)}</div>}>
                    <SurveyQuestionCharts questions={questionCharts} isLoading={false} />
                  </Suspense>
                </div>

                {/* RIGHT — Map + responses */}
                <div className="flex-[2] min-w-0 space-y-5">

                  {/* Response Locations */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-semibold text-gray-900">Response Locations</h3>
                      <span className="text-xs text-gray-400">({locationPoints.reduce((s, p) => s + p.count, 0)} with GPS)</span>
                    </div>
                    <Suspense fallback={<div className="h-40 bg-gray-50 rounded-lg border border-gray-200 animate-pulse" />}>
                      <SurveyLocationMap points={locationPoints} />
                    </Suspense>
                  </div>

                  {/* Responses list */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-semibold text-gray-900">Responses ({topUsers.length})</h3>
                    </div>
                    {topUsers.length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-4">No responses yet</p>
                    ) : (
                      <>
                        <div className="relative mb-2">
                          <input type="text" value={responsesSearch} onChange={(e) => { setResponsesSearch(e.target.value); setResponsesPage(0); }}
                            placeholder="Search…"
                            className="w-full pl-7 pr-7 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-gray-400" />
                          <svg className="absolute left-2 top-2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                          </svg>
                          {responsesSearch && (
                            <button onClick={() => { setResponsesSearch(''); setResponsesPage(0); }} className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                        {filteredUsers.length === 0 ? (
                          <p className="text-xs text-gray-500 text-center py-3">No matching responses</p>
                        ) : (
                          <>
                            <div className="space-y-0.5">
                              {pageItems.map((user, localIndex) => {
                                const globalIndex = pageStart + localIndex;
                                return (
                                  <div key={user?.userId || globalIndex}
                                    className="flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => user && openContributor(user)}>
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] flex-shrink-0">
                                        #{globalIndex + 1}
                                      </div>
                                      <span className="text-xs font-medium text-gray-900 truncate max-w-[130px]">
                                        {user?.displayName || (user?.userId ? `${user.userId.slice(0, 8)}...` : 'Unknown')}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-primary font-semibold flex-shrink-0">View →</span>
                                  </div>
                                );
                              })}
                            </div>
                            <MiniPager page={clampedPage} total={totalResponsePages} count={filteredUsers.length}
                              onPrev={() => setResponsesPage(p => Math.max(0, p - 1))}
                              onNext={() => setResponsesPage(p => Math.min(totalResponsePages - 1, p + 1))} />
                          </>
                        )}
                      </>
                    )}
                  </div>

                </div>
              </div>
            </div>
          );
        })()
      ) : (
        /* Agent survey analytics breakdown - two-column layout */
        <div>
          {/* Download CSV button */}
          <div className="flex justify-end mb-4">
            <button onClick={onDownload} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors">
              Download CSV
            </button>
          </div>

          <div className="flex gap-5 items-start">
            {/* LEFT — Question charts (60%) */}
            <div className="flex-[3] min-w-0">
              <Suspense fallback={<div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-48 animate-pulse bg-gray-50 rounded-xl border border-gray-200" />)}</div>}>
                <SurveyQuestionCharts questions={questionCharts} isLoading={false} />
              </Suspense>
            </div>

            {/* RIGHT — Analytics sidebar (40%) */}
            <div className="flex-[2] min-w-0 space-y-6">

              {/* Response Locations */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-gray-900">Response Locations</h3>
                  <span className="text-xs text-gray-400">({locationPoints.reduce((s, p) => s + p.count, 0)} with GPS)</span>
                </div>
                <Suspense fallback={<div className="h-40 bg-gray-50 rounded-lg border border-gray-200 animate-pulse" />}>
                  <SurveyLocationMap points={locationPoints} />
                </Suspense>
              </div>

              {/* By Zone */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-gray-900">By Zone</h3>
                </div>
                {zonalStats.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-3">No zonal data available</p>
                ) : (
                  <div className="space-y-2">
                    {zonalStats.map((stat, index) => {
                      const maxCount = Math.max(...zonalStats.map((s) => s?.count || 0), 1);
                      const percentage = ((stat?.count || 0) / maxCount) * 100;
                      return (
                        <div key={stat.zone || index}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-gray-700">{panelFormatZone(stat?.zone || 'Unknown')}</span>
                            <span className="text-gray-900 font-semibold">{panelFormatNumber(stat?.count || 0)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${panelGetZoneColor(stat?.zone || '', index)}`} style={{ width: `${Math.max(percentage, 0)}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* By District — paginated 5 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <h3 className="text-sm font-semibold text-gray-900">By District</h3>
                </div>
                {districtStats.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-3">No district data available</p>
                ) : (() => {
                  const PAGE_SIZE = 5;
                  const totalPages = Math.ceil(districtStats.length / PAGE_SIZE);
                  const cp = Math.min(districtPage, totalPages - 1);
                  const slice = districtStats.slice(cp * PAGE_SIZE, (cp + 1) * PAGE_SIZE);
                  const maxCount = Math.max(...districtStats.map(s => s?.count || 0), 1);
                  return (
                    <>
                      <div className="space-y-2">
                        {slice.map((stat, index) => {
                          const pct = ((stat?.count || 0) / maxCount) * 100;
                          return (
                            <div key={stat.district || index}>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="font-medium text-gray-700">{stat?.district || 'Unknown'}</span>
                                <span className="text-gray-900 font-semibold">{panelFormatNumber(stat?.count || 0)}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div className={`h-1.5 rounded-full ${panelGetDistrictColor(cp * PAGE_SIZE + index)}`} style={{ width: `${Math.max(pct, 0)}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <MiniPager page={cp} total={totalPages} count={districtStats.length}
                        onPrev={() => setDistrictPage(p => Math.max(0, p - 1))}
                        onNext={() => setDistrictPage(p => Math.min(totalPages - 1, p + 1))} />
                    </>
                  );
                })()}
              </div>

              {/* Last 14 Days — paginated 5 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-gray-900">Last 14 Days</h3>
                </div>
                {dailyStats.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-3">No daily data available</p>
                ) : (() => {
                  const PAGE_SIZE = 5;
                  const totalPages = Math.ceil(dailyStats.length / PAGE_SIZE);
                  const cp = Math.min(dailyPage, totalPages - 1);
                  const slice = dailyStats.slice(cp * PAGE_SIZE, (cp + 1) * PAGE_SIZE);
                  return (
                    <>
                      <div className="space-y-1.5">
                        {slice.map((stat, idx) => (
                          <div key={stat?.date || idx} className="flex justify-between items-center text-xs">
                            <span className="text-gray-600">{stat?.date ? panelFormatDate(stat.date) : 'Unknown'}</span>
                            <span className="font-semibold text-gray-900">{panelFormatNumber(stat?.count ?? 0)}</span>
                          </div>
                        ))}
                      </div>
                      <MiniPager page={cp} total={totalPages} count={dailyStats.length}
                        onPrev={() => setDailyPage(p => Math.max(0, p - 1))}
                        onNext={() => setDailyPage(p => Math.min(totalPages - 1, p + 1))} />
                    </>
                  );
                })()}
              </div>

              {/* Top Contributors — paginated 5 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-gray-900">Top Contributors</h3>
                </div>
                {topUsers.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-3">No contributor data available</p>
                ) : (() => {
                  const PAGE_SIZE = 5;
                  const totalPages = Math.ceil(topUsers.length / PAGE_SIZE);
                  const cp = Math.min(contributorsPage, totalPages - 1);
                  const slice = topUsers.slice(cp * PAGE_SIZE, (cp + 1) * PAGE_SIZE);
                  return (
                    <>
                      <div className="space-y-2">
                        {slice.map((user, index) => {
                          const globalIndex = cp * PAGE_SIZE + index;
                          return (
                            <div key={user?.userId || index} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                                  #{globalIndex + 1}
                                </div>
                                <div>
                                  <div className="text-xs font-medium text-gray-900 truncate max-w-[110px]">
                                    {user?.displayName || (user?.userId ? `${user.userId.slice(0, 8)}...` : 'Unknown')}
                                  </div>
                                  <div className="text-[10px] text-gray-500">{panelFormatZone(user?.zone || 'Unknown')}</div>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="text-xs font-semibold text-gray-900">{panelFormatNumber(user?.total ?? 0)}</div>
                                <div className="text-[10px] text-orange-600">+{user?.todayCount ?? 0} today</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <MiniPager page={cp} total={totalPages} count={topUsers.length}
                        onPrev={() => setContributorsPage(p => Math.max(0, p - 1))}
                        onNext={() => setContributorsPage(p => Math.min(totalPages - 1, p + 1))} />
                    </>
                  );
                })()}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Contributor Answers Modal */}
      {selectedContributor !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 truncate pr-4">
                {selectedContributor.displayName || (selectedContributor.userId ? `${selectedContributor.userId.slice(0, 8)}...` : 'Contributor')}
              </h2>
              <button onClick={() => { setSelectedContributor(null); setContributorModalData(null); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none flex-shrink-0">✕</button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              {isLoadingContributorModal ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
              ) : contributorModalData?.response == null ? (
                <p className="text-gray-500 text-sm text-center py-8">No response found for this contributor.</p>
              ) : (
                <>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5 text-sm space-y-1">
                    {contributorModalData.response.respondent?.name && (
                      <div className="flex gap-3"><span className="text-gray-500 w-20 flex-shrink-0">Name</span><span className="text-gray-900">{contributorModalData.response.respondent.name}</span></div>
                    )}
                    {contributorModalData.response.respondent?.phone && (
                      <div className="flex gap-3"><span className="text-gray-500 w-20 flex-shrink-0">Phone</span><span className="text-gray-900">{contributorModalData.response.respondent.phone}</span></div>
                    )}
                    {contributorModalData.response.respondent?.email && (
                      <div className="flex gap-3"><span className="text-gray-500 w-20 flex-shrink-0">Email</span><span className="text-gray-900">{contributorModalData.response.respondent.email}</span></div>
                    )}
                    {contributorModalData.response.submittedAt && (
                      <div className="flex gap-3"><span className="text-gray-500 w-20 flex-shrink-0">Submitted</span><span className="text-gray-900">{new Date(contributorModalData.response.submittedAt).toLocaleString()}</span></div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {contributorModalData.questions.map((q: any) => {
                      const answerMap = new Map<string, any>();
                      (contributorModalData.response.answers || []).forEach((a: any) => answerMap.set(a.questionId, a));
                      const entry = answerMap.get(q.id);
                      const answerText = entry ? formatAnswerForDisplay(entry.answer, entry.questionType || q.questionType, q.config?.options) : '—';
                      return (
                        <div key={q.id}>
                          <p className="text-xs font-semibold text-gray-500 mb-1">{q.text}</p>
                          <p className="text-sm text-gray-900">{answerText}</p>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export interface SurveyDownloadModalProps {
  survey: ISurvey;
  isOpen: boolean;
  onClose: () => void;
}

export const SurveyDownloadModal: React.FC<SurveyDownloadModalProps> = ({ survey, isOpen, onClose }) => {
  const [timePeriod, setTimePeriod] = useState<'1day' | '3days' | '1week' | '1month' | 'custom'>('1week');
  const [customFromDate, setCustomFromDate] = useState('');
  const [customToDate, setCustomToDate] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const getDateRange = () => {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    switch (timePeriod) {
      case '1day': { const s = new Date(now); s.setDate(s.getDate() - 1); s.setHours(0, 0, 0, 0); return { startDate: s.toISOString(), endDate: end.toISOString() }; }
      case '3days': { const s = new Date(now); s.setDate(s.getDate() - 3); s.setHours(0, 0, 0, 0); return { startDate: s.toISOString(), endDate: end.toISOString() }; }
      case '1week': { const s = new Date(now); s.setDate(s.getDate() - 7); s.setHours(0, 0, 0, 0); return { startDate: s.toISOString(), endDate: end.toISOString() }; }
      case '1month': { const s = new Date(now); s.setMonth(s.getMonth() - 1); s.setHours(0, 0, 0, 0); return { startDate: s.toISOString(), endDate: end.toISOString() }; }
      case 'custom': {
        const s = new Date(customFromDate); s.setHours(0, 0, 0, 0);
        const e = new Date(customToDate); e.setHours(23, 59, 59, 999);
        return { startDate: s.toISOString(), endDate: e.toISOString() };
      }
      default: return { startDate: undefined, endDate: undefined };
    }
  };

  const escapeField = (value: string): string => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const formatPhone = (phone: string | undefined): string => phone ? `\t${phone}` : '';
  const fieldKeyToLabel = (key: string): string => key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim();
  const formatRawField = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object' && !Array.isArray(value) && value.url) return value.url;
    if (Array.isArray(value)) return value.join('; ');
    return String(value);
  };
  const formatAnswer = (answer: any, questionType: string, options?: Array<{ value: string; label: string }>): string => {
    if (answer === null || answer === undefined || answer === '') return '';
    const resolveLabel = (raw: string): string => { const m = options?.find((o) => o.value === raw); return m ? m.label : raw; };
    switch (questionType) {
      case 'mcq-single': return resolveLabel(typeof answer === 'object' ? JSON.stringify(answer) : String(answer));
      case 'mcq-multiple': return Array.isArray(answer) ? answer.map((v) => resolveLabel(String(v))).join('; ') : String(answer);
      case 'double-slider': return answer && typeof answer === 'object' ? `${answer.min} - ${answer.max}` : String(answer);
      case 'ranking': return Array.isArray(answer) ? answer.join(' > ') : String(answer);
      case 'max-diff':
        if (answer && typeof answer === 'object') {
          const best = Object.entries(answer).filter(([, v]) => v === 'best').map(([k]) => k).join('; ');
          const worst = Object.entries(answer).filter(([, v]) => v === 'worst').map(([k]) => k).join('; ');
          return `Best: ${best} | Worst: ${worst}`;
        }
        return String(answer);
      case 'multi-slider': case 'matrix': case 'constant-sum':
        return answer && typeof answer === 'object' ? Object.entries(answer).map(([k, v]) => `${k}: ${v}`).join('; ') : String(answer);
      case 'file': return (answer && typeof answer === 'object') ? (answer.url || '') : (typeof answer === 'string' ? answer : '');
      case 'currency': return answer !== null && answer !== undefined ? `₹${answer}` : '';
      default: return typeof answer === 'object' ? JSON.stringify(answer) : String(answer);
    }
  };

  const handleDownload = async () => {
    if (!survey.surveyId) return;
    try {
      setIsDownloading(true);
      const { startDate, endDate } = getDateRange();
      const [detailsResult, responsesResult] = await Promise.allSettled([
        surveyService.getSurveyDetails(survey.surveyId),
        surveyService.getSurveyResponses(survey.surveyId, { startDate, endDate, limit: 10000 }),
      ]);
      if (responsesResult.status === 'rejected') { alert('Failed to fetch responses. Please try again.'); return; }
      const responses: any[] = Array.isArray(responsesResult.value.data) ? responsesResult.value.data : [];
      if (responses.length === 0) { alert('No responses found for the selected time period.'); return; }

      let questions: any[] = detailsResult.status === 'fulfilled' ? detailsResult.value.data?.template?.questions || [] : [];
      if (questions.length === 0) {
        const idSet = new Set<string>();
        responses.forEach((r: any) => (r.answers || []).forEach((a: any) => { if (a.questionId) idSet.add(a.questionId); }));
        questions = Array.from(idSet).map((id) => ({ id, text: id }));
      }
      questions = [...questions].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      const templateCaptureFields: any[] = detailsResult.status === 'fulfilled' ? detailsResult.value.data?.template?.settings?.captureFields || [] : [];
      let fallbackCaptureFields: Array<{ key: string; label: string; storePath: 'respondent' | 'root' }> = [];
      if (templateCaptureFields.length === 0) {
        const STANDARD_RESPONDENT_KEYS = new Set(['name', 'email', 'phone', 'userId']);
        const STANDARD_RESPONSE_KEYS = new Set(['_id', 'surveyId', 'surveyTemplateId', 'respondent', 'answers', 'status', 'submittedAt', 'captureData']);
        const seenKeys = new Set<string>();
        responses.forEach((response: any) => {
          if (response.respondent && typeof response.respondent === 'object') {
            Object.keys(response.respondent).forEach((key) => {
              const uid = `respondent::${key}`;
              if (!STANDARD_RESPONDENT_KEYS.has(key) && !seenKeys.has(uid)) { seenKeys.add(uid); fallbackCaptureFields.push({ key, label: fieldKeyToLabel(key), storePath: 'respondent' }); }
            });
          }
          Object.keys(response).forEach((key) => {
            const uid = `root::${key}`;
            if (!STANDARD_RESPONSE_KEYS.has(key) && !seenKeys.has(uid)) { seenKeys.add(uid); fallbackCaptureFields.push({ key, label: fieldKeyToLabel(key), storePath: 'root' }); }
          });
        });
      }
      const captureFields = templateCaptureFields.length > 0 ? templateCaptureFields : fallbackCaptureFields;
      const resolveCaptureValue = (response: any, field: any): string => {
        const path = field.storePath || 'root';
        let raw: any;
        if (path === 'respondent') raw = response.respondent?.[field.key];
        else if (path === 'captureData') raw = response.captureData?.[field.key];
        else raw = response[field.key];
        return formatRawField(raw);
      };

      const headers = [
        'Submitted At', 'Status', 'Respondent Name', 'Respondent Email', 'Respondent Phone', 'User ID',
        'Zone', 'District', 'AC Name', 'Latitude', 'Longitude',
        ...captureFields.map((f: any) => f.label),
        ...questions.flatMap((q: any) => [`${q.id}: ${q.text}`, ...(q.allowComment ? [`${q.id}: ${q.text} (Comment)`] : [])]),
      ];
      const rows = responses.map((response: any) => {
        const answerMap = new Map<string, any>();
        (response.answers || []).forEach((a: any) => answerMap.set(a.questionId, a));
        return [
          new Date(response.submittedAt).toLocaleString(), response.status || '',
          response.respondent?.name || '', response.respondent?.email || '',
          formatPhone(response.respondent?.phone), response.respondent?.userId || '',
          response.submitterZone ?? '', response.submitterDistrict ?? '', response.submitterAc ?? '',
          response.location?.latitude ?? '', response.location?.longitude ?? '',
          ...captureFields.map((f: any) => resolveCaptureValue(response, f)),
          ...questions.flatMap((q: any) => {
            const entry = answerMap.get(q.id);
            return [entry ? formatAnswer(entry.answer, entry.questionType || q.questionType, q.config?.options) : '', ...(q.allowComment ? [entry?.comment || ''] : [])];
          }),
        ].map(escapeField).join(',');
      });

      const csv = [headers.map(escapeField).join(','), ...rows].join('\n');
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${survey.surveyId}_${timePeriod}_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      onClose();
    } catch (err) {
      console.error('[Download CSV] Error:', err);
      alert('Failed to download responses. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Download Responses</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>
        <p className="text-sm text-gray-600 mb-5">
          <span className="font-medium">{survey.label}</span>
          {survey.surveyId && <span className="ml-2 text-black">({survey.surveyId})</span>}
        </p>
        <div className="mb-4 text-black">
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
          <select value={timePeriod} onChange={(e) => setTimePeriod(e.target.value as typeof timePeriod)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white">
            <option value="1day">Last 1 Day</option>
            <option value="3days">Last 3 Days</option>
            <option value="1week">Last 1 Week</option>
            <option value="1month">Last 1 Month</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
        {timePeriod === 'custom' && (
          <div className="grid grid-cols-2 gap-4 mb-4 text-black">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input type="date" value={customFromDate} onChange={(e) => setCustomFromDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input type="date" value={customToDate} onChange={(e) => setCustomToDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
            </div>
          </div>
        )}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
          <button onClick={handleDownload} disabled={isDownloading || (timePeriod === 'custom' && (!customFromDate || !customToDate))}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            {isDownloading ? (<><Loader2 className="w-4 h-4 animate-spin" />Downloading...</>) : 'Download as CSV'}
          </button>
        </div>
      </div>
    </div>
  );
};
