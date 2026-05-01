import { motion } from 'motion/react';
import { Zap, ArrowLeft, Trophy, ChevronDown, ChevronUp, Users, Award, Medal, Camera, Sparkles } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { slugify } from '@/utils/slugify';
import { useTokens } from '@/tokens/useTokens';

interface Headline {
  heading: string;
  description: string;
  images: string[];
}

interface Event {
  id: string;
  Event_Name: string;
  Cover_Picture: string;
  Introduction: string;
  Order: number;
  headlines: Headline[];
}

interface WinnerCategory {
  id: string;
  category: string;
  description: string;
  images: string[];
}

// Hero Background
function HeroBackground() {
  const t = useTokens();
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0" style={{ backgroundColor: t.pageBg }} />
      <div
        className="absolute top-0 left-0 w-full h-full opacity-30"
        style={{ background: 'linear-gradient(to right, rgba(46,204,113,0.1), transparent, rgba(46,204,113,0.1))', filter: 'blur(40px)' }}
      />
      <div className="hidden lg:block absolute inset-0 opacity-30 overflow-hidden">
        <div
          className="absolute top-20 -left-20 w-96 h-96 bg-[#2ECC71] rounded-full gpu-orb gpu-orb-pulse"
          style={{ filter: 'blur(100px)', '--dur': '5s' } as React.CSSProperties}
        />
        <div
          className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-[#27AE60] rounded-full gpu-orb gpu-orb-pulse-reverse"
          style={{ filter: 'blur(100px)', '--dur': '6s' } as React.CSSProperties}
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
  const t = useTokens();
  const { eventSlug } = useParams<{ eventSlug: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Winners Gallery states
  const [winnerCategories, setWinnerCategories] = useState<WinnerCategory[]>([]);
  const [showWinnersMenu, setShowWinnersMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<WinnerCategory | null>(null);
  const [loadingWinners, setLoadingWinners] = useState(false);
  
  // Refs for scrolling
  const topRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Scroll to top when component mounts or category changes
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }, [selectedCategory]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventsCollection = collection(db, 'All_Data', 'Event_Page', 'All_Events_of_RC');
        const q = query(eventsCollection, orderBy('Order', 'asc'));
        const querySnapshot = await getDocs(q);

        let foundEvent: Event | null = null;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (slugify(data.Event_Name) === eventSlug) {
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
                    `headline_${i}_image_${j}`,
                    `headline_${i}_Image_${j}`,
                    `Headline${i}_Image${j}`,
                    `Headline${i}_image${j}`,
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
                    const lowerImagePatterns = imageKeyPatterns.map((p) => p.toLowerCase());
                    const dataKeys = Object.keys(data);
                    const matchingKey = dataKeys.find((key) => {
                      const lowerKey = key.toLowerCase();
                      return lowerImagePatterns.some((pattern) => lowerKey === pattern);
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

            // Fallback: standalone images
            if (headlines.length === 0) {
              const imagePatterns = ['image', 'img', 'picture', 'photo', 'url', 'src', 'cover', 'banner', 'thumbnail'];
              const excludeFields = ['cover_picture', 'coverpicture', 'heroimage', 'hero_image'];
              const allImages: string[] = [];
              for (const key of Object.keys(data)) {
                const value = data[key];
                if (typeof value === 'string' && value.length > 10) {
                  const lowerKey = key.toLowerCase();
                  const lowerValue = value.toLowerCase();
                  if (excludeFields.includes(lowerKey)) continue;
                  const isImageKey = imagePatterns.some((p) => lowerKey.includes(p));
                  const isImageUrl = lowerValue.includes('http') || lowerValue.includes('firebase');
                  if (isImageKey && isImageUrl && !allImages.includes(value)) {
                    allImages.push(value);
                  }
                }
              }
              if (allImages.length > 0) {
                headlines.push({ heading: 'Gallery', description: '', images: allImages });
              }
            }

            foundEvent = {
              id: doc.id,
              Event_Name: data.Event_Name,
              Cover_Picture: data.Cover_Picture,
              Introduction: data.Introduction,
              Order: data.Order,
              headlines,
            };
          }
        });

        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          setError('Event not found');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventSlug]);

  // Fetch winners gallery categories
  useEffect(() => {
    const fetchWinnersCategories = async () => {
      if (!event?.id) return;
      
      setLoadingWinners(true);
      try {
        const winnersCollection = collection(
          db, 
          'All_Data', 
          'Event_Page', 
          'All_Events_of_RC', 
          event.id, 
          'winnersGallery'
        );
        const snapshot = await getDocs(winnersCollection);
        
        const categories: WinnerCategory[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          
          // Try different possible field names for category
          let categoryName = '';
          if (data.category) categoryName = data.category;
          else if (data.Category) categoryName = data.Category;
          else if (data.name) categoryName = data.name;
          else if (data.title) categoryName = data.title;
          else {
            // If no category field, use document ID formatted nicely
            categoryName = doc.id
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
          }
          
          categories.push({
            id: doc.id,
            category: categoryName,
            description: data.description || data.Description || '',
            images: Array.isArray(data.images) ? data.images : []
          });
        });
        
        setWinnerCategories(categories);
      } catch (error) {
        console.error('Error fetching winners gallery:', error);
      } finally {
        setLoadingWinners(false);
      }
    };

    if (event) {
      fetchWinnersCategories();
    }
  }, [event]);

  const getCategoryIcon = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('segment')) return <Medal className="w-5 h-5" />;
    if (lower.includes('team')) return <Users className="w-5 h-5" />;
    if (lower.includes('winner of all') || lower.includes('overall')) return <Award className="w-5 h-5" />;
    return <Trophy className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: t.pageBg }}>
        <HeroBackground />
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#2ECC71]/20 border-t-[#2ECC71] rounded-full animate-spin" />
          <Zap className="w-6 h-6 text-[#2ECC71] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: t.pageBg }}>
        <HeroBackground />
        <div className="text-center z-10">
          <h1 className="text-3xl font-bold mb-4" style={{ color: t.textPrimary }}>Event Not Found</h1>
          <p className="mb-8" style={{ color: t.textSecondary }}>{error || 'The event you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/activities/events')}
            className="px-6 py-3 bg-[#2ECC71] text-black font-bold rounded-xl hover:bg-[#27AE60] transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: t.pageBg, color: t.textPrimary }}>
      <div ref={topRef} />
      <HeroBackground />

      {/* Spacer to push content below navbar */}
      <div className="h-32 md:h-40 w-full" />

      <div className="relative z-10 container mx-auto px-4 pb-24 max-w-5xl">
        {/* Back Button - Enhanced with animations */}
        <div className="w-full flex justify-start mb-8 relative z-50">
          <motion.button
            onClick={() => {
              if (selectedCategory) {
                setSelectedCategory(null);
                setShowWinnersMenu(true);
                // Scroll to top when going back
                if (topRef.current) {
                  topRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
                }
              } else {
                navigate('/activities/events');
              }
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.05, x: -4 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex items-center gap-3 px-6 py-3 text-[#2ECC71] hover:border-[#2ECC71] hover:shadow-[0_0_25px_rgba(46,204,113,0.3)] transition-all duration-300 cursor-pointer backdrop-blur-xl rounded-2xl"
          >
            <motion.div
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2ECC71]/10 group-hover:bg-[#2ECC71] transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 text-[#2ECC71] group-hover:text-black transition-colors duration-300" />
            </motion.div>
            <span className="font-semibold text-sm tracking-wide text-white/90 group-hover:text-white transition-colors duration-300">
              {selectedCategory ? 'Back to Winners Menu' : 'Back to Events'}
            </span>
          </motion.button>
        </div>

        {/* Show either event details or selected category */}
        {!selectedCategory ? (
          <>
            {/* Cover Image with enhanced animation */}
            {event.Cover_Picture && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="mb-10 sm:mb-12 flex justify-center"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-[0_0_60px_0_rgba(46,204,113,0.3)] w-full max-w-2xl group">
                  <div className="relative h-[300px]">
                    <img
                      src={event.Cover_Picture}
                      alt={event.Event_Name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#2ECC71]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Title Section with enhanced animations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-10 sm:mb-12 text-center"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[rgba(46,204,113,0.15)] to-[rgba(46,204,113,0.05)] rounded-full border border-[rgba(46,204,113,0.3)] mb-5 mx-auto"
              >
                <Zap className="w-4 h-4 text-[#2ECC71]" />
                <span className="text-[#2ECC71] text-xs sm:text-sm font-bold tracking-wider uppercase">Event</span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight" style={{ color: t.textPrimary }}>
                {event.Event_Name}
              </h1>
              <motion.div 
                className="w-20 h-1.5 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-full mt-5 mx-auto"
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </motion.div>

            {/* Content */}
            <div className="space-y-8 sm:space-y-10">
              {/* Introduction with enhanced styling */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-0.5 bg-gradient-to-r from-[#2ECC71] to-transparent rounded-full" />
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: t.textPrimary }}>Introduction</h2>
                </div>
                <div className="rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-7 border border-[#2ECC71]/10 backdrop-blur-sm hover:border-[#2ECC71]/30 transition-all duration-300" style={{ backgroundColor: t.surfaceCard }}>
                  <p className="text-sm sm:text-base lg:text-lg leading-relaxed whitespace-pre-wrap" style={{ color: t.textSecondary }}>
                    {event.Introduction}
                  </p>
                </div>
              </motion.div>

              {/* Headlines / Sections */}
              {event.headlines && event.headlines.length > 0 && (
                <div className="space-y-8 sm:space-y-10">
                  {event.headlines.map((headline, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ delay: 0.1 * idx }}
                      className="rounded-xl sm:rounded-2xl p-6 sm:p-7 lg:p-8 border border-[#2ECC71]/10 backdrop-blur-sm overflow-hidden hover:border-[#2ECC71]/30 transition-all duration-300" style={{ backgroundColor: t.surfaceCard }}
                    >
                      {/* Headline Title */}
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#2ECC71] mb-4 sm:mb-5 flex items-center gap-3">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                          className="w-2 h-2 sm:w-3 sm:h-3 bg-[#2ECC71] rounded-full"
                        />
                        {headline.heading}
                      </h3>

                      {/* Images */}
                      {headline.images && headline.images.length > 0 && (
                        <div className="mb-6 sm:mb-7">
                          {headline.images.length === 1 ? (
                            <div className="relative h-56 sm:h-72 lg:h-96 rounded-lg overflow-hidden bg-gradient-to-br from-[#2ECC71]/20 to-[#27AE60]/10 group">
                              <img
                                src={headline.images[0]}
                                alt={headline.heading}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-[#2ECC71]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-4 w-full">
                              {headline.images.map((img, imgIdx) => (
                                <div
                                  key={imgIdx}
                                  className="relative h-48 sm:h-56 lg:h-64 rounded-lg overflow-hidden bg-gradient-to-br from-[#2ECC71]/20 to-[#27AE60]/10 group"
                                >
                                  <img
                                    src={img}
                                    alt={`${headline.heading} ${imgIdx + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-r from-[#2ECC71]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Description */}
                      {headline.description && (
                        <p className="text-sm sm:text-base lg:text-lg leading-relaxed whitespace-pre-wrap" style={{ color: t.textSecondary }}>
                          {headline.description}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Winners Gallery Section - Enhanced */}
              {winnerCategories.length > 0 && (
                <div className="mt-12" ref={categoryRef}>
                  <motion.button
                    onClick={() => setShowWinnersMenu(!showWinnersMenu)}
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-[#2ECC71]/20 to-[#27AE60]/20 hover:from-[#2ECC71]/30 hover:to-[#27AE60]/30 border border-[#2ECC71]/30 rounded-2xl p-6 flex items-center justify-between transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Animated background effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#2ECC71]/10 to-transparent"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="p-3 bg-[#2ECC71]/20 rounded-xl group-hover:bg-[#2ECC71]/30 transition-colors">
                        <Trophy className="w-6 h-6 text-[#2ECC71]" />
                      </div>
                      <div className="text-left">
                        <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: t.textPrimary }}>
                          🏆 Winners Gallery
                          <Sparkles className="w-5 h-5 text-[#2ECC71] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h2>
                        <p className="text-sm" style={{ color: t.textSecondary }}>View winners and achievements</p>
                      </div>
                    </div>
                    <div className="p-2 bg-[#2ECC71]/10 rounded-full relative z-10">
                      {showWinnersMenu ? (
                        <ChevronUp className="w-5 h-5 text-[#2ECC71]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#2ECC71]" />
                      )}
                    </div>
                  </motion.button>

                  {/* Winners Categories - Enhanced with beautiful cards */}
                  {showWinnersMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5"
                    >
                      {winnerCategories.map((category, idx) => (
                        <motion.button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowWinnersMenu(false);
                          }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ scale: 1.03, y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          className="relative group overflow-hidden bg-gradient-to-br from-[#2ECC71]/10 to-[#27AE60]/5 hover:from-[#2ECC71]/20 hover:to-[#27AE60]/15 border border-[#2ECC71]/30 rounded-2xl p-6 text-left transition-all duration-300"
                        >
                          {/* Animated border effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-[#2ECC71]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          {/* Corner accent */}
                          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#2ECC71]/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-3 bg-[#2ECC71]/20 rounded-xl group-hover:bg-[#2ECC71]/30 transition-colors">
                                {getCategoryIcon(category.category)}
                              </div>
                              <h3 className="text-xl font-bold" style={{ color: t.textPrimary }}>{category.category}</h3>
                            </div>

                            {category.description && (
                              <p className="text-sm line-clamp-2 mb-4" style={{ color: t.textSecondary }}>{category.description}</p>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-[#2ECC71]">
                                <Camera className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                  {category.images.length} {category.images.length === 1 ? 'photo' : 'photos'}
                                </span>
                              </div>
                              <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="text-[#2ECC71]"
                              >
                                →
                              </motion.div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Selected Category View - Beautiful Images Grid with perfect centering */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            {/* Category Header */}
            <motion.div 
              className="flex items-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-4 bg-[#2ECC71]/20 rounded-2xl">
                {getCategoryIcon(selectedCategory.category)}
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#2ECC71]">
                  {selectedCategory.category}
                </h2>
                {selectedCategory.description && (
                  <p className="mt-2 text-lg" style={{ color: t.textSecondary }}>{selectedCategory.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2 text-[#2ECC71]">
                  <Camera className="w-4 h-4" />
                  <p className="text-sm">
                    {selectedCategory.images.length} {selectedCategory.images.length === 1 ? 'image' : 'images'} in this collection
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Beautiful Images Grid with perfect centering */}
            {selectedCategory.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 auto-rows-fr">
                {selectedCategory.images.map((img, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer border border-[#2ECC71]/20 hover:border-[#2ECC71]/50 transition-all duration-300"
                  >
                    {/* Image with overlay effect */}
                    <img
                      src={img}
                      alt={`${selectedCategory.category} ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Image+Error';
                      }}
                    />
                    
                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#2ECC71]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Image number badge */}
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-[#2ECC71]/30">
                      #{idx + 1}
                    </div>
                    
                    {/* No click functionality - images are static */}
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 rounded-2xl border border-[#2ECC71]/10" style={{ backgroundColor: t.surfaceCard }}
              >
                <Camera className="w-16 h-16 text-[#2ECC71]/30 mx-auto mb-4" />
                <p className="text-lg" style={{ color: t.textSecondary }}>No images available for this category.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}