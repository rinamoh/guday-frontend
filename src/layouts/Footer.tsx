import { useSearchParams } from "react-router-dom";
import { normalizePublicLanguage } from "../utils/publicLanguage";
import { publicCopy } from "../i18n/public";

export default function Footer() {
  const [searchParams] = useSearchParams();
  const language = normalizePublicLanguage(searchParams.get("language"));
  const t = publicCopy[language];

  return (
    <footer className="bg-white pt-16 pb-4 mt-auto border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h4 className="text-xl text-primary font-bold mb-3">{t.footer_about_title}</h4>
            <ul className="space-y-4 text-black">
              <li>
                <a href="#" className="hover:underline">
                  {t.footer_mission}
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  {t.footer_leadership}
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  {t.footer_departments}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">{t.footer_contact_title}</h4>
            <ul className="space-y-4 text-black">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">phone</span>
                +251987675643
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">mail</span>
                contact@guaday.gov
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">{t.footer_policies_title}</h4>
            <ul className="space-y-4 text-black">
              <li>
                <a href="#" className="hover:underline">
                  {t.footer_privacy}
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  {t.footer_accessibility}
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  {t.footer_terms}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">{t.footer_feedback_title}</h4>
            <p className="text-black mb-4 text-sm">{t.footer_feedback_text}</p>

            <div className="flex gap-4 mt-8 text-black">
              <a href="#" className="hover:opacity-80">
                <span className="material-icons">facebook</span>
              </a>
              <a href="#" className="hover:opacity-80">
                <span className="material-icons">language</span>
              </a>
              <a href="#" className="hover:opacity-80">
                <span className="material-icons">alternate_email</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-700">
          <p>{t.footer_rights}</p>
          <div className="flex gap-6" />
        </div>
      </div>
    </footer>
  );
}
