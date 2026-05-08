import React, { useState, useEffect } from 'react';

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const DashboardIcon = () => (
  <svg viewBox="0 0 66 66" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 5C0 2.23858 2.23858 0 5 0H25C27.7614 0 30 2.23858 30 5V40C30 42.7614 27.7614 45 25 45H5C2.23858 45 0 42.7614 0 40V5Z" fill="currentColor"/>
    <path d="M36 5C36 2.23858 38.2386 0 41 0H61C63.7614 0 66 2.23858 66 5V25C66 27.7614 63.7614 30 61 30H41C38.2386 30 36 27.7614 36 25V5Z" fill="currentColor"/>
    <path d="M36 41C36 38.2386 38.2386 36 41 36H61C63.7614 36 66 38.2386 66 41V61C66 63.7614 63.7614 66 61 66H41C38.2386 66 36 63.7614 36 61V41Z" fill="currentColor"/>
    <path d="M0 56C0 53.2386 2.23858 51 5 51H25C27.7614 51 30 53.2386 30 56V61C30 63.7614 27.7614 66 25 66H5C2.23858 66 0 63.7614 0 61V56Z" fill="currentColor"/>
  </svg>
);

const SurveyIcon = () => (
  <svg viewBox="0 0 66 71" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.8014 21.7484C14.228 21.7484 17.2077 20.1042 19.219 17.6379H45.2912C46.0361 17.6379 46.6321 17.04 46.6321 16.2926V5.45579C46.6321 4.70842 46.0361 4.11053 45.2912 4.11053H19.219C17.2077 1.64421 14.228 0 10.8014 0C4.84199 0.0747368 0 4.93263 0 10.9116C0 16.8905 4.84199 21.7484 10.8014 21.7484ZM10.8014 2.69053C15.3454 2.69053 18.9955 6.35263 18.9955 10.9116C18.9955 15.4705 15.3454 19.1326 10.8014 19.1326C6.25734 19.1326 2.60722 15.4705 2.60722 10.9116C2.60722 6.42737 6.33183 2.69053 10.8014 2.69053Z" fill="currentColor"/>
    <path d="M64.6591 28.8484H19.219C17.2077 26.3821 14.228 24.7379 10.8014 24.7379C4.84199 24.7379 0 29.5958 0 35.5747C0 41.5537 4.84199 46.4116 10.8014 46.4116C14.228 46.4116 17.2077 44.7674 19.219 42.301H64.6591C65.4041 42.301 66 41.7032 66 40.9558V30.1189C66 29.3716 65.4041 28.8484 64.6591 28.8484ZM10.8014 43.7958C6.25734 43.7958 2.60722 40.1337 2.60722 35.5747C2.60722 31.0158 6.25734 27.3537 10.8014 27.3537C15.3454 27.3537 18.9955 31.0158 18.9955 35.5747C18.9955 40.1337 15.3454 43.7958 10.8014 43.7958Z" fill="currentColor"/>
    <path d="M55.4221 53.4368H19.219C17.2077 50.9705 14.228 49.3263 10.8014 49.3263C4.84199 49.3263 0 54.1842 0 60.1632C0 66.1421 4.84199 71 10.8014 71C14.228 71 17.2077 69.3558 19.219 66.8895H55.4221C56.167 66.8895 56.763 66.2916 56.763 65.5442V54.7821C56.763 54.0347 56.167 53.4368 55.4221 53.4368ZM10.8014 68.4589C6.25734 68.4589 2.60722 64.7968 2.60722 60.2379C2.60722 55.6789 6.25734 52.0168 10.8014 52.0168C15.3454 52.0168 18.9955 55.6789 18.9955 60.2379C18.9955 64.7221 15.3454 68.4589 10.8014 68.4589Z" fill="currentColor"/>
  </svg>
);

const BuilderIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 21V9" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const CampaignsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const sidebarLinks: SidebarLink[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { href: '/dashboard/surveys', label: 'My Surveys', icon: <SurveyIcon /> },
  { href: '/dashboard/survey-builder', label: 'Survey Builder', icon: <BuilderIcon /> },
  { href: '/dashboard/campaigns', label: 'Campaigns', icon: <CampaignsIcon /> },
  { href: '/dashboard/analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
];

const STORAGE_KEY = 'client-sidebar-collapsed';

const ClientSidebar: React.FC = () => {
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
    if (href === '/dashboard') {
      return currentPath === '/dashboard' || currentPath === '/dashboard/';
    }
    return currentPath.startsWith(href);
  };

  return (
    <aside className={`${isCollapsed ? 'w-14' : 'w-64'} bg-white border-r border-gray-200 min-h-screen flex-shrink-0 transition-all duration-200`}>
      <div className={`p-3 ${isCollapsed ? '' : 'px-6'}`}>
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <h2 className="text-2xl font-bold text-gray-800">My Workspace</h2>
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
              <span className="w-5 h-5 flex-shrink-0">{link.icon}</span>
              {!isCollapsed && <span>{link.label}</span>}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default ClientSidebar;
