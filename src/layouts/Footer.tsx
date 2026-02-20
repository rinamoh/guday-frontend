import { Link } from "react-router-dom";

export default function Footer() {
  return (
<footer className="bg-white pt-16 pb-4 mt-auto border-t border-slate-200 dark:border-slate-800">

      <div className="max-w-7xl mx-auto px-4">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <h4 className="text-xl text-primary font-bold mb-3">Guday</h4>
            <ul className="space-y-4 text-black">
              <li>
                <a href="#" className="hover:underline">
                  Mission and Vision
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Executive Leadership
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Departments &amp; Agencies
                </a>
              </li>
             
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-black">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">
                  phone
                </span>
                +251987675643
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">
                  mail
                </span>
                contact@guaday.gov
              </li>
              
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-xl font-bold mb-6">Policies</h4>
            <ul className="space-y-4 text-black">
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Accessibility Statement
                </a>
              </li>
              
              <li>
                <a href="#" className="hover:underline">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Feedback */}
          <div>
            <h4 className="text-xl  font-bold mb-6">Feedback</h4>
            <p className="text-black mb-4 text-sm">
              Help us improve your experience with the portal.
            </p>

            {/* <a
              href="#"
              className="inline-block border-2 border-white px-6 py-2 rounded font-bold hover:bg-white hover:text-primary transition-colors"
            >
              Take Survey
            </a> */}

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

        {/* Bottom bar */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-700">
          <p>© 2026 Guaday Government. All rights reserved.</p>
          <div className="flex gap-6">
          
           
          </div>
        </div>
      </div>
    </footer>
  );
}
