interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'All' | 'Active' | 'Inactive';
  onStatusChange: (value: 'All' | 'Active' | 'Inactive') => void;
  onExport?: () => void;
}

export function SearchAndFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onExport,
}: SearchAndFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          search
        </span>
        <input
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-primary focus:border-primary"
          placeholder="Search agents by name, email or ID..."
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-3">
        <select
          className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as 'All' | 'Active' | 'Inactive')}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button
          type="button"
          onClick={onExport}
          className="flex items-center px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <span className="material-symbols-outlined text-sm mr-2">download</span>
          Export
        </button>
      </div>
    </div>
  );
}
