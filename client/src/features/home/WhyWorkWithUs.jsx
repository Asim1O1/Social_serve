import { useEffect, useRef, useState } from "react";
import { ShieldHalf, Compass, CalendarClock, TrendingUp } from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const STYLES = `
  @keyframes why-fade-up {
    from { opacity: 0; transform: translateY(38px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }
  @keyframes why-slide-down {
    from { opacity: 0; transform: translateY(-22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes why-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes why-icon-pop {
    0%   { transform: scale(0.4) rotate(-15deg); opacity: 0; }
    65%  { transform: scale(1.18) rotate(5deg);  opacity: 1; }
    100% { transform: scale(1)   rotate(0deg);   opacity: 1; }
  }
  @keyframes why-icon-bounce {
    0%   { transform: translateY(0) scale(1); }
    40%  { transform: translateY(-6px) scale(1.12); }
    70%  { transform: translateY(2px)  scale(0.96); }
    100% { transform: translateY(0)    scale(1); }
  }
  @keyframes why-underline-grow {
    from { width: 0; }
    to   { width: 100%; }
  }
  @keyframes why-orb-a {
    0%,100% { transform: translate(0,0) scale(1); }
    40%      { transform: translate(24px,-18px) scale(1.06); }
    75%      { transform: translate(-14px,22px) scale(0.96); }
  }
  @keyframes why-orb-b {
    0%,100% { transform: translate(0,0) scale(1); }
    35%      { transform: translate(-20px,14px) scale(1.04); }
    70%      { transform: translate(18px,-24px) scale(0.97); }
  }
  @keyframes why-check-draw {
    from { stroke-dashoffset: 40; opacity: 0; }
    to   { stroke-dashoffset: 0;  opacity: 1; }
  }
  @keyframes why-card-shine {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes why-number-glow {
    0%,100% { box-shadow: 0 0 0 0 rgba(var(--primary-rgb,99,102,241),0); }
    50%      { box-shadow: 0 0 0 6px rgba(var(--primary-rgb,99,102,241),0.18); }
  }

  .why-card {
    transition: transform 0.32s cubic-bezier(0.22,1,0.36,1),
                box-shadow  0.32s ease,
                border-color 0.3s ease;
    border: 1.5px solid transparent;
    position: relative;
    overflow: hidden;
  }
  .why-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(var(--primary-rgb,99,102,241),0.04) 0%,
      transparent 60%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  .why-card:hover::before { opacity: 1; }
  .why-card:hover {
    transform: translateY(-7px) scale(1.015);
    box-shadow: 0 24px 52px -14px rgba(var(--primary-rgb,99,102,241),0.16);
    border-color: rgba(var(--primary-rgb,99,102,241),0.22);
  }
  .why-card:hover .why-icon-wrap {
    animation: why-icon-bounce 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards;
  }
  .why-card:hover .why-badge {
    animation: why-number-glow 1.2s ease infinite;
  }
  .why-card:hover .why-explore { gap: 10px; }

  .why-icon-wrap {
    background: linear-gradient(
      135deg,
      rgba(var(--primary-rgb,99,102,241),1) 0%,
      rgba(var(--accent-rgb,139,92,246),1) 100%
    );
    transition: transform 0.3s ease;
  }
  .why-card:hover .why-icon-wrap {
    transform: rotate(6deg) scale(1.08);
  }

  .why-heading-line {
    position: relative;
    display: inline-block;
  }
  .why-heading-line::after {
    content: '';
    position: absolute;
    left: 0; bottom: -6px;
    height: 3px; width: 0;
    border-radius: 9999px;
    background: linear-gradient(90deg, var(--color-primary,#6366f1), var(--color-accent,#8b5cf6));
  }
  .why-heading-line.active::after {
    animation: why-underline-grow 0.7s cubic-bezier(0.22,1,0.36,1) forwards;
  }

  .why-explore {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: gap 0.25s ease, color 0.2s;
  }

  /* Decorative check SVG stroke animation */
  .why-check-path {
    stroke-dasharray: 40;
    stroke-dashoffset: 40;
    animation: why-check-draw 0.5s ease forwards;
  }
`;

if (typeof document !== "undefined" && !document.getElementById("why-anim-styles")) {
  const tag = document.createElement("style");
  tag.id = "why-anim-styles";
  tag.textContent = STYLES;
  document.head.appendChild(tag);
}

