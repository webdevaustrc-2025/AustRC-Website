import { motion } from 'motion/react';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { slugify } from '@/utils/slugify';

interface Headline {
  heading: string;
  description: string;
  images: string[];
}

interface EventData {
  id: string;
  Event_Name: string;
  Cover_Picture: string;
  Introduction: string;
  Order: number;
  headlines: Headline[];
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

export function EventDetailPage() {
  const { eventSlug } = useParams<{ eventSlug: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!eventSlug) {
      setError(true);
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const eventsCollection = collection(db, 'All_Data', 'Event_Page', 'All_Events_of_RC');
        const q = query(eventsCollection);
        const querySnapshot = await getDocs(q);

        let foundEvent: EventData | null = null;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const eventName = data.Event_Name || doc.id || '';
          if (slugify(eventName) === eventSlug) {
            // Extract headlines
            const headlines: Headline[] = [];
            for (let i = 1; i <= 10; i++) {
              const headingKey = `Headline_${i}`;
              const descriptionKey = `Headline_${i}_description`;
              const heading = data[headingKey];
              if (heading) {
                const images: string[] = [];
                for (let j = 1; j <= 10; j++) {
                  const imageKeyPatterns = [
                    `Headline_${i}_Image_${j}`,
                    `Headline_${i}_image_${j}`,
                    `Headline_${i}_IMG_${j}`,
                    `Headline_${i}_img_${j}`,
                  ];
                  let found = false;
                  for (const imageKey of imageKeyPatterns) {
                    if (data[imageKey]) {
                      images.push(data[imageKey]);
                      found = true;
                      break;
                    }
                  }
                  if (!found) {
                    const dataKeys = Object.keys(data);
                    const matchingKey = dataKeys.find((key) => {
                      const lowerKey = key.toLowerCase();
                      return imageKeyPatterns.some((p) => lowerKey === p.toLowerCase());
                    });
                    if (matchingKey && data[matchingKey]) {
                      images.push(data[matchingKey]);
                    }
                  }
                }
                headlines.push({
                  heading,
                  description: data[descriptionKey] || '',
                  images,
                });
              }
            }

            foundEvent = {
              id: doc.id,
              Event_Name: data.Event_Name || doc.id,
              Cover_Picture: data.Cover_Picture || '',
              Introduction: data.Introduction || '',
              Order: data.Order || 0,
              headlines,
            };
          }
        });

        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventSlug]);

  const handleBack = () => {
    navigate('/activities/events');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <HeroBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#2ECC71]/20 border-t-[#2ECC71] rounded-full animate-spin" />
          <p className="text-[#2ECC71] text-lg">Loading event...</p>
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <HeroBackground />
        <div className="relative z-10 text-center">
          <Calendar className="w-16 h-16 text-[#2ECC71]/40 mx-auto mb-4" />
          <div className="text-white text-2xl mb-6">Event not found</div>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-[#2ECC71] text-white rounded-lg font-semibold hover:bg-[#27AE60] transition-all"
          >
            Back to Events
          </button>
        </div>
      </main>
    );
  }

  // Collect all cover images for carousel
  const carouselImages = event.Cover_Picture ? [event.Cover_Picture] : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
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
        {/* Cover Image */}
        {carouselImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-[0_0_60px_0_rgba(46,204,113,0.3)]">
              <div className="aspect-video relative">
                <img
                  src={carouselImages[currentImageIndex]}
                  alt={event.Event_Name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {carouselImages.length > 1 && (
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
                      {carouselImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex ? 'bg-[#2ECC71] w-8' : 'bg-white/50 hover:bg-white/80'
                          }`}
                        />
                      ))}
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2ECC71] rounded-full mb-6">
            <Zap className="w-4 h-4 text-black" />
            <span className="text-black text-sm font-bold tracking-wider uppercase">Event</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            {event.Event_Name}
          </h1>
          <div className="w-20 h-1.5 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-full mt-6" />
        </motion.div>

        {/* Introduction */}
        {event.Introduction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12"
          >
            <div className="bg-gradient-to-br from-[rgba(46,204,113,0.05)] to-transparent border border-[rgba(46,204,113,0.2)] rounded-2xl overflow-hidden backdrop-blur-sm p-8 md:p-12">
              <h2 className="text-2xl font-bold text-[#2ECC71] mb-8 flex items-center gap-3">
                <div className="w-2 h-8 bg-[#2ECC71] rounded-full" />
                Introduction
              </h2>
              <div className="space-y-6 text-justify">
                {event.Introduction.split('\n\n').map((paragraph, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                    className="text-gray-300 leading-relaxed text-base md:text-lg"
                  >
                    {paragraph.trim()}
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Headlines / Sections */}
        {event.headlines && event.headlines.length > 0 && (
          <div className="space-y-12">
            {event.headlines.map((headline, sectionIdx) => (
              <motion.div
                key={sectionIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 + sectionIdx * 0.1 }}
              >
                <div className="bg-gradient-to-br from-[rgba(46,204,113,0.05)] to-transparent border border-[rgba(46,204,113,0.2)] rounded-2xl overflow-hidden backdrop-blur-sm p-8 md:p-12">
                  {/* Section Heading */}
                  {headline.heading && (
                    <h2 className="text-2xl font-bold text-[#2ECC71] mb-8 flex items-center gap-3">
                      <div className="w-2 h-8 bg-[#2ECC71] rounded-full" />
                      {headline.heading}
                    </h2>
                  )}

                  {/* Section Description */}
                  {headline.description && (
                    <div className="space-y-6 text-justify mb-8">
                      {headline.description.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="text-gray-300 leading-relaxed text-base md:text-lg">
                          {paragraph.trim()}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Section Images */}
                  {headline.images && headline.images.length > 0 && (
                    <div
                      className={`grid gap-4 ${
                        headline.images.length === 1
                          ? 'grid-cols-1'
                          : headline.images.length === 2
                          ? 'grid-cols-1 md:grid-cols-2'
                          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                      }`}
                    >
                      {headline.images.map((image, imgIdx) => (
                        <motion.div
                          key={imgIdx}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: imgIdx * 0.1 }}
                          className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-[0_0_30px_0_rgba(46,204,113,0.4)] transition-all"
                        >
                          <img
                            src={image}
                            alt={`${headline.heading || 'Section'} - Image ${imgIdx + 1}`}
                            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
