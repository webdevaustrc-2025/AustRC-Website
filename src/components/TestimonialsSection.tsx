import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useTokens } from '@/tokens/useTokens';

export function TestimonialsSection() {
  const t = useTokens();
  const [carouselImages, setCarouselImages] = useState<string[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // clicking the carousel shouldn't advance it, just pause playback
  const handleCarouselClick = useCallback(() => {
    setIsPaused(true);
  }, []);

  // Fetch images from Firebase
  useEffect(() => {
    const fetchVoiceImages = async () => {
      try {
        const docRef = doc(db, "All_Data", "Voice_of_AUSTRC");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const imageUrls = [
            data.Voice_1,
            data.Voice_2,
            data.Voice_3,
            data.Voice_4,
          ].filter(Boolean);

          setCarouselImages(imageUrls);
        }
      } catch (error) {
        console.error("Error fetching Voice of AUSTRC images:", error);
      }
    };

    fetchVoiceImages();
  }, []);


  // Carousel interval
  useEffect(() => {
    if (carouselImages.length === 0) return;

    const interval = setInterval(() => {
      if (!isPaused) {
        setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [carouselImages.length, isPaused]);

  // Resume when clicking/touching outside the carousel
  useEffect(() => {
    const handleDocumentInteraction = (e: MouseEvent | TouchEvent) => {
      if (carouselRef.current && !carouselRef.current.contains(e.target as Node)) {
        setIsPaused(false);
      }
    };

    document.addEventListener("click", handleDocumentInteraction);
    document.addEventListener("touchstart", handleDocumentInteraction);

    return () => {
      document.removeEventListener("click", handleDocumentInteraction);
      document.removeEventListener("touchstart", handleDocumentInteraction);
    };
  }, []);

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: `linear-gradient(to bottom, ${t.pageBg}, ${t.pageBgAlt}, ${t.pageBg})` }}>
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-[#2ECC71] rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="text-center mb-8 sm:mb-12 px-4"
        >
          <h2 className="tracking-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl" style={{ color: t.textPrimary }}>
            VOICE OF AUSTRC
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="flex justify-center w-full px-4 sm:px-6 md:px-0 max-w-3xl mx-auto">
          {/* Single Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            style={{ perspective: "1000px" }}
            className="mx-auto w-full max-w-md"
          >
            <div
              ref={carouselRef}
              className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[rgba(46,204,113,0.3)] shadow-[0_0_50px_0_rgba(46,204,113,0.4)] cursor-pointer max-w-full"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
              onClick={handleCarouselClick}
            >
              <AnimatePresence mode="wait">
                {carouselImages.length > 0 && (
                  <motion.img
                    key={carouselIndex}
                    src={carouselImages[carouselIndex]}
                    alt={`Voice of AUSTRC - Image ${carouselIndex + 1}`}
                    className="w-full h-full object-cover"
                    initial={{
                      opacity: 0,
                      x: 40
                    }}
                    animate={{
                      opacity: 1,
                      x: 0
                    }}
                    exit={{
                      opacity: 0,
                      x: -40
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut"
                    }}
                  />
                )}
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                <h3 className="mb-1 sm:mb-2 text-sm sm:text-base" style={{ color: t.textPrimary }}>
                  Community Voice
                </h3>
                <p className="text-xs sm:text-sm" style={{ color: t.textSecondary }}>
                  Stories and experiences from AUSTRC members
                </p>
              </div>
              {/* Dots Indicator */}
              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex gap-1.5 sm:gap-2">
                {carouselImages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${index === carouselIndex
                      ? "bg-[#2ECC71] w-4 sm:w-6 shadow-[0_0_10px_0_rgba(46,204,113,0.8)]"
                      : "bg-gray-500"
                      }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}