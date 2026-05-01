import { motion } from 'motion/react';
import { 
  Calendar,
  ArrowRight
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { slugify } from '@/utils/slugify';
import { db } from '@/config/firebase';
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

// Hero Background
const HeroBackground = () => {
  const t = useTokens();
  return (
    <>
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
    </>
  );
};

// Page Header
const PageHeader = () => {
  const t = useTokens();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="text-center mb-12 sm:mb-16 lg:mb-20"
    >
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <span style={{ color: t.textPrimary }}>Explore All </span>
        <span className="relative">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ECC71] via-[#3DED97] to-[#27AE60]">
            Events
          </span>
          <motion.svg
            className="absolute -bottom-3 left-0 w-full"
            viewBox="0 0 200 12"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <motion.path
              d="M2 8C50 2 150 2 198 8"
              stroke="url(#underline-gradient)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="underline-gradient" x1="0" y1="0" x2="200" y2="0">
                <stop stopColor="#2ECC71" />
                <stop offset="0.5" stopColor="#3DED97" />
                <stop offset="1" stopColor="#27AE60" />
              </linearGradient>
            </defs>
          </motion.svg>
        </span>
      </motion.h1>

      <motion.p
        className="mt-6 text-base sm:text-lg max-w-3xl mx-auto px-4 leading-relaxed"
        style={{ color: t.textSecondary }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        Discover all the incredible events organized by AUSTRC. From national competitions to educational programs, explore what we have to offer.
      </motion.p>
    </motion.div>
  );
};

// Event Card Component
const EventCard = ({
  event,
  index,
  onClick,
}: {
  event: Event;
  index: number;
  onClick: () => void;
}) => {
  const t = useTokens();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.8,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      <motion.div
        className="relative h-full cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
      >
        {/* Neon Glow Effect on Hover */}
        <motion.div
          className="absolute -inset-[1px] rounded-2xl sm:rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(46,204,113,0.3), rgba(61,237,151,0.2), rgba(39,174,96,0.3))',
            backgroundSize: '300% 300%',
          }}
          animate={{ 
            opacity: isHovered ? 1 : 0.6,
            backgroundPosition: isHovered ? ['0% 0%', '100% 100%'] : '0% 0%',
          }}
          transition={{ duration: 0.4 }}
        />
        <motion.div
          className="absolute -inset-[2px] rounded-2xl sm:rounded-3xl blur-md"
          style={{
            background: 'linear-gradient(135deg, #2ECC71, #3DED97, #27AE60)',
          }}
          animate={{ opacity: isHovered ? 0.6 : 0.2 }}
          transition={{ duration: 0.4 }}
        />

        {/* Main Card */}
        <div className="relative h-full flex flex-col backdrop-blur-md rounded-2xl sm:rounded-3xl border border-[#2ECC71]/30 overflow-hidden transition-all duration-300" style={{ backgroundColor: t.surfaceCard }}>
          {/* Neon Border Glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none"
            style={{
              boxShadow: isHovered 
                ? '0 0 30px rgba(46,204,113,0.4), inset 0 0 30px rgba(46,204,113,0.15)' 
                : '0 0 15px rgba(46,204,113,0.15), inset 0 0 10px rgba(46,204,113,0.05)',
            }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#2ECC71]/50 rounded-tl-2xl sm:rounded-tl-3xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#2ECC71]/50 rounded-br-2xl sm:rounded-br-3xl" />
          
          {/* Image Section */}
          <div className="relative h-48 sm:h-56 lg:h-60 overflow-hidden">
            {event.Cover_Picture ? (
              <motion.img
                src={event.Cover_Picture}
                alt={event.Event_Name}
                className="w-full h-full object-cover"
                animate={{ scale: isHovered ? 1.08 : 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#2ECC71]/20 to-[#27AE60]/10 flex items-center justify-center">
                <Calendar className="w-16 h-16 text-[#2ECC71]/30" />
              </div>
            )}

            {/* Neon Green Overlay on Hover */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(46,204,113,0.2), transparent)',
              }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Shine Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2ECC71]/20 to-transparent -skew-x-12"
              initial={{ x: '-150%' }}
              animate={{ x: isHovered ? '150%' : '-150%' }}
              transition={{ duration: 0.7 }}
            />
          </div>

          {/* Content Section */}
          <div className="p-4 sm:p-6 flex flex-col flex-1 bg-gradient-to-t from-[#2ECC71]/5 to-transparent">
            {/* Title */}
            <motion.h3 
              className="text-lg sm:text-xl lg:text-2xl font-bold line-clamp-2 leading-snug transition-all duration-300 mb-3 sm:mb-4"
              animate={{
                color: isHovered ? '#2ECC71' : t.textPrimary,
                textShadow: isHovered ? '0 0 20px rgba(46,204,113,0.5)' : '0 0 0px rgba(46,204,113,0)',
              }}
            >
              {event.Event_Name}
            </motion.h3>

            {/* Description */}
            <p className="text-xs sm:text-sm line-clamp-3 leading-relaxed flex-1" style={{ color: t.textSecondary }}>
              {event.Introduction}
            </p>

            {/* Footer */}
            <div className="mt-auto border-t border-[#2ECC71]/20 pt-0">
              {/* See Details Button */}
              <motion.button
                onClick={onClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full relative overflow-hidden bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white transition-all duration-300 px-5 py-3 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 shadow-[0_0_20px_0_rgba(46,204,113,0.2)] hover:shadow-[0_0_30px_0_rgba(46,204,113,0.4)] mt-4"
              >
                <span className="relative z-10">See Details</span>
                <motion.span
                  className="relative z-10"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Loading Skeleton
const LoadingSkeleton = () => {
  const t = useTokens();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-3xl overflow-hidden"
          style={{ backgroundColor: t.surfaceCard, border: `1px solid ${t.borderSubtle}` }}
        >
          <div className="h-56 animate-pulse" style={{ backgroundColor: t.surfaceCardHover }} />
          <div className="p-6 space-y-4">
            <div className="h-6 rounded animate-pulse" style={{ backgroundColor: t.surfaceCardHover }} />
            <div className="h-4 rounded animate-pulse" style={{ backgroundColor: t.surfaceCardHover }} />
            <div className="h-4 w-3/4 rounded animate-pulse" style={{ backgroundColor: t.surfaceCardHover }} />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Empty State
const EmptyState = () => {
  const t = useTokens();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-24"
    >
      <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-[#2ECC71]/10 flex items-center justify-center">
        <Calendar className="w-12 h-12 text-[#2ECC71]/40" />
      </div>
      <h3 className="text-2xl font-bold mb-2" style={{ color: t.textPrimary }}>No Events Found</h3>
      <p className="max-w-md mx-auto" style={{ color: t.textSecondary }}>
        We're preparing amazing events for you. Check back soon!
      </p>
    </motion.div>
  );
};

export function EventsPage() {
  const t = useTokens();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper function to extract all images from event data
  const getAllImageURLs = (data: any): string[] => {
    const imageUrls: string[] = [];
    const dataKeys = Object.keys(data);
    
    const excludeFields = ['cover_picture', 'coverpicture', 'heroimage', 'hero_image'];
    const imagePatterns = [
      'image', 'img', 'picture', 'photo', 'url', 'src', 'cover',
      'banner', 'thumbnail', 'icon', 'graphic', 'visual', 'asset'
    ];
    
    for (const key of dataKeys) {
      const value = data[key];
      if (typeof value === 'string' && value.length > 10) {
        const lowerKey = key.toLowerCase();
        const lowerValue = value.toLowerCase();
        
        if (excludeFields.includes(lowerKey)) continue;
        
        const isImageKey = imagePatterns.some(pattern => lowerKey.includes(pattern));
        const isImageUrl = lowerValue.includes('http') || 
                          lowerValue.includes('firebase') || 
                          lowerValue.includes('blob:') ||
                          lowerValue.includes('data:image');
        
        if (isImageKey && isImageUrl) {
          if (!imageUrls.includes(value)) {
            imageUrls.push(value);
          }
        }
      }
    }
    
    return imageUrls;
  };

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(db, 'All_Data', 'Event_Page', 'All_Events_of_RC');
        const q = query(eventsCollection, orderBy('Order', 'asc'));
        const querySnapshot = await getDocs(q);

        const fetchedEvents: Event[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          const headlines: Headline[] = [];
          let headlineFound = false;
          
          for (let i = 1; i <= 10; i++) {
            const headingKey = `Headline_${i}`;
            const descriptionKey = `Headline_${i}_description`;
            const heading = data[headingKey];

            if (heading) {
              headlineFound = true;
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
                  const lowerImagePatterns = imageKeyPatterns.map(p => p.toLowerCase());
                  const dataKeys = Object.keys(data);
                  const matchingKey = dataKeys.find(key => {
                    const lowerKey = key.toLowerCase();
                    return lowerImagePatterns.some(pattern => lowerKey === pattern);
                  });
                  if (matchingKey && data[matchingKey]) {
                    images.push(data[matchingKey]);
                  }
                }
              }

              if (images.length > 0 || heading) {
                headlines.push({
                  heading,
                  description: data[descriptionKey] || '',
                  images,
                });
              }
            }
          }
          
          if (!headlineFound || headlines.length === 0) {
            const allImages = getAllImageURLs(data);
            if (allImages.length > 0) {
              headlines.push({
                heading: 'Gallery',
                description: '',
                images: allImages,
              });
            }
          }

          fetchedEvents.push({
            id: doc.id,
            Event_Name: data.Event_Name,
            Cover_Picture: data.Cover_Picture,
            Introduction: data.Introduction,
            Order: data.Order,
            headlines,
          });
        });

        fetchedEvents.sort((a, b) => a.Order - b.Order);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (event: Event) => {
    const eventSlug = slugify(event.Event_Name);
    navigate(`/activities/events/${eventSlug}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-24 relative overflow-hidden" style={{ backgroundColor: t.pageBg, color: t.textPrimary }}>
      {/* Background */}
      <HeroBackground />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Page Header */}
        <PageHeader />

        {/* Events Grid */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <LoadingSkeleton />
          ) : events.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {events.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={index}
                  onClick={() => handleEventClick(event)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}