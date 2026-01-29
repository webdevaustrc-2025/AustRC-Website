import { motion } from 'motion/react';
import { ExternalLink, ChevronRight } from 'lucide-react';

// Floating Particles Component
const FloatingParticles = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-[#2ECC71]"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Animated Grid Lines
const GridLines = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      <svg className="w-full h-full">
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#2ECC71" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2ECC71] to-transparent opacity-20"
        style={{ height: '2px' }}
        animate={{ y: ['-100%', '100vh'] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export function EventWebsitePage() {
  const projects = [
    {
      id: 1,
      title: "Robomania 2.0",
      description: `Robomania 2.0 is an exciting intra-university robotics competition organized by AUST Robotics Club, bringing together engineering students to showcase innovative robotic designs, AI algorithms, and automation projects in intense head-to-head battles.

Our team built a fully responsive MERN stack website that presents all event details in a clean, modern interface, including category-wise information, rules, registration links, schedules, and FAQs to guide participants smoothly through the entire process. It highlights prize pools, eligibility criteria, and important updates so teams can prepare effectively and stay informed before and during the event.

This solution elevated the intra-event experience, streamlining operations and providing an engaging digital hub for all participants.`,
      link: "https://www.robomania.austrc.com/",
      imageColor: "from-[#2ECC71]/20 to-[#2ECC71]/5"
    },
    {
      id: 2,
      title: "Aust Rover Challenge 2.0",
      description: `AUST Rover Challenge 2.0 (ARC 2.0) is a prestigious National rover competition hosted by AUST Robotics Club, challenging teams to design autonomous rovers for complex terrain navigation, obstacle avoidance, and mission-critical tasks.

The event website was expertly built on WordPress by our website team.

This professional platform features seamless participant registration, detailed challenge rules, team dashboards, live event schedules, and multimedia galleries showcasing rover prototypes and competition highlights.

Our collaborative development ensured zero downtime and smooth user experience for hundreds of engineering students competing in this flagship AUST robotics showcase.`,
      link: "https://arc.austrc.com/",
      imageColor: "from-[#2ECC71]/20 to-[#2ECC71]/5"
    },
    {
      id: 3,
      title: "Robotics Bootcamp 101",
      description: `Robotics Bootcamp 101 is a flagship intra-university training program by AUST Robotics Club, designed to develop strong foundations in robotics, electronics, and 3D design through a structured, hands-on curriculum. The WordPress-powered official website serves as a central hub where students can explore the different wings of the bootcamp, understand learning outcomes, and get a clear overview of how the bootcamp bridges theoretical knowledge with practical robotics projects.

The platform is crafted to be clean, responsive, and student-friendly, ensuring that visitors can quickly grasp what each wing offers such as basic robotics, bot design and programming, and 3D design and modeling and decide which track aligns with their interests. With well-organized sections, clear content hierarchy, and easy navigation, the site effectively communicates the bootcamp's vision of nurturing future roboticists within AUST.

The website was led and significantly developed by Khorshed Alam Khairul, whose contribution helped shape it into a polished, reliable WordPress portal for the bootcamp.`,
      link: "https://bootcamp.austrc.com/",
      imageColor: "from-[#2ECC71]/20 to-[#2ECC71]/5"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background - Same as AboutPage */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[rgba(46,204,113,0.1)] via-transparent to-[rgba(46,204,113,0.1)] blur-3xl"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Large gradient orbs */}
        <motion.div
          className="absolute top-20 -left-40 w-[500px] h-[500px] bg-[#2ECC71] rounded-full blur-[150px] opacity-20"
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 -right-40 w-[600px] h-[600px] bg-[#27AE60] rounded-full blur-[150px] opacity-20"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.15, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-full blur-[120px] opacity-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Additional Animated Elements */}
      <FloatingParticles />
      <GridLines />

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 relative"
          >
            {/* Animated glow behind title */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#2ECC71] rounded-full blur-[80px] opacity-20"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white relative z-10">
              Our <span className="text-[#2ECC71]">Websites</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto relative z-10">
              Explore the official websites developed for AUST Robotics Club’s flagship competitions. These platforms highlight our team’s work in building modern, user-friendly interfaces to support large-scale events and participant engagement.
            </p>
            
            {/* Decorative line */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <motion.div
                className="h-1 bg-gradient-to-r from-transparent via-[#2ECC71] to-transparent rounded-full"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 80, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <ChevronRight className="w-6 h-6 text-[#2ECC71] rotate-90" />
              </motion.div>
              <motion.div
                className="h-1 bg-gradient-to-r from-transparent via-[#2ECC71] to-transparent rounded-full"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 80, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Projects List */}
          <div className="space-y-16">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {/* Background Glow */}
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-transparent via-[#2ECC71]/5 to-transparent rounded-3xl blur-xl opacity-50"
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
                />

                <div className="relative bg-[#0a1810]/80 backdrop-blur-sm border border-[#2ECC71]/30 rounded-3xl p-6 sm:p-8 overflow-hidden group">
                  {/* Floating particles on hover */}
                  <div className="absolute inset-0 overflow-hidden rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-[#2ECC71] rounded-full"
                        initial={{ x: Math.random() * 400, y: 300 }}
                        animate={{ y: -20, opacity: [0, 1, 0] }}
                        transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
                      />
                    ))}
                  </div>
                  
                  {/* Animated border scan line */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{
                      background: 'conic-gradient(from 0deg, transparent, #2ECC71, transparent)',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.1 }}
                  />

                  {/* Project Title (Clickable) */}
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/title block mb-8 relative z-10"
                  >
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="p-3 bg-gradient-to-br from-[#2ECC71]/20 to-[#2ECC71]/5 rounded-2xl border border-[#2ECC71]/30 group-hover/title:from-[#2ECC71]/30 group-hover/title:to-[#2ECC71]/10 transition-all"
                        whileHover={{ rotate: 5, scale: 1.05 }}
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-[#2ECC71] to-emerald-400 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(46,204,113,0.5)]">
                          <motion.span 
                            className="font-bold text-black"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                          >
                            {project.id}
                          </motion.span>
                        </div>
                      </motion.div>
                      <div className="flex-1">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white group-hover/title:text-[#2ECC71] transition-colors duration-300">
                          {project.title}
                          <ChevronRight className="inline-block ml-3 w-6 h-6 opacity-0 group-hover/title:opacity-100 transform group-hover/title:translate-x-1 transition-all duration-300" />
                        </h2>
                        <motion.div 
                          className="w-20 h-1 bg-gradient-to-r from-[#2ECC71] to-transparent rounded-full mt-2"
                          initial={{ width: 0 }}
                          whileInView={{ width: 80 }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>
                  </a>

                  {/* Content Grid: Description + Website Preview */}
                  <div className="grid lg:grid-cols-2 gap-8 mb-8 relative z-10">
                    {/* Description Box */}
                    <div className="flex flex-col">
                      <motion.div 
                        className="bg-[#0f1f15]/80 backdrop-blur-sm border border-[#2ECC71]/20 rounded-2xl p-6 hover:border-[#2ECC71]/40 transition-all duration-300 h-full flex flex-col flex-1"
                        whileHover={{ y: -5 }}
                      >
                        <h3 className="text-lg font-bold text-[#2ECC71] mb-4">About the Project</h3>
                        <div className="flex-1 overflow-y-auto pr-2">
                          <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                            {project.description}
                          </p>
                        </div>
                      </motion.div>
                    </div>

                    {/* Website Preview with iframe */}
                    <div className="flex flex-col">
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-[#2ECC71]/20 to-transparent rounded-2xl blur-xl"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      <motion.div 
                        className={`relative bg-gradient-to-br ${project.imageColor} border border-[#2ECC71]/30 rounded-2xl overflow-hidden group/image flex flex-col flex-1`}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Actual Website Embed */}
                        <div className="flex-1 flex flex-col m-4 rounded-xl overflow-hidden bg-black/50 border border-[#2ECC71]/20">
                          {/* Mock Browser Bar */}
                          <div className="bg-[#0a1810] border-b border-[#2ECC71]/20 p-3 flex items-center gap-2 flex-shrink-0">
                            <motion.div 
                              className="w-3 h-3 rounded-full bg-red-500/50"
                              whileHover={{ scale: 1.3 }}
                            />
                            <motion.div 
                              className="w-3 h-3 rounded-full bg-yellow-500/50"
                              whileHover={{ scale: 1.3 }}
                            />
                            <motion.div 
                              className="w-3 h-3 rounded-full bg-[#2ECC71]/50"
                              whileHover={{ scale: 1.3 }}
                            />
                            <div className="flex-1 bg-[#0f1f15] h-6 rounded ml-4 border border-[#2ECC71]/10 px-3 flex items-center">
                              <span className="text-xs text-gray-400 truncate">{project.link}</span>
                            </div>
                          </div>
                          
                          {/* Actual Website iframe */}
                          <div className="flex-1">
                            <iframe
                              src={project.link}
                              title={`${project.title} Preview`}
                              className="w-full h-full border-0"
                              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                        
                        {/* Glowing Corner */}
                        <motion.div 
                          className="absolute top-0 right-0 w-32 h-32 bg-[#2ECC71]/10 rounded-full blur-[60px]"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Explore Button */}
                  <motion.div 
                    className="text-center relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
                    viewport={{ once: true }}
                  >
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#2ECC71] to-emerald-500 text-black font-bold rounded-full hover:from-white hover:to-gray-200 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(46,204,113,0.5)] hover:shadow-[0_0_50px_rgba(46,204,113,0.8)] group/btn"
                    >
                      <motion.span
                        animate={{ x: [0, 2, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        Explore {project.title}
                      </motion.span>
                      <ExternalLink className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16 pt-8 border-t border-[#2ECC71]/10"
          >
            <p className="text-gray-500">
              All websites built with modern web technologies including the MERN stack, Next.js, and Tailwind CSS
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Organized by <span className="text-[#2ECC71]">AUST Robotics Club</span>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}