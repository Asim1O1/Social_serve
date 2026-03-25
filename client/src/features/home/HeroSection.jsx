import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

/* ─── Keyframes injected once ────────────────────────────────────────────── */
const HERO_STYLES = `
  /* ── Core cinematic reveals ── */
  @keyframes hero-fade-up {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes hero-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes hero-slide-right {
    from { opacity: 0; transform: translateX(-32px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes hero-img-reveal {
    from { opacity: 0; transform: scale(1.08) translateY(24px); clip-path: inset(8% 8% 8% 8% round 24px); }
    to   { opacity: 1; transform: scale(1) translateY(0);       clip-path: inset(0% 0% 0% 0% round 24px); }
  }

  /* ── Badge shimmer ── */
  @keyframes badge-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  /* ── Ambient orbs ── */
  @keyframes orb-drift-a {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(30px, -20px) scale(1.07); }
    66%       { transform: translate(-15px, 25px) scale(0.95); }
  }
  @keyframes orb-drift-b {
    0%, 100% { transform: translate(0, 0) scale(1); }
    40%       { transform: translate(-25px, 18px) scale(1.05); }
    75%       { transform: translate(20px, -30px) scale(0.97); }
  }

  /* ── Floating particles ── */
  @keyframes particle-float {
    0%   { transform: translateY(0px) rotate(0deg);   opacity: 0.6; }
    50%  { transform: translateY(-18px) rotate(180deg); opacity: 1; }
    100% { transform: translateY(0px) rotate(360deg); opacity: 0.6; }
  }

  /* ── Image parallax overlay scan ── */
  @keyframes scan-line {
    0%   { transform: translateY(-100%); opacity: 0.06; }
    100% { transform: translateY(400%);  opacity: 0; }
  }

  /* ── Headline word reveal ── */
  @keyframes word-reveal {
    from { opacity: 0; transform: translateY(1em) skewY(4deg); }
    to   { opacity: 1; transform: translateY(0)   skewY(0deg); }
  }

  /* ── Button pulse glow on hover ── */
  @keyframes btn-glow-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(var(--primary-rgb, 99,102,241), 0.5); }
    50%       { box-shadow: 0 0 0 10px rgba(var(--primary-rgb, 99,102,241), 0); }
  }

  /* ── Utility classes ── */
  .hero-badge {
    animation: hero-slide-right 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both;
  }
  .hero-badge-inner {
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255,255,255,0.35) 50%,
      transparent 100%
    );
    background-size: 200% auto;
    animation: badge-shimmer 2.4s linear 1.2s infinite;
  }
  .hero-heading {
    overflow: hidden;
  }
  .hero-word {
    display: inline-block;
    animation: word-reveal 0.65s cubic-bezier(0.22,1,0.36,1) both;
  }
  .hero-subtext {
    animation: hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both;
  }
  .hero-cta-wrap {
    animation: hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both;
  }
  .hero-btn-primary {
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .hero-btn-primary:hover {
    transform: translateY(-3px);
    animation: btn-glow-pulse 1.2s ease infinite;
  }
  .hero-btn-secondary {
    transition: transform 0.2s, background 0.2s;
  }
  .hero-btn-secondary:hover {
    transform: translateY(-2px);
  }
  .hero-img-wrap {
    animation: hero-img-reveal 1.1s cubic-bezier(0.22,1,0.36,1) 0.5s both;
  }
  .hero-img-inner {
    transition: transform 0.1s linear;
    will-change: transform;
  }
  .hero-scan {
    animation: scan-line 3s linear 1.6s 2;
    pointer-events: none;
  }
  .orb-a {
    animation: orb-drift-a 9s ease-in-out infinite;
  }
  .orb-b {
    animation: orb-drift-b 12s ease-in-out infinite;
  }
  .particle {
    animation: particle-float linear infinite;
  }
  .hero-overlay {
    animation: hero-fade-in 1.2s ease 0.2s both;
    pointer-events: none;
  }

  /* Stats counter row */
  .stat-item {
    animation: hero-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both;
  }
`;

if (typeof document !== "undefined" && !document.getElementById("hero-anim-styles")) {
    const tag = document.createElement("style");
    tag.id = "hero-anim-styles";
    tag.textContent = HERO_STYLES;
    document.head.appendChild(tag);
}

/* ─── Particles ─────────────────────────────────────────────────────────── */
const PARTICLES = [
    { size: 6, top: "18%", left: "8%", dur: "4.2s", delay: "0s" },
    { size: 4, top: "72%", left: "12%", dur: "5.8s", delay: "1s" },
    { size: 8, top: "40%", left: "3%", dur: "3.6s", delay: "0.5s" },
    { size: 5, top: "85%", left: "22%", dur: "6.1s", delay: "1.8s" },
    { size: 7, top: "10%", left: "45%", dur: "4.9s", delay: "0.3s" },
];

/* ─── Animated headline words ────────────────────────────────────────────── */
function CinematicHeadline() {
    const lines = [
        { words: ["Together", "We", "Can"], plain: true },
        { words: ["Make", "Change", "Happen"], plain: false },
    ];
    let globalIdx = 0;
    return (
        <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold leading-tight text-text">
            {lines.map((line, li) => (
                <span key={li} className={`hero-heading block${line.plain ? "" : " text-primary"}`}>
                    {line.words.map((word) => {
                        const delay = `${0.35 + globalIdx++ * 0.09}s`;
                        return (
                            <span
                                key={word}
                                className="hero-word mr-[0.25em] last:mr-0"
                                style={{ animationDelay: delay }}
                            >
                                {word}
                            </span>
                        );
                    })}
                </span>
            ))}
        </h1>
    );
}

