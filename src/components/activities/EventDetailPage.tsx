import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface EventSection {
  title: string;
  description: string;
  images: string[];
}

interface EventDetail {
  Event_Name: string;
  Introduction: string;
  sections: EventSection[];
}

// PROFESSIONAL ADAPTIVE GALLERY COMPONENT
const ProGallery: React.FC<{ images: string[]; isWinners: boolean }> = ({
  images,
  isWinners,
}) => {
  if (images.length === 0) return null;

  // Layout Logic:
  // 4 images -> 2x2 Grid (Upper 2, Lower 2)
  // Others -> Standard responsive grid
  const gridCols =
    images.length === 4
      ? "grid-cols-1 md:grid-cols-2"
      : isWinners
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid gap-6 md:gap-8 ${gridCols}`}>
      {images.map((img, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.02 }}
          className={`relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl ${
            images.length === 3 && i === 0 ? "md:col-span-2 md:row-span-1" : ""
          }`}
        >
          <img
            src={img}
            alt={`gallery-${i}`}
            className="w-full h-full object-cover min-h-[300px] max-h-[550px]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
      ))}
    </div>
  );
};

export const EventDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const ref = doc(db, "All_Data", "Event_Page", "All_Events_of_RC", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          const sections: EventSection[] = [];

          for (let h = 1; h <= 10; h++) {
            const title = data[`Headline_${h}`];
            const desc = data[`Headline_${h}_description`];
            const imgs: string[] = [];
            for (let i = 1; i <= 15; i++) {
              const url = data[`Headline_${h}_Image_${i}`];
              if (url) imgs.push(url);
            }

            if (title || imgs.length > 0 || desc) {
              sections.push({
                title: title || "",
                description: desc || "",
                images: imgs,
              });
            }
          }

          setEvent({
            Event_Name: data.Event_Name || "Event Detail",
            Introduction: data.Introduction || "",
            sections,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#2ECC71] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!event) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* 1. PROFESSIONAL STICKY HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a3a2a]/95 backdrop-blur-md border-b border-white/5 h-16 flex items-center px-4 md:px-8 shadow-2xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 hover:bg-white/10 p-2 rounded-xl transition-all text-white group"
        >
          <ChevronLeft
            size={24}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] truncate max-w-[150px] md:max-w-md">
            {event.Event_Name}
          </span>
        </button>
      </header>

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12">
        {/* 2. MAIN INTRODUCTION */}
        <div className="mb-24 border-b border-white/5 pb-16">
          <h1 className="text-3xl md:text-6xl lg:text-7xl font-black uppercase mb-10 tracking-tighter leading-[1.1] text-white break-words">
            {event.Event_Name}
          </h1>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-1 w-16 bg-[#2ECC71] rounded-full" />
            <span className="text-[#2ECC71] text-xs font-bold uppercase tracking-[0.4em]">
              Overview
            </span>
          </div>
          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed font-light max-w-5xl">
            {event.Introduction}
          </p>
        </div>

        {/* 3. DYNAMIC SECTIONS */}
        <div className="space-y-48">
          {event.sections.map((section, idx) => {
            const isWinners = section.title.toLowerCase().includes("winner");
            return (
              <motion.section
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative"
              >
                {/* HIGHLIGHTED GREEN HEADING WITH MORE SPACE */}
                {section.title && (
                  <div className="mb-16 md:mb-20">
                    <div className="relative inline-block">
                      <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#2ECC71] to-[#27AE60] drop-shadow-[0_0_20px_rgba(46,204,113,0.3)] leading-none">
                        {section.title}
                      </h2>
                      <div className="mt-4 w-24 h-1.5 bg-[#2ECC71] rounded-full" />
                    </div>
                  </div>
                )}

                {/* ADAPTIVE GALLERY */}
                <div className="mb-16">
                  <ProGallery images={section.images} isWinners={isWinners} />
                </div>

                {/* DESCRIPTION TEXT WITH ADDED PADDING */}
                {section.description && (
                  <div className="max-w-5xl bg-zinc-900/50 p-8 md:p-12 rounded-[2rem] border border-white/5 backdrop-blur-xl shadow-inner mt-12">
                    <p className="text-zinc-300 text-lg md:text-xl leading-relaxed font-light whitespace-pre-line italic opacity-90">
                      {section.description}
                    </p>
                  </div>
                )}
              </motion.section>
            );
          })}
        </div>

        {/* 4. CALL TO ACTION FOOTER */}
        <div className="mt-56 text-center">
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#2ECC71] to-transparent mx-auto mb-16 rounded-full" />
          <button className="group relative bg-[#2ECC71] text-black font-black px-14 py-6 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_60px_rgba(46,204,113,0.4)] uppercase tracking-tighter text-xl overflow-hidden">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </button>
        </div>
      </main>
    </div>
  );
};
