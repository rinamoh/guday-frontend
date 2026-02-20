export function ApplicationTrendsChart() {
  return (
    <div className="relative h-[320px] chart-placeholder rounded-lg border border-slate-100 p-4">
      <svg className="w-full h-full text-primary opacity-90" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgb(15,71,175)', stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: 'rgb(15,71,175)', stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <path d="M0 80 Q 10 75, 20 60 T 40 65 T 60 40 T 80 45 T 100 20 L 100 100 L 0 100 Z" fill="url(#grad1)" />
        <path d="M0 80 Q 10 75, 20 60 T 40 65 T 60 40 T 80 45 T 100 20" fill="none" stroke="currentColor" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="absolute bottom-4 left-0 w-full flex justify-between px-4 text-[10px] text-slate-400 font-medium">
        <span>1 Oct</span>
        <span>8 Oct</span>
        <span>15 Oct</span>
        <span>22 Oct</span>
        <span>29 Oct</span>
      </div>
    </div>
  );
}