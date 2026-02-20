import type { ApiResponse } from "./api";
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface ServiceSummary {
  id: string;
  title: string;
  slug: string;
  overview: string; // Using overview instead of shortDescription
  category_name: string; // Flattened from backend
  sub_category_name: string; // Flattened from backend
  target_audience: string;
  estimated_duration: string;
  is_online_available: boolean;
  requires_appointment: boolean; // Changed from requiresAppointment
  step_count: number; // Changed from totalSteps
  average_rating: number;
  view_count: number;
  status: string;
  created_at: string; // Added
}

export interface EligibilityRequirement {
  id: string;
  order: number;
  description: string;
  isMandatory: boolean;
}

export interface StepAction {
  id: string;
  actionNumber: number;
  description: string;
  isRequired: boolean;
}

export interface DocumentRequirement {
  id: string;
  name: string;
  description: string;
  documentType: string;
  requirementType: string;
  quantity: number;
  sampleUrl: string | null;
  templateUrl: string | null;
  notes: string | null;
}

export interface LegalReference {
  id: string;
  documentType: string;
  documentNumber: string;
  title: string;
  articleNumber: string | null;
  relevanceDescription: string;
}

export interface Step {
  id: string;
  stepNumber: number;
  title: string;
  instruction: string;
  detailedInstructions: string;
  actions: StepAction[];
  documentRequirements: DocumentRequirement[];
  legalReferences: LegalReference[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface ServiceDetail {
  id: string;
  title: string;
  overview: string;
  category: Category;
  subCategory: SubCategory;
  eligibilityRequirements: EligibilityRequirement[];
  steps: Step[];
  faqs: FAQ[];
}

// Existing ServiceSummary and ServiceDetail types (keep as-is)
// Add these new types for the split endpoints:

export interface ServiceBase {
  id: string;
  title: string;
  slug: string;
  overview: string;
  category: Category;
  subCategory: SubCategory;
  targetAudience: string;
  estimatedDuration: string;
  isOnlineAvailable: boolean;
  requiresAppointment: boolean;
  totalSteps: number;
  averageRating: number;
  viewCount: number;
  eligibilityRequirements: EligibilityRequirement[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceStepsResponse extends ApiResponse<Step[]> {}
export interface ServiceDocumentsResponse extends ApiResponse<DocumentRequirement[]> {}
export interface ServiceFaqsResponse extends ApiResponse<FAQ[]> {}
export interface ServiceBaseResponse extends ApiResponse<ServiceBase> {}
export interface ServiceListResponse extends ApiResponse<ServiceSummary[]> {}

// Keep your existing types below...
