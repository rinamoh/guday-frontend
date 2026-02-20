import { type ReactNode } from 'react';

interface AdminHeaderProps {
  //title: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: ReactNode;
}

export function AdminHeader({ title, breadcrumbs, actions }: AdminHeaderProps) {
  return (
    <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white shrink-0">
      <div className="flex items-center text-sm font-medium text-slate-500">
        {breadcrumbs?.map((crumb, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <span className="material-symbols-outlined text-sm mx-2">chevron_right</span>
            )}
            {crumb.href ? (
              <a href={crumb.href} className="hover:text-primary">
                {crumb.label}
              </a>
            ) : (
              <span className="text-slate-900">{crumb.label}</span>
            )}
          </div>
        ))}
      </div>
      
      {actions && (
        <div className="flex items-center space-x-4">
          {actions}
        </div>
      )}
    </header>
  );
}