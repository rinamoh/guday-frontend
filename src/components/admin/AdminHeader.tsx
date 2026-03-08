// src/components/admin/AdminHeader.tsx
import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AdminHeaderProps {
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: ReactNode;
}

export function AdminHeader({ breadcrumbs, actions }: AdminHeaderProps) {
  return (
    <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white shrink-0">
      <div className="flex items-center text-sm font-medium text-slate-600 overflow-x-auto min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <div className="flex items-center gap-2 whitespace-nowrap">
            {breadcrumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                {index > 0 && <span className="text-slate-300">/</span>}
                {crumb.href ? (
                  <Link to={crumb.href} className="hover:text-primary">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-900">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-slate-900" />
        )}
      </div>

      {actions ? <div className="flex items-center gap-3">{actions}</div> : <div />}
    </header>
  );
}
