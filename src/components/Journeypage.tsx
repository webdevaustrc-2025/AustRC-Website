import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useInView, useSpring } from "motion/react";
import { Link } from "react-router-dom";
import { useTokens } from "@/tokens/useTokens";

// ── THEME TOKENS ──────────────────────────────────────────────────────────────
// Thin wrapper that adds Journey-specific aliases on top of the global tokens.
function useJourneyTokens() {
  const t = useTokens();
  return {
    ...t,
    cardBg:          t.surfaceCard,
    cardBorder:      t.borderDefault,
    cardBorderHover: t.borderBrand,
  };
}

// ── FONT LOADER ───────────────────────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ── DATA ──────────────────────────────────────────────────────────────────────
const milestones = [
  {
    id: "origin",
    period: "March 2024",
    tag: "The Beginning",
    side: "right",
    title: "Rakibul Hasan Takes the Initiative",
    description:
      "Rakibul Hasan became the pioneer of AUST Robotics Club's digital presence. He independently took the initiative to build the club's very first website from scratch — designing the main backbone architecture and creating several key pages. This was a landmark breakthrough: for the first time, the club had a digital home.",
    achievement: "First ever website for AUST Robotics Club",
    people: [
      {
        name: "Rakibul Hasan",
        role: "President, Fall'23 Founder & Initiator",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/rakib.jpg",
      },
    ],
    icon: "🌱",
  },
  {
    id: "launch",
    period: "October 2024",
    tag: "Official Launch",
    side: "left",
    title: "First Official Website Launched",
    description:
      "The first official Google Sites website of AUST Robotics Club was launched — a huge milestone. The club now had a verified, publicly accessible digital identity that members and the world could visit.",
    achievement: "Google Sites website goes live",
    people: [],
    icon: "🚀",
  },
  {
    id: "panel1",
    period: "Spring 24",
    tag: "Team Founded",
    side: "right",
    title: "Birth of the Website Team",
    description:
"In <strong>Spring '24</strong>, for the first time in the history of the <strong>AUST Robotics Club</strong>, the official journey of the Web Development Team began. With the <strong>support and guidance of President Meherunnesa Hossain Ibnath and General Secretary Khalid Hasan Drobo</strong>, the formation of the team was successfully initiated. <strong>Showmik Majumder</strong> was appointed as the inaugural Director, and <strong>Ahnaf Amer</strong> joined as Assistant Director. Together, with the contribution of <strong>Khorshed Alam</strong> (President, Spring '25), they refined and improved the <strong>Google Sites</strong> website — transforming it into a stronger digital identity and official online presence of the club.",    achievement: "Official Website Team established — Google Site elevated to club identity",
    people: [
      {
        name: "Meherunnesa Hossain Ibnath",
        role: "President, Spring'24",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/383d5018-80b5-4c7e-bb0e-e3d016e791c5.jpg",
      },
      {
        name: "Khalid Hasan Drobo",
        role: "President, Fall'24",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/481122189_5220465148179168_1504737387793126728_n.jpg",
      },
      {
        name: "Showmik Majumder",
        role: "Director, Website Team, Spring'24",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/showmik.jpg",
      },
      {
        name: "Ahnaf Amer",
        role: "Joint Secretary, Spring'25",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/Ahnaf%20Amer.jpg?updatedAt=1769118153474",
      },
      {
        name: "Khorshed Alam",
        role: "President, Spring'25",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/khorshed.jpg",
      },
    ],
    icon: "👥",
  },
  {
    id: "arc2",
    period: "Spring 24",
    tag: "First Event Website",
    side: "left",
    title: "ARC 2.0 — First National Event Website",
    description:
      "After forming the Website Team, the club took its next bold step by building the very first <strong>national event website</strong> for <strong>ARC 2.0</strong>.<br><strong>Showmik Majumder (Director)</strong>, <strong>Ahnaf Amer (Assistant Director, Web Development)</strong>, and <strong>Khorshed Alam (Assistant Director, R&D)</strong> worked together to design, develop, and publish the ARC 2.0 website, which was built using <strong>WordPress</strong>.<br>This initiative marked an important milestone for the club, demonstrating its capability to manage large-scale event platforms and strengthening its digital presence.",
    achievement: "First ever national event website built and published — ARC 2.0",
    people: [
      {
        name: "Showmik Majumder",
        role: "Director, Website Team, Spring'24",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/showmik.jpg",
      },
      {
        name: "Ahnaf Amer",
        role: "Joint Secretary, Spring'25",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/Ahnaf%20Amer.jpg?updatedAt=1769118153474",
      },
      {
        name: "Khorshed Alam",
        role: "President, Spring'25",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/khorshed.jpg",
      },
    ],
    icon: "🌐",
  },
  {
    id: "bootcamp",
    period: "Fall 24",
    tag: "Bootcamp Website",
    side: "left",
    title: "Bootcamp Website Built & Launched",
    description:
      "During Panel 02, under the guidence of President Khalid Hasan Drobo, the Website Team delivered yet another milestone — a fully functional Bootcamp website.<br>Khorshed Alam single-handedly designed and developed the entire platform, providing AUST Robotics Club with a dedicated digital space for its bootcamp programs and training sessions.",
    achievement: "Fully functional Bootcamp website successfully built and launched",
    people: [
      {
        name: "Khorshed Alam",
        role: "President, Spring'25",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/khorshed.jpg",
      },
    ],
    icon: "📚",
  },
  {
    id: "panel2",
    period: "Fall 24",
    tag: "Full Stack Vision",
    side: "right",
    title: "The Leap to Full Stack",
    description:
      "<strong>Ahnaf Amer</strong> stepped up as Director, with <strong>Saobia Islam Tinni</strong> joining as Assistant Director.<br>This panel marked a visionary turning point for the club — the team dared to dream beyond Google Sites and aimed for something far more ambitious.<br>For the first time in the club’s history, the decision was made to build a fully-fledged <strong>Full Stack website</strong> along with a <strong>dedicated mobile application</strong>.<br>Development began in earnest on both fronts, marking the start of a new era in the club’s digital journey.<br>During <strong>Amer’s panel</strong>, upgrades to both the <strong>WordPress</strong> and <strong>Google Sites</strong> websites were also completed, further strengthening the club’s online presence.<br>With the dedication and collaborative effort of all panel members, the team successfully demonstrated their commitment to innovation and development.",
    achievement: "Full Stack website & Mobile App development begins",
    people: [
      {
        name: "Ahnaf Amer",
        role: "Joint Secretary, Spring'25",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/Ahnaf%20Amer.jpg?updatedAt=1769118153474",
      },
      {
        name: "Saobia Tinni",
        role: "Director, Web and App Development Team, Spring'25",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/Saobia%20Islam%20-%20Saobia%20Islam%20(Tinni).png?updatedAt=1769118154021",
      },
    ],
    icon: "💻",
  },
  {
    id: "robomania2",
    period: "Fall 24",
    tag: "Intra Event Website",
    side: "right",
    title: "Robomania 2.0 — Intra Event Website Launched",
    description:
      "During the tenure of the <strong>Fall '24 panel</strong>, the Website Team expanded its portfolio beyond the main club website. Under the leadership of <strong>Director Ahnaf Amer</strong> and <strong>Assistant Director Saobia Islam Tinni</strong>, the team designed and launched a dedicated website for <strong>Robomania 2.0</strong> — an intra-university event organized by the club.<br>This achievement further demonstrated the team's capability to develop event-specific digital platforms and support the club's growing digital ecosystem.",
    achievement: "Robomania 2.0 intra event website designed and launched",
    people: [
      {
        name: "Ahnaf Amer",
        role: "Joint Secretary, Spring'25",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/Ahnaf%20Amer.jpg?updatedAt=1769118153474",
      },
      {
        name: "Saobia Islam Tinni",
        role: "Director, Web and App Development Team, Spring'25",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/Saobia%20Islam%20-%20Saobia%20Islam%20(Tinni).png?updatedAt=1769118154021",
      },
    ],
    icon: "🎯",
  },
  {
    id: "mobileapp",
    period: "Spring 25",
    tag: "Mobile App",
    side: "left",
    title: "AUST Robotics Club Official Mobile App",
    description:
      "Under the supervision of the <strong>Fall ’24 Panel Director, Ahnaf Amer</strong>, <strong>Shajedul Kabir Rafi</strong>, as Head Developer, designed and developed the <strong>AUST Robotics Club’s first-ever official mobile application</strong>, with <strong>Samanta Islam</strong> contributing as Co-Developer.<br>Built from the ground up, the app brings the club’s digital presence into every member’s pocket — providing seamless access to events, updates, announcements, and resources on the go.",
    achievement: "First ever official mobile application built and launched",
    people: [
      {
        name: "Shajedul Kabir Rafi",
        role: "Assistant Director, Web & App Development Team, Spring'25 (Head Developer)",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/Shajedul%20Kabir%20Rafi.jpg?updatedAt=1769118153733",
      },
      {
        name: "Samanta Islam",
        role: "Deputy Executive, Spring'25 (Co-Developer)",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/Samanta%20Islam%20-%20Samanta%20Islam.jpg?updatedAt=1769118154095",
      },
    ],
    icon: "📱",
  },
  {
    id: "panel3",
    period: "Spring 25",
    tag: "Mission Accomplished",
    side: "right",
    title: "Full Stack Website & Mobile App Completed",
    description:
"Under the leadership of <strong>Director Saobia Islam Tinni</strong>, with <strong>Assistant Directors Shajedul Kabir Rafi and Arany Hasan</strong>, the team has successfully completed the official <strong>Full Stack Website and Mobile Application</strong> for the club. Every member was <strong>incredibly active, skilled, and dedicated</strong> delivering with <strong>precision and passion</strong>, and it was their <strong>collective dedication</strong> that made it possible to complete a <strong>full-scale, production ready platform in a remarkably short time.</strong> <strong>Director Saobia Islam Tinni's outstanding leadership</strong> kept every team member <strong>motivated, aligned, and excited</strong> to give their absolute best. A heartfelt thanks to <strong>Fall '24 Director Ahnaf Amer</strong> for his <strong>vision and guidance</strong> that laid the foundation for the club's <strong>first-ever live deployment</strong> of a full stack platform. To every panel member of <strong>Spring '25</strong> — thank you. This is not just a milestone; it's a <strong>legacy</strong> that will inspire future generations of the AUST Robotics Club.",   
 achievement: "Full Stack Website ✦ Mobile App — both completed",
    people: [
      {
        name: "Saobia Islam Tinni",
        role: "Director, Web and App Development Team, Spring'25",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/Saobia%20Islam%20-%20Saobia%20Islam%20(Tinni).png?updatedAt=1769118154021",
      },
      {
        name: "Shajedul Kabir Rafi",
        role: "Assistant Director, Web & App Development Team, Spring'25",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/Shajedul%20Kabir%20Rafi.jpg?updatedAt=1769118153733",
      },
      {
        name: "Arany Hasan",
        role: "Assistant Director, Web & App Development Team, Spring'25",
        img: "https://ik.imagekit.io/mekt2pafz/Web%20site%20team/Arany%20-%20Arany%20Hasan.jpeg?updatedAt=1769118153821",
      },
    ],
    icon: "🏆",
  },
];



