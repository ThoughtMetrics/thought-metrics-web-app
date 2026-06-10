import React, { useState, useEffect } from 'react';
import UserManagementService from '@/services/api/user-management.service';

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);

const SurveysIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
  </svg>
);

const BuilderIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const TeamIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const STORAGE_KEY = 'client-sidebar-collapsed';

const sidebarLinks: SidebarLink[] = [
  { href: '/client', label: 'Dashboard', icon: <DashboardIcon /> },
  { href: '/client/surveys', label: 'My Surveys', icon: <SurveysIcon /> },
  { href: '/client/survey-builder', label: 'Survey Builder', icon: <BuilderIcon /> },
  { href: '/client/team', label: 'Team', icon: <TeamIcon /> },
  { href: '/client/analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
];

interface StorageInfo {
  storageUsed: number;
  storageQuota: number | null;
  usagePercent: number;
}

const StorageRing: React.FC<{ storage: StorageInfo; collapsed: boolean }> = ({ storage, collapsed }) => {
  const { storageUsed, storageQuota, usagePercent } = storage;
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (usagePercent / 100) * circumference;
  const color = usagePercent >= 95 ? '#ef4444' : usagePercent >= 80 ? '#f59e0b' : '#6366f1';

  const fmt = (bytes: number) => bytes < 1048576 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1048576).toFixed(1)} MB`;

  return (
    <div className={`flex items-center gap-3 px-2 py-3 ${collapsed ? 'justify-center' : ''}`}>
      <svg width="44" height="44" className="flex-shrink-0">
        <circle cx="22" cy="22" r={radius} stroke="#e5e7eb" strokeWidth="4" fill="none" />
        <circle
          cx="22" cy="22" r={radius}
          stroke={color} strokeWidth="4" fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '22px 22px', transition: 'stroke-dashoffset 0.5s' }}
        />
        <text x="22" y="26" textAnchor="middle" fontSize="9" fill={color} fontWeight="600">{usagePercent}%</text>
      </svg>
      {!collapsed && (
        <div className="min-w-0">
          <p className="text-xs font-medium text-on-surface-variant leading-tight">Storage</p>
          <p className="text-xs text-outline truncate">
            {fmt(storageUsed)} / {storageQuota ? fmt(storageQuota) : '—'}
          </p>
        </div>
      )}
    </div>
  );
};

const ClientSidebar: React.FC = () => {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem(STORAGE_KEY) === 'true';
    return false;
  });
  const [storage, setStorage] = useState<StorageInfo | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    UserManagementService.getStorageUsage()
      .then((res) => { if (res.data) setStorage(res.data as StorageInfo); })
      .catch(() => {});
  }, []);

  const isActive = (href: string) => {
    if (href === '/client') return currentPath === '/client' || currentPath === '/client/';
    return currentPath.startsWith(href);
  };

  return (
    <aside className={`${isCollapsed ? 'w-14' : 'w-64'} bg-surface-container border-r border-outline-variant min-h-screen flex-shrink-0 transition-all duration-200 flex flex-col`}>
      <div className={`p-3 ${isCollapsed ? '' : 'px-6'} flex-1`}>
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <h2 className="text-2xl font-bold text-on-surface">Client Panel</h2>
          )}
          <button
            onClick={() => setIsCollapsed((v) => !v)}
            className={`p-1 rounded hover:bg-surface-container-high text-outline hover:text-on-surface transition-colors flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isCollapsed
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />}
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
                  : 'text-on-surface-variant hover:bg-surface-container-high font-medium'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <span className="w-5 h-5 flex-shrink-0">{link.icon}</span>
              {!isCollapsed && <span>{link.label}</span>}
            </a>
          ))}
        </nav>
      </div>

      {storage && (
        <div className="border-t border-outline-variant p-2">
          <StorageRing storage={storage} collapsed={isCollapsed} />
        </div>
      )}
    </aside>
  );
};

export default ClientSidebar;
