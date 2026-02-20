import { Link } from "react-router-dom";

type NewsItem = {
  id: string;
  title: string;
  dateLabel: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
};

const NEWS_ITEMS: NewsItem[] = [
  {
    id: "news-1",
    title: "New Winter Relief Fund Launched for Local Communities",
    dateLabel: "February 24, 2026",
    description:
      "The government has announced a comprehensive financial aid package to support families affected by the record-breaking winter storm conditions across the northern regions.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDpvb8GpQ7yfLVYqeusKVlefRXs3wA-OQT17NSHbw800se4WFHOnj_x2uuZZoaEQxqdyLzRG7HvAzQlZFMCZVlW8P-8T8j0uYCU3GWu9qFLWgPqwCtrZ46idc38NhoXq9Xdod3mydKStP99IGXj0LMOWPMTB6FtP3F8sX8gMIxi1iDj0XHIIJSO9TKbueU8Ca34gFAVQetetkSQO9wtpKr_l2HeGbx2-YV0NyMlDGsVO6HDS2GZgce3hb_mRvu8Ndpo4m5g31bwmw",
    imageAlt: "News 1",
  },
  {
    id: "news-2",
    title: "Digital Transformation Initiative Reaches Major Milestone",
    dateLabel: "February 22, 2026",
    description:
      "Over 80% of government services are now accessible through the unified digital portal, significantly reducing processing times for citizenship applications.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA2pL5wRZ2jAjGQ444djhvKGxovj7ExckWDEHP1VnD6R5lby3UfVsXYpbZjWQs_zM2x8VmMxymt96jJC7-aYqCPRzmJvjTCA8YvLQtCPquecVJaCy3SY3zv1C_688CRm9by6VH13gc1HcjPL5S_RIj5AU2QirfdLRv67TzbeT1LH8vBpFg-pGb_nH5sgkws-v4KhaBu19GpKfJulaLa8DMul_LGp8TB8_1f4JeS2_55rg_hgVREq1hv9qYT57U5dNTNXlLGptz8vA",
    imageAlt: "News 2",
  },
  {
    id: "news-3",
    title: "Green Energy Grant Program Opening for Applications",
    dateLabel: "February 20, 2026",
    description:
      "Small businesses and homeowners can now apply for grants to install solar panels and improve energy efficiency under the new environmental policy.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBPaJwMWRNnbyzWsn2FCyDT66E2XDoMkCt5GpmRuk4B--NtSF-HWQSMA0ujnRoTw8GZvvUM19EV76N-4fd86XV_O1SZTxz0XEOulx5TJ-W2A5afPHU8n7fGT-gKr70BqyS6tuoaFEgzmwEeaizfVr8PMZ4ucDurmx6pmmUUJvvNozxR-1MgVxvBR282Zb4QXenhx86k1dwKu2X_DZzblTubftkFLCny-yK_Kvm5fXAYz5OOYJ2SefsJ2OCqhKKMNDMv3a3jjDhzyw",
    imageAlt: "News 3",
  },
];

export default function LatestNewsSection() {
  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-primary text-2xl font-bold">Latest News</h2>

          {/* Internal route (recommended). Change to your real route later. */}
          {/* <Link
            to="/updates"
            className="text-primary font-semibold hover:underline flex items-center gap-1"
          >
            View all updates{" "}
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </Link> */}
        </div>

        <div className="flex overflow-x-auto gap-6 pb-6 no-scrollbar snap-x">
          {NEWS_ITEMS.map((item) => (
            <article
              key={item.id}
              className="min-w-[300px] md:min-w-[400px] snap-start bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden"
            >
              <img
                alt={item.imageAlt}
                className="w-full h-48 object-cover"
                src={item.imageUrl}
              />
              <div className="p-6">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {item.dateLabel}
                </span>
                <h3 className="text-xl text-primary font-bold mt-2 mb-3 leading-tight">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
