import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '../../layouts/AdminLayout';
import { ServiceEditor } from '../../components/admin/ServiceEditor';
import { LivePreview } from '../../components/admin/LivePreview';
import { useCreateAdminService, useUpdateAdminService } from '../../features/admin/services/mutations';
import { getAdminService, getAdminServiceSteps } from '../../api/adminServices';
import { type EligibilityRequirement } from '../../types/service';

interface EditableStep {
  id: string;
  stepNumber: number;
  title: string;
  instruction: string;
}

interface EditableServiceData {
  title: string;
  overview: string;
  eligibilityRequirements: EligibilityRequirement[];
  steps: EditableStep[];
}

const EMPTY_DATA: EditableServiceData = {
  title: '',
  overview: '',
  eligibilityRequirements: [],
  steps: [],
};

function normalizeEligibility(input: any[]): EligibilityRequirement[] {
  return (Array.isArray(input) ? input : []).map((req: any, index: number) => {
    if (typeof req === 'string') {
      return {
        id: `tmp-req-${index}`,
        order: index + 1,
        description: req,
        isMandatory: true,
      };
    }

    return {
      id: req?.id || `tmp-req-${index}`,
      order: req?.order ?? index + 1,
      description: req?.description || '',
      isMandatory: req?.isMandatory ?? req?.is_mandatory ?? true,
    };
  });
}

function normalizeSteps(input: any[]): EditableStep[] {
  return (Array.isArray(input) ? input : []).map((step: any, index: number) => ({
    id: step?.id || `tmp-step-${index}`,
    stepNumber: step?.stepNumber ?? step?.step_number ?? index + 1,
    title: step?.title || '',
    instruction: step?.instruction || '',
  }));
}

function mapServiceToEditable(svc: any, stepInput?: any[]): EditableServiceData {
  const rawEligibility = svc?.eligibility_requirements || svc?.eligibilityRequirements || [];
  const rawSteps = stepInput ?? svc?.steps ?? [];

  return {
    title: svc?.title || '',
    overview: svc?.overview || '',
    eligibilityRequirements: normalizeEligibility(rawEligibility),
    steps: normalizeSteps(rawSteps),
  };
}

export function ServiceEditPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isNewService = !slug || slug === 'new';
  

  const locationState = location.state as { service?: any } | null;
  const preloadedService = locationState?.service;

  const [editedData, setEditedData] = useState<EditableServiceData>(
    preloadedService ? mapServiceToEditable(preloadedService) : EMPTY_DATA
  );

  const hasHydratedFromServer = useRef(false);

  const createServiceMutation = useCreateAdminService();
  const updateServiceMutation = useUpdateAdminService();

const adminToken = localStorage.getItem('admin_token');
const fallbackSlug = preloadedService?.slug;

const serviceDetailQuery = useQuery({
  queryKey: ['admin-service', slug, fallbackSlug],
  queryFn: () => getAdminService(adminToken, slug!, fallbackSlug),
  enabled: !!slug && !isNewService,
  staleTime: 60_000,
  refetchOnWindowFocus: false,
  retry: false,
});

const resolvedSlug = (serviceDetailQuery.data as any)?.slug || fallbackSlug;

