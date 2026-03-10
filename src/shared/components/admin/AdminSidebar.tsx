import React, { useState, useEffect } from 'react';

interface SidebarLink {
  href: string;
  label: string;
}

const sidebarLinks: SidebarLink[] = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/survey-analytics', label: 'Survey Analytics' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/survey-builder', label: 'Survey Builder' },
  { href: '/admin/surveys', label: 'Surveys' },
];

const STORAGE_KEY = 'admin-sidebar-collapsed';

const AdminSidebar: React.FC = () => {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  const isActive = (href: string) => {
    if (href === '/admin') {
      return currentPath === '/admin' || currentPath === '/admin/';
    }
    return currentPath.startsWith(href);
  };

  return (
    <aside className={`${isCollapsed ? 'w-14' : 'w-64'} bg-white border-r border-gray-200 min-h-screen flex-shrink-0 transition-all duration-200`}>
      <div className={`p-3 ${isCollapsed ? '' : 'px-6'}`}>
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
          )}
          <button
            onClick={() => setIsCollapsed((v) => !v)}
            className={`p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              )}
            </svg>
          </button>
        </div>

        <nav className="space-y-2">
          {sidebarLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              title={isCollapsed ? link.label : undefined}
              className={`flex items-center gap-3 px-2 py-3 rounded-lg transition-colors ${
                isActive(link.href)
                  ? 'bg-primary text-white font-medium'
                  : 'text-gray-700 hover:bg-gray-100 font-medium'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <span className="w-2 h-2 rounded-full bg-current flex-shrink-0" />
              {!isCollapsed && <span>{link.label}</span>}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
