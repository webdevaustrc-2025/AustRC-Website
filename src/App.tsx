<<<<<<< HEAD
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./components/HomePage";
import { ActivitiesPage } from "./components/ActivitiesPage";
import { GoverningPanelHallOfFame } from "./components/GoverningPanelHallOfFame";
import { GoverningPanelSemester } from "./components/GoverningPanelSemester";
import { ResearchProjectsPage } from "./components/ResearchProjectsPage";
import { ProjectDetailPage } from "./components/ProjectDetailPage";
import { AboutPage } from "./components/AboutPage";
import { EnthusiastAcquisitionPage } from "./components/EnthusiastAcquisitionPage";
import { DevelopersPage } from "./components/DevelopersPage";
import { Footer } from "./components/Footer";
import { CursorGlow } from "./components/CursorGlow";
=======
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { ActivitiesPage } from './components/ActivitiesPage';
import { GoverningPanelHallOfFame } from './components/GoverningPanelHallOfFame';
import { GoverningPanelSemester } from './components/GoverningPanelSemester';
import { ResearchProjectsPage } from './components/ResearchProjectsPage';
import { ProjectDetailPage } from './components/ProjectDetailPage';
import { AboutPage } from './components/AboutPage';
import { EnthusiastAcquisitionPage } from './components/EnthusiastAcquisitionPage';
import { DevelopersPage } from './components/DevelopersPage';
import { AppDownloadPage } from './components/AppDownloadPage';
import { Footer } from './components/Footer';
import { CursorGlow } from './components/CursorGlow';
>>>>>>> 3d1d9a62f43323ac0fa57532eb9bad3b3417e1f2

// Sub-Pages
import { EventsPage } from "./components/activities/EventsPage";
import { AchievementsPage } from "./components/activities/AchievementsPage";
import { SocialActivitiesPage } from "./components/activities/SocialActivitiesPage";
import { EducationalActivitiesPage } from "./components/activities/EducationalActivitiesPage";
import { EventWebsitePage } from "./components/activities/EventWebsitePage";

// ✅ Detail Pages
import { ActivityDetailPage } from "./components/activities/ActivityDetailPage";
import { EventDetailPage } from "./components/activities/EventDetailPage";

function AppContent() {
  const location = useLocation();
  const isAboutPage = location.pathname === "/about";

  // Logic to detect if we are on the new detailed page design
  const isEventDetailPage = location.pathname.startsWith("/activity/events/");

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      <CursorGlow />

      {/* Hide main Navbar if we are in the Detailed Mobile-Style view */}
      {!isEventDetailPage && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/activities/events" element={<EventsPage />} />
        <Route path="/activities/achievements" element={<AchievementsPage />} />
        <Route
          path="/activities/social-activities"
          element={<SocialActivitiesPage />}
        />
        <Route
          path="/activities/educational-activities"
          element={<EducationalActivitiesPage />}
        />
        <Route
          path="/activities/event-website"
          element={<EventWebsitePage />}
        />

        {/* ✅ THE ROUTE FOR YOUR NEW MOBILE-DESIGNED DETAIL PAGE */}
        <Route path="/activity/events/:id" element={<EventDetailPage />} />

        {/* Fallback route for other activity types */}
        <Route
          path="/activity/:category/:id"
          element={<ActivityDetailPage />}
        />

        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/enthusiast-acquisition"
          element={<EnthusiastAcquisitionPage />}
        />
        <Route path="/research-projects" element={<ResearchProjectsPage />} />
        <Route
          path="/research-projects/:projectId"
          element={<ProjectDetailPage />}
        />
        <Route
          path="/governing-panel/hall-of-fame"
          element={<GoverningPanelHallOfFame />}
        />
        <Route
          path="/governing-panel/fall-2024"
          element={<GoverningPanelSemester semester="Fall" year="2024" />}
        />
        <Route
          path="/governing-panel/spring-2024"
          element={<GoverningPanelSemester semester="Spring" year="2024" />}
        />
        <Route
          path="/governing-panel/fall-2023"
          element={<GoverningPanelSemester semester="Fall" year="2023" />}
        />
        <Route
          path="/governing-panel/spring-2023"
          element={<GoverningPanelSemester semester="Spring" year="2023" />}
        />
        <Route
          path="/governing-panel/fall-2022"
          element={<GoverningPanelSemester semester="Fall" year="2022" />}
        />
        <Route
          path="/governing-panel/spring-2022"
          element={<GoverningPanelSemester semester="Spring" year="2022" />}
        />
        <Route
          path="/governing-panel/fall-2021"
          element={<GoverningPanelSemester semester="Fall" year="2021" />}
        />
        <Route path="/developers" element={<DevelopersPage />} />
        <Route path="/get-app" element={<AppDownloadPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Hide Footer on About page and Detailed Mobile-Style view */}
      {!isAboutPage && !isEventDetailPage && <Footer theme="dark" />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
