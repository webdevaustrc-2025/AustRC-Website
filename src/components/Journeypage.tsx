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

export default function JourneyPage() { return <div><AnimatedBackground /><ScrollProgress /></div>; }
