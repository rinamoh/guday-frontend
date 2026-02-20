import type { Step } from "../types/service";

interface Props {
  step: Step;
}

export function ServiceStep({ step }: Props) {
  return (
    <div className="border rounded-lg p-5">
      <h3 className="text-xl font-semibold mb-2">
        Step {step.stepNumber}: {step.title}
      </h3>

      <p className="mb-3">{step.instruction}</p>

      <pre className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">
        {step.detailedInstructions}
      </pre>

      {step.actions.length > 0 && (
        <ul className="mt-4 list-decimal ml-5">
          {step.actions.map(action => (
            <li key={action.id}>{action.description}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
