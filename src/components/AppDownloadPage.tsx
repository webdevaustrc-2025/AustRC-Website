import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { 
  Download, 
  Smartphone, 
  Shield, 
  Zap, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  X, 
  ChevronDown,
  Star,
  Sparkles,
  Cpu,
  Wifi,
  Battery,
  Bell,
  Calendar,
  MessageSquare,
  Trophy,
  ArrowRight,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import { Button } from './ui/button';

// Floating Particle Component
const FloatingParticle = ({ delay, duration, size, left, top }: { 
  delay: number; 
  duration: number; 
  size: number; 
  left: string; 
  top: string; 
}) => (
  <motion.div
    className="absolute rounded-full bg-[#2ECC71]/30"
    style={{ width: size, height: size, left, top }}
    animate={{
      y: [-20, 20, -20],
      x: [-10, 10, -10],
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{count}{suffix}</span>;
};

// Phone Mockup Component
const PhoneMockup = ({ scale = 1 }: { scale?: number }) => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <motion.div
      initial={{ rotateY: 15, rotateX: 5 }}
      animate={{ rotateY: [-15, 15, -15], rotateX: [5, -5, 5] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000, scale }}
      className="relative"
    >
      {/* Phone Shadow */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-8 bg-[#2ECC71]/20 rounded-full blur-2xl" />
      
      {/* Phone Frame */}
      <div className="relative w-52 sm:w-60 md:w-64 h-[420px] sm:h-[480px] md:h-[520px] bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 rounded-[2.5rem] sm:rounded-[3rem] p-1.5 sm:p-2 shadow-[0_0_40px_0_rgba(46,204,113,0.2)] sm:shadow-[0_0_80px_0_rgba(46,204,113,0.3),inset_0_0_20px_0_rgba(255,255,255,0.05)]">
        {/* Phone Inner Frame */}
        <div className="relative w-full h-full bg-black rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden">
          {/* Dynamic Island */}
          <motion.div 
            className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-5 sm:h-7 bg-black rounded-full z-20 flex items-center justify-center gap-1.5 sm:gap-2"
            animate={{ width: [96, 104, 96] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 rounded-full bg-gray-800" />
            <div className="w-3 h-3 rounded-full bg-gray-800 border border-gray-700" />
          </motion.div>
          
          {/* Status Bar */}
          <div className="absolute top-3 sm:top-4 left-0 right-0 px-6 sm:px-8 flex justify-between items-center z-10">
            <span className="text-white text-[10px] sm:text-xs font-medium">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <div className="flex items-center gap-1">
              <Wifi className="w-3 h-3 text-white" />
              <Battery className="w-4 h-4 text-white" />
            </div>
          </div>
          
          {/* App Screen Content */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-black pt-10 sm:pt-14">
            {/* App Header */}
            <div className="px-3 sm:px-5 py-2 sm:py-4">
              <div className="flex items-center justify-between mb-3 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <motion.div 
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#2ECC71] to-[#27AE60] flex items-center justify-center"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </motion.div>
                  <div>
                    <span className="text-white text-xs sm:text-sm font-semibold block">AUSTRC</span>
                    <span className="text-gray-500 text-[10px] sm:text-xs">Welcome back!</span>
                  </div>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Bell className="w-5 h-5 text-[#2ECC71]" />
                </motion.div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                {[
                  { icon: Calendar, label: 'Events', value: '3' },
                  { icon: Trophy, label: 'Points', value: '850' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.2 }}
                    className="bg-gray-900/80 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-gray-800"
                  >
                    <stat.icon className="w-3 h-3 sm:w-4 sm:h-4 text-[#2ECC71] mb-0.5 sm:mb-1" />
                    <div className="text-white text-sm sm:text-lg font-bold">{stat.value}</div>
                    <div className="text-gray-500 text-[10px] sm:text-xs">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
              
              {/* Event Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-r from-[#2ECC71]/20 to-[#27AE60]/10 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-[#2ECC71]/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[#2ECC71] text-[10px] sm:text-xs font-medium">UPCOMING</span>
                    <p className="text-white text-xs sm:text-sm font-medium mt-0.5 sm:mt-1">Robo Workshop</p>
                    <p className="text-gray-400 text-[10px] sm:text-xs">Tomorrow, 3:00 PM</p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-6 h-6 sm:w-8 sm:h-8 bg-[#2ECC71] rounded-full flex items-center justify-center"
                  >
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
            
            {/* Bottom Navigation */}
            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
              <div className="bg-gray-900/90 backdrop-blur rounded-xl sm:rounded-2xl p-2 sm:p-3 flex justify-around border border-gray-800">
                {[Cpu, Calendar, MessageSquare, Users].map((Icon, i) => (
                  <motion.div
                    key={i}
                    className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${i === 0 ? 'bg-[#2ECC71]/20' : ''}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${i === 0 ? 'text-[#2ECC71]' : 'text-gray-500'}`} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export function AppDownloadPage() {
  const [isAndroid, setIsAndroid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsAndroid(/android/i.test(userAgent));
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / 50);
      mouseY.set((clientY - innerHeight / 2) / 50);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleDownload = async () => {
    if (isAndroid) {
      setIsDownloading(true);
      setDownloadProgress(0);
      
      // Simulate download progress
      const interval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsDownloading(false);
              // Trigger actual download
              const link = document.createElement('a');
              link.href = '/src/assets/APK/app-release.apk';
              link.download = 'AUSTRC-App.apk';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }, 500);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
    } else {
      setShowModal(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Optimized for blazing fast performance on all Android devices",
      gradient: "from-yellow-500/20 to-orange-500/20",
      iconBg: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Stay Connected",
      description: "Real-time updates about events, workshops, and activities",
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconBg: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Industry-standard encryption protects your data",
      gradient: "from-green-500/20 to-emerald-500/20",
      iconBg: "from-green-500 to-emerald-500"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Native Experience",
      description: "Built specifically for Android with native features",
      gradient: "from-purple-500/20 to-pink-500/20",
      iconBg: "from-purple-500 to-pink-500"
    }
  ];

  const stats = [
    { value: 500, suffix: '+', label: 'Downloads' },
    { value: 4.8, suffix: '', label: 'Rating' },
    { value: 15, suffix: 'MB', label: 'Size' },
    { value: 100, suffix: '%', label: 'Free' }
  ];

  const benefits = [
    {
      icon: Bell,
      title: "Push Notifications",
      description: "Never miss an important update or event"
    },
    {
      icon: Calendar,
      title: "Event Calendar",
      description: "View and register for upcoming events"
    },
    {
      icon: MessageSquare,
      title: "Community Chat",
      description: "Connect with fellow robotics enthusiasts"
    },
    {
      icon: Trophy,
      title: "Achievements",
      description: "Track your progress and earn badges"
    }
  ];

  return (
    <main ref={containerRef} className="relative min-h-screen bg-black overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <motion.div 
          className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#2ECC71]/10 rounded-full blur-[200px]"
          style={{ x: smoothMouseX, y: smoothMouseY }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#27AE60]/15 rounded-full blur-[180px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#2ECC71]/5 rounded-full blur-[150px]"
          animate={{
            rotate: 360,
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.3}
            duration={4 + Math.random() * 4}
            size={4 + Math.random() * 8}
            left={`${Math.random() * 100}%`}
            top={`${Math.random() * 100}%`}
          />
        ))}
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(46,204,113,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(46,204,113,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_70%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-24 pb-20">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="min-h-[auto] sm:min-h-[80vh] flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-20 py-8 sm:py-12"
        >
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-[#2ECC71]/10 border border-[#2ECC71]/30 rounded-full px-4 py-2 mb-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-[#2ECC71]" />
              </motion.div>
              <span className="text-[#2ECC71] text-sm font-medium">New Version Available</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight"
            >
              Get the
              <br />
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ECC71] via-[#27AE60] to-[#2ECC71] animate-gradient">
                  AUSTRC App
                </span>
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                />
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-400 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed"
            >
              Experience the AUST Robotics Club like never before. Stay updated, 
              connect with enthusiasts, and unlock exclusive features.
            </motion.p>

            {/* Download Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-4 mb-8"
            >
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="group relative w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-7 text-base sm:text-lg font-semibold bg-gradient-to-r from-[#2ECC71] to-[#27AE60] hover:from-[#27AE60] hover:to-[#2ECC71] text-white rounded-xl sm:rounded-2xl shadow-[0_0_30px_0_rgba(46,204,113,0.3)] sm:shadow-[0_0_40px_0_rgba(46,204,113,0.4)] hover:shadow-[0_0_60px_0_rgba(46,204,113,0.6)] transition-all duration-500 overflow-hidden"
              >
                {isDownloading ? (
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Downloading... {Math.min(Math.round(downloadProgress), 100)}%</span>
                  </div>
                ) : (
                  <>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.8 }}
                    />
                    <Download className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                    Download for Android
                  </>
                )}
                <span className="absolute -top-2 -right-2 bg-white text-[#2ECC71] text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  v2.0
                </span>
              </Button>
              
              {/* QR Code Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Scan QR Code</span>
              </motion.button>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-10"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Phone Mockup - Desktop */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex flex-shrink-0 items-center justify-center"
          >
            <PhoneMockup />
          </motion.div>
        </motion.section>
        
        {/* Mobile Phone Mockup - Shows on smaller screens below hero */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:hidden flex justify-center py-12"
        >
          <PhoneMockup scale={1} />
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="hidden sm:block absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-gray-500"
          >
            <span className="text-sm">Scroll to explore</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          className="py-20 sm:py-28 md:py-32"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-16 px-2"
          >
            <span className="text-[#2ECC71] text-xs sm:text-sm font-semibold tracking-wider uppercase">Features</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-2 sm:mt-3">
              Why You'll <span className="text-[#2ECC71]">Love</span> Our App
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-800/50 group-hover:border-[#2ECC71]/30 transition-all duration-500 h-full">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-br ${feature.iconBg} rounded-xl sm:rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-6 shadow-lg`}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          className="py-20 sm:py-28 md:py-32"
        >
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col gap-8 sm:gap-12">
              {/* Benefits List */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-6 sm:mb-10 text-center"
                >
                  <span className="text-[#2ECC71] text-xs sm:text-sm font-semibold tracking-wider uppercase">Benefits</span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-2 sm:mt-3">
                    Everything You <span className="text-[#2ECC71]">Need</span>
                  </h2>
                  <p className="text-gray-400 mt-3 sm:mt-4 text-base sm:text-lg max-w-2xl mx-auto">
                    Our app is packed with features designed to enhance your club experience.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="group flex flex-col items-center text-center p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gray-900/30 hover:bg-gray-900/50 border border-gray-800/50 hover:border-[#2ECC71]/30 transition-all duration-300"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-12 h-12 sm:w-14 sm:h-14 bg-[#2ECC71]/10 border border-[#2ECC71]/30 rounded-xl sm:rounded-2xl flex items-center justify-center text-[#2ECC71] mb-3 group-hover:bg-[#2ECC71]/20 transition-colors duration-300"
                      >
                        <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </motion.div>
                      <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">{benefit.title}</h3>
                      <p className="text-gray-500 text-xs sm:text-sm">{benefit.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Visual Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#2ECC71]/20 to-transparent rounded-2xl sm:rounded-3xl blur-3xl" />
                <div className="relative bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-xl p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-gray-800/50">
                  {/* App Store Rating */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <img 
                        src="/src/assets/logo.png" 
                        alt="AUSTRC" 
                        className="w-8 h-8 sm:w-10 sm:h-10"
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg sm:text-xl">AUSTRC App</h3>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                          >
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          </motion.div>
                        ))}
                        <span className="text-gray-400 text-sm ml-2">(4.8)</span>
                      </div>
                    </div>
                  </div>

                  {/* Feature Checks */}
                  <div className="space-y-4">
                    {[
                      "Real-time event notifications",
                      "Exclusive member resources",
                      "Workshop registration",
                      "Achievement tracking",
                      "Community forums"
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                          className="w-6 h-6 bg-[#2ECC71]/20 rounded-full flex items-center justify-center"
                        >
                          <CheckCircle className="w-4 h-4 text-[#2ECC71]" />
                        </motion.div>
                        <span className="text-gray-300">{item}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Download CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="mt-8"
                  >
                    <Button
                      onClick={handleDownload}
                      className="w-full py-6 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] hover:from-[#27AE60] hover:to-[#2ECC71] text-white font-semibold rounded-xl transition-all duration-300"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Now - It's Free
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Installation Guide Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          className="py-20 sm:py-28 md:py-32"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-12"
            >
              <span className="text-[#2ECC71] text-xs sm:text-sm font-semibold tracking-wider uppercase">Guide</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-2 sm:mt-3">
                Easy <span className="text-[#2ECC71]">Installation</span>
              </h2>
            </motion.div>

            <div className="relative">
              <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#2ECC71] via-[#2ECC71]/50 to-transparent hidden md:block" />

              <div className="space-y-4 sm:space-y-8">
                {[
                  {
                    step: 1,
                    title: "Download the APK",
                    description: "Click the download button above to get the latest version of our app"
                  },
                  {
                    step: 2,
                    title: "Enable Unknown Sources",
                    description: "Go to Settings → Security → Enable 'Install from Unknown Sources'"
                  },
                  {
                    step: 3,
                    title: "Open the APK File",
                    description: "Locate the downloaded file in your Downloads folder and tap to open"
                  },
                  {
                    step: 4,
                    title: "Install & Enjoy",
                    description: "Tap 'Install' and wait for the installation to complete. You're all set!"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="relative flex gap-3 sm:gap-6 md:gap-8"
                  >
                    {/* Step Number */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-[0_0_20px_0_rgba(46,204,113,0.3)] sm:shadow-[0_0_30px_0_rgba(46,204,113,0.4)] flex-shrink-0"
                    >
                      {item.step}
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 bg-gradient-to-r from-gray-900/80 to-black/40 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-800/50 hover:border-[#2ECC71]/30 transition-all duration-300">
                      <h3 className="text-white font-bold text-base sm:text-lg md:text-xl mb-1 sm:mb-2">{item.title}</h3>
                      <p className="text-gray-400 text-sm sm:text-base">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-8 sm:mt-12 p-4 sm:p-6 bg-[#2ECC71]/5 border border-[#2ECC71]/20 rounded-xl sm:rounded-2xl"
            >
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2ECC71]/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#2ECC71]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">100% Safe & Secure</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    This app is developed and maintained by AUST Robotics Club. It's completely safe to install 
                    and doesn't contain any malware or harmful code. We respect your privacy and only collect 
                    essential data for app functionality.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Final CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          className="py-20 sm:py-28 md:py-32"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="relative max-w-5xl mx-auto"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#2ECC71]/20 via-transparent to-[#27AE60]/20 rounded-2xl sm:rounded-3xl blur-3xl" />
            
            <div className="relative bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl p-6 sm:p-10 md:p-16 rounded-2xl sm:rounded-3xl border border-[#2ECC71]/30 text-center overflow-hidden">
              {/* Decorative Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-20 -right-20 w-40 h-40 border border-[#2ECC71]/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-20 -left-20 w-60 h-60 border border-[#2ECC71]/10 rounded-full"
              />

              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-6 sm:mb-8 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-2xl sm:rounded-3xl blur-xl opacity-50" />
                <div className="relative w-full h-full bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-[0_0_40px_0_rgba(46,204,113,0.3)] sm:shadow-[0_0_60px_0_rgba(46,204,113,0.4)]">
                  <Download className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                </div>
              </motion.div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-6 sm:mb-8">
                Join hundreds of club members who are already enjoying our app. 
                Download now and never miss an update!
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  onClick={handleDownload}
                  className="px-6 sm:px-10 py-5 sm:py-6 text-base sm:text-lg font-semibold bg-gradient-to-r from-[#2ECC71] to-[#27AE60] hover:from-[#27AE60] hover:to-[#2ECC71] text-white rounded-xl shadow-[0_0_30px_0_rgba(46,204,113,0.3)] sm:shadow-[0_0_40px_0_rgba(46,204,113,0.4)] transition-all duration-300"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Download Now
                </Button>
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="px-6 sm:px-10 py-5 sm:py-6 text-base sm:text-lg font-semibold border-gray-700 hover:border-[#2ECC71] text-white hover:bg-[#2ECC71]/10 rounded-xl transition-all duration-300"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 mr-2 text-[#2ECC71]" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 mr-2" />
                      Share Link
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2 text-gray-500 text-xs sm:text-sm">
                <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Android 7.0 and above • 15MB</span>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </div>

      {/* Modal for non-Android devices */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateX: -30 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotateX: 30 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gradient-to-b from-gray-900 to-black p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-gray-800 max-w-md w-full mx-4 shadow-[0_0_60px_0_rgba(46,204,113,0.15)] sm:shadow-[0_0_100px_0_rgba(46,204,113,0.2)]"
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-300"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>

              <div className="text-center">
                {/* Warning Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-amber-500/30"
                >
                  <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3"
                >
                  Android Only
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-400 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base"
                >
                  This app is currently available only for <span className="text-[#2ECC71] font-semibold">Android devices</span>. 
                  Open this page on your Android phone to download.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col gap-2 sm:gap-3"
                >
                  <Button
                    onClick={() => {
                      handleCopyLink();
                      setShowModal(false);
                    }}
                    className="w-full py-5 sm:py-6 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] hover:from-[#27AE60] hover:to-[#2ECC71] text-white font-semibold rounded-xl transition-all duration-300 text-sm sm:text-base"
                  >
                    <Copy className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Copy Link to Share
                  </Button>
                  <Button
                    onClick={() => setShowModal(false)}
                    variant="outline"
                    className="w-full py-5 sm:py-6 border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white rounded-xl transition-all duration-300 text-sm sm:text-base"
                  >
                    I Understand
                  </Button>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-gray-600 text-sm mt-6"
                >
                  💡 Tip: Send the link to your Android device via message or email
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient Animation Keyframes */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </main>
  );
}