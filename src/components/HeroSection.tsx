import { motion } from "motion/react";
import { useTokens } from "@/tokens/useTokens";

/* ─────────────────────────────────────────────────────────────────────────────
   Circuit board hero — full-screen PCB traces across the background.
   Only 2 animated current pulses (one left cluster, one right cluster).
   All animations: CSS stroke-dashoffset only — compositor thread.
   ───────────────────────────────────────────────────────────────────────────── */

/* Mobile/tablet — corner PCB traces in all 4 corners */
function MobileCircuit({ g }: { g: string }) {
  return (
    <div className="hs-mobile-circuit absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <svg className="w-full h-full" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice" fill="none">
        <defs>
          <filter id="pcb-glow-m" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* ── TOP-LEFT ── */}
        <g stroke={g} strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.18">
          <path d="M0,60 H40 V30 H90 V60 H130 V30" />
          <path d="M0,100 H30 V130 H70 V100 H110 V130 H150" />
          <path d="M30,130 V160 H0" />
          <path d="M70,130 V170 H110 V150 H150" />
        </g>
        <g fill={g} opacity="0.25">
          {[[40,30],[90,30],[40,60],[90,60],[130,30],[30,100],[70,100],[110,100],[30,130],[70,130],[110,150]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="2.5"/>)}
        </g>
        <path d="M0,60 H40 V30 H90 V60 H130 V30 M150,100 H110 V130 H70 V100 H30 V130 H0"
          stroke={g} strokeWidth="1.5" fill="none" strokeLinecap="round"
          filter="url(#pcb-glow-m)" className="hs-pulse-m-a" />

        {/* ── TOP-RIGHT ── */}
        <g stroke={g} strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.18">
          <path d="M400,60 H360 V30 H310 V60 H270 V30" />
          <path d="M400,100 H370 V130 H330 V100 H290 V130 H250" />
          <path d="M370,130 V160 H400" />
          <path d="M330,130 V170 H290 V150 H250" />
        </g>
        <g fill={g} opacity="0.25">
          {[[360,30],[310,30],[360,60],[310,60],[270,30],[370,100],[330,100],[290,100],[370,130],[330,130],[290,150]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="2.5"/>)}
        </g>
        <path d="M400,60 H360 V30 H310 V60 H270 V30 M250,100 H290 V130 H330 V100 H370 V130 H400"
          stroke={g} strokeWidth="1.5" fill="none" strokeLinecap="round"
          filter="url(#pcb-glow-m)" className="hs-pulse-m-b" />

        {/* ── BOTTOM-LEFT ── */}
        <g stroke={g} strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.18">
          <path d="M0,600 H40 V630 H90 V600 H130 V630" />
          <path d="M0,560 H30 V530 H70 V560 H110 V530 H150" />
          <path d="M30,530 V510 H0" />
          <path d="M70,530 V500 H110 V520 H150" />
        </g>
        <g fill={g} opacity="0.25">
          {[[40,630],[90,630],[40,600],[90,600],[130,630],[30,560],[70,560],[110,560],[30,530],[70,530],[110,520]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="2.5"/>)}
        </g>
        <path d="M0,600 H40 V630 H90 V600 H130 V630 M150,560 H110 V530 H70 V560 H30 V530 H0"
          stroke={g} strokeWidth="1.5" fill="none" strokeLinecap="round"
          filter="url(#pcb-glow-m)" className="hs-pulse-m-a" />

        {/* ── BOTTOM-RIGHT ── */}
        <g stroke={g} strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.18">
          <path d="M400,600 H360 V630 H310 V600 H270 V630" />
          <path d="M400,560 H370 V530 H330 V560 H290 V530 H250" />
          <path d="M370,530 V510 H400" />
          <path d="M330,530 V500 H290 V520 H250" />
        </g>
        <g fill={g} opacity="0.25">
          {[[360,630],[310,630],[360,600],[310,600],[270,630],[370,560],[330,560],[290,560],[370,530],[330,530],[290,520]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="2.5"/>)}
        </g>
        <path d="M400,600 H360 V630 H310 V600 H270 V630 M250,560 H290 V530 H330 V560 H370 V530 H400"
          stroke={g} strokeWidth="1.5" fill="none" strokeLinecap="round"
          filter="url(#pcb-glow-m)" className="hs-pulse-m-b" />
      </svg>
    </div>
  );
}

