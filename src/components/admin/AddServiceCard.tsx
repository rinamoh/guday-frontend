interface AddServiceCardProps {
  onClick: () => void;
}

export function AddServiceCard({ onClick }: AddServiceCardProps) {
  return (
    <button 
      className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all bg-slate-50/50 group"
      onClick={onClick}
    >
      <span className="material-symbols-outlined text-4xl mb-2 group-hover:scale-110 transition-transform">add_circle</span>
      <span className="text-sm font-semibold">Add New Service</span>
    </button>
  );
}