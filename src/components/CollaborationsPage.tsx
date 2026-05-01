import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ChevronDown, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useTokens } from '@/tokens/useTokens';

interface Collab {
  id: string;
  clubName: string;
  eventName: string;
  logoUrl: string;
}

// --- SUB-COMPONENT: Professional Animated Background ---
const ProfessionalBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {/* Dark base with subtle gradient */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a3a1a,_#000000)]" />

    {/* Animated grid lines */}
    <div className="absolute inset-0 opacity-20">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2ECC71] to-transparent animate-pulse" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2ECC71] to-transparent animate-pulse" />
      <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-[#2ECC71] to-transparent animate-pulse" />
      <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-[#2ECC71] to-transparent animate-pulse" />
    </div>

    {/* Floating geometric shapes */}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute border border-[#2ECC71]/10"
        style={{
          width: `${Math.random() * 300 + 100}px`,
          height: `${Math.random() * 300 + 100}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          rotate: `${Math.random() * 360}deg`,
          borderRadius: i % 2 === 0 ? "0%" : "50%",
        }}
        animate={{
          x: [0, 100, -100, 0],
          y: [0, -100, 100, 0],
          rotate: [0, 180, 360],
          scale: [1, 1.2, 1],
          borderColor: [
            "rgba(46,204,113,0.1)",
            "rgba(46,204,113,0.3)",
            "rgba(46,204,113,0.1)",
          ],
        }}
        transition={{
          duration: 20 + i * 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    ))}

    {/* Glowing orbs */}
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={`orb-${i}`}
        className="absolute rounded-full bg-[#2ECC71] blur-3xl"
        style={{
          width: `${Math.random() * 400 + 200}px`,
          height: `${Math.random() * 400 + 200}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: 0.1,
        }}
        animate={{
          x: [0, 200, -200, 0],
          y: [0, -200, 200, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 25 + i * 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}

    {/* Scanning line effect */}
    <motion.div
      className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#2ECC71] to-transparent blur-sm"
      animate={{
        top: ["0%", "100%", "0%"],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  </div>
);

// --- SUB-COMPONENT: Popup Modal with Green Box and Inside Cross Button ---
const CollabPopup = ({
  collab,
  onClose,
}: {
  collab: Collab;
  onClose: () => void;
}) => {
  const t = useTokens();
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Green Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a3a0a] via-[#1a4a1a] to-[#0a2a0a]" />

          {/* Animated particles with green */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#2ECC71] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.5, 0],
                y: [0, -50],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Content */}
          <div className="relative z-20 p-8">
            {/* Close Button - Now Inside the Box */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-4 right-4 w-8 h-8 bg-[#2ECC71] rounded-full flex items-center justify-center text-black hover:bg-white transition-colors shadow-lg z-30"
              aria-label="Close"
              type="button"
            >
              <X size={16} className="text-black" />
            </button>

            {/* Logo with Green Glow */}
            <div className="relative mb-6 flex justify-center">
              <motion.div
                className="absolute inset-0 bg-[#2ECC71] blur-3xl opacity-40 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="relative w-32 h-32 bg-white rounded-2xl p-4 shadow-2xl border-2 border-[#2ECC71] transform hover:scale-105 transition-transform duration-300">
                <img
                  src={collab.logoUrl}
                  alt={collab.clubName}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Club Name with Green Gradient */}
            <h2 className="text-2xl font-bold text-center mb-4 text-[#2ECC71]">
              {collab.clubName}
            </h2>

            {/* Description Card with Green Border */}
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-5 border border-[#2ECC71]/30 shadow-inner">
              <p className="text-sm leading-relaxed text-center" style={{ color: t.textSecondary }}>
                {collab.eventName}
              </p>
            </div>

            {/* Decorative Green Elements */}
            <div className="mt-6 flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-1 w-8 bg-gradient-to-r from-transparent via-[#2ECC71] to-transparent rounded-full"
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- SUB-COMPONENT: Enhanced Card ---
const CollabCard = ({
  collab,
  idx,
  onSeeMore,
}: {
  collab: Collab;
  idx: number;
  onSeeMore: () => void;
}) => {
  const t = useTokens();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.05 }}
      whileHover={{ y: -5 }}
      className="group relative rounded-2xl p-4 pb-6 flex flex-col items-center text-center transition-all duration-500 hover:border-[#2ECC71]/40 hover:shadow-2xl hover:shadow-[#2ECC71]/10 h-full min-h-[280px] backdrop-blur-sm" style={{ background: `linear-gradient(to bottom, ${t.surfaceCard}, ${t.surfaceCardHover})`, border: `1px solid ${t.borderSubtle}` }}
    >
      {/* Hover Effect Gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#2ECC71]/0 to-[#2ECC71]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Logo Container with Enhanced Effects */}
      <div className="relative w-full aspect-square mb-4 shrink-0">
        <div className="absolute inset-0 bg-[#2ECC71] rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
        <div className="relative w-full h-full bg-white rounded-xl flex items-center justify-center p-4 overflow-hidden shadow-inner border border-white/10 group-hover:border-[#2ECC71]/30 transition-all duration-500">
          <img
            src={collab.logoUrl}
            alt={collab.clubName}
            className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center flex-grow">
        <h3 className="font-bold text-sm leading-tight uppercase tracking-tight mb-2 group-hover:text-[#2ECC71] transition-colors duration-300" style={{ color: t.textPrimary }}>
          {collab.clubName}
        </h3>

        {/* See More Button with Animation */}
        <button
          onClick={onSeeMore}
          className="mt-auto pt-3 flex items-center gap-1 text-[#2ECC71] text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors mx-auto relative z-10 group/btn"
        >
          <span>See More</span>
          <motion.div
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown
              size={12}
              className="group-hover/btn:translate-y-1 transition-transform"
            />
          </motion.div>
        </button>
      </div>
    </motion.div>
  );
};

export function CollaborationsPage() {
  const t = useTokens();
  const [collabs, setCollabs] = useState<Collab[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollab, setSelectedCollab] = useState<Collab | null>(null);

  useEffect(() => {
    const fetchCollabs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "collaborations"));
        const data = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Collab,
        );
        setCollabs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollabs();
  }, []);

  return (
    <div className="relative min-h-screen selection:bg-[#2ECC71]/30 overflow-x-hidden" style={{ backgroundColor: t.pageBg, color: t.textPrimary }}>
      <ProfessionalBackground />

      <main className="relative z-10 max-w-7xl mx-auto pt-24 pb-20 px-6">
        {/* Header Section with Enhanced Design */}
        <div className="relative mb-12">
          {/* Back Button with Glow */}
          <Link
            to="/"
            className="absolute left-0 top-2 text-[#2ECC71] hover:text-white transition-colors group"
          >
            <div className="absolute inset-0 bg-[#2ECC71] blur-lg opacity-0 group-hover:opacity-30 transition-opacity" />
            <ArrowLeft size={24} className="relative z-10" />
          </Link>

          {/* Animated Title */}
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-bold tracking-tight mb-4"
            >
              <span className="bg-gradient-to-r from-[#2ECC71] via-white to-[#2ECC71] bg-clip-text text-transparent bg-300% animate-gradient">
                Event Collaborations
              </span>
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              transition={{ delay: 0.5, duration: 1 }}
              className="h-1 bg-gradient-to-r from-transparent via-[#2ECC71] to-transparent mx-auto"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#2ECC71]/30 border-t-[#2ECC71] rounded-full animate-spin" />
              <div className="absolute inset-0 bg-[#2ECC71] blur-xl opacity-20 animate-pulse" />
            </div>
          </div>
        ) : (
          /* Grid with Enhanced Layout */
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {collabs.map((c, idx) => (
              <CollabCard
                key={c.id}
                collab={c}
                idx={idx}
                onSeeMore={() => setSelectedCollab(c)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Popup Modal */}
      <AnimatePresence>
        {selectedCollab && (
          <CollabPopup
            collab={selectedCollab}
            onClose={() => setSelectedCollab(null)}
          />
        )}
      </AnimatePresence>

      {/* Add custom animation keyframes to your global CSS or add to your component */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 300% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
