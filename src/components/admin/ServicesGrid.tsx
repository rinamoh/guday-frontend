import { ServiceCard } from './ServiceCard';
import { AddServiceCard } from './AddServiceCard';

interface Service {
  id: string;
  title: string;
  description: string;
  status: 'Published' | 'Draft';
  icon: string;
  lastUpdated: string;

  // Needed for linking category translations from the service card.
  categoryId: string;
  subCategoryId?: string;
}

interface ServicesGridProps {
  services: Service[];
  onEditService: (id: string) => void;
  onArchiveService: (id: string) => void;
  onDeleteService: (id: string) => void;
  onAddService: () => void;

  onLinkCategoryTranslation: (serviceId: string) => void;
  canLinkCategoryTranslation: boolean;
}

export function ServicesGrid({
  services,
  onEditService,
  onArchiveService,
  onDeleteService,
  onAddService,
  onLinkCategoryTranslation,
  canLinkCategoryTranslation,
}: ServicesGridProps) {
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
          categoryId={service.categoryId}
          subCategoryId={service.subCategoryId}
          onEdit={onEditService}
          onArchive={onArchiveService}
          onDeleteService={onDeleteService}
          onLinkCategoryTranslation={onLinkCategoryTranslation}
          canLinkCategoryTranslation={canLinkCategoryTranslation}
        />
      ))}
      <AddServiceCard onClick={onAddService} />
    </div>
  );
}
