import React, { useState, useEffect } from 'react';
import { useAuth } from '@/shared/providers/auth-provider';
import AdminSidebar from '@/shared/components/admin/AdminSidebar';
import AdminRouteGuard from '@/shared/components/guards/AdminRouteGuard';
import UserManagementService from '@/services/api/user-management.service';
import type { CompanyListItem } from '@/services/api/user-management.service';
import { toast } from 'sonner';
import { LoaderUI } from '@/shared/ui/atoms/loader/LoaderUI';

const CLIENT_QUOTA_BYTES = 20 * 1024 * 1024;

function StorageBar({ used = 0, quota = CLIENT_QUOTA_BYTES }: { used?: number; quota?: number | null }) {
  const q = quota ?? CLIENT_QUOTA_BYTES;
  const pct = Math.min(100, Math.round((used / q) * 100));
  const color = pct >= 95 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-400' : 'bg-indigo-500';
  const fmt = (b: number) => b < 1048576 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1048576).toFixed(1)} MB`;
  return (
    <div className="flex items-center gap-2 min-w-[140px]">
      <div className="flex-1 bg-surface-container-high rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-outline whitespace-nowrap">{fmt(used)} / {fmt(q)}</span>
    </div>
  );
}

const ClientsManagementContent: React.FC = () => {
  const { user, isAuthReady } = useAuth();
  const [companies, setCompanies] = useState<CompanyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [search, setSearch] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Create modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: '', firstName: '', lastName: '', companyName: '', sendWelcomeEmail: true,
  });

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState<CompanyListItem | null>(null);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', companyName: '', dashboardUrl: '' });

  const fetchCompanies = async () => {
    if (!isAuthReady || !user) return;
    setLoading(true);
    try {
      const res = await UserManagementService.getCompanies({ page, limit, search: search || undefined });
      if (res.data) {
        setCompanies(res.data.companies);
        setTotal(res.data.total);
      }
    } catch {
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCompanies(); }, [isAuthReady, user, page, search]);

  const handleCreate = async () => {
    setCreateLoading(true);
    try {
      await UserManagementService.adminCreateUser({
        email: createForm.email,
        firstName: createForm.firstName,
        lastName: createForm.lastName || undefined,
        role: 'client',
        companyName: createForm.companyName || undefined,
        sendWelcomeEmail: createForm.sendWelcomeEmail,
      });
      toast.success('Company created successfully');
      setShowCreateModal(false);
      setCreateForm({ email: '', firstName: '', lastName: '', companyName: '', sendWelcomeEmail: true });
      fetchCompanies();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create company');
    } finally {
      setCreateLoading(false);
    }
  };

  const openEdit = (company: CompanyListItem) => {
    setEditTarget(company);
    setEditForm({
      firstName: company.ownerProfile?.firstName || '',
      lastName: company.ownerProfile?.lastName || '',
      companyName: company.companyName || '',
      dashboardUrl: company.dashboardUrl || '',
    });
    setShowEditModal(true);
    setOpenMenuId(null);
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    try {
      await UserManagementService.updateUser(editTarget.ownerId, {
        profile: { firstName: editForm.firstName, lastName: editForm.lastName },
        companyName: editForm.companyName,
        dashboardUrl: editForm.dashboardUrl,
      });
      toast.success('Company updated');
      setShowEditModal(false);
      fetchCompanies();
    } catch {
      toast.error('Failed to update company');
    }
  };

  const handleOpenWebsite = (company: CompanyListItem) => {
    const url = company.dashboardUrl;
    if (!url) {
      toast.error('No website URL set for this company — add one via Edit.');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
    setOpenMenuId(null);
  };

  const handleDelete = async (company: CompanyListItem) => {
    if (!confirm(`Deactivate ${company.companyName || company.ownerEmail}? This deactivates the company owner's account.`)) return;
    try {
      await UserManagementService.deleteUser(company.ownerId);
      toast.success('Company owner deactivated');
      fetchCompanies();
    } catch {
      toast.error('Failed to deactivate company');
    }
    setOpenMenuId(null);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="h-full flex bg-surface-container-low text-text-dark">
      <AdminSidebar />

      <main className="h-full overflow-y-auto flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-on-surface">Companies</h1>
              <p className="text-outline mt-1">{total} compan{total !== 1 ? 'ies' : 'y'} total</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary text-on-primary px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              + Create Company
            </button>
          </div>

          {/* Search */}
          <div className="bg-surface-container rounded-lg shadow-sm p-4 mb-4">
            <input
              type="text"
              placeholder="Search by company, name, or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="border border-outline-variant rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface-container-low text-on-surface"
            />
          </div>

          {/* Table */}
          <div className="bg-surface-container rounded-lg shadow-sm">
            {loading ? (
              <div className="p-12 flex justify-center"><LoaderUI message="Loading companies..." /></div>
            ) : companies.length === 0 ? (
              <div className="p-12 text-center text-outline">No companies found.</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-on-surface-variant">Company</th>
                    <th className="px-4 py-3 text-left font-medium text-on-surface-variant">Owner</th>
                    <th className="px-4 py-3 text-left font-medium text-on-surface-variant">Members</th>
                    <th className="px-4 py-3 text-left font-medium text-on-surface-variant">Storage</th>
                    <th className="px-4 py-3 text-left font-medium text-on-surface-variant">Joined</th>
                    <th className="px-4 py-3 text-left font-medium text-on-surface-variant">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {companies.map((company) => (
                    <tr key={company.companyId} className="hover:bg-surface-container-high transition-colors">
                      <td className="px-4 py-3 font-medium text-on-surface">
                        {company.companyName || '—'}
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant">
                        <div>{company.ownerProfile?.firstName} {company.ownerProfile?.lastName}</div>
                        <div className="text-xs text-outline">{company.ownerEmail}</div>
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant">
                        {company.memberCount} member{company.memberCount !== 1 ? 's' : ''}
                      </td>
                      <td className="px-4 py-3">
                        <StorageBar used={company.storageUsed ?? 0} quota={company.storageQuota} />
                      </td>
                      <td className="px-4 py-3 text-outline">
                        {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3 relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === company.companyId ? null : company.companyId)}
                          className="p-1 rounded hover:bg-surface-container-high text-outline"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                          </svg>
                        </button>
                        {openMenuId === company.companyId && (
                          <div className="absolute right-4 top-10 bg-surface-container border border-outline-variant rounded-lg shadow-lg z-10 w-40 py-1">
                            <button onClick={() => openEdit(company)} className="w-full px-4 py-2 text-left text-sm hover:bg-surface-container-high">Edit</button>
                            <a
                              href={`/admin/surveys?companyId=${encodeURIComponent(company.companyId)}&clientName=${encodeURIComponent(company.companyName || company.ownerEmail || '')}`}
                              className="block px-4 py-2 text-sm hover:bg-surface-container-high"
                            >
                              View Surveys
                            </a>
                            <button onClick={() => handleOpenWebsite(company)} className="w-full px-4 py-2 text-left text-sm hover:bg-surface-container-high">Open Website</button>
                            <button onClick={() => handleDelete(company)} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">Deactivate</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-outline">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded border border-outline-variant text-sm disabled:opacity-40">Prev</button>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded border border-outline-variant text-sm disabled:opacity-40">Next</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-container rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create Company</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-on-surface-variant">Email *</label>
                <input type="email" value={createForm.email} onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))}
                  className="mt-1 w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface-container-low" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-on-surface-variant">First Name *</label>
                  <input type="text" value={createForm.firstName} onChange={e => setCreateForm(f => ({ ...f, firstName: e.target.value }))}
                    className="mt-1 w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface-container-low" />
                </div>
                <div>
                  <label className="text-sm font-medium text-on-surface-variant">Last Name</label>
                  <input type="text" value={createForm.lastName} onChange={e => setCreateForm(f => ({ ...f, lastName: e.target.value }))}
                    className="mt-1 w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface-container-low" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-on-surface-variant">Company Name</label>
                <input type="text" value={createForm.companyName} onChange={e => setCreateForm(f => ({ ...f, companyName: e.target.value }))}
                  className="mt-1 w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface-container-low" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={createForm.sendWelcomeEmail} onChange={e => setCreateForm(f => ({ ...f, sendWelcomeEmail: e.target.checked }))} />
                Send welcome email with login credentials
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg border border-outline-variant text-sm">Cancel</button>
              <button onClick={handleCreate} disabled={createLoading || !createForm.email || !createForm.firstName}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium hover:opacity-90 disabled:opacity-50">
                {createLoading ? 'Creating...' : 'Create Company'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-container rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Company</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-on-surface-variant">Owner First Name</label>
                  <input type="text" value={editForm.firstName} onChange={e => setEditForm(f => ({ ...f, firstName: e.target.value }))}
                    className="mt-1 w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface-container-low" />
                </div>
                <div>
                  <label className="text-sm font-medium text-on-surface-variant">Owner Last Name</label>
                  <input type="text" value={editForm.lastName} onChange={e => setEditForm(f => ({ ...f, lastName: e.target.value }))}
                    className="mt-1 w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface-container-low" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-on-surface-variant">Company Name</label>
                <input type="text" value={editForm.companyName} onChange={e => setEditForm(f => ({ ...f, companyName: e.target.value }))}
                  className="mt-1 w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface-container-low" />
              </div>
              <div>
                <label className="text-sm font-medium text-on-surface-variant">Website / Dashboard URL</label>
                <input type="url" value={editForm.dashboardUrl} onChange={e => setEditForm(f => ({ ...f, dashboardUrl: e.target.value }))}
                  placeholder="http://localhost:4000"
                  className="mt-1 w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface-container-low" />
                <p className="text-xs text-outline mt-1">Opened by the "Open Website" action in the company menu.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-lg border border-outline-variant text-sm">Cancel</button>
              <button onClick={handleEdit} className="px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium hover:opacity-90">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close dropdown on outside click */}
      {openMenuId && (
        <div className="fixed inset-0 z-0" onClick={() => setOpenMenuId(null)} />
      )}
    </div>
  );
};

const ClientsManagement: React.FC = () => (
  <AdminRouteGuard>
    <ClientsManagementContent />
  </AdminRouteGuard>
);

export default ClientsManagement;