// ── SCROLL PROGRESS ───────────────────────────────────────────────────────────
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

// ── AVATAR ────────────────────────────────────────────────────────────────────
function Avatar({ person, delay = 0, isInView }: { person: { name: string; role: string; img: string }; delay?: number; isInView: boolean }) {
  const [hovered, setHovered] = useState(false);
  const t = useJourneyTokens();
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
        <div
          className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2"
          style={{ borderColor: t.avatarBorder, backgroundColor: t.avatarBg }}
        >
          <img
            src={person.img}
            alt={person.name}
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const parent = e.currentTarget.parentNode as HTMLElement | null;
              if (parent) parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-2xl">👤</div>`;
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
        <p className="text-[11px] font-semibold leading-tight" style={{ fontFamily: "'Sora',sans-serif", color: t.textPrimary }}>
          {person.name}
        </p>
        <p className="text-[#2ECC71] text-[10px] mt-0.5 leading-tight" style={{ fontFamily: "'DM Sans',sans-serif" }}>
          {person.role}
        </p>
      </div>
    </motion.div>
  );
}

// ── DESKTOP CARD ──────────────────────────────────────────────────────────────
function DesktopCard({ item, index }: { item: (typeof milestones)[number]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-90px" });
  const isLeft = item.side === "left";
  const t = useJourneyTokens();

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
            style={{ background: `radial-gradient(ellipse at ${isLeft ? "100%" : "0%"} 50%, rgba(46,204,113,0.13), transparent 70%)` }}
          />
          <div
            className="relative rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-500"
            style={{ backgroundColor: t.cardBg, border: `1px solid ${t.cardBorder}` }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = t.cardBorderHover)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = t.cardBorder)}
          >
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

              <h3 className="font-bold text-xl leading-tight tracking-tight mb-3" style={{ fontFamily: "'Sora',sans-serif", color: t.textPrimary }}>
                {item.title}
              </h3>

              <p
                className="text-sm leading-relaxed mb-5"
                style={{ fontFamily: "'DM Sans',sans-serif", color: t.textSecondary }}
                dangerouslySetInnerHTML={{ __html: item.description.replace(/<strong>/g, `<strong style="color:${t.textPrimary};font-weight:700">`) }}
              />

              {/* achievement */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-[#2ECC71]/[0.06] border border-[#2ECC71]/20 mb-5">
                <span className="text-[#2ECC71] mt-0.5 flex-shrink-0 text-sm">✦</span>
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
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: t.nodeBg, border: `1px solid ${t.nodeBorder}` }}
          >
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
          className="mt-2.5 px-3 py-1.5 rounded-full whitespace-nowrap"
          style={{ backgroundColor: t.periodBadgeBg, border: `1px solid ${t.nodeBorder}` }}
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

