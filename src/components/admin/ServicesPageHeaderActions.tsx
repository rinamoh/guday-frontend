interface ServicesPageHeaderActionsProps {
  onCreateService: () => void;
}

export function ServicesPageHeaderActions({ onCreateService }: ServicesPageHeaderActionsProps) {
  return (
    
     <div className="flex items-center space-x-4">
      <div className="relative">
        {/* <span className="material-symbols-outlined text-slate-400">notifications</span>
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span> */}
      </div>
      <div className="h-8 w-[1px] bg-slate-200"></div>
    <button 
      className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center hover:bg-blue-800 transition-colors shadow-sm "
      onClick={onCreateService}
    >
      <span className="material-symbols-outlined text-lg mr-2">add</span>
      Create New Service
    </button>
    </div>
  );
}