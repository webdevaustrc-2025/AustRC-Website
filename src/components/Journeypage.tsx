import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useInView, useSpring } from "motion/react";

// â”€â”€ FONT LOADER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function useFonts() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap";
    document.head.appendChild(link);
  }, []);
}

// â”€â”€ DATA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const milestones = [
  {
    id: "origin",
    period: "March 2024",
    tag: "The Beginning",
    side: "right",
    title: "Rakib Takes the Initiative",
    description:
      "Rakib became the pioneer of AUST Robotics Club's digital presence. He independently took the initiative to build the club's very first website from scratch â€” designing the main backbone architecture and creating several key pages. This was a landmark breakthrough: for the first time, the club had a digital home.",
    achievement: "First ever website for AUST Robotics Club",
    people: [
      {
        name: "Rakib",
        role: "Founder & Initiator",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/rakib.jpg",
      },
    ],
    icon: "ðŸŒ±",
  },
  {
    id: "launch",
    period: "October 2024",
    tag: "Official Launch",
    side: "left",
    title: "First Official Website Launched",
    description:
      "The first official Google Sites website of AUST Robotics Club was launched â€” a huge milestone. The club now had a verified, publicly accessible digital identity that members and the world could visit.",
    achievement: "Google Sites website goes live",
    people: [],
    icon: "ðŸš€",
  },
  {
    id: "panel1",
    period: "Panel 01",
    tag: "Team Founded",
    side: "right",
    title: "Birth of the Website Team",
    description:
      "For the first time in AUST Robotics Club history, a dedicated Website Team was officially formed. Showmik Majumder was appointed as the inaugural Director and Ahnaf Amer joined as Assistant Director. Together they refined and improved the Google Sites website, transforming it into a true identity and digital face of the club.",
    achievement: "Official Website Team established â€” Google Site elevated to club identity",
    people: [
      {
        name: "Showmik Majumder",
        role: "Director",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/showmik.jpg",
      },
      {
        name: "Ahnaf Amer",
        role: "Assistant Director",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/Ahnaf%20Amer.jpg?updatedAt=1769118153474",
      },
    ],
    icon: "ðŸ‘¥",
  },
  {
    id: "panel2",
    period: "Panel 02",
    tag: "Full Stack Vision",
    side: "left",
    title: "The Leap to Full Stack",
    description:
      "Ahnaf Amer stepped up as Director with Saobia Tinni joining as Assistant Director. This panel marked a visionary turning point â€” the team dared to dream beyond Google Sites. For the first time, the club decided to build a fully-fledged Full Stack website and a dedicated mobile application. Development began in earnest on both fronts.",
    achievement: "Full Stack website & Mobile App development begins",
    people: [
      {
        name: "Ahnaf Amer",
        role: "Director",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/Ahnaf%20Amer.jpg?updatedAt=1769118153474",
      },
      {
        name: "Saobia Tinni",
        role: "Assistant Director",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/Saobia%20Islam%20-%20Saobia%20Islam%20(Tinni).png?updatedAt=1769118154021",
      },
    ],
    icon: "ðŸ’»",
  },
  {
    id: "panel3",
    period: "Current Panel",
    tag: "Mission Accomplished",
    side: "right",
    title: "Full Stack Website & Mobile App Completed",
    description:
      "Saobia Tinni ascended to Director with Shajedul Kabir Rafi and Arany Hasan as Assistant Directors. This panel delivered what was once only a vision â€” Shajedul Kabir Rafi single-handedly built the complete mobile application, and the full-stack website was brought to completion. The club now has a world-class digital ecosystem.",
    achievement: "Full Stack Website âœ¦ Mobile App â€” both completed",
    people: [
      {
        name: "Saobia Tinni",
        role: "Director",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/Saobia%20Islam%20-%20Saobia%20Islam%20(Tinni).png?updatedAt=1769118154021",
      },
      {
        name: "Shajedul Kabir Rafi",
        role: "Assistant Director",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/Shajedul%20Kabir%20Rafi.jpg?updatedAt=1769118153733",
      },
      {
        name: "Arany Hasan",
        role: "Assistant Director",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/Arany%20-%20Arany%20Hasan.jpeg?updatedAt=1769118153821",
      },
    ],
    icon: "ðŸ†",
  },
];

