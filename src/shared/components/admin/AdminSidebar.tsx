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

const UsersIcon = () => (
  <svg viewBox="0 0 66 50" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M35.4833 11.8979C35.4833 18.4701 30.186 23.7985 23.6482 23.7985C17.1104 23.7985 11.8105 18.4696 11.8105 11.8979C11.8105 5.32925 17.1112 0 23.6482 0C30.1852 0 35.4833 5.32889 35.4833 11.8979Z" fill="currentColor"/>
    <path d="M3.09843 50H44.1989C45.9253 50 47.3217 48.5962 47.3217 46.8606C47.3217 36.3287 38.8286 27.7939 28.3557 27.7939H18.966C8.48971 27.7939 0 36.3321 0 46.8606C0 48.5962 1.3964 50 3.1228 50H3.09843Z" fill="currentColor"/>
    <path d="M42.3234 23.8057C48.8609 23.8057 54.1585 18.4768 54.1585 11.9077C54.1585 5.3356 48.8578 0.00983514 42.3234 0.00983514C40.1351 0.00983514 38.0891 0.617461 36.3314 1.66512C38.5823 4.47274 39.9405 8.03817 39.9405 11.9181C39.9405 15.7978 38.5893 19.3562 36.3314 22.1711C38.0925 23.2188 40.1385 23.8264 42.3234 23.8264V23.8057Z" fill="currentColor"/>
    <path d="M42.0488 27.7937C47.9263 32.075 51.7613 39.0309 51.7613 46.8604C51.7613 47.9778 51.5112 49.0324 51.0839 49.9997H62.8772C64.6036 49.9997 66 48.5959 66 46.8604C66 36.3284 57.5069 27.7937 47.034 27.7937H42.0488Z" fill="currentColor"/>
  </svg>
);