/* ─── useInView ──────────────────────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const REASONS = [
  {
    icon: Compass,
    title: "Find Causes That Matter",
    description:
      "From health and education to environment and community care, discover campaigns that truly resonate with you.",
    label: "Browse causes →",
    stat: "340+ causes",
  },
  {
    icon: CalendarClock,
    title: "Flexible Opportunities",
    description:
      "Volunteer on your schedule — short-term, long-term, remote, or on-ground opportunities available.",
    label: "See opportunities →",
    stat: "Remote & on-site",
  },
  {
    icon: TrendingUp,
    title: "Build Skills & Experience",
    description:
      "Gain hands-on experience, develop leadership skills, and strengthen your social impact profile.",
    label: "Grow with us →",
    stat: "12K+ volunteers",
  },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function WhyWorkWithUs() {
  const [sectionRef, sectionInView] = useInView();
  const [headerRef,  headerInView]  = useInView(0.4);
  const headingRef = useRef(null);

  useEffect(() => {
    if (headerInView && headingRef.current) {
      setTimeout(() => headingRef.current?.classList.add("active"), 380);
    }
  }, [headerInView]);

  return (
    <section ref={sectionRef} className="relative pb-18 overflow-hidden">

      {/* ── Ambient orbs ── */}
      <div
        className="pointer-events-none absolute -top-20 -right-16 w-72 h-72 rounded-full bg-primary/8 blur-3xl"
        style={{ animation: "why-orb-a 11s ease-in-out infinite" }}
      />
      <div
        className="pointer-events-none absolute bottom-4 -left-20 w-80 h-80 rounded-full bg-accent/6 blur-3xl"
        style={{ animation: "why-orb-b 14s ease-in-out infinite" }}
      />

      <div className="relative max-w-7xl mx-auto px-4">

        {/* ── Header ── */}
        <div ref={headerRef} className="text-center mb-16">
          <div
            className="flex gap-2 justify-center items-center mb-3"
            style={{
              opacity: headerInView ? 1 : 0,
              animation: headerInView
                ? "why-slide-down 0.7s cubic-bezier(0.22,1,0.36,1) 0.05s both"
                : "none",
            }}
          >
            <ShieldHalf
              size={28}
              className="text-primary"
              style={{
                opacity: headerInView ? 1 : 0,
                animation: headerInView
                  ? "why-icon-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both"
                  : "none",
              }}
            />
            <h2
              ref={headingRef}
              className="why-heading-line text-primary text-3xl font-bold text-gray-900"
              style={{
                opacity: headerInView ? 1 : 0,
                animation: headerInView
                  ? "why-slide-down 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both"
                  : "none",
              }}
            >
              Why Work With Us?
            </h2>
          </div>

          <p
            className="mt-3 text-gray-600 max-w-2xl mx-auto"
            style={{
              opacity: headerInView ? 1 : 0,
              animation: headerInView
                ? "why-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.3s both"
                : "none",
            }}
          >
            Improve your social skills, get exposure to new ideas and community.
          </p>
        </div>

        {/* ── Cards ── */}
        <div className="grid gap-6 md:grid-cols-3">
          {REASONS.map((reason, index) => {
            const Icon = reason.icon;
            const baseDelay = 0.18 + index * 0.15;
            return (
              <div
                key={index}
                className="why-card bg-white rounded-2xl p-7 shadow-sm cursor-pointer"
                style={{
                  opacity: sectionInView ? 1 : 0,
                  animation: sectionInView
                    ? `why-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) ${baseDelay}s both`
                    : "none",
                }}
              >
                {/* Icon */}
                <div
                  className="why-icon-wrap flex items-center justify-center w-14 h-14 rounded-xl text-white mb-5"
                  style={{
                    opacity: sectionInView ? 1 : 0,
                    animation: sectionInView
                      ? `why-icon-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) ${baseDelay + 0.1}s both`
                      : "none",
                  }}
                >
                  <Icon className="w-7 h-7" />
                </div>

                {/* Stat pill */}
                <div
                  className="why-badge inline-flex items-center gap-1.5 rounded-full bg-primary/8 text-primary text-xs font-semibold px-3 py-1 mb-3"
                  style={{
                    opacity: sectionInView ? 1 : 0,
                    animation: sectionInView
                      ? `why-fade-in 0.4s ease ${baseDelay + 0.18}s both`
                      : "none",
                  }}
                >
                  {/* Animated check mark */}
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path
                      className={sectionInView ? "why-check-path" : ""}
                      style={{ animationDelay: `${baseDelay + 0.3}s` }}
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {reason.stat}
                </div>

                {/* Title */}
                <h3
                  className="text-xl font-semibold text-gray-900 mb-2"
                  style={{
                    opacity: sectionInView ? 1 : 0,
                    animation: sectionInView
                      ? `why-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) ${baseDelay + 0.2}s both`
                      : "none",
                  }}
                >
                  {reason.title}
                </h3>

                {/* Description */}
                <p
                  className="text-gray-600 leading-relaxed"
                  style={{
                    opacity: sectionInView ? 1 : 0,
                    animation: sectionInView
                      ? `why-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) ${baseDelay + 0.28}s both`
                      : "none",
                  }}
                >
                  {reason.description}
                </p>

                {/* CTA */}
                <span
                  className="why-explore mt-5 text-sm font-medium text-accent"
                  style={{
                    opacity: sectionInView ? 1 : 0,
                    animation: sectionInView
                      ? `why-fade-in 0.4s ease ${baseDelay + 0.36}s both`
                      : "none",
                  }}
                >
                  {reason.label}
                  <span>→</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}