function CircuitBoard({ g }: { g: string }) {
  return (
    <div className="hs-boards absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <svg className="w-full h-full" viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">

        <defs>
          <filter id="pcb-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* ══════════════════════════════════════════════════════
            LEFT PCB BOARD  — anchored bottom-left
            ══════════════════════════════════════════════════════ */}
        <g transform="translate(20, 120)">
          {/* Board outline */}
          <rect x="0" y="0" width="220" height="420" rx="6"
            stroke={g} strokeWidth="1" fill="none" opacity="0.18" />
          {/* Mounting holes */}
          <circle cx="12"  cy="12"  r="5" stroke={g} strokeWidth="1" fill="none" opacity="0.18" />
          <circle cx="208" cy="12"  r="5" stroke={g} strokeWidth="1" fill="none" opacity="0.18" />
          <circle cx="12"  cy="408" r="5" stroke={g} strokeWidth="1" fill="none" opacity="0.18" />
          <circle cx="208" cy="408" r="5" stroke={g} strokeWidth="1" fill="none" opacity="0.18" />

          {/* Static traces */}
          <g stroke={g} strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.15">
            <path d="M30,40 H80 V80 H140 V40 H190" />
            <path d="M30,100 H60 V140 H110 V100 H160 V140 H190" />
            <path d="M30,180 H70 V220 H30" />
            <path d="M70,220 H130 V260 H80 V300 H150 V260" />
            <path d="M150,220 H190 V260 H150" />
            <path d="M30,320 H90 V360 H50 V380 H190" />
            <path d="M130,300 H190 V340 H130 V380" />
            <path d="M80,40  V20  H160 V40" />
            <path d="M110,380 V400 H80  V380" />
          </g>

          {/* Junction pads */}
          <g fill={g} opacity="0.22">
            {[[80,40],[140,40],[190,40],[60,100],[110,100],[160,100],
              [60,140],[110,140],[190,140],[70,220],[130,260],[150,260],
              [80,300],[150,300],[90,360],[190,380],[130,380],
              [80,20],[160,20],[110,400],[80,400],
            ].map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r="3" />)}
          </g>

          {/* IC chip — centre */}
          <g stroke={g} strokeWidth="1" fill="none" opacity="0.2">
            <rect x="70" y="155" width="80" height="50" rx="4" />
            {[165,178,191].map(y=><line key={y} x1="70" y1={y} x2="55" y2={y}/>)}
            {[165,178,191].map(y=><line key={y+'r'} x1="150" y1={y} x2="165" y2={y}/>)}
            <line x1="90" y1="155" x2="90" y2="140"/>
            <line x1="110" y1="155" x2="110" y2="140"/>
            <line x1="130" y1="155" x2="130" y2="140"/>
            <line x1="90" y1="205" x2="90" y2="220"/>
            <line x1="110" y1="205" x2="110" y2="220"/>
            <text x="88" y="183" fontSize="8" fill={g} stroke="none" opacity="0.5" fontFamily="monospace">MCU</text>
          </g>

          {/* Small resistor */}
          <g stroke={g} strokeWidth="1" fill="none" opacity="0.18">
            <rect x="95" y="95" width="30" height="12" rx="2"/>
            <line x1="85" y1="101" x2="95" y2="101"/>
            <line x1="125" y1="101" x2="135" y2="101"/>
          </g>

          {/* Capacitor */}
          <g stroke={g} strokeWidth="1" fill="none" opacity="0.18">
            <rect x="60" y="315" width="18" height="26" rx="2"/>
            <line x1="69" y1="315" x2="69" y2="300"/>
            <line x1="69" y1="341" x2="69" y2="360"/>
          </g>

          {/* Animated pulse path — travels through traces */}
          <path d="M30,40 H80 V80 H140 V40 H190 M190,100 H160 V140 H110 V100 H60 V140 H30 M30,180 H70 V220 H130 V260 H80 V300 H150 V340 H90 V380 H190"
            stroke={g} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
            filter="url(#pcb-glow)" className="hs-pulse-a" />
        </g>

        {/* ══════════════════════════════════════════════════════
            RIGHT PCB BOARD — anchored bottom-right, mirrored
            ══════════════════════════════════════════════════════ */}
        <g transform="translate(960, 120)">
          {/* Board outline */}
          <rect x="0" y="0" width="220" height="420" rx="6"
            stroke={g} strokeWidth="1" fill="none" opacity="0.18" />
          {/* Mounting holes */}
          <circle cx="12"  cy="12"  r="5" stroke={g} strokeWidth="1" fill="none" opacity="0.18" />
          <circle cx="208" cy="12"  r="5" stroke={g} strokeWidth="1" fill="none" opacity="0.18" />
          <circle cx="12"  cy="408" r="5" stroke={g} strokeWidth="1" fill="none" opacity="0.18" />
          <circle cx="208" cy="408" r="5" stroke={g} strokeWidth="1" fill="none" opacity="0.18" />

          {/* Static traces — mirrored layout */}
          <g stroke={g} strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.15">
            <path d="M30,40 H80 V80 H140 V40 H190" />
            <path d="M190,100 H160 V140 H110 V100 H60 V140 H30" />
            <path d="M190,180 H150 V220 H190" />
            <path d="M150,220 H90 V260 H140 V300 H70 V260" />
            <path d="M70,220 H30 V260 H70" />
            <path d="M190,320 H130 V360 H170 V380 H30" />
            <path d="M90,300 H30 V340 H90 V380" />
            <path d="M80,40 V20 H160 V40" />
            <path d="M110,380 V400 H140 V380" />
          </g>

          {/* Junction pads */}
          <g fill={g} opacity="0.22">
            {[[80,40],[140,40],[30,40],[160,100],[110,100],[60,100],
              [160,140],[110,140],[30,140],[150,220],[90,260],[70,260],
              [140,300],[70,300],[130,360],[30,380],[90,380],
              [80,20],[160,20],[110,400],[140,400],
            ].map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r="3" />)}
          </g>

          {/* IC chip */}
          <g stroke={g} strokeWidth="1" fill="none" opacity="0.2">
            <rect x="70" y="155" width="80" height="50" rx="4" />
            {[165,178,191].map(y=><line key={y} x1="70" y1={y} x2="55" y2={y}/>)}
            {[165,178,191].map(y=><line key={y+'r'} x1="150" y1={y} x2="165" y2={y}/>)}
            <line x1="90" y1="155" x2="90" y2="140"/>
            <line x1="110" y1="155" x2="110" y2="140"/>
            <line x1="130" y1="155" x2="130" y2="140"/>
            <line x1="90" y1="205" x2="90" y2="220"/>
            <line x1="110" y1="205" x2="110" y2="220"/>
            <text x="88" y="183" fontSize="8" fill={g} stroke="none" opacity="0.5" fontFamily="monospace">ESC</text>
          </g>

          {/* Small resistor */}
          <g stroke={g} strokeWidth="1" fill="none" opacity="0.18">
            <rect x="95" y="95" width="30" height="12" rx="2"/>
            <line x1="85" y1="101" x2="95" y2="101"/>
            <line x1="125" y1="101" x2="135" y2="101"/>
          </g>

          {/* Capacitor */}
          <g stroke={g} strokeWidth="1" fill="none" opacity="0.18">
            <rect x="142" y="315" width="18" height="26" rx="2"/>
            <line x1="151" y1="315" x2="151" y2="300"/>
            <line x1="151" y1="341" x2="151" y2="360"/>
          </g>

          {/* Animated pulse — right board */}
          <path d="M190,40 H140 V80 H80 V40 H30 M30,100 H60 V140 H110 V100 H160 V140 H190 M190,180 H150 V220 H90 V260 H140 V300 H70 V340 H130 V380 H30"
            stroke={g} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
            filter="url(#pcb-glow)" className="hs-pulse-b" /></g>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN
   ───────────────────────────────────────────────────────────────────────────── */
