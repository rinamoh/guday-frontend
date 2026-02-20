import { AdminLayout } from '../layouts/AdminLayout';
import { StatsCard } from '../components/admin/StatsCard';
import { ApplicationTrendsChart } from '../components/admin/ApplicationTrendsChart';
import { RecentActivity } from '../components/admin/RecentActivity';
import { QuickActions } from '../components/admin/QuickActions';
import { TrendChart } from '../components/admin/TrendChart';
import { DashboardHeaderActions } from '../components/admin/DashboardHeaderActions';

export function AdminDashboard() {
  return (
    <AdminLayout
      title="Dashboard Overview"
      actions={<DashboardHeaderActions />}
    >
      <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#F8FAFC]">
       <QuickActions />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-900">Application Trends</h3>
              <div className="flex items-center space-x-2 bg-slate-50 p-1 rounded-lg">
                <button className="px-3 py-1 text-xs font-semibold rounded-md bg-white shadow-sm text-primary">Last 30 Days</button>
                <button className="px-3 py-1 text-xs font-semibold rounded-md text-slate-500 hover:text-slate-700">6 Months</button>
              </div>
            </div>
            <ApplicationTrendsChart />
          </div>
          <RecentActivity />
        </div>

      
      </main>
    </AdminLayout>
  );
}