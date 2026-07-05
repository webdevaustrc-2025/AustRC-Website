import { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

/**
 * BootcampWingRedirectPage
 *
 * Handles the short URLs:
 *   /bootcamp/wing-1  →  Wing 01 Google Form
 *   /bootcamp/wing-2  →  Wing 02 Google Form
 *   /bootcamp/wing-3  →  Wing 03 Google Form
 *   /bootcamp/wing-4  →  Wing 04 Google Form
 *
 * Uses window.location.replace() so the redirect page is NOT added to the
 * browser history — the back button skips this route entirely.
 *
 * If the wing number is unknown, falls back to the main /bootcamp page.
 */

const WING_FORM_URLS: Record<string, string> = {
  'wing-1': 'https://forms.gle/pqVYq2gsyut8CJTf7',
  'wing-2': 'https://forms.gle/mf7WbLd3YbnL89vz5',
  'wing-3': 'https://forms.gle/cVBThKHWajzxgwkN7',
  'wing-4': 'https://forms.gle/PvEhHp86NjyPGSjT6',
};

const WING_NAMES: Record<string, string> = {
  'wing-1': 'Wing 01 — Basic Robotics & Projects',
  'wing-2': 'Wing 02 — PCB Design & Fabrication',
  'wing-3': 'Wing 03 — SOLIDWORKS Bootcamp Roadmap',
  'wing-4': 'Wing 04 — Web App Development',
};

export function BootcampWingRedirectPage() {
  const { pathname } = useLocation();
  // Extract the last path segment, e.g. "wing-1" from "/bootcamp/wing-1"
  const wingId = pathname.split('/').pop() ?? '';
  const formUrl = WING_FORM_URLS[wingId];
  const wingName = WING_NAMES[wingId];

  useEffect(() => {
    if (formUrl) {
      window.location.replace(formUrl);
    }
  }, [formUrl]);

  // Unknown wing — redirect to main bootcamp page
  if (!formUrl) {
    return <Navigate to="/bootcamp" replace />;
  }

  // Minimal fallback UI shown during the brief redirect delay
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '1rem',
        color: 'inherit',
      }}
    >
      <p style={{ fontSize: '1.1rem', opacity: 0.7 }}>
        Redirecting to the {wingName} registration form…
      </p>
      <p style={{ fontSize: '0.9rem', opacity: 0.5 }}>
        If you are not redirected automatically,{' '}
        <a href={formUrl} style={{ color: 'inherit', textDecoration: 'underline' }}>
          click here
        </a>
        .
      </p>
    </div>
  );
}