/* ─── Stats row ──────────────────────────────────────────────────────────── */
const STATS = [
    { value: "12K+", label: "Supporters" },
    { value: "340", label: "Campaigns" },
    { value: "98%", label: "Impact Rate" },
];

/* ─── HeroSection ────────────────────────────────────────────────────────── */
export default function HeroSection() {
    const imgRef = useRef(null);
    const sectionRef = useRef(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    /* Parallax on mouse move */
    useEffect(() => {
        const section = sectionRef.current;
        const img = imgRef.current;
        if (!section || !img) return;

        const handleMouseMove = (e) => {
            const rect = section.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / rect.width;   // -0.5 → 0.5
            const dy = (e.clientY - cy) / rect.height;

            img.style.transform = `translate(${dx * -14}px, ${dy * -10}px) scale(1.04)`;
        };
        const handleMouseLeave = () => {
            img.style.transform = "translate(0,0) scale(1)";
        };

        section.addEventListener("mousemove", handleMouseMove);
        section.addEventListener("mouseleave", handleMouseLeave);
        return () => {
            section.removeEventListener("mousemove", handleMouseMove);
            section.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-[90vh] pt-12"
        >
            {/* ── Ambient gradient overlay ── */}
            <div className="hero-overlay pointer-events-none absolute left-0 w-full top-0 min-h-screen bg-gradient-to-b from-primary/10 via-accent/10 to-transparent" />

            {/* ── Ambient orbs ── */}
            <div className="orb-a pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="orb-b pointer-events-none absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-accent/8 blur-3xl" />

            <div className="container grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] items-center mx-auto overflow-hidden gap-12">
                {/* ── Floating particles ── */}
                {mounted && PARTICLES.map((p, i) => (
                    <span
                        key={i}
                        className="particle pointer-events-none absolute rounded-full bg-primary/30"
                        style={{
                            width: p.size, height: p.size,
                            top: p.top, left: p.left,
                            animationDuration: p.dur,
                            animationDelay: p.delay,
                        }}
                    />
                ))}

                {/* ── Content ── */}
                <div className="relative z-0 max-w-xl">

                    {/* Badge */}
                    <span className="hero-badge inline-flex items-center rounded-full bg-secondary text-accent px-4 py-1 text-sm font-medium mb-5 relative overflow-hidden">
                        <span className="hero-badge-inner absolute inset-0 rounded-full" />
                        <span className="relative">🚀 Community Campaign</span>
                    </span>

                    {/* Headline — word-by-word reveal */}
                    <CinematicHeadline />

                    {/* Subtext */}
                    <p
                        className="hero-subtext mt-6 text-base text-neutral-600"
                        style={{ animationDelay: "0.82s" }}
                    >
                        Join our campaign to empower communities, create real impact, and build a
                        better future—one step at a time.
                    </p>

                    {/* CTAs */}
                    <div
                        className="hero-cta-wrap mt-8 flex flex-wrap gap-4"
                        style={{ animationDelay: "0.96s" }}
                    >
                        <Link
                            to="/campaign"
                            className="hero-btn-primary rounded-xl bg-gradient-to-br from-primary to-accent px-6 py-3 font-semibold text-white shadow-lg"
                        >
                            Join Campaign
                        </Link>
                        <button className="hero-btn-secondary rounded-xl border-2 border-border px-6 py-3 font-semibold text-accent hover:bg-secondary">
                            Learn More
                        </button>
                    </div>

                    {/* Stats row */}
                    <div className="mt-10 flex gap-8">
                        {STATS.map((s, i) => (
                            <div
                                key={s.label}
                                className="stat-item"
                                style={{ animationDelay: `${1.1 + i * 0.12}s` }}
                            >
                                <div className="text-2xl font-bold text-primary">{s.value}</div>
                                <div className="text-xs text-neutral-500 mt-0.5 tracking-wide uppercase">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Visual ── */}
                <div className="hero-img-wrap relative hidden lg:block">
                    {/* Glow behind image */}
                    <div className="absolute inset-4 rounded-3xl bg-primary/15 blur-2xl -z-10" />

                    {/* Image with parallax inner div */}
                    <div className="overflow-hidden rounded-3xl shadow-2xl">
                        <img
                            ref={imgRef}
                            src="/hero_social_serve.jpg"
                            alt="Campaign"
                            className="hero-img-inner relative w-full rounded-3xl object-cover transition-transform duration-100"
                            style={{ willChange: "transform" }}
                        />
                        {/* Cinematic scan line */}
                        <div className="hero-scan absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/10 to-transparent" />
                    </div>

                    {/* Decorative corner accent */}
                    <div
                        className="pointer-events-none absolute -bottom-3 -right-3 w-24 h-24 rounded-2xl border-2 border-primary/25 -z-10"
                        style={{ animation: "hero-fade-in 0.8s ease 1.4s both" }}
                    />
                    <div
                        className="pointer-events-none absolute -top-3 -left-3 w-16 h-16 rounded-xl border-2 border-accent/20 -z-10"
                        style={{ animation: "hero-fade-in 0.8s ease 1.6s both" }}
                    />
                </div>
            </div>
        </section>
    );
}