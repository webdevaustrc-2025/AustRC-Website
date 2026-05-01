import { motion } from 'motion/react';
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useNavigate } from 'react-router-dom';
import { slugify } from '@/utils/slugify';
import { Card, CardContent } from './ui/card';
import { useTokens } from '@/tokens/useTokens';

interface OtherActivity {
  id: string;
  Name: string;
  Image: string;
  Description: string;
  Order: number;
}

const ActivityCard = ({
  item,
  index,
  onClick,
}: {
  item: OtherActivity;
  index: number;
  onClick: () => void;
}) => {
  const t = useTokens();
  const [isHovered, setIsHovered] = useState(false);

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
      <Card
        onClick={onClick}
        className="group cursor-pointer bg-gradient-to-br from-[rgba(46,204,113,0.08)] via-[rgba(46,204,113,0.02)] to-transparent border-[rgba(46,204,113,0.2)] hover:border-[rgba(46,204,113,0.6)] transition-all duration-500 hover:shadow-[0_0_60px_0_rgba(46,204,113,0.25)] overflow-hidden backdrop-blur-sm flex flex-col h-full relative"
      >
        {/* Animated border shine */}
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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
        <CardContent className="p-6 space-y-5 backdrop-blur-sm flex-1 flex flex-col relative" style={{ backgroundColor: t.surfaceCard }}>
          <div className="space-y-3">
            <motion.h3
              className="text-xl md:text-2xl font-bold tracking-tight group-hover:text-[#2ECC71] transition-colors duration-300"
              style={{ color: t.textPrimary }}
            >
              {item.Name}
            </motion.h3>
          </div>

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
            <span className="relative z-10">Explore Activity</span>
            <motion.span
              className="relative z-10"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </motion.button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export function OtherActivitiesHomepageSection() {
  const t = useTokens();
  const navigate = useNavigate();
  const [items, setItems] = useState<OtherActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const ref = collection(db, 'All_Data', 'Other_Activities', 'other_activities');
        // Fetch all, sort descending by Order (highest Order = latest = show first)
        const snapshot = await getDocs(query(ref, orderBy('Order', 'desc')));

        const fetched: OtherActivity[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            Name: data.Name || data.name || data.Title || data.title || 'Untitled',
            Image: data.Image_1 || data.image_1 || data.Image || data.imgUrl || '',
            Description: data.Description || data.description || '',
            Order: data.Order ?? 0,
          };
        });

        // Show latest 2 on homepage
        setItems(fetched.slice(0, 2));
      } catch (error) {
        console.error('Error fetching other activities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden" style={{ backgroundColor: t.pageBg }}>
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(46,204,113,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(46,204,113,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <motion.div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, rgba(46,204,113,0.12) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute -top-48 -left-48 w-96 h-96 bg-[#2ECC71]/10 rounded-full blur-[120px]" />
      <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-[#2ECC71]/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
            style={{ color: t.textPrimary }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <span style={{ color: t.textPrimary }}>Other </span>
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ECC71] to-[#27AE60]">
                Activities
              </span>
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
              />
            </span>
          </motion.h2>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-96 rounded-2xl animate-pulse border border-[rgba(46,204,113,0.1)]"
                style={{ backgroundColor: t.surfaceCard }}
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[rgba(46,204,113,0.1)] flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-[#2ECC71]" />
            </div>
            <p className="text-lg" style={{ color: t.textSecondary }}>No activities found</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {items.map((item, index) => (
              <ActivityCard
                key={item.id}
                item={item}
                index={index}
                onClick={() => navigate(`/activities/other-activities/${slugify(item.Name)}`)}
              />
            ))}
          </div>
        )}

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="flex justify-center mt-12 sm:mt-16"
        >
          <motion.button
            onClick={() => navigate('/activities/other-activities')}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="relative px-10 py-4 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-full text-white font-bold text-base transition-all duration-300 shadow-[0_0_30px_0_rgba(46,204,113,0.3)] hover:shadow-[0_0_50px_0_rgba(46,204,113,0.5)] overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              initial={{ x: '-150%' }}
              whileHover={{ x: '150%' }}
              transition={{ duration: 0.8 }}
            />
            <span className="relative inline-flex items-center gap-3">
              Explore All Activities
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.span>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
