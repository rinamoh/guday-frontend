interface ServicesSearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

export function ServicesSearchAndFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange
}: ServicesSearchAndFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      <div className="relative w-full md:w-96">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
        <input 
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-primary focus:border-primary" 
          placeholder="Search services..." 
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-3 w-full md:w-auto">
        <select 
          className="text-sm border-slate-200 rounded-lg focus:ring-primary focus:border-primary min-w-[140px]"
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option>All Categories</option>
          <option>Business</option>
          <option>Immigration</option>
          <option>Legal</option>
          <option>Finance</option>
        </select>
        <select 
          className="text-sm border-slate-200 rounded-lg focus:ring-primary focus:border-primary min-w-[140px]"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option>All Status</option>
          <option>Published</option>
          <option>Draft</option>
        </select>
      </div>
    </div>
  );
}