import type { PublicLanguage } from '../utils/publicLanguage';

export const publicCopy: Record<
  PublicLanguage,
  {
    brand: string;

    header_search_placeholder: string;
    header_no_categories: string;

    hero_title: string;
    hero_subtitle: string;
    hero_search_placeholder: string;

    most_searched_title: string;
    most_searched_error: string;
    most_searched_empty: string;

    all_services_title: string;
    all_categories_option: string;
    services_search_placeholder: string;

    loading_services: string;
    failed_load_services: string;
    retry: string;
    no_services_match: string;

    back_to_home: string;
    search_services_title: string;
    search_button: string;
    searching: string;
    filtered_services: string;
    category_label: string;
    results_found: (n: number) => string;

    footer_about_title: string;
    footer_mission: string;
    footer_leadership: string;
    footer_departments: string;

    footer_contact_title: string;

    footer_policies_title: string;
    footer_privacy: string;
    footer_accessibility: string;
    footer_terms: string;

    footer_feedback_title: string;
    footer_feedback_text: string;

    footer_rights: string;
  }
> = {
  en: {
    brand: 'Guday',

    header_search_placeholder: 'Search...',
    header_no_categories: 'No categories available',

    hero_title: 'Find government services',
    hero_subtitle: 'Search for services, benefits, and information from the government.',
    hero_search_placeholder: 'Search for a service...',

    most_searched_title: 'Most Searched Services',
    most_searched_error: 'Unable to load popular services.',
    most_searched_empty: 'No services available.',

    all_services_title: 'All Services',
    all_categories_option: 'All Categories',
    services_search_placeholder: 'Search services...',

    loading_services: 'Loading services...',
    failed_load_services: 'Failed to load services. Please try again.',
    retry: 'Retry',
    no_services_match: 'No services found matching your criteria.',

    back_to_home: 'Back to home',
    search_services_title: 'Search Services',
    search_button: 'Search',
    searching: 'Searching...',
    filtered_services: 'Filtered services',
    category_label: 'Category',
    results_found: (n) => `${n} result${n !== 1 ? 's' : ''} found`,

    footer_about_title: 'Guday',
    footer_mission: 'Mission and Vision',
    footer_leadership: 'Executive Leadership',
    footer_departments: 'Departments & Agencies',

    footer_contact_title: 'Contact',

    footer_policies_title: 'Policies',
    footer_privacy: 'Privacy Policy',
    footer_accessibility: 'Accessibility Statement',
    footer_terms: 'Terms of Service',

    footer_feedback_title: 'Feedback',
    footer_feedback_text: 'Help us improve your experience with the portal.',

    footer_rights: '© 2026 Guday Government. All rights reserved.',
  },

  am: {
    brand: 'ጉዳይ',

    header_search_placeholder: 'ፈልግ...',
    header_no_categories: 'ምንም ምድብ አልተገኘም',

    hero_title: 'የመንግስት አገልግሎቶችን ያግኙ',
    hero_subtitle: 'ከመንግስት የሚሰጡ አገልግሎቶች፣ ጥቅሞች እና መረጃ ይፈልጉ።',
    hero_search_placeholder: 'አገልግሎት ይፈልጉ...',

    most_searched_title: 'በብዛት የተፈለጉ አገልግሎቶች',
    most_searched_error: 'ታዋቂ አገልግሎቶችን መጫን አልተቻለም።',
    most_searched_empty: 'ምንም አገልግሎት አልተገኘም።',

    all_services_title: 'ሁሉም አገልግሎቶች',
    all_categories_option: 'ሁሉም ምድቦች',
    services_search_placeholder: 'አገልግሎቶችን ይፈልጉ...',

    loading_services: 'አገልግሎቶችን በመጫን ላይ...',
    failed_load_services: 'አገልግሎቶችን መጫን አልተቻለም። እባክዎ ደግሞ ይሞክሩ።',
    retry: 'ዳግም ሞክር',
    no_services_match: 'ከመመዘኛዎ ጋር የሚስማማ አገልግሎት አልተገኘም።',

    back_to_home: 'ወደ መነሻ ተመለስ',
    search_services_title: 'አገልግሎቶችን ፈልግ',
    search_button: 'ፈልግ',
    searching: 'በመፈለግ ላይ...',
    filtered_services: 'ተጣራ አገልግሎቶች',
    category_label: 'ምድብ',
    results_found: (n) => `${n} ውጤት${n !== 1 ? 'ዎች' : ''} ተገኝቷል`,

    footer_about_title: 'ጉዳይ',
    footer_mission: 'ተልዕኮ እና ራዕይ',
    footer_leadership: 'አስፈፃሚ አመራር',
    footer_departments: 'መምሪያዎች እና ኤጀንሲዎች',

    footer_contact_title: 'አግኙን',

    footer_policies_title: 'ፖሊሲዎች',
    footer_privacy: 'የግላዊነት ፖሊሲ',
    footer_accessibility: 'የተደራሽነት መግለጫ',
    footer_terms: 'የአገልግሎት ውሎች',

    footer_feedback_title: 'አስተያየት',
    footer_feedback_text: 'በፖርታሉ ላይ ያለዎትን ልምድ ለማሻሻል ያግዙን።',

    footer_rights: '© 2026 ጉዳይ። መብቶቹ በሙሉ የተጠበቁ ናቸው።',
  },
};
