interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  status: 'Published' | 'Draft';
  icon: string;
  lastUpdated: string;
  onEdit: (id: string) => void;
  onArchive: (id: string) => void;
  onDeleteService: (id: string) => void;
}

export function ServiceCard({ id, title, description, status, icon, lastUpdated, onEdit, onArchive , onDeleteService }: ServiceCardProps) {
  return (
    <div className="service-card group relative bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <span className="material-symbols-outlined text-primary">{icon}</span>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          status === 'Published' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-slate-100 text-slate-600'
        }`}>
          {status}
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-4 line-clamp-2">{description}</p>
      <div className="flex items-center text-xs text-slate-400">
        <span className="material-symbols-outlined text-xs mr-1">history</span>
        Updated {lastUpdated}
      </div>
      <div className="hover-actions absolute inset-0 bg-white/95 rounded-xl flex items-center justify-center space-x-3 px-6">
        <button 
          className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center"
          onClick={() => onEdit(id)}
        >
          <span className="material-symbols-outlined text-sm mr-2">edit</span>
          Edit Content
        </button>
        <button 
          className="p-2.5 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 hover:text-red-600 transition-colors" 
          title="Archive"
          onClick={() => onArchive(id)}
        >
          <span className="material-symbols-outlined">archive</span>
        </button>
        <button 
          className="p-2.5 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 hover:text-red-600 transition-colors" 
          title="Delete"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteService(id);
          }}
        >
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
    </div>
  );
}