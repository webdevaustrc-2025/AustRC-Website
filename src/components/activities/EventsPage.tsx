import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventItem {
  id: string;
  Event_Name: string;
  Introduction: string;
  coverImage: string;
}

const EventCard: React.FC<{ event: EventItem; index: number }> = ({
  event,
  index,
}) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }} // Subtle lift on hover
      whileTap={{ scale: 0.98 }} // Feedback on click
      transition={{ delay: index * 0.1 }}
      onClick={() => navigate(`/activity/events/${event.id}`)}
      className="group bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden hover:border-[#2ECC71]/50 transition-all duration-500 flex flex-col h-full cursor-pointer shadow-xl"
    >
      {/* 1. IMAGE: Strictly fixed height */}
      <div className="relative h-64 w-full overflow-hidden flex-shrink-0">
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
          <Circle
            size={8}
            className="fill-[#2ECC71] text-[#2ECC71] animate-pulse"
          />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">
            Active
          </span>
        </div>
        <img
          src={
            event.coverImage ||
            "https://via.placeholder.com/600x400?text=AUST+RC"
          }
          alt={event.Event_Name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {/* Subtle overlay that brightens on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
      </div>

      {/* Content Container */}
      <div className="p-6 flex flex-col flex-grow">
        {/* 2. TITLE: min-h ensures parallel alignment across the grid */}
        <h3 className="text-xl font-bold text-white mb-4 tracking-tight group-hover:text-[#2ECC71] transition-colors line-clamp-4 min-h-[7.5rem]">
          {event.Event_Name}
        </h3>

        {/* 3. INTRODUCTION: min-h ensures space is uniform */}
        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 font-light min-h-[4.5rem]">
          {event.Introduction}
        </p>

        {/* 4. FOOTER INDICATOR: Small visual hint that the card is interactive */}
        <div className="mt-auto pt-6 flex items-center justify-end"></div>
      </div>
    </motion.div>
  );
};

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const ref = collection(
          db,
          "All_Data",
          "Event_Page",
          "All_Events_of_RC"
        );
        const snapshot = await getDocs(ref);
        const fetched = snapshot.docs.map((doc) => {
          const data = doc.data();
          const mainImg = data.Cover_Picture || data.Headline_1_Image_1 || "";

          let intro = data.Introduction || "";

          // Keeping your logic for specific text additions
          if (data.Event_Name === "AUST ROVER CHALLENGE 2.0") {
            intro =
              "Prime Bank presents AUST Rover Challenge 2.0 was held on 12th and 13th July 2025 at Ahsanullah University of Science and Technology (AUST). This was the second edition of Ahsanullah University of Science and Technology's national robotics event, and it was even bigger and more exciting than before. " +
              intro;
          }

          return {
            id: doc.id,
            Event_Name: data.Event_Name || doc.id,
            Introduction: intro,
            coverImage: mainImg,
          };
        });
        setEvents(fetched as EventItem[]);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#2ECC71] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[40vh] bg-[#2ECC71]/10 rounded-full blur-[150px] pointer-events-none" />

      <header className="text-center mb-20 relative z-10 px-6">
        <div className="inline-block px-4 py-1.5 rounded-full bg-[#2ECC71]/10 border border-[#2ECC71]/20 text-[#2ECC71] text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
          The Archive
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter">
          Events{" "}
          <span className="bg-gradient-to-r from-[#2ECC71] to-[#27AE60] bg-clip-text text-transparent">
            Chronicle
          </span>
        </h1>
        <div className="w-20 h-1 bg-[#2ECC71] mx-auto rounded-full mb-6" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto relative z-10 items-stretch">
        <AnimatePresence>
          {events.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
