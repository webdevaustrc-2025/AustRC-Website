import { useEffect } from 'react';

const BATCH_REPRESENTATIVE_FORM_URL = 'https://forms.gle/5y4Cj7LWtF38GeQP9';

/**
 * BatchRepresentativePage
 *
 * Immediately redirects visitors to the Batch Representative Google Form.
 * Uses window.location.replace() so the intermediate page is NOT added to
 * the browser history — hitting the back button will skip this route entirely.
 */
export function BatchRepresentativePage() {
  useEffect(() => {
    window.location.replace(BATCH_REPRESENTATIVE_FORM_URL);
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
        Redirecting to the Batch Representative form…
      </p>
      <p style={{ fontSize: '0.9rem', opacity: 0.5 }}>
        If you are not redirected automatically,{' '}
        <a href={BATCH_REPRESENTATIVE_FORM_URL} style={{ color: 'inherit', textDecoration: 'underline' }}>
          click here
        </a>
        .
      </p>
    </div>
  );
}
