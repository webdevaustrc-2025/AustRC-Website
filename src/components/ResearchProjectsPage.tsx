import { motion, useScroll } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/config/firebase";
import { MANUAL_PROJECTS, ProjectSection, ProjectData } from "./ProjectData";
import { slugify } from "@/utils/slugify";
import { useTokens } from '@/tokens/useTokens';

// Hero Section Background
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

// Scroll progress indicator
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

export default function ResearchProjectsPage() {
  const t = useTokens();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  // Convert Firebase data to ProjectData format (exactly like ResearchProjectsHomepageSection)
  const convertFirebaseToProjectData = (firebaseData: any): ProjectData => {
    // Get team members from Owner fields
    const teamMembers = [];
    for (let i = 1; i <= 4; i++) {
      const nameKey = `Owner_${i}_Name`;
      const designationKey = `Owner_${i}_Designation_Department`;
      const name = firebaseData[nameKey];
      const designation = firebaseData[designationKey];
      if (name) {
        teamMembers.push({
          name,
          designation: designation || "",
          role: i === 1 ? "Project Lead" : "Team Member",
        });
      }
    }

    // Get carousel images - Cover_Picture first, then Image_1, Image_2, etc.
    const carouselImages = [];
    if (firebaseData.Cover_Picture) {
      carouselImages.push(firebaseData.Cover_Picture);
    }

    // Extract dynamic sections with flexible naming
    const sections: ProjectSection[] = [];

    // Check for sections up to Section_100 (to be safe)
    for (let i = 1; i <= 100; i++) {
      const sectionName = firebaseData[`Section_${i}_Name`];
      const sectionDescription = firebaseData[`Section_${i}_Description`];

      // Collect images for this section
      const sectionImages: string[] = [];
      for (let j = 1; j <= 50; j++) {
        const imgKey = `Section_${i}_Image_${j}`;
        if (firebaseData[imgKey]) {
          sectionImages.push(firebaseData[imgKey]);
        }
      }
      // Only add section if it has at least name, description, or images
      if (sectionName || sectionDescription || sectionImages.length > 0) {
        sections.push({
          heading: sectionName || "",
          description: sectionDescription || "",
          images: sectionImages,
        });
      }
    }

    const projectData: ProjectData = {
      id: firebaseData.id,
      title: firebaseData.Title || firebaseData.id || "",
      coverImage: firebaseData.Cover_Picture || "",
      shortDescription:
        firebaseData.Subtitle || firebaseData.Introduction || "",
      fullDescription: firebaseData.Introduction || "",
      carouselImages:
        carouselImages.length > 0
          ? carouselImages
          : [firebaseData.Cover_Picture || ""],
      teamMembers: teamMembers,
      tags: firebaseData.Tags || [],
      order: firebaseData.Order || 0,
      pdfLink: firebaseData.PDF_Link || firebaseData.pdfLink || "",
      sections: sections,
    };

    return projectData;
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsCollection = collection(
          db,
          "All_Data",
          "Research_Projects",
          "research_projects"
        );
        const q = query(projectsCollection);
        const querySnapshot = await getDocs(q);

        const fetchedProjects: ProjectData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedProjects.push(
            convertFirebaseToProjectData({ ...data, id: doc.id })
          );
        });

        // Combine Firebase projects with manual projects
        const allProjects = [...fetchedProjects, ...MANUAL_PROJECTS].sort(
          (a, b) => (a.order || 0) - (b.order || 0)
        );

        setProjects(allProjects);
        setFilteredProjects(allProjects);
      } catch (error) {
        console.error("Error fetching research projects:", error);
        // Fallback to manual projects if Firebase fails
        setProjects(MANUAL_PROJECTS);
        setFilteredProjects(MANUAL_PROJECTS);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.shortDescription
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          project.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      setFilteredProjects(filtered);
    }
  }, [searchQuery, projects]);

  const handleProjectClick = (project: ProjectData) => {
    const projectSlug = slugify(project.title);
    navigate(`/research-projects/${projectSlug}`);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden w-full max-w-[100vw]" style={{ backgroundColor: t.pageBg }}>
      <HeroBackground />
      <ScrollProgress />
      
      {/* Glow effect - hidden on mobile for performance */}
      <div className="hidden lg:block fixed bottom-10 right-10 w-32 h-32 bg-[#2ECC71]/20 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 z-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-[rgba(46,204,113,0.1)] to-[rgba(46,204,113,0.05)] rounded-full border border-[rgba(46,204,113,0.3)] mb-6">
              <span className="text-[#2ECC71] text-sm">Innovation Hub</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight" style={{ color: t.textPrimary }}>
              Research & Projects
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: t.textSecondary }}>
              Discover groundbreaking research and innovative projects pushing
              the boundaries of robotics
            </p>
          </motion.div>
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gradient-to-r from-[rgba(46,204,113,0.05)] to-transparent border border-[rgba(46,204,113,0.3)] rounded-lg focus:outline-none focus:border-[rgba(46,204,113,0.6)] transition-all"
                style={{ color: t.textPrimary, paddingLeft: '1.25rem', paddingRight: '3.5rem', paddingTop: '1rem', paddingBottom: '1rem' }}
              />
              <button
                type="button"
                onClick={() => {
                  // Your search function here
                  console.log("Searching for:", searchQuery);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-[rgba(46,204,113,0.8)] transition-colors" style={{ color: t.textMuted }}
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-[#2ECC71] border-t-transparent rounded-full animate-spin" />
              <p className="mt-4" style={{ color: t.textSecondary }}>Loading projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-lg" style={{ color: t.textSecondary }}>No projects found</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  onClick={() => handleProjectClick(project)}
                  className="cursor-pointer"
                >
                  <Card className="group bg-gradient-to-br from-[rgba(46,204,113,0.05)] to-transparent border-[rgba(46,204,113,0.2)] hover:border-[rgba(46,204,113,0.5)] transition-all duration-300 hover:shadow-[0_0_40px_0_rgba(46,204,113,0.3)] overflow-hidden backdrop-blur-sm h-full flex flex-col">
                    <div className="relative overflow-hidden aspect-video max-h-48">
                      {project.coverImage ? (
                        <>
                          <img
                            src={project.coverImage}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2ECC71]/30 to-[#27AE60]/10">
                          <span className="text-[#2ECC71] text-center px-4">
                            {project.title}
                          </span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <div className="w-3 h-3 bg-[#2ECC71] rounded-full shadow-[0_0_20px_0_rgba(46,204,113,0.8)]" />
                      </div>
                    </div>

                    <CardContent className="p-6 space-y-4 flex-1 flex flex-col" style={{ backgroundColor: 'transparent' }}>
                      <h3 className="text-xl font-semibold group-hover:text-[#2ECC71] transition-colors line-clamp-2" style={{ color: t.textPrimary }}>
                        {project.title}
                      </h3>
                      <p className="text-sm flex-1 line-clamp-3" style={{ color: t.textSecondary }}>
                        {project.shortDescription}
                      </p>
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.tags.slice(0, 2).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-[rgba(46,204,113,0.1)] border border-[rgba(46,204,113,0.2)] rounded text-[#2ECC71] text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-[#2ECC71] font-medium text-sm">
                        <span>Learn More</span>
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export { ResearchProjectsPage };
