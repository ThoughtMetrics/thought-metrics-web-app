import React from 'react';
interface SidebarLink {
  href: string;
  label: string;
  icon?: string;
}

const sidebarLinks: SidebarLink[] = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/survey-analytics', label: 'Survey Analytics' },
  { href: '/admin/users', label: 'Users' },
];

const AdminSidebar: React.FC = () => {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  const isActive = (href: string) => {
    if (href === '/admin') {
      return currentPath === '/admin' || currentPath === '/admin/';
    }
    return currentPath.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          {sidebarLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 rounded-lg transition-colors ${
                isActive(link.href)
                  ? 'bg-primary text-white font-medium'
                  : 'text-gray-700 hover:bg-gray-100 font-medium'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
