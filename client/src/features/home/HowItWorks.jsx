import { useEffect, useRef, useState } from "react";
import { PackageSearch, Search, UserCheck, Handshake } from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const STYLES = `
  @keyframes hiw-fade-up {
    from { opacity: 0; transform: translateY(38px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }
  @keyframes hiw-slide-down {
    from { opacity: 0; transform: translateY(-22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes hiw-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes hiw-step-pop {
    0%   { transform: scale(0.4) rotate(-15deg); opacity: 0; }
    65%  { transform: scale(1.18) rotate(5deg);  opacity: 1; }
    100% { transform: scale(1)   rotate(0deg);   opacity: 1; }
  }
  @keyframes hiw-icon-bounce {
    0%   { transform: translateY(0) scale(1); }
    40%  { transform: translateY(-6px) scale(1.12); }
    70%  { transform: translateY(2px)  scale(0.96); }
    100% { transform: translateY(0)    scale(1); }
  }
  @keyframes hiw-connector-draw {
    from { width: 0; opacity: 0; }
    to   { width: 100%; opacity: 1; }
  }
  @keyframes hiw-underline-grow {
    from { width: 0; }
    to   { width: 100%; }
  }
  @keyframes hiw-orb-a {
    0%,100% { transform: translate(0,0) scale(1); }
    40%      { transform: translate(22px,-16px) scale(1.06); }
    75%      { transform: translate(-14px,20px) scale(0.96); }
  }
  @keyframes hiw-orb-b {
    0%,100% { transform: translate(0,0) scale(1); }
    35%      { transform: translate(-20px,14px) scale(1.05); }
    70%      { transform: translate(16px,-22px) scale(0.97); }
  }
  @keyframes hiw-number-glow {
    0%,100% { text-shadow: 0 0 0px transparent; }
    50%      { text-shadow: 0 0 18px rgba(var(--primary-rgb,99,102,241),0.5); }
  }
  @keyframes hiw-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  .hiw-card {
    transition: transform 0.32s cubic-bezier(0.22,1,0.36,1),
                box-shadow  0.32s ease,
                border-color 0.3s ease;
    border: 1.5px solid transparent;
  }
  .hiw-card:hover {
    transform: translateY(-7px) scale(1.015);
    box-shadow: 0 24px 52px -14px rgba(var(--primary-rgb,99,102,241),0.16);
    border-color: rgba(var(--primary-rgb,99,102,241),0.22);
  }
  .hiw-card:hover .hiw-icon-wrap {
    animation: hiw-icon-bounce 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards;
  }
  .hiw-card:hover .hiw-step-num {
    animation: hiw-number-glow 1.2s ease infinite;
  }
  .hiw-card:hover .hiw-explore {
    gap: 10px;
  }

  .hiw-heading-line {
    position: relative;
    display: inline-block;
  }
  .hiw-heading-line::after {
    content: '';
    position: absolute;
    left: 0; bottom: -6px;
    height: 3px; width: 0;
    border-radius: 9999px;
    background: linear-gradient(90deg, var(--color-primary,#6366f1), var(--color-accent,#8b5cf6));
  }
  .hiw-heading-line.active::after {
    animation: hiw-underline-grow 0.7s cubic-bezier(0.22,1,0.36,1) forwards;
  }

  .hiw-connector {
    animation: hiw-connector-draw 0.7s cubic-bezier(0.22,1,0.36,1) both;
  }

  .hiw-explore {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: gap 0.25s ease, color 0.2s;
  }

  .hiw-icon-wrap {
    background: linear-gradient(135deg,
      rgba(var(--primary-rgb,99,102,241),1) 0%,
      rgba(var(--accent-rgb,139,92,246),1) 100%
    );
    background-size: 200% auto;
    transition: transform 0.3s ease;
  }
`;

