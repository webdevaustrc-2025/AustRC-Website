import { lazy, Suspense } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import { useTokens } from "@/tokens/useTokens";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "./HeroSection";
import { NoticesBoardHomepageSection } from "./NoticesBoardHomePageSection";

// Below-fold sections — code-split so they don't block initial paint
const EventsSection                  = lazy(() => import("./EventsSection").then(m => ({ default: m.EventsSection })));
const EducationalProgramsSection     = lazy(() => import("./EducationalProgramsSection").then(m => ({ default: m.EducationalProgramsSection })));
const ResearchProjectsHomepageSection = lazy(() => import("./ResearchProjectsHomepageSection").then(m => ({ default: m.ResearchProjectsHomepageSection })));
const OtherActivitiesHomepageSection  = lazy(() => import("./OtherActivitiesHomepageSection").then(m => ({ default: m.OtherActivitiesHomepageSection })));
const TestimonialsSection            = lazy(() => import("./TestimonialsSection").then(m => ({ default: m.TestimonialsSection })));
const CollaborationsSection          = lazy(() => import("./CollaborationsSection").then(m => ({ default: m.CollaborationsSection })));
const SponsorsSection                = lazy(() => import("./SponsorsSection").then(m => ({ default: m.SponsorsSection })));

// Static CSS-only background — no JS animation loop, GPU-composited
const BG_PARTICLES = [
  { left: '12%', top: '20%', dur: '16s', delay: '0s'   },
  { left: '28%', top: '55%', dur: '20s', delay: '3s'   },
  { left: '45%', top: '35%', dur: '18s', delay: '6s'   },
  { left: '62%', top: '70%', dur: '14s', delay: '1.5s' },
  { left: '78%', top: '25%', dur: '22s', delay: '4.5s' },
  { left: '90%', top: '60%', dur: '17s', delay: '2s'   },
  { left: '5%',  top: '80%', dur: '19s', delay: '7s'   },
  { left: '55%', top: '88%', dur: '15s', delay: '5s'   },
];
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none hidden lg:block" aria-hidden="true">
      {BG_PARTICLES.map((p, i) => (
        <span
          key={i}
          className="particle-dot opacity-10"
          style={{ left: p.left, top: p.top, '--dur': p.dur, '--delay': p.delay } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// Section divider — lightweight, no JS animation on content
function AnimatedDivider() {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="h-px bg-gradient-to-r from-transparent via-[#2ECC71]/40 to-transparent my-16"
    />
  );
}

// Scroll progress — uses Framer's useScroll (no manual scroll listener)
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] origin-left z-50"
      style={{ scaleX }}
    />
  );
}

// Minimal section reveal — only opacity+translateY (no scale, no x-slide = no layout thrash)
function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Fallback skeleton shown while lazy section loads
function SectionSkeleton() {
  return <div className="h-64 w-full animate-pulse rounded-xl opacity-20" />;
}

export function HomePage() {
  const t = useTokens();
  return (
    <main className="relative min-h-screen w-full overflow-clip" style={{ backgroundColor: t.pageBg }}>
      <AnimatedBackground />
      <ScrollProgress />

      {/* Hero — eager, no extra wrapper animation needed */}
      <HeroSection />

      <AnimatedDivider />
      <NoticesBoardHomepageSection />
      <AnimatedDivider />

      <Suspense fallback={<SectionSkeleton />}>
        <Reveal><EventsSection /></Reveal>
      </Suspense>

      <AnimatedDivider />

      <Suspense fallback={<SectionSkeleton />}>
        <Reveal><EducationalProgramsSection /></Reveal>
      </Suspense>

      <AnimatedDivider />

      <Suspense fallback={<SectionSkeleton />}>
        <Reveal><ResearchProjectsHomepageSection /></Reveal>
      </Suspense>

      <AnimatedDivider />

      <Suspense fallback={<SectionSkeleton />}>
        <Reveal><OtherActivitiesHomepageSection /></Reveal>
      </Suspense>

      <AnimatedDivider />

      <Suspense fallback={<SectionSkeleton />}>
        <Reveal><TestimonialsSection /></Reveal>
      </Suspense>

      <AnimatedDivider />

      <Suspense fallback={<SectionSkeleton />}>
        <Reveal className="flex flex-col items-center">
          <CollaborationsSection />
          <Link
            to="/collaborations"
            className="mt-10 group inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white font-bold rounded-full shadow-[0_0_30px_0_rgba(46,204,113,0.3)] hover:shadow-[0_0_50px_0_rgba(46,204,113,0.5)] transition-all duration-300 transform hover:-translate-y-1 text-base"
          >
            <span>Explore All Collaborations</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>
      </Suspense>

      <AnimatedDivider />

      <Suspense fallback={<SectionSkeleton />}>
        <Reveal className="flex flex-col items-center pb-20">
          <SponsorsSection />
          <Link
            to="/sponsors"
            className="mt-10 group inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white font-bold rounded-full shadow-[0_0_30px_0_rgba(46,204,113,0.3)] hover:shadow-[0_0_50px_0_rgba(46,204,113,0.5)] transition-all duration-300 transform hover:-translate-y-1 text-base"
          >
            <span>Meet Our Sponsors</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>
      </Suspense>

      {/* Website journey */}
      <Reveal className="flex flex-col items-center pb-20 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: t.textPrimary }}>
          Behind the Screens
        </h2>
        <p className="text-sm md:text-base max-w-xl mb-8" style={{ color: t.textSecondary }}>
          Discover how a small team turned a bold idea into a full-stack website and mobile app — one panel at a time.
        </p>
        <Link
          to="/website-journey"
          className="group inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[rgba(46,204,113,0.1)] to-[rgba(39,174,96,0.1)] hover:from-[#2ECC71] hover:to-[#27AE60] border border-[rgba(46,204,113,0.4)] hover:border-[#2ECC71] text-[#2ECC71] hover:text-white font-bold rounded-full shadow-[0_0_20px_rgba(46,204,113,0.15)] hover:shadow-[0_0_50px_rgba(46,204,113,0.5)] transition-all duration-300 transform hover:-translate-y-1 text-base"
        >
          <span>Our Website and App Development Journey</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </Reveal>

      <div className="hidden lg:block fixed bottom-10 right-10 w-32 h-32 bg-[#2ECC71]/20 rounded-full blur-3xl pointer-events-none z-0" />
    </main>
  );
}
