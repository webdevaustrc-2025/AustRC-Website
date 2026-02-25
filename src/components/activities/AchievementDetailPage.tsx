import { motion } from 'motion/react';
import { ArrowLeft, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { slugify } from '@/utils/slugify';

interface Achievement {
  id: string;
  Name?: string;
  Description?: string;
  Order?: number;
  [key: string]: any;
}

// Hero Background — same as HomePage HeroSection
function HeroBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        {!isMobile ? (
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[rgba(46,204,113,0.15)] via-transparent to-[rgba(46,204,113,0.15)]"
            style={{ filter: 'blur(64px)' }}
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        ) : (
          <div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[rgba(46,204,113,0.1)] via-transparent to-[rgba(46,204,113,0.1)] opacity-30"
            style={{ filter: 'blur(40px)' }}
          />
        )}
      </div>

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
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-full"
          style={{ filter: 'blur(80px)', transform: 'translateZ(0)' }}
          animate={{ rotate: [0, 360], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="lg:hidden absolute inset-0 opacity-20 overflow-hidden">
        <div className="absolute top-20 -left-20 w-64 h-64 bg-[#2ECC71] rounded-full" style={{ filter: 'blur(60px)' }} />
        <div className="absolute bottom-20 -right-20 w-72 h-72 bg-[#27AE60] rounded-full" style={{ filter: 'blur(60px)' }} />
      </div>
    </div>
  );
}

export function AchievementDetailPage() {
  const { achievementSlug } = useParams<{ achievementSlug: string }>();
  const navigate = useNavigate();
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!achievementSlug) {
      setError(true);
      setLoading(false);
      return;
    }

    const fetchAchievement = async () => {
      try {
        const achievementsRef = collection(db, 'All_Data', 'Achievement', 'achievement');
        const q = query(achievementsRef);
        const querySnapshot = await getDocs(q);

        let found: Achievement | null = null;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const name = data.Name || doc.id || '';
          if (slugify(name) === achievementSlug) {
            found = { id: doc.id, ...data } as Achievement;
          }
        });

        if (found) {
          setAchievement(found);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching achievement:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievement();
  }, [achievementSlug]);

  const handleBack = () => {
    navigate('/activities/achievements');
  };

  // Get all image URLs
  const getImageUrls = (): string[] => {
    if (!achievement) return [];
    const images: string[] = [];
    for (let i = 1; i <= 10; i++) {
      const imageKey = `Image_${i}`;
      if (achievement[imageKey]) {
        images.push(achievement[imageKey]);
      }
    }
    return images;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <HeroBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#2ECC71]/20 border-t-[#2ECC71] rounded-full animate-spin" />
          <p className="text-[#2ECC71] text-lg">Loading achievement...</p>
        </div>
      </main>
    );
  }

  if (error || !achievement) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <HeroBackground />
        <div className="relative z-10 text-center">
          <Trophy className="w-16 h-16 text-[#2ECC71]/40 mx-auto mb-4" />
          <div className="text-white text-2xl mb-6">Achievement not found</div>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-[#2ECC71] text-white rounded-lg font-semibold hover:bg-[#27AE60] transition-all"
          >
            Back to Achievements
          </button>
        </div>
      </main>
    );
  }

  const images = getImageUrls();
  const hasMultipleImages = images.length > 1;
  const title = achievement.Name || achievement.id || 'Untitled Achievement';
  const description = achievement.Description || '';

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <main className="min-h-screen bg-black relative overflow-x-hidden">
      <HeroBackground />

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="fixed top-24 left-6 z-40 flex items-center gap-2 px-4 py-2 text-[#2ECC71] hover:text-white bg-black/50 hover:bg-black/80 rounded-lg backdrop-blur-md transition-all border border-[#2ECC71]/30 hover:border-[#2ECC71]"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline">Back</span>
      </button>

      <div className="container mx-auto px-4 pt-20 pb-24 max-w-6xl relative z-10">
        {/* Image Carousel */}
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-[0_0_60px_0_rgba(46,204,113,0.3)]">
              <div className="aspect-video relative bg-black flex items-center justify-center">
                <img
                  src={images[currentImageIndex]}
                  alt={`${title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {hasMultipleImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex ? 'bg-[#2ECC71] w-8' : 'bg-white/50 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium z-10">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[rgba(46,204,113,0.1)] to-[rgba(46,204,113,0.05)] rounded-full border border-[rgba(46,204,113,0.3)] mb-6">
            <Trophy className="w-4 h-4 text-[#2ECC71]" />
            <span className="text-[#2ECC71] text-sm">Achievement</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            {title}
          </h1>
          <div className="w-20 h-1.5 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-full mt-6" />
        </motion.div>

        {/* Description */}
        {description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12"
          >
            <div className="bg-gradient-to-br from-[rgba(46,204,113,0.05)] to-transparent border border-[rgba(46,204,113,0.2)] rounded-2xl overflow-hidden backdrop-blur-sm p-8 md:p-12">
              <h2 className="text-2xl font-bold text-[#2ECC71] mb-8 flex items-center gap-3">
                <div className="w-2 h-8 bg-[#2ECC71] rounded-full" />
                Description
              </h2>
              <div className="space-y-6 text-justify">
                {description.split('\n\n').map((paragraph, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                    className="text-gray-300 leading-relaxed text-base md:text-lg whitespace-pre-wrap"
                  >
                    {paragraph.trim()}
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* All Images Gallery */}
        {images.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-gradient-to-br from-[rgba(46,204,113,0.05)] to-transparent border border-[rgba(46,204,113,0.2)] rounded-2xl overflow-hidden backdrop-blur-sm p-8 md:p-12">
              <h2 className="text-2xl font-bold text-[#2ECC71] mb-8 flex items-center gap-3">
                <div className="w-2 h-8 bg-[#2ECC71] rounded-full" />
                Gallery
              </h2>
              <div
                className={`grid gap-4 ${
                  images.length === 2
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {images.map((image, imgIdx) => (
                  <motion.div
                    key={imgIdx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: imgIdx * 0.1 }}
                    className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-[0_0_30px_0_rgba(46,204,113,0.4)] transition-all cursor-pointer"
                    onClick={() => setCurrentImageIndex(imgIdx)}
                  >
                    <img
                      src={image}
                      alt={`${title} - Image ${imgIdx + 1}`}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
