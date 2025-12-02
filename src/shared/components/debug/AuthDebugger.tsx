import React, { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider, useAuth } from '@/shared/providers/auth-provider';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

const AuthDebuggerContent: React.FC = () => {
  const { user, isAuthReady, userRole, isAdmin, isSuperAdmin } = useAuth();
  const [tokenClaims, setTokenClaims] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchTokenClaims = async () => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          setTokenClaims(idTokenResult.claims);
        } catch (error) {
          console.error('Failed to get token claims:', error);
        }
      } else {
        setTokenClaims(null);
      }
    };

    fetchTokenClaims();
  }, [user]);

  const handleRefreshToken = async () => {
    if (!user) return;

    setIsRefreshing(true);
    try {
      await user.getIdToken(true); // Force refresh
      const idTokenResult = await user.getIdTokenResult();
      setTokenClaims(idTokenResult.claims);
      alert(
        'Token refreshed! If you just set your role, you should now see it above.'
      );
    } catch (error) {
      console.error('Failed to refresh token:', error);
      alert('Failed to refresh token. Check console for details.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const StatusIcon: React.FC<{ condition: boolean }> = ({ condition }) => {
    return condition ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Authentication Debugger
            </h1>
          </div>

          {/* Auth State Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Auth State Summary
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Auth Ready</span>
                <div className="flex items-center gap-2">
                  <StatusIcon condition={isAuthReady} />
                  <span className="text-sm text-gray-600">
                    {isAuthReady ? 'Yes' : 'No (Waiting...)'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">
                  User Logged In
                </span>
                <div className="flex items-center gap-2">
                  <StatusIcon condition={!!user} />
                  <span className="text-sm text-gray-600">
                    {user ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Is Admin</span>
                <div className="flex items-center gap-2">
                  <StatusIcon condition={isAdmin} />
                  <span className="text-sm text-gray-600">
                    {isAdmin ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">
                  Is Super Admin
                </span>
                <div className="flex items-center gap-2">
                  <StatusIcon condition={isSuperAdmin} />
                  <span className="text-sm text-gray-600">
                    {isSuperAdmin ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* User Details */}
          {user && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                User Details
              </h2>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600 font-medium">UID:</span>
                  <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-sm">
                    {user.uid}
                  </code>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Email:</span>
                  <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-sm">
                    {user.email}
                  </code>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">
                    Display Name:
                  </span>
                  <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-sm">
                    {user.displayName || 'Not set'}
                  </code>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">
                    Computed Role:
                  </span>
                  <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-sm">
                    {userRole || 'Not set'}
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* Firebase Token Claims */}
          {user && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Firebase Token Claims
                </h2>
                <button
                  onClick={handleRefreshToken}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
                  />
                  {isRefreshing ? 'Refreshing...' : 'Refresh Token'}
                </button>
              </div>
              {tokenClaims ? (
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  {JSON.stringify(tokenClaims, null, 2)}
                </pre>
              ) : (
                <p className="text-gray-600">Loading token claims...</p>
              )}
            </div>
          )}

          {/* Diagnosis */}
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Diagnosis
            </h2>
            <div className="space-y-3 text-sm">
              {!isAuthReady && (
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Auth Not Ready
                    </p>
                    <p className="text-gray-600">
                      Firebase auth is still initializing. If this persists,
                      check if Firebase is properly configured.
                    </p>
                  </div>
                </div>
              )}

              {isAuthReady && !user && (
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Not Logged In</p>
                    <p className="text-gray-600">
                      You are not logged in. Please log in first.
                    </p>
                    <a
                      href="/login"
                      className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Go to Login
                    </a>
                  </div>
                </div>
              )}

              {user && !isAdmin && tokenClaims && !tokenClaims.role && (
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Role Claim Missing
                    </p>
                    <p className="text-gray-600 mb-2">
                      Your Firebase token does not have a "role" claim. You need
                      to set this using the Firebase Admin SDK.
                    </p>
                    <div className="bg-white p-3 rounded border border-gray-300">
                      <p className="text-gray-700 mb-2 font-medium">
                        Run this script on your API server:
                      </p>
                      <pre className="bg-gray-900 text-green-400 p-2 rounded text-xs overflow-x-auto">
                        {`import admin from 'firebase-admin';

const user = await admin.auth().getUserByEmail('${user.email}');
await admin.auth().setCustomUserClaims(user.uid, {
  role: 'super-admin'
});

console.debug('Role set! User must sign out and sign in again.');`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {user &&
                !isAdmin &&
                tokenClaims &&
                tokenClaims.role &&
                tokenClaims.role !== 'admin' &&
                tokenClaims.role !== 'super-admin' && (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        Role is "{tokenClaims.role}"
                      </p>
                      <p className="text-gray-600">
                        Your role is set to "{tokenClaims.role}" but admin pages
                        require "admin" or "super-admin". Update your role claim
                        and refresh the token above.
                      </p>
                    </div>
                  </div>
                )}

              {user && isAdmin && (
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Access Granted!
                    </p>
                    <p className="text-gray-600 mb-2">
                      You have admin access. You should be able to access admin
                      pages.
                    </p>
                    <a
                      href="/admin/analytics"
                      className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
                    >
                      Go to Analytics
                    </a>
                    <a
                      href="/admin/create-tracking-link"
                      className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Create Tracking Link
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Console Logs Notice */}
          <div className="mt-6 bg-blue-100 border border-blue-300 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>💡 Tip:</strong> Open your browser's Developer Console
              (F12) to see detailed auth flow logs with prefixes like{' '}
              <code className="bg-blue-200 px-1 rounded">[AuthProvider]</code>{' '}
              and{' '}
              <code className="bg-blue-200 px-1 rounded">
                [AdminRouteGuard]
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthDebugger: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthDebuggerContent />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default AuthDebugger;
