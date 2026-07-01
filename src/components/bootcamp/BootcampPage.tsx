import { motion, useScroll, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Cpu,
  ExternalLink,
  GraduationCap,
  Layers,
  Sparkles,
  Users,
  ChevronRight,
  Star,
  Zap,
  Trophy,
  Monitor,
  BookOpen,
  Clock,
} from 'lucide-react';
import { BOOTCAMP_BASE_PATH, bootcampWings } from '@/data/bootcampData';
import { useTokens } from '@/tokens/useTokens';
import { useState } from 'react';
import bootcampHeroImage from '@/assets/bootcamp.png';
import wing1Logo from '@/assets/wing 1.jpeg';
import wing2Logo from '@/assets/wing 2.jpeg';
import wing3Logo from '@/assets/wing 3.jpeg';
import wing4Logo from '@/assets/wing 4.jpeg';

// ─── Wing Logo Map ────────────────────────────────────────────────────────────
const wingLogos: Record<number, string> = {
  0: wing1Logo,
  1: wing2Logo,
  2: wing3Logo,
  3: wing4Logo,
};

// ─── Wing Registration URLs ───────────────────────────────────────────────────
// These match exactly what BootcampWingRedirectPage uses.
// We reference the internal redirect route so the router handles the
// external navigation — keeping a single source of truth in
// BootcampWingRedirectPage.
const WING_REGISTRATION_ROUTES: Record<number, string> = {
  0: `${BOOTCAMP_BASE_PATH}/wing-1`,
  1: `${BOOTCAMP_BASE_PATH}/wing-2`,
  2: `${BOOTCAMP_BASE_PATH}/wing-3`,
  3: `${BOOTCAMP_BASE_PATH}/wing-4`,
};

// Direct external form URLs (mirrors BootcampWingRedirectPage's WING_FORM_URLS)
// Used as the href on the anchor so middle-click / open-in-new-tab works.
const WING_FORM_URLS: Record<number, string> = {
  0: 'https://forms.gle/pqVYq2gsyut8CJTf7',
  1: 'https://forms.gle/mf7WbLd3YbnL89vz5',
  2: 'https://forms.gle/cVBThKHWajzxgwkN7',
  3: 'https://forms.gle/PvEhHp86NjyPGSjT6',
};

// ─── Particle Config ──────────────────────────────────────────────────────────
const BOOTCAMP_PARTICLES = [
  { left: '5%',  top: '15%', dur: '11s', delay: '0s'   },
  { left: '12%', top: '60%', dur: '14s', delay: '2s'   },
  { left: '22%', top: '35%', dur: '9s',  delay: '1s'   },
  { left: '35%', top: '80%', dur: '12s', delay: '3s'   },
  { left: '48%', top: '20%', dur: '8s',  delay: '0.5s' },
  { left: '60%', top: '70%', dur: '13s', delay: '2.5s' },
  { left: '72%', top: '45%', dur: '10s', delay: '4s'   },
  { left: '85%', top: '25%', dur: '9s',  delay: '1.5s' },
  { left: '92%', top: '75%', dur: '11s', delay: '3.5s' },
  { left: '30%', top: '55%', dur: '10s', delay: '0.8s' },
];

