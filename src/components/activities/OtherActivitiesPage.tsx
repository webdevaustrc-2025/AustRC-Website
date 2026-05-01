import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { slugify } from '@/utils/slugify';
import { useTokens } from '@/tokens/useTokens';

interface OtherActivity {
  id: string;
  Name: string;
  Image: string;
  Description: string;
  Order: number;
}

const HeroBackground = () => {
  const t = useTokens();
  return (
    <>
      <div className="absolute inset-0" style={{ backgroundColor: t.pageBg }} />
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

const ActivityCard = ({ item, index }: { item: OtherActivity; index: number }) => {
  const t = useTokens();
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        onClick={() => navigate(`/activities/other-activities/${slugify(item.Name)}`)}
        className="group cursor-pointer bg-gradient-to-br from-[rgba(46,204,113,0.08)] via-[rgba(46,204,113,0.02)] to-transparent border border-[rgba(46,204,113,0.2)] hover:border-[rgba(46,204,113,0.6)] transition-all duration-500 hover:shadow-[0_0_60px_0_rgba(46,204,113,0.25)] overflow-hidden backdrop-blur-sm flex flex-col h-full relative rounded-2xl"
      >
        {/* Animated border shine */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(46,204,113,0.1), transparent)' }}
          animate={isHovered ? { x: ['-100%', '100%'] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* Image */}
        <div className="relative overflow-hidden h-64" style={{ backgroundColor: t.pageBg }}>
          {item.Image ? (
            <>
              <img
                src={item.Image}
                alt={item.Name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(46,204,113,0.1)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2ECC71]/20 to-[#27AE60]/5">
              <Sparkles className="w-20 h-20 text-[#2ECC71]/50" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 flex-1 flex flex-col relative" style={{ backgroundColor: t.surfaceCardHover }}>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight group-hover:text-[#2ECC71] transition-colors duration-300" style={{ color: t.textPrimary }}>
            {item.Name}
          </h3>
          <p
            className="text-sm leading-relaxed flex-1"
            style={{ color: t.textSecondary, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {item.Description}
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full relative overflow-hidden bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white transition-all duration-300 px-5 py-3 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 shadow-[0_0_20px_0_rgba(46,204,113,0.2)] hover:shadow-[0_0_30px_0_rgba(46,204,113,0.4)] mt-4"
          >
            <span className="relative z-10">See Details</span>
            <motion.span
              className="relative z-10"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const LoadingSkeleton = () => {
  const t = useTokens();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="h-96 rounded-2xl animate-pulse border border-[rgba(46,204,113,0.1)]" style={{ backgroundColor: t.surfaceCard }} />
      ))}
    </div>
  );
};

const EmptyState = () => {
  const t = useTokens();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
      <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-[#2ECC71]/10 flex items-center justify-center">
        <Sparkles className="w-12 h-12 text-[#2ECC71]/40" />
      </div>
      <h3 className="text-2xl font-bold mb-2" style={{ color: t.textPrimary }}>No Activities Found</h3>
      <p className="max-w-md mx-auto" style={{ color: t.textSecondary }}>We're preparing amazing activities for you. Check back soon!</p>
    </motion.div>
  );
};

export function OtherActivitiesPage() {
  const t = useTokens();
  const [items, setItems] = useState<OtherActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ref = collection(db, 'All_Data', 'Other_Activities', 'other_activities');
        // Order 1 = oldest, highest Order = latest (shown first)
        const snapshot = await getDocs(query(ref, orderBy('Order', 'desc')));
        const fetched: OtherActivity[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            Name: data.Name || data.name || data.Title || data.title || 'Untitled',
            Image: data.Image_1 || data.image_1 || data.Image || data.imgUrl || '',
            Description: data.Description || data.description || 'No description provided.',
            Order: data.Order ?? 0,
          };
        });
        setItems(fetched);
      } catch (error) {
        console.error('Error fetching other activities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-24 relative overflow-hidden" style={{ backgroundColor: t.pageBg, color: t.textPrimary }}>
      <HeroBackground />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Page Header */}
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
            <span style={{ color: t.textPrimary }}>Other </span>
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ECC71] via-[#3DED97] to-[#27AE60]">
                Activities
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
                  stroke="url(#underline-gradient-other)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="underline-gradient-other" x1="0" y1="0" x2="200" y2="0">
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
            Explore the diverse range of activities organized by AUSTRC beyond our core programs — from community initiatives to special projects.
          </motion.p>
        </motion.div>

        {/* Grid */}
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <LoadingSkeleton />
          ) : items.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {items.map((item, index) => (
                <ActivityCard key={item.id} item={item} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
