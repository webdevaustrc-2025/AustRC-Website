import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { useTokens } from '@/tokens/useTokens';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { 
  Users, 
  Calendar, 
  Megaphone, 
  FlaskConical, 
  Globe, 
  Palette, 
  Video, 
  PenTool,
  CheckCircle,
  ArrowRight,
  Mail
} from 'lucide-react';

interface ReviewCardProps {
  item: Review;
  cardKey: string;
  isExpanded: boolean;
  onToggle: (key: string) => void;
}

function ReviewCard({ item, cardKey, isExpanded, onToggle }: ReviewCardProps) {
  const t = useTokens();
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isTruncatable, setIsTruncatable] = useState(false);
  const designationWithTeam = [item.designation, item.team].filter(Boolean).join(' • ');

  useEffect(() => {
    if (isExpanded) return;
    const el = textRef.current;
    if (!el) return;

    const checkTruncation = () => {
      setIsTruncatable(el.scrollHeight > el.clientHeight + 1);
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [item.experience, isExpanded]);

  return (
    <div className="review-card backdrop-blur-xl border border-[#2ECC71]/30 rounded-2xl p-5 flex flex-col gap-4 hover:border-[#2ECC71]/55 hover:shadow-[0_0_30px_0_rgba(46,204,113,0.2)] transition-all duration-300" style={{ backgroundColor: t.surfaceCard }}>
      {/* Reviewer info */}
      <div className="flex items-center gap-3">
        {item.photo ? (
          <div className="w-12 h-12 aspect-square rounded-full overflow-hidden border border-[#2ECC71]/35 flex-shrink-0 shadow-[0_0_18px_0_rgba(46,204,113,0.28)]">
            <img
              src={item.photo}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2ECC71]/35 to-[#27AE60]/35 flex items-center justify-center flex-shrink-0 border border-[#2ECC71]/35 shadow-[0_0_18px_0_rgba(46,204,113,0.25)]">
            <span className="text-[#E6FFF1] text-lg font-semibold">
              {item.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-xl leading-tight truncate" style={{ color: t.textPrimary }}>{item.name}</p>
          <p className="text-[#2ECC71] text-sm leading-tight truncate mt-0.5">{designationWithTeam}</p>
        </div>
      </div>

      {/* Experience text */}
      <div className="flex-1 flex flex-col justify-center min-h-[104px]">
        <p
          ref={textRef}
          className={`review-text text-base leading-relaxed ${isExpanded ? 'expanded' : ''}`}
          style={{ color: t.textSecondary }}
        >
          “{item.experience}”
        </p>
        {isTruncatable && (
          <button
            onClick={() => onToggle(cardKey)}
            className="text-[#2ECC71] text-xs mt-3 hover:underline focus:outline-none text-left self-start"
          >
            {isExpanded ? 'See less' : 'See more'}
          </button>
        )}
      </div>
    </div>
  );
}

interface Review {
  id: string;
  name: string;
  designation: string;
  team: string;
  experience: string;
  photo: string;
  time: string;
}

export function EnthusiastAcquisitionPage() {
  const t = useTokens();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const reviewsRef = collection(db, 'Club_review');
    const unsubscribe = onSnapshot(
      reviewsRef,
      (snapshot) => {
        const fetchedReviews: Review[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          fetchedReviews.push({
            id: doc.id,
            name: data.name || '',
            designation: data.designation || '',
            team: data.team || '',
            experience: data.experience || '',
            photo: data.photo || '',
            time: data.time || '',
          });
        });
        setReviews(fetchedReviews);
      },
      (err) => {
        console.error('Error fetching Club_review:', err);
      }
    );
    return () => unsubscribe();
  }, []);

  const midpoint = Math.ceil(reviews.length / 2);
  const upperRowReviews = reviews.slice(0, midpoint);
  const lowerRowReviews = reviews.slice(midpoint);

  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleExpand = (key: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const roles = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Administration',
      description: 'Manage club operations, coordinate activities, and ensure smooth functioning of all club initiatives.'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Event Management',
      description: 'Plan, organize, and execute engaging events, workshops, and competitions for club members and participants.'
    },
    {
      icon: <Megaphone className="w-8 h-8" />,
      title: 'Public Relations',
      description: 'Build relationships, promote club activities, and manage external communications with stakeholders.'
    },
    {
      icon: <FlaskConical className="w-8 h-8" />,
      title: 'Research & Development',
      description: 'Explore cutting-edge robotics technologies, conduct research, and develop innovative projects.'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Website Management',
      description: 'Maintain and enhance the club website, ensuring optimal user experience and functionality.'
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: 'Graphics Design',
      description: 'Create stunning visual content, posters, banners, and branding materials for club activities.'
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: 'Video Editing & Content Creation',
      description: 'Produce engaging video content, documentaries, and promotional materials for social media.'
    },
    {
      icon: <PenTool className="w-8 h-8" />,
      title: 'Content Writing',
      description: 'Write compelling articles, blog posts, and documentation to share club achievements and knowledge.'
    }
  ];



  return (
    <div className="min-h-screen pt-20" style={{ background: `linear-gradient(to bottom right, ${t.pageBg}, ${t.pageBgAlt}, ${t.pageBg})`, color: t.textPrimary }}>
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[600px] h-[600px] bg-[#2ECC71]/30 rounded-full blur-[150px] -top-48 -left-48 animate-pulse" />
          <div className="absolute w-[500px] h-[500px] bg-[#27AE60]/30 rounded-full blur-[150px] -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute w-[400px] h-[400px] bg-[#2ECC71]/20 rounded-full blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(#2ECC71 1px, transparent 1px), linear-gradient(90deg, #2ECC71 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)'
        }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block mb-6"
              >
                
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl md:text-6xl mb-6 bg-gradient-to-r from-[#2ECC71] via-green-400 to-[#2ECC71] bg-clip-text text-transparent"
              >
                Enthusiast Acquisition Program
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-2xl md:text-3xl mb-8" style={{ color: t.textSecondary }}
              >
                Sub-Executive Recruitment
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-xl mb-8 leading-relaxed" style={{ color: t.textSecondary }}
              >
                
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-lg mb-10 leading-relaxed" style={{ color: t.textSecondary }}
              >
                
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <a
                  href="https://registration.austrc.com/sub-executive/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-xl text-white text-lg hover:shadow-[0_0_40px_0_rgba(46,204,113,0.8)] transition-all hover:scale-105 group"
                >
                  Apply Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            </motion.div>

            {/* Right Image - Leaflet */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#2ECC71]/40 to-[#27AE60]/40 rounded-3xl blur-3xl group-hover:blur-[80px] transition-all" />
              <div className="relative aspect-square max-w-md mx-auto bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border-2 border-[#2ECC71]/60 rounded-3xl overflow-hidden shadow-[0_0_100px_0_rgba(46,204,113,0.5)] hover:shadow-[0_0_150px_0_rgba(46,204,113,0.8)] transition-all">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src="https://res.cloudinary.com/dxyhzgrul/image/upload/v1772144623/splash_screen_c45pxy.gif"
                    alt="AUST Robotics Club Enthusiast Acquisition Program"
                    className="w-[180%] h-[180%] object-cover object-center"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Roles & Responsibilities Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Background Effect */}
        <div className="absolute inset-0">
          <div className="absolute w-[700px] h-[700px] bg-[#2ECC71]/20 rounded-full blur-[200px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-6 bg-gradient-to-r from-[#2ECC71] via-green-400 to-[#2ECC71] bg-clip-text text-transparent">
              Sub-Executive Team Roles
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: t.textSecondary }}>
              Choose the team that matches your passion and skills. Each role offers unique opportunities for growth and impact.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#2ECC71]/30 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative backdrop-blur-xl border border-[#2ECC71]/30 rounded-2xl p-6 h-full hover:border-[#2ECC71]/60 transition-all hover:shadow-[0_0_40px_0_rgba(46,204,113,0.4)] hover:-translate-y-1 duration-300" style={{ backgroundColor: t.surfaceCard }}>
                  <div className="bg-gradient-to-br from-[#2ECC71]/20 to-transparent p-4 rounded-xl inline-block mb-4 border border-[#2ECC71]/40 group-hover:shadow-[0_0_30px_0_rgba(46,204,113,0.5)] transition-all">
                    <div className="text-[#2ECC71]">
                      {role.icon}
                    </div>
                  </div>
                  <h3 className="text-xl mb-3 group-hover:text-[#2ECC71] transition-colors" style={{ color: t.textPrimary }}>
                    {role.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: t.textSecondary }}>
                    {role.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Panel Member Reviews Section */}
      <section className="my-16 px-6 md:px-8 lg:px-12 relative overflow-hidden">
        <style>{`
          @keyframes lane-move-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0%); }
          }

          @keyframes lane-move-left {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }

          .review-card {
            width: 360px;
            min-height: 220px;
            padding: 1.25rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .review-text {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            min-height: calc(1.45em * 3);
          }

          .review-text.expanded {
            display: block;
            -webkit-line-clamp: unset;
            overflow: visible;
            min-height: 0;
          }

          .review-grid-wrap {
            max-width: 1280px;
            margin-left: auto;
            margin-right: auto;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .review-lane {
            overflow: hidden;
            -webkit-mask-image: linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%);
            mask-image: linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%);
          }

          .review-track {
            display: flex;
            align-items: stretch;
            gap: 1.5rem;
            width: max-content;
          }

          .review-track-upper {
            animation: lane-move-right 20s linear infinite;
          }

          .review-track-lower {
            animation: lane-move-left 20s linear infinite;
          }

          .review-lane:hover .review-track-upper,
          .review-lane:hover .review-track-lower {
            animation-play-state: paused;
          }

          @media (max-width: 767px) {
            .review-card {
              width: 300px;
              min-height: 205px;
            }
          }
        `}</style>

        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[700px] h-[700px] bg-[#27AE60]/15 rounded-full blur-[200px] -top-32 right-0 animate-pulse" />
          <div className="absolute w-[600px] h-[600px] bg-[#2ECC71]/15 rounded-full blur-[180px] bottom-0 -left-20 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#2ECC71]/10 border border-[#2ECC71]/40 rounded-full backdrop-blur-sm mb-5">
              <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse" />
              <span className="text-[#2ECC71] text-xs font-semibold tracking-widest uppercase">Voices of Experience</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#2ECC71] via-green-300 to-[#2ECC71] bg-clip-text text-transparent">
              Hear From Our Panel Members
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: t.textSecondary }}>
              Real experiences from those who have shaped and led AUST Robotics Club
            </p>
          </motion.div>

          {reviews.length === 0 ? (
            /* Empty / loading state */
            <div className="review-grid-wrap">
              <div className="review-lane">
                <div className="review-track">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="review-card rounded-2xl border border-[#2ECC71]/10 animate-pulse" style={{ backgroundColor: t.surfaceCard }} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="review-grid-wrap">
              {upperRowReviews.length > 0 && (
                <div className="review-lane">
                  <div className="review-track review-track-upper">
                    {[...upperRowReviews, ...upperRowReviews].map((item, i) => {
                      const cardKey = `upper-${item.id}-${i}`;
                      const isExpanded = expandedCards.has(cardKey);
                      return <ReviewCard key={cardKey} item={item} cardKey={cardKey} isExpanded={isExpanded} onToggle={toggleExpand} />;
                    })}
                  </div>
                </div>
              )}

              {lowerRowReviews.length > 0 && (
                <div className="review-lane">
                  <div className="review-track review-track-lower">
                    {[...lowerRowReviews, ...lowerRowReviews].map((item, i) => {
                      const cardKey = `lower-${item.id}-${i}`;
                      const isExpanded = expandedCards.has(cardKey);
                      return <ReviewCard key={cardKey} item={item} cardKey={cardKey} isExpanded={isExpanded} onToggle={toggleExpand} />;
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="apply" className="py-20 px-6 relative overflow-hidden">
        {/* Background Effect */}
        <div className="absolute inset-0">
          <div className="absolute w-[800px] h-[800px] bg-[#2ECC71]/30 rounded-full blur-[200px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#2ECC71]/40 to-[#27AE60]/40 rounded-3xl blur-3xl" />
            <div
              className="relative backdrop-blur-xl border-2 border-[#2ECC71]/60 rounded-3xl p-12 md:p-16 text-center shadow-[0_0_100px_0_rgba(46,204,113,0.6)]"
              style={{ background: `linear-gradient(to bottom right, ${t.surfaceCardHover}cc, ${t.pageBg}cc)` }}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-full flex items-center justify-center shadow-[0_0_60px_0_rgba(46,204,113,0.8)]"
              >
                <Users className="w-12 h-12 text-white" />
              </motion.div>

              <h2 className="text-4xl md:text-5xl mb-6 bg-gradient-to-r from-[#2ECC71] via-green-400 to-[#2ECC71] bg-clip-text text-transparent">
                Ready to Join Us?
              </h2>

              <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: t.textSecondary }}>
                Take the first step towards an exciting journey with AUST Robotics Club. Apply now and become part of our innovative community!
              </p>

              <div className="space-y-6 mb-10">
                <div className="flex items-center justify-center gap-3" style={{ color: t.textSecondary }}>
                  <CheckCircle className="w-5 h-5 text-[#2ECC71]" />
                  <span>Open to all AUST students</span>
                </div>
                <div className="flex items-center justify-center gap-3" style={{ color: t.textSecondary }}>
                  <CheckCircle className="w-5 h-5 text-[#2ECC71]" />
                  <span>No prior experience required</span>
                </div>
                <div className="flex items-center justify-center gap-3" style={{ color: t.textSecondary }}>
                  <CheckCircle className="w-5 h-5 text-[#2ECC71]" />
                  <span>Multiple team options available</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://registration.austrc.com/sub-executive/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-xl text-white text-lg hover:shadow-[0_0_60px_0_rgba(46,204,113,1)] transition-all hover:scale-105 group"
                >
                  Apply Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="mailto:austrc@aust.edu"
                  className="inline-flex items-center justify-center gap-3 px-10 py-4 border border-[#2ECC71]/50 rounded-xl text-lg hover:border-[#2ECC71] hover:shadow-[0_0_40px_0_rgba(46,204,113,0.4)] transition-all group"
                  style={{ backgroundColor: t.surfaceCard, color: t.textPrimary }}
                >
                  <Mail className="w-5 h-5" />
                  Contact Us
                </a>
              </div>

              <p className="mt-8 text-sm" style={{ color: t.textMuted }}>
                Application deadline will be announced soon. Stay tuned!
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}