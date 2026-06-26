import { useEffect } from 'react';

const REGISTRATION_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSf3eZE7aSynZ383Dw5itvApNjHRWFjwE6_C0j2ai9QBQzXxAA/viewform?usp=send_form&usp=embed_facebook';

/**
 * RegistrationPage
 *
 * Immediately redirects visitors to the General Member Recruitment Google Form.
 * Uses window.location.replace() so the intermediate page is NOT added to
 * the browser history — hitting the back button will skip this route entirely.
 */
export function RegistrationPage() {
  useEffect(() => {
    window.location.replace(REGISTRATION_FORM_URL);
  }, []);

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
        Redirecting to the General Member Recruitment form…
      </p>
      <p style={{ fontSize: '0.9rem', opacity: 0.5 }}>
        If you are not redirected automatically,{' '}
        <a href={REGISTRATION_FORM_URL} style={{ color: 'inherit', textDecoration: 'underline' }}>
          click here
        </a>
        .
      </p>
    </div>
  );
}
