interface QuickAction {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
}

const actions: QuickAction[] = [
  {
    id: 'add-service',
    icon: 'add_box',
    title: 'Add New Service',
    subtitle: 'Publish a new license type'
  },
  {
    id: 'generate-report',
    icon: 'summarize',
    title: 'Generate Monthly Report',
    subtitle: 'Export performance analytics'
  },
  {
    id: 'review-licenses',
    icon: 'how_to_reg',
    title: 'Review Pending Licenses',
    subtitle: 'Process the approval queue'
  }
];

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            className="flex items-center p-4 border border-slate-100 rounded-xl hover:border-primary/30 hover:bg-blue-50/50 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
              <span className="material-symbols-outlined">{action.icon}</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-900">{action.title}</p>
              <p className="text-xs text-slate-500">{action.subtitle}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}