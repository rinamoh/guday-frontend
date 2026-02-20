export function DashboardHeaderActions() {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <span className="material-symbols-outlined text-slate-400">notifications</span>
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
      </div>
      <div className="h-8 w-[1px] bg-slate-200"></div>
      <div className="flex items-center text-sm text-slate-600 font-medium">
        Last updated: Just now
        <span className="material-symbols-outlined text-sm ml-2 text-slate-400">refresh</span>
      </div>
    </div>
  );
}