import { type ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
  chart?: ReactNode;
}

export function StatsCard({ title, value, subtitle, icon, trend, chart }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className="text-slate-500 text-sm font-medium">{title}</span>
          {trend && (
            <span className={`flex items-center text-xs font-bold ${
              trend.direction === 'up' ? 'text-emerald-500' : 'text-red-500'
            }`}>
              <span className="material-symbols-outlined text-xs mr-0.5">
                {trend.direction === 'up' ? 'trending_up' : 'trending_down'}
              </span>
              {trend.value}
            </span>
          )}
          {icon && (
            <span className="text-slate-400 material-symbols-outlined text-lg">{icon}</span>
          )}
        </div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {subtitle && <div className="mt-2 text-xs text-slate-400">{subtitle}</div>}
      </div>
      {chart && (
        <div className="mt-4 h-10 w-full overflow-hidden">
          {chart}
        </div>
      )}
    </div>
  );
}