// ── MOBILE CARD ───────────────────────────────────────────────────────────────
function MobileCard({ item, index, isLast }: { item: (typeof milestones)[number]; index: number; isLast: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const t = useJourneyTokens();

  return (
    <div ref={ref} className="relative flex">
      {/* spine */}
      <div className="flex flex-col items-center mr-4 flex-shrink-0" style={{ width: "36px" }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ type: "spring", stiffness: 200, delay: 0.05 }}
          className="relative w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
          style={{ backgroundColor: t.nodeBg, border: `1px solid ${t.nodeBorder}` }}
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
          <span style={{ color: t.textDot }}>·</span>
          <span className="text-[10px] uppercase tracking-wider" style={{ fontFamily: "'DM Sans',sans-serif", color: t.textMutedHigh }}>
            {item.tag}
          </span>
        </div>

        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: t.cardBg, border: `1px solid ${t.cardBorder}` }}
        >
          <div className="h-[2px] bg-gradient-to-r from-[#2ECC71] to-transparent" />
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-lg">{item.icon}</span>
              <h3 className="font-bold text-[15px] leading-tight" style={{ fontFamily: "'Sora',sans-serif", color: t.textPrimary }}>
                {item.title}
              </h3>
            </div>
            <p
              className="text-xs leading-relaxed mb-4"
              style={{ fontFamily: "'DM Sans',sans-serif", color: t.textSecondary }}
              dangerouslySetInnerHTML={{ __html: item.description.replace(/<strong>/g, `<strong style="color:${t.textPrimary};font-weight:700">`) }}
            />
            <div className="flex items-start gap-1.5 p-2.5 rounded-lg bg-[#2ECC71]/[0.06] border border-[#2ECC71]/20 mb-4">
              <span className="text-[#2ECC71] text-xs mt-0.5 flex-shrink-0">✦</span>
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
    </div>
  );
}

