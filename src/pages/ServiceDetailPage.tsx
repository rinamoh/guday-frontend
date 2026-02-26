import { useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  useService,
  useServiceDocuments,
  useServiceFaqs,
} from "../features/services/queries";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Get service data (includes steps)
  const {
    data: serviceResponse,
    isLoading: serviceLoading,
    error: serviceError,
  } = useService(slug!);

  // Get documents and FAQs from separate endpoints
  const {
    data: documentsResponse,
    isLoading: documentsLoading,
    error: documentsError,
  } = useServiceDocuments(slug!);

  const {
    data: faqsResponse,
    isLoading: faqsLoading,
    error: faqsError,
  } = useServiceFaqs(slug!);

  const service = serviceResponse?.data;
  // Steps come directly from the service response
  const steps = service?.steps ?? [];
  const documents = documentsResponse?.data ?? [];
  const faqs = faqsResponse?.data ?? [];

  const isLoading = serviceLoading || documentsLoading || faqsLoading;
  const error = serviceError || documentsError || faqsError;

  // Derived info for breadcrumbs (use backend data)
  const categoryName = service?.category_name ?? "Category";
  const subCategoryName = service?.sub_category_name ?? "";

  // Related services only if backend actually provides it
  const relatedServices = useMemo(() => {
    const rel = (service as any)?.relatedServices;
    return Array.isArray(rel) ? rel : [];
  }, [service]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-600">Loading service details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Service Not Found</h2>
            <p className="text-slate-600 mb-6">The service you're looking for doesn't exist.</p>
            <Link to="/" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-800 transition-colors">
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-600 hover:text-primary transition-colors"
          >
            <span className="material-icons text-sm mr-2">arrow_back</span>
            Back
          </button>
        </div>
        
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex mb-8 text-sm font-medium text-slate-500 dark:text-slate-400"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
            </li>

            <li>
              <div className="flex items-center">
                <span className="material-icons text-sm mx-1">
                  chevron_right
                </span>
                <span className="text-slate-600 dark:text-slate-300">
                  {categoryName}
                </span>
              </div>
            </li>

            <li aria-current="page">
              <div className="flex items-center">
                <span className="material-icons text-sm mx-1">
                  chevron_right
                </span>
                <span className="text-slate-800 dark:text-slate-200">
                  {service.title}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* MAIN CONTENT */}
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-primary mb-6">
              {service.title}
            </h1>

            {subCategoryName ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                {categoryName} • {subCategoryName}
              </p>
            ) : null}

            {service.overview ? (
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                {service.overview}
              </p>
            ) : null}

            {/* Eligibility Requirements */}
            {service?.eligibility_requirements?.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="material-icons mr-2 text-primary">
                    verified
                  </span>
                  Eligibility Requirements
                </h2>

                <ul className="space-y-4">
                  {service.eligibility_requirements.map((req: any) => (
                    <li key={req.id} className="flex items-start">
                      <span className="material-icons text-primary mr-3 text-lg">
                        check_circle
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {req.requirement_description}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Required Documents */}
            {service?.required_documents?.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="material-icons mr-2 text-primary">
                    description
                  </span>
                  Required Documents
                </h2>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 ring-1 ring-slate-200 dark:ring-slate-700">
                  <ul className="space-y-4">
                    {service.required_documents.map((doc: any) => (
                      <li key={doc.id} className="flex items-start gap-3">
                        <span className="material-icons text-primary text-lg">
                          description
                        </span>
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            {doc.document_name}
                          </div>
                          {doc.description ? (
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {doc.description}
                            </p>
                          ) : null}
                          {doc.requirement_type && (
                            <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${
                              doc.requirement_type === 'mandatory' 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {doc.requirement_type}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Steps to Access the Service */}
            {steps.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-8 flex items-center">
                  <span className="material-icons mr-2 text-primary">
                    list_alt
                  </span>
                  Steps to Access the Service
                </h2>

                <div className="space-y-6">
                  {steps.map((step: any, idx: number) => {
                    const isFirst = idx === 0;

                    return (
                      <div
                        key={step.step_number || idx}
                        className={`relative pl-10 ${
                          idx < steps.length - 1 ? "step-line" : ""
                        }`}
                      >
                        {/* Step number circle */}
                        <div
                          className={[
                            "absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center font-bold z-10",
                            isFirst
                              ? "bg-primary text-white shadow-lg"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300",
                          ].join(" ")}
                        >
                          {step.step_number ?? idx + 1}
                        </div>

                        {/* Step card */}
                        <div
                          className={[
                            "bg-white dark:bg-slate-800 p-6 rounded shadow-sm ring-1 ring-slate-200 dark:ring-slate-700",
                            isFirst ? "border-l-4 border-primary" : "",
                          ].join(" ")}
                        >
                          {step.title && step.title !== null && (
                            <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-200">
                              {step.title}
                            </h3>
                          )}

                          {step.instruction ? (
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                              {step.instruction}
                            </p>
                          ) : null}

                          {/* Legal References */}
                          {/* Legal References */}
                          {step.legal_references && step.legal_references.length > 0 && (
                            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                Legal References:
                              </h4>
                              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                {step.legal_references.map((ref: any, refIdx: number) => (
                                  <li key={refIdx}>• {typeof ref === 'object' ? ref.reference_text : ref}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            

            {/* Important Notes */}
            {service?.notes?.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="material-icons mr-2 text-primary">
                    info
                  </span>
                  Important Information
                </h2>

                <div className="space-y-3">
                  {service.notes.map((note: any) => (
                    <div key={note.id} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-blue-800 dark:text-blue-200">{note.content}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="material-icons mr-2 text-primary">
                    help
                  </span>
                  Frequently Asked Questions
                </h2>

                <div className="space-y-3">
                  {faqs.map((faq: any) => (
                    <details
                      key={faq.id}
                      className="bg-white dark:bg-slate-800 rounded-lg p-5 ring-1 ring-slate-200 dark:ring-slate-700"
                    >
                      <summary className="cursor-pointer font-semibold text-slate-800 dark:text-slate-200">
                        {faq.question}
                      </summary>
                      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="lg:w-80 space-y-6">
              {/* Need Help (static design card) */}
            <div className="bg-primary p-6 rounded-xl text-white shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <span className="material-icons" style={{ fontSize: 120 }}>
                  support_agent
                </span>
              </div>
              <h4 className="text-xl font-bold mb-2">Need Help?</h4>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                Our support team can assist you with understanding this service.
              </p>
              <button className="w-full bg-white text-primary py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors flex items-center justify-center">
                <span className="material-icons mr-2 text-xl">
                  contact_support
                </span>
                Contact Support
              </button>
            </div>


            {/* Service Information Card */}
            {/* <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="text-lg font-bold mb-4">Service Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Duration:</span>
                  <span className="font-medium">{service?.estimated_duration || 'Varies'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Processing Time:</span>
                  <span className="font-medium">{service?.processing_time || 'Varies'}</span>
                </div>
                {service?.fees && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fees:</span>
                    <span className="font-medium">{service.fees}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Online Available:</span>
                  <span className={`font-medium ${service?.is_online_available ? 'text-green-600' : 'text-red-600'}`}>
                    {service?.is_online_available ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Last Updated:</span>
                  <span className="font-medium">
                    {service?.updated_at ? new Date(service.updated_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div> */}

            {/* Locations */}
            {/* {service?.locations?.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h4 className="text-lg font-bold mb-4">Where to Apply</h4>
                <div className="space-y-3">
                  {service.locations.map((location: any) => (
                    <div key={location.id} className="text-sm">
                      <p className="font-medium text-slate-900 dark:text-slate-100">{location.location_name}</p>
                      {location.address && (
                        <p className="text-slate-600 dark:text-slate-400 mt-1">{location.address}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )} */}

            {/* Related Services (only if it exists) */}
            {relatedServices.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h4 className="text-lg font-bold mb-4">Related Services</h4>
                <ul className="space-y-4">
                  {relatedServices.map((rs: any) => (
                    <li key={rs.id ?? rs.slug ?? rs.title}>
                      <Link
                        to={rs.slug ? `/services/${rs.slug}` : "#"}
                        className="flex items-center group"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary mr-3" />
                        <span className="text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">
                          {rs.title ?? "Related service"}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          

            {/* Quick Resources (derived from documents you already display) */}
            {documents.length > 0 && (
              <div className="p-6">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Quick Resources
                </h4>
                <div className="space-y-3">
                  {documents.slice(0, 3).map((doc: any) => (
                    <div
                      key={doc.id}
                      className="flex items-center text-slate-600 dark:text-slate-400"
                    >
                      <span className="material-icons text-lg mr-2">
                        description
                      </span>
                      <span className="text-sm">{doc.document_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
      <Footer/>
    </div>
  );
}