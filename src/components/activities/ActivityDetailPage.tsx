import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Sparkles,
  User,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";

// --- Configuration ---
const COLLECTION_PATHS: Record<string, string[]> = {
  mentorship: [
    "All_Data",
    "Educational, Mentorship & Training Programs",
    "educational, mentorship & training programs",
  ],
  workshops: [
    "All_Data",
    "Educational,Workshops & Seminar",
    "educational,Workshops & Seminar",
  ],
  research: ["All_Data", "Research_Projects", "research_projects"],
  // ✅ FIX: Added the events path from your Firebase screenshot
  events: ["All_Data", "Event_Page", "All_Events_of_RC"],
};

interface ActivityDetail {
  id: string;
  Name: string;
  Images: string[]; // Changed to array for the slider
  Description: string;
  Status: string;
  Date?: string;
  Facilitator?: string;
}

// --- Hover-to-Slide Component ---
const ImageHoverSlider = ({
  images,
  name,
}: {
  images: string[];
  name: string;
}) => {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && images.length > 1) {
      interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 2000); // Cycles every 2 seconds on hover
    } else {
      setIndex(0); // Reset to first image (Cover) when cursor leaves
    }
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-[#2ECC71]/30 bg-[#0a1810] shadow-[0_0_50px_rgba(46,204,113,0.15)] mb-12 relative group cursor-pointer"
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={images[index]}
          alt={name}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

      {/* Slide Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-8 bg-[#2ECC71]" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>
      )}

      {/* Hover Message */}
      {!isHovered && images.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold border border-[#2ECC71]/50 flex items-center gap-2">
            <ImageIcon size={14} className="text-[#2ECC71]" /> Keep cursor here
            to see more images
          </span>
        </div>
      )}
    </motion.div>
  );
};

// --- Typing Effect Component ---
const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    if (!text) return;

    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text.slice(i, i + 3));
      i += 3;
      if (i >= text.length) {
        clearInterval(intervalId);
        setDisplayedText(text);
      }
    }, 15);

    return () => clearInterval(intervalId);
  }, [text]);

  return (
    <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap font-light">
      {displayedText}
      <span className="inline-block w-1.5 h-5 ml-1 bg-[#2ECC71] animate-pulse align-middle" />
    </p>
  );
};

export function ActivityDetailPage() {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<ActivityDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!category || !id || !COLLECTION_PATHS[category]) {
        setLoading(false);
        return;
      }

      try {
        const pathSegments = COLLECTION_PATHS[category];
        // @ts-ignore
        const docRef = doc(db, ...pathSegments, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const raw = docSnap.data();

          // 1. DYNAMIC IMAGE FETCHING
          const allImages: string[] = [];
          if (raw.Cover_Picture) allImages.push(raw.Cover_Picture);
          if (raw.Image || raw.imgUrl) allImages.push(raw.Image || raw.imgUrl);

          // Get all "Headline_X_Image_Y"
          Object.keys(raw)
            .sort()
            .forEach((key) => {
              if (
                key.includes("Image") &&
                raw[key] &&
                !allImages.includes(raw[key])
              ) {
                allImages.push(raw[key]);
              }
            });

          // 2. CONSTRUCT FULL DESCRIPTION (Intro + All Headlines)
          let combinedDesc = raw.Introduction || raw.Description || "";

          for (let i = 1; i <= 10; i++) {
            const hTitle = raw[`Headline_${i}`];
            const hDesc = raw[`Headline_${i}_description`];

            if (hTitle && hTitle.trim() !== "") {
              combinedDesc += `\n\n--- ${hTitle} ---\n`;
            }
            if (hDesc && hDesc.trim() !== "") {
              combinedDesc += `${hDesc}\n`;
            }
          }

          setData({
            id: docSnap.id,
            Name: raw.Event_Name || raw.Name || raw.Title || "Untitled",
            Images: allImages,
            Description: combinedDesc,
            Status: raw.Status || "Completed",
            Date: raw.Date || raw.date,
            Facilitator: raw.Facilitator,
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [category, id]);

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#2ECC71] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white pt-32">
        <h2 className="text-2xl font-bold mb-4 text-[#2ECC71]">
          Content Not Found
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 border border-[#2ECC71] text-[#2ECC71] rounded-full"
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#2ECC71]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="w-full flex justify-start mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-white hover:border-[#2ECC71] hover:bg-[#2ECC71]/20 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
        </div>

        <div className="flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-center mb-8 drop-shadow-[0_0_15px_rgba(46,204,113,0.3)]"
          >
            {data.Name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            <span className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2ECC71]/30 bg-[#2ECC71]/10 text-[#2ECC71] text-sm font-medium">
              <CheckCircle className="w-4 h-4" /> {data.Status}
            </span>
            {data.Date && (
              <span className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-300 text-sm">
                <Calendar className="w-4 h-4 text-[#2ECC71]" /> {data.Date}
              </span>
            )}
          </motion.div>

          {/* HOVER SLIDER */}
          <ImageHoverSlider images={data.Images} name={data.Name} />

          {/* FULL DESCRIPTION */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-4xl bg-[#0a1810]/50 border border-white/5 p-8 md:p-10 rounded-2xl backdrop-blur-sm mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1 bg-[#2ECC71] rounded-full" />
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                Full Description
              </h3>
            </div>

            <TypewriterText text={data.Description} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <button
              onClick={() => navigate("/contact-us")} // ✅ This line handles the navigation
              className="px-10 py-4 bg-[#2ECC71] text-black font-bold text-lg rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(46,204,113,0.4)] cursor-pointer"
            >
              Contact AUSTRC for Details
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
