import React, { useEffect, useState, useRef } from 'react';
import ClientSidebar from '@/shared/components/client/ClientSidebar';
import ClientRouteGuard from '@/shared/components/guards/ClientRouteGuard';
import UserManagementService from '@/services/api/user-management.service';
import { useAuth } from '@/shared/providers/auth-provider';
import { LoaderUI } from '@/shared/ui/atoms/loader/LoaderUI';
import { PortalMenu } from '@/shared/ui/molecules/portal-menu';
import type { UserProfile } from '@/core/types/user.type';

type CompanyRole = 'owner' | 'contributor' | 'member';

interface TeamMember extends UserProfile {
  companyId?: string;
  companyRole?: CompanyRole;
}

const ROLE_BADGE: Record<CompanyRole, string> = {
  owner: 'bg-purple-100 text-purple-800',
  contributor: 'bg-emerald-100 text-emerald-800',
  member: 'bg-blue-100 text-blue-800',
};

const ROLE_LABEL: Record<CompanyRole, string> = {
  owner: 'Owner',
  contributor: 'Contributor',
  member: 'Member',
};

const ROLE_OPTIONS: CompanyRole[] = ['owner', 'contributor', 'member'];

const ClientTeamContent: React.FC = () => {
  const { companyRole } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [companyId, setCompanyId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [removeConfirm, setRemoveConfirm] = useState<string | null>(null);
  const [roleChanging, setRoleChanging] = useState<string | null>(null);
  const menuButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [form, setForm] = useState<{ email: string; firstName: string; lastName: string; companyRole: CompanyRole }>({
    email: '', firstName: '', lastName: '', companyRole: 'contributor',
  });

  const isOwner = companyRole === 'owner';

  useEffect(() => {
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
        setForm({ email: '', firstName: '', lastName: '', companyRole: 'contributor' });
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

  const handleChangeRole = async (memberId: string, newRole: CompanyRole) => {
    setOpenMenuId(null);
    setRoleChanging(memberId);
    try {
      await UserManagementService.changeTeamMemberRole(memberId, newRole);
      setMembers((prev) => prev.map((m) => (m._id === memberId ? { ...m, companyRole: newRole } : m)));
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to change role');
    } finally {
      setRoleChanging(null);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="flex h-full bg-surface-container-low">
      <ClientSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-on-surface">Team</h1>
              <p className="text-sm text-outline mt-1">Manage your company's team members</p>
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
              Only an Owner can add, remove, or change roles for team members.
            </div>
          )}

          <div className="bg-surface-container rounded-lg shadow-sm">
            {loading ? (
              <div className="p-12 flex justify-center"><LoaderUI message="Loading team..." /></div>
            ) : members.length === 0 ? (
              <div className="p-12 text-center text-outline">No team members yet. Add your first team member to collaborate.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-outline uppercase tracking-wider">Member</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-outline uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-outline uppercase tracking-wider">Role</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-outline uppercase tracking-wider">Joined</th>
                    {isOwner && <th className="px-6 py-3" />}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {members.map((member) => {
                    const isTechnicalOwner = member.firebaseUid === companyId;
                    const memberRole: CompanyRole = member.companyRole || 'member';
                    return (
                      <tr key={member._id} className="hover:bg-surface-container-high transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                              {(member.profile?.firstName?.[0] || member.email?.[0] || '?').toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-on-surface">
                              {member.profile?.displayName || `${member.profile?.firstName || ''} ${member.profile?.lastName || ''}`.trim() || '—'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">{member.email || '—'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_BADGE[memberRole]}`}>
                            {roleChanging === member._id ? 'Updating…' : ROLE_LABEL[memberRole]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-outline">{member.createdAt ? formatDate(member.createdAt) : '—'}</td>
                        {isOwner && (
                          <td className="px-6 py-4 relative">
                            {!isTechnicalOwner && (
                              <div>
                                <button
                                  ref={(el) => { menuButtonRefs.current[member._id] = el; }}
                                  onClick={() => setOpenMenuId(openMenuId === member._id ? null : member._id)}
                                  className="p-1 rounded hover:bg-surface-container-high text-outline/40 hover:text-on-surface-variant"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                                  </svg>
                                </button>
                                <PortalMenu
                                  open={openMenuId === member._id}
                                  anchorEl={menuButtonRefs.current[member._id]}
                                  onClose={() => setOpenMenuId(null)}
                                  align="right"
                                >
                                  <div className="bg-surface-container border border-outline-variant rounded-lg shadow-lg w-48 py-1">
                                    <div className="px-4 py-1.5 text-xs font-semibold text-outline uppercase tracking-wider">Set role</div>
                                    {ROLE_OPTIONS.filter((r) => r !== memberRole).map((r) => (
                                      <button
                                        key={r}
                                        onClick={() => handleChangeRole(member._id, r)}
                                        className="w-full text-left px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-high"
                                      >
                                        {ROLE_LABEL[r]}
                                      </button>
                                    ))}
                                    <div className="border-t border-outline-variant/50 my-1" />
                                    <button
                                      onClick={() => { setOpenMenuId(null); setRemoveConfirm(member._id); }}
                                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </PortalMenu>
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
          <div className="bg-surface-container rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold text-on-surface">Add Team Member</h2>
              <button onClick={() => { setShowAddModal(false); setAddError(''); }} className="text-outline/40 hover:text-on-surface-variant">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              {addError && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{addError}</div>}
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">First Name *</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Last Name</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Role</label>
                <select
                  value={form.companyRole}
                  onChange={(e) => setForm((f) => ({ ...f, companyRole: e.target.value as CompanyRole }))}
                  className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface-container-low"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                  ))}
                </select>
                <p className="text-xs text-outline mt-1">
                  Contributor: can create/edit/delete surveys. Member: view-only. Owner: full access, including managing the team.
                </p>
              </div>
              <p className="text-xs text-outline">Team member will receive the default password: <strong>Welcome@ThoughtMetrics</strong> and will be prompted to change it on first login.</p>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowAddModal(false); setAddError(''); }} className="flex-1 border border-outline-variant text-on-surface-variant py-2 rounded-lg text-sm font-medium hover:bg-surface-container-high">Cancel</button>
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
          <div className="bg-surface-container rounded-xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-on-surface mb-2">Remove team member?</h3>
            <p className="text-sm text-on-surface-variant mb-6">This will deactivate their account. They will no longer be able to access the portal.</p>
            <div className="flex gap-3">
              <button onClick={() => setRemoveConfirm(null)} className="flex-1 border border-outline-variant text-on-surface-variant py-2 rounded-lg text-sm font-medium hover:bg-surface-container-high">Cancel</button>
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
