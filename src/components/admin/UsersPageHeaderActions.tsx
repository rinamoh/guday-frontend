interface UsersPageHeaderActionsProps {
  onAddUser: () => void;
  isAdding?: boolean;
}

export function UsersPageHeaderActions({ onAddUser, isAdding = false }: UsersPageHeaderActionsProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <span className="material-symbols-outlined text-slate-400">notifications</span>
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
      </div>
      <div className="h-8 w-[1px] bg-slate-200"></div>
      <button
        type="button"
        onClick={onAddUser}
        disabled={isAdding}
        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-sm mr-2">add</span>
        {isAdding ? 'Creating...' : 'Add New Agent'}
      </button>
    </div>
  );
}
