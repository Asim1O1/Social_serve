import { useEffect, useRef, useState } from "react";
import { HeartPulse, GraduationCap, Leaf, Binoculars } from "lucide-react";

/* ─── Keyframes ──────────────────────────────────────────────────────────── */
const STYLES = `
  @keyframes cat-fade-up {
    from { opacity: 0; transform: translateY(36px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }
  @keyframes cat-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes cat-slide-down {
    from { opacity: 0; transform: translateY(-20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes cat-icon-pop {
    0%   { transform: scale(0.5) rotate(-12deg); opacity: 0; }
    70%  { transform: scale(1.15) rotate(4deg);  opacity: 1; }
    100% { transform: scale(1)   rotate(0deg);   opacity: 1; }
  }
  @keyframes cat-arrow-slide {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes cat-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes cat-orb-drift {
    0%,100% { transform: translate(0,0) scale(1); }
    40%      { transform: translate(20px,-15px) scale(1.06); }
    75%      { transform: translate(-12px,18px) scale(0.96); }
  }
  @keyframes cat-orb-drift-b {
    0%,100% { transform: translate(0,0) scale(1); }
    35%      { transform: translate(-18px,12px) scale(1.04); }
    70%      { transform: translate(14px,-20px) scale(0.97); }
  }
  @keyframes cat-underline-grow {
    from { width: 0; }
    to   { width: 100%; }
  }
  @keyframes cat-border-glow {
    0%,100% { box-shadow: 0 0 0 0 rgba(var(--primary-rgb,99,102,241),0); }
    50%      { box-shadow: 0 0 0 4px rgba(var(--primary-rgb,99,102,241),0.12); }
  }

  /* ── Utility ── */
  .cat-section-reveal  { animation: cat-fade-in   0.7s ease both; }
  .cat-header-reveal   { animation: cat-slide-down 0.7s cubic-bezier(0.22,1,0.36,1) both; }
  .cat-sub-reveal      { animation: cat-fade-up    0.6s cubic-bezier(0.22,1,0.36,1) both; }
  .cat-card-reveal     { animation: cat-fade-up    0.7s cubic-bezier(0.22,1,0.36,1) both; }
  .cat-icon-reveal     { animation: cat-icon-pop   0.6s cubic-bezier(0.34,1.56,0.64,1) both; }
  .cat-arrow-reveal    { animation: cat-arrow-slide 0.5s ease both; }

  .cat-heading-line {
    position: relative;
    display: inline-block;
  }
  .cat-heading-line::after {
    content: '';
    position: absolute;
    left: 0; bottom: -6px;
    height: 3px;
    width: 0;
    border-radius: 9999px;
    background: linear-gradient(90deg, var(--color-primary, #6366f1), var(--color-accent, #8b5cf6));
  }
  .cat-heading-line.cat-line-active::after {
    animation: cat-underline-grow 0.7s cubic-bezier(0.22,1,0.36,1) forwards;
  }

  /* Card hover effects */
  .cat-card {
    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1),
                box-shadow 0.3s ease,
                border-color 0.3s ease;
    border: 1.5px solid transparent;
  }
  .cat-card:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 20px 48px -12px rgba(var(--primary-rgb,99,102,241),0.18);
    border-color: rgba(var(--primary-rgb,99,102,241),0.2);
  }
  .cat-card:hover .cat-icon-bg {
    animation: cat-shimmer 1s linear forwards;
  }
  .cat-icon-bg {
    background: linear-gradient(
      135deg,
      rgba(var(--primary-rgb,99,102,241),1) 0%,
      rgba(var(--accent-rgb,139,92,246),1) 100%
    );
    background-size: 200% auto;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .cat-card:hover .cat-icon-bg {
    transform: rotate(8deg) scale(1.1);
    background-position: right center;
  }
  .cat-explore-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: gap 0.25s ease, color 0.2s;
  }
  .cat-card:hover .cat-explore-link {
    gap: 10px;
  }

  /* Orbs */
  .cat-orb-a { animation: cat-orb-drift   11s ease-in-out infinite; }
  .cat-orb-b { animation: cat-orb-drift-b 14s ease-in-out infinite; }
`;

if (typeof document !== "undefined" && !document.getElementById("cat-anim-styles")) {
  const tag = document.createElement("style");
  tag.id = "cat-anim-styles";
  tag.textContent = STYLES;
  document.head.appendChild(tag);
}

