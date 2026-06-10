import React, { useState, useEffect } from 'react';
import { useAuth } from '@/shared/providers/auth-provider';
import AdminSidebar from '@/shared/components/admin/AdminSidebar';
import AdminRouteGuard from '@/shared/components/guards/AdminRouteGuard';
import UserManagementService from '@/services/api/user-management.service';
import type { UserProfile } from '@/core/types/user.type';
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
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap">{fmt(used)} / {fmt(q)}</span>
    </div>
  );
}

const ClientsManagementContent: React.FC = () => {
  const { user, isAuthReady } = useAuth();
  const [clients, setClients] = useState<UserProfile[]>([]);
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
  const [editTarget, setEditTarget] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', companyName: '' });

  const fetchClients = async () => {
    if (!isAuthReady || !user) return;
    setLoading(true);
    try {
      const res = await UserManagementService.getUsers({ role: 'client', page, limit, search: search || undefined });
      if (res.data) {
        setClients(res.data.users);
        setTotal(res.data.total);
      }
    } catch {
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, [isAuthReady, user, page, search]);

  const handleCreate = async () => {
    setCreateLoading(true);
    try {
      await UserManagementService.adminCreateUser({
        email: createForm.email,
        firstName: createForm.firstName,
        lastName: createForm.lastName || undefined,
        role: 'client',
        sendWelcomeEmail: createForm.sendWelcomeEmail,
      });
      toast.success('Client created successfully');
      setShowCreateModal(false);
      setCreateForm({ email: '', firstName: '', lastName: '', companyName: '', sendWelcomeEmail: true });
      fetchClients();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create client');
    } finally {
      setCreateLoading(false);
    }
  };

  const openEdit = (client: UserProfile) => {
    setEditTarget(client);
    setEditForm({
      firstName: client.profile?.firstName || '',
      lastName: client.profile?.lastName || '',
      companyName: (client as any).companyName || '',
    });
    setShowEditModal(true);
    setOpenMenuId(null);
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    try {
      await UserManagementService.updateUser(editTarget._id, {
        profile: { firstName: editForm.firstName, lastName: editForm.lastName },
        companyName: editForm.companyName,
      } as any);
      toast.success('Client updated');
      setShowEditModal(false);
      fetchClients();
    } catch {
      toast.error('Failed to update client');
    }
  };

  const handleDelete = async (client: UserProfile) => {
    if (!confirm(`Deactivate ${client.profile?.firstName} ${client.profile?.lastName}?`)) return;
    try {
      await UserManagementService.deleteUser(client._id);
      toast.success('Client deactivated');
      fetchClients();
    } catch {
      toast.error('Failed to deactivate client');
    }
    setOpenMenuId(null);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="h-full flex bg-gray-50 text-text-dark">
      <AdminSidebar />

      <main className="h-full overflow-y-auto flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
              <p className="text-gray-500 mt-1">{total} client{total !== 1 ? 's' : ''} total</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              + Create Client
            </button>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm">
            {loading ? (
              <div className="p-12 flex justify-center"><LoaderUI message="Loading clients..." /></div>
            ) : clients.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No clients found.</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Company</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Storage</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Joined</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {clients.map((client) => (
                    <tr key={client._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {client.profile?.firstName} {client.profile?.lastName}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{client.email}</td>
                      <td className="px-4 py-3 text-gray-600">{(client as any).companyName || '—'}</td>
                      <td className="px-4 py-3">
                        <StorageBar used={(client as any).storageUsed ?? 0} quota={(client as any).storageQuota} />
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3 relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === client._id ? null : client._id)}
                          className="p-1 rounded hover:bg-gray-100 text-gray-500"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                          </svg>
                        </button>
                        {openMenuId === client._id && (
                          <div className="absolute right-4 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40 py-1">
                            <button onClick={() => openEdit(client)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">Edit</button>
                            <a href={`/admin/surveys?clientId=${client._id}`} className="block px-4 py-2 text-sm hover:bg-gray-50">View Surveys</a>
                            <button onClick={() => handleDelete(client)} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">Deactivate</button>
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
              <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded border text-sm disabled:opacity-40">Prev</button>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded border text-sm disabled:opacity-40">Next</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create Client</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Email *</label>
                <input type="email" value={createForm.email} onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">First Name *</label>
                  <input type="text" value={createForm.firstName} onChange={e => setCreateForm(f => ({ ...f, firstName: e.target.value }))}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <input type="text" value={createForm.lastName} onChange={e => setCreateForm(f => ({ ...f, lastName: e.target.value }))}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Company Name</label>
                <input type="text" value={createForm.companyName} onChange={e => setCreateForm(f => ({ ...f, companyName: e.target.value }))}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={createForm.sendWelcomeEmail} onChange={e => setCreateForm(f => ({ ...f, sendWelcomeEmail: e.target.checked }))} />
                Send welcome email with login credentials
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg border text-sm">Cancel</button>
              <button onClick={handleCreate} disabled={createLoading || !createForm.email || !createForm.firstName}
                className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 disabled:opacity-50">
                {createLoading ? 'Creating...' : 'Create Client'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Client</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <input type="text" value={editForm.firstName} onChange={e => setEditForm(f => ({ ...f, firstName: e.target.value }))}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <input type="text" value={editForm.lastName} onChange={e => setEditForm(f => ({ ...f, lastName: e.target.value }))}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Company Name</label>
                <input type="text" value={editForm.companyName} onChange={e => setEditForm(f => ({ ...f, companyName: e.target.value }))}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-lg border text-sm">Cancel</button>
              <button onClick={handleEdit} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90">
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