if (typeof document !== "undefined" && !document.getElementById("hiw-anim-styles")) {
  const tag = document.createElement("style");
  tag.id = "hiw-anim-styles";
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
const STEPS = [
  {
    step: 1,
    icon: Search,
    title: "Create or Discover Campaigns",
    description:
      "Organizers create impactful campaigns while volunteers explore causes aligned with their passion and availability.",
    label: "Browse campaigns →",
  },
  {
    step: 2,
    icon: UserCheck,
    title: "Apply & Connect",
    description:
      "Volunteers apply with a single click. Organizers review profiles, skills, and availability before accepting.",
    label: "Start applying →",
  },
  {
    step: 3,
    icon: Handshake,
    title: "Collaborate & Make Impact",
    description:
      "Work together on the ground or remotely, track participation, and create real change in communities.",
    label: "See impact →",
  },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function HowItWorks() {
  const [sectionRef, sectionInView] = useInView();
  const [headerRef, headerInView] = useInView(0.4);
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
        className="pointer-events-none absolute -top-20 right-0 w-72 h-72 rounded-full bg-primary/8 blur-3xl"
        style={{ animation: "hiw-orb-a 12s ease-in-out infinite" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 -left-16 w-80 h-80 rounded-full bg-accent/6 blur-3xl"
        style={{ animation: "hiw-orb-b 15s ease-in-out infinite" }}
      />

      <div className="relative max-w-7xl mx-auto px-4">

        {/* ── Header ── */}
        <div ref={headerRef} className="text-center mb-16">
          <div
            className="flex gap-2 justify-center items-center mb-3"
            style={{
              opacity: headerInView ? 1 : 0,
              animation: headerInView ? "hiw-slide-down 0.7s cubic-bezier(0.22,1,0.36,1) 0.05s both" : "none",
            }}
          >
            <PackageSearch
              size={28}
              className="text-primary"
              style={{
                opacity: headerInView ? 1 : 0,
                animation: headerInView ? "hiw-step-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both" : "none",
              }}
            />
            <h2
              ref={headingRef}
              className="hiw-heading-line text-primary text-3xl font-bold text-gray-900"
              style={{
                opacity: headerInView ? 1 : 0,
                animation: headerInView ? "hiw-slide-down 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both" : "none",
              }}
            >
              How It Works?
            </h2>
          </div>
          <p
            className="mt-3 text-gray-600 max-w-2xl mx-auto"
            style={{
              opacity: headerInView ? 1 : 0,
              animation: headerInView ? "hiw-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.3s both" : "none",
            }}
          >
            Know the process and be a part of our massive team.
          </p>
        </div>

        {/* ── Cards + connectors ── */}
        <div className="relative grid gap-6 md:grid-cols-3">

          {/* Connector lines between cards (desktop only) */}
          {[0, 1].map((i) => (
            <div
              key={i}
              className="hidden md:block absolute top-10 z-10"
              style={{ left: `calc(${(i + 1) * 33.33}% - 12px)`, width: "calc(33.33% - 32px)" }}
            >

              {/* Arrow tip */}
              {sectionInView && (
                <div
                  className="absolute right-0 -top-[5px] text-accent/60 text-sm"
                  style={{
                    opacity: 0,
                    animation: sectionInView
                      ? `hiw-fade-in 0.3s ease ${0.9 + i * 0.15}s both`
                      : "none",
                  }}
                >
                  ›
                </div>
              )}
            </div>
          ))}

          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const baseDelay = 0.18 + index * 0.15;
            return (
              <div
                key={index}
                className="hiw-card relative bg-white rounded-2xl p-7 shadow-sm cursor-pointer"
                style={{
                  opacity: sectionInView ? 1 : 0,
                  animation: sectionInView
                    ? `hiw-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) ${baseDelay}s both`
                    : "none",
                }}
              >
                {/* Step number badge */}
                <div
                  className="absolute -top-4 -left-2 flex items-center justify-center"
                  style={{
                    opacity: sectionInView ? 1 : 0,
                    animation: sectionInView
                      ? `hiw-step-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) ${baseDelay + 0.15}s both`
                      : "none",
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                    <span className="hiw-step-num text-white text-xs font-bold">{step.step}</span>
                  </div>
                </div>

                {/* Icon */}
                <div
                  className="hiw-icon-wrap flex items-center justify-center w-14 h-14 rounded-xl text-white mb-5"
                  style={{
                    opacity: sectionInView ? 1 : 0,
                    animation: sectionInView
                      ? `hiw-step-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) ${baseDelay + 0.1}s both`
                      : "none",
                  }}
                >
                  <Icon className="w-7 h-7" />
                </div>

                {/* Title */}
                <h3
                  className="text-xl font-semibold text-gray-900 mb-2"
                  style={{
                    opacity: sectionInView ? 1 : 0,
                    animation: sectionInView
                      ? `hiw-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) ${baseDelay + 0.2}s both`
                      : "none",
                  }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  className="text-gray-600 leading-relaxed"
                  style={{
                    opacity: sectionInView ? 1 : 0,
                    animation: sectionInView
                      ? `hiw-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) ${baseDelay + 0.28}s both`
                      : "none",
                  }}
                >
                  {step.description}
                </p>

                {/* CTA */}
                <span
                  className="hiw-explore mt-5 text-sm font-medium text-accent"
                  style={{
                    opacity: sectionInView ? 1 : 0,
                    animation: sectionInView
                      ? `hiw-fade-in 0.4s ease ${baseDelay + 0.38}s both`
                      : "none",
                  }}
                >
                  {step.label}
                  <span>→</span>
                </span>

                {/* Bottom accent bar */}
                <div
                  className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ transition: "opacity 0.3s" }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}