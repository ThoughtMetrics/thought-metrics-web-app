import React, { useState, useEffect } from 'react';
import { useAuth } from '@/shared/providers/auth-provider';
import ClientSidebar from '@/shared/components/client/ClientSidebar';
import ClientRouteGuard from '@/shared/components/guards/ClientRouteGuard';
import { LoaderUI } from '@/shared/ui/atoms/loader/LoaderUI';
import { toast } from 'sonner';
import ApiService from '@/services/api/api.service';
import authService from '@/services/api/auth.service';
import MethodologyPickerModal from '@/shared/screens/admin/survey-builder/components/MethodologyPickerModal';

interface Template {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedSurveyId?: string | null;
  settings?: { methodology?: string };
  questions?: any[];
}

const STATUS_BADGE: Record<string, string> = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-amber-100 text-amber-700',
};

const ClientSurveysContent: React.FC = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState('');
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const firebaseUser = authService.getCurrentUser();
      if (firebaseUser) ApiService.setAuthToken(await firebaseUser.getIdToken());

      const res = await ApiService.get<any>('/surveys/templates', {
        page, limit, search: search || undefined,
      });
      const d = res.data;
      if (d) {
        setTemplates(d.templates || d.data || []);
        setTotal(d.total || 0);
      }
    } catch {
      toast.error('Failed to load surveys');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTemplates(); }, [page, search]);

  const handleDuplicate = (t: Template) => {
    sessionStorage.setItem('survey-builder-prefill', JSON.stringify({
      isDuplicate: true,
      name: `${t.name} (Copy)`,
      questions: (t as any).questions || [],
      settings: t.settings || {},
    }));
    window.location.href = '/client/survey-builder/new';
    setOpenMenuId(null);
  };

  const handleDelete = async (t: Template) => {
    if (!confirm(`Delete "${t.name}"? This cannot be undone.`)) return;
    try {
      await ApiService.delete(`/surveys/templates/${t._id}`);
      toast.success('Survey deleted');
      fetchTemplates();
    } catch {
      toast.error('Failed to delete survey');
    }
    setOpenMenuId(null);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="h-full flex bg-gray-50 text-text-dark">
      <ClientSidebar />

      <main className="h-full overflow-y-scroll flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Surveys</h1>
              <p className="text-gray-500 mt-1">{total} survey{total !== 1 ? 's' : ''}</p>
            </div>
            <button
              onClick={() => setShowPickerModal(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              + New Survey
            </button>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <input
              type="text"
              placeholder="Search surveys..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 flex justify-center"><LoaderUI message="Loading..." /></div>
            ) : templates.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No surveys yet.{' '}
                <button onClick={() => setShowPickerModal(true)} className="text-primary hover:underline">Create your first survey</button>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Methodology</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Questions</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Updated</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {templates.map((t) => {
                    const status = t.publishedSurveyId ? 'published' : 'draft';
                    return (
                      <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          <a href={`/client/survey-builder/${t._id}`} className="hover:text-primary">
                            {t.name || '(Untitled)'}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-gray-500 capitalize">
                          {t.settings?.methodology?.replace(/_/g, ' ') || 'Standard'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[status] || 'bg-gray-100 text-gray-600'}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{(t as any).questions?.length ?? '—'}</td>
                        <td className="px-4 py-3 text-gray-500">{t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : '—'}</td>
                        <td className="px-4 py-3 relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === t._id ? null : t._id)}
                            className="p-1 rounded hover:bg-gray-100 text-gray-500"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                            </svg>
                          </button>
                          {openMenuId === t._id && (
                            <div className="absolute right-4 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40 py-1">
                              <a href={`/client/survey-builder/${t._id}`} className="block px-4 py-2 text-sm hover:bg-gray-50">Edit</a>
                              <button onClick={() => handleDuplicate(t)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">Duplicate</button>
                              <button onClick={() => handleDelete(t)} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">Delete</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded border text-sm disabled:opacity-40">Prev</button>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded border text-sm disabled:opacity-40">Next</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {showPickerModal && (
        <MethodologyPickerModal
          onClose={() => setShowPickerModal(false)}
          redirectPath="/client/survey-builder/new"
        />
      )}

      {openMenuId && <div className="fixed inset-0 z-0" onClick={() => setOpenMenuId(null)} />}
    </div>
  );
};

const ClientSurveys: React.FC = () => (
  <ClientRouteGuard>
    <ClientSurveysContent />
  </ClientRouteGuard>
);

export default ClientSurveys;
