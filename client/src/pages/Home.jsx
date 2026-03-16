import { ChevronRight, Megaphone } from "lucide-react";
import { Link } from "react-router";
import Loading from "../components/Loading";
import { useCampaign } from "../context/CampaignContext";
import CampaignCard from "../features/campaign/CampaignCard";
import CategoryTabs from "../features/home/CategoryTab";
import CampaignFeatures from "../features/home/Features";
import HeroSection from "../features/home/HeroSection";
import HowItWorks from "../features/home/HowItWorks";
import WhyWorkWithUs from "../features/home/WhyWorkWithUs";

/* ─── Keyframe Animations (injected once) ─────────────────────────────── */
const animationStyles = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  @keyframes pulse-ring {
    0%   { transform: scale(0.92); opacity: 0.6; }
    50%  { transform: scale(1.08); opacity: 0.2; }
    100% { transform: scale(0.92); opacity: 0.6; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
  }

  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* Staggered campaign cards */
  .campaign-grid-item:nth-child(1) { animation-delay: 0.05s; }
  .campaign-grid-item:nth-child(2) { animation-delay: 0.15s; }
  .campaign-grid-item:nth-child(3) { animation-delay: 0.25s; }
  .campaign-grid-item:nth-child(4) { animation-delay: 0.35s; }

  .animate-fade-up {
    opacity: 0;
    animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  .animate-fade-in {
    opacity: 0;
    animation: fadeIn 0.5s ease forwards;
  }

  /* "View all" button shimmer on hover */
  .view-all-btn {
    position: relative;
    overflow: hidden;
    transition: color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .view-all-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      105deg,
      transparent 30%,
      rgba(255,255,255,0.3) 50%,
      transparent 70%
    );
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .view-all-btn:hover::after {
    opacity: 1;
    animation: shimmer 0.75s ease forwards;
  }
  .view-all-btn:hover {
    box-shadow: 0 4px 18px rgba(var(--primary-rgb, 99,102,241), 0.25);
  }

  /* Section heading underline animation */
  .heading-underline {
    position: relative;
    display: inline-block;
  }
  .heading-underline::after {
    content: '';
    position: absolute;
    left: 0; bottom: -4px;
    width: 0; height: 3px;
    background: currentColor;
    border-radius: 9999px;
    transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .heading-underline.ready::after {
    width: 100%;
  }

  /* Megaphone float + ring pulse */
  .icon-float {
    animation: float 3s ease-in-out infinite;
  }
  .pulse-ring {
    animation: pulse-ring 2.4s ease-in-out infinite;
  }
`;

/* ─── Inject styles once ────────────────────────────────────────────────── */
if (typeof document !== "undefined" && !document.getElementById("home-anim-styles")) {
  const tag = document.createElement("style");
  tag.id = "home-anim-styles";
  tag.textContent = animationStyles;
  document.head.appendChild(tag);
}

/* ─── Heading underline hook ────────────────────────────────────────────── */
import { useEffect, useRef } from "react";

function AnimatedHeading({ children, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("ready"); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <span ref={ref} className={`heading-underline ${className}`}>
      {children}
    </span>
  );
}

/* ─── Home ──────────────────────────────────────────────────────────────── */
function Home() {
  const { status, campaigns, choseCampaign, handleRegister } = useCampaign();
  const isLoading = status === "loading";

  return (
    <div>
      <HeroSection />
      <CampaignFeatures />
      <HowItWorks />
      <WhyWorkWithUs />
      <CategoryTabs />

      {/* ── Latest Campaign Section ── */}
      <div className="container mx-auto px-4 py-6">

        {/* Header row */}
        <div
          className="flex justify-between items-end gap-4 animate-fade-up"
          style={{ animationDelay: "0s" }}
        >
          <div>
            <h1 className="text-5xl text-primary font-bold leading-tight">
              <AnimatedHeading>Latest Campaign</AnimatedHeading>
            </h1>
            <p
              className="text-lg text-gray-500 mt-2 animate-fade-up"
              style={{ animationDelay: "0.12s" }}
            >
              Explore what's happening around you.
            </p>
          </div>

          <Link
            to="/campaign"
            className="view-all-btn flex gap-1 items-center font-semibold text-primary bg-primary/5 rounded-lg hover:bg-primary hover:text-white duration-150 px-6 py-3 animate-fade-up"
            style={{ animationDelay: "0.18s" }}
          >
            View all <ChevronRight className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="mt-8 animate-fade-in">
            <Loading />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !campaigns?.campaigns?.length && (
          <div
            className="mt-8 rounded-2xl border border-primary/20 bg-white/60 shadow-sm overflow-hidden animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            <NoCampaignsFound />
          </div>
        )}

        {/* Campaign grid */}
        {!isLoading && campaigns?.campaigns?.length > 0 && (
          <div className="grid-container mt-6">
            {campaigns.campaigns.slice(0, 4).map((event, i) => (
              <div
                key={event.id}
                className="campaign-grid-item animate-fade-up"
                style={{ animationDelay: `${0.05 + i * 0.1}s` }}
              >
                <CampaignCard
                  campaign={event}
                  choseCampaign={choseCampaign}
                  handleRegister={handleRegister}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

/* ─── NoCampaignsFound ──────────────────────────────────────────────────── */
export function NoCampaignsFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">

      {/* Icon with layered pulse rings */}
      <div className="relative mb-6">
        {/* Outer pulse ring */}
        <div className="pulse-ring absolute inset-0 rounded-full bg-primary/10 scale-125" />
        {/* Inner ring */}
        <div
          className="pulse-ring absolute inset-0 rounded-full bg-accent/10 scale-110"
          style={{ animationDelay: "0.6s" }}
        />
        {/* Icon container */}
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-inner">
          <Megaphone
            className="icon-float w-12 h-12 text-primary/70"
            strokeWidth={1.5}
          />
        </div>
      </div>

      <h2
        className="text-2xl font-bold text-accent mb-2 animate-fade-up"
        style={{ animationDelay: "0.1s" }}
      >
        No campaigns found
      </h2>
      <p
        className="text-accent/70 max-w-sm mx-auto animate-fade-up"
        style={{ animationDelay: "0.2s" }}
      >
        There are no campaigns right now. Check back soon for exciting new campaigns launching near you.
      </p>
    </div>
  );
}