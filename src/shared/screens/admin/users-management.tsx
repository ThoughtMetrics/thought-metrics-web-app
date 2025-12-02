import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/shared/providers/auth-provider';
import AdminSidebar from '@/shared/components/admin/AdminSidebar';
import AdminRouteGuard from '@/shared/components/guards/AdminRouteGuard';
import UserManagementService from '@/services/api/user-management.service';
import type { UserProfile, UserRole } from '@/core/types/user.type';
import { toast } from 'sonner';
import { LoaderUI } from '@/shared/ui/atoms/loader/LoaderUI';

const UserManagementContent: React.FC = () => {
  const { isSuperAdmin } = useAuth();
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
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [selectedRole, setSelectedRole] = useState<UserRole>('respondent');
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Fetch users on component mount and when page changes
  useEffect(() => {
    fetchUsers();
  }, [page]);

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
      const response = await UserManagementService.getUsers({ page, limit });
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

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const response = await UserManagementService.updateUser(selectedUser._id, {
        profile: {
          firstName: editFormData.firstName,
          lastName: editFormData.lastName,
          phone: editFormData.phone,
        },
        email: editFormData.email,
      } as any);

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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex min-h-screen bg-gray-50 text-text-dark">
      <AdminSidebar />

      <main className="flex-1 overflow-y-scroll p-8">
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
              <h2 className="text-xl font-semibold text-gray-900">
                Users ({total})
              </h2>
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
                                      onClick={() => handleDeleteClick(userItem)}
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
                      setEditFormData({ ...editFormData, firstName: e.target.value })
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
                      setEditFormData({ ...editFormData, lastName: e.target.value })
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
                      setEditFormData({ ...editFormData, email: e.target.value })
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
                      setEditFormData({ ...editFormData, phone: e.target.value })
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
                {selectedUser.profile?.firstName} {selectedUser.profile?.lastName}
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