export function HeroSection() {
  const t = useTokens();
  const G = t.brandGreen;

  return (
    <>
      <style>{`
        /* ── 1 pulse dot per board ── */
        .hs-pulse-a, .hs-pulse-b {
          stroke-dasharray: 28 9999;
          will-change: stroke-dashoffset;
        }
        @keyframes hpa { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -1600; } }
        @keyframes hpb { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -1300; } }

        .hs-pulse-a { animation: hpa 18s linear infinite;     }
        .hs-pulse-b { animation: hpb 18s linear infinite 6s;  }

        /* Mobile circuit — shown below 1024px */
        .hs-mobile-circuit { display: block; }
        @media (min-width: 1024px) { .hs-mobile-circuit { display: none; } }

        @keyframes hpma { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -560; } }
        @keyframes hpmb { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -560; } }
        .hs-pulse-m-a { stroke-dasharray: 20 9999; will-change: stroke-dashoffset; animation: hpma 12s linear infinite; }
        .hs-pulse-m-b { stroke-dasharray: 20 9999; will-change: stroke-dashoffset; animation: hpmb 12s linear infinite 6s; }

        /* Hide full boards on small screens */
        .hs-boards { display: none; }
        @media (min-width: 1024px) { .hs-boards { display: block; } }

        /* Title glow */
        @keyframes hs-glow {
          0%,100% { text-shadow: 0 0 60px rgba(46,204,113,0.25); }
          50%      { text-shadow: 0 0 110px rgba(46,204,113,0.5), 0 0 180px rgba(61,237,151,0.15); }
        }
        .hs-title { animation: hs-glow 4s ease-in-out infinite; }

        /* Kill desktop board animations on mobile */
        @media (max-width: 1023px) {
          .hs-pulse-a, .hs-pulse-b { animation: none !important; }
        }
      `}</style>

      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden w-full"
        style={{ backgroundColor: t.pageBg }}
      >
        {/* Soft centre radial glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 55% 45% at 50% 50%, ${G}18 0%, transparent 70%)` }} />

        {/* Circuit board — desktop */}
        <CircuitBoard g={G} />
        {/* Circuit corners — mobile / tablet */}
        <MobileCircuit g={G} />

        {/* Main content */}
        <div className="container mx-auto px-4 py-28 sm:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12 }}
              className="space-y-3"
            >
              <p className="text-xl sm:text-2xl md:text-3xl font-medium"
                style={{ color: t.textSecondary }}>
                Welcome to
              </p>
              <h1
                className="hs-title text-5xl sm:text-6xl md:text-7xl lg:text-[84px] font-bold tracking-tight leading-[1.05] pb-2"
                style={{
                  backgroundImage: `linear-gradient(to right, ${t.brandGreen}, ${t.brandGreenMid}, ${t.brandGreenDark})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Aust Robotics Club
              </h1>
            </motion.div>

            {/* Underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.75, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-44 h-[3px] rounded-full mx-auto"
              style={{ background: `linear-gradient(to right, ${t.brandGreen}, ${t.brandGreenMid}, ${t.brandGreenDark})` }}
            />

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.42 }}
              className="text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed"
              style={{ color: t.textSecondary }}
            >
              Join a community of innovators mastering quadcopters, AI, and next-gen robotics.
              From research to real machines — we build the future.
            </motion.p>

          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, transparent, ${t.pageBg})` }} />
      </section>
    </>
  );
}