/* ─── useInView hook ─────────────────────────────────────────────────────── */
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.15, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const CAMPAIGNS = [
  {
    icon: HeartPulse,
    title: "Health & Relief Campaigns",
    description:
      "Support medical camps, blood donation drives, disaster relief efforts, and emergency response programs.",
    accent: "from-rose-500 to-pink-500",
  },
  {
    icon: GraduationCap,
    title: "Education & Youth Programs",
    description:
      "Volunteer in literacy drives, mentorship programs, school rebuilding projects, and skill development initiatives.",
    accent: "from-primary to-accent",
  },
  {
    icon: Leaf,
    title: "Environment & Community Care",
    description:
      "Join clean-up drives, tree plantation campaigns, wildlife protection, and sustainable community projects.",
    accent: "from-emerald-500 to-teal-500",
  },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function CampaignCategories() {
  const [sectionRef, sectionInView] = useInView();
  const [headerRef, headerInView] = useInView();
  const headingRef = useRef(null);

  /* Underline trigger */
  useEffect(() => {
    if (headerInView && headingRef.current) {
      setTimeout(() => headingRef.current?.classList.add("cat-line-active"), 400);
    }
  }, [headerInView]);

  return (
    <section ref={sectionRef} className="relative pb-18 overflow-hidden">

      {/* ── Ambient orbs ── */}
      <div className="cat-orb-a pointer-events-none absolute -top-16 -left-16 w-64 h-64 rounded-full bg-primary/8 blur-3xl" />
      <div className="cat-orb-b pointer-events-none absolute bottom-0 right-0 w-80 h-80 rounded-full bg-accent/6 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4">

        {/* ── Section Header ── */}
        <div ref={headerRef} className="text-center mb-14">
          <div
            className={`cat-header-reveal flex gap-2 justify-center items-center mb-3 ${headerInView ? "" : "[animation-play-state:paused]"}`}
            style={{ animationDelay: "0.05s" }}
          >
            <Binoculars
              size={28}
              className={`text-primary cat-icon-reveal ${headerInView ? "" : "[animation-play-state:paused]"}`}
              style={{ animationDelay: "0.2s" }}
            />
            <h2
              ref={headingRef}
              className={`cat-heading-line text-3xl text-primary font-bold text-gray-900 ${headerInView ? "cat-header-reveal" : "opacity-0"}`}
              style={{ animationDelay: "0.1s" }}
            >
              Campaigns You Can Volunteer For
            </h2>
          </div>

          <p
            className={`mt-3 text-gray-600 max-w-2xl mx-auto ${headerInView ? "cat-sub-reveal" : "opacity-0"}`}
            style={{ animationDelay: "0.32s" }}
          >
            Discover meaningful campaigns and contribute your time, skills, and
            energy where it matters most.
          </p>
        </div>

        {/* ── Cards ── */}
        <div className="grid gap-6 md:grid-cols-3">
          {CAMPAIGNS.map((campaign, index) => {
            const Icon = campaign.icon;
            return (
              <div
                key={index}
                className={`cat-card bg-white rounded-2xl p-6 shadow-sm cursor-pointer ${sectionInView ? "cat-card-reveal" : "opacity-0"}`}
                style={{ animationDelay: `${0.2 + index * 0.14}s` }}
              >
                {/* Icon */}
                <div
                  className={`cat-icon-bg flex items-center justify-center w-14 h-14 rounded-xl text-white mb-5 ${sectionInView ? "cat-icon-reveal" : "opacity-0"}`}
                  style={{ animationDelay: `${0.35 + index * 0.14}s` }}
                >
                  <Icon className="w-8 h-8" />
                </div>

                {/* Title */}
                <h3
                  className={`text-xl font-semibold text-gray-900 mb-2 ${sectionInView ? "cat-sub-reveal" : "opacity-0"}`}
                  style={{ animationDelay: `${0.42 + index * 0.14}s` }}
                >
                  {campaign.title}
                </h3>

                {/* Description */}
                <p
                  className={`text-gray-600 leading-relaxed ${sectionInView ? "cat-sub-reveal" : "opacity-0"}`}
                  style={{ animationDelay: `${0.5 + index * 0.14}s` }}
                >
                  {campaign.description}
                </p>

                {/* CTA */}
                <span
                  className={`cat-explore-link mt-5 text-sm font-medium text-accent ${sectionInView ? "cat-arrow-reveal" : "opacity-0"}`}
                  style={{ animationDelay: `${0.58 + index * 0.14}s` }}
                >
                  Explore campaigns
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}