// â”€â”€ ANIMATED BACKGROUND â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
    </div>
  );
}

// â”€â”€ SCROLL PROGRESS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#2ECC71] to-[#27AE60] origin-left z-50"
    />
  );
}

// â”€â”€ AVATAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Avatar({ person, delay = 0, isInView }: { person: { name: string; role: string; img: string }; delay?: number; isInView: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 10 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, type: "spring", stiffness: 180 }}
      className="flex flex-col items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative">
        <motion.div
          animate={{ opacity: hovered ? 1 : 0.45 }}
          className="absolute -inset-[3px] rounded-full bg-gradient-to-br from-[#2ECC71] to-[#27AE60]"
        />
        <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-black bg-[#0a0a0a]">
          <img
            src={person.img}
            alt={person.name}
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const parent = e.currentTarget.parentNode as HTMLElement | null;
              if (parent) parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-2xl">ðŸ‘¤</div>`;
            }}
          />
        </div>
        <motion.div
          animate={{ scale: [1, 1.6], opacity: [0.3, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-full border border-[#2ECC71]/35"
        />
      </div>
      <div className="mt-2 text-center max-w-[80px]">
        <p className="text-white text-[11px] font-semibold leading-tight" style={{ fontFamily: "'Sora',sans-serif" }}>
          {person.name}
        </p>
        <p className="text-[#2ECC71] text-[10px] mt-0.5 leading-tight" style={{ fontFamily: "'DM Sans',sans-serif" }}>
          {person.role}
        </p>
      </div>
    </motion.div>
  );
}

// â”€â”€ DESKTOP CARD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function DesktopCard({ item, index }: { item: (typeof milestones)[number]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-90px" });
  const isLeft = item.side === "left";

  return (
    <div ref={ref} className={`relative flex items-start w-full ${isLeft ? "flex-row-reverse" : "flex-row"}`}>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? 65 : -65, filter: "blur(8px)" }}
        animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        className={`w-[calc(50%-68px)] ${isLeft ? "pl-8" : "pr-8"}`}
      >
        <div className="group relative">
          {/* hover glow */}
          <div
            className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(ellipse at ${isLeft ? "100%" : "0%"} 50%, rgba(46,204,113,0.13), transparent 70%)`,
            }}
          />
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.07] bg-white/[0.025] backdrop-blur-sm group-hover:border-[#2ECC71]/22 transition-all duration-500">
            {/* top bar */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className={`h-[2px] w-full bg-gradient-to-r from-[#2ECC71] to-[#27AE60]/30 ${isLeft ? "origin-right" : "origin-left"}`}
            />

            <div className="p-6">
              {/* tag row */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#2ECC71] bg-[#2ECC71]/10 border border-[#2ECC71]/20 px-3 py-1 rounded-full"
                  style={{ fontFamily: "'Sora',sans-serif" }}
                >
                  {item.tag}
                </span>
                <span className="text-2xl">{item.icon}</span>
              </div>

              <h3 className="text-white font-bold text-xl leading-tight tracking-tight mb-3" style={{ fontFamily: "'Sora',sans-serif" }}>
                {item.title}
              </h3>

              <p className="text-white/48 text-sm leading-relaxed mb-5" style={{ fontFamily: "'DM Sans',sans-serif" }}>
                {item.description}
              </p>

              {/* achievement */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-[#2ECC71]/[0.06] border border-[#2ECC71]/12 mb-5">
                <span className="text-[#2ECC71] mt-0.5 flex-shrink-0 text-sm">âœ¦</span>
                <p className="text-[#2ECC71]/80 text-xs leading-relaxed font-medium" style={{ fontFamily: "'DM Sans',sans-serif" }}>
                  {item.achievement}
                </p>
              </div>

              {/* people */}
              {item.people.length > 0 && (
                <div className={`flex gap-5 flex-wrap ${isLeft ? "justify-end" : "justify-start"}`}>
                  {item.people.map((p: (typeof milestones)[number]["people"][number], pi: number) => (
                    <Avatar key={p.name} person={p} delay={0.15 + pi * 0.12} isInView={isInView} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Centre node */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pt-5">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="relative"
        >
          <div className="w-14 h-14 rounded-full border border-[#2ECC71]/22 bg-black flex items-center justify-center">
            <motion.div
              animate={isInView ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.55, delay: 0.25 }}
              className="w-5 h-5 rounded-full bg-gradient-to-br from-[#2ECC71] to-[#27AE60] shadow-[0_0_22px_6px_rgba(46,204,113,0.45)]"
            />
          </div>
          <motion.div
            animate={{ scale: [1, 2.1], opacity: [0.3, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: index * 0.3 }}
            className="absolute inset-0 rounded-full border border-[#2ECC71]/25"
          />
          <motion.div
            animate={{ scale: [1, 1.65], opacity: [0.2, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: index * 0.3 + 0.6 }}
            className="absolute inset-0 rounded-full border border-[#2ECC71]/15"
          />
        </motion.div>

        {/* Period badge */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mt-2.5 px-3 py-1.5 rounded-full bg-black border border-[#2ECC71]/22 whitespace-nowrap"
        >
          <span className="text-[#2ECC71] font-black text-xs tracking-widest" style={{ fontFamily: "'Sora',sans-serif" }}>
            {item.period}
          </span>
        </motion.div>
      </div>

      {/* Spacer */}
      <div className={`w-[calc(50%-68px)] ${isLeft ? "mr-auto" : "ml-auto"}`} />
    </div>
  );
}

// â”€â”€ MOBILE CARD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function MobileCard({ item, index, isLast }: { item: (typeof milestones)[number]; index: number; isLast: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="relative flex">
      {/* spine */}
      <div className="flex flex-col items-center mr-4 flex-shrink-0" style={{ width: "36px" }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ type: "spring", stiffness: 200, delay: 0.05 }}
          className="relative w-9 h-9 rounded-full border border-[#2ECC71]/28 bg-black flex items-center justify-center flex-shrink-0 mt-1"
        >
          <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#2ECC71] to-[#27AE60] shadow-[0_0_12px_3px_rgba(46,204,113,0.4)]" />
          <motion.div
            animate={{ scale: [1, 1.8], opacity: [0.35, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.35 }}
            className="absolute inset-0 rounded-full border border-[#2ECC71]/30"
          />
        </motion.div>
        {!isLast && (
          <div className="flex-1 w-px bg-gradient-to-b from-[#2ECC71]/28 to-[#2ECC71]/04 mt-1" />
        )}
      </div>

      {/* content */}
      <motion.div
        initial={{ opacity: 0, x: 22 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="flex-1 pb-10"
      >
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[10px] font-black tracking-[0.22em] uppercase text-[#2ECC71]" style={{ fontFamily: "'Sora',sans-serif" }}>
            {item.period}
          </span>
          <span className="text-white/18">Â·</span>
          <span className="text-white/35 text-[10px] uppercase tracking-wider" style={{ fontFamily: "'DM Sans',sans-serif" }}>
            {item.tag}
          </span>
        </div>

        <div className="rounded-xl overflow-hidden border border-white/[0.07] bg-white/[0.025]">
          <div className="h-[2px] bg-gradient-to-r from-[#2ECC71] to-transparent" />
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-lg">{item.icon}</span>
              <h3 className="text-white font-bold text-[15px] leading-tight" style={{ fontFamily: "'Sora',sans-serif" }}>
                {item.title}
              </h3>
            </div>
            <p className="text-white/45 text-xs leading-relaxed mb-4" style={{ fontFamily: "'DM Sans',sans-serif" }}>
              {item.description}
            </p>
            <div className="flex items-start gap-1.5 p-2.5 rounded-lg bg-[#2ECC71]/[0.06] border border-[#2ECC71]/12 mb-4">
              <span className="text-[#2ECC71] text-xs mt-0.5 flex-shrink-0">âœ¦</span>
              <p className="text-[#2ECC71]/75 text-[11px] leading-relaxed" style={{ fontFamily: "'DM Sans',sans-serif" }}>
                {item.achievement}
              </p>
            </div>
            {item.people.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {item.people.map((p: (typeof milestones)[number]["people"][number], pi: number) => (
                  <Avatar key={p.name} person={p} delay={0.1 + pi * 0.1} isInView={isInView} />
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

export default function JourneyPage() { return <div />; }
