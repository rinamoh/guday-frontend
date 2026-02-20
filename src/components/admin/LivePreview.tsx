interface LivePreviewProps {
  service: {
    title: string;
    overview: string;
    eligibilityRequirements: Array<{ description: string }>;
    steps: Array<{ title: string; instruction: string }>;
  };
}

export function LivePreview({ service }: LivePreviewProps) {
  return (
    <div className="w-full h-full bg-slate-100 flex-shrink-0 flex flex-col">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white/50">
        <span className="text-xs font-bold uppercase text-slate-500 flex items-center tracking-widest">
          <span className="material-symbols-outlined text-sm mr-2">visibility</span>
          Instant Preview
        </span>
      </div>

      <div className="preview-pane p-6">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden scale-[0.9] origin-top">
          <div className="p-4 border-b border-slate-100 flex items-center">
            <span className="text-primary text-xl font-bold">Guday</span>
          </div>

          <div className="p-8">
            <h1 className="text-2xl font-bold text-primary mb-4">{service.title || 'Service Title'}</h1>
            <p className="text-[12px] text-slate-600 mb-6 leading-relaxed">
              {service.overview || 'Service description will appear here...'}
            </p>

            {service.eligibilityRequirements?.length > 0 && (
              <>
                <h3 className="text-sm font-bold mb-4">Eligibility Requirements</h3>
                <ul className="space-y-2 mb-8">
                  {service.eligibilityRequirements.map((req, index) => (
                    <li key={index} className="flex items-start text-[11px] text-slate-600">
                      <span className="material-symbols-outlined text-primary text-xs mr-2">check_circle</span>
                      {req.description}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {service.steps?.length > 0 && (
              <>
                <h3 className="text-sm font-bold mb-4">Steps to Access</h3>
                <div className="space-y-4">
                  {service.steps.map((step, index) => (
                    <div key={index} className={`border-l-2 pl-4 py-1 ${index === 0 ? 'border-primary' : 'border-slate-200'}`}>
                      <h4 className={`text-xs font-bold ${index === 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                        {index + 1}. {step.title || 'Step title'}
                      </h4>
                      {step.instruction && <p className="text-[10px] text-slate-500 mt-1">{step.instruction}</p>}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
