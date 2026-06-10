import React, { useEffect, useState, useRef } from 'react';
import ClientSidebar from '@/shared/components/client/ClientSidebar';
import ClientRouteGuard from '@/shared/components/guards/ClientRouteGuard';
import UserManagementService from '@/services/api/user-management.service';
import { LoaderUI } from '@/shared/ui/atoms/loader/LoaderUI';
import type { UserProfile } from '@/core/types/user.type';
import authService from '@/services/api/auth.service';

interface TeamMember extends UserProfile {
  companyId?: string;
}

const ClientTeamContent: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [companyId, setCompanyId] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [removeConfirm, setRemoveConfirm] = useState<string | null>(null);
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '' });

  const isOwner = currentUserId && companyId ? currentUserId === companyId : false;

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) setCurrentUserId(user.uid);

    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await UserManagementService.getTeamMembers();
      if (res.success && res.data) {
        setMembers(res.data.members as TeamMember[]);
        setCompanyId(res.data.companyId);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.firstName) { setAddError('Email and first name are required'); return; }
    setAddLoading(true);
    setAddError('');
    try {
      const res = await UserManagementService.createTeamMember(form);
      if (res.success) {
        setShowAddModal(false);
        setForm({ email: '', firstName: '', lastName: '' });
        await fetchTeam();
      } else {
        setAddError((res as any).message || 'Failed to add team member');
      }
    } catch (err: any) {
      setAddError(err?.data?.message || err?.message || 'Failed to add team member');
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    try {
      await UserManagementService.removeTeamMember(memberId);
      setMembers((prev) => prev.filter((m) => m._id !== memberId));
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to remove team member');
    } finally {
      setRemoveConfirm(null);
      setOpenMenuId(null);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="flex h-full bg-gray-50">
      <ClientSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Team</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your company's team members</p>
            </div>
            {isOwner && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                + Add Team Member
              </button>
            )}
          </div>

          {!isOwner && (
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
              Only the company owner can add or remove team members.
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm">
            {loading ? (
              <div className="p-12 flex justify-center"><LoaderUI message="Loading team..." /></div>
            ) : members.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No team members yet. Add your first team member to collaborate.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Member</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                    {isOwner && <th className="px-6 py-3" />}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {members.map((member) => {
                    const memberIsOwner = member.firebaseUid === companyId || member.companyId === member.firebaseUid;
                    return (
                      <tr key={member._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                              {(member.profile?.firstName?.[0] || member.email?.[0] || '?').toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {member.profile?.displayName || `${member.profile?.firstName || ''} ${member.profile?.lastName || ''}`.trim() || '—'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{member.email || '—'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            memberIsOwner ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {memberIsOwner ? 'Owner' : 'Member'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{member.createdAt ? formatDate(member.createdAt) : '—'}</td>
                        {isOwner && (
                          <td className="px-6 py-4 relative">
                            {!memberIsOwner && (
                              <div className="relative">
                                {openMenuId === member._id && (
                                  <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                                )}
                                <button
                                  onClick={() => setOpenMenuId(openMenuId === member._id ? null : member._id)}
                                  className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                                  </svg>
                                </button>
                                {openMenuId === member._id && (
                                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-20 w-36 py-1">
                                    <button
                                      onClick={() => { setOpenMenuId(null); setRemoveConfirm(member._id); }}
                                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Add Team Member</h2>
              <button onClick={() => { setShowAddModal(false); setAddError(''); }} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              {addError && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{addError}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">Team member will receive the default password: <strong>Welcome@ThoughtMetrics</strong> and will be prompted to change it on first login.</p>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowAddModal(false); setAddError(''); }} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={addLoading} className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                  {addLoading ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Remove Confirm Dialog */}
      {removeConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Remove team member?</h3>
            <p className="text-sm text-gray-600 mb-6">This will deactivate their account. They will no longer be able to access the portal.</p>
            <div className="flex gap-3">
              <button onClick={() => setRemoveConfirm(null)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleRemove(removeConfirm)} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ClientTeam: React.FC = () => (
  <ClientRouteGuard>
    <ClientTeamContent />
  </ClientRouteGuard>
);

export default ClientTeam;
