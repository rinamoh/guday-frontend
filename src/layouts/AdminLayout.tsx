import { type ReactNode } from 'react';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: ReactNode;
}

export function AdminLayout({ children, title, breadcrumbs, actions }: AdminLayoutProps) {
  return (
    <div className="min-h-screen overflow-hidden">
      <AdminSidebar />

      <div className="ml-64 min-h-screen flex flex-col min-w-0 bg-white">
        <AdminHeader title={title} breadcrumbs={breadcrumbs} actions={actions} />
        <main className="flex-1 flex overflow-hidden min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
