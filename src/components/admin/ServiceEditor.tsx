import { type EligibilityRequirement } from '../../types/service';

interface Step {
  id: string;
  stepNumber: number;
  title: string;
  instruction: string;
}

interface EditableServiceData {
  title: string;
  overview: string;
  eligibilityRequirements: EligibilityRequirement[];
  steps: Step[];
}

interface ServiceEditorProps {
  service: EditableServiceData;
  onChange: (data: EditableServiceData) => void;
}

export function ServiceEditor({ service, onChange }: ServiceEditorProps) {
  const update = (patch: Partial<EditableServiceData>) => {
    onChange({
      ...service,
      ...patch,
    });
  };

  const addEligibilityRequirement = () => {
    update({
      eligibilityRequirements: [
        ...service.eligibilityRequirements,
        {
          id: `tmp-req-${Date.now()}`,
          order: service.eligibilityRequirements.length + 1,
          description: '',
          isMandatory: true,
        },
      ],
    });
  };

  const updateEligibilityRequirement = (index: number, value: string) => {
    const next = [...service.eligibilityRequirements];
    next[index] = { ...next[index], description: value };
    update({ eligibilityRequirements: next });
  };

  const removeEligibilityRequirement = (index: number) => {
    const next = service.eligibilityRequirements
      .filter((_, i) => i !== index)
      .map((req, i) => ({ ...req, order: i + 1 }));
    update({ eligibilityRequirements: next });
  };

  const addStep = () => {
    update({
      steps: [
        ...service.steps,
        {
          id: `tmp-step-${Date.now()}`,
          stepNumber: service.steps.length + 1,
          title: '',
          instruction: '',
        },
      ],
    });
  };

  const updateStep = (index: number, field: keyof Step, value: string) => {
    const next = [...service.steps];
    next[index] = { ...next[index], [field]: value };
    update({ steps: next });
  };

  const removeStep = (index: number) => {
    const next = service.steps
      .filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, stepNumber: i + 1 }));
    update({ steps: next });
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= service.steps.length) return;

    const next = [...service.steps];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    update({
      steps: next.map((step, i) => ({ ...step, stepNumber: i + 1 })),
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 border-r border-slate-100">
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Page Editor</h2>

        <div className="space-y-8">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Service Title</label>
            <input
              className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary text-slate-700 text-sm"
              placeholder="Service title..."
              value={service.title}
              onChange={(e) => update({ title: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Introductory Text</label>
            <textarea
              className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary text-slate-600 text-sm"
              placeholder="Explain the service to users..."
              rows={4}
              value={service.overview}
              onChange={(e) => update({ overview: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-slate-700">
                Eligibility Requirements
              </label>
              <button
                type="button"
                onClick={addEligibilityRequirement}
                className="flex items-center text-xs font-bold text-primary hover:underline"
              >
                <span className="material-symbols-outlined text-sm mr-1">add_circle</span>
                Add Requirement
              </button>
            </div>

            <div className="space-y-3">
              {service.eligibilityRequirements.map((req, index) => (
                <div key={req.id || index} className="flex items-center space-x-2">
                  <input
                    className="flex-1 rounded-lg border-slate-200 text-sm focus:border-primary focus:ring-primary"
                    type="text"
                    value={req.description}
                    onChange={(e) => updateEligibilityRequirement(index, e.target.value)}
                    placeholder="Enter eligibility requirement..."
                  />
                  <button
                    type="button"
                    onClick={() => removeEligibilityRequirement(index)}
                    className="p-2 text-slate-400 hover:text-red-500"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-slate-700">Steps to Access</label>
              <button
                type="button"
                onClick={addStep}
                className="flex items-center text-xs font-bold text-primary hover:underline"
              >
                <span className="material-symbols-outlined text-sm mr-1">add_circle</span>
                Add Step
              </button>
            </div>

            <div className="space-y-6">
              {service.steps.map((step, index) => (
                <div key={step.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                      Step {index + 1}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => moveStep(index, 'up')}
                        disabled={index === 0}
                        className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-sm">arrow_upward</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveStep(index, 'down')}
                        disabled={index === service.steps.length - 1}
                        className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-sm">arrow_downward</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>

                  <input
                    className="w-full rounded-lg border-slate-200 text-sm font-bold focus:border-primary focus:ring-primary"
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStep(index, 'title', e.target.value)}
                    placeholder="Step title..."
                  />

                  <textarea
                    className="w-full rounded-lg border-slate-200 text-sm text-slate-600 focus:border-primary focus:ring-primary"
                    rows={2}
                    value={step.instruction}
                    onChange={(e) => updateStep(index, 'instruction', e.target.value)}
                    placeholder="Step instructions..."
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
