interface ActivityItem {
  id: string;
  type: 'person_add' | 'verified' | 'edit_note' | 'login';
  title: string;
  subtitle: string;
  time: string;
  iconColor: string;
}

const activities: ActivityItem[] = [
  {
    id: '1',
    type: 'person_add',
    title: 'New application submitted',
    subtitle: 'Abebe B. - Business License',
    time: '2 mins ago',
    iconColor: 'bg-blue-50 text-primary'
  },
  {
    id: '2',
    type: 'verified',
    title: 'License Approved',
    subtitle: 'Mulu G. - Trade Certification',
    time: '15 mins ago',
    iconColor: 'bg-emerald-50 text-emerald-600'
  },
  {
    id: '3',
    type: 'edit_note',
    title: 'Content Updated',
    subtitle: 'Admin JD modified Requirements',
    time: '1 hour ago',
    iconColor: 'bg-amber-50 text-amber-600'
  },
  {
    id: '4',
    type: 'login',
    title: 'Admin Login',
    subtitle: 'Super Admin from 192.168.1.1',
    time: '3 hours ago',
    iconColor: 'bg-slate-100 text-slate-600'
  }
];

export function RecentActivity() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
      <div className="flex-1 space-y-6 overflow-y-auto pr-2">
        {activities.map((activity) => (
          <div key={activity.id} className="flex space-x-4">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${activity.iconColor}`}>
              <span className="material-symbols-outlined text-sm">{activity.type}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{activity.title}</p>
              <p className="text-xs text-slate-500">{activity.subtitle}</p>
              <span className="text-[10px] text-slate-400 font-medium">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-6 w-full py-2 text-sm font-medium text-primary hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors">
        View All Activity
      </button>
    </div>
  );
}