import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Loader2, RefreshCw, TrendingUp, Users, MapPin, Calendar, Search, Filter } from 'lucide-react';
import { useAuth } from '@/shared/providers/auth-provider';
import AdminSidebar from '@/shared/components/admin/AdminSidebar';
import AdminRouteGuard from '@/shared/components/guards/AdminRouteGuard';
import surveyService from '@services/survey/survey.service';
import type { ISurvey } from '@/core/types/survey.type';

interface SurveyWithAnalytics extends ISurvey {
  totalSubmissions: number;
  todaySubmissions: number;
}

interface ZonalStat {
  zone: string;
  count: number;
}

interface DailyStat {
  date: string;
  count: number;
}

interface UserStat {
  userId: string;
  total: number;
  zone: string;
  todayCount: number;
}

export const SurveyAnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [surveys, setSurveys] = useState<SurveyWithAnalytics[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null);
  const [zonalStats, setZonalStats] = useState<ZonalStat[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [topUsers, setTopUsers] = useState<UserStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'respondent' | 'agent'>('all');

  // Filter surveys client-side for instant feedback
  const filteredSurveys = useMemo(() => {
    return surveys.filter((survey) => {
      const matchesSearch = !searchQuery ||
        (survey.label || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (survey.surveyId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (survey.industry || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || survey.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [surveys, searchQuery, typeFilter]);

  // Load surveys list with analytics
  const loadSurveys = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await surveyService.listPublicSurveys({
        status: 'published',
        limit: 100,
      });

      if (response.success && response.data) {
        // Ensure data is an array and filter out invalid entries
        const validSurveys = Array.isArray(response.data)
          ? response.data.filter(s => s && s.id && s.surveyId)
          : [];
        setSurveys(validSurveys as SurveyWithAnalytics[]);
      } else {
        // If no data or failed, set empty array
        setSurveys([]);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('[Survey Analytics] Load error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load surveys');
      setSurveys([]); // Clear surveys on error
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
      setDailyStats([]);
      setTopUsers([]);

      // Validate surveyId
      if (!surveyId) {
        setError('Invalid survey ID');
        setIsLoadingDetails(false);
        return;
      }

      // Load analytics data in parallel
      const [zonalRes, dailyRes, usersRes] = await Promise.all([
        surveyService.getZonalBreakdown(surveyId),
        surveyService.getDailyBreakdown(surveyId, 14), // Last 14 days
        surveyService.getTopUsers(surveyId, 10),
      ]);

      // Validate and set zonal stats
      if (zonalRes.success && zonalRes.data && Array.isArray(zonalRes.data)) {
        const validZonalStats = zonalRes.data.filter(s => s && s.zone && typeof s.count === 'number');
        setZonalStats(validZonalStats);
      } else {
        setZonalStats([]);
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

      setIsLoadingDetails(false);
    } catch (err) {
      console.error('[Survey Analytics] Details load error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load survey details');
      // Clear data on error
      setZonalStats([]);
      setDailyStats([]);
      setTopUsers([]);
      setIsLoadingDetails(false);
    }
  };

  // Load surveys when component mounts
  useEffect(() => {
    loadSurveys();
  }, []); // Run once on mount - AdminRouteGuard ensures user is authenticated

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

  const getZoneColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-red-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <AdminRouteGuard>
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
                            {searchQuery || typeFilter !== 'all'
                              ? 'No surveys match your filters'
                              : 'No surveys found'}
                          </td>
                        </tr>
                      ) : (
                        filteredSurveys.map((survey) => (
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
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (survey.surveyId) {
                                    loadSurveyDetails(survey.surveyId);
                                  }
                                }}
                                disabled={!survey.surveyId}
                                className="text-primary hover:underline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right: Analytics Details */}
            <div className="lg:col-span-1">
              {selectedSurvey ? (
                isLoadingDetails ? (
                  <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center h-64">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-6">
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
                                    className={`h-2 rounded-full ${getZoneColor(index)}`}
                                    style={{ width: `${Math.max(percentage, 0)}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
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
                                    {user?.userId ? `${user.userId.slice(0, 8)}...` : 'Unknown'}
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
    </AdminRouteGuard>
  );
};

export default SurveyAnalyticsDashboard;
