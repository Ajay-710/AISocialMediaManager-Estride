import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export const MagneticWrapper = ({ children }) => {
  const magneticRef = useRef(null);

  useEffect(() => {
    const xTo = gsap.quickTo(magneticRef.current, 'x', { duration: 1, ease: 'elastic.out(1, 0.3)' });
    const yTo = gsap.quickTo(magneticRef.current, 'y', { duration: 1, ease: 'elastic.out(1, 0.3)' });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = magneticRef.current.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      xTo(x * 0.35);
      yTo(y * 0.35);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    const el = magneticRef.current;
    if (el) {
      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return React.cloneElement(children, { ref: magneticRef });
};

export const FadeInStagger = ({ children, staggerDelay = 0.05 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    gsap.fromTo(
      containerRef.current.children,
      { opacity: 0, y: 15, filter: 'blur(4px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: staggerDelay, ease: 'power2.out', clearProps: 'all' }
    );
  }, [children]);

  return <div ref={containerRef} style={{ display: 'inherit', flexDirection: 'inherit', gap: 'inherit', width: '100%', height: '100%' }}>{children}</div>;
};

export const GsapTitle = ({ text }) => {
  const textRef = useRef(null);
  
  useEffect(() => {
    const chars = textRef.current.querySelectorAll('.char');
    gsap.fromTo(
      chars,
      { opacity: 0, scale: 0.5, y: 10 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.02, ease: 'back.out(2)' }
    );
  }, [text]);

  return (
    <span ref={textRef} style={{ display: 'inline-block' }}>
      {text.split('').map((char, index) => (
        <span key={index} className="char" style={{ display: 'inline-block' }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};
