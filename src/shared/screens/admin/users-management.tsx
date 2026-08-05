import React, { useState, useEffect, useRef } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/core/configs/firebase-config';
import { useAuth } from '@/shared/providers/auth-provider';
import AdminSidebar from '@/shared/components/admin/AdminSidebar';
import AdminRouteGuard from '@/shared/components/guards/AdminRouteGuard';
import UserManagementService from '@/services/api/user-management.service';
import type { BulkJobStatus } from '@/services/api/user-management.service';
import ZoneService from '@/services/api/zone.service';
import type { UserProfile, UserRole } from '@/core/types/user.type';
import type { ZoneHierarchy } from '@/core/types/zone.type';
import { toast } from 'sonner';
import { LoaderUI } from '@/shared/ui/atoms/loader/LoaderUI';

function downloadBulkImportTemplate() {
  const headers = ['Email', 'First Name', 'Last Name', 'Role', 'AC Name', 'Zone', 'Send Password Reset'];
  const sample = ['agent@example.com', 'John', 'Doe', 'Field Agent', 'Cheyyar', '', 'yes'];
  const csv = [headers, sample].map(row => row.map(cell => `"${cell}"`).join(',')).join('\r\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bulk-import-template.csv';
  a.click();
  URL.revokeObjectURL(url);
}

const UserManagementContent: React.FC = () => {
  const { user, isAuthReady, isSuperAdmin, isFieldIncharge, userZone } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleZonalModal, setShowRoleZonalModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [selectedRole, setSelectedRole] = useState<UserRole>('respondent');
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [selectedCompanyName, setSelectedCompanyName] = useState<string>('');
  // Multi-select zonal state for Change Zonal modal
  const [zoneHierarchy, setZoneHierarchy] = useState<ZoneHierarchy>([]);
  const [zoneHierarchyLoading, setZoneHierarchyLoading] = useState(true);
  const [selectedAcNos, setSelectedAcNos] = useState<number[]>([]);
  const [acSearchText, setAcSearchText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [showDeleted, setShowDeleted] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Create User modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'employee' as UserRole,
    acNos: [] as number[],
    zone: '',
    sendWelcomeEmail: true,
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createAcSearchText, setCreateAcSearchText] = useState('');

  // Bulk Import modal state
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkJobId, setBulkJobId] = useState<string | null>(null);
  const [bulkJobStatus, setBulkJobStatus] = useState<BulkJobStatus | null>(null);
  const [bulkPolling, setBulkPolling] = useState(false);
  const bulkPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bulkFileInputRef = useRef<HTMLInputElement | null>(null);

  // Lock zone filter for field-incharge
  useEffect(() => {
    if (isFieldIncharge && userZone) {
      setFilterZone(userZone);
    }
  }, [isFieldIncharge, userZone]);

  // Load zone hierarchy once auth is ready
  useEffect(() => {
    if (!isAuthReady || !user) return;
    setZoneHierarchyLoading(true);
    ZoneService.getHierarchy(isFieldIncharge && userZone ? userZone : undefined)
      .then((data) => {
        console.debug('[UserManagement] Zone hierarchy loaded:', data.length, 'zones');
        setZoneHierarchy(data);
      })
      .catch((err) => {
        console.error('[UserManagement] Failed to load zone hierarchy:', err);
        toast.error('Failed to load zone data', { description: err.message });
      })
      .finally(() => setZoneHierarchyLoading(false));
  }, [isAuthReady, user, isFieldIncharge, userZone]);

  // Fetch users when auth is ready and when page/filters change
  useEffect(() => {
    if (!isAuthReady || !user) return;
    fetchUsers();
  }, [isAuthReady, user, page, limit, filterRole, filterZone, filterDistrict, showDeleted]);

  // Debounced search
  useEffect(() => {
    if (!isAuthReady || !user) return;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
      fetchUsers();
    }, 400);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery, isAuthReady, user]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && menuRefs.current[openMenuId]) {
        if (!menuRefs.current[openMenuId]?.contains(event.target as Node)) {
          setOpenMenuId(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = { page, limit };
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (filterRole !== 'all') params.role = filterRole;
      if (filterZone !== 'all') params.zone = filterZone;
      if (filterDistrict !== 'all') params.district = filterDistrict;
      if (!isFieldIncharge && showDeleted) params.showDeleted = 'true';
      const response = await UserManagementService.getUsers(params);
      if (response.data) {
        setUsers(response.data.users);
        setTotal(response.data.total);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users', {
        description: error.message || 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMenuToggle = (userId: string) => {
    setOpenMenuId(openMenuId === userId ? null : userId);
  };

  const handleEditClick = (user: UserProfile) => {
    setSelectedUser(user);
    setEditFormData({
      firstName: user.profile?.firstName || '',
      lastName: user.profile?.lastName || '',
      email: user.email || '',
      phone: user.profile?.phone || '',
    });
    setShowEditModal(true);
    setOpenMenuId(null);
  };

  const handleDeleteClick = (user: UserProfile) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const handleRoleZonalClick = (user: UserProfile) => {
    setSelectedUser(user);
    setSelectedRole(user.role || 'respondent');
    setSelectedZone(user.zonal || '');
    setSelectedCompanyName(user.companyName || '');
    if (user.zonalInfo && user.zonalInfo.length > 0) {
      setSelectedAcNos(user.zonalInfo.map(zi => zi.acNo));
    } else {
      setSelectedAcNos([]);
    }
    setAcSearchText('');
    setShowRoleZonalModal(true);
    setOpenMenuId(null);
  };

  const handleResetPassword = async (userItem: UserProfile) => {
    setOpenMenuId(null);
    const email = userItem.email;
    if (!email) {
      toast.error('No email address found for this user');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(`Password reset email sent to ${email}`);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        toast.error('No account found with this email');
      } else {
        toast.error('Failed to send password reset email');
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const response = await UserManagementService.updateUser(
        selectedUser._id,
        {
          profile: {
            firstName: editFormData.firstName,
            lastName: editFormData.lastName,
            phone: editFormData.phone,
          },
          email: editFormData.email,
        } as any
      );

      if (response.data) {
        toast.success('User updated successfully');
        setShowEditModal(false);
        fetchUsers();
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user', {
        description: error.message || 'An error occurred',
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      await UserManagementService.deleteUser(selectedUser._id);
      toast.success('User deleted successfully');
      setShowDeleteModal(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user', {
        description: error.message || 'An error occurred',
      });
    }
  };

  const handleRoleZonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const isFieldInchargeRole = selectedRole === 'field-incharge';
      const isClientRole = selectedRole === 'client';
      const response = await UserManagementService.updateUserRoleAndZonal(
        selectedUser._id,
        selectedRole,
        isFieldInchargeRole ? undefined : (selectedAcNos.length > 0 ? selectedAcNos : undefined),
        isFieldInchargeRole ? selectedZone : undefined,
        isClientRole ? (selectedCompanyName.trim() || undefined) : undefined
      );

      if (response.data) {
        toast.success('User updated successfully');
        setShowRoleZonalModal(false);
        fetchUsers();
      }
    } catch (error: any) {
      console.error('Error updating user role/zonal:', error);
      toast.error('Failed to update user', {
        description: error.message || 'An error occurred',
      });
    }
  };

  // Cleanup bulk polling on unmount
  useEffect(() => {
    return () => {
      if (bulkPollRef.current) clearInterval(bulkPollRef.current);
    };
  }, []);

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await UserManagementService.adminCreateUser({
        email: createFormData.email,
        firstName: createFormData.firstName,
        lastName: createFormData.lastName || undefined,
        role: createFormData.role,
        acNos: createFormData.role !== 'field-incharge' && createFormData.acNos.length > 0 ? createFormData.acNos : undefined,
        zone: createFormData.role === 'field-incharge' ? createFormData.zone : undefined,
        sendWelcomeEmail: createFormData.sendWelcomeEmail,
      });
      toast.success('User created successfully', {
        description: 'Default password: Welcome@ThoughtMetrics',
      });
      setShowCreateModal(false);
      setCreateFormData({ email: '', firstName: '', lastName: '', role: 'employee', acNos: [], zone: '', sendWelcomeEmail: true });
      setCreateAcSearchText('');
      fetchUsers();
    } catch (error: any) {
      if (error?.status === 409) {
        toast.error('User already exists', {
          description: 'User already has email/password authentication. Cannot create duplicate.',
        });
      } else {
        toast.error('Failed to create user', { description: error?.message || 'An error occurred' });
      }
    } finally {
      setCreateLoading(false);
    }
  };

  const toggleCreateAcNo = (acNo: number) => {
    setCreateFormData(prev => ({
      ...prev,
      acNos: prev.acNos.includes(acNo) ? prev.acNos.filter(n => n !== acNo) : [...prev.acNos, acNo],
    }));
  };

  const handleBulkImport = async () => {
    if (!bulkFile) return;
    try {
      const res = await UserManagementService.bulkImportUsers(bulkFile);
      if (res.data?.jobId) {
        setBulkJobId(res.data.jobId);
        setBulkPolling(true);
        let count = 0;
        bulkPollRef.current = setInterval(async () => {
          count++;
          try {
            const statusRes = await UserManagementService.getBulkJobStatus(res.data!.jobId);
            if (statusRes.data) {
              setBulkJobStatus(statusRes.data);
              if (['completed', 'failed'].includes(statusRes.data.status) || count >= 200) {
                clearInterval(bulkPollRef.current!);
                setBulkPolling(false);
              }
            }
          } catch (err) {
            console.error('Failed to poll bulk job status', err);
          }
        }, 3000);
      }
    } catch (error: any) {
      toast.error('Bulk import failed', { description: error?.message || 'An error occurred' });
    }
  };

  const handleBulkModalClose = () => {
    if (bulkPollRef.current) clearInterval(bulkPollRef.current);
    setBulkPolling(false);
    setBulkJobId(null);
    setBulkJobStatus(null);
    setBulkFile(null);
    setShowBulkModal(false);
    fetchUsers();
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'super-admin':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'employee':
        return 'bg-green-100 text-green-800';
      case 'client':
        return 'bg-yellow-100 text-yellow-800';
      case 'partner':
        return 'bg-orange-100 text-orange-800';
      case 'field-agent':
        return 'bg-teal-100 text-teal-800';
      case 'field-incharge':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getZonalBadgeColor = (zone?: string) => {
    switch (zone) {
      case 'North':
        return 'bg-blue-100 text-blue-800';
      case 'South':
        return 'bg-green-100 text-green-800';
      case 'East':
        return 'bg-purple-100 text-purple-800';
      case 'West':
        return 'bg-orange-100 text-orange-800';
      case 'Central':
        return 'bg-teal-100 text-teal-800';
      default:
        // Legacy city-based zones
        return 'bg-amber-100 text-amber-800';
    }
  };

  // All districts and all ACs flat list for multi-select modal
  const allDistricts = zoneHierarchy.flatMap(z => z.districts);
  const allAcFlat = zoneHierarchy.flatMap(z =>
    z.districts.flatMap(d =>
      d.acs.map(ac => ({ ...ac, district: d.name, zone: z.zone }))
    )
  );
  // AC list filtered by search text in the zonal modal
  const modalFilteredAcs = acSearchText.trim()
    ? allAcFlat.filter(ac =>
        ac.name.toLowerCase().includes(acSearchText.toLowerCase()) ||
        ac.district.toLowerCase().includes(acSearchText.toLowerCase()) ||
        String(ac.acNo).includes(acSearchText)
      )
    : allAcFlat;
  // Details of currently selected ACs (for chip display)
  const selectedAcDetails = selectedAcNos
    .map(acNo => allAcFlat.find(ac => ac.acNo === acNo))
    .filter(Boolean) as typeof allAcFlat;
  // Toggle an AC in/out of the selection
  const toggleAcNo = (acNo: number) => {
    setSelectedAcNos(prev =>
      prev.includes(acNo) ? prev.filter(n => n !== acNo) : [...prev, acNo]
    );
  };

  // Districts available for filter dropdown
  const filterDistrictOptions = filterZone !== 'all'
    ? zoneHierarchy.find(z => z.zone === filterZone)?.districts.map(d => d.name) || []
    : allDistricts.map(d => d.name);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex bg-surface-container-low text-text-dark h-full">
      <AdminSidebar />

      <main className="h-full flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-on-surface mb-2">
              User Management
            </h1>
            <p className="text-on-surface-variant">
              Manage users, roles, and permissions
            </p>
          </div>

          {/* Users Table */}
          <div className="bg-surface-container rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-on-surface">Users ({total})</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (isFieldIncharge) {
                          setCreateFormData(prev => ({ ...prev, role: 'field-agent' }));
                        }
                        setShowCreateModal(true);
                      }}
                      className="px-3 py-1.5 text-sm font-medium text-on-primary bg-primary rounded-md hover:bg-primary/90 transition-colors"
                    >
                      + {isFieldIncharge ? 'Add Field Agent' : 'Create User'}
                    </button>
                    {!isFieldIncharge && (
                      <button
                        onClick={() => setShowBulkModal(true)}
                        className="px-3 py-1.5 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary/5 transition-colors"
                      >
                        Bulk Import
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search */}
                  <div className="relative flex-1">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-3 py-2 text-sm border border-outline-variant rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary w-full bg-surface-container-low text-on-surface"
                    />
                  </div>
                  {/* Role Filter */}
                  <select
                    value={filterRole}
                    onChange={(e) => { setFilterRole(e.target.value); setPage(1); }}
                    className="px-3 py-2 text-sm border border-outline-variant rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-surface-container text-on-surface"
                  >
                    <option value="all">All Roles</option>
                    {isFieldIncharge ? (
                      <>
                        <option value="field-agent">Field Agent</option>
                        <option value="field-incharge">Field Incharge</option>
                      </>
                    ) : (
                      <>
                        <option value="super-admin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="employee">Employee</option>
                        <option value="client">Client</option>
                        <option value="respondent">Respondent</option>
                        <option value="partner">Partner</option>
                        <option value="field-agent">Field Agent</option>
                        <option value="field-incharge">Field Incharge</option>
                      </>
                    )}
                  </select>
                  {/* Zone Filter */}
                  <select
                    value={filterZone}
                    disabled={isFieldIncharge}
                    onChange={(e) => { if (!isFieldIncharge) { setFilterZone(e.target.value); setFilterDistrict('all'); setPage(1); } }}
                    className="px-3 py-2 text-sm border border-outline-variant rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-surface-container text-on-surface disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isFieldIncharge ? (
                      <option value={userZone || 'all'}>{userZone || 'All Zones'}</option>
                    ) : (
                      <>
                        <option value="all">All Zones</option>
                        {zoneHierarchy.map(z => (
                          <option key={z.zone} value={z.zone}>{z.zone}</option>
                        ))}
                      </>
                    )}
                  </select>
                  {/* District Filter */}
                  <select
                    value={filterDistrict}
                    onChange={(e) => { setFilterDistrict(e.target.value); setPage(1); }}
                    className="px-3 py-2 text-sm border border-outline-variant rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-surface-container text-on-surface"
                  >
                    <option value="all">All Districts</option>
                    {filterDistrictOptions.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {!isFieldIncharge && (
                    <button
                      onClick={() => { setShowDeleted((v) => !v); setPage(1); }}
                      className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors whitespace-nowrap ${
                        showDeleted
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-surface-container text-on-surface-variant border-outline-variant hover:bg-surface-container-high'
                      }`}
                    >
                      Deleted
                    </button>
                  )}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <LoaderUI message="Loading users..." />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-outline-variant/20">
                    <thead className="bg-surface-container-low">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-outline uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-outline uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-outline uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-outline uppercase tracking-wider">
                          Zonal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-outline uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-outline uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-surface-container divide-y divide-outline-variant/20">
                      {users.map((userItem) => (
                        <tr key={userItem._id} className="hover:bg-surface-container-high">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 shrink-0">
                                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-medium">
                                  {(
                                    userItem.profile?.firstName?.[0] ||
                                    userItem.email?.[0] ||
                                    '?'
                                  ).toUpperCase()}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-on-surface">
                                  {userItem.profile?.firstName}{' '}
                                  {userItem.profile?.lastName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-on-surface">
                              {userItem.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(userItem.role)}`}
                            >
                              {userItem.role || 'respondent'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {userItem.zonalInfo && userItem.zonalInfo.length > 0 ? (
                              <div>
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getZonalBadgeColor(userItem.zonalInfo[0].zone)}`}
                                >
                                  {userItem.zonalInfo[0].zone}
                                </span>
                                <div className="text-xs text-outline mt-0.5">
                                  {userItem.zonalInfo.length === 1
                                    ? `${userItem.zonalInfo[0].assemblyConstituency}, ${userItem.zonalInfo[0].district}`
                                    : `${userItem.zonalInfo.length} constituencies`}
                                </div>
                              </div>
                            ) : userItem.zonal ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                                {userItem.zonal} (legacy)
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-surface-container-high text-on-surface-variant">
                                Not Assigned
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-outline">
                            {new Date(userItem.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="relative inline-block text-left">
                              <button
                                onClick={() => handleMenuToggle(userItem._id)}
                                className="inline-flex items-center justify-center w-8 h-8 text-outline hover:text-on-surface-variant focus:outline-none"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                              </button>

                              {openMenuId === userItem._id && (
                                <div
                                  ref={(el) => {
                                    menuRefs.current[userItem._id] = el;
                                  }}
                                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-surface-container border border-outline-variant z-10"
                                >
                                  <div className="py-1">
                                    <button
                                      onClick={() => handleEditClick(userItem)}
                                      className="block w-full text-left px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-high"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleRoleZonalClick(userItem)}
                                      className="block w-full text-left px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-high"
                                    >
                                      {isFieldIncharge ? 'Change AC' : 'Change Role \u0026 Zonal'}
                                    </button>
                                    <button
                                      onClick={() => void handleResetPassword(userItem)}
                                      className="block w-full text-left px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-high"
                                    >
                                      Reset Password
                                    </button>
                                    {userItem.role === 'field-agent' && (
                                      <button
                                        onClick={() =>
                                          handleDeleteClick(userItem)
                                        }
                                        className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                      >
                                        Delete
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {total > 0 && (
                  <div className="px-6 py-4 border-t border-outline-variant flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                      <span>
                        {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-outline">Rows:</span>
                        <select
                          value={limit}
                          onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setPage(1);
                          }}
                          className="text-sm border border-outline-variant bg-surface-container text-on-surface rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                          {[10, 25, 50, 100].map((n) => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface-container border border-outline-variant rounded-md hover:bg-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || totalPages === 0}
                        className="px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface-container border border-outline-variant rounded-md hover:bg-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface-container rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-on-surface mb-4">Edit User</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.firstName}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-outline-variant bg-surface-container-low text-on-surface rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.lastName}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-outline-variant bg-surface-container-low text-on-surface rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-outline-variant bg-surface-container-low text-on-surface rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-outline-variant bg-surface-container-low text-on-surface rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface-container-high border border-outline-variant rounded-md hover:bg-outline-variant/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-on-primary bg-primary rounded-md hover:bg-custom-blue"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface-container rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-on-surface mb-4">Delete User</h3>
            <p className="text-on-surface-variant mb-6">
              Are you sure you want to delete{' '}
              <span className="font-medium">
                {selectedUser.profile?.firstName}{' '}
                {selectedUser.profile?.lastName}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface-container-high border border-outline-variant rounded-md hover:bg-outline-variant/20"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface-container rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] flex flex-col">
            <h3 className="text-lg font-semibold text-on-surface mb-4">Create User</h3>
            <form onSubmit={(e) => void handleCreateUserSubmit(e)} className="flex flex-col flex-1 min-h-0 gap-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Email *</label>
                <input
                  type="email"
                  value={createFormData.email}
                  onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-outline-variant bg-surface-container-low text-on-surface rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">First Name *</label>
                  <input
                    type="text"
                    value={createFormData.firstName}
                    onChange={(e) => setCreateFormData({ ...createFormData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-outline-variant bg-surface-container-low text-on-surface rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Last Name</label>
                  <input
                    type="text"
                    value={createFormData.lastName}
                    onChange={(e) => setCreateFormData({ ...createFormData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-outline-variant bg-surface-container-low text-on-surface rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Role *</label>
                <select
                  value={createFormData.role}
                  disabled={isFieldIncharge}
                  onChange={(e) => setCreateFormData({ ...createFormData, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 border border-outline-variant bg-surface-container-low text-on-surface rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isFieldIncharge ? (
                    <option value="field-agent">Field Agent</option>
                  ) : (
                    <>
                      <option value="employee">Employee</option>
                      <option value="field-agent">Field Agent</option>
                      <option value="field-incharge">Field Incharge</option>
                      <option value="client">Client</option>
                      <option value="partner">Partner</option>
                      <option value="respondent">Respondent</option>
                      <option value="admin">Admin</option>
                      {isSuperAdmin && <option value="super-admin">Super Admin</option>}
                    </>
                  )}
                </select>
              </div>

              {/* Zone picker for field-incharge */}
              {createFormData.role === 'field-incharge' && (
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Zone <span className="text-red-500">*</span></label>
                  <select
                    value={createFormData.zone}
                    onChange={(e) => setCreateFormData({ ...createFormData, zone: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-outline-variant bg-surface-container-low text-on-surface rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select zone…</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="Central">Central</option>
                  </select>
                </div>
              )}

              {/* AC Picker — only for non-field-incharge roles */}
              {createFormData.role !== 'field-incharge' && !zoneHierarchyLoading && allAcFlat.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-2">Assembly Constituencies (optional)</label>
                  {createFormData.acNos.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2 p-2 bg-blue-50 rounded-md border border-blue-100">
                      {createFormData.acNos
                        .map(acNo => allAcFlat.find(ac => ac.acNo === acNo))
                        .filter(Boolean)
                        .map((ac) => (
                          <span key={ac!.acNo} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-on-primary">
                            {ac!.name}
                            <button type="button" onClick={() => toggleCreateAcNo(ac!.acNo)} className="ml-0.5 text-on-primary hover:text-red-200">×</button>
                          </span>
                        ))}
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Search AC name or district…"
                    value={createAcSearchText}
                    onChange={(e) => setCreateAcSearchText(e.target.value)}
                    className="w-full px-3 py-2 mb-1 border border-outline-variant bg-surface-container-low text-on-surface rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="max-h-36 overflow-y-auto border border-outline-variant rounded-md divide-y divide-outline-variant/10">
                    {(createAcSearchText.trim()
                      ? allAcFlat.filter(ac =>
                          ac.name.toLowerCase().includes(createAcSearchText.toLowerCase()) ||
                          ac.district.toLowerCase().includes(createAcSearchText.toLowerCase()) ||
                          String(ac.acNo).includes(createAcSearchText)
                        )
                      : allAcFlat
                    ).map(ac => (
                      <label key={ac.acNo} className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-surface-container-high ${createFormData.acNos.includes(ac.acNo) ? 'bg-primary/10' : ''}`}>
                        <input
                          type="checkbox"
                          checked={createFormData.acNos.includes(ac.acNo)}
                          onChange={() => toggleCreateAcNo(ac.acNo)}
                          className="h-4 w-4 rounded border-outline-variant text-primary"
                        />
                        <span className="text-sm text-on-surface">{ac.name} <span className="text-outline text-xs">· {ac.district} · #{ac.acNo}</span></span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sendWelcomeEmail"
                  checked={createFormData.sendWelcomeEmail}
                  onChange={(e) => setCreateFormData({ ...createFormData, sendWelcomeEmail: e.target.checked })}
                  className="h-4 w-4 rounded border-outline-variant text-primary"
                />
                <label htmlFor="sendWelcomeEmail" className="text-sm text-on-surface-variant">Send welcome email with credentials</label>
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-outline-variant/50">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface-container-high border border-outline-variant rounded-md hover:bg-outline-variant/20">
                  Cancel
                </button>
                <button type="submit" disabled={createLoading} className="px-4 py-2 text-sm font-medium text-on-primary bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
                  {createLoading ? 'Creating…' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface-container rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-on-surface mb-4">Bulk Import Users</h3>

            {!bulkJobId ? (
              /* Phase 1: Upload */
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
                  <p className="font-medium mb-1">Required Excel columns:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li><code>Email</code> * (required)</li>
                    <li><code>First Name</code> * (required)</li>
                    <li><code>Last Name</code> (optional)</li>
                    <li><code>Role</code> * (required: Field Agent, Field Incharge, Employee, Client, etc.)</li>
                    <li><code>AC Name</code> (required for Field Agent — e.g. "Cheyyar")</li>
                    <li><code>Zone</code> (required for Field Incharge — e.g. "North")</li>
                    <li><code>Send Password Reset</code> (optional: "yes"/"no", default "yes")</li>
                  </ul>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs">Maximum 2000 rows per file.</p>
                    <button
                      type="button"
                      onClick={downloadBulkImportTemplate}
                      className="text-xs font-medium text-blue-700 underline hover:text-blue-900"
                    >
                      Download template
                    </button>
                  </div>
                </div>

                <div>
                  <input
                    ref={bulkFileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => setBulkFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => bulkFileInputRef.current?.click()}
                    className="px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface-container-high border border-outline-variant rounded-md hover:bg-outline-variant/20"
                  >
                    Choose File
                  </button>
                  {bulkFile && (
                    <span className="ml-3 text-sm text-on-surface-variant">{bulkFile.name}</span>
                  )}
                </div>

                <div className="flex gap-3 justify-end pt-2 border-t border-outline-variant/50">
                  <button type="button" onClick={handleBulkModalClose} className="px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface-container-high border border-outline-variant rounded-md hover:bg-outline-variant/20">
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleBulkImport()}
                    disabled={!bulkFile}
                    className="px-4 py-2 text-sm font-medium text-on-primary bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Upload &amp; Import
                  </button>
                </div>
              </div>
            ) : (
              /* Phase 2: Status */
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    bulkJobStatus?.status === 'completed' ? 'bg-green-100 text-green-800' :
                    bulkJobStatus?.status === 'failed' ? 'bg-red-100 text-red-800' :
                    bulkJobStatus?.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    {bulkJobStatus?.status || 'pending'}
                  </span>
                  {bulkPolling && (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  )}
                </div>

                {bulkJobStatus && (
                  <>
                    {/* Progress bar */}
                    <div className="w-full bg-surface-container-high rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${bulkJobStatus.summary.total > 0 ? (bulkJobStatus.summary.processed / bulkJobStatus.summary.total) * 100 : 0}%` }}
                      />
                    </div>

                    {/* Summary */}
                    <table className="w-full text-sm border-collapse">
                      <tbody>
                        <tr className="border-b border-outline-variant/30"><td className="py-1 text-outline">Total</td><td className="py-1 font-medium text-right text-on-surface">{bulkJobStatus.summary.total}</td></tr>
                        <tr className="border-b border-outline-variant/30"><td className="py-1 text-outline">Processed</td><td className="py-1 font-medium text-right text-on-surface">{bulkJobStatus.summary.processed}</td></tr>
                        <tr className="border-b border-outline-variant/30"><td className="py-1 text-green-600">Created</td><td className="py-1 font-medium text-right text-green-600">{bulkJobStatus.summary.created}</td></tr>
                        <tr className="border-b border-outline-variant/30"><td className="py-1 text-red-600">Failed</td><td className="py-1 font-medium text-right text-red-600">{bulkJobStatus.summary.failed}</td></tr>
                        <tr><td className="py-1 text-yellow-600">Skipped</td><td className="py-1 font-medium text-right text-yellow-600">{bulkJobStatus.summary.skipped}</td></tr>
                      </tbody>
                    </table>

                    {/* Failed rows */}
                    {bulkJobStatus.failedRows.length > 0 && (
                      <details className="border border-red-200 rounded-md">
                        <summary className="px-3 py-2 text-sm font-medium text-red-700 cursor-pointer">
                          {bulkJobStatus.failedRows.length} failed row(s)
                        </summary>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead className="bg-red-50"><tr><th className="px-3 py-1 text-left">Row</th><th className="px-3 py-1 text-left">Email</th><th className="px-3 py-1 text-left">Error</th></tr></thead>
                            <tbody>
                              {bulkJobStatus.failedRows.map((row, i) => (
                                <tr key={i} className="border-t border-red-100">
                                  <td className="px-3 py-1">{row.rowNumber}</td>
                                  <td className="px-3 py-1">{row.email}</td>
                                  <td className="px-3 py-1 text-red-600">{row.error}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </details>
                    )}
                  </>
                )}

                <div className="flex justify-end pt-2 border-t border-outline-variant/50">
                  <button
                    type="button"
                    onClick={handleBulkModalClose}
                    disabled={bulkPolling && !['completed', 'failed'].includes(bulkJobStatus?.status || '')}
                    className="px-4 py-2 text-sm font-medium text-on-primary bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Change Role & Zonal Modal */}
      {showRoleZonalModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface-container rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] flex flex-col">
            <h3 className="text-lg font-semibold text-on-surface mb-1">{isFieldIncharge ? 'Change AC Assignment' : 'Change Role \u0026 Zonal'}</h3>
            <p className="text-sm text-on-surface-variant mb-4">
              For:{' '}
              <span className="font-medium">
                {selectedUser.profile?.firstName} {selectedUser.profile?.lastName}
              </span>
            </p>

            <form onSubmit={handleRoleZonalSubmit} className="flex flex-col flex-1 min-h-0">
              {/* Role section — hidden for field-incharge (they can only change AC, not role) */}
              {!isFieldIncharge && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-on-surface-variant mb-2">
                    Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-outline-variant bg-surface-container-low text-on-surface rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="respondent">Respondent</option>
                    <option value="client">Client</option>
                    <option value="partner">Partner</option>
                    <option value="field-agent">Field Agent</option>
                    <option value="field-incharge">Field Incharge</option>
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                    {isSuperAdmin && (
                      <option value="super-admin">Super Admin</option>
                    )}
                  </select>
                </div>
              )}

              {/* Company name — only needed the first time a user is promoted to client
                  (i.e. they don't already own/belong to a company); becomes the new
                  company's owner account, companyId is derived server-side from their
                  own firebaseUid. */}
              {!isFieldIncharge && selectedRole === 'client' && !selectedUser.companyId && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-on-surface-variant mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={selectedCompanyName}
                    onChange={(e) => setSelectedCompanyName(e.target.value)}
                    placeholder="e.g. Populus Empowerment Network"
                    required
                    className="w-full px-3 py-2 border border-outline-variant bg-surface-container-low text-on-surface rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="mt-1 text-xs text-outline">This user becomes the owner account for a new client company.</p>
                </div>
              )}

              {/* Zone picker — shown when assigning field-incharge role (admins only) */}
              {!isFieldIncharge && selectedRole === 'field-incharge' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-on-surface-variant mb-2">
                    Zone <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-outline-variant bg-surface-container-low text-on-surface rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select zone…</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="Central">Central</option>
                  </select>
                  <p className="mt-1 text-xs text-outline">Field Incharge has access to all field-agents within this zone.</p>
                </div>
              )}

              {/* Zonal section (AC picker) — only for non-field-incharge roles */}
              {selectedRole !== 'field-incharge' && !zoneHierarchyLoading && allAcFlat.length > 0 && (
                <>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-on-surface-variant mb-2">
                      Assembly Constituencies
                    </label>

                    {/* Selected ACs chips */}
                    {selectedAcDetails.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3 p-2 bg-blue-50 rounded-md border border-blue-100">
                        {selectedAcDetails.map(ac => (
                          <span
                            key={ac.acNo}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-on-primary"
                          >
                            {ac.name}
                            <span className="text-blue-200 text-xs">({ac.zone})</span>
                            <button
                              type="button"
                              onClick={() => toggleAcNo(ac.acNo)}
                              className="ml-0.5 text-on-primary hover:text-red-200 leading-none"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Search */}
                    <input
                      type="text"
                      placeholder="Search by AC name, district…"
                      value={acSearchText}
                      onChange={e => setAcSearchText(e.target.value)}
                      className="w-full px-3 py-2 mb-2 border border-outline-variant bg-surface-container-low text-on-surface rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* AC list */}
                  <div className="overflow-y-auto flex-1 border border-outline-variant rounded-md divide-y divide-outline-variant/10">
                    {modalFilteredAcs.length === 0 ? (
                      <p className="py-6 text-center text-sm text-outline">No results</p>
                    ) : (
                      modalFilteredAcs.map(ac => {
                        const isChecked = selectedAcNos.includes(ac.acNo);
                        return (
                          <label
                            key={ac.acNo}
                            className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-surface-container-high ${isChecked ? 'bg-primary/10' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleAcNo(ac.acNo)}
                              className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                            />
                            <span className="flex-1 min-w-0">
                              <span className="block text-sm font-medium text-on-surface truncate">
                                {ac.name}
                              </span>
                              <span className="block text-xs text-outline">
                                {ac.district} · <span className="font-medium">{ac.zone}</span> · #{ac.acNo}
                              </span>
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>

                  <p className="mt-2 text-xs text-outline">
                    {selectedAcNos.length} constituency{selectedAcNos.length !== 1 ? 's' : ''} selected
                  </p>
                </>
              )}

              <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-outline-variant/50">
                <button
                  type="button"
                  onClick={() => setShowRoleZonalModal(false)}
                  className="px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface-container-high border border-outline-variant rounded-md hover:bg-outline-variant/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-on-primary bg-primary rounded-md hover:bg-custom-blue"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Main component with AdminRouteGuard
export const UsersManagement: React.FC = () => {
  return (
    <AdminRouteGuard>
      <UserManagementContent />
    </AdminRouteGuard>
  );
};

export default UsersManagement;