// ── TIMELINE SPINE (desktop) ──────────────────────────────────────────────────
function TimelineLine() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 50, damping: 18 });
  const t = useJourneyTokens();
  return (
    <div ref={ref} className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px hidden md:block overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundColor: t.spineBg }} />
      <motion.div style={{ scaleY, originY: 0 }} className="absolute inset-0 bg-gradient-to-b from-[#2ECC71]/65 via-[#2ECC71]/30 to-transparent" />
    </div>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  const t = useJourneyTokens();
  return (
    <div className="relative text-center py-28 md:py-36 px-6 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
        <span
          className="text-[clamp(55px,15vw,190px)] font-black leading-none tracking-tighter"
          style={{ fontFamily: "'Sora',sans-serif", color: t.textDot }}
        >
          LEGACY
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10"
      >
        {/* eyebrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
          className="flex items-center justify-center gap-3 mb-5"
        >
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#2ECC71]" />
          <span className="text-[#2ECC71] text-[11px] font-bold tracking-[0.3em] uppercase" style={{ fontFamily: "'Sora',sans-serif" }}>
            AUST Robotics Club · Website Team
          </span>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#2ECC71]" />
        </motion.div>

        {/* headline */}
        <h1
          className="text-[clamp(34px,7vw,78px)] font-black mb-5 leading-[0.92] tracking-tight"
          style={{ fontFamily: "'Sora',sans-serif", color: t.textPrimary }}
        >
          Our Digital{" "}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ECC71] to-[#27AE60]">Journey</span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.7, ease: "easeOut" }}
              className="absolute bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-[#2ECC71] to-[#27AE60] origin-left rounded-full"
            />
          </span>
        </h1>

        <p
          className="text-base md:text-lg max-w-lg mx-auto leading-relaxed mb-10"
          style={{ fontFamily: "'DM Sans',sans-serif", color: t.textSecondary }}
        >
          From a single person's bold initiative to a full-stack website and mobile app — the story of how we built AUST Robotics Club's digital identity, one panel at a time.
        </p>

        {/* stats */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.65 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {[
            { v: "2024", l: "Founded" },
            { v: "4", l: "Panels" },
            { v: "5", l: "Websites" },
            { v: "∞", l: "Ambition" },
          ].map((s) => (
            <div key={s.l} className="flex flex-col items-center px-5 py-3 rounded-xl" style={{ backgroundColor: t.statChipBg, border: `1px solid ${t.statChipBorder}` }}>
              <span className="text-xl font-black text-[#2ECC71]" style={{ fontFamily: "'Sora',sans-serif" }}>{s.v}</span>
              <span className="text-[10px] uppercase tracking-widest mt-0.5" style={{ fontFamily: "'DM Sans',sans-serif", color: t.textMutedMid }}>{s.l}</span>
            </div>
          ))}
        </motion.div>

        {/* scroll hint */}
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-14 flex flex-col items-center gap-2"
          style={{ color: t.textMuted }}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase" style={{ fontFamily: "'DM Sans',sans-serif" }}>Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#2ECC71]/45 to-transparent" />
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── CLOSING ───────────────────────────────────────────────────────────────────
function Closing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const t = useJourneyTokens();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 38 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="text-center pt-12 pb-32 px-6"
    >
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-[#2ECC71]/38" />
        <div className="w-2 h-2 rounded-full bg-[#2ECC71] shadow-[0_0_12px_4px_rgba(46,204,113,0.5)]" />
        <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-[#2ECC71]/38" />
      </div>
      <p className="text-[10px] tracking-[0.35em] uppercase mb-3" style={{ fontFamily: "'DM Sans',sans-serif", color: t.textMuted }}>
        The story continues
      </p>
      <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight" style={{ fontFamily: "'Sora',sans-serif", color: t.textPrimary }}>
        The best chapter is the next one.
      </h2>
      <p className="text-sm max-w-sm mx-auto mb-10" style={{ fontFamily: "'DM Sans',sans-serif", color: t.textMutedMid }}>
        See our developers who are dedicatedly building the Full Stack Website.
      </p>
      <Link to="/developers">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-3 px-9 py-3.5 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white font-bold rounded-full shadow-[0_0_40px_rgba(46,204,113,0.3)] hover:shadow-[0_0_60px_rgba(46,204,113,0.5)] transition-shadow duration-300 text-sm tracking-wide"
          style={{ fontFamily: "'Sora',sans-serif" }}
        >
          <span>Meet Our Contributors</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </Link>
    </motion.div>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function JourneyPage() {
  useFonts();
  const t = useJourneyTokens();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <main
      className="relative min-h-screen w-full overflow-clip"
      style={{ background: `linear-gradient(to bottom right, ${t.pageBg}, ${t.pageBgAlt}, ${t.pageBg})` }}
    >
      <ScrollProgress />
      <Hero />

      <section className="relative max-w-5xl mx-auto px-6 md:px-10 pb-0">
        {!isMobile && <TimelineLine />}

        <div className={isMobile ? "space-y-0" : "space-y-20 py-6"}>
          {milestones.map((item, i) =>
            isMobile ? (
              <MobileCard key={item.id} item={item} index={i} isLast={i === milestones.length - 1} />
            ) : (
              <DesktopCard key={item.id} item={item} index={i} />
            )
          )}
        </div>
      </section>

      <Closing />
    </main>
  );
}