const serviceStepsQuery = useQuery({
  queryKey: ['admin-service-steps', slug, resolvedSlug],
  queryFn: () => getAdminServiceSteps(adminToken, slug!, resolvedSlug),
  enabled: !!slug && !isNewService,
  staleTime: 60_000,
  refetchOnWindowFocus: false,
  retry: false,
});




  useEffect(() => {
    hasHydratedFromServer.current = false;

    if (isNewService) {
      setEditedData(EMPTY_DATA);
      return;
    }

    if (preloadedService) {
      setEditedData(mapServiceToEditable(preloadedService));
    } else {
      setEditedData(EMPTY_DATA);
    }
  }, [slug, isNewService, preloadedService]);

  useEffect(() => {
    if (isNewService || !serviceDetailQuery.data || hasHydratedFromServer.current) return;

    const detail = serviceDetailQuery.data as any;
    setEditedData((prev) => {
      const mapped = mapServiceToEditable(detail);
      return {
        title: mapped.title || prev.title,
        overview: mapped.overview || prev.overview,
        eligibilityRequirements: mapped.eligibilityRequirements.length ? mapped.eligibilityRequirements : prev.eligibilityRequirements,
        steps: prev.steps.length ? prev.steps : mapped.steps,
      };
    });

    hasHydratedFromServer.current = true;
  }, [isNewService, serviceDetailQuery.data]);

  useEffect(() => {
    if (isNewService || !serviceStepsQuery.data) return;

    const mappedSteps = normalizeSteps(serviceStepsQuery.data as any[]);
    if (!mappedSteps.length) return;

    setEditedData((prev) => (prev.steps.length ? prev : { ...prev, steps: mappedSteps }));
  }, [isNewService, serviceStepsQuery.data]);

  const breadcrumbs = [
    { label: 'Content Management', href: '/admin/services' },
    { label: isNewService ? 'Create Service' : editedData.title || 'Edit Service' },
  ];

  const handleSave = async (data: EditableServiceData) => {
    try {
      if (isNewService) {
        await createServiceMutation.mutateAsync({
          procedure_id: `proc_${Date.now()}`,
          slug: data.title.toLowerCase().replace(/\s+/g, '-'),
          title: data.title,
          overview: data.overview,
          category_id: '',
          target_audience: 'individuals',
          estimated_duration: 'Varies',
          processing_time: 'Varies',
          is_online_available: false,
          requires_appointment: false,
          status: 'draft',
          language: 'en',
        });
        alert('Service created successfully');
        navigate('/admin/services');
      } else if (slug) {
        await updateServiceMutation.mutateAsync({
          serviceId: slug,
          serviceData: {
            title: data.title,
            overview: data.overview,
          },
        });
        alert('Service updated successfully');
      }
    } catch (error: any) {
      alert(`Failed to save: ${error.message}`);
    }
  };

  const handlePublish = async (data: EditableServiceData) => {
    try {
      if (!isNewService && slug) {
        await updateServiceMutation.mutateAsync({
          serviceId: slug,
          serviceData: {
            status: 'published',
            title: data.title,
            overview: data.overview,
          },
        });
        alert('Service published successfully');
        navigate('/admin/services');
      }
    } catch (error: any) {
      alert(`Failed to publish: ${error.message}`);
    }
  };

  const actionButtons = (
    <>
      <button
        className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
        onClick={() => navigate('/admin/services')}
      >
        Discard
      </button>
      <button
        className="px-4 py-2 border border-primary text-primary hover:bg-blue-50 rounded-lg text-sm font-medium"
        onClick={() => handleSave(editedData)}
        disabled={createServiceMutation.isPending || updateServiceMutation.isPending}
      >
        {createServiceMutation.isPending || updateServiceMutation.isPending ? 'Saving...' : 'Save Draft'}
      </button>
      <button
        className="px-6 py-2 bg-primary text-white hover:bg-blue-800 rounded-lg text-sm font-medium"
        onClick={() => handlePublish(editedData)}
        disabled={createServiceMutation.isPending || updateServiceMutation.isPending}
      >
        {createServiceMutation.isPending || updateServiceMutation.isPending ? 'Publishing...' : 'Publish Changes'}
      </button>
    </>
  );

  const loading = !isNewService && serviceDetailQuery.isLoading && !preloadedService;
 const criticalError = serviceDetailQuery.error && !preloadedService;
 const stepsError = serviceStepsQuery.error;


return (
  <AdminLayout title="Service Editor" breadcrumbs={breadcrumbs} actions={actionButtons}>
    {loading ? (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-slate-600">Loading service...</p>
      </div>
    ) : criticalError ? (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-red-600">Failed to load service details.</p>
      </div>
    ) : (
      <>
        {stepsError && (
          <div className="mx-8 mt-6 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Steps could not be loaded from server. You can still edit title, intro, and other fields.
          </div>
        )}

        <div className="flex h-full w-full min-w-0">
          <div className="flex-1 min-w-0">
            <ServiceEditor service={editedData} onChange={setEditedData} />
          </div>
          <div className="hidden xl:flex xl:w-[420px] 2xl:w-[460px] border-l border-slate-200 bg-slate-100">
            <LivePreview service={editedData} />
          </div>
        </div>
      </>
    )}
  </AdminLayout>
);

}