const SurveyIcon = () => (
  <svg viewBox="0 0 66 71" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.8014 21.7484C14.228 21.7484 17.2077 20.1042 19.219 17.6379H45.2912C46.0361 17.6379 46.6321 17.04 46.6321 16.2926V5.45579C46.6321 4.70842 46.0361 4.11053 45.2912 4.11053H19.219C17.2077 1.64421 14.228 0 10.8014 0C4.84199 0.0747368 0 4.93263 0 10.9116C0 16.8905 4.84199 21.7484 10.8014 21.7484ZM10.8014 2.69053C15.3454 2.69053 18.9955 6.35263 18.9955 10.9116C18.9955 15.4705 15.3454 19.1326 10.8014 19.1326C6.25734 19.1326 2.60722 15.4705 2.60722 10.9116C2.60722 6.42737 6.33183 2.69053 10.8014 2.69053Z" fill="currentColor"/>
    <path d="M64.6591 28.8484H19.219C17.2077 26.3821 14.228 24.7379 10.8014 24.7379C4.84199 24.7379 0 29.5958 0 35.5747C0 41.5537 4.84199 46.4116 10.8014 46.4116C14.228 46.4116 17.2077 44.7674 19.219 42.301H64.6591C65.4041 42.301 66 41.7032 66 40.9558V30.1189C66 29.3716 65.4041 28.8484 64.6591 28.8484ZM10.8014 43.7958C6.25734 43.7958 2.60722 40.1337 2.60722 35.5747C2.60722 31.0158 6.25734 27.3537 10.8014 27.3537C15.3454 27.3537 18.9955 31.0158 18.9955 35.5747C18.9955 40.1337 15.3454 43.7958 10.8014 43.7958Z" fill="currentColor"/>
    <path d="M13.1106 32.4358L9.83296 36.1726L8.19413 34.5284C7.67269 34.0053 6.85327 34.0053 6.33183 34.5284C5.81038 35.0516 5.81038 35.8737 6.33183 36.3968L8.93905 39.0126C9.16253 39.2368 9.53499 39.3863 9.83296 39.3863C9.83296 39.3863 9.83296 39.3863 9.90745 39.3863C10.2799 39.3863 10.5779 39.2368 10.8758 38.9379L15.1219 34.1547C15.5688 33.6316 15.5688 32.8095 14.9729 32.2863C14.377 31.8379 13.5576 31.9126 13.1106 32.4358Z" fill="currentColor"/>
    <path d="M55.4221 53.4368H19.219C17.2077 50.9705 14.228 49.3263 10.8014 49.3263C4.84199 49.3263 0 54.1842 0 60.1632C0 66.1421 4.84199 71 10.8014 71C14.228 71 17.2077 69.3558 19.219 66.8895H55.4221C56.167 66.8895 56.763 66.2916 56.763 65.5442V54.7821C56.763 54.0347 56.167 53.4368 55.4221 53.4368ZM10.8014 68.4589C6.25734 68.4589 2.60722 64.7968 2.60722 60.2379C2.60722 55.6789 6.25734 52.0168 10.8014 52.0168C15.3454 52.0168 18.9955 55.6789 18.9955 60.2379C18.9955 64.7221 15.3454 68.4589 10.8014 68.4589Z" fill="currentColor"/>
    <path d="M14.4515 56.5758C13.93 56.0526 13.1106 56.0526 12.5892 56.5758L10.8014 58.3695L9.01354 56.5758C8.4921 56.0526 7.67269 56.0526 7.15124 56.5758C6.6298 57.0989 6.6298 57.921 7.15124 58.4442L8.93905 60.2379L7.15124 62.0316C6.6298 62.5547 6.6298 63.3768 7.15124 63.9C7.37472 64.1242 7.74718 64.2737 8.04515 64.2737C8.34311 64.2737 8.71558 64.1242 8.93905 63.9L10.7269 62.1063L12.5147 63.9C12.7381 64.1242 13.1106 64.2737 13.4086 64.2737C13.781 64.2737 14.079 64.1242 14.3025 63.9C14.8239 63.3768 14.8239 62.5547 14.3025 62.0316L12.6637 60.2379L14.4515 58.4442C14.9729 57.921 14.9729 57.0989 14.4515 56.5758Z" fill="currentColor"/>
    <path d="M7.15124 14.5737C7.37472 14.7979 7.74718 14.9474 8.04515 14.9474C8.34311 14.9474 8.71558 14.7979 8.93905 14.5737L10.7269 12.78L12.5147 14.5737C12.7381 14.7979 13.1106 14.9474 13.4086 14.9474C13.781 14.9474 14.079 14.7979 14.3025 14.5737C14.8239 14.0505 14.8239 13.2284 14.3025 12.7053L12.6637 10.9116L14.4515 9.11789C14.9729 8.59474 14.9729 7.77263 14.4515 7.24947C13.93 6.72632 13.1106 6.72632 12.5892 7.24947L10.8014 9.04316L9.01354 7.24947C8.4921 6.72632 7.67269 6.72632 7.15124 7.24947C6.6298 7.77263 6.6298 8.59474 7.15124 9.11789L8.93905 10.9116L7.15124 12.7053C6.6298 13.2284 6.6298 14.0505 7.15124 14.5737Z" fill="currentColor"/>
  </svg>
);

const ImportIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const CampaignsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const sidebarLinks: SidebarLink[] = [
  { href: '/admin', label: 'Dashboard', icon: <DashboardIcon /> },
  { href: '/admin/users', label: 'Users', icon: <UsersIcon /> },
  { href: '/admin/surveys', label: 'Surveys', icon: <SurveyIcon /> },
  { href: '/admin/campaigns', label: 'Campaigns', icon: <CampaignsIcon /> },
  { href: '/admin/survey-import', label: 'Survey Import', icon: <ImportIcon /> },
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
              <span className="w-5 h-5 flex-shrink-0">{link.icon}</span>
              {!isCollapsed && <span>{link.label}</span>}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
