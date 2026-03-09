import type { ServiceSummary } from "../types/service";
import { Link, useSearchParams } from "react-router-dom";
import { normalizePublicLanguage } from "../utils/publicLanguage";

interface Props {
  service: ServiceSummary;
}

export function ServiceCard({ service }: Props) {
  const [searchParams] = useSearchParams();
  const language = normalizePublicLanguage(searchParams.get("language"));

  return (
    <Link
      to={`/services/${service.slug}?language=${encodeURIComponent(language)}`}
      className="block border rounded-md p-4 hover:shadow-md transition bg-slate-50"
    >
      <h3 className="text-lg font-semibold mb-2">{service.title}</h3>

      <p className="text-sm text-gray-600 mb-3">{service.overview}</p>

      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span>{service.category_name}</span>
        <span>• {service.step_count} steps</span>
        <span>• {service.estimated_duration}</span>
      </div>
    </Link>
  );
}
