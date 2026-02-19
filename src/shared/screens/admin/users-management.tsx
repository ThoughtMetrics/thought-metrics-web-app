import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/shared/providers/auth-provider';
import AdminSidebar from '@/shared/components/admin/AdminSidebar';
import AdminRouteGuard from '@/shared/components/guards/AdminRouteGuard';
import UserManagementService from '@/services/api/user-management.service';
import ZoneService from '@/services/api/zone.service';
import type { UserProfile, UserRole } from '@/core/types/user.type';
import type { ZoneHierarchy } from '@/core/types/zone.type';
import { toast } from 'sonner';
import { LoaderUI } from '@/shared/ui/atoms/loader/LoaderUI';

const UserManagementContent: React.FC = () => {
  const { user, isAuthReady, isSuperAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showZonalModal, setShowZonalModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [selectedRole, setSelectedRole] = useState<UserRole>('respondent');
  // Multi-select zonal state for Change Zonal modal
  const [zoneHierarchy, setZoneHierarchy] = useState<ZoneHierarchy>([]);
  const [zoneHierarchyLoading, setZoneHierarchyLoading] = useState(true);
  const [selectedAcNos, setSelectedAcNos] = useState<number[]>([]);
  const [acSearchText, setAcSearchText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Load zone hierarchy once auth is ready
  useEffect(() => {
    if (!isAuthReady || !user) return;
    setZoneHierarchyLoading(true);
    ZoneService.getHierarchy()
      .then((data) => {
        console.debug('[UserManagement] Zone hierarchy loaded:', data.length, 'zones');
        setZoneHierarchy(data);
      })
      .catch((err) => {
        console.error('[UserManagement] Failed to load zone hierarchy:', err);
        toast.error('Failed to load zone data', { description: err.message });
      })
      .finally(() => setZoneHierarchyLoading(false));
  }, [isAuthReady, user]);

  // Fetch users when auth is ready and when page/filters change
  useEffect(() => {
    if (!isAuthReady || !user) return;
    fetchUsers();
  }, [isAuthReady, user, page, filterRole, filterZone, filterDistrict]);

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

  const handleRoleClick = (user: UserProfile) => {
    setSelectedUser(user);
    setSelectedRole(user.role || 'respondent');
    setShowRoleModal(true);
    setOpenMenuId(null);
  };

  const handleZonalClick = (user: UserProfile) => {
    setSelectedUser(user);
    // Pre-select all current AC numbers if user has zonalInfo array
    if (user.zonalInfo && user.zonalInfo.length > 0) {
      setSelectedAcNos(user.zonalInfo.map(zi => zi.acNo));
    } else {
      setSelectedAcNos([]);
    }
    setAcSearchText('');
    setShowZonalModal(true);
    setOpenMenuId(null);
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

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const response = await UserManagementService.updateUserRole(
        selectedUser._id,
        selectedRole
      );

      if (response.data) {
        toast.success('User role updated successfully');
        setShowRoleModal(false);
        fetchUsers();
      }
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role', {
        description: error.message || 'An error occurred',
      });
    }
  };

  const handleZonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || selectedAcNos.length === 0) return;

    try {
      const response = await UserManagementService.updateUserZonal(
        selectedUser._id,
        selectedAcNos
      );

      if (response.data) {
        toast.success('User zonal updated successfully');
        setShowZonalModal(false);
        fetchUsers();
      }
    } catch (error: any) {
      console.error('Error updating zonal:', error);
      toast.error('Failed to update zonal', {
        description: error.message || 'An error occurred',
      });
    }
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
    <div className="flex bg-gray-50 text-text-dark h-full">
      <AdminSidebar />

      <main className="h-full flex-1 overflow-y-scroll p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              User Management
            </h1>
            <p className="text-gray-600">
              Manage users, roles, and permissions
            </p>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Users ({total})
                </h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search */}
                  <div className="relative flex-1">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary w-full"
                    />
                  </div>
                  {/* Role Filter */}
                  <select
                    value={filterRole}
                    onChange={(e) => { setFilterRole(e.target.value); setPage(1); }}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
                  >
                    <option value="all">All Roles</option>
                    <option value="super-admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="employee">Employee</option>
                    <option value="client">Client</option>
                    <option value="respondent">Respondent</option>
                    <option value="partner">Partner</option>
                    <option value="field-agent">Field Agent</option>
                  </select>
                  {/* Zone Filter */}
                  <select
                    value={filterZone}
                    onChange={(e) => { setFilterZone(e.target.value); setFilterDistrict('all'); setPage(1); }}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
                  >
                    <option value="all">All Zones</option>
                    {zoneHierarchy.map(z => (
                      <option key={z.zone} value={z.zone}>{z.zone}</option>
                    ))}
                  </select>
                  {/* District Filter */}
                  <select
                    value={filterDistrict}
                    onChange={(e) => { setFilterDistrict(e.target.value); setPage(1); }}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
                  >
                    <option value="all">All Districts</option>
                    {filterDistrictOptions.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
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
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Zonal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((userItem) => (
                        <tr key={userItem._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 shrink-0">
                                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                                  {(
                                    userItem.profile?.firstName?.[0] ||
                                    userItem.email?.[0] ||
                                    '?'
                                  ).toUpperCase()}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {userItem.profile?.firstName}{' '}
                                  {userItem.profile?.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {userItem.firebaseUid.substring(0, 12)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
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
                                <div className="text-xs text-gray-500 mt-0.5">
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
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                Not Assigned
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(userItem.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="relative inline-block text-left">
                              <button
                                onClick={() => handleMenuToggle(userItem._id)}
                                className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 focus:outline-none"
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
                                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                                >
                                  <div className="py-1">
                                    <button
                                      onClick={() => handleEditClick(userItem)}
                                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleRoleClick(userItem)}
                                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      Change Role
                                    </button>
                                    <button
                                      onClick={() => handleZonalClick(userItem)}
                                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      Change Zonal
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteClick(userItem)
                                      }
                                      className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                    >
                                      Delete
                                    </button>
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
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing page {page} of {totalPages}
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
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-custom-blue"
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
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete User</h3>
            <p className="text-gray-600 mb-6">
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
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
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

      {/* Change Role Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Change User Role</h3>
            <form onSubmit={handleRoleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Role for {selectedUser.profile?.firstName}{' '}
                  {selectedUser.profile?.lastName}
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="respondent">Respondent</option>
                  <option value="client">Client</option>
                  <option value="partner">Partner</option>
                  <option value="field-agent">Field Agent</option>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                  {isSuperAdmin && (
                    <option value="super-admin">Super Admin</option>
                  )}
                </select>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-custom-blue"
                >
                  Update Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Zonal Modal - Multi-select Assembly Constituencies */}
      {showZonalModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] flex flex-col">
            <h3 className="text-lg font-semibold mb-1">Change User Zonal</h3>
            <p className="text-sm text-gray-600 mb-4">
              Assign assembly constituencies for{' '}
              <span className="font-medium">
                {selectedUser.profile?.firstName} {selectedUser.profile?.lastName}
              </span>
            </p>

            <form onSubmit={handleZonalSubmit} className="flex flex-col flex-1 min-h-0">
              {zoneHierarchyLoading ? (
                <div className="py-8 text-center text-sm text-gray-500">Loading zone data…</div>
              ) : allAcFlat.length === 0 ? (
                <div className="py-8 text-center text-sm text-red-500">
                  No zone data available. Please ensure zones are seeded in the database.
                </div>
              ) : (
                <>
                  {/* Selected ACs chips */}
                  {selectedAcDetails.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3 p-2 bg-blue-50 rounded-md border border-blue-100">
                      {selectedAcDetails.map(ac => (
                        <span
                          key={ac.acNo}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-white"
                        >
                          {ac.name}
                          <span className="text-blue-200 text-xs">({ac.zone})</span>
                          <button
                            type="button"
                            onClick={() => toggleAcNo(ac.acNo)}
                            className="ml-0.5 text-white hover:text-red-200 leading-none"
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
                    className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />

                  {/* AC list */}
                  <div className="overflow-y-auto flex-1 border border-gray-200 rounded-md divide-y divide-gray-100">
                    {modalFilteredAcs.length === 0 ? (
                      <p className="py-6 text-center text-sm text-gray-400">No results</p>
                    ) : (
                      modalFilteredAcs.map(ac => {
                        const isChecked = selectedAcNos.includes(ac.acNo);
                        return (
                          <label
                            key={ac.acNo}
                            className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 ${isChecked ? 'bg-blue-50' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleAcNo(ac.acNo)}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="flex-1 min-w-0">
                              <span className="block text-sm font-medium text-gray-800 truncate">
                                {ac.name}
                              </span>
                              <span className="block text-xs text-gray-500">
                                {ac.district} · <span className="font-medium">{ac.zone}</span> · #{ac.acNo}
                              </span>
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    {selectedAcNos.length} constituency{selectedAcNos.length !== 1 ? 's' : ''} selected
                  </p>
                </>
              )}

              <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowZonalModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedAcNos.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-custom-blue disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Zonal
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
