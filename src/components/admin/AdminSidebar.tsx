import { Link, useLocation } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: 'dashboard' },
  { name: 'Content Management', href: '/admin/services', icon: 'article' },
  { name: 'Agents', href: '/admin/users', icon: 'group' },
  { name: 'Settings', href: '/admin/settings', icon: 'settings' },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
        <aside className="fixed left-0 top-0 w-64 h-screen bg-primary text-white flex flex-col z-40">

      <div className="p-6">
        <span className="text-2xl font-bold tracking-tight">Guday Admin</span>
      </div>
      
      <nav className="flex-1 mt-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
                          (item.href !== '/admin/dashboard' && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`sidebar-link flex items-center px-6 py-4 hover:bg-white/5 transition-colors ${
                isActive ? 'active' : ''
              }`}
            >
              <span className="material-symbols-outlined mr-3">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-xs font-bold">
            JD
          </div>
          <div>
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-white/60"> Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}