import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useCachedImages } from '@/hooks/useCachedImage';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VoiceImage {
  url: string;
  key: string;
}

export function VoiceOfAUSTRCSection() {
  const [images, setImages] = useState<VoiceImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get image URLs for caching
  const imageUrls = images.map((img) => img.url).filter(Boolean);
  const cachedUrls = useCachedImages(imageUrls);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const docRef = doc(db, 'All_Data', 'Voice_of_AUSTRC');
        const docSnap = await getDoc(docRef);
        clearTimeout(timeoutId);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const fetchedImages: VoiceImage[] = [];

          // Extract all Voice_1, Voice_2, Voice_3, etc. fields
          Object.keys(data).forEach((key) => {
            if (key.startsWith('Voice_') && typeof data[key] === 'string' && data[key].trim()) {
              fetchedImages.push({
                key,
                url: data[key],
              });
            }
          });

          // Sort by number (Voice_1, Voice_2, etc.)
          fetchedImages.sort((a, b) => {
            const numA = parseInt(a.key.replace('Voice_', '')) || 0;
            const numB = parseInt(b.key.replace('Voice_', '')) || 0;
            return numA - numB;
          });

          console.log('Fetched Voice of AUSTRC images:', fetchedImages);
          setImages(fetchedImages);
        } else {
          console.warn('Voice_of_AUSTRC document not found');
          setImages([]); // Set empty array to unblock page
        }
      } catch (error) {
        console.error('Error fetching Voice of AUSTRC images:', error);
        setImages([]); // Set empty array to unblock page on error
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Auto-rotate carousel every 4 seconds
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <p className="text-gray-400">Loading Voice of AUSTRC...</p>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <p className="text-gray-400">No images available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-[#2ECC71] rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-[rgba(46,204,113,0.1)] to-[rgba(46,204,113,0.05)] rounded-full border border-[rgba(46,204,113,0.3)] mb-4">
            <span className="text-[#2ECC71] text-sm">Member Testimonials</span>
          </div>
          <h2 className="tracking-tight text-white text-5xl">Voice of AUSTRC</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-4">
            Hear from our talented members about their experiences and journey
          </p>
        </motion.div>

        {/* Single Centered Carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-[rgba(46,204,113,0.3)] shadow-[0_0_50px_0_rgba(46,204,113,0.4)]">
            {/* Main Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={cachedUrls[images[currentIndex].url] || images[currentIndex].url}
                alt={`Voice of AUSTRC - Image ${currentIndex + 1}`}
                className="w-full h-full object-cover"
                initial={{
                  opacity: 0,
                  scale: 1.1,
                  filter: 'blur(10px)',
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: 'blur(0px)',
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  filter: 'blur(10px)',
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              />
            </AnimatePresence>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

            {/* Navigation Buttons */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-300 backdrop-blur-sm border border-[rgba(46,204,113,0.3)] hover:border-[rgba(46,204,113,0.6)]"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-[#2ECC71]" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-300 backdrop-blur-sm border border-[rgba(46,204,113,0.3)] hover:border-[rgba(46,204,113,0.6)]"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-[#2ECC71]" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
              {images.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    index === currentIndex
                      ? 'bg-[#2ECC71] w-8 h-2 shadow-[0_0_10px_0_rgba(46,204,113,0.8)]'
                      : 'bg-gray-500 w-2 h-2 hover:bg-gray-400'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Image Counter */}
            <div className="absolute top-6 right-6 z-20 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm border border-[rgba(46,204,113,0.3)]">
              <span className="text-[#2ECC71] font-semibold">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
