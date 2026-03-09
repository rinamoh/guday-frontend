import type { PublicLanguage } from "../utils/publicLanguage";

export const serviceDetailCopy: Record<
  PublicLanguage,
  {
    loading: string;

    not_found_title: string;
    not_found_body: string;
    back_home: string;

    back: string;
    home: string;
    category_fallback: string;

    eligibility: string;
    required_documents: string;
    steps: string;
    legal_references: string;
    important_information: string;
    faqs: string;

    need_help: string;
    support_blurb: string;
    contact_support: string;

    related_services: string;
    related_service_fallback: string;

    quick_resources: string;
  }
> = {
  en: {
    loading: "Loading service details...",

    not_found_title: "Service Not Found",
    not_found_body: "The service you're looking for doesn't exist.",
    back_home: "Back to Home",

    back: "Back",
    home: "Home",
    category_fallback: "Category",

    eligibility: "Eligibility Requirements",
    required_documents: "Required Documents",
    steps: "Steps to Access the Service",
    legal_references: "Legal References:",
    important_information: "Important Information",
    faqs: "Frequently Asked Questions",

    need_help: "Need Help?",
    support_blurb: "Our support team can assist you with understanding this service.",
    contact_support: "Contact Support",

    related_services: "Related Services",
    related_service_fallback: "Related service",

    quick_resources: "Quick Resources",
  },

  am: {
    loading: "የአገልግሎት ዝርዝሮችን በመጫን ላይ...",

    not_found_title: "አገልግሎቱ አልተገኘም",
    not_found_body: "የሚፈልጉት አገልግሎት አልተገኘም።",
    back_home: "ወደ መነሻ ተመለስ",

    back: "ተመለስ",
    home: "መነሻ",
    category_fallback: "ምድብ",

    eligibility: "የብቃት መስፈርቶች",
    required_documents: "የሚያስፈልጉ ሰነዶች",
    steps: "አገልግሎቱን ለማግኘት እርምጃዎች",
    legal_references: "ህጋዊ ማጣቀሻዎች፦",
    important_information: "አስፈላጊ መረጃ",
    faqs: "ተደጋጋሚ ጥያቄዎች",

    need_help: "እገዛ ይፈልጋሉ?",
    support_blurb: "የድጋፍ ቡድናችን ይህን አገልግሎት ለመረዳት ይረዳዎታል።",
    contact_support: "ድጋፍን ያግኙ",

    related_services: "ተዛማጅ አገልግሎቶች",
    related_service_fallback: "ተዛማጅ አገልግሎት",

    quick_resources: "ፈጣን ምንጮች",
  },
};
