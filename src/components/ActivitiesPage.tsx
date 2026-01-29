import { EventsSection } from './EventsSection';
import { EducationalProgramsSection } from './EducationalProgramsSection';

import { motion } from 'motion/react';

export function ActivitiesPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24">
      {/* Hero / Header Section can be added here if needed, 
          but usually these sections have their own headers or we can add a global one */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div id="events">
          <EventsSection />
        </div>

        <div id="educational-activities">
          <EducationalProgramsSection />
        </div>
      </motion.div>
    </div>
  );
}