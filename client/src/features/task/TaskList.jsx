import {
  Bookmark,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router";
import Loading from "../../components/Loading";
import { useCampaign } from "../../context/CampaignContext";
import { NoCampaignsFound } from "../../pages/Home";

/* ── Phase badge color map ─────────────────────────────────────────────── */
const PHASE_STYLES = {
  active:     "bg-emerald-50 text-emerald-600 border-emerald-200",
  ongoing:    "bg-blue-50   text-blue-600   border-blue-200",
  completed:  "bg-gray-100  text-gray-500   border-gray-200",
  pending:    "bg-amber-50  text-amber-600  border-amber-200",
  cancelled:  "bg-red-50    text-red-500    border-red-200",
};

function phaseBadgeClass(phase = "pending") {
  return PHASE_STYLES[phase.toLowerCase()] ?? PHASE_STYLES.pending;
}

/* ── InfoRow ───────────────────────────────────────────────────────────── */
function InfoRow({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <Icon size={12} className="text-primary/50 flex-shrink-0" strokeWidth={2.2} />
      <span className="truncate">{label}</span>
    </div>
  );
}

/* ── CampaignCard ──────────────────────────────────────────────────────── */
function CampaignCard({ campaign }) {
  const phase = campaign?.phase || "pending";

  return (
    <Link
      to={`${campaign.id}`}
      className="group relative flex flex-col bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-primary/8 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 overflow-hidden"
    >
      {/* Top accent bar — thicker, full gradient */}
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-primary/60 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex flex-col flex-1 p-5 gap-4">

        {/* Title row */}
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-[15px] font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {campaign.title}
          </h4>
          <span className={`inline-flex items-center shrink-0 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${phaseBadgeClass(phase)}`}>
            {phase}
          </span>
        </div>

        {/* Meta info */}
        <div className="flex flex-col gap-2">
          <InfoRow icon={Bookmark}    label={campaign.category || "No category"} />
          <InfoRow icon={MapPin}      label={campaign.location || "Remote / Not specified"} />
          <InfoRow
            icon={CalendarDays}
            label={
              campaign.startDate
                ? new Date(campaign.startDate).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                  })
                : "—"
            }
          />
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            View tasks
          </span>
          <div className="w-8 h-8 rounded-xl bg-primary/6 flex items-center justify-center text-primary/60 group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110 shadow-sm group-hover:shadow-primary/30">
            <ArrowRight size={14} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Hover border ring */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none border border-transparent group-hover:border-primary/20 transition-colors duration-300" />
    </Link>
  );
}

/* ── Pagination ────────────────────────────────────────────────────────── */
function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      <div className="flex items-center gap-1.5 flex-wrap justify-center">

        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-primary/30 hover:text-primary hover:bg-primary/4 disabled:opacity-35 disabled:pointer-events-none transition-all active:scale-95 shadow-sm"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>

        {/* Page numbers */}
        {Array.from({ length: totalPages }, (_, i) => {
          const page = i + 1;
          const isActive = currentPage === page;
          const showPage =
            Math.abs(page - currentPage) <= 2 ||
            page === 1 ||
            page === totalPages;

          if (!showPage) {
            return (page === 2 || page === totalPages - 1) ? (
              <span key={page} className="w-9 h-9 flex items-center justify-center text-gray-300 text-sm select-none">
                ···
              </span>
            ) : null;
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 shadow-sm
                ${isActive
                  ? "bg-gradient-to-br from-primary to-accent text-white shadow-primary/25 scale-105 border-transparent"
                  : "border border-gray-200 text-gray-600 bg-white hover:border-primary/25 hover:text-primary hover:bg-primary/4"
                }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-primary/30 hover:text-primary hover:bg-primary/4 disabled:opacity-35 disabled:pointer-events-none transition-all active:scale-95 shadow-sm"
        >
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </div>

      <p className="text-xs text-gray-400 tracking-wide">
        Page <span className="font-semibold text-gray-600">{currentPage}</span> of {totalPages}
      </p>
    </div>
  );
}

/* ── TaskList ──────────────────────────────────────────────────────────── */
export default function TaskList() {
  const { campaigns, status, fetchCampaigns, handlePagination } = useCampaign();
  const currentPage  = Number(campaigns?.pagination?.page       || 1);
  const totalPages   = Number(campaigns?.pagination?.totalPages || 1);
  const hasCampaigns = campaigns?.campaigns?.length > 0;

  useEffect(() => { fetchCampaigns(); }, []);

  if (status === "loading") return <Loading />;

  return (
    <div className="flex flex-col w-full gap-8 pb-6">

      {hasCampaigns ? (
        <>
          {/* Result count */}
          <p className="text-sm text-gray-400">
            Showing <span className="font-semibold text-gray-600">{campaigns.campaigns.length}</span> campaign{campaigns.campaigns.length !== 1 ? "s" : ""}
            {totalPages > 1 && <span> · page {currentPage} of {totalPages}</span>}
          </p>

          {/* Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {campaigns.campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-6 rounded-2xl border border-primary/8 bg-white/60 backdrop-blur-sm shadow-sm">
          <NoCampaignsFound isCategoryFilter={null} />
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePagination}
        />
      )}
    </div>
  );
}