import { AdminLayout } from '../layouts/AdminLayout';

export function AdminSettingsPage() {
  return (
    <AdminLayout title="Settings">
      <div className="p-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Settings</h2>
          <p className="text-slate-600">Settings interface will be implemented here.</p>
        </div>
      </div>
    </AdminLayout>
  );
}