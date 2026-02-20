import { ServiceCard } from './ServiceCard';
import { AddServiceCard } from './AddServiceCard';

interface Service {
  id: string;
  title: string;
  description: string;
  status: 'Published' | 'Draft';
  icon: string;
  lastUpdated: string;
}

interface ServicesGridProps {
  services: Service[];
  onEditService: (id: string) => void;
  onArchiveService: (id: string) => void;
  onDeleteService: (id: string) => void;
  onAddService: () => void;
}

export function ServicesGrid({ services, onEditService, onArchiveService, onAddService }: ServicesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          id={service.id}
          title={service.title}
          description={service.description}
          status={service.status}
          icon={service.icon}
          lastUpdated={service.lastUpdated}
          onEdit={onEditService}
          onArchive={onArchiveService}
        />
      ))}
      <AddServiceCard onClick={onAddService} />
    </div>
  );
}