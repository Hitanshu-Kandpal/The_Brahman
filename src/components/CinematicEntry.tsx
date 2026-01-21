import { useEffect, useRef } from 'react';

interface CinematicEntryProps {
  onScrollProgress: (scale: number) => void;
}

export function CinematicEntry({ onScrollProgress }: CinematicEntryProps) {
  const titleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !titleRef.current) return;

      const containerTop = containerRef.current.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      // When container top reaches top of viewport, start shrinking and moving
      const scrollProgress = Math.max(0, Math.min(1, -containerTop / (windowHeight * 0.5)));
      const scale = Math.max(0.3, 1 - scrollProgress * 0.7); // Shrinks to 0.3
      const opacity = Math.max(0, 1 - scrollProgress * 1.3);

      // Move up and center as we scroll
      const moveUp = Math.min(containerTop * -1, windowHeight * 0.5);

      if (titleRef.current) {
        titleRef.current.style.position = scrollProgress > 0 ? 'fixed' : 'absolute';
        titleRef.current.style.top = scrollProgress > 0 ? '0' : 'auto';
        titleRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
        titleRef.current.style.opacity = opacity.toString();
        titleRef.current.style.zIndex = scrollProgress > 0.5 ? '11' : '2';
      }

      onScrollProgress(scale);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onScrollProgress]);

  return (
    <div ref={containerRef} className="cinematic-entry">
      <div ref={titleRef} className="brahman-cinematic-title">
        BRAHMAN
      </div>
    </div>
  );
}