// ─── Premium Background ───────────────────────────────────────────────────────
const PremiumBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.75)_100%)]" />
    <div
      className="absolute top-0 left-1/4 w-[700px] h-[700px] rounded-full hidden lg:block gpu-orb gpu-orb-pulse"
      style={{
        background: 'radial-gradient(circle, rgba(46,204,113,0.09) 0%, transparent 70%)',
        '--dur': '8s',
      } as React.CSSProperties}
    />
    <div
      className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full hidden lg:block gpu-orb gpu-orb-pulse-reverse"
      style={{
        background: 'radial-gradient(circle, rgba(39,174,96,0.07) 0%, transparent 70%)',
        '--dur': '10s',
      } as React.CSSProperties}
    />
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full hidden lg:block gpu-orb gpu-orb-pulse"
      style={{
        background: 'radial-gradient(circle, rgba(46,204,113,0.04) 0%, transparent 70%)',
        '--dur': '12s',
      } as React.CSSProperties}
    />
    <div className="hidden lg:block">
      {BOOTCAMP_PARTICLES.map((p, i) => (
        <span
          key={i}
          className="particle-dot"
          style={{
            left: p.left,
            top: p.top,
            '--dur': p.dur,
            '--delay': p.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  </div>
);

// ─── Ambient Glows ────────────────────────────────────────────────────────────
const AmbientGlows = () => (
  <>
    <div
      className="absolute -top-32 -left-32 w-[450px] h-[450px] rounded-full blur-[130px] pointer-events-none z-0"
      style={{ backgroundColor: 'rgba(46,204,113,0.12)' }}
    />
    <div
      className="absolute -bottom-32 -right-32 w-[350px] h-[350px] rounded-full blur-[110px] pointer-events-none z-0"
      style={{ backgroundColor: 'rgba(39,174,96,0.08)' }}
    />
  </>
);

// ─── Floating Badge ───────────────────────────────────────────────────────────
const FloatingBadge = () => (
  <motion.div
    initial={{ opacity: 0, y: -20, scale: 0.8 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border mb-8 relative overflow-hidden"
    style={{
      backgroundColor: 'rgba(46,204,113,0.08)',
      borderColor: 'rgba(46,204,113,0.4)',
    }}
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2ECC71]/20 to-transparent"
      animate={{ x: ['-200%', '200%'] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
    />
    <motion.div
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
    >
      <Sparkles size={15} className="text-[#2ECC71]" />
    </motion.div>
    <span className="text-sm font-bold tracking-widest uppercase text-[#2ECC71]">
      AUST Robotics Club
    </span>
    <motion.div
      animate={{ scale: [1, 1.3, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-2 h-2 rounded-full bg-[#2ECC71]"
    />
  </motion.div>
);

// ─── Hero Title ───────────────────────────────────────────────────────────────
const HeroTitle = () => (
  <motion.div
    initial={{ opacity: 0, y: 35, scale: 0.94 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
    className="bootcamp-hero-image-wrap"
  >
    <h1 className="bootcamp-visually-hidden">Robotics Bootcamp 101</h1>
    <div className="bootcamp-hero-glow" />
    <div className="bootcamp-hero-image-card">
      <div className="bootcamp-hero-shine" />
      <motion.img
        src={bootcampHeroImage}
        alt="Robotics Bootcamp 101"
        className="bootcamp-hero-image"
        draggable={false}
        initial={{ filter: 'drop-shadow(0 0 0 rgba(46,204,113,0))' }}
        animate={{
          filter: [
            'drop-shadow(0 0 16px rgba(46,204,113,0.22))',
            'drop-shadow(0 0 34px rgba(46,204,113,0.38))',
            'drop-shadow(0 0 16px rgba(46,204,113,0.22))',
          ],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="bootcamp-hero-reflection">
        <img src={bootcampHeroImage} alt="" aria-hidden="true" draggable={false} />
      </div>
    </div>
  </motion.div>
);

// ─── Stats Strip ──────────────────────────────────────────────────────────────
const statsData = [
  { icon: Layers,        label: 'Specialized Wings', value: '4',      unit: ' Wings' },
  { icon: BadgeCheck,    label: 'Registration Fee',  value: 'FREE',   unit: ''       },
  { icon: GraduationCap, label: 'Learning Style',    value: 'Hands',  unit: '-on'    },
  { icon: Users,         label: 'Expert Mentors',    value: 'AUSTRC', unit: ' R&D'   },
];

const StatsStrip = () => {
  const t = useTokens();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mt-12 sm:mt-14 max-w-4xl mx-auto w-full"
    >
      <div className="bootcamp-stats-grid">
        {statsData.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, scale: 1.03 }}
            className="relative group cursor-default"
          >
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-[#2ECC71]/30 to-[#27AE60]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            <div
              className="relative rounded-2xl border flex flex-col items-center justify-center text-center px-2 py-4 sm:px-3 sm:py-5 overflow-hidden"
              style={{
                backgroundColor: 'rgba(46,204,113,0.045)',
                borderColor: 'rgba(46,204,113,0.22)',
                minHeight: '110px',
              }}
            >
              <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-[#2ECC71]/30 rounded-tl-2xl" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-[#2ECC71]/30 rounded-br-2xl" />
              <div className="w-8 h-8 rounded-xl bg-[#2ECC71]/10 flex items-center justify-center mb-2 shrink-0">
                <stat.icon size={16} className="text-[#2ECC71]" />
              </div>
              <div className="text-base sm:text-lg font-black text-[#2ECC71] leading-none">
                {stat.value}
                <span className="text-[9px] sm:text-[10px] font-bold">{stat.unit}</span>
              </div>
              <div
                className="text-[9px] sm:text-[10px] mt-1 font-semibold leading-tight text-center px-1"
                style={{ color: t.textSecondary }}
              >
                {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ─── Program Overview ─────────────────────────────────────────────────────────
const ProgramOverview = () => {
  const t = useTokens();
  const features = [
    { icon: BookOpen, text: 'Foundational theory with real-world projects'  },
    { icon: Monitor,  text: 'Physical & online learning formats available'  },
    { icon: Users,    text: 'Mentored by experienced AUSTRC members'        },
    { icon: Trophy,   text: 'Certificate upon successful completion'         },
  ];
  return (
    <motion.div
      id="overview"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-6xl mx-auto relative"
    >
      <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-[#2ECC71]/25 via-transparent to-[#27AE60]/25 blur-sm" />
      <div
        className="relative rounded-3xl border p-8 sm:p-10 lg:p-12 overflow-hidden"
        style={{
          backgroundColor: 'rgba(4,12,8,0.85)',
          borderColor: 'rgba(46,204,113,0.22)',
        }}
      >
        <motion.div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2ECC71] to-transparent"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#2ECC71]/5 blur-3xl pointer-events-none" />
        <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 rounded-full bg-[#2ECC71]/10 flex items-center justify-center shrink-0"
              >
                <Cpu size={20} className="text-[#2ECC71]" />
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-black" style={{ color: t.textPrimary }}>
                Program Overview
              </h2>
            </div>
            <div className="h-px bg-gradient-to-r from-[#2ECC71]/40 to-transparent mb-6" />
            <p className="leading-[1.9] text-base sm:text-lg" style={{ color: t.textSecondary }}>
              Robotics Bootcamp 101 is structured into four specialized wings so participants
              can choose a track based on their interests and skill level. The program combines
              foundational theory, real-world projects, and expert mentorship from AUSTRC's R&D
              team.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {features.map((f, i) => (
              <motion.div
                key={f.text}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ x: 6 }}
                className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl border group cursor-default"
                style={{
                  backgroundColor: 'rgba(46,204,113,0.04)',
                  borderColor: 'rgba(46,204,113,0.14)',
                }}
              >
                <div className="w-9 h-9 rounded-xl bg-[#2ECC71]/10 flex items-center justify-center shrink-0 group-hover:bg-[#2ECC71]/20 transition-colors">
                  <f.icon size={17} className="text-[#2ECC71]" />
                </div>
                <span
                  className="text-sm font-medium leading-relaxed flex-1"
                  style={{ color: t.textSecondary }}
                >
                  {f.text}
                </span>
                <ChevronRight
                  size={15}
                  className="text-[#2ECC71]/30 shrink-0 group-hover:text-[#2ECC71] transition-colors"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Wing Logo Panel ──────────────────────────────────────────────────────────
const WingLogoPanel = ({
  src,
  alt,
  index,
  eyebrow,
  isHovered,
}: {
  src: string;
  alt: string;
  index: number;
  eyebrow: string;
  isHovered: boolean;
}) => (
  <div
    className="relative w-full overflow-hidden"
    style={{
      borderRadius: '20px 20px 0 0',
      background: 'linear-gradient(160deg, rgba(8,22,14,0.98) 0%, rgba(4,12,8,0.98) 100%)',
      borderBottom: isHovered
        ? '1px solid rgba(46,204,113,0.35)'
        : '1px solid rgba(46,204,113,0.12)',
      transition: 'border-color 0.3s ease',
    }}
  >
    {/* Subtle grid texture */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          'linear-gradient(rgba(46,204,113,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(46,204,113,0.03) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    />

    {/* Corner radial glow behind image */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse at 50% 60%, rgba(46,204,113,0.10) 0%, transparent 68%)',
      }}
    />

    {/* Green shimmer sweep on hover */}
    <motion.div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        background:
          'linear-gradient(105deg, transparent 35%, rgba(46,204,113,0.13) 50%, transparent 65%)',
      }}
      animate={{ x: isHovered ? ['-110%', '110%'] : '-110%' }}
      transition={{
        duration: 1.1,
        repeat: isHovered ? Infinity : 0,
        repeatDelay: 1.6,
        ease: 'easeInOut',
      }}
    />

    {/* The actual logo image */}
    <div
      className="relative flex items-center justify-center"
      style={{ padding: '22px 20px 18px' }}
    >
      <motion.img
        src={src}
        alt={alt}
        draggable={false}
        className="block w-full select-none"
        style={{
          maxHeight: '210px',
          objectFit: 'contain',
          objectPosition: 'center',
          borderRadius: '12px',
          filter: isHovered
            ? 'drop-shadow(0 0 18px rgba(46,204,113,0.35)) drop-shadow(0 4px 14px rgba(0,0,0,0.7))'
            : 'drop-shadow(0 0 6px rgba(46,204,113,0.15)) drop-shadow(0 4px 12px rgba(0,0,0,0.6))',
          transition: 'filter 0.45s ease',
        }}
        animate={{ scale: isHovered ? 1.04 : 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>

    {/* Wing-number badge — bottom-left */}
    <div className="absolute bottom-3 left-3 z-20">
      <motion.span
        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black"
        style={{
          background: 'linear-gradient(135deg,#2ECC71,#27AE60)',
          color: '#000',
          boxShadow: '0 2px 10px rgba(46,204,113,0.5)',
        }}
        animate={{ scale: isHovered ? 1.15 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {index + 1}
      </motion.span>
    </div>

    {/* Eyebrow pill — bottom-right */}
    <div className="absolute bottom-3 right-3 z-20">
      <motion.span
        className="inline-flex items-center gap-1 text-[9px] font-black tracking-[0.1em] uppercase px-2.5 py-1 rounded-full"
        style={{
          backgroundColor: 'rgba(6,15,10,0.82)',
          color: '#2ECC71',
          border: '1px solid rgba(46,204,113,0.32)',
          backdropFilter: 'blur(8px)',
        }}
        animate={{ opacity: isHovered ? 1 : 0.72 }}
      >
        <Zap size={8} />
        {eyebrow}
      </motion.span>
    </div>
  </div>
);

// ─── Wing Card ────────────────────────────────────────────────────────────────
const WingCard = ({ wing, index }: { wing: typeof bootcampWings[0]; index: number }) => {
  const t = useTokens();
  const [isHovered, setIsHovered] = useState(false);
  const logoSrc = wingLogos[index];

  // The direct external Google Form URL for this wing
  const formUrl = WING_FORM_URLS[index];

  // The internal redirect route (e.g. /bootcamp/wing-1) — used for
  // same-tab navigation so the router's replace() handles the external jump
  const registrationRoute = WING_REGISTRATION_ROUTES[index];

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-col"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute -inset-[1.5px] rounded-3xl blur-[3px] pointer-events-none"
        style={{ background: 'linear-gradient(135deg, #2ECC71, #3DED97, #27AE60)' }}
        animate={{ opacity: isHovered ? 0.45 : 0.12 }}
        transition={{ duration: 0.4 }}
      />

      {/* Card shell */}
      <motion.div
        animate={{ y: isHovered ? -6 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col flex-1 rounded-3xl border overflow-hidden h-full"
        style={{
          backgroundColor: 'rgba(6,15,10,0.94)',
          borderColor: isHovered ? 'rgba(46,204,113,0.45)' : 'rgba(46,204,113,0.2)',
          backdropFilter: 'blur(24px)',
          transition: 'border-color 0.3s ease',
          boxShadow: isHovered
            ? '0 8px 40px rgba(46,204,113,0.22), inset 0 0 30px rgba(46,204,113,0.05)'
            : '0 2px 20px rgba(0,0,0,0.4)',
        }}
      >
        {/* Top gradient bar */}
        <div className="h-[3px] w-full shrink-0 bg-gradient-to-r from-[#2ECC71] via-[#3DED97] to-[#27AE60] relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            animate={{ x: isHovered ? ['-200%', '200%'] : '-200%' }}
            transition={{
              duration: 1,
              repeat: isHovered ? Infinity : 0,
              repeatDelay: 1.5,
            }}
          />
        </div>

        {/* Logo Panel */}
        <WingLogoPanel
          src={logoSrc}
          alt={`${wing.title} wing logo`}
          index={index}
          eyebrow={wing.eyebrow}
          isHovered={isHovered}
        />

        {/* Corner accent */}
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-[1.5px] border-r-[1.5px] border-[#2ECC71]/30 rounded-br-2xl pointer-events-none" />

        {/* BG orb */}
        <div className="absolute -right-16 bottom-0 w-44 h-44 rounded-full bg-[#2ECC71]/5 blur-3xl pointer-events-none" />

        {/* Watermark */}
        <div
          className="absolute bottom-6 right-6 text-9xl font-black select-none pointer-events-none leading-none z-0"
          style={{ color: 'rgba(46,204,113,0.035)' }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* ── Content body ── */}
        <div className="relative z-10 flex flex-col flex-1 px-6 pt-5 pb-6 lg:px-7 lg:pb-7">

          {/* Title */}
          <motion.h3
            className="text-xl lg:text-[22px] font-black leading-snug mb-2.5"
            animate={{ color: isHovered ? '#2ECC71' : t.textPrimary }}
            transition={{ duration: 0.3 }}
          >
            {wing.title}
          </motion.h3>

          {/* Accent rule */}
          <motion.div
            className="h-px mb-4"
            style={{
              background: 'linear-gradient(90deg, rgba(46,204,113,0.5), transparent)',
            }}
            animate={{ scaleX: isHovered ? 1 : 0.35, originX: 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* Description */}
          <p
            className="text-[13px] leading-[1.8] mb-5"
            style={{ color: t.textSecondary }}
          >
            {wing.summary}
          </p>

          {/* ── Info squares ── */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {/* Duration */}
            <div
              className="rounded-xl border p-2.5 flex flex-col gap-1"
              style={{
                borderColor: 'rgba(46,204,113,0.14)',
                backgroundColor: 'rgba(46,204,113,0.04)',
              }}
            >
              <div className="flex items-center gap-1">
                <Clock size={9} className="text-[#2ECC71]/50 shrink-0" />
                <span
                  className="text-[9px] font-semibold leading-tight"
                  style={{ color: t.textSecondary }}
                >
                  Duration
                </span>
              </div>
              <div
                className="text-[11px] font-bold leading-tight"
                style={{ color: t.textPrimary }}
              >
                {wing.timeline}
              </div>
            </div>

            {/* Classes */}
            <div
              className="rounded-xl border p-2.5 flex flex-col gap-1"
              style={{
                borderColor: 'rgba(46,204,113,0.14)',
                backgroundColor: 'rgba(46,204,113,0.04)',
              }}
            >
              <div className="flex items-center gap-1">
                <BookOpen size={9} className="text-[#2ECC71]/50 shrink-0" />
                <span
                  className="text-[9px] font-semibold leading-tight"
                  style={{ color: t.textSecondary }}
                >
                  Classes
                </span>
              </div>
              <div
                className="text-[11px] font-bold leading-tight"
                style={{ color: t.textPrimary }}
              >
                {wing.classCount}
              </div>
            </div>

            {/* Fee */}
            <div
              className="rounded-xl border p-2.5 flex flex-col gap-1"
              style={{
                borderColor: 'rgba(46,204,113,0.18)',
                backgroundColor: 'rgba(46,204,113,0.06)',
              }}
            >
              <div className="flex items-center gap-1">
                <BadgeCheck size={9} className="text-[#2ECC71]/60 shrink-0" />
                <span
                  className="text-[9px] font-semibold leading-tight"
                  style={{ color: t.textSecondary }}
                >
                  Fee
                </span>
              </div>
              <div className="text-[11px] font-black leading-tight text-[#2ECC71]">
                {wing.fee}
              </div>
            </div>
          </div>

          {/* ── Highlights ── */}
          <ul className="flex flex-col gap-2 mb-5 flex-1">
            {wing.highlights.slice(0, 3).map((point, pi) => (
              <motion.li
                key={point}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 + pi * 0.05 }}
                className="flex items-start gap-2 text-[13px] leading-[1.7]"
                style={{ color: t.textSecondary }}
              >
                <motion.span
                  className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[#2ECC71] shrink-0"
                  animate={{ scale: isHovered ? [1, 1.6, 1] : 1 }}
                  transition={{ duration: 0.5, delay: pi * 0.1 }}
                />
                <span>{point}</span>
              </motion.li>
            ))}
          </ul>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#2ECC71]/20 to-transparent mb-4" />

          {/* ── Buttons ── */}
          <div className="flex flex-col gap-2.5 mt-auto">

            {/* View Details — internal SPA route */}
            <Link to={`${BOOTCAMP_BASE_PATH}/${wing.slug}`} className="block w-full">
              <motion.span
                className="inline-flex w-full items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-black font-bold text-sm relative overflow-hidden"
                whileHover={{ scale: 1.02, boxShadow: '0 0 28px rgba(46,204,113,0.45)' }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                  initial={{ x: '-150%' }}
                  whileHover={{ x: '150%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative">View Details</span>
                <motion.span
                  className="relative"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ArrowRight size={15} />
                </motion.span>
              </motion.span>
            </Link>

            {/*
             * Register Now — opens the Google Form directly in a new tab.
             *
             * • href  → direct Google Form URL (works for middle-click,
             *           copy-link, open-in-new-tab, etc.)
             * • The internal redirect route is NOT used here because
             *   window.location.replace() inside BootcampWingRedirectPage
             *   would replace the current history entry; opening the form
             *   directly in a new tab is the cleanest UX.
             */}
            <a
              href={formUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="block w-full"
              aria-label={`Register for ${wing.title}`}
            >
              <motion.span
                className="inline-flex w-full items-center justify-center gap-2 py-3 rounded-2xl border font-bold text-sm"
                style={{
                  borderColor: 'rgba(46,204,113,0.28)',
                  color: t.textPrimary,
                  backgroundColor: 'rgba(46,204,113,0.05)',
                }}
                whileHover={{
                  scale: 1.02,
                  borderColor: '#2ECC71',
                  boxShadow: '0 0 22px rgba(46,204,113,0.2)',
                }}
                whileTap={{ scale: 0.97 }}
              >
                Register Now
                <ExternalLink size={14} />
              </motion.span>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
};

// ─── Wings Section Header ─────────────────────────────────────────────────────
const WingsSectionHeader = () => {
  const t = useTokens();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="text-center mb-14 sm:mb-16"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
        style={{
          backgroundColor: 'rgba(46,204,113,0.06)',
          borderColor: 'rgba(46,204,113,0.25)',
          color: '#2ECC71',
        }}
      >
        <Star size={12} className="fill-[#2ECC71]" />
        <span className="text-xs font-bold tracking-widest uppercase">Choose Your Path</span>
        <Star size={12} className="fill-[#2ECC71]" />
      </motion.div>

      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-5">
        <span style={{ color: t.textPrimary }}>Select Your </span>
        <span className="relative inline-block">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ECC71] via-[#3DED97] to-[#27AE60]">
            Wing
          </span>
          <motion.svg
            className="absolute -bottom-2 left-0 w-full"
            viewBox="0 0 120 10"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.path
              d="M2 6C30 2 90 2 118 6"
              stroke="url(#wings-underline)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
            <defs>
              <linearGradient id="wings-underline" x1="0" y1="0" x2="120" y2="0">
                <stop stopColor="#2ECC71" />
                <stop offset="1" stopColor="#27AE60" />
              </linearGradient>
            </defs>
          </motion.svg>
        </span>
      </h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="max-w-2xl mx-auto text-base sm:text-lg leading-[1.8]"
        style={{ color: t.textSecondary }}
      >
        Four specialized tracks designed for all skill levels — from absolute beginners to
        advanced builders.
      </motion.p>
    </motion.div>
  );
};

// ─── Scroll Progress ──────────────────────────────────────────────────────────
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#2ECC71] via-[#3DED97] to-[#27AE60] origin-left z-[99999]"
      style={{ scaleX }}
    />
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export function BootcampPage() {
  const t = useTokens();

  return (
    <>
      <ScrollProgress />

      <style>{`
        /* ── Hero ── */
        .bootcamp-hero-image-wrap {
          position: relative; width: 100%; max-width: 780px;
          margin: 0 auto 28px;
          display: flex; justify-content: center; align-items: center;
        }
        .bootcamp-hero-glow {
          position: absolute; inset: 8%; border-radius: 999px;
          background:
            radial-gradient(circle, rgba(46,204,113,0.28) 0%, transparent 62%),
            radial-gradient(circle, rgba(61,237,151,0.12) 0%, transparent 72%);
          filter: blur(34px); opacity: 0.9; pointer-events: none;
        }
        .bootcamp-hero-image-card {
          position: relative; width: 100%;
          padding: 18px 20px; border-radius: 34px;
          border: 1px solid rgba(46,204,113,0.22);
          background: linear-gradient(135deg,rgba(46,204,113,0.08),rgba(46,204,113,0.02)), rgba(4,12,8,0.36);
          box-shadow: 0 0 60px rgba(46,204,113,0.14), inset 0 0 28px rgba(46,204,113,0.045);
          overflow: hidden; backdrop-filter: blur(18px);
        }
        .bootcamp-hero-image-card::before {
          content: ''; position: absolute; inset: 0;
          border-radius: inherit; padding: 1px;
          background: linear-gradient(120deg, transparent, rgba(46,204,113,0.55), transparent);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
        }
        .bootcamp-hero-shine {
          position: absolute; top: 0; left: -80%; width: 45%; height: 100%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,0.12), transparent);
          transform: skewX(-18deg);
          animation: bootcampHeroShine 4.5s ease-in-out infinite; pointer-events: none;
        }
        .bootcamp-hero-image {
          position: relative; z-index: 2; display: block;
          width: 100%; max-width: 720px; height: auto;
          margin: 0 auto; object-fit: contain; user-select: none;
        }
        .bootcamp-hero-reflection {
          position: absolute; left: 50%; bottom: -32%; width: 72%;
          transform: translateX(-50%) scaleY(-1);
          opacity: 0.09; filter: blur(2px); pointer-events: none;
          mask-image: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent 70%);
          -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent 70%);
        }
        .bootcamp-hero-reflection img { width: 100%; height: auto; display: block; }
        .bootcamp-visually-hidden {
          position: absolute; width: 1px; height: 1px; padding: 0;
          margin: -1px; overflow: hidden; clip-path: inset(50%);
          white-space: nowrap; border: 0;
        }
        @keyframes bootcampHeroShine { 0%{left:-80%} 45%{left:130%} 100%{left:130%} }

        /* ── Stats ── */
        .bootcamp-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px; width: 100%;
        }

        /* ── Wings grid: always 2 columns on md+, 1 on mobile ── */
        .bootcamp-wings-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 28px; width: 100%;
          align-items: start;
        }
        .bootcamp-wings-grid > article { min-width: 0; }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .bootcamp-hero-image-wrap  { max-width: 92vw; margin-bottom: 22px; }
          .bootcamp-hero-image-card  { padding: 12px 14px; border-radius: 24px; }
          .bootcamp-hero-reflection  { display: none; }
        }
        @media (max-width: 640px) {
          .bootcamp-stats-grid { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
          .bootcamp-wings-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <main
        className="relative min-h-screen overflow-x-hidden"
        style={{ backgroundColor: t.pageBg, color: t.textPrimary }}
      >
        <PremiumBackground />
        <AmbientGlows />

        {/* ══════════ HERO ══════════ */}
        <section className="relative z-10 pt-32 pb-20 sm:pt-36 sm:pb-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-5xl mx-auto">
              <FloatingBadge />
              <HeroTitle />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55 }}
                className="text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-10"
                style={{ color: t.textSecondary }}
              >
                A hands-on, multi-track learning program designed to ignite innovation and empower
                future engineers through robotics, hardware, CAD, and software development.
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <a href="#wings">
                  <motion.span
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-black font-bold text-base relative overflow-hidden"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(46,204,113,0.5)' }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12"
                      initial={{ x: '-150%' }}
                      whileHover={{ x: '150%' }}
                      transition={{ duration: 0.7 }}
                    />
                    <span className="relative">Explore Wings</span>
                    <motion.span
                      className="relative"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.3, repeat: Infinity }}
                    >
                      <ArrowRight size={18} />
                    </motion.span>
                  </motion.span>
                </a>

                <a href="#overview">
                  <motion.span
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl border font-bold text-base"
                    style={{
                      borderColor: 'rgba(46,204,113,0.3)',
                      color: t.textPrimary,
                      backgroundColor: 'rgba(46,204,113,0.05)',
                    }}
                    whileHover={{
                      scale: 1.05,
                      borderColor: '#2ECC71',
                      boxShadow: '0 0 25px rgba(46,204,113,0.2)',
                    }}
                    whileTap={{ scale: 0.96 }}
                  >
                    Program Overview
                    <CalendarDays size={18} />
                  </motion.span>
                </a>
              </motion.div>

              <StatsStrip />
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="relative z-10 px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-[#2ECC71]/20 to-transparent" />
        </div>

        {/* ══════════ OVERVIEW ══════════ */}
        <section className="relative z-10 py-20 sm:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ProgramOverview />
          </div>
        </section>

        {/* ══════════ WINGS ══════════ */}
        <section id="wings" className="relative z-10 pb-24 sm:pb-32">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,204,113,0.025)_0%,transparent_70%)]" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <WingsSectionHeader />

            <div className="bootcamp-wings-grid max-w-[1100px] mx-auto">
              {bootcampWings.map((wing, index) => (
                <WingCard key={wing.slug} wing={wing} index={index} />
              ))}
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-16 sm:mt-20"
            >
              <p className="text-sm mb-5" style={{ color: t.textSecondary }}>
                All wings are{' '}
                <span className="text-[#2ECC71] font-bold">100% free</span> to join.
                Limited seats available.
              </p>
              <motion.div
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border text-sm font-semibold"
                style={{
                  borderColor: 'rgba(46,204,113,0.2)',
                  color: t.textSecondary,
                  backgroundColor: 'rgba(46,204,113,0.04)',
                }}
                animate={{
                  borderColor: [
                    'rgba(46,204,113,0.2)',
                    'rgba(46,204,113,0.5)',
                    'rgba(46,204,113,0.2)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.span
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-[#2ECC71] inline-block shrink-0"
                />
                Registrations Open — Apply Today
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />
      </main>
    </>
  );
}