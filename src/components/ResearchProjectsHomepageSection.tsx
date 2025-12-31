import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { ArrowRight, X, Sparkles, Users, Calendar, ExternalLink, ChevronRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Button } from './ui/button';

interface ResearchProject {
  id: string;
  Title: string;
  Cover_Picture: string;
  Introduction: string;
  Order?: number;
  Owner_1_Name?: string;
  Owner_1_Designation_Department?: string;
  Owner_2_Name?: string;
  Owner_2_Designation_Department?: string;
  Owner_3_Name?: string;
  Owner_3_Designation_Department?: string;
  Owner_4_Name?: string;
  Owner_4_Designation_Department?: string;
  [key: string]: string | number | undefined;
}

// Floating Particles Component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#2ECC71] rounded-full opacity-30"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * 600,
          }}
          animate={{
            y: [null, -100],
            opacity: [0.3, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

// Animated Grid Background
const GridBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(46,204,113,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(46,204,113,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(46,204,113,0.15) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

// 3D Tilt Card Component
const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  );
};

// Project Card Component
const ProjectCard = ({
  project,
  index,
  onClick,
  cachedImage,
}: {
  project: ResearchProject;
  index: number;
  onClick: () => void;
  cachedImage?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        type: 'spring',
        stiffness: 100,
      }}
      className="h-full"
    >
      <TiltCard className="h-full perspective-1000">
        <motion.div
          className="relative h-full cursor-pointer group"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          onClick={onClick}
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {/* Glow Effect */}
          <motion.div
            className="absolute -inset-0.5 bg-gradient-to-r from-[#2ECC71] via-[#27AE60] to-[#2ECC71] rounded-2xl opacity-0 blur-lg transition-opacity duration-500"
            animate={{ opacity: isHovered ? 0.4 : 0 }}
          />

          {/* Card Container */}
          <div className="relative h-full bg-gradient-to-br from-gray-900/90 via-black to-gray-900/90 rounded-2xl border border-[rgba(46,204,113,0.2)] overflow-hidden backdrop-blur-xl">
            {/* Animated Border */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(46,204,113,0.3), transparent)',
                }}
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
            </div>

            {/* Image Section */}
            <div className="relative h-48 sm:h-52 overflow-hidden">
              {project.Cover_Picture ? (
                <motion.img
                  src={cachedImage || project.Cover_Picture}
                  alt={project.Title}
                  className="w-full h-full object-cover"
                  animate={{
                    scale: isHovered ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#2ECC71]/20 to-[#27AE60]/5 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-[#2ECC71]/50" />
                </div>
              )}

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              {/* Status Indicator */}
              <motion.div
                className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-[rgba(46,204,113,0.3)]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2ECC71] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2ECC71]" />
                </span>
                <span className="text-[10px] sm:text-xs text-gray-300 font-medium">Active</span>
              </motion.div>

              {/* Project Number */}
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#2ECC71] to-[#27AE60] flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg shadow-[#2ECC71]/30">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>

              {/* Hover Overlay */}
              <motion.div
                className="absolute inset-0 bg-[#2ECC71]/20 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30"
                  initial={{ scale: 0 }}
                  animate={{ scale: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <ExternalLink className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </motion.div>
              </motion.div>
            </div>

            {/* Content Section */}
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              {/* Title */}
              <motion.h3
                className="text-lg sm:text-xl font-bold text-white line-clamp-2 leading-tight"
                animate={{
                  color: isHovered ? '#2ECC71' : '#ffffff',
                }}
                transition={{ duration: 0.3 }}
              >
                {project.Title}
              </motion.h3>

              {/* Description */}
              <p className="text-gray-400 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                {project.Introduction}
              </p>

              {/* Team Preview */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[...Array(Math.min(3, 4))].map((_, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-[#2ECC71]/30 to-[#27AE60]/30 border-2 border-gray-900 flex items-center justify-center"
                      >
                        <Users className="w-3 h-3 text-[#2ECC71]" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-500">Team</span>
                </div>

                {/* Arrow Button */}
                <motion.div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[rgba(46,204,113,0.1)] border border-[rgba(46,204,113,0.3)] flex items-center justify-center"
                  animate={{
                    backgroundColor: isHovered ? '#2ECC71' : 'rgba(46,204,113,0.1)',
                    borderColor: isHovered ? '#2ECC71' : 'rgba(46,204,113,0.3)',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    animate={{ x: isHovered ? 3 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight
                      className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 ${
                        isHovered ? 'text-white' : 'text-[#2ECC71]'
                      }`}
                    />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </TiltCard>
    </motion.div>
  );
};

// Main Component
export function ResearchProjectsHomepageSection() {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ResearchProject | null>(null);
  const [cachedImages, setCachedImages] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsCollection = collection(
          db,
          'All_Data',
          'Research_Projects',
          'research_projects'
        );
        const q = query(projectsCollection);
        const querySnapshot = await getDocs(q);

        const fetchedProjects: ResearchProject[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedProjects.push({
            id: doc.id,
            Title: data.Title || doc.id || '',
            Cover_Picture: data.Cover_Picture || '',
            Introduction: data.Introduction || '',
            Order: data.Order || 0,
            ...data,
          });
        });

        const topProjects = fetchedProjects
          .sort((a, b) => (a.Order || 0) - (b.Order || 0))
          .slice(0, 4);

        setProjects(topProjects);
      } catch (error) {
        console.error('Error fetching research projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  useEffect(() => {
    const cacheImages = async () => {
      const cached: { [key: string]: string } = {};
      for (const project of projects) {
        if (project.Cover_Picture) {
          try {
            const response = await fetch(project.Cover_Picture);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onload = () => {
              cached[project.id] = reader.result as string;
              if (Object.keys(cached).length === projects.length) {
                setCachedImages(cached);
              }
            };
            reader.readAsDataURL(blob);
          } catch (error) {
            cached[project.id] = project.Cover_Picture;
          }
        }
      }
    };
    if (projects.length > 0) {
      cacheImages();
    }
  }, [projects]);

  const getOwners = (project: ResearchProject) => {
    const owners = [];
    for (let i = 1; i <= 4; i++) {
      const nameKey = `Owner_${i}_Name`;
      const designationKey = `Owner_${i}_Designation_Department`;
      const name = project[nameKey];
      const designation = project[designationKey];
      if (name) {
        owners.push({
          name,
          designation: designation || '',
        });
      }
    }
    return owners;
  };

  return (
    <>
      <section
        id="research-projects-home"
        className="relative py-16 sm:py-20 lg:py-28 bg-black overflow-hidden"
      >
        {/* Background Effects */}
        <GridBackground />
        <FloatingParticles />

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#2ECC71]/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2ECC71]/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[rgba(46,204,113,0.15)] via-[rgba(46,204,113,0.1)] to-[rgba(46,204,113,0.15)] rounded-full border border-[rgba(46,204,113,0.3)] mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#2ECC71]" />
              <span className="text-[#2ECC71] text-xs sm:text-sm font-medium tracking-wide">
                Innovation & Discovery
              </span>
              <Sparkles className="w-4 h-4 text-[#2ECC71]" />
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span className="text-white">Research &</span>{' '}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ECC71] to-[#27AE60]">
                  Projects
                </span>
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                />
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Explore our cutting-edge research initiatives and innovative projects that are
              shaping the future of robotics and automation technology.
            </motion.p>

            {/* Stats Row */}
            <motion.div
              className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-8 sm:mt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {[
                { value: '15+', label: 'Active Projects' },
                { value: '50+', label: 'Researchers' },
                { value: '100+', label: 'Publications' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2ECC71]">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Projects Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 sm:h-96 bg-gray-900/50 rounded-2xl animate-pulse border border-[rgba(46,204,113,0.1)]"
                />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[rgba(46,204,113,0.1)] flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-[#2ECC71]" />
              </div>
              <p className="text-gray-400 text-lg">No research projects found</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onClick={() => setSelectedProject(project)}
                  cachedImage={cachedImages[project.id]}
                />
              ))}
            </div>
          )}

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center mt-12 sm:mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-8 sm:px-10 py-3.5 sm:py-4 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-full text-white font-semibold text-sm sm:text-base shadow-lg shadow-[#2ECC71]/30 overflow-hidden"
            >
              {/* Shine Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                initial={{ x: '-200%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.8 }}
              />

              <span className="relative flex items-center gap-3">
                Explore All Projects
                <motion.span
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20"
                  whileHover={{ x: 3 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.span>
              </span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              style={{ zIndex: 99999 }}
              onClick={() => setSelectedProject(null)}
            />

            {/* Modal Content */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 25 }}
              className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4 sm:p-6 lg:p-8"
              style={{ zIndex: 100000 }}
              onClick={() => setSelectedProject(null)}
            >
              <div
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-xl sm:rounded-2xl lg:rounded-3xl border border-[rgba(46,204,113,0.3)] shadow-2xl shadow-[#2ECC71]/10 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                  {/* Close Button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-black/90 backdrop-blur-md border border-[rgba(46,204,113,0.3)] flex items-center justify-center text-[#2ECC71] hover:bg-[#2ECC71] hover:text-white transition-colors duration-300"
                  >
                    <X className="w-4 h-4 sm:w-6 sm:h-6" />
                  </motion.button>

                  {/* Hero Image */}
                  <div className="relative h-32 sm:h-56 lg:h-72 overflow-hidden rounded-t-xl sm:rounded-t-2xl lg:rounded-t-3xl flex-shrink-0">
                    <motion.img
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8 }}
                      src={selectedProject.Cover_Picture}
                      alt={selectedProject.Title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 line-clamp-2"
                      >
                        {selectedProject.Title}
                      </motion.h2>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-full origin-left"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                    {/* About Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-[#2ECC71] mb-2 sm:mb-3 flex items-center gap-2">
                        <span className="w-6 sm:w-8 h-[2px] bg-[#2ECC71] rounded-full" />
                        About This Project
                      </h3>
                      <p className="text-gray-300 text-xs sm:text-sm lg:text-base leading-relaxed whitespace-pre-wrap">
                        {selectedProject.Introduction}
                      </p>
                    </motion.div>

                    {/* Team Section */}
                    {getOwners(selectedProject).length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-[#2ECC71] mb-3 sm:mb-4 flex items-center gap-2">
                          <span className="w-6 sm:w-8 h-[2px] bg-[#2ECC71] rounded-full" />
                          Project Team
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {getOwners(selectedProject).map((owner, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                              className="group relative bg-gradient-to-br from-[rgba(46,204,113,0.1)] to-transparent rounded-xl p-3 sm:p-4 border border-[rgba(46,204,113,0.2)] hover:border-[rgba(46,204,113,0.4)] transition-colors"
                            >
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#2ECC71]/30 to-[#27AE60]/10 flex items-center justify-center border border-[rgba(46,204,113,0.3)] flex-shrink-0">
                                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#2ECC71]" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-white font-semibold text-xs sm:text-sm lg:text-base truncate">
                                    {owner.name}
                                  </h4>
                                  <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm truncate">
                                    {owner.designation}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4 pb-2"
                    >
                      <Button
                        onClick={() => setSelectedProject(null)}
                        className="flex-1 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white hover:from-[#27AE60] hover:to-[#2ECC71] transition-all py-2.5 sm:py-3 rounded-xl font-semibold text-sm shadow-lg shadow-[#2ECC71]/20"
                      >
                        Close Project
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-[rgba(46,204,113,0.3)] text-[#2ECC71] hover:bg-[rgba(46,204,113,0.1)] py-2.5 sm:py-3 rounded-xl font-semibold text-sm"
                      >
                        Learn More
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}