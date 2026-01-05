import { motion } from 'motion/react';
import { Code2, Users, Sparkles, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import social icons from assets
import FacebookIcon from '@/assets/icons/facebook.png';
import LinkedinIcon from '@/assets/icons/linkedin.png';
import GithubIcon from '@/assets/icons/github.png';
import EmailIcon from '@/assets/icons/email.png';

// Import developer images
import AhnafAmer from '@/assets/Contributors/Ahnaf Amer.jpg';
import SaobiaIslam from '@/assets/Contributors/Saobia Islam - Saobia Islam (Tinni).png';
import SamantaIslam from '@/assets/Contributors/Samanta Islam - Samanta Islam.jpg';
import AranyHasan from '@/assets/Contributors/Arany - Arany Hasan.jpeg';
import RehnumaTarannum from '@/assets/Contributors/10000697971 - Rehnuma Tarannum Ramisha.jpg';
import ShakhawatHossain from '@/assets/Contributors/out.-01 - Shakhawat Hossain (Shoaib).jpeg';
import AsifLimon from '@/assets/Contributors/Screenshot_20250330-204933.Photos - Asif Limon.png';
import SaidulIslam from '@/assets/Contributors/04= - SAIDUL ISLAM SHEHAB.jpg';
import FahmidSiddique from '@/assets/Contributors/Fahmid_Siddique_CSE_1.1 - Fahmid Siddique Ahmed.jpg';
import FarhanaRahman from '@/assets/Contributors/IMG-20251231-WA0058 - Farhana Rahman.jpg';
import ShajedulKabir from '@/assets/Contributors/Shajedul Kabir Rafi.jpg';
import ObaidulEkram from '@/assets/Contributors/WhatsApp Image 2025-01-17 at 15.48.50 - Mohammad Obaidul Ekram Riad.jpeg';

interface Developer {
  name: string;
  role: string;
  designation: string;
  image: string;
  facebook?: string;
  linkedin?: string;
  github?: string;
  email?: string;
  isModerator?: boolean;
}

const moderator: Developer = {
  name: "Ahnaf Amer",
  role: "Director",
  designation: "Web Development Team, Fall 2024",
  image: AhnafAmer,
  facebook: "https://www.facebook.com/ahnaf.amer.96",
  linkedin: "https://www.linkedin.com/in/ahnaf-amer-085211244/",
  github: "https://github.com/Ahnaf152020",
  email: "ahnafamer15@gmail.com",
  isModerator: true
};

const developers: Developer[] = [
  {
    name: "Saobia Islam Tinni",
    role: "Assistant Director",
    designation: "Web Development Team, Fall 2024",
    image: SaobiaIslam,
    facebook: "https://www.facebook.com/share/17ssRLbmag/",
    linkedin: "https://www.linkedin.com/in/saobia-islam-1b173b284/",
    github: "https://github.com/Saobia3i",
    email: "islamsaobia@gmail.com"
  },
  {
    name: "Shajedul Kabir Rafi",
    role: "Senior Sub Executive",
    designation: "Web Development Team, Fall 2024",
    image: ShajedulKabir,
    facebook: "https://www.facebook.com/shajidul.kabir.5",
    github: "https://github.com/Rafi12234",
    email: "shajidulkabir12345@gmail.com"
  },
  {
    name: "Samanta Islam",
    role: "Senior Sub Executive",
    designation: "Web Development Team, Fall 2024",
    image: SamantaIslam,
    facebook: "https://www.facebook.com/samanta.islam.750331",
    github: "https://github.com/Samanta503",
    email: "samsamanta357@gmail.com"
  },
  {
    name: "Arany Hasan",
    role: "Deputy Executive",
    designation: "Web Development Team, Fall 2024",
    image: AranyHasan,
    facebook: "https://www.facebook.com/arany.hasan",
    linkedin: "https://www.linkedin.com/in/arany-hasan-79b910338",
    github: "https://github.com/arany677",
    email: "aranyhasan677@gmail.com"
  },
  {
    name: "Rehnuma Tarannum Ramisha",
    role: "Deputy Executive",
    designation: "Web Development Team, Fall 2024",
    image: RehnumaTarannum,
    facebook: "https://www.facebook.com/share/14QhrzCak7g/",
    linkedin: "https://www.linkedin.com/in/rehnuma-tarannum-694993285",
    github: "https://github.com/rehnuma267",
    email: "rehnuma.cse.20220204063@aust.edu"
  },
  {
    name: "Shakhawat Hossain",
    role: "Sub Executive",
    designation: "Web Development Team, Fall 2024",
    image: ShakhawatHossain,
    facebook: "https://www.facebook.com/share/17yHbyM6hj/",
    linkedin: "https://www.linkedin.com/in/shakhawat--hossain--shoaib",
    github: "https://github.com/shakhawat-hossain-shoaib",
    email: "shakhawathossainshoaib@gmail.com"
  },
  {
    name: "Asif Iqbal Limon",
    role: "Senior Sub Executive",
    designation: "Web Development Team, Fall 2024",
    image: AsifLimon,
    facebook: "https://www.facebook.com/Asiflimon17/",
    github: "https://github.com/neoFlare19",
    email: "limonasif90@gmail.com"
  },
  {
    name: "Saidul Islam Shehab",
    role: "Sub Executive",
    designation: "Web Development Team, Fall 2024",
    image: SaidulIslam,
    facebook: "https://www.facebook.com/saidul.islam.shehab.me",
    github: "https://github.com/saidulislamshehab",
    email: "saidulislamshehab@gmail.com"
  },
  {
    name: "Fahmid Siddique Ahmed",
    role: "Sub Executive",
    designation: "Web Development Team, Fall 2024",
    image: FahmidSiddique,
    facebook: "http://facebook.com/patrick.hohenhiem",
    linkedin: "http://linkedin.com/in/fahmid-siddique-83201b231",
    github: "http://github.com/itsFahmid",
    email: "fahmid.cse.20230104046@aust.edu"
  },
  {
    name: "Farhana Rahman",
    role: "Sub Executive",
    designation: "Web Development Team, Fall 2024",
    image: FarhanaRahman,
    facebook: "https://www.facebook.com/share/1BvnuR2PdZ/",
    linkedin: "https://www.linkedin.com/in/farhana-rahman-9852a6268/",
    github: "https://github.com/Farhana7321",
    email: "farhanarahman736@gmail.com"
  },
  {
    name: "Mohammad Obaidul Ekram Riad",
    role: "Sub Executive",
    designation: "Web Development Team, Fall 2024",
    image: ObaidulEkram,
    facebook: "https://www.facebook.com/obaidul.ekram",
    linkedin: "https://www.linkedin.com/in/mohammad-obaidul-ekram-riad-4245b61b2/",
    github: "https://github.com/riadekram410",
    email: "riadekram410@gmail.com"
  }
];

const SocialLink = ({ href, icon, label }: { href?: string; icon: string; label: string }) => {
  if (!href) return null;
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-11 h-11 bg-[rgba(46,204,113,0.1)] border border-[rgba(46,204,113,0.3)] rounded-full flex items-center justify-center hover:bg-[#2ECC71] hover:border-[#2ECC71] hover:shadow-[0_0_20px_rgba(46,204,113,0.5)] transition-all duration-300"
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <img src={icon} alt={label} className="w-5 h-5 object-contain" />
    </motion.a>
  );
};

const DeveloperCard = ({ developer, index }: { developer: Developer; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative bg-gradient-to-br from-[rgba(46,204,113,0.05)] to-transparent border border-[rgba(46,204,113,0.2)] rounded-2xl p-6 backdrop-blur-sm hover:border-[rgba(46,204,113,0.5)] transition-all duration-500 hover:shadow-[0_0_40px_rgba(46,204,113,0.15)] overflow-hidden">
        {/* Animated gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(46,204,113,0.1)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Glowing orb effect */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 bg-[#2ECC71] rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        />
        
        <div className="relative z-10">
          {/* Profile Image */}
          <div className="relative mx-auto w-28 aspect-square mb-4">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-full blur-md opacity-50 group-hover:opacity-80 transition-opacity duration-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative w-full h-full aspect-square rounded-full overflow-hidden border-2 border-[rgba(46,204,113,0.5)] group-hover:border-[#2ECC71] transition-colors duration-500">
              {developer.image ? (
                <img
                  src={developer.image}
                  alt={developer.name}
                  className="w-full h-full object-cover aspect-square group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full aspect-square bg-gradient-to-br from-[rgba(46,204,113,0.3)] to-[rgba(39,174,96,0.3)] flex items-center justify-center">
                  <span className="text-3xl font-bold text-[#2ECC71]">
                    {developer.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Name and Role */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-[#2ECC71] transition-colors duration-300">
              {developer.name}
            </h3>
            <p className="text-[#2ECC71] text-sm font-medium mb-1">{developer.role}</p>
            <p className="text-gray-500 text-xs">{developer.designation}</p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-2">
            <SocialLink href={developer.facebook} icon={FacebookIcon} label="Facebook" />
            <SocialLink href={developer.linkedin} icon={LinkedinIcon} label="LinkedIn" />
            <SocialLink href={developer.github} icon={GithubIcon} label="GitHub" />
            {developer.email && (
              <SocialLink href={`mailto:${developer.email}`} icon={EmailIcon} label="Email" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ModeratorCard = ({ developer }: { developer: Developer }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, type: "spring" }}
      className="group relative max-w-xl mx-auto"
    >
      {/* Premium glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#2ECC71] via-[#27AE60] to-[#2ECC71] rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
      
      <div className="relative bg-gradient-to-br from-[rgba(46,204,113,0.15)] via-[rgba(46,204,113,0.05)] to-[rgba(0,0,0,0.5)] border border-[rgba(46,204,113,0.4)] rounded-3xl p-8 backdrop-blur-md hover:border-[#2ECC71] transition-all duration-500">
        {/* Moderator badge */}
        <motion.div
          className="absolute top-4 right-4 flex items-center gap-1.5 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] px-3 py-1.5 rounded-full z-20"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-3.5 h-3.5 text-black" />
          <span className="text-xs font-bold text-black tracking-wide">MODERATOR</span>
        </motion.div>

        <div className="relative z-10 flex flex-col items-center text-center pt-4">
          {/* Profile Image Container */}
          <div className="relative mb-6">
            {/* Rotating glow ring */}
            <motion.div
              className="absolute -inset-3 rounded-full opacity-60"
              style={{
                background: 'linear-gradient(90deg, #2ECC71, #27AE60, #2ECC71)',
                filter: 'blur(12px)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Image wrapper with fixed dimensions */}
            <div 
              className="relative rounded-full overflow-hidden border-[3px] border-[#2ECC71] shadow-[0_0_30px_rgba(46,204,113,0.4)]"
              style={{ width: '240px', height: '240px' }}
            >
              <img
                src={developer.image}
                alt={developer.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                style={{ width: '240px', height: '240px' }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white group-hover:text-[#2ECC71] transition-colors duration-300">
              {developer.name}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <Code2 className="w-4 h-4 text-[#2ECC71]" />
              <p className="text-[#2ECC71] font-semibold">{developer.role}</p>
            </div>
            <p className="text-gray-400 text-sm">{developer.designation}</p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4 mt-6">
            <SocialLink href={developer.facebook} icon={FacebookIcon} label="Facebook" />
            <SocialLink href={developer.linkedin} icon={LinkedinIcon} label="LinkedIn" />
            <SocialLink href={developer.github} icon={GithubIcon} label="GitHub" />
            {developer.email && (
              <SocialLink href={`mailto:${developer.email}`} icon={EmailIcon} label="Email" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export function DevelopersPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
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

      <div className="relative z-10 container mx-auto px-4 py-24">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#2ECC71] transition-colors duration-300 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Home</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-[rgba(46,204,113,0.1)] border border-[rgba(46,204,113,0.3)] rounded-full px-4 py-2 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Users className="w-4 h-4 text-[#2ECC71]" />
            <span className="text-[#2ECC71] text-sm font-medium">The Team Behind The Magic</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-white">Meet Our </span>
            <span className="bg-gradient-to-r from-[#2ECC71] to-[#27AE60] bg-clip-text text-transparent">
              Developers
            </span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            The talented individuals who brought this website to life with passion, creativity, and countless lines of code.
          </motion.p>

          {/* Decorative line */}
          <motion.div
            className="mt-8 mx-auto h-1 bg-gradient-to-r from-transparent via-[#2ECC71] to-transparent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "200px" }}
            transition={{ duration: 1, delay: 0.6 }}
          />
        </motion.div>

        {/* Moderator Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <motion.h2
            className="text-center text-2xl font-semibold text-white mb-8 flex items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#2ECC71]" />
            <Code2 className="w-5 h-5 text-[#2ECC71]" />
            Team Lead
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#2ECC71]" />
          </motion.h2>
          <ModeratorCard developer={moderator} />
        </motion.div>

        {/* Developers Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.h2
            className="text-center text-2xl font-semibold text-white mb-8 flex items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#2ECC71]" />
            <Users className="w-5 h-5 text-[#2ECC71]" />
            Development Team
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#2ECC71]" />
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {developers.map((developer, index) => (
              <DeveloperCard key={developer.name} developer={developer} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Footer Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-[rgba(46,204,113,0.05)] border border-[rgba(46,204,113,0.2)] rounded-2xl px-6 py-4">
            <Sparkles className="w-5 h-5 text-[#2ECC71]" />
            <p className="text-gray-400">
              Built with <span className="text-[#2ECC71]">♥</span> by AUSTRC Web Development Team
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
