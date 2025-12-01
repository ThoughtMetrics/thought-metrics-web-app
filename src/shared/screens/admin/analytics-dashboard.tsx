import React, { useEffect, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '@/shared/providers/auth-provider';

const API_BASE = 'http://localhost:3000/api/v1';

interface OverviewData {
  uniqueVisitors: number;
  totalSessions: number;
  pageViews: number;
  registrations: number;
}

interface LinkData {
  id: string;
  name: string;
  shortCode: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  fullTrackingUrl: string;
  stats: {
    uniqueVisitors: number;
    registrations: number;
  };
}

interface VisitorData {
  id: string;
  lastUtmSource: string;
  lastUtmMedium: string;
  city: string;
  country: string;
  isRegistered: boolean;
  firstSeenAt: string;
}

export const AnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [visitors, setVisitors] = useState<VisitorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get auth headers
  const getAuthHeaders = async () => {
    if (!user) {
      console.error('[Analytics] No user available');
      throw new Error('Not authenticated');
    }
    const token = await user.getIdToken();
    console.log('[Analytics] Got auth token, length:', token.length);
    return {
      'Authorization': `Bearer firebase:${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Load all data
  const loadData = async () => {
    try {
      setError(null);
      console.log('[Analytics] Loading all data...');
      const headers = await getAuthHeaders();

      // Load overview
      console.log('[Analytics] Fetching overview...');
      const overviewRes = await fetch(`${API_BASE}/analytics/overview`, {
        headers,
        credentials: 'include',
      });
      console.log('[Analytics] Overview status:', overviewRes.status);

      if (overviewRes.ok) {
        const overviewData = await overviewRes.json();
        console.log('[Analytics] Overview data:', overviewData);
        setOverview(overviewData.data);
      } else {
        const errorText = await overviewRes.text();
        console.error('[Analytics] Overview error:', errorText);
      }

      // Load links
      console.log('[Analytics] Fetching links...');
      const linksRes = await fetch(`${API_BASE}/analytics/links`, {
        headers,
        credentials: 'include',
      });
      console.log('[Analytics] Links status:', linksRes.status);

      if (linksRes.ok) {
        const linksData = await linksRes.json();
        console.log('[Analytics] Links data:', linksData);
        setLinks(linksData.data || []);
      } else {
        const errorText = await linksRes.text();
        console.error('[Analytics] Links error:', errorText);
      }

      // Load visitors
      console.log('[Analytics] Fetching visitors...');
      const visitorsRes = await fetch(`${API_BASE}/analytics/visitors?limit=20`, {
        headers,
        credentials: 'include',
      });
      console.log('[Analytics] Visitors status:', visitorsRes.status);

      if (visitorsRes.ok) {
        const visitorsData = await visitorsRes.json();
        console.log('[Analytics] Visitors data:', visitorsData);
        setVisitors(visitorsData.data || []);
      } else {
        const errorText = await visitorsRes.text();
        console.error('[Analytics] Visitors error:', errorText);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('[Analytics] Load error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
      setIsLoading(false);
    }
  };

  // Load data when user is ready
  useEffect(() => {
    if (user) {
      console.log('[Analytics] User ready, loading data for:', user.email);
      loadData();

      // Auto-refresh every 30 seconds
      const interval = setInterval(loadData, 30000);
      return () => clearInterval(interval);
    } else {
      console.log('[Analytics] Waiting for user...');
    }
  }, [user]);

  // Format helpers
  const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-4 py-2 text-primary hover:text-primary/80 font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <a
              href="/admin/create-tracking-link"
              className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              + Create New Link
            </a>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Unique Visitors</p>
                <p className="text-3xl font-bold text-gray-900">
                  {overview ? formatNumber(overview.uniqueVisitors) : '0'}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-900">
                  {overview ? formatNumber(overview.totalSessions) : '0'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Page Views</p>
                <p className="text-3xl font-bold text-gray-900">
                  {overview ? formatNumber(overview.pageViews) : '0'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Registrations</p>
                <p className="text-3xl font-bold text-gray-900">
                  {overview ? formatNumber(overview.registrations) : '0'}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Links Table */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Tracking Links Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UTM Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitors</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registrations</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {links.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No tracking links found. <a href="/admin/create-tracking-link" className="text-primary hover:underline">Create one now</a>
                    </td>
                  </tr>
                ) : (
                  links.map((link) => {
                    const visitors = link.stats?.uniqueVisitors || 0;
                    const registrations = link.stats?.registrations || 0;
                    const conversion = visitors > 0 ? ((registrations / visitors) * 100).toFixed(1) : '0.0';

                    return (
                      <tr key={link.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{link.name}</div>
                          {link.utmCampaign && <div className="text-xs text-gray-500">{link.utmCampaign}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{link.utmSource || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">{link.shortCode}</code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(visitors)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(registrations)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            parseFloat(conversion) >= 10 ? 'bg-green-100 text-green-800' :
                            parseFloat(conversion) >= 5 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {conversion}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => copyLink(link.fullTrackingUrl)}
                            className="text-primary hover:text-primary/80 font-medium"
                          >
                            Copy Link
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Visitors */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Visitors</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Seen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {visitors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No visitors yet</td>
                  </tr>
                ) : (
                  visitors.map((visitor) => (
                    <tr key={visitor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{visitor.id.slice(0, 8)}...</code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {visitor.lastUtmSource || '-'}
                        {visitor.lastUtmMedium && <span className="text-gray-400">/{visitor.lastUtmMedium}</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {visitor.city || ''} {visitor.country || ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {visitor.isRegistered ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Yes</span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(visitor.firstSeenAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
