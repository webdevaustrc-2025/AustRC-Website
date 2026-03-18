import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, query } from 'firebase/firestore';
import { slugify } from '@/utils/slugify';
import { db } from '@/config/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles, XIcon, ZoomIn } from 'lucide-react';

interface Section {
  title: string;
  description: string;
  images: string[];
}

interface OtherActivityDetail {
  id: string;
  Name: string;
  Description: string;
  Images: string[];
  Sections: Section[];
}

function HeroBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      <div className="hidden lg:block absolute inset-0 opacity-30 overflow-hidden">
        <motion.div
          className="absolute top-20 -left-20 w-96 h-96 bg-[#2ECC71] rounded-full"
          style={{ filter: 'blur(100px)', transform: 'translateZ(0)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-[#27AE60] rounded-full"
          style={{ filter: 'blur(100px)', transform: 'translateZ(0)' }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <div className="lg:hidden absolute inset-0 opacity-20 overflow-hidden">
        <div className="absolute top-20 -left-20 w-64 h-64 bg-[#2ECC71] rounded-full" style={{ filter: 'blur(60px)' }} />
        <div className="absolute bottom-20 -right-20 w-72 h-72 bg-[#27AE60] rounded-full" style={{ filter: 'blur(60px)' }} />
      </div>
    </div>
  );
}

// Image Carousel Component
function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (images.length <= 1 || zoomed) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length, zoomed]);

  // lock scroll when zoomed
  useEffect(() => {
    const html = document.documentElement;
    if (zoomed) {
      html.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      html.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      html.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [zoomed]);

  const prev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrent((c) => (c - 1 + images.length) % images.length);
  };
  const next = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrent((c) => (c + 1) % images.length);
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-[250px] sm:h-[350px] rounded-2xl bg-[#0a1810] border border-[#2ECC71]/20 flex items-center justify-center">
        <Sparkles className="w-16 h-16 text-[#2ECC71]/20" />
      </div>
    );
  }

  return (
    <>
      {/* Carousel */}
      <div className="relative w-full max-w-4xl mx-auto h-[400px] rounded-3xl overflow-hidden border border-[#2ECC71]/30 shadow-[0_0_50px_rgba(46,204,113,0.15)] bg-[#0a1810]">
        <AnimatePresence mode="sync">
          <motion.img
            key={current}
            src={images[current]}
            alt={`${title} ${current + 1}`}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full max-h-[400px] w-auto h-auto object-contain cursor-zoom-in"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => setZoomed(true)}
          />
        </AnimatePresence>

        {/* Zoom hint */}
        <button
          onClick={() => setZoomed(true)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 border border-[#2ECC71]/30 text-[#2ECC71] flex items-center justify-center hover:bg-[#2ECC71] hover:text-black transition-all duration-300 backdrop-blur-sm z-10"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 border border-[#2ECC71]/20 text-[#2ECC71] text-xs font-medium backdrop-blur-sm">
            {current + 1} / {images.length}
          </div>
        )}

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 border border-[#2ECC71]/30 text-[#2ECC71] flex items-center justify-center hover:bg-[#2ECC71] hover:text-black transition-all duration-300 backdrop-blur-sm z-10"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 border border-[#2ECC71]/30 text-[#2ECC71] flex items-center justify-center hover:bg-[#2ECC71] hover:text-black transition-all duration-300 backdrop-blur-sm z-10"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === current
                    ? 'w-6 bg-[#2ECC71] shadow-[0_0_10px_#2ECC71]'
                    : 'w-2 bg-gray-500/50 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {createPortal(
        <AnimatePresence>
          {zoomed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-hidden"
              style={{ zIndex: 99999 }}
              onClick={() => setZoomed(false)}
            >
              {/* Close */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomed(false);
                }}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 border border-[#2ECC71]/40 text-[#2ECC71] flex items-center justify-center hover:bg-[#2ECC71] hover:text-black transition-all duration-300 pointer-events-auto"
              >
                <XIcon className="w-5 h-5" />
              </button>

              {/* Counter */}
              {images.length > 1 && (
                <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/60 border border-[#2ECC71]/20 text-[#2ECC71] text-xs font-medium pointer-events-none">
                  {current + 1} / {images.length}
                </div>
              )}

              {/* Image */}
              <motion.img
                key={current}
                src={images[current]}
                alt={`${title} ${current + 1}`}
                className="rounded-xl select-none pointer-events-auto"
                style={{
                  maxWidth: '80vw',
                  maxHeight: '75vh',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  flexShrink: 0,
                }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              />

              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      prev();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/60 border border-[#2ECC71]/30 text-[#2ECC71] flex items-center justify-center hover:bg-[#2ECC71] hover:text-black transition-all duration-300 pointer-events-auto"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      next();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/60 border border-[#2ECC71]/30 text-[#2ECC71] flex items-center justify-center hover:bg-[#2ECC71] hover:text-black transition-all duration-300 pointer-events-auto"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Dots */}
              {images.length > 1 && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrent(idx);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === current
                          ? 'w-6 bg-[#2ECC71] shadow-[0_0_10px_#2ECC71]'
                          : 'w-2 bg-gray-500/50 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

export function OtherActivityDetailPage() {
  const { slug: id } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<OtherActivityDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const ref = collection(db, 'All_Data', 'Other_Activities', 'other_activities');
        const snapshot = await getDocs(query(ref));

        const matched = snapshot.docs.find((d) => {
          const name = d.data().Name || d.data().name || d.data().Title || d.data().title || '';
          return slugify(name) === id;
        });

        if (matched) {
          const raw = matched.data();

          // Collect all images: Image_1, Image_2, ..., Image, imgUrl, etc.
          const images: string[] = [];
          for (let i = 1; i <= 20; i++) {
            const key = `Image_${i}`;
            if (raw[key] && typeof raw[key] === 'string') {
              images.push(raw[key]);
            }
          }
          // Fallback single image fields
          if (images.length === 0) {
            const fallback = raw.Image || raw.imgUrl || raw.image || '';
            if (fallback) images.push(fallback);
          }

          // Parse sections: Section_1_Title, Section_1_Description, Section_1_Image_1, ...
          const sections: Section[] = [];
          for (let s = 1; s <= 10; s++) {
            const title = raw[`Section_${s}_Title`] || '';
            const description = raw[`Section_${s}_Description`] || '';
            const sectionImages: string[] = [];
            for (let i = 1; i <= 10; i++) {
              const img = raw[`Section_${s}_Image_${i}`];
              if (img && typeof img === 'string') sectionImages.push(img);
            }
            if (title || description || sectionImages.length > 0) {
              sections.push({ title, description, images: sectionImages });
            }
          }

          setData({
            id: matched.id,
            Name: raw.Name || raw.name || raw.Title || raw.title || 'Untitled',
            Description: raw.Description || raw.description || 'No description available.',
            Images: images,
            Sections: sections,
          });
        }
      } catch (error) {
        console.error('Error fetching other activity detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <HeroBackground />
        <div className="w-10 h-10 border-2 border-[#2ECC71] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white pt-32">
        <HeroBackground />
        <h2 className="text-2xl font-bold mb-4 text-[#2ECC71]">Content Not Found</h2>
        <button
          onClick={() => navigate('/activities/other-activities')}
          className="px-6 py-2 border border-[#2ECC71] text-[#2ECC71] rounded-full hover:bg-[#2ECC71] hover:text-black transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <HeroBackground />

      <div className="h-32 md:h-40 w-full" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10 pb-32">
        {/* Back Button */}
        <div className="w-full flex justify-start mb-8">
          <motion.button
            onClick={() => navigate('/activities/other-activities')}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.05, x: -4 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex items-center gap-3 px-6 py-3 bg-black/40 border border-[#2ECC71]/30 rounded-full text-[#2ECC71] hover:border-[#2ECC71] hover:shadow-[0_0_25px_rgba(46,204,113,0.3)] transition-all duration-300 cursor-pointer backdrop-blur-xl"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2ECC71]/10 group-hover:bg-[#2ECC71] transition-all duration-300">
              <ArrowLeft className="w-4 h-4 text-[#2ECC71] group-hover:text-black transition-colors duration-300" />
            </div>
            <span className="font-semibold text-sm tracking-wide text-white/90 group-hover:text-white transition-colors duration-300">
              Back
            </span>
          </motion.button>
        </div>

        <div className="flex flex-col items-center">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold text-center text-white mb-4 leading-tight drop-shadow-[0_0_15px_rgba(46,204,113,0.3)]"
          >
            {data.Name}
          </motion.h1>
          <div className="w-20 h-1.5 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-full mb-10" />

          {/* Image Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full mb-12"
          >
            <ImageCarousel images={data.Images} title={data.Name} />
          </motion.div>

          {/* Main Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full bg-[#0a1810]/50 border border-white/5 p-8 md:p-10 rounded-2xl backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1 bg-[#2ECC71] rounded-full" />
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">About This Activity</h3>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line font-light">
              {data.Description}
            </p>
          </motion.div>

          {/* Sections */}
          {data.Sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="w-full mt-8"
            >
              {/* Section Images Carousel */}
              {section.images.length > 0 && (
                <div className="mb-6">
                  <ImageCarousel images={section.images} title={section.title || data.Name} />
                </div>
              )}

              {/* Section Text */}
              {(section.title || section.description) && (
                <div className="bg-[#0a1810]/50 border border-white/5 p-8 md:p-10 rounded-2xl backdrop-blur-sm">
                  {section.title && (
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-1 bg-[#2ECC71] rounded-full" />
                      <h3 className="text-xl font-bold text-white uppercase tracking-wider">{section.title}</h3>
                    </div>
                  )}
                  {section.description && (
                    <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line font-light">
                      {section.description}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
