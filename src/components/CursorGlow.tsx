import { useEffect, useRef, useState } from 'react';

export function CursorGlow() {
  const outerGlowRef = useRef<HTMLDivElement>(null);
  const innerGlowRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(() => {
    if (typeof window === 'undefined') return false;
    // Check via media query (most reliable — true pointer means mouse/trackpad)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return true;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isNarrow = window.innerWidth < 1024;
    return hasTouch && isNarrow;
  });

  useEffect(() => {
    // If a touch event ever fires, permanently disable glow
    const disableOnTouch = () => setIsTouchDevice(true);
    window.addEventListener('touchstart', disableOnTouch, { once: true });
    return () => window.removeEventListener('touchstart', disableOnTouch);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (outerGlowRef.current) {
        outerGlowRef.current.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
        outerGlowRef.current.style.opacity = '1';
      }
      if (innerGlowRef.current) {
        innerGlowRef.current.style.transform = `translate(${e.clientX - 100}px, ${e.clientY - 100}px)`;
        innerGlowRef.current.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      if (outerGlowRef.current) outerGlowRef.current.style.opacity = '0';
      if (innerGlowRef.current) innerGlowRef.current.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Main glow circle */}
      <div
        ref={outerGlowRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: 0,
          willChange: 'transform',
        }}
      >
        <div
          style={{
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(46, 204, 113, 0.25) 0%, rgba(46, 204, 113, 0.1) 30%, rgba(46, 204, 113, 0.03) 50%, transparent 70%)',
            filter: 'blur(2px)',
          }}
        />
      </div>

      {/* Inner bright glow */}
      <div
        ref={innerGlowRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: 0,
          willChange: 'transform',
        }}
      >
        <div
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(46, 204, 113, 0.35) 0%, rgba(46, 204, 113, 0.15) 40%, transparent 70%)',
            filter: 'blur(1px)',
          }}
        />
      </div>
    </>
  );
}
