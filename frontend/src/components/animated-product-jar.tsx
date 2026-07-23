import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedProductJarProps {
  mainImg: string;
  openImg: string;
  alt: string;
  accentColor?: string;
  className?: string;
}

export function AnimatedProductJar({
  mainImg,
  openImg,
  alt,
  accentColor = '#2D6A4F',
  className = ''
}: AnimatedProductJarProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // If reduced motion is preferred, render the single open-jar image directly with no animation
  if (prefersReducedMotion) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <img
          src={openImg}
          alt={alt}
          className="h-full max-h-[300px] w-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)]"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial="closed"
      whileInView="open"
      viewport={{ once: false, amount: 0.35 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex items-center justify-center select-none cursor-pointer group ${className}`}
    >
      {/* Soft Ambient Glow Effect */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full blur-3xl opacity-30 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      {/* Layer 1: Closed Jar State (Gemini Closed Jar Photo) - Default Initial State */}
      <motion.img
        src={mainImg}
        alt={`${alt} Closed Jar`}
        variants={{
          closed: { opacity: 1, scale: 1, rotate: 0 },
          open: { opacity: 0, scale: 0.92, rotate: -4 }
        }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 m-auto h-full max-h-[300px] w-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)] pointer-events-none"
      />

      {/* Layer 2: Open Jar Reveal State (Branded Open Jar Photo) - Revealed After Scroll */}
      <motion.img
        src={openImg}
        alt={`${alt} Open Jar with Gummies Revealed`}
        variants={{
          closed: { opacity: 0, scale: 0.88, rotate: 5, y: 15 },
          open: { opacity: 1, scale: isHovered ? 1.05 : 1, rotate: 0, y: 0 }
        }}
        transition={{ duration: 1.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 h-full max-h-[300px] w-auto object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.2)]"
      />

      {/* Reveal Badge Indicator */}
      <motion.div
        variants={{
          closed: { opacity: 0, y: 10 },
          open: { opacity: 1, y: 0 }
        }}
        transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
        className="absolute -bottom-3 z-30 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-border/80 text-[10px] font-bold uppercase tracking-widest text-foreground/80 shadow-md flex items-center gap-1.5"
      >
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
        <span>Gummies Revealed</span>
      </motion.div>
    </motion.div>
  );